-- ═══════════════════════════════════════════════════════════════════════
-- M1: dados do usuário sincronizados entre dispositivos.
-- Documento jsonb por usuário — armazenamento transicional que substitui o
-- localStorage como fonte de verdade (flashcards, marcações, anotações,
-- stats). Módulos futuros (SRS, M4) normalizam o que precisar de consulta.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.user_dados (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  flashcards    jsonb not null default '[]',
  marcacoes     jsonb not null default '{}',
  anotacoes     jsonb not null default '{}',
  stats         jsonb not null default '{}',
  atualizado_em timestamptz default now()
);

alter table public.user_dados enable row level security;

drop policy if exists "crud own dados" on public.user_dados;
create policy "crud own dados" on public.user_dados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Papel de administradora para a dona do projeto
update public.perfis
   set papel = 'admin'
 where id in (select id from auth.users
               where email in ('caroltenf@gmail.com', 'caroltxs@live.com'));
