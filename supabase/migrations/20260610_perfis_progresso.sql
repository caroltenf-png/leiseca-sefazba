-- ═══════════════════════════════════════════════════════════════════════
-- FUNDAÇÃO (M0): versiona tabelas que existiam apenas no dashboard.
-- Datada ANTES de 20260617_cache.sql porque cache_* referencia perfis(id).
-- Em produção todas já existem → "if not exists" torna tudo idempotente.
-- ═══════════════════════════════════════════════════════════════════════

-- Perfil 1:1 com auth.users (criado automaticamente no cadastro)
create table if not exists public.perfis (
  id        uuid primary key references auth.users(id) on delete cascade,
  nome      text,
  email     text,
  papel     text not null default 'aluna' check (papel in ('aluna','editor','admin')),
  criado_em timestamptz default now()
);

-- Em produção a tabela já existia com outro formato (email not null etc.) —
-- garante as colunas que o app e este script usam, sem tocar nas demais
alter table public.perfis add column if not exists nome text;
alter table public.perfis add column if not exists email text;
alter table public.perfis add column if not exists papel text not null default 'aluna';
alter table public.perfis add column if not exists criado_em timestamptz default now();

alter table public.perfis enable row level security;

drop policy if exists "read perfis" on public.perfis;
create policy "read perfis" on public.perfis
  for select using (auth.uid() is not null);

drop policy if exists "update own perfil" on public.perfis;
create policy "update own perfil" on public.perfis
  for update using (auth.uid() = id);

create or replace function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_criar_perfil on auth.users;
create trigger trg_criar_perfil
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- Backfill de usuários já cadastrados
insert into public.perfis (id, nome, email)
select id, coalesce(raw_user_meta_data->>'nome', email), email
  from auth.users
on conflict (id) do nothing;

-- Progresso do cronograma (dias concluídos)
create table if not exists public.cronograma_progresso (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  dia          integer not null,
  concluido    boolean not null default true,
  concluido_em timestamptz,
  unique (user_id, dia)
);

alter table public.cronograma_progresso enable row level security;

drop policy if exists "crud own progresso" on public.cronograma_progresso;
create policy "crud own progresso" on public.cronograma_progresso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Repetição espaçada dos dias do cronograma (intervalos 1-3-7-15-30)
create table if not exists public.revisoes (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  dia_num         integer not null,
  estudado_em     date,
  proxima_revisao date not null,
  intervalo_atual integer not null default 1,
  revisoes_feitas integer not null default 0,
  unique (user_id, dia_num)
);

alter table public.revisoes enable row level security;

drop policy if exists "crud own revisoes" on public.revisoes;
create policy "crud own revisoes" on public.revisoes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_revisoes_user_data
  on public.revisoes(user_id, proxima_revisao);
