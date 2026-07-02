import { supabase } from "./supabaseClient.js";

// Sincronização dos dados do usuário (flashcards, marcações, anotações, stats)
// com a tabela user_dados. O localStorage continua como cache offline; o
// Supabase passa a ser a fonte de verdade entre dispositivos.

export async function pullUserData(userId) {
  try {
    const { data, error } = await supabase
      .from("user_dados")
      .select("flashcards, marcacoes, anotacoes, stats")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) { console.warn("pullUserData:", error.message); return { ok: false }; }
    return { ok: true, dados: data }; // dados === null → primeiro login neste app
  } catch (e) {
    console.warn("pullUserData:", e.message);
    return { ok: false };
  }
}

// Push com debounce: acumula campos alterados e faz um único upsert.
let pendente = {};
let timer = null;

export function pushUserData(userId, parcial, delayMs = 2000) {
  pendente = { ...pendente, ...parcial };
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    const payload = { user_id: userId, ...pendente, atualizado_em: new Date().toISOString() };
    pendente = {};
    timer = null;
    try {
      const { error } = await supabase
        .from("user_dados")
        .upsert(payload, { onConflict: "user_id" });
      if (error) console.warn("pushUserData:", error.message);
    } catch (e) {
      console.warn("pushUserData:", e.message);
    }
  }, delayMs);
}
