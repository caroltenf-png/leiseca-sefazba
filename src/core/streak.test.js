import { describe, it, expect } from "vitest";
import { marcarAtividade, calcularStreak, podarAtividade } from "./streak.js";

const HOJE = "2026-07-02";

describe("calcularStreak", () => {
  it("zero sem nenhuma atividade", () => {
    expect(calcularStreak({}, HOJE)).toBe(0);
    expect(calcularStreak(null, HOJE)).toBe(0);
  });

  it("conta dias consecutivos terminando hoje", () => {
    const a = { "2026-06-30": true, "2026-07-01": true, "2026-07-02": true };
    expect(calcularStreak(a, HOJE)).toBe(3);
  });

  it("sem atividade hoje, a sequência até ontem ainda vale", () => {
    const a = { "2026-06-30": true, "2026-07-01": true };
    expect(calcularStreak(a, HOJE)).toBe(2);
  });

  it("um dia sem estudar quebra a sequência", () => {
    const a = { "2026-06-28": true, "2026-06-29": true, "2026-07-02": true };
    expect(calcularStreak(a, HOJE)).toBe(1);
  });

  it("dois dias parado zera", () => {
    const a = { "2026-06-29": true, "2026-06-30": true };
    expect(calcularStreak(a, HOJE)).toBe(0);
  });
});

describe("marcarAtividade", () => {
  it("marca hoje e é idempotente", () => {
    const a = marcarAtividade({}, HOJE);
    expect(a[HOJE]).toBe(true);
    expect(marcarAtividade(a, HOJE)).toBe(a);
  });
});

describe("podarAtividade", () => {
  it("descarta dias além da janela", () => {
    const a = { "2020-01-01": true, [HOJE]: true };
    const podado = podarAtividade(a, HOJE);
    expect(podado["2020-01-01"]).toBeUndefined();
    expect(podado[HOJE]).toBe(true);
  });
});
