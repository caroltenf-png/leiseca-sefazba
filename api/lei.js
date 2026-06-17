export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL nao informada' });

  const permitidos = [
    'planalto.gov.br','sefaz.ba.gov.br','mbusca.sefaz.ba.gov.br',
    'legislabahia.ba.gov.br','receita.fazenda.gov.br','camara.leg.br','senado.leg.br',
  ];

  let urlDecoded;
  try { urlDecoded = decodeURIComponent(url); }
  catch { return res.status(400).json({ error: 'URL invalida' }); }

  if (!permitidos.some(d => urlDecoded.includes(d)))
    return res.status(403).json({ error: 'Dominio nao permitido' });

  try {
    const resp = await fetch(urlDecoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Accept-Charset': 'utf-8, iso-8859-1;q=0.5',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) return res.status(resp.status).json({ error: `Erro ${resp.status}` });

    const contentType = resp.headers.get('content-type') || '';

    if (contentType.includes('pdf') || urlDecoded.endsWith('.pdf')) {
      const buffer = await resp.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(buffer));
    }

    // Pegar bytes brutos
    const arrayBuf = await resp.arrayBuffer();
    const rawBytes  = Buffer.from(arrayBuf);

    // Detectar encoding pelo Content-Type ou meta charset
    const inicio = rawBytes.slice(0, 3000).toString('binary');
    const isLatin1 = 
      contentType.includes('iso-8859') ||
      contentType.includes('latin1')   ||
      contentType.includes('windows-1252') ||
      /charset=["']?iso-8859/i.test(inicio) ||
      /charset=["']?windows-1252/i.test(inicio);

    // Decodificar corretamente
    // Node.js TextDecoder suporta iso-8859-1 nativamente
    let html;
    if (isLatin1) {
      const decoder = new TextDecoder('iso-8859-1');
      html = decoder.decode(arrayBuf);
    } else {
      const decoder = new TextDecoder('utf-8');
      html = decoder.decode(arrayBuf);
    }

    // Limpar HTML e converter entidades HTML para caracteres reais
    let texto = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      // Entidades HTML completas
      .replace(/&nbsp;/g,    ' ')
      .replace(/&amp;/g,     '&')
      .replace(/&lt;/g,      '<')
      .replace(/&gt;/g,      '>')
      .replace(/&quot;/g,    '"')
      .replace(/&#39;/g,     "'")
      .replace(/&aacute;/g,  'á').replace(/&Aacute;/g,  'Á')
      .replace(/&agrave;/g,  'à').replace(/&Agrave;/g,  'À')
      .replace(/&acirc;/g,   'â').replace(/&Acirc;/g,   'Â')
      .replace(/&atilde;/g,  'ã').replace(/&Atilde;/g,  'Ã')
      .replace(/&eacute;/g,  'é').replace(/&Eacute;/g,  'É')
      .replace(/&ecirc;/g,   'ê').replace(/&Ecirc;/g,   'Ê')
      .replace(/&iacute;/g,  'í').replace(/&Iacute;/g,  'Í')
      .replace(/&oacute;/g,  'ó').replace(/&Oacute;/g,  'Ó')
      .replace(/&ocirc;/g,   'ô').replace(/&Ocirc;/g,   'Ô')
      .replace(/&otilde;/g,  'õ').replace(/&Otilde;/g,  'Õ')
      .replace(/&uacute;/g,  'ú').replace(/&Uacute;/g,  'Ú')
      .replace(/&ucirc;/g,   'û').replace(/&Ucirc;/g,   'Û')
      .replace(/&ccedil;/g,  'ç').replace(/&Ccedil;/g,  'Ç')
      .replace(/&#(\d+);/g,  (_, n) => String.fromCharCode(parseInt(n)))
      .replace(/&#x([\da-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\s{3,}/g, '\n\n')
      .trim();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(texto);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
