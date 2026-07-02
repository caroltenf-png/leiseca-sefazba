import { describe, it, expect } from "vitest";
import {
  NOTA, EASE_MIN, EASE_INICIAL, novoItem, revisar, addDias,
  estaVencido, deveArquivar, INTERVALO_ARQUIVAR,
} from "./srs.js";

const HOJE = "2026-07-02";

describe("novoItem", () => {
  it("nasce vencido hoje, sem repetições", () => {
    const item = novoItem(HOJE);
    expect(item.due).toBe(HOJE);
    expect(item.reps).toBe(0);
    expect(item.ease).toBe(EASE_INICIAL);
    expect(estaVencido(item, HOJE)).toBe(true);
  });
});

describe("revisar — escada padrão (nota BOM)", () => {
  it("1ª revisão: +1 dia · 2ª: +3 dias · 3ª: intervalo × ease", () => {
    let item = novoItem(HOJE);
    item = revisar(item, NOTA.BOM, HOJE);
    expect(item.intervalo).toBe(1);
    expect(item.due).toBe(addDias(HOJE, 1));

    item = revisar(item, NOTA.BOM, item.due);
    expect(item.intervalo).toBe(3);

    const antes = item.intervalo;
    item = revisar(item, NOTA.BOM, item.due);
    expect(item.intervalo).toBe(Math.round(antes * EASE_INICIAL)); // 3 × 2.5 ≈ 8
    expect(item.reps).toBe(3);
  });
});

describe("revisar — errar reinicia e penaliza ease", () => {
  it("errei: intervalo volta a 1, reps zera, lapses conta, ease cai", () => {
    let item = novoItem(HOJE);
    item = revisar(item, NOTA.BOM, HOJE);
    item = revisar(item, NOTA.BOM, item.due);
    item = revisar(item, NOTA.ERREI, item.due);
    expect(item.intervalo).toBe(1);
    expect(item.reps).toBe(0);
    expect(item.lapses).toBe(1);
    expect(item.ease).toBeCloseTo(EASE_INICIAL - 0.2);
  });

  it("ease nunca cai abaixo do mínimo", () => {
    let item = novoItem(HOJE);
    for (let i = 0; i < 20; i++) item = revisar(item, NOTA.ERREI, HOJE);
    expect(item.ease).toBe(EASE_MIN);
  });
});

describe("revisar — difícil e fácil ajustam o ritmo", () => {
  it("difícil cresce devagar (×1.2) e reduz ease", () => {
    let item = { ease: 2.5, intervalo: 10, reps: 5, lapses: 0, due: HOJE };
    item = revisar(item, NOTA.DIFICIL, HOJE);
    expect(item.intervalo).toBe(12);
    expect(item.ease).toBeCloseTo(2.35);
  });

  it("fácil acelera (×ease×1.3) e aumenta ease", () => {
    let item = { ease: 2.5, intervalo: 10, reps: 5, lapses: 0, due: HOJE };
    item = revisar(item, NOTA.FACIL, HOJE);
    expect(item.intervalo).toBe(Math.round(10 * 2.5 * 1.3));
    expect(item.ease).toBeCloseTo(2.65);
  });

  it("intervalo sempre avança pelo menos 1 dia", () => {
    let item = { ease: 1.3, intervalo: 1, reps: 3, lapses: 0, due: HOJE };
    item = revisar(item, NOTA.DIFICIL, HOJE);
    expect(item.intervalo).toBeGreaterThanOrEqual(2);
  });
});

describe("arquivamento", () => {
  it("arquiva quando o intervalo consolida (≥ 60 dias)", () => {
    expect(deveArquivar({ intervalo: INTERVALO_ARQUIVAR })).toBe(true);
    expect(deveArquivar({ intervalo: 30 })).toBe(false);
    expect(deveArquivar(null)).toBe(false);
  });
});

describe("estaVencido", () => {
  it("compara datas ISO e trata item sem SRS como vencido", () => {
    expect(estaVencido({ due: "2026-07-01" }, HOJE)).toBe(true);
    expect(estaVencido({ due: HOJE }, HOJE)).toBe(true);
    expect(estaVencido({ due: "2026-07-03" }, HOJE)).toBe(false);
    expect(estaVencido(null, HOJE)).toBe(true);
  });
});
