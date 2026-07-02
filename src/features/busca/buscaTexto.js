// ═══════════════════════════════════════════════════════════════════════════
// Busca full-text no acervo: procura o termo dentro do texto das leis
// (embutidas + cache offline), ignorando acentos e maiúsculas, e devolve
// trechos com o artigo mais próximo para contexto. Funções puras.
// ═══════════════════════════════════════════════════════════════════════════

export function normalizar(s) {
  return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function htmlParaTexto(html) {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Retorna [{ leiId, trechos: [{ trecho, artigo }] }]
export function buscarNosTextos(textos, termo, { maxPorLei = 3, contexto = 70 } = {}) {
  const alvo = normalizar(termo).trim();
  if (!alvo || alvo.length < 3) return [];

  const resultados = [];
  for (const [leiId, html] of Object.entries(textos || {})) {
    const texto = htmlParaTexto(html);
    const textoNorm = normalizar(texto);
    const trechos = [];
    let pos = 0;
    while (trechos.length < maxPorLei) {
      const idx = textoNorm.indexOf(alvo, pos);
      if (idx === -1) break;
      const ini = Math.max(0, idx - contexto);
      const fim = Math.min(texto.length, idx + alvo.length + contexto);
      // artigo mais próximo antes da ocorrência
      const antes = texto.slice(0, idx);
      const mArt = antes.match(/Art\.?\s*(\d+[ºo°]?(?:-[A-Z])?)(?![\s\S]*Art\.?\s*\d)/i);
      trechos.push({
        trecho: (ini > 0 ? "…" : "") + texto.slice(ini, fim).trim() + (fim < texto.length ? "…" : ""),
        artigo: mArt ? "Art. " + mArt[1] : null,
        posicao: idx,
      });
      pos = idx + alvo.length;
    }
    if (trechos.length > 0) resultados.push({ leiId, trechos });
  }
  return resultados;
}

// Realça o termo dentro de um trecho (para exibição), sem depender de acentos.
export function realcarTermo(trecho, termo) {
  const alvoNorm = normalizar(termo).trim();
  if (!alvoNorm) return trecho;
  const trechoNorm = normalizar(trecho);
  const idx = trechoNorm.indexOf(alvoNorm);
  if (idx === -1) return trecho;
  return (
    trecho.slice(0, idx) +
    "<mark class=\"m-amarelo\">" + trecho.slice(idx, idx + alvoNorm.length) + "</mark>" +
    trecho.slice(idx + alvoNorm.length)
  );
}
