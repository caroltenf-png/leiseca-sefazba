// api/ai.js — Proxy de IA com debug
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { system, user, maxTokens = 1000 } = req.body || {};
  if (!user) return res.status(400).json({ error: 'Prompt nao informado' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_KEY) {
    const vars = Object.keys(process.env).filter(k => !k.includes('npm') && !k.includes('NODE') && !k.includes('PATH')).slice(0,10);
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY ausente', vars_disponiveis: vars });
  }

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
        system: system || 'Voce e um assistente juridico especializado em concursos fiscais brasileiros.',
        messages: [{ role: 'user', content: user }],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (resp.ok) {
      const data = await resp.json();
      const text = data.content?.[0]?.text || '';
      if (text) return res.status(200).json({ text, provider: 'claude' });
    }

    const errData = await resp.json().catch(() => ({}));
    return res.status(resp.status).json({ error: errData?.error?.message || 'Erro Claude ' + resp.status });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
