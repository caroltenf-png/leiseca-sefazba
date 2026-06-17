// api/lei.js — Vercel Serverless Function
// Proxy para buscar textos de leis do Planalto e SEFAZ-BA

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL não informada' });

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
  try { urlDecoded = decodeURIComponent(url); }
  catch { return res.status(400).json({ error: 'URL inválida' }); }

  if (!permitidos.some(d => urlDecoded.includes(d)))
    return res.status(403).json({ error: 'Domínio não permitido' });

  try {
    const resp = await fetch(urlDecoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeisecaBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) return res.status(resp.status).json({ error: `Erro ${resp.status}` });

    const contentType = resp.headers.get('content-type') || '';

    // PDF — retorna direto
    if (contentType.includes('pdf') || urlDecoded.endsWith('.pdf')) {
      const buffer = await resp.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(buffer));
    }

    // Detectar encoding — Planalto usa ISO-8859-1
    const buffer = await resp.arrayBuffer();
    const rawBuffer = Buffer.from(buffer);

    // Checar se é ISO-8859-1 no header ou no meta charset do HTML
    let encoding = 'utf-8';
    if (contentType.includes('iso-8859-1') || contentType.includes('latin1')) {
      encoding = 'latin1';
    } else {
      // Verificar meta charset no início do HTML
      const inicio = rawBuffer.slice(0, 2000).toString('latin1');
      if (/charset=["']?iso-8859/i.test(inicio) || /charset=["']?windows-1252/i.test(inicio)) {
        encoding = 'latin1';
      }
    }

    // Decodificar com o encoding correto
    const html = rawBuffer.toString(encoding === 'latin1' ? 'latin1' : 'utf8');

    // Converter de latin1 para UTF-8 se necessário
    let texto;
    if (encoding === 'latin1') {
      // Recodificar: latin1 -> Buffer -> utf8
      texto = Buffer.from(html, 'latin1').toString('utf8');
    } else {
      texto = html;
    }

    // Limpar HTML
    texto = texto
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
      .replace(/&atilde;/g, 'ã')
      .replace(/&otilde;/g, 'õ')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&Atilde;/g, 'Ã')
      .replace(/&Otilde;/g, 'Õ')
      .replace(/&Ccedil;/g, 'Ç')
      .replace(/\s{3,}/g, '\n\n')
      .trim();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(texto);

  } catch (err) {
    return res.status(500).json({ error: `Erro: ${err.message}` });
  }
}
