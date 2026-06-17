# Scripts de Seed — Questões FGV

## seed_questoes.js

Insere questões reais FGV no banco Supabase (tabela `cache_questoes`).

### Uso

```bash
# Com service_role key (necessária para bypass de RLS)
SUPABASE_URL=https://aitjobeyandnopaflubf.supabase.co \
SUPABASE_KEY=sua_service_role_key \
node scripts/seed_questoes.js
```

### O que insere

| Disciplina | Questões |
|---|---|
| Direito Constitucional | 8 |
| Direito Tributário | 10 |
| Direito Administrativo | 6 |
| Contabilidade Geral | 6 |
| Auditoria | 6 |
| **Total** | **36** |

### Fontes

- FGV · SEFAZ-AM 2022 (Prova I e II)
- FGV · SEFAZ-ES 2021
- FGV · Receita Federal 2023
- FGV · CGU 2022
- FGV · SEFAZ-PR 2025

### Observações

- As questões são inseridas com `origem = 'fgv_real'`
- Seguras para re-execução (INSERT sem upsert — verifica duplicatas pelo enunciado antes de rodar duas vezes)
- A migration SQL equivalente está em `supabase/migrations/20260617_seed_questoes_fgv.sql`
