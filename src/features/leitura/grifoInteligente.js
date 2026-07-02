// ═══════════════════════════════════════════════════════════════════════════
// Grifo inteligente ("Raio-X" da lei): destaca automaticamente, por categoria
// semântica, os trechos que as bancas mais cobram. Funções puras sobre HTML.
// ═══════════════════════════════════════════════════════════════════════════

export const CATEGORIAS_GRIFO = [
  {
    id: "prazo", label: "Prazos", cor: "#4299E1",
    regex: /\b\d+\s*(?:\([a-zçãõéê\s]+\)\s*)?(?:dias?(?:\s+úteis)?|meses|m[eê]s|anos?|horas?|exerc[íi]cios?)\b/gi,
  },
  {
    id: "vedacao", label: "Vedações", cor: "#FC6464",
    regex: /\b(?:é\s+vedad[ao]s?|s[ãa]o\s+vedad[ao]s?|vedad[ao]s?\s+[ao]|n[ãa]o\s+poder[áã]o?|n[ãa]o\s+pode(?:m)?|proibid[ao]s?|n[ãa]o\s+se\s+aplica(?:m)?|n[ãa]o\s+incidir?[áã]?o?)\b/gi,
  },
  {
    id: "definicao", label: "Definições", cor: "#68D391",
    regex: /\b(?:considera(?:m)?-se|entende(?:m)?-se|conceitua-se|para\s+os\s+(?:efeitos|fins)\s+(?:desta|deste|de)\b|equipara(?:m)?-se)/gi,
  },
  {
    id: "competencia", label: "Competências", cor: "#F9C231",
    regex: /\b(?:compete(?:m)?\s+(?:à|ao|aos|às|privativamente)|é\s+da\s+compet[êe]ncia|privativ[ao](?:mente)?|exclusiv[ao](?:mente)?|caber[áã]o?\s+(?:à|ao|aos|às))\b/gi,
  },
  {
    id: "excecao", label: "Exceções", cor: "#ED64A6",
    regex: /\b(?:salvo|exceto|ressalvad[ao]s?|excetuad[ao]s?|desde\s+que|a\s+menos\s+que|independentemente\s+de)\b/gi,
  },
];

// Grifa um trecho de texto puro (sem tags), resolvendo sobreposições:
// vence a categoria que começa primeiro; empate → a de maior extensão.
export function grifarTexto(texto) {
  const matches = [];
  for (const cat of CATEGORIAS_GRIFO) {
    cat.regex.lastIndex = 0;
    for (const m of texto.matchAll(cat.regex)) {
      matches.push({ ini: m.index, fim: m.index + m[0].length, cat: cat.id });
    }
  }
  if (matches.length === 0) return texto;
  matches.sort((a, b) => a.ini - b.ini || b.fim - a.fim);
  let out = "", pos = 0;
  for (const m of matches) {
    if (m.ini < pos) continue; // sobreposição — descarta
    out += texto.slice(pos, m.ini)
        + `<mark class="gi-${m.cat}">` + texto.slice(m.ini, m.fim) + "</mark>";
    pos = m.fim;
  }
  return out + texto.slice(pos);
}

// Aplica o grifo apenas aos nós de texto de um HTML (nunca dentro de tags).
export function aplicarGrifoInteligente(html) {
  if (!html) return html;
  return html
    .split(/(<[^>]*>)/g)
    .map(seg => (seg.startsWith("<") ? seg : grifarTexto(seg)))
    .join("");
}
