create table if not exists public.cache_leis (
  id text primary key,
  nome text not null,
  texto_html text not null,
  gerado_por uuid references public.perfis(id),
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.cache_juris (
  id text primary key,
  fonte text not null,
  numero text,
  area text,
  titulo text not null,
  tese text,
  resumo_ia text,
  questao_ia jsonb,
  gerado_por uuid references public.perfis(id),
  criado_em timestamptz default now()
);

create table if not exists public.cache_questoes (
  id uuid default gen_random_uuid() primary key,
  disciplina text not null,
  tema text not null,
  dificuldade text,
  enunciado text not null,
  alternativas jsonb not null,
  gabarito text not null,
  fundamentacao text,
  explicacao_gabarito text,
  explicacao_distratores jsonb,
  dica_prova text,
  origem text default 'ia',
  prova_referencia text,
  gerado_por uuid references public.perfis(id),
  criado_em timestamptz default now(),
  vezes_respondida integer default 0,
  taxa_acerto numeric default 0
);

create table if not exists public.cache_flashcards (
  id uuid default gen_random_uuid() primary key,
  lei_id text,
  disciplina text,
  pergunta text not null,
  resposta text not null,
  fonte text default 'ia',
  gerado_por uuid references public.perfis(id),
  criado_em timestamptz default now(),
  aprovado boolean default true
);

alter table public.cache_leis enable row level security;
alter table public.cache_juris enable row level security;
alter table public.cache_questoes enable row level security;
alter table public.cache_flashcards enable row level security;

create policy "read cache_leis" on public.cache_leis for select using (auth.uid() is not null);
create policy "read cache_juris" on public.cache_juris for select using (auth.uid() is not null);
create policy "read cache_questoes" on public.cache_questoes for select using (auth.uid() is not null);
create policy "read cache_flashcards" on public.cache_flashcards for select using (auth.uid() is not null);

create policy "insert cache_leis" on public.cache_leis for insert with check (auth.uid() is not null);
create policy "insert cache_juris" on public.cache_juris for insert with check (auth.uid() is not null);
create policy "insert cache_questoes" on public.cache_questoes for insert with check (auth.uid() is not null);
create policy "insert cache_flashcards" on public.cache_flashcards for insert with check (auth.uid() is not null);

create policy "update cache_leis" on public.cache_leis for update using (auth.uid() = gerado_por);
create policy "update cache_juris" on public.cache_juris for update using (auth.uid() = gerado_por);
create policy "update cache_questoes" on public.cache_questoes for update using (auth.uid() = gerado_por);
