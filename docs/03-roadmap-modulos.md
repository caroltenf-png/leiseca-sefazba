# Roadmap e Divisão em Módulos — Lei Seca v2

> Documento 3 de 3 · Plano de execução módulo a módulo. Cada módulo termina com o app **funcionando e implantável** (sem quebrar o que existe), com commit(s) próprios e critérios de aceite verificáveis.

## Estratégia

- **Strangler fig**: a v2 nasce dentro do repositório atual. A cada módulo, uma parte do monólito `App.jsx` é reescrita como feature TypeScript modular e a antiga é removida. O app permanece utilizável durante toda a migração.
- Dados primeiro: migrations completas antes de qualquer tela nova.
- Nenhum código, texto ou identidade visual do produto de referência é copiado.

## Visão geral

| # | Módulo | Entrega principal | Esforço relativo |
|---|--------|-------------------|------------------|
| M0 | Fundação técnica | TS, Tailwind, Router, CI, migrations completas | ●●○ |
| M1 | Auth, perfis e permissões | papéis, guards, importador de localStorage | ●●○ |
| M2 | Acervo e leitor de leis | leis no banco, grifos/anotações sincronizados, TTS | ●●● |
| M3 | Banco de questões | questões reais + filtros + comentário com grifos | ●●● |
| M4 | Flashcards + SRS unificado | SM-2 único, fila de revisões | ●●○ |
| M5 | Trilhas e Sessão do Dia | trilha por usuário, chat IA com streaming | ●●● |
| M6 | Simulados, ranking e estatísticas | simulado cronometrado, pódio, dashboard aluno | ●●● |
| M7 | Notificações + PWA real | Web Push, offline, instalável | ●●○ |
| M8 | Painel administrativo | CRUD de conteúdo, moderação, logs, custo IA | ●●● |
| M9 | Identidade visual, mobile e polimento | tema final, Capacitor (opcional), a11y, docs | ●●○ |

Ordem pensada para valor imediato: já ao fim do M3 o app exibe o banco de questões reais (hoje populado e invisível) com a experiência de comentário grifado — a funcionalidade-assinatura do produto de referência.

---

## M0 — Fundação técnica
**Objetivo:** base moderna sem mudar comportamento visível.
- Converter projeto para TypeScript (permitindo `.jsx` legado conviver); ESLint + Prettier.
- Tailwind + design tokens iniciais; React Router com as rotas atuais mapeadas para as telas existentes (deep-linking imediato); TanStack Query + Zustand instalados.
- **Migrations completas**: recriar em `supabase/migrations` tudo que existe só no dashboard (`profiles`, `cronograma_progresso`, `revisoes`) + novas tabelas do documento de arquitetura; corrigir divergência de `sessoes_estudo`.
- GitHub Actions: typecheck, lint, build, testes (vitest).
- `vite-plugin-pwa` reintroduzido com versão pinada + manifest real (corrige a falha antiga do Vercel).

**Aceite:** app atual funciona igual, com URLs por tela; `supabase db reset` sobe o schema inteiro; CI verde.

## M1 — Autenticação, perfis e permissões
- `profiles` com papéis; custom claims; guards de rota; tela de perfil/configurações.
- Google OAuth adicionado ao email/senha.
- **Importador de dados legados**: no primeiro login, migra localStorage (flashcards, grifos, anotações, stats, placar) para as tabelas novas.
- Remoção dos endpoints `seed/setup` com token fraco → `/api/admin/seed` com JWT+papel.

**Aceite:** login em dois dispositivos vê os mesmos dados; usuária admin acessa `/admin` (placeholder); token `sefaz2026` eliminado.

## M2 — Acervo e leitor de leis
- Importar as 30 leis para `laws`/`law_articles` (via `/api/lei/import`); busca full-text.
- Novo leitor: grifos pessoais e anotações **no banco**; grifos inteligentes por categoria (definição/prazo/proibição/competência/exceção); TTS mantido com cache de áudio.
- Flashcard a partir de seleção (mantido, agora persistido no banco).

**Aceite:** grifo feito no celular aparece no desktop; busca "alíquota" retorna artigos; leitura offline das leis já abertas.

## M3 — Banco de questões
- Ativar `questions` com as 36 questões FGV reais + pipeline de importação; filtros lei → assunto → subassunto, dificuldade, origem.
- Tela de resolução com **comentário grifado** (verde = fundamento, vermelho = pegadinha) e estatísticas por questão.
- Cadernos do usuário (`notebooks`); geração de questões por IA entra na **fila de aprovação** (status pending) em vez de ir direto à tela.
- `question_attempts` alimentando estatísticas.

**Aceite:** resolver 10 questões filtradas por lei com comentário grifado; taxa de acerto por questão visível; questão IA só aparece após aprovação.

## M4 — Flashcards + SRS unificado
- `core/srs.ts`: SM-2 simplificado, **testado por unidade** — substitui os dois algoritmos divergentes.
- `srs_items` para flashcards, artigos e dias de trilha; tela "Revisões de hoje" unificada.
- Decks por lei/assunto; revisão com notas (errei/difícil/bom/fácil).

**Aceite:** revisar um card reagenda conforme SM-2 (testes cobrem intervalos); a fila junta flashcards + dias de cronograma vencidos.

## M5 — Trilhas e Sessão do Dia
- `tracks`/`track_days`: cronograma SEFAZ-BA 90 dias vira a primeira trilha; **data de início por usuário** (fim da data fixa 2026-06-29).
- Progresso integrado ao SRS (dia concluído gera `srs_item`).
- Sessão do Dia reescrita sobre `/api/ai/chat` com **streaming**, auto-save no banco, histórico, ficha de revisão PDF.

**Aceite:** usuário novo inicia a trilha hoje e vê o Dia 1; resposta da IA aparece token a token; sessão retomada de outro aparelho.

## M6 — Simulados, ranking e estatísticas
- Simulado cronometrado configurável usando o banco de questões (IA só complementa, com cache); resultado detalhado + histórico (`exams`).
- Gamificação real: `point_events` + triggers de streak (fim do streak fake); ranking semanal/geral **opt-in** com pódio.
- Dashboard do aluno: heatmap de constância, desempenho por lei/assunto, evolução.

**Aceite:** simulado de 10 questões em 20 min gera resultado e pontos auditáveis em `point_events`; streak zera se ficar um dia sem atividade; ranking mostra apenas usuários opt-in.

## M7 — Notificações + PWA real
- Web Push (VAPID): assinatura, preferências, quiet hours.
- Jobs `pg_cron`: revisões vencidas (manhã), streak em risco (noite) → `notification_queue` → cron de envio.
- Central de notificações in-app; SW com offline (app shell, leis abertas, fila de revisão) e outbox de mutações.

**Aceite:** Lighthouse PWA ≥ 90; push de "5 revisões vencidas" chega com app fechado; revisar flashcards em modo avião sincroniza ao reconectar.

## M8 — Painel administrativo
- `/admin`: CRUD de leis, questões (com fila de moderação), juris, mapas mentais (upload Storage), trilhas; gestão de usuários/papéis.
- Logs: `activity_log` navegável; dashboard de custo de IA (`ai_calls`) e uso.

**Aceite:** editor aprova questão pendente e ela aparece para alunos; toda ação admin auditada; custo de IA do mês visível.

## M9 — Identidade visual, mobile e polimento
- Tema definitivo (paleta própria, tipografia, logo simples), modo claro/escuro, a11y AA.
- Mapas mentais (galeria/visualizador) — RF-09.
- Remoção final de todo código legado do monólito; documentação (`README`, guia de deploy/env).
- Opcional: build Capacitor para lojas.

**Aceite:** zero código do `App.jsx` legado; auditoria a11y sem bloqueantes; README permite subir ambiente do zero.

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Migração do localStorage perder dados | importador roda em modo dry-run com relatório antes de gravar; backup JSON exportável |
| `vite-plugin-pwa` quebrar deploy de novo (histórico) | versão pinada + build de verificação no CI antes do merge |
| Custo de IA crescer com mais usuários | cache `ai_cache`, priorização do banco de questões real, rate-limit e orçamento mensal |
| Parse de leis por scraper falhar em normas novas | importação assistida no admin com pré-visualização e edição manual |
| Escopo grande para um dev | módulos independentes e implantáveis; cortes claros: M9/Capacitor e RF-09 são opcionais |

## Processo por módulo

1. Migration + regras puras (com testes) → 2. API/serviços → 3. UI → 4. remoção do legado equivalente → 5. verificação end-to-end → 6. commit + push + deploy preview.

**Aguardando aprovação para iniciar o M0.** Ajustes de escopo, ordem ou stack são bem-vindos antes do primeiro código.
