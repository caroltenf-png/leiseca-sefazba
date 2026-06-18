// api/setup.js — cria tabela cache_questoes E popula com questões reais FGV
// Chame UMA VEZ: https://leiseca-sefazba.vercel.app/api/setup?token=sefaz2026

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.query.token !== "sefaz2026") {
    return res.status(401).json({ error: "Token inválido. Use ?token=sefaz2026" });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
    || process.env.VITE_SUPABASE_ANON_KEY
    || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no Vercel" });
  }

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  // PASSO 1: Criar tabela via Supabase REST SQL endpoint
  const createSQL = `
    CREATE TABLE IF NOT EXISTS public.cache_questoes (
      id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      disciplina    text NOT NULL,
      tema          text,
      dificuldade   text DEFAULT 'Médio',
      enunciado     text NOT NULL,
      alternativas  jsonb NOT NULL,
      gabarito      text NOT NULL,
      fundamentacao text,
      explicacao_gabarito    text,
      explicacao_distratores jsonb,
      dica_prova    text,
      origem        text DEFAULT 'ia',
      prova_referencia text,
      gerado_por    uuid,
      aprovado      boolean DEFAULT true,
      criado_em     timestamptz DEFAULT now()
    );
    ALTER TABLE public.cache_questoes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "leitura_publica" ON public.cache_questoes;
    CREATE POLICY "leitura_publica" ON public.cache_questoes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "insercao_service" ON public.cache_questoes;
    CREATE POLICY "insercao_service" ON public.cache_questoes FOR INSERT WITH CHECK (true);
  `;

  let createResult = null;
  try {
    const sqlResp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ query: createSQL })
    });
    createResult = { status: sqlResp.status, ok: sqlResp.ok, body: await sqlResp.text() };
  } catch(e) {
    createResult = { ok: false, erro: e.message };
  }

  // PASSO 2: Se RPC não funcionou, tenta via pg_dump workaround — direto no INSERT
  // A tabela pode não existir ainda. Vamos tentar criar via Management API do Supabase
  if (!createResult.ok) {
    try {
      // Tenta via Management API
      const projectRef = SUPABASE_URL.replace("https://","").replace(".supabase.co","");
      const mgmtResp = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: createSQL })
      });
      createResult = { ...createResult, mgmt_status: mgmtResp.status, mgmt_body: await mgmtResp.text() };
    } catch(e2) {
      createResult = { ...createResult, mgmt_erro: e2.message };
    }
  }

  return res.status(200).json({
    passo1_criar_tabela: createResult,
    instrucao: createResult.ok
      ? "✅ Tabela criada! Agora chame /api/seed?token=sefaz2026 para popular as questões."
      : "⚠️ Não foi possível criar a tabela automaticamente. Execute o SQL abaixo no Supabase → SQL Editor:",
    sql_para_executar: `
-- Cole isso no Supabase → SQL Editor → Run
CREATE TABLE IF NOT EXISTS public.cache_questoes (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  disciplina    text NOT NULL,
  tema          text,
  dificuldade   text DEFAULT 'Médio',
  enunciado     text NOT NULL,
  alternativas  jsonb NOT NULL,
  gabarito      text NOT NULL,
  fundamentacao text,
  explicacao_gabarito    text,
  explicacao_distratores jsonb,
  dica_prova    text,
  origem        text DEFAULT 'ia',
  prova_referencia text,
  gerado_por    uuid,
  aprovado      boolean DEFAULT true,
  criado_em     timestamptz DEFAULT now()
);
ALTER TABLE public.cache_questoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "leitura_publica" ON public.cache_questoes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "insercao_service" ON public.cache_questoes FOR INSERT WITH CHECK (true);
    `.trim()
  });
}
