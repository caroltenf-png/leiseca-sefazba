import { createClient } from "@supabase/supabase-js";

// Chave publishable (anon) — segura para uso no client; acesso real é controlado por RLS
const SUPABASE_URL = "https://aitjobeyandnopaflubf.supabase.co";
const SUPABASE_KEY = "sb_publishable_GEFxHbOygI_EOMkIvAbX-Q_awVV_RT2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
