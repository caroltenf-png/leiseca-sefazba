// ═══════════════════════════════════════════════════════════════════════════
// SRS — repetição espaçada unificada (SM-2 simplificado)
// Usado por flashcards E pelas revisões do cronograma. Funções puras.
//
// Notas: 0 = errei/esqueci · 1 = difícil · 2 = bom · 3 = fácil
// ═══════════════════════════════════════════════════════════════════════════

export const NOTA = { ERREI: 0, DIFICIL: 1, BOM: 2, FACIL: 3 };

export const EASE_MIN = 1.3;
export const EASE_MAX = 3.0;
export const EASE_INICIAL = 2.5;

// Intervalo (em dias) a partir do qual o item é considerado consolidado
// e pode ser arquivado da fila de revisões.
export const INTERVALO_ARQUIVAR = 60;

export function novoItem(hojeIso) {
  return { ease: EASE_INICIAL, intervalo: 0, reps: 0, lapses: 0, due: hojeIso };
}

export function addDias(iso, dias) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function hojeISO(agora = new Date()) {
  return agora.toISOString().slice(0, 10);
}

export function estaVencido(item, hojeIso) {
  return !item || !item.due || item.due <= hojeIso;
}

export function revisar(item, nota, hojeIso) {
  let { ease = EASE_INICIAL, intervalo = 0, reps = 0, lapses = 0 } = item || {};

  if (nota === NOTA.ERREI) {
    lapses += 1;
    reps = 0;
    ease = Math.max(EASE_MIN, ease - 0.2);
    intervalo = 1;
  } else {
    reps += 1;
    if (reps === 1) {
      intervalo = 1;
    } else if (reps === 2) {
      intervalo = nota === NOTA.FACIL ? 4 : 3;
    } else {
      const fator = nota === NOTA.DIFICIL ? 1.2 : nota === NOTA.BOM ? ease : ease * 1.3;
      intervalo = Math.max(intervalo + 1, Math.round(intervalo * fator));
    }
    if (nota === NOTA.DIFICIL) ease = Math.max(EASE_MIN, ease - 0.15);
    if (nota === NOTA.FACIL)   ease = Math.min(EASE_MAX, ease + 0.15);
  }

  return { ease, intervalo, reps, lapses, due: addDias(hojeIso, intervalo) };
}

export function deveArquivar(item) {
  return (item?.intervalo || 0) >= INTERVALO_ARQUIVAR;
}
