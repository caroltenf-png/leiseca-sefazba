-- ═══════════════════════════════════════════════════════════════════════
-- M8: painel administrativo.
-- is_admin() + políticas de moderação + log de ações administrativas.
-- ═══════════════════════════════════════════════════════════════════════

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
     where id = auth.uid() and papel in ('admin','editor')
  );
$$;

-- Questões: admin/editor pode moderar (atualizar e excluir qualquer uma)
drop policy if exists "admin update questoes" on public.cache_questoes;
create policy "admin update questoes" on public.cache_questoes
  for update using (public.is_admin());

drop policy if exists "admin delete questoes" on public.cache_questoes;
create policy "admin delete questoes" on public.cache_questoes
  for delete using (public.is_admin());

-- Perfis: admin pode alterar papel de qualquer usuário
drop policy if exists "admin update perfis" on public.perfis;
create policy "admin update perfis" on public.perfis
  for update using (public.is_admin());

-- Log de ações administrativas (auditoria)
create table if not exists public.admin_log (
  id         uuid default gen_random_uuid() primary key,
  admin_id   uuid not null references auth.users(id) on delete cascade,
  acao       text not null,
  entidade   text,
  entidade_id text,
  detalhes   jsonb default '{}',
  criado_em  timestamptz default now()
);

alter table public.admin_log enable row level security;

drop policy if exists "admin insert log" on public.admin_log;
create policy "admin insert log" on public.admin_log
  for insert with check (public.is_admin() and auth.uid() = admin_id);

drop policy if exists "admin read log" on public.admin_log;
create policy "admin read log" on public.admin_log
  for select using (public.is_admin());

create index if not exists idx_admin_log_data on public.admin_log(criado_em desc);
