import { addDias } from "./srs.js";

// ═══════════════════════════════════════════════════════════════════════════
// Streak real: sequência de dias consecutivos com atividade (ganho de pontos).
// `atividade` é um mapa { "2026-07-02": true, ... } guardado em stats.
// ═══════════════════════════════════════════════════════════════════════════

export function marcarAtividade(atividade, hojeIso) {
  if (atividade?.[hojeIso]) return atividade;
  return { ...(atividade || {}), [hojeIso]: true };
}

export function calcularStreak(atividade, hojeIso) {
  if (!atividade) return 0;
  // Sem atividade hoje ainda: a sequência que termina ontem continua válida
  let d = atividade[hojeIso] ? hojeIso : addDias(hojeIso, -1);
  let streak = 0;
  while (atividade[d]) { streak++; d = addDias(d, -1); }
  return streak;
}

// Mantém só os últimos N dias para o mapa não crescer para sempre
export function podarAtividade(atividade, hojeIso, manterDias = 400) {
  if (!atividade) return {};
  const limite = addDias(hojeIso, -manterDias);
  return Object.fromEntries(Object.entries(atividade).filter(([dia]) => dia >= limite));
}
