import { describe, it, expect } from "vitest";
import { buscarNosTextos, normalizar, realcarTermo } from "./buscaTexto.js";

const TEXTOS = {
  ctn: "<h2>TÍTULO I</h2><p><strong>Art. 3º</strong> Tributo é toda prestação pecuniária compulsória.</p><p><strong>Art. 16.</strong> Imposto é o tributo cuja obrigação independe de atividade estatal.</p>",
  lrf: "<p><strong>Art. 1º</strong> Esta lei estabelece normas de finanças públicas.</p>",
};

describe("normalizar", () => {
  it("remove acentos e caixa", () => {
    expect(normalizar("Alíquota MÁXIMA")).toBe("aliquota maxima");
  });
});

describe("buscarNosTextos", () => {
  it("encontra termo ignorando acentos e devolve o artigo", () => {
    const r = buscarNosTextos(TEXTOS, "pecuniaria");
    expect(r).toHaveLength(1);
    expect(r[0].leiId).toBe("ctn");
    expect(r[0].trechos[0].artigo).toBe("Art. 3º");
    expect(r[0].trechos[0].trecho).toContain("pecuniária");
  });

  it("acha múltiplas leis e limita trechos por lei", () => {
    const r = buscarNosTextos(TEXTOS, "lei", { maxPorLei: 1 });
    expect(r.length).toBeGreaterThanOrEqual(1);
    for (const item of r) expect(item.trechos.length).toBeLessThanOrEqual(1);
  });

  it("ignora termos curtos e não acha o inexistente", () => {
    expect(buscarNosTextos(TEXTOS, "ab")).toEqual([]);
    expect(buscarNosTextos(TEXTOS, "zzzznadaver")).toEqual([]);
  });
});

describe("realcarTermo", () => {
  it("envolve o termo em mark mesmo com acentos diferentes", () => {
    const r = realcarTermo("prestação pecuniária compulsória", "pecuniaria");
    expect(r).toContain("<mark");
    expect(r).toContain("pecuniária</mark>");
  });
});
