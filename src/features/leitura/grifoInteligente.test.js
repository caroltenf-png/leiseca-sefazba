import { describe, it, expect } from "vitest";
import { grifarTexto, aplicarGrifoInteligente, CATEGORIAS_GRIFO } from "./grifoInteligente.js";

describe("grifarTexto", () => {
  it("marca prazos", () => {
    expect(grifarTexto("no prazo de 30 dias contados"))
      .toContain('<mark class="gi-prazo">30 dias</mark>');
    expect(grifarTexto("decadência em 5 anos")).toContain('gi-prazo');
  });

  it("marca vedações", () => {
    expect(grifarTexto("É vedada a cobrança")).toContain('gi-vedacao');
    expect(grifarTexto("não poderão exigir tributo")).toContain('gi-vedacao');
  });

  it("marca definições", () => {
    expect(grifarTexto("Considera-se ocorrido o fato gerador")).toContain('gi-definicao');
  });

  it("marca competências e exceções", () => {
    expect(grifarTexto("Compete aos Estados instituir")).toContain('gi-competencia');
    expect(grifarTexto("salvo disposição em contrário")).toContain('gi-excecao');
  });

  it("não altera texto sem padrões", () => {
    const t = "O tributo é receita derivada.";
    expect(grifarTexto(t)).toBe(t);
  });

  it("resolve sobreposições sem quebrar o HTML", () => {
    const r = grifarTexto("é vedado exceto quando previsto em 10 dias");
    const abre = (r.match(/<mark/g) || []).length;
    const fecha = (r.match(/<\/mark>/g) || []).length;
    expect(abre).toBe(fecha);
    expect(abre).toBeGreaterThanOrEqual(2);
  });
});

describe("aplicarGrifoInteligente", () => {
  it("não grifa dentro de tags HTML", () => {
    const html = '<p title="30 dias">prazo de 30 dias</p>';
    const r = aplicarGrifoInteligente(html);
    expect(r).toContain('title="30 dias"');
    expect(r).toContain('<mark class="gi-prazo">30 dias</mark>');
  });

  it("preserva estrutura e trata entrada vazia", () => {
    expect(aplicarGrifoInteligente("")).toBe("");
    const html = "<h2>TÍTULO</h2><p><strong>Art. 1º</strong> Compete à União</p>";
    const r = aplicarGrifoInteligente(html);
    expect(r).toContain("<h2>TÍTULO</h2>");
    expect(r).toContain("<strong>Art. 1º</strong>");
  });

  it("toda categoria tem cor e label para a legenda", () => {
    for (const c of CATEGORIAS_GRIFO) {
      expect(c.label).toBeTruthy();
      expect(c.cor).toMatch(/^#/);
    }
  });
});
