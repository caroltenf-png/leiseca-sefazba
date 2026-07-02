// api/ai.js — Proxy de IA: Anthropic (principal) com fallback OpenAI.
// Suporta streaming SSE (body.stream = true) com repasse direto dos eventos.
export const config = { supportsResponseStreaming: true };

const SYSTEM_PADRAO = 'Voce e um assistente juridico especializado em concursos fiscais brasileiros.';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { system, user, maxTokens = 1000, stream = false } = req.body || {};
  if (!user) return res.status(400).json({ error: 'Prompt nao informado' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  if (!ANTHROPIC_KEY && !OPENAI_KEY) {
    return res.status(503).json({ error: 'Nenhuma API key de IA configurada no Vercel.' });
  }

  const bodyAnthropic = (comStream) => JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: system || SYSTEM_PADRAO,
    messages: [{ role: 'user', content: user }],
    ...(comStream ? { stream: true } : {}),
  });

  const headersAnthropic = {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
  };

  // ── Streaming SSE ──────────────────────────────────────────────────────
  if (stream && ANTHROPIC_KEY) {
    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: headersAnthropic,
        body: bodyAnthropic(true),
        signal: AbortSignal.timeout(90000),
      });
      if (upstream.ok && upstream.body) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        const reader = upstream.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        return res.end();
      }
      // upstream com erro → segue para o fluxo não-streaming/fallback abaixo
    } catch { /* segue para o fluxo não-streaming/fallback */ }
  }

  // ── Anthropic sem streaming ────────────────────────────────────────────
  let erroAnthropic = null;
  if (ANTHROPIC_KEY) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: headersAnthropic,
        body: bodyAnthropic(false),
        signal: AbortSignal.timeout(30000),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.[0]?.text || '';
        if (text) return res.status(200).json({ text, provider: 'claude' });
      }
      const errData = await resp.json().catch(() => ({}));
      erroAnthropic = errData?.error?.message || 'Erro Claude ' + resp.status;
    } catch (err) {
      erroAnthropic = err.message;
    }
  }

  // ── Fallback OpenAI ────────────────────────────────────────────────────
  if (OPENAI_KEY) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: system || SYSTEM_PADRAO },
            { role: 'user', content: user },
          ],
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content || '';
        if (text) return res.status(200).json({ text, provider: 'openai' });
      }
    } catch { /* cai no erro final */ }
  }

  return res.status(502).json({ error: erroAnthropic || 'Provedores de IA indisponiveis.' });
}
