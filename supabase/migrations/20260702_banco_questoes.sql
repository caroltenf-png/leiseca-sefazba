-- ═══════════════════════════════════════════════════════════════════════
-- BANCO DE QUESTÕES (M3)
-- 1. Coluna de moderação em cache_questoes (aprovado)
-- 2. Tabela questao_respostas: uma linha por tentativa de cada usuário
-- 3. Trigger que mantém vezes_respondida / taxa_acerto na questão
-- ═══════════════════════════════════════════════════════════════════════

alter table public.cache_questoes
  add column if not exists aprovado boolean default true;

create table if not exists public.questao_respostas (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  questao_id  uuid not null references public.cache_questoes(id) on delete cascade,
  alternativa text not null check (alternativa in ('A','B','C','D','E')),
  acertou     boolean not null,
  tempo_ms    integer,
  contexto    text default 'banco' check (contexto in ('banco','simulado','sessao')),
  criado_em   timestamptz default now()
);

create index if not exists idx_questao_respostas_user
  on public.questao_respostas(user_id, criado_em desc);
create index if not exists idx_questao_respostas_questao
  on public.questao_respostas(questao_id);
create index if not exists idx_cache_questoes_disciplina
  on public.cache_questoes(disciplina);

alter table public.questao_respostas enable row level security;

drop policy if exists "read own respostas" on public.questao_respostas;
create policy "read own respostas" on public.questao_respostas
  for select using (auth.uid() = user_id);

drop policy if exists "insert own respostas" on public.questao_respostas;
create policy "insert own respostas" on public.questao_respostas
  for insert with check (auth.uid() = user_id);

-- Estatísticas agregadas da questão (visíveis para todo o grupo).
-- security definer: o update em cache_questoes não depende da RLS do usuário.
create or replace function public.atualizar_stats_questao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.cache_questoes q
     set vezes_respondida = s.total,
         taxa_acerto      = s.taxa
    from (
      select count(*)::int as total,
             round(avg(case when acertou then 1 else 0 end)::numeric * 100, 1) as taxa
        from public.questao_respostas
       where questao_id = new.questao_id
    ) s
   where q.id = new.questao_id;
  return new;
end;
$$;

drop trigger if exists trg_stats_questao on public.questao_respostas;
create trigger trg_stats_questao
  after insert on public.questao_respostas
  for each row execute function public.atualizar_stats_questao();
