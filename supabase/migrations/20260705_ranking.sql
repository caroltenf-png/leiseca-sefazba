-- ═══════════════════════════════════════════════════════════════════════
-- M6: ranking do grupo. Os pontos vivem em user_dados (RLS: só o dono lê);
-- esta tabela espelha o placar de quem participa, legível por todo o grupo,
-- mantida por trigger em user_dados.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.perfis
  add column if not exists ranking_optin boolean not null default true;

create table if not exists public.ranking (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  nome          text,
  pontos        integer not null default 0,
  streak        integer not null default 0,
  flashcards    integer not null default 0,
  atualizado_em timestamptz default now()
);

alter table public.ranking enable row level security;

drop policy if exists "read ranking" on public.ranking;
create policy "read ranking" on public.ranking
  for select using (auth.uid() is not null);

create or replace function public.atualizar_ranking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nome text;
  v_optin boolean;
begin
  select nome, ranking_optin into v_nome, v_optin from public.perfis where id = new.user_id;
  if coalesce(v_optin, true) then
    insert into public.ranking (user_id, nome, pontos, streak, flashcards, atualizado_em)
    values (
      new.user_id,
      v_nome,
      coalesce((new.stats->>'pontos')::int, 0),
      coalesce((new.stats->>'streakDias')::int, 0),
      coalesce(jsonb_array_length(new.flashcards), 0),
      now()
    )
    on conflict (user_id) do update set
      nome = excluded.nome,
      pontos = excluded.pontos,
      streak = excluded.streak,
      flashcards = excluded.flashcards,
      atualizado_em = now();
  else
    delete from public.ranking where user_id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_ranking on public.user_dados;
create trigger trg_ranking
  after insert or update on public.user_dados
  for each row execute function public.atualizar_ranking();
