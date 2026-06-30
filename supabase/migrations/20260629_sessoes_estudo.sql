-- Tabela de histórico de sessões de estudo
create table if not exists public.sessoes_estudo (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  dia integer not null,
  mat text not null,
  tema text not null,
  msgs jsonb not null default '[]',
  anotacoes text default '',
  iniciada_em timestamptz default now(),
  atualizada_em timestamptz default now()
);

alter table public.sessoes_estudo enable row level security;

create policy "select sessoes proprias" on public.sessoes_estudo
  for select using (auth.uid() = user_id);

create policy "insert sessoes proprias" on public.sessoes_estudo
  for insert with check (auth.uid() = user_id);

create policy "update sessoes proprias" on public.sessoes_estudo
  for update using (auth.uid() = user_id);

create policy "delete sessoes proprias" on public.sessoes_estudo
  for delete using (auth.uid() = user_id);
