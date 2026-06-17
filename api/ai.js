// api/ai.js — Proxy de IA com fallback Claude → OpenAI
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { system, user, maxTokens = 1000 } = req.body || {};
  if (!user) return res.status(400).json({ error: 'Prompt não informado' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const OPENAI_KEY    = process.env.OPENAI_API_KEY;

  // ── Tentativa 1: Claude (Anthropic) ──────────────────────────────────────
  if (ANTHROPIC_KEY) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: maxTokens,
          system: system || 'Você é um assistente jurídico especializado em concursos fiscais brasileiros.',
          messages: [{ role: 'user', content: user }],
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.[0]?.text || '';
        if (text) {
          return res.status(200).json({ text, provider: 'claude' });
        }
      }

      // Se Claude retornou erro de crédito/auth — cair no fallback
      const errData = await resp.json().catch(() => ({}));
      const isCreditErr = resp.status === 429 || resp.status === 402 ||
        errData?.error?.type === 'overloaded_error' ||
        errData?.error?.message?.includes('credit');

      if (!isCreditErr) {
        // Erro não relacionado a crédito — retornar erro
        return res.status(resp.status).json({ error: errData?.error?.message || 'Erro Claude' });
      }
      // Crédito esgotado → fallback OpenAI
    } catch (err) {
      if (!OPENAI_KEY) {
        return res.status(500).json({ error: `Claude indisponível: ${err.message}` });
      }
      // Timeout/rede → fallback OpenAI
    }
  }

  // ── Tentativa 2: OpenAI (fallback) ───────────────────────────────────────
  if (!OPENAI_KEY) {
    return res.status(503).json({
      error: 'Nenhuma API de IA configurada. Configure ANTHROPIC_API_KEY ou OPENAI_API_KEY no Vercel.'
    });
  }

  try {
    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Mais barato, boa qualidade para resumos jurídicos
        max_tokens: maxTokens,
        messages,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(resp.status).json({ error: err.error?.message || 'Erro OpenAI' });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text, provider: 'openai' });

  } catch (err) {
    return res.status(500).json({ error: `Falha no fallback OpenAI: ${err.message}` });
  }
}
