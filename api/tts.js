// api/tts.js — OpenAI TTS serverless
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'API key não configurada' });

  const { texto, voz = 'nova', velocidade = 1.0 } = req.body || {};
  if (!texto) return res.status(400).json({ error: 'Texto não informado' });

  // Limitar tamanho — OpenAI TTS aceita até 4096 chars por chamada
  const textoCortado = texto.slice(0, 4000);

  try {
    const resp = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: textoCortado,
        voice: voz,       // nova (feminina BR-friendly), alloy, echo, fable, onyx, shimmer
        speed: Math.min(Math.max(velocidade, 0.25), 4.0),
        response_format: 'mp3',
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      const err = await resp.json();
      return res.status(resp.status).json({ error: err.error?.message || 'Erro OpenAI' });
    }

    const buffer = await resp.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
