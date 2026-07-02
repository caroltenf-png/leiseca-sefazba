# Documento de Arquitetura — Lei Seca v2 ("LexFlow")

> Documento 2 de 3 · Arquitetura do sistema, banco de dados, APIs, backend, frontend, admin, mobile, autenticação, notificações, logs, permissões e dashboard.

---

## 1. Visão geral e decisões de arquitetura

### 1.1 Princípios
- **Evolução, não big-bang**: mantemos a dupla Vercel + Supabase (já paga, já implantada, já com dados). Modernizamos por módulos, migrando dados do localStorage para o Postgres.
- **Um único código-fonte web** serve aluno, admin e mobile (PWA/Capacitor) — evita triplicar manutenção para um time de 1 pessoa.
- **Regras de negócio no banco e em pacotes puros** (SRS, pontuação) — testáveis sem UI.
- **IA como camada plugável** com cache, streaming, fallback e medição de custo.

### 1.2 Stack alvo

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React 18 + Vite + **TypeScript** | continuidade com o código atual, tooling já configurado |
| UI | Tailwind CSS + design tokens próprios + Radix UI (primitivos acessíveis) | elimina estilos inline; identidade visual própria trocável por tokens |
| Roteamento | React Router v7 | deep-linking, histórico, code-splitting por rota |
| Estado servidor | TanStack Query | cache, offline-first, invalidação |
| Estado local | Zustand (fatias pequenas) | substitui os `useState` gigantes |
| Backend | **Vercel Functions** (`/api`, TypeScript) + Supabase Postgres | já implantado; funções viram handlers finos sobre serviços |
| Banco | Supabase (Postgres 15, RLS, pg_cron, Realtime) | já em uso |
| Auth | Supabase Auth (email/senha + Google OAuth) | já em uso; adicionamos papéis |
| IA | Anthropic Claude (principal) + OpenAI (fallback + TTS) via camada `ai-gateway` | streaming SSE, cache em Postgres, custo logado |
| Push | Web Push (VAPID) + agendamento via `pg_cron` → fila `notification_queue` → function de envio | sem dependência de FCM na fase web |
| PWA | `vite-plugin-pwa` (Workbox) | manifest + SW gerados no build (a falha anterior no Vercel será tratada com versão pinada) |
| Mobile | Capacitor 6 (fase final, opcional) | empacota o mesmo app para lojas |
| PDF | Impressão HTML (mantida) + `@react-pdf/renderer` para fichas | leve, sem serviço externo |
| CI | GitHub Actions: typecheck, lint, testes, build | qualidade por PR |

### 1.3 Diagrama lógico

```
┌────────────────────────────── Clientes ──────────────────────────────┐
│  PWA Aluno (React)   ·   Painel Admin (mesma SPA, rotas /admin)      │
│  Mobile (Capacitor, mesmo bundle)                                    │
└──────────────┬───────────────────────────────┬───────────────────────┘
               │ HTTPS (supabase-js: auth/dados)│ HTTPS /api (IA, TTS, lei, push)
┌──────────────▼───────────────┐  ┌────────────▼─────────────────────┐
│         SUPABASE             │  │     VERCEL FUNCTIONS (TS)        │
│  Auth (JWT, papéis em claim) │  │  /api/ai      → ai-gateway (SSE) │
│  Postgres + RLS              │  │  /api/tts     → OpenAI TTS       │
│  pg_cron (revisões, streaks, │  │  /api/lei     → scraper leis     │
│   fila de notificações)      │  │  /api/push    → Web Push (VAPID) │
│  Storage (mapas mentais,PDFs)│  │  /api/admin/* → tarefas privileg.│
│  Realtime (ranking ao vivo)  │  └────────────┬─────────────────────┘
└──────────────┬───────────────┘               │
               │                    ┌──────────▼──────────┐
               │                    │ Anthropic · OpenAI  │
               │                    │ Planalto/SEFAZ (leis)│
               └────────────────────┴─────────────────────┘
```

### 1.4 Estrutura de pastas (monorepo simples)

```
/
├─ src/
│  ├─ app/                # bootstrap, router, providers, layout
│  ├─ features/
│  │  ├─ auth/  ├─ laws/  ├─ questions/  ├─ flashcards/
│  │  ├─ srs/   ├─ tracks/ (trilhas)     ├─ sessions/ (sessão IA)
│  │  ├─ exams/ (simulados) ├─ juris/    ├─ mindmaps/
│  │  ├─ stats/ ├─ notifications/        └─ admin/
│  ├─ shared/             # ui-kit (tokens, componentes), hooks, api-client
│  └─ core/               # regras puras: srs.ts, scoring.ts, streak.ts
├─ api/                   # Vercel Functions em TS (handlers finos)
│  └─ _lib/               # ai-gateway, supabase-admin, push, logger
├─ supabase/migrations/   # schema completo versionado
├─ tests/                 # vitest (core + api)
└─ docs/
```

---

## 2. Banco de dados (Postgres/Supabase)

Convenções: `snake_case`, `uuid` PK `default gen_random_uuid()`, `created_at/updated_at`, RLS em tudo. Migrations novas recriam também as tabelas hoje sem migration (`profiles`, progresso, revisões), com script de migração de dados do localStorage (import no primeiro login).

### 2.1 Identidade e permissões
```sql
profiles          (id uuid PK = auth.users.id, display_name, avatar_url,
                   role text check in ('student','editor','admin') default 'student',
                   plan text default 'full',            -- pronto p/ free|premium
                   track_id uuid null,                  -- trilha ativa
                   track_started_on date,               -- elimina data-base fixa
                   settings jsonb default '{}')         -- prefs de notificação/tema
```
Papel replicado em `auth.users.raw_app_meta_data.role` (custom claim) para RLS barata: `is_admin()`/`is_editor()` como funções SQL `security definer`.

### 2.2 Conteúdo (gerido pelo admin)
```sql
laws              (id, slug unique, name, short_name, area, priority int,
                   source_url, status text default 'published')
law_articles      (id, law_id FK, ordinal int, label text,   -- "Art. 5º, §2º"
                   plain_text, html, anchor_tags text[],     -- âncoras FGV
                   tsv tsvector)                             -- busca full-text
smart_highlights  (id, article_id FK, span_start, span_end,
                   category text check in ('definicao','prazo','proibicao',
                                           'competencia','excecao'))
subjects          (id, law_id FK null, parent_id FK null, name)  -- assunto/subassunto
questions         (id, source text check in ('real','ai'), banca, year int,
                   law_id FK, subject_id FK, article_refs text[],
                   stem text, options jsonb, answer_key text,
                   rationale_html text,        -- comentário com <mark class=ok|trap>
                   difficulty int, status text default 'pending',  -- pending|approved|rejected
                   stats jsonb default '{"attempts":0,"correct":0}')
jurisprudence     (id, court, number, area, title, thesis, ai_summary,
                   ai_question jsonb, article_refs text[], status)
mind_maps         (id, subject_id FK, title, storage_path, preview_path, status)
tracks            (id, slug, name, exam_board, career, weeks int, status)
track_days        (id, track_id FK, day_no int, phase text, subject_code text,
                   theme, article_refs text[], anchors text[], juris_refs text[],
                   is_rest bool default false)
```

### 2.3 Dados do usuário (RLS `user_id = auth.uid()`)
```sql
user_highlights   (id, user_id, article_id FK, span jsonb, color text)
user_notes        (id, user_id, article_id FK null, law_id FK null, body text)
flashcards        (id, user_id, deck text, law_id FK null, subject_id FK null,
                   front, back, origin text check in ('manual','ai','selection'))
srs_items         (id, user_id, kind text check in ('flashcard','article','track_day'),
                   ref_id uuid, ease numeric default 2.5, interval_days int default 0,
                   reps int default 0, lapses int default 0, due_on date,
                   unique (user_id, kind, ref_id))          -- UM único SRS p/ tudo
srs_reviews       (id, srs_item_id FK, user_id, grade int, reviewed_at)
question_attempts (id, user_id, question_id FK, chosen text, is_correct bool,
                   elapsed_ms int, context text check in ('practice','exam','session'))
notebooks         (id, user_id, name, filter jsonb)          -- cadernos de questões
track_progress    (user_id, track_day_id FK, completed_at, PK(user_id,track_day_id))
study_sessions    (id, user_id, track_day_id FK null, topic, messages jsonb,
                   notes text, summary_pdf_path, started_at, updated_at)
exams             (id, user_id, config jsonb, started_at, finished_at,
                   score numeric, question_ids uuid[])
```

### 2.4 Gamificação, notificações, logs
```sql
point_events      (id, user_id, kind text, points int, ref jsonb, created_at)
   -- pontos SEMPRE derivados de eventos; view user_stats agrega (pontos, nível, streak)
user_streaks      (user_id PK, current int, best int, last_active_on date)
   -- atualizado por trigger em point_events; job pg_cron zera streaks quebrados
leaderboards      (view materializada semanal/geral sobre point_events; opt-in via profiles.settings)

notification_prefs(user_id PK, reviews bool, daily_goal bool, streak bool, quiet_hours jsonb)
push_subscriptions(id, user_id, endpoint unique, keys jsonb, user_agent)
notification_queue(id, user_id, type, payload jsonb, scheduled_for, sent_at null, error null)
   -- pg_cron popula (revisões vencidas, meta diária, streak em risco);
   -- /api/push/dispatch consome a cada 5 min

activity_log      (id, user_id null, actor_role, action, entity, entity_id,
                   metadata jsonb, created_at)               -- auditoria admin + eventos de domínio
ai_calls          (id, user_id, feature text, provider, model, tokens_in, tokens_out,
                   cost_usd numeric, latency_ms, cache_hit bool, created_at)
ai_cache          (key text PK,           -- hash(feature+prompt normalizado)
                   feature, payload jsonb, hits int, created_at)
```

### 2.5 Políticas RLS (resumo)
- Conteúdo (`laws`, `questions` aprovadas, `tracks`, `mind_maps`…): `SELECT` para autenticados; `INSERT/UPDATE/DELETE` apenas `editor|admin`.
- Dados de usuário: CRUD apenas do dono; admin lê via service role (nunca pelo client).
- `questions` com `status='pending'`: visíveis só para `editor|admin` (fila de moderação).
- `activity_log`, `ai_calls`: insert via service role; leitura apenas admin.

---

## 3. APIs

### 3.1 Acesso a dados
CRUD comum vai **direto do client ao Supabase** (supabase-js + RLS) — menos latência e menos código. Vercel Functions ficam só para o que exige segredo ou orquestração:

| Endpoint | Método | Auth | Função |
|---|---|---|---|
| `/api/ai/chat` | POST (SSE) | JWT | Sessão do Dia e Assessor IA com **streaming**; injeta contexto do dia; loga em `ai_calls` |
| `/api/ai/generate` | POST | JWT | Geração estruturada (questão, flashcard, comentário juris, resumo) com **cache** em `ai_cache`; saída validada por JSON Schema |
| `/api/tts` | POST | JWT | TTS OpenAI com fallback Web Speech no client (mantido, + cache de áudio no Storage) |
| `/api/lei/import` | POST | editor/admin | Scraper (whitelist mantida) → parseia em `law_articles` (substitui o parse por regex no client) |
| `/api/push/subscribe` | POST | JWT | registra `push_subscriptions` |
| `/api/push/dispatch` | POST | cron secret | consome `notification_queue` e envia Web Push |
| `/api/export/pdf` | POST | JWT | ficha de revisão/resumo em PDF |
| `/api/admin/seed` | POST | admin (JWT + papel) | substitui `seed.js/setup.js` com token fraco |

Padrões: validação com Zod em toda entrada; erros `{code, message}`; rate-limit por usuário nas rotas de IA; idempotência por `Idempotency-Key` nas gerações.

### 3.2 ai-gateway (`api/_lib/ai.ts`)
1. Normaliza pedido → chave de cache → consulta `ai_cache` (hit = resposta imediata, custo zero).
2. Chama Anthropic (streaming quando chat); em erro 5xx/timeout → fallback OpenAI (de verdade, ao contrário do comentário atual).
3. Valida JSON de saída contra schema; re-tenta 1x com mensagem de correção.
4. Grava `ai_calls` (tokens, custo, latência, cache_hit) — alimenta o dashboard admin.

---

## 4. Frontend (aluno)

- **Rotas**: `/` (dashboard), `/leis`, `/leis/:slug`, `/questoes`, `/questoes/:id`, `/flashcards`, `/revisoes`, `/trilha`, `/trilha/dia/:n`, `/sessao/:id`, `/simulados`, `/simulados/:id`, `/juris`, `/mapas`, `/ranking`, `/estatisticas`, `/perfil`, `/auth/*`.
- **Layout**: sidebar (desktop) / bottom-nav (mobile) — preservando a UX atual que funciona.
- **Offline-first**: TanStack Query com persistência IndexedDB; SW pré-cacheia app shell + leis abertas + fila de revisão do dia; mutações offline entram em outbox e sincronizam ao reconectar.
- **Identidade visual própria**: design tokens (cores, tipografia, espaçamento) em um único arquivo de tema; paleta própria (proposta: base grafite + âmbar/dourado da marca atual da Carolina, distinta do produto de referência); modo claro/escuro.
- **Migração de dados**: no primeiro login da v2, um importador lê as chaves do localStorage antigo (flashcards, marcações, anotações, stats, placar) e grava nas tabelas novas — nada se perde.

## 5. Painel administrativo

Mesma SPA, rotas `/admin/*` protegidas por papel (guard no router + RLS no banco):
- **Conteúdo**: CRUD de leis/artigos (com importador do scraper), grifos inteligentes, questões (editor + **fila de aprovação** do conteúdo gerado por IA), jurisprudência, mapas mentais (upload ao Storage), trilhas e dias.
- **Usuários**: lista, papéis, plano, reset de progresso.
- **Operação**: dashboard de uso (DAU, sessões, questões respondidas), custo de IA por feature/dia (`ai_calls`), fila de notificações, `activity_log` com filtros.

## 6. Mobile

- **Fase 1 (entrega principal)**: PWA real — manifest, service worker, instalável, offline, Web Push (Android/desktop; iOS ≥ 16.4 com instalação).
- **Fase 2 (opcional)**: Capacitor empacota o mesmo bundle para App Store/Play Store; push nativo via FCM/APNs entra aqui se necessário.

## 7. Autenticação e permissões

- Supabase Auth: email/senha (mantido) + Google OAuth; confirmação de email; recuperação de senha (fluxos já existentes preservados).
- Papéis `student` / `editor` / `admin` em custom claim + `profiles.role`; helpers SQL `is_admin()`, `is_editor()`.
- Entitlements por plano na estrutura (`profiles.plan` + tabela futura `plans`), permitindo replicar o modelo free/trial/premium do produto de referência sem retrabalho — mesmo que hoje todos usem `full`.

## 8. Notificações

- **In-app**: sino com central de notificações (tabela `notification_queue` lida pelo client via Realtime).
- **Push**: Web Push VAPID; agendamento: jobs `pg_cron` (ex.: 07h gera lembretes de revisões vencidas; 20h streak em risco) → `notification_queue` → `/api/push/dispatch` (cron Vercel a cada 5 min).
- Preferências por usuário (`notification_prefs`) com quiet hours.

## 9. Logs e observabilidade

- `activity_log`: eventos de domínio (dia concluído, simulado finalizado) + auditoria de toda ação admin (quem, o quê, antes/depois em `metadata`).
- `ai_calls`: custo/latência/cache por chamada de IA.
- Functions com logger estruturado (JSON) → Vercel Logs; erros de client via handler global gravando em `activity_log(action='client_error')`.

## 10. Dashboard

- **Aluno**: streak real, pontos/nível derivados de `point_events`, heatmap de constância, desempenho por lei/assunto (de `question_attempts`), revisões pendentes, progresso da trilha.
- **Admin**: métricas de uso, custo de IA, saúde da fila de notificações, funil de aprovação de questões.

## 11. Segurança (correções sobre o estado atual)

1. Remover token `sefaz2026`; endpoints admin passam a validar JWT + papel.
2. Segredos apenas em env vars do Vercel/Supabase; anon key permanece no client (correto), service role nunca.
3. Scraper `/api/lei` mantém whitelist e passa a exigir papel editor (só importação admin, não proxy aberto).
4. Rate-limit nas rotas de IA (por usuário/dia) + orçamento mensal com corte suave.
5. RLS revisada tabela a tabela; testes de RLS automatizados no CI.
