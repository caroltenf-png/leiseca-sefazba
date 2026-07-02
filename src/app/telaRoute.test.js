import { describe, it, expect } from "vitest";
import { TELAS, telaFromPath, pathFromTela } from "./telaRoute.js";

describe("telaFromPath", () => {
  it("raiz cai no acervo", () => {
    expect(telaFromPath("/")).toBe("acervo");
    expect(telaFromPath("")).toBe("acervo");
    expect(telaFromPath(undefined)).toBe("acervo");
  });

  it("cada tela tem rota própria", () => {
    for (const tela of TELAS) {
      expect(telaFromPath(pathFromTela(tela))).toBe(tela);
    }
  });

  it("rota desconhecida cai no acervo", () => {
    expect(telaFromPath("/nao-existe")).toBe("acervo");
    expect(telaFromPath("/admin/x")).toBe("acervo");
  });

  it("ignora segmentos extras", () => {
    expect(telaFromPath("/questoes/123")).toBe("questoes");
  });
});

describe("pathFromTela", () => {
  it("acervo é a raiz", () => {
    expect(pathFromTela("acervo")).toBe("/");
    expect(pathFromTela("simulado")).toBe("/simulado");
  });
});
