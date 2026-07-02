-- ═══════════════════════════════════════════════════════════════════════
-- M4: SRS unificado (SM-2). A tabela revisoes ganha os campos do algoritmo
-- único (ease/lapses); o intervalo deixa de ser uma escada fixa 1-3-7-15-30.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.revisoes
  add column if not exists ease numeric not null default 2.5,
  add column if not exists lapses integer not null default 0;
