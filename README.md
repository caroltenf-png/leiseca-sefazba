# Lei Seca — Plataforma de Estudo de Legislação

PWA de estudo de legislação para concursos (SEFAZ-BA · FGV): leitor de leis com
grifo inteligente, banco de questões com comentário grifado, flashcards com
repetição espaçada (SM-2), cronograma de 90 dias, sessão de estudo guiada por
IA, simulados, ranking do grupo e painel administrativo.

## Stack

- **Frontend:** React 18 + Vite + TypeScript (migração incremental), Tailwind,
  React Router, TanStack Query
- **Backend:** Supabase (Auth + Postgres com RLS) + Vercel Functions (`/api`)
- **IA:** Anthropic Claude (principal, com streaming SSE) + OpenAI (fallback e TTS)
- **PWA:** vite-plugin-pwa (manifest + service worker)

## Rodando localmente

```bash
npm ci
npm run dev        # http://localhost:5173
```

Scripts de qualidade (mesmos do CI):

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest (núcleo: SRS, streak, rotas, grifo, busca)
npm run build      # build de produção + PWA
```

## Banco de dados

Migrations em `supabase/migrations/` (ordem lexicográfica). Para aplicar:
`supabase db push`, ou cole os arquivos novos no SQL Editor do dashboard —
todas são idempotentes.

Env vars nas Functions (Vercel): `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.

## Estrutura

```
src/
├─ core/        # regras puras testadas (srs.js, streak.js)
├─ features/    # telas modulares (questoes, admin, leitura, busca)
├─ lib/         # supabaseClient, userDataSync
├─ app/         # rotas (telaRoute, useTelaRoute)
├─ components/  # UI compartilhada
└─ App.jsx      # telas legadas em migração gradual para features/
api/            # ai (streaming+fallback), tts, lei (scraper whitelist)
docs/           # especificação, arquitetura e roadmap
```

## Papéis

`aluna` (padrão) · `editor` · `admin` — controlados em `perfis.papel` com RLS
(`is_admin()`). Admin/editor acessam `/admin`: moderação de questões geradas
por IA, gestão de papéis e log de auditoria.
