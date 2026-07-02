# Especificação Funcional — Lei Seca (v2)

> Documento 1 de 3 · Análise do aplicativo de referência + estado atual do projeto + especificação técnica alvo.
> Os documentos complementares são `02-arquitetura.md` e `03-roadmap-modulos.md`.

---

## 1. Metodologia da análise

O site do aplicativo de referência (decorandoaleiseca.com.br) bloqueia acesso automatizado (HTTP 403), portanto a análise foi feita a partir de **fontes públicas**: fichas nas lojas (App Store `id1610338514`, Google Play `com.decorandoaleiseca` — "Vade Mecum de Questões"), blog oficial, páginas de assinatura indexadas e análises de terceiros. Nenhum código, texto, marca ou identidade visual do produto de referência foi (ou será) copiado — apenas o **conjunto de funcionalidades e a experiência de uso** servem de inspiração.

O estado atual do nosso app foi levantado por leitura integral do código (`src/App.jsx`, `src/data/dados.js`, `api/*`, `supabase/migrations/*`).

---

## 2. Funcionalidades do aplicativo de referência

Ecossistema declarado: **VMQ (Vade Mecum de Questões), Ranking, Pódio, Raio-X, mapas mentais, jurisprudência, flashcards e revisões de reta final**.

### 2.1 Banco de questões (núcleo do produto)
- +70.000 questões sobre legislação, de bancas reais.
- Filtros por **código/lei → assunto → subassunto**, por banca e por carreira.
- **Comentários com grifos coloridos**: ao responder, o artigo fundamentador aparece grifado em **verde** (resposta correta) e o trecho alterado/pegadinha em **vermelho**.
- Estatísticas por questão (taxa de acerto, vezes respondida).
- Questões inéditas sobre legislação recente.

### 2.2 Lei seca "raio-x" / grifada
- Texto de lei com **grifo inteligente** por código de cores (ex.: definições, proibições, prazos), destacando verbo + sujeito + prazo/condição.
- Materiais em PDF derivados das leis grifadas.

### 2.3 Mapas mentais
- +1.000 mapas mentais construídos a partir da análise de ~20.000 questões objetivas.
- Organizados por disciplina; downloads em PDF.

### 2.4 Trilhas / cronogramas por carreira
- Planos de estudo organizados por carreira: jurídicas (magistratura/MP/defensoria), tribunais, cartórios, delegado, fiscal/tributária, trabalhista, PGM/PGE/AGU, OAB.
- Cronogramas de até 24 semanas com metas diárias; 1ª semana gratuita (funil de conversão).
- Ciclo diário: meta de leitura de lei seca → prática imediata no banco de questões → mapa mental dos artigos estudados.

### 2.5 Simulados, ranking e pódio
- Simulados cronometrados com tempos configuráveis.
- **Ranking** entre usuários com filtros; pódio dos melhores.

### 2.6 Estatísticas e revisão
- Painel de desempenho por lei/assunto.
- Repetição espaçada para fixação; revisões de reta final.

### 2.7 Monetização e acesso
- Cadastro gratuito com **trial de 7 dias**.
- 3 planos de assinatura que variam por: carreiras desbloqueadas, acesso a mapas mentais/PDFs e duração (anual ≈ R$ 597, premium, vitalício/ilimitado).
- Apps iOS e Android + versão web (`app.decorandoaleiseca.app`).

### 2.8 Fluxos de usuário mapeados
1. **Onboarding**: cadastro → escolha da carreira/concurso → trial 7 dias → paywall.
2. **Estudo diário**: abrir trilha → meta do dia (artigos) → ler lei grifada → resolver questões filtradas pelos artigos → revisar mapa mental → marcar dia concluído.
3. **Prática livre**: filtrar banco de questões (lei/assunto/subassunto) → responder → ver comentário com grifos → estatísticas.
4. **Simulado**: configurar (disciplinas, nº questões, tempo) → resolver cronometrado → resultado → ranking/pódio.
5. **Revisão**: fila de repetição espaçada → revisar artigos/flashcards vencidos → reagendar.
6. **Administração** (interno): cadastrar leis/grifos, questões, mapas, trilhas; moderar conteúdo; gerenciar assinaturas.

### 2.9 Telas inferidas do produto de referência
Login/Cadastro · Onboarding (carreira) · Home/Dashboard · Banco de questões (filtros) · Resolução de questão + comentário · Leitor de lei grifada · Mapas mentais (galeria/visualizador) · Trilhas/cronograma · Sessão do dia · Simulado (config/execução/resultado) · Ranking/Pódio · Estatísticas · Revisões · Perfil/Assinatura · Configurações/Notificações.

### 2.10 Tecnologias prováveis do produto de referência
App híbrido multiplataforma (padrão do segmento: Flutter/React Native + WebView para a versão web), backend REST com Postgres/MySQL, gateway de pagamento (Hotmart é usado para vendas), notificações push (FCM/APNs). Permissões mobile mínimas: rede, notificações, armazenamento (PDFs).

> Fontes: [site oficial](https://www.decorandoaleiseca.com.br/), [App Store](https://apps.apple.com/br/app/decorando-a-lei-seca/id1610338514), [Google Play](https://play.google.com/store/apps/details?id=com.decorandoaleiseca), [blog — guia de estudo](https://blog.decorandoaleiseca.com.br/como-estudar-lei-seca/), [assinatura ilimitada](https://www.decorandoaleiseca.com.br/assinatura-ilimitada), [análise de terceiros](https://www.curso.blog.br/decorando-a-lei-seca-vale-a-pena-analise-completa-para-concurseiros/).

---

## 3. Estado atual do nosso aplicativo (Lei Seca SEFAZ-BA)

### 3.1 O que já existe e funciona
| Área | Estado atual |
|---|---|
| Acervo de leis | 30 leis, textos embutidos + cache Supabase + scraper `/api/lei` (Planalto/SEFAZ-BA) |
| Leitor | Grifos em 5 cores, anotações, TTS (OpenAI + Web Speech), flashcard por IA a partir de seleção |
| Flashcards | CRUD manual + geração por IA; revisão acertei/errei (sem SRS) |
| Cronograma | 90 dias / 3 fases, progresso no Supabase, painel de revisão espaçada |
| Sessão do Dia | Chat com IA-professor socrático (Claude), auto-save, ficha de revisão em PDF |
| Simulado | Questões FGV geradas por IA sob demanda, placar local |
| Jurisprudência | 9 julgados curados + comentário/questão por IA, cache compartilhado |
| Dashboard | Streak, pontos, nível, taxas de acerto |
| Auth | Supabase Auth (email/senha), RLS por usuário |
| APIs | `/api/ai` (Claude), `/api/tts` (OpenAI), `/api/lei` (scraper), `/api/seed`+`/api/setup` (admin) |

### 3.2 Principais débitos técnicos (síntese do levantamento)
1. **Monólito**: 4.442 linhas em um único `App.jsx`, estilos inline, sem router, sem TypeScript, sem testes.
2. **Estado crítico só em localStorage** (flashcards, grifos, anotações, stats, placar) — sem sync entre dispositivos.
3. **Migrations incompletas**: tabelas `perfis`, `cronograma_progresso`, `revisoes` usadas mas sem migration; schema de `sessoes_estudo` divergente do código.
4. **Dois algoritmos de repetição espaçada conflitantes** (1-3-7-15-30 vs +1/+7/+30).
5. **Banco de questões reais (36 FGV) populado mas nunca exibido**; idem `cache_flashcards`.
6. **Gamificação fake**: streak fixo em 3, pontos iniciais 420 hardcoded.
7. **"PWA" sem manifest nem service worker** — não instalável, sem offline real.
8. **Segurança**: token admin fraco (`sefaz2026`) versionado; endpoints de seed expostos.
9. **IA sem streaming, sem fallback e sem cache de custo** (toda questão é uma chamada Claude ao vivo).
10. **Cronograma preso à data-base 2026-06-29**.

---

## 4. Especificação do produto alvo (v2)

Produto: plataforma de estudo de legislação para concursos, multi-usuário, com identidade visual própria e nome de trabalho **"LexFlow"** (definitivo a combinar). Paridade funcional com o produto de referência + os diferenciais de IA que já temos.

### 4.1 Funcionalidades (requisitos)

**RF-01 Acervo de leis** — catálogo por área/prioridade; leitor com grifo inteligente por categoria semântica (definição, prazo, proibição, competência, exceção), grifos pessoais sincronizados, anotações por artigo, busca full-text, TTS.

**RF-02 Banco de questões** — questões reais + geradas por IA (com curadoria/aprovação); filtros lei → assunto → subassunto, banca, dificuldade; comentário com grifo verde (fundamento) / vermelho (pegadinha); estatísticas por questão; cadernos de questões do usuário.

**RF-03 Flashcards + SRS** — decks por lei/assunto; criação manual, por IA e a partir de seleção no leitor; algoritmo de repetição espaçada **único (SM-2 simplificado)** compartilhado entre flashcards, artigos e dias de cronograma; fila diária de revisões.

**RF-04 Trilhas/cronogramas** — trilhas por concurso/carreira (a atual SEFAZ-BA vira a primeira trilha); dias com meta (artigos, âncoras, juris); data de início por usuário (elimina data fixa); progresso e revisões integradas ao SRS.

**RF-05 Sessão do Dia (IA)** — mantida e evoluída: streaming de resposta, histórico por sessão no banco, ficha de revisão em PDF.

**RF-06 Simulados** — configuráveis (disciplinas, quantidade, tempo), cronometrados, com questões do banco (prioridade) + IA (complemento); resultado detalhado; histórico.

**RF-07 Ranking e gamificação real** — pontos por eventos auditáveis (tabela de eventos), streak calculado por atividade diária, níveis, ranking semanal/geral opt-in, pódio de simulados.

**RF-08 Jurisprudência** — banco curado + comentário IA cacheado; vinculação a artigos e dias de trilha.

**RF-09 Mapas mentais** — galeria por disciplina, upload (admin) e visualizador; geração assistida por IA como diferencial.

**RF-10 Estatísticas/Dashboard do aluno** — desempenho por lei/assunto, evolução temporal, heatmap de constância, taxa de acerto, tempo de estudo.

**RF-11 Notificações** — push (Web Push) + in-app: lembrete de revisões vencidas, meta diária, streak em risco; preferências por usuário.

**RF-12 Painel administrativo** — gestão de leis/grifos, questões (CRUD + fila de aprovação de conteúdo gerado por IA), trilhas, mapas mentais, jurisprudência, usuários e papéis, logs/auditoria, métricas de uso e custo de IA.

**RF-13 Autenticação e permissões** — email/senha + OAuth Google; papéis `student`, `editor`, `admin`; entitlements por plano (estrutura pronta para free/premium, mesmo que o uso inicial seja um grupo fechado).

**RF-14 Logs e auditoria** — trilha de eventos de domínio (event log), auditoria de ações administrativas, logs estruturados das APIs com custo de IA por chamada.

**RF-15 PWA/Mobile** — PWA real (manifest + service worker, offline para leis/flashcards/fila de revisão, instalável) e empacotamento mobile via Capacitor (mesma base de código) para lojas, se desejado.

### 4.2 Requisitos não funcionais
- **TypeScript** em todo o código; componentes modulares; testes de unidade nas regras de negócio (SRS, pontuação) e testes de integração das APIs.
- Migrations completas e reproduzíveis (ambiente novo sobe com `supabase db reset`).
- RLS em todas as tabelas; secrets fora do repositório; endpoints admin autenticados por papel (não por token fixo).
- IA com streaming, fallback de provedor, cache de resultados e orçamento/observabilidade de custo.
- Acessibilidade (navegação por teclado, contraste AA) e identidade visual própria via design tokens.
- Lighthouse PWA ≥ 90; bundle inicial < 300 KB gzip (code-splitting por rota).
