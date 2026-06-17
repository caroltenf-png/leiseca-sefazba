// api/lei.js — Vercel Serverless Function
// Proxy para buscar textos de leis do Planalto e SEFAZ-BA
// Evita bloqueio de CORS no browser

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL não informada' });

  // Whitelist de domínios permitidos
  const permitidos = [
    'planalto.gov.br',
    'sefaz.ba.gov.br',
    'mbusca.sefaz.ba.gov.br',
    'legislabahia.ba.gov.br',
    'receita.fazenda.gov.br',
    'camara.leg.br',
    'senado.leg.br',
  ];

  let urlDecoded;
  try {
    urlDecoded = decodeURIComponent(url);
  } catch {
    return res.status(400).json({ error: 'URL inválida' });
  }

  const permitido = permitidos.some(d => urlDecoded.includes(d));
  if (!permitido) return res.status(403).json({ error: 'Domínio não permitido' });

  try {
    const resp = await fetch(urlDecoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeisecaBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `Erro ao buscar lei: ${resp.status}` });
    }

    const contentType = resp.headers.get('content-type') || '';
    
    // PDF — retorna direto
    if (contentType.includes('pdf') || urlDecoded.endsWith('.pdf')) {
      const buffer = await resp.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(buffer));
    }

    // HTML — extrai só o texto relevante
    const html = await resp.text();
    
    // Extração do texto principal (remove nav, scripts, etc.)
    let texto = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{3,}/g, '\n\n')
      .trim();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(texto);

  } catch (err) {
    console.error('Erro proxy lei:', err.message);
    return res.status(500).json({ error: `Erro interno: ${err.message}` });
  }
}
