// Mapeamento URL ↔ tela ativa. Fonte única das rotas do app.
export const TELAS = [
  "acervo", "leitura", "questoes", "cronograma", "sessao",
  "flashcards", "ia", "guias", "juris", "simulado", "dashboard", "admin",
];

export function telaFromPath(pathname) {
  const seg = (pathname || "/").split("/").filter(Boolean)[0] || "acervo";
  return TELAS.includes(seg) ? seg : "acervo";
}

export function pathFromTela(tela) {
  return tela === "acervo" ? "/" : `/${tela}`;
}
