import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://aitjobeyandnopaflubf.supabase.co";
const SUPABASE_KEY = "sb_publishable_GEFxHbOygI_EOMkIvAbX-Q_awVV_RT2";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── COMPONENTE: TELA DE LOGIN ────────────────────────────────────────────────
function TelaAuth({ onLogin }) {
  const [modo, setModo]         = useState("login"); // login | cadastro | recuperar
  const [email, setEmail]       = useState("");
  const [senha, setSenha]       = useState("");
  const [nome, setNome]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [erro, setErro]         = useState("");
  const [sucesso, setSucesso]   = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setErro("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
    else onLogin(data.user);
    setLoading(false);
  }

  async function handleCadastro(e) {
    e.preventDefault();
    if (!nome.trim()) { setErro("Informe seu nome."); return; }
    setLoading(true); setErro("");
    const { data, error } = await supabase.auth.signUp({
      email, password: senha,
      options: { data: { nome } }
    });
    if (error) setErro(error.message);
    else setSucesso("Cadastro realizado! Verifique seu e-mail para confirmar.");
    setLoading(false);
  }

  async function handleRecuperar(e) {
    e.preventDefault();
    setLoading(true); setErro("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setErro(error.message);
    else setSucesso("Link de recuperação enviado para o seu e-mail.");
    setLoading(false);
  }

  return (
    <div style={{
      minHeight:"100dvh", background:T.fundo,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"24px 20px"
    }}>
      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>⚖️</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:"#fff", marginBottom:6 }}>Lei Seca SEFAZ-BA</h1>
        <p style={{ fontSize:13, color:T.cinza3, lineHeight:1.6 }}>Plataforma de estudos para Auditor Fiscal</p>
      </div>

      {/* Card */}
      <div style={{
        background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:16,
        padding:"28px 24px", width:"100%", maxWidth:380
      }}>
        {/* Tabs */}
        {modo !== "recuperar" && (
          <div style={{ display:"flex", gap:8, marginBottom:22 }}>
            {["login","cadastro"].map(m => (
              <button key={m} onClick={() => { setModo(m); setErro(""); setSucesso(""); }} style={{
                flex:1, padding:"9px", borderRadius:9, fontSize:13, fontWeight:700,
                background: modo===m ? `rgba(0,107,63,0.2)` : "transparent",
                border: `1px solid ${modo===m ? "rgba(0,107,63,0.5)" : T.borda2}`,
                color: modo===m ? T.verde3 : T.cinza3, cursor:"pointer"
              }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={modo==="login"?handleLogin:modo==="cadastro"?handleCadastro:handleRecuperar}>
          {modo === "cadastro" && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.cinza3, display:"block", marginBottom:5 }}>Nome</label>
              <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo" required
                style={{ width:"100%", background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:9,
                  padding:"11px 14px", color:T.branco, fontSize:14, outline:"none" }} />
            </div>
          )}

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:T.cinza3, display:"block", marginBottom:5 }}>E-mail</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" required
              style={{ width:"100%", background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:9,
                padding:"11px 14px", color:T.branco, fontSize:14, outline:"none" }} />
          </div>

          {modo !== "recuperar" && (
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, fontWeight:700, color:T.cinza3, display:"block", marginBottom:5 }}>Senha</label>
              <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="••••••••" required minLength={6}
                style={{ width:"100%", background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:9,
                  padding:"11px 14px", color:T.branco, fontSize:14, outline:"none" }} />
              {modo === "login" && (
                <button type="button" onClick={() => { setModo("recuperar"); setErro(""); setSucesso(""); }}
                  style={{ background:"none", border:"none", color:T.cinza3, fontSize:11, marginTop:6, cursor:"pointer", textDecoration:"underline" }}>
                  Esqueci a senha
                </button>
              )}
            </div>
          )}

          {erro && (
            <div style={{ background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.3)", borderRadius:8,
              padding:"9px 12px", fontSize:12, color:"#FCA5A5", marginBottom:14 }}>
              {erro}
            </div>
          )}
          {sucesso && (
            <div style={{ background:"rgba(0,107,63,0.12)", border:"1px solid rgba(0,107,63,0.35)", borderRadius:8,
              padding:"9px 12px", fontSize:12, color:T.verde3, marginBottom:14 }}>
              {sucesso}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width:"100%", padding:"13px", borderRadius:10, fontWeight:800, fontSize:15,
            background: loading ? T.fundo2 : `linear-gradient(135deg,${T.verde},${T.verde2})`,
            color: loading ? T.cinza3 : "#fff",
            boxShadow: loading ? "none" : `0 6px 24px rgba(0,107,63,0.3)`,
            cursor: loading ? "not-allowed" : "pointer", border:"none"
          }}>
            {loading ? "Aguarde…" : modo==="login" ? "Entrar" : modo==="cadastro" ? "Criar conta" : "Enviar link"}
          </button>

          {modo === "recuperar" && (
            <button type="button" onClick={() => { setModo("login"); setErro(""); setSucesso(""); }}
              style={{ width:"100%", marginTop:10, padding:"10px", background:"transparent",
                border:`1px solid ${T.borda2}`, borderRadius:9, color:T.cinza3, fontSize:13, cursor:"pointer" }}>
              ← Voltar ao login
            </button>
          )}
        </form>
      </div>

      <p style={{ fontSize:11, color:T.cinza3, marginTop:20, textAlign:"center", lineHeight:1.6 }}>
        Plataforma de uso interno — grupo de estudo SEFAZ-BA 2026
      </p>
    </div>
  );
}

// ─── HOOK: detecta mobile ──────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ─── HOOK: status de conexão ──────────────────────────────────────────────
function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

// ─── PALETA ────────────────────────────────────────────────────────────────
const T = {
  fundo:"#070F1A", fundo2:"#0D1B2A", fundo3:"#111E2E",
  verde:"#006B3F", verde2:"#00A65A", verde3:"#68D391",
  amarelo:"#F9C231", cinza3:"#8BA7BF", branco:"#F4F8FB",
  borda:"rgba(249,194,49,0.15)", borda2:"rgba(255,255,255,0.07)",
  red:"#E53E3E", orange:"#ED8936",
};

// ─── LEIS ─────────────────────────────────────────────────────────────────
const LEIS = [
  // ── LEGISLAÇÃO FEDERAL TRIBUTÁRIA ──
  { id:"ctn",       nome:"CTN — Código Tributário Nacional",            area:"Tributário",         emoji:"💰", prioridade:3, destaque:"Obrigação, crédito, lançamento, extinção — mais cobrado", url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm" },
  { id:"cf88_trib", nome:"CF/88 — Arts. Tributários (145–162)",        area:"Tributário",         emoji:"🏛️", prioridade:3, destaque:"Competência, imunidades, princípios constitucionais",    url:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" },
  { id:"lkandir",   nome:"LC 87/96 — Lei Kandir (ICMS)",               area:"Tributário",         emoji:"🔄", prioridade:3, destaque:"Fato gerador ICMS, base de cálculo, ST, não-cumulatividade", url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm" },
  { id:"lc24",      nome:"LC 24/75 — Isenções ICMS / CONFAZ",         area:"Tributário",         emoji:"🤝", prioridade:3, destaque:"Convênios CONFAZ, guerra fiscal, benefícios ICMS",       url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm" },
  { id:"ec132",     nome:"EC 132/23 — Reforma Tributária",             area:"Tributário",         emoji:"⚡", prioridade:3, destaque:"Extinção ICMS/ISS, criação IBS/CBS/IS",                  url:"https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm" },
  { id:"paf",       nome:"Dec. 70.235/72 — Processo Adm. Fiscal",      area:"Tributário",         emoji:"📁", prioridade:3, destaque:"Auto de infração, impugnação, recurso, CARF",            url:"https://www.planalto.gov.br/ccivil_03/decreto/d70235cons.htm" },
  { id:"lc214",     nome:"LC 214/25 — Reforma Tributária (IBS/CBS)",   area:"Tributário",         emoji:"🔥", prioridade:3, destaque:"IBS, CBS, IS — substitutos do ICMS/ISS/IPI",             url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm" },
  { id:"lrf",       nome:"LC 101/00 — Lei de Responsabilidade Fiscal", area:"Financeiro",         emoji:"📊", prioridade:3, destaque:"Limites de gastos, dívida pública, receita corrente líquida", url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm" },
  { id:"lei4320",   nome:"Lei 4.320/64 — Normas Dir. Financeiro",      area:"Financeiro",         emoji:"📈", prioridade:3, destaque:"Orçamento público, receita, despesa, restos a pagar",    url:"https://www.planalto.gov.br/ccivil_03/leis/l4320.htm" },
  { id:"lei9613",   nome:"Lei 9.613/98 — Lavagem de Dinheiro",         area:"Penal Tributário",   emoji:"💸", prioridade:3, destaque:"Lavagem, ocultação, COAF, operações suspeitas",          url:"https://www.planalto.gov.br/ccivil_03/leis/l9613.htm" },
  { id:"lei8112",   nome:"Lei 8.112/90 — Estatuto Servidores Federais",area:"Administrativo",     emoji:"👔", prioridade:3, destaque:"Direitos, deveres, disciplina, PAD",                     url:"https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm" },
  { id:"lei9784",   nome:"Lei 9.784/99 — Processo Administrativo",     area:"Administrativo",     emoji:"📋", prioridade:3, destaque:"Princípios, prazos, recursos, contraditório",            url:"https://www.planalto.gov.br/ccivil_03/leis/l9784.htm" },
  { id:"lc116",     nome:"LC 116/03 — ISS",                            area:"Tributário",         emoji:"🏙️", prioridade:2, destaque:"Lista de serviços, base de cálculo, local de recolhimento", url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm" },
  { id:"lc123",     nome:"LC 123/06 — Simples Nacional",               area:"Tributário",         emoji:"🏪", prioridade:2, destaque:"Regime unificado MEI/ME/EPP, exclusão, fiscalização",    url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm" },
  { id:"lef",       nome:"Lei 6.830/80 — Execução Fiscal",             area:"Tributário",         emoji:"⚖️", prioridade:2, destaque:"CDA, penhora, embargos à execução fiscal",              url:"https://www.planalto.gov.br/ccivil_03/leis/l6830.htm" },
  { id:"crimes",    nome:"Lei 8.137/90 — Crimes Tributários",          area:"Penal Tributário",   emoji:"🚨", prioridade:2, destaque:"Sonegação fiscal, fraude, cumplicidade",                 url:"https://www.planalto.gov.br/ccivil_03/leis/l8137.htm" },
  { id:"lei8429",   nome:"Lei 8.429/92 — Improbidade Administrativa",  area:"Administrativo",     emoji:"🔍", prioridade:2, destaque:"Enriquecimento ilícito, dano ao erário",                 url:"https://www.planalto.gov.br/ccivil_03/leis/l8429.htm" },
  { id:"lei14133",  nome:"Lei 14.133/21 — Nova Lei de Licitações",     area:"Administrativo",     emoji:"🏗️", prioridade:2, destaque:"Pregão, concorrência, dispensa",                       url:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm" },

  // ── SEFAZ-BA · ICMS ──
  { id:"ba_lei7014",  nome:"Lei 7.014/96 — ICMS Bahia",                    area:"SEFAZ-BA · ICMS",        emoji:"⚡", prioridade:3, destaque:"Lei mãe do ICMS-BA: fato gerador, alíquotas, isenções — núcleo da prova", url:"https://mbusca.sefaz.ba.gov.br/DITRI/leis/leis_estaduais/legest_1996_7014_icms_texto_atual.pdf" },
  { id:"ba_ricms",    nome:"Dec. 13.780/12 — RICMS/BA",                    area:"SEFAZ-BA · ICMS",        emoji:"📘", prioridade:3, destaque:"Regulamento completo: NF-e, ST, DIFAL, regimes especiais, CFOP",          url:"https://mbusca.sefaz.ba.gov.br/DITRI/normas_complementares/decretos/decreto_2012_13780_ricms_texto_2021.pdf" },
  { id:"ba_ricms_st", nome:"RICMS/BA — Anexo 01: Substituição Tributária", area:"SEFAZ-BA · ICMS",        emoji:"🔄", prioridade:3, destaque:"Produtos sujeitos ao ICMS-ST, MVA, protocolos e convênios vigentes 2026", url:"https://www.sefaz.ba.gov.br/legislacao/textos-legais/" },
  { id:"ba_nfe",      nome:"NF-e e Documentos Fiscais — RICMS/BA",         area:"SEFAZ-BA · ICMS",        emoji:"🧾", prioridade:2, destaque:"Emissão NF-e, NFC-e, CT-e, MDF-e, AIDF, SPED — obrigações acessórias",   url:"https://mbusca.sefaz.ba.gov.br/DITRI/normas_complementares/decretos/decreto_2012_13780_ricms_texto_2021.pdf" },

  // ── SEFAZ-BA · TRIBUTÁRIO ──
  { id:"ba_lei3956",  nome:"Lei 3.956/81 — Código Tributário do Estado (CTB)", area:"SEFAZ-BA · Tributário", emoji:"📜", prioridade:3, destaque:"Obrigação, lançamento, crédito, decadência, prescrição e infrações BA", url:"https://mbusca.sefaz.ba.gov.br/DITRI/leis/leis_estaduais/legest_1981_3956_codtribbahia_texto.pdf" },
  { id:"ba_dec7629",  nome:"Dec. 7.629/99 — PAT/BA",                          area:"SEFAZ-BA · Tributário", emoji:"📁", prioridade:3, destaque:"Auto de infração, impugnação, recurso, Conselho de Fazenda Estadual BA", url:"https://mbusca.sefaz.ba.gov.br/DITRI/normas_complementares/decretos/decreto_1999_7629_pat_texto.pdf" },
  { id:"ba_lei6348",  nome:"Lei 6.348/91 — IPVA Bahia",                       area:"SEFAZ-BA · Tributário", emoji:"🚗", prioridade:2, destaque:"Fato gerador, base de cálculo, alíquotas (1% a 3,5%), isenções, pagamento", url:"https://mbusca.sefaz.ba.gov.br/DITRI/leis/leis_estaduais/legest_1991_6348_ipva_texto.pdf" },
  { id:"ba_lei4826",  nome:"Lei 4.826/89 — ITD Bahia (ITCMD)",                area:"SEFAZ-BA · Tributário", emoji:"🏠", prioridade:2, destaque:"Transmissão causa mortis e doação: alíquotas, base de cálculo, progressividade", url:"https://mbusca.sefaz.ba.gov.br/DITRI/leis/leis_estaduais/legest_1989_4826_itd_texto.pdf" },
  { id:"ba_lei11631", nome:"Lei 11.631/09 — Taxas Estaduais Bahia",           area:"SEFAZ-BA · Tributário", emoji:"💳", prioridade:2, destaque:"Taxas pelo exercício do poder de polícia e prestação de serviços — BA",   url:"https://mbusca.sefaz.ba.gov.br/DITRI/leis/leis_estaduais/legest_2009_11631_taxas_texto.pdf" },
  { id:"ba_ce",       nome:"Constituição do Estado da Bahia (1989)",          area:"SEFAZ-BA · Tributário", emoji:"🏛️", prioridade:2, destaque:"Arts. tributários: competência, ICMS-BA, repartição de receitas, fundos", url:"https://www.legislabahia.ba.gov.br/documentos/constituicao-do-estado-da-bahia-de-5-de-outubro-de-1989" },

  // ── SEFAZ-BA · ADMINISTRATIVO ──
  { id:"ba_lei6677",  nome:"Lei 6.677/94 — Estatuto Servidores Bahia",       area:"SEFAZ-BA · Administrativo", emoji:"👔", prioridade:2, destaque:"Direitos, deveres, responsabilidades e disciplina dos servidores-BA", url:"https://www.legislabahia.ba.gov.br/documentos/lei-no-6677-de-26-de-setembro-de-1994" },
  { id:"ba_lei7800",  nome:"Lei 7.800/01 — Carreira Auditor Fiscal SEFAZ-BA",area:"SEFAZ-BA · Administrativo", emoji:"🎖️", prioridade:2, destaque:"Estrutura de carreira, classes, vencimentos, gratificação fiscal",  url:"https://www.legislabahia.ba.gov.br/documentos/lei-no-7800-de-13-de-fevereiro-de-2001" },
];

const AREAS = [
  "Todas","SEFAZ-BA · ICMS","SEFAZ-BA · Tributário","SEFAZ-BA · Administrativo",
  "Tributário","Financeiro","Penal Tributário","Administrativo",
];

// ─── CACHE DE LEIS (offline) ───────────────────────────────────────────────
const CACHE_KEY = "leis_cache_v1";
function getCacheTexto(id) {
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)||"{}"); return c[id]||null; } catch { return null; }
}
function setCacheTexto(id, texto) {
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)||"{}"); c[id]=texto; localStorage.setItem(CACHE_KEY,JSON.stringify(c)); } catch {}
}

// ─── CORES DE MARCAÇÃO ────────────────────────────────────────────────────
const MARK_COLORS = [
  { id:"amarelo", label:"Dourado",  bg:"rgba(249,194,49,0.35)",  border:"#F9C231" },
  { id:"verde",   label:"Verde",    bg:"rgba(0,166,90,0.3)",     border:"#00A65A" },
  { id:"azul",    label:"Azul",     bg:"rgba(66,153,225,0.3)",   border:"#4299E1" },
  { id:"rosa",    label:"Rosa",     bg:"rgba(237,100,166,0.3)",  border:"#ED64A6" },
  { id:"red",     label:"Vermelho", bg:"rgba(229,62,62,0.3)",    border:"#E53E3E" },
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────
function Badge({ children, color="verde", style={} }) {
  const map = {
    verde:   { bg:"rgba(0,107,63,0.15)",   border:"rgba(0,107,63,0.4)",    color:T.verde2 },
    amarelo: { bg:"rgba(249,194,49,0.10)", border:"rgba(249,194,49,0.3)",  color:T.amarelo },
    cinza:   { bg:"rgba(255,255,255,0.06)",border:T.borda2,                color:T.cinza3 },
    red:     { bg:"rgba(229,62,62,0.12)",  border:"rgba(229,62,62,0.3)",   color:"#FCA5A5" },
  };
  const s = map[color]||map.verde;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:5,background:s.bg,border:`1px solid ${s.border}`,borderRadius:100,padding:"3px 11px",fontSize:11,fontWeight:700,color:s.color,...style }}>{children}</span>;
}

function Spinner({ label="" }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:48,gap:14 }}>
      <div style={{ width:36,height:36,borderRadius:"50%",border:`3px solid ${T.borda2}`,borderTopColor:T.verde2,animation:"spin 0.8s linear infinite" }} />
      {label && <p style={{ color:T.cinza3,fontSize:13 }}>{label}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── CLAUDE API ──────────────────────────────────────────────────────────
async function callClaude(system, user, maxTokens=1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:maxTokens, system, messages:[{role:"user",content:user}] }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ═══════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  // ─── TODOS os hooks ANTES de qualquer return condicional ───
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoad]  = useState(true);
  const isMobile                    = useIsMobile();
  const online                      = useOnline();
  const [tela, setTela]             = useState("acervo");
  const [leiAtiva, setLeiAtiva]     = useState(null);
  const [textoLei, setTextoLei]     = useState("");
  const [carregando, setCarregando] = useState(false);
  const [marcacoes, setMarcacoes]   = useState(() => JSON.parse(localStorage.getItem("marcacoes")||"{}"));
  const [anotacoes, setAnotacoes]   = useState(() => JSON.parse(localStorage.getItem("anotacoes")||"{}"));
  const [flashcards, setFlashcards] = useState(() => JSON.parse(localStorage.getItem("flashcards")||"[]"));
  const [stats, setStats]           = useState(() => JSON.parse(localStorage.getItem("stats")||JSON.stringify({ leituras:{}, streakDias:3, pontos:420, flashcardsFeitos:0, questoesGeradas:0 })));

  // Verificar sessão ao carregar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoad(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem("marcacoes",  JSON.stringify(marcacoes));  }, [marcacoes]);
  useEffect(() => { localStorage.setItem("anotacoes",  JSON.stringify(anotacoes));  }, [anotacoes]);
  useEffect(() => { localStorage.setItem("flashcards", JSON.stringify(flashcards)); }, [flashcards]);
  useEffect(() => { localStorage.setItem("stats",      JSON.stringify(stats));      }, [stats]);

  // ─── Returns condicionais DEPOIS de todos os hooks ───
  if (authLoading) return (
    <div style={{ minHeight:"100dvh", background:T.fundo, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚖️</div>
        <p style={{ color:T.cinza3, fontSize:13 }}>Carregando…</p>
      </div>
    </div>
  );

  if (!user) return <TelaAuth onLogin={setUser} />;

  async function abrirLei(lei) {
    setLeiAtiva(lei);
    setTela("leitura");
    setCarregando(true);
    setTextoLei("");
    // Tenta cache local primeiro
    const cached = getCacheTexto(lei.id);
    if (cached && !online) { setTextoLei(cached); setCarregando(false); return; }
    if (cached) { setTextoLei(cached); setCarregando(false); }
    // Busca atualizado se online
    if (online) {
      try {
        // Proxy serverless — busca texto direto do Planalto sem bloqueio CORS
        const proxyUrl = `/api/lei?url=${encodeURIComponent(lei.url)}`;
        const r = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) });
        if (!r.ok) throw new Error(`${r.status}`);
        const textoRaw = await r.text();
        const linhas = textoRaw.split("\n").filter(l => l.trim());
        const html = linhas.map(l => {
          const t = l.trim();
          if (/^(CAPÍTULO|TÍTULO|SEÇÃO|SUBSEÇÃO|LIVRO)/i.test(t)) return "<h2>" + t + "</h2>";
          if (/^Art\.\ *\d+/i.test(t)) return "<p><strong>" + t.substring(0,12) + "</strong>" + t.substring(12) + "</p>";
          if (t.length > 0) return "<p>" + t + "</p>";
          return "";
        }).join("");
        const textoFinal = html || "<p>" + textoRaw + "</p>";
        setTextoLei(textoFinal);
        setCacheTexto(lei.id, textoFinal);
        setStats(s => ({ ...s, leituras:{ ...s.leituras, [lei.id]:(s.leituras[lei.id]||0)+1 }, pontos:s.pontos+10 }));
      } catch(err) {
        if (!cached) setTextoLei(
          "<div style=\"padding:16px;background:rgba(249,194,49,0.08);border:1px solid rgba(249,194,49,0.2);border-radius:12px\">" +
          "<p style=\"color:#F9C231;font-weight:700;margin-bottom:8px\">⚠️ Texto não disponível via acesso direto</p>" +
          "<p style=\"color:#8BA7BF;font-size:13px;line-height:1.7\">Configure a API key do Claude para gerar o texto via IA, ou acesse diretamente:<br><br>" +
          "<a href=\"" + lei.url + "\" target=\"_blank\" style=\"color:#68D391\">" + lei.url + "</a></p></div>"
        );
      }
    }
    setCarregando(false);
  }

  const navItems = [
    { id:"acervo",     icon:"📚", label:"Acervo" },
    { id:"leitura",    icon:"📖", label:"Leitura",    disabled:!leiAtiva },
    { id:"flashcards", icon:"🃏", label:"Flashcards" },
    { id:"ia",         icon:"🤖", label:"IA" },
    { id:"guias",      icon:"📓", label:"Guias" },
    { id:"juris",      icon:"⚖️",  label:"Juris" },
    { id:"simulado",   icon:"🎯", label:"Simulado" },
    { id:"dashboard",  icon:"📊", label:"Stats" },
  ];

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body, #root { height:100%; }
    body { background:${T.fundo}; color:${T.branco}; font-family:'Inter',sans-serif; font-size:14px; -webkit-tap-highlight-color:transparent; }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:${T.fundo}; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:99px; }
    ::selection { background:rgba(0,166,90,0.35); }
    mark.m-amarelo { background:rgba(249,194,49,0.35); border-bottom:2px solid #F9C231; border-radius:2px; }
    mark.m-verde   { background:rgba(0,166,90,0.3);   border-bottom:2px solid #00A65A; border-radius:2px; }
    mark.m-azul    { background:rgba(66,153,225,0.3); border-bottom:2px solid #4299E1; border-radius:2px; }
    mark.m-rosa    { background:rgba(237,100,166,0.3);border-bottom:2px solid #ED64A6; border-radius:2px; }
    mark.m-red     { background:rgba(229,62,62,0.3);  border-bottom:2px solid #E53E3E; border-radius:2px; }
    .btn { cursor:pointer; border:none; font-family:inherit; transition:all .15s; -webkit-tap-highlight-color:transparent; }
    .btn:active { opacity:0.7; transform:scale(0.97); }
    textarea { resize:vertical; }
    input, textarea, button { font-family:inherit; }
    /* Safe area para iPhone notch */
    .bottom-nav { padding-bottom:env(safe-area-inset-bottom); }
  `;

  return (
    <div style={{ display:"flex", flexDirection:isMobile?"column":"row", height:"100dvh", background:T.fundo, overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ── BANNER OFFLINE ── */}
      {!online && (
        <div style={{ background:"rgba(237,137,54,0.15)", borderBottom:`1px solid rgba(237,137,54,0.3)`, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#FCD34D", flexShrink:0 }}>
          <span>📡</span>
          <span><strong>Sem conexão</strong> — leis já abertas disponíveis no cache. Novas leis precisam de internet.</span>
        </div>
      )}

      {/* ── SIDEBAR (desktop) ── */}
      {!isMobile && (
        <aside style={{ width:220, background:T.fundo2, borderRight:`1px solid ${T.borda2}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${T.borda2}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34,height:34,background:`linear-gradient(135deg,${T.verde},${T.verde2})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>⚖️</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:900,color:"#fff",lineHeight:1.1 }}>Lei Seca</div>
                <div style={{ fontSize:10,color:T.verde2,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Carolina Teixeira</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1, padding:"10px 8px" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => !item.disabled && setTela(item.id)} className="btn" style={{
                width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,marginBottom:3,textAlign:"left",
                background:tela===item.id?"rgba(0,107,63,0.18)":"transparent",
                border:tela===item.id?`1px solid rgba(0,107,63,0.35)`:"1px solid transparent",
                color:item.disabled?T.cinza3+"60":tela===item.id?T.verde3:T.cinza3,
                cursor:item.disabled?"not-allowed":"pointer",fontSize:13,fontWeight:tela===item.id?700:500,
              }}>
                <span style={{ fontSize:17 }}>{item.icon}</span>
                {item.label}
                {item.id==="flashcards" && flashcards.length>0 && <Badge color="verde" style={{ marginLeft:"auto",fontSize:10,padding:"1px 7px" }}>{flashcards.length}</Badge>}
              </button>
            ))}
          </nav>
          <div style={{ padding:14,borderTop:`1px solid ${T.borda2}`,background:"rgba(249,194,49,0.05)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:20 }}>🔥</span>
              <div><div style={{ fontSize:14,fontWeight:800,color:T.amarelo }}>{stats.streakDias} dias</div><div style={{ fontSize:11,color:T.cinza3 }}>sequência</div></div>
              <div style={{ marginLeft:"auto",textAlign:"right" }}>
                <div style={{ fontSize:13,fontWeight:700,color:T.verde2 }}>{stats.pontos}</div>
                <div style={{ fontSize:10,color:T.cinza3 }}>pts</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Header mobile */}
        {isMobile && (
          <div style={{ background:T.fundo2,borderBottom:`1px solid ${T.borda2}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:28,height:28,background:`linear-gradient(135deg,${T.verde},${T.verde2})`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>⚖️</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:900,color:"#fff",lineHeight:1 }}>Lei Seca</div>
                <div style={{ fontSize:9,color:T.verde2,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8 }}>Carolina Teixeira</div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:11,color:online?T.verde2:"#FCD34D",fontWeight:700 }}>{online?"🟢 online":"🟡 offline"}</span>
              <div style={{ background:"rgba(249,194,49,0.1)",border:`1px solid rgba(249,194,49,0.2)`,borderRadius:8,padding:"3px 10px",display:"flex",alignItems:"center",gap:5 }}>
                <span style={{ fontSize:13 }}>🔥</span>
                <span style={{ fontSize:12,fontWeight:800,color:T.amarelo }}>{stats.pontos}pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Tela ativa */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {tela==="acervo"     && <TelaAcervo     leis={LEIS} areas={AREAS} onAbrir={abrirLei} marcacoes={marcacoes} isMobile={isMobile} online={online} />}
          {tela==="leitura"    && <TelaLeitura    lei={leiAtiva} texto={textoLei} carregando={carregando} marcacoes={marcacoes} setMarcacoes={setMarcacoes} anotacoes={anotacoes} setAnotacoes={setAnotacoes} flashcards={flashcards} setFlashcards={setFlashcards} stats={stats} setStats={setStats} isMobile={isMobile} />}
          {tela==="flashcards" && <TelaFlashcards flashcards={flashcards} setFlashcards={setFlashcards} stats={stats} setStats={setStats} isMobile={isMobile} />}
          {tela==="ia"         && <TelaIA         leiAtiva={leiAtiva} stats={stats} setStats={setStats} online={online} isMobile={isMobile} />}
          {tela==="guias"      && <TelaGuias      isMobile={isMobile} online={online} />}
          {tela==="juris"      && <TelaJuris      isMobile={isMobile} online={online} leiAtiva={leiAtiva} stats={stats} setStats={setStats} />}
          {tela==="simulado"   && <TelaSimulado   isMobile={isMobile} online={online} stats={stats} setStats={setStats} />}
          {tela==="dashboard"  && <TelaDashboard  stats={stats} leis={LEIS} flashcards={flashcards} marcacoes={marcacoes} isMobile={isMobile} />}
        </div>

        {/* ── BOTTOM NAV (mobile) ── */}
        {isMobile && (
          <nav className="bottom-nav" style={{ background:T.fundo2,borderTop:`1px solid ${T.borda2}`,display:"flex",flexShrink:0 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => !item.disabled && setTela(item.id)} className="btn" style={{
                flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                padding:"10px 4px 8px",gap:3,
                background:tela===item.id?"rgba(0,107,63,0.15)":"transparent",
                color:item.disabled?T.cinza3+"40":tela===item.id?T.verde2:T.cinza3,
                cursor:item.disabled?"not-allowed":"pointer",
                borderRight:item.id!=="dashboard"?`1px solid ${T.borda2}`:"none",
                position:"relative",
              }}>
                <span style={{ fontSize:20, lineHeight:1 }}>{item.icon}</span>
                <span style={{ fontSize:9,fontWeight:tela===item.id?700:500,lineHeight:1 }}>{item.label}</span>
                {item.id==="flashcards" && flashcards.length>0 && (
                  <span style={{ position:"absolute",top:6,right:"50%",transform:"translateX(10px)",background:T.verde2,color:"#fff",fontSize:9,fontWeight:700,borderRadius:99,padding:"1px 5px",lineHeight:1.4 }}>{flashcards.length}</span>
                )}
                {tela===item.id && <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:2,background:T.verde2,borderRadius:"0 0 2px 2px" }} />}
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: ACERVO
// ═══════════════════════════════════════════════════════════════════════════
function TelaAcervo({ leis, areas, onAbrir, marcacoes, isMobile, online }) {
  const [busca, setBusca]           = useState("");
  const [area, setArea]             = useState("Todas");
  const [sooPrio, setSooPrio]       = useState(false);

  const estrelas = n => n===3?"⭐⭐⭐":n===2?"⭐⭐":"⭐";
  const prioCor  = n => n===3?T.amarelo:n===2?T.verde2:T.cinza3;

  const filtradas = leis.filter(l =>
    (area==="Todas"||l.area===area) &&
    (!sooPrio||l.prioridade===3) &&
    (l.nome.toLowerCase().includes(busca.toLowerCase())||(l.destaque||"").toLowerCase().includes(busca.toLowerCase()))
  ).sort((a,b)=>(b.prioridade||1)-(a.prioridade||1));

  const temCache = id => !!getCacheTexto(id);

  return (
    <div style={{ flex:1,overflow:"auto",padding:isMobile?"16px 14px":"28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:T.verde2,marginBottom:4 }}>📚 Acervo — Carreira Fiscal</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,fontWeight:900,color:"#fff",marginBottom:3,lineHeight:1.2 }}>
          Legislação para Auditor Fiscal
        </h1>
        <p style={{ color:T.cinza3,fontSize:12 }}>
          {leis.length} leis · {leis.filter(l=>l.area.startsWith("SEFAZ-BA")).length} específicas BA · {leis.filter(l=>temCache(l.id)).length} no cache offline
        </p>
      </div>

      {/* Barra offline info */}
      {!online && (
        <div style={{ background:"rgba(237,137,54,0.08)",border:`1px solid rgba(237,137,54,0.25)`,borderRadius:9,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#FCD34D",display:"flex",gap:8,alignItems:"flex-start" }}>
          <span>📡</span>
          <span>Modo offline — exibindo apenas leis com <strong>ícone 💾</strong> (cache). Conecte-se para carregar novas.</span>
        </div>
      )}

      {/* Busca */}
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar lei ou tema..."
        style={{ width:"100%",background:T.fundo3,border:`1px solid ${T.borda2}`,borderRadius:9,padding:"10px 14px",color:T.branco,fontSize:13,outline:"none",marginBottom:12 }} />

      {/* Filtro de área — scroll horizontal no mobile */}
      <div style={{ display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4,flexWrap:isMobile?"nowrap":"wrap" }}>
        {["Todas",...areas.filter(a=>a!=="Todas")].map(a => (
          <button key={a} onClick={()=>setArea(a)} className="btn" style={{
            padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:600,whiteSpace:"nowrap",flexShrink:0,
            background:area===a?T.verde2:T.fundo3,color:area===a?"#fff":T.cinza3,
            border:`1px solid ${area===a?T.verde2:T.borda2}`,
          }}>{a}</button>
        ))}
        <button onClick={()=>setSooPrio(s=>!s)} className="btn" style={{
          padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,
          background:sooPrio?T.amarelo:"transparent",color:sooPrio?"#000":T.cinza3,
          border:`1px solid ${sooPrio?T.amarelo:T.borda2}`,
        }}>⭐⭐⭐ só prioridade</button>
      </div>

      {/* Grid */}
      <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:10 }}>
        {filtradas.map(lei => {
          const temMarca = marcacoes[lei.id]?.length>0;
          const cache    = temCache(lei.id);
          const p        = lei.prioridade||1;
          const topBar   = p===3?`linear-gradient(90deg,${T.amarelo},${T.orange})`:p===2?`linear-gradient(90deg,${T.verde},${T.verde2})`:`rgba(255,255,255,0.07)`;
          const inacessivel = !online && !cache;

          return (
            <div key={lei.id} onClick={()=>!inacessivel&&onAbrir(lei)} style={{
              background:T.fundo3,border:`1px solid ${temMarca?"rgba(249,194,49,0.3)":T.borda2}`,
              borderRadius:12,padding:isMobile?"12px 13px":"15px 16px 13px",
              cursor:inacessivel?"not-allowed":"pointer",
              opacity:inacessivel?0.45:1,
              transition:"all .2s",position:"relative",overflow:"hidden",
            }}
            onMouseEnter={e=>{ if(!inacessivel){ e.currentTarget.style.borderColor=p===3?"rgba(249,194,49,0.4)":"rgba(0,107,63,0.4)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=temMarca?"rgba(249,194,49,0.3)":T.borda2; e.currentTarget.style.transform="none"; }}
            >
              <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:topBar }} />
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,marginTop:3 }}>
                <span style={{ fontSize:isMobile?20:22 }}>{lei.emoji}</span>
                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                  {cache && <span title="disponível offline" style={{ fontSize:12 }}>💾</span>}
                  <span style={{ fontSize:10,color:prioCor(p) }}>{estrelas(p)}</span>
                </div>
              </div>
              <div style={{ fontSize:isMobile?12:13,fontWeight:700,color:"#fff",marginBottom:isMobile?5:7,lineHeight:1.35 }}>{lei.nome}</div>
              {!isMobile && lei.destaque && (
                <div style={{ fontSize:11,color:T.cinza3,lineHeight:1.5,marginBottom:8,borderLeft:`2px solid ${prioCor(p)}50`,paddingLeft:7 }}>{lei.destaque}</div>
              )}
              <div style={{ display:"flex",alignItems:"center",gap:5,flexWrap:"wrap" }}>
                <Badge color="cinza" style={{ fontSize:isMobile?9:10 }}>{lei.area.replace("SEFAZ-BA · ","BA·")}</Badge>
                {temMarca && <Badge color="amarelo" style={{ fontSize:9 }}>✏️</Badge>}
                {p===3 && !isMobile && <Badge color="amarelo" style={{ fontSize:9 }}>🎯</Badge>}
              </div>
            </div>
          );
        })}
      </div>

      {filtradas.length===0 && (
        <div style={{ textAlign:"center",padding:"48px 20px",color:T.cinza3 }}>
          <div style={{ fontSize:36,marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:14,fontWeight:600 }}>Nenhuma lei encontrada</div>
        </div>
      )}

      <div style={{ marginTop:20,padding:"12px 16px",background:"rgba(249,194,49,0.05)",border:`1px solid rgba(249,194,49,0.15)`,borderRadius:10,fontSize:12,color:T.cinza3,lineHeight:1.7 }}>
        💡 <strong style={{ color:T.amarelo }}>Estratégia SEFAZ-BA:</strong> Comece pela <strong style={{ color:T.verde2 }}>Lei 7.014/96 + RICMS/BA + PAT</strong> — respondem por +40% das questões de legislação tributária estadual nas provas da FCC.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: LEITURA
// ═══════════════════════════════════════════════════════════════════════════
function TelaLeitura({ lei, texto, carregando, marcacoes, setMarcacoes, anotacoes, setAnotacoes, flashcards, setFlashcards, stats, setStats, isMobile }) {
  const [corAtiva, setCorAtiva]       = useState("amarelo");
  const [painel, setPainel]           = useState(null);
  const [anotacaoTexto, setAnotacao]  = useState("");
  const [flashFrente, setFlashFrente] = useState("");
  const [flashVerso, setFlashVerso]   = useState("");
  const [gerandoFlash, setGerandoFlash] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(!isMobile);

  function marcarSelecao() {
    const sel = window.getSelection();
    if (!sel||sel.isCollapsed) return;
    const textoSel = sel.toString().trim();
    if (!textoSel) return;
    const range = sel.getRangeAt(0);
    const mark = document.createElement("mark");
    mark.className = `m-${corAtiva}`;
    mark.ondblclick = () => { const p=mark.parentNode; while(mark.firstChild) p.insertBefore(mark.firstChild,mark); p.removeChild(mark); };
    try { range.surroundContents(mark); } catch {}
    sel.removeAllRanges();
    setMarcacoes(m => ({ ...m, [lei.id]:[...(m[lei.id]||[]),{ texto:textoSel, cor:corAtiva, data:new Date().toISOString() }] }));
    setStats(s=>({ ...s,pontos:s.pontos+2 }));
  }

  async function gerarFlashcard() {
    const sel = window.getSelection()?.toString().trim();
    const base = sel||`artigo da ${lei.nome}`;
    setGerandoFlash(true); setPainel("flash"); setFlashFrente(""); setFlashVerso("");
    const r = await callClaude(
      "Crie um flashcard objetivo para concurso. Retorne APENAS JSON: {\"frente\":\"pergunta\",\"verso\":\"resposta direta\"}",
      `Flashcard sobre: "${base}" — ${lei.nome}`, 300
    );
    try { const d=JSON.parse(r.replace(/```json|```/g,"").trim()); setFlashFrente(d.frente); setFlashVerso(d.verso); }
    catch { setFlashFrente(`Sobre: ${base}?`); setFlashVerso(r); }
    setGerandoFlash(false);
  }

  function salvarFlash() {
    if (!flashFrente) return;
    setFlashcards(f=>[...f,{ id:Date.now(),frente:flashFrente,verso:flashVerso,lei:lei.nome,data:new Date().toISOString(),acertos:0,erros:0 }]);
    setStats(s=>({ ...s,pontos:s.pontos+5 }));
    setPainel(null); setFlashFrente(""); setFlashVerso("");
  }

  function salvarAnotacao() {
    if (!anotacaoTexto.trim()) return;
    setAnotacoes(a=>({ ...a,[lei.id]:[...(a[lei.id]||[]),{ texto:anotacaoTexto,data:new Date().toISOString() }] }));
    setAnotacao(""); setPainel(null);
  }

  const marcacoesLei = marcacoes[lei?.id]||[];
  const anotacoesLei = anotacoes[lei?.id]||[];

  if (!lei) return (
    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:40,color:T.cinza3 }}>
      <div style={{ fontSize:48 }}>📖</div>
      <div style={{ fontSize:15,fontWeight:600 }}>Selecione uma lei no Acervo</div>
    </div>
  );

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      {/* Toolbar */}
      <div style={{ background:T.fundo2,borderBottom:`1px solid ${T.borda2}`,padding:isMobile?"10px 14px":"12px 20px",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:isMobile?13:15,fontWeight:700,color:"#fff",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{lei.nome}</div>
            <div style={{ fontSize:10,color:T.cinza3 }}>{lei.area}</div>
          </div>
          <div style={{ display:"flex",gap:6,flexShrink:0 }}>
            {MARK_COLORS.map(c=>(
              <button key={c.id} onClick={()=>setCorAtiva(c.id)} className="btn" style={{ width:22,height:22,borderRadius:"50%",background:c.bg,border:`2px solid ${corAtiva===c.id?c.border:"transparent"}`,boxShadow:corAtiva===c.id?`0 0 6px ${c.border}`:"none" }} />
            ))}
            <button onClick={marcarSelecao} className="btn" style={{ background:T.verde2,color:"#fff",padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:700 }}>✏️{!isMobile&&" Marcar"}</button>
            <button onClick={gerarFlashcard} className="btn" style={{ background:"rgba(0,107,63,0.15)",border:`1px solid rgba(0,107,63,0.35)`,color:T.verde3,padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:600 }}>🃏</button>
            <button onClick={()=>setPainel(p=>p==="anotacao"?null:"anotacao")} className="btn" style={{ background:"rgba(249,194,49,0.1)",border:`1px solid rgba(249,194,49,0.3)`,color:T.amarelo,padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:600 }}>📝</button>
            {isMobile && (
              <button onClick={()=>setMostrarPainel(v=>!v)} className="btn" style={{ background:"rgba(255,255,255,0.05)",border:`1px solid ${T.borda2}`,color:T.cinza3,padding:"5px 10px",borderRadius:7,fontSize:11 }}>
                {mostrarPainel?"📄":"📋"} {marcacoesLei.length+anotacoesLei.length>0 ? `(${marcacoesLei.length+anotacoesLei.length})` : ""}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex:1,display:"flex",overflow:"hidden",flexDirection:isMobile?"column":"row" }}>
        {/* Texto */}
        <div style={{ flex:1,overflow:"auto",padding:isMobile?"14px 14px":"24px 28px" }}>
          {carregando ? <Spinner label={`Carregando ${lei.nome} via IA…`} /> : (
            <div style={{ fontSize:13,lineHeight:2,color:T.branco }} dangerouslySetInnerHTML={{ __html:texto||`<p style="color:${T.cinza3}">Nenhum conteúdo carregado.</p>` }} />
          )}
        </div>

        {/* Painel lateral / sheet mobile */}
        {(mostrarPainel||!isMobile) && (
          <div style={{
            width:isMobile?"100%":290, flexShrink:0,
            background:T.fundo2, borderLeft:isMobile?"none":`1px solid ${T.borda2}`,
            borderTop:isMobile?`1px solid ${T.borda2}`:"none",
            overflow:"auto", padding:16,
            maxHeight:isMobile?240:"100%",
          }}>
            {/* Painel nova anotação */}
            {painel==="anotacao" && (
              <div style={{ background:T.fundo3,border:`1px solid rgba(249,194,49,0.25)`,borderRadius:10,padding:12,marginBottom:12 }}>
                <div style={{ fontSize:11,fontWeight:700,color:T.amarelo,marginBottom:8 }}>📝 Nova Anotação</div>
                <textarea value={anotacaoTexto} onChange={e=>setAnotacao(e.target.value)} rows={3} placeholder="Sua anotação..."
                  style={{ width:"100%",background:T.fundo2,border:`1px solid ${T.borda2}`,borderRadius:7,padding:9,color:T.branco,fontSize:12,outline:"none" }} />
                <div style={{ display:"flex",gap:6,marginTop:8 }}>
                  <button className="btn" onClick={salvarAnotacao} style={{ flex:1,background:T.amarelo,color:"#000",padding:"7px",borderRadius:7,fontWeight:700,fontSize:12 }}>Salvar</button>
                  <button className="btn" onClick={()=>setPainel(null)} style={{ background:T.fundo2,border:`1px solid ${T.borda2}`,color:T.cinza3,padding:"7px 10px",borderRadius:7,fontSize:12 }}>✕</button>
                </div>
              </div>
            )}
            {/* Painel flashcard */}
            {painel==="flash" && (
              <div style={{ background:T.fundo3,border:`1px solid rgba(0,107,63,0.35)`,borderRadius:10,padding:12,marginBottom:12 }}>
                <div style={{ fontSize:11,fontWeight:700,color:T.verde2,marginBottom:8 }}>🃏 Novo Flashcard</div>
                {gerandoFlash ? <Spinner /> : (<>
                  <div style={{ fontSize:10,color:T.cinza3,marginBottom:3 }}>FRENTE</div>
                  <textarea value={flashFrente} onChange={e=>setFlashFrente(e.target.value)} rows={2}
                    style={{ width:"100%",background:T.fundo2,border:`1px solid ${T.borda2}`,borderRadius:7,padding:8,color:T.branco,fontSize:12,outline:"none",marginBottom:8 }} />
                  <div style={{ fontSize:10,color:T.cinza3,marginBottom:3 }}>VERSO</div>
                  <textarea value={flashVerso} onChange={e=>setFlashVerso(e.target.value)} rows={2}
                    style={{ width:"100%",background:T.fundo2,border:`1px solid ${T.borda2}`,borderRadius:7,padding:8,color:T.branco,fontSize:12,outline:"none",marginBottom:8 }} />
                  <div style={{ display:"flex",gap:6 }}>
                    <button className="btn" onClick={salvarFlash} style={{ flex:1,background:T.verde2,color:"#fff",padding:"7px",borderRadius:7,fontWeight:700,fontSize:12 }}>Salvar</button>
                    <button className="btn" onClick={()=>setPainel(null)} style={{ background:T.fundo2,border:`1px solid ${T.borda2}`,color:T.cinza3,padding:"7px 10px",borderRadius:7,fontSize:12 }}>✕</button>
                  </div>
                </>)}
              </div>
            )}
            {/* Marcações */}
            {marcacoesLei.length>0 && (<>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.cinza3,marginBottom:8 }}>✏️ Destaques ({marcacoesLei.length})</div>
              {marcacoesLei.map((m,i)=>{
                const c=MARK_COLORS.find(x=>x.id===m.cor);
                return <div key={i} style={{ background:c?.bg,border:`1px solid ${c?.border}40`,borderRadius:7,padding:"7px 9px",marginBottom:5,fontSize:11,color:T.branco,lineHeight:1.5 }}>"{m.texto.slice(0,70)}{m.texto.length>70?"…":""}"</div>;
              })}
            </>)}
            {/* Anotações */}
            {anotacoesLei.length>0 && (<>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.cinza3,marginBottom:8,marginTop:12 }}>📝 Notas ({anotacoesLei.length})</div>
              {anotacoesLei.map((a,i)=>(
                <div key={i} style={{ background:"rgba(249,194,49,0.06)",border:`1px solid rgba(249,194,49,0.2)`,borderRadius:7,padding:"7px 9px",marginBottom:5,fontSize:11,color:T.branco,lineHeight:1.5 }}>{a.texto}</div>
              ))}
            </>)}
            {marcacoesLei.length===0&&anotacoesLei.length===0&&!painel && (
              <div style={{ textAlign:"center",padding:"20px 10px",color:T.cinza3 }}>
                <div style={{ fontSize:24,marginBottom:6 }}>✏️</div>
                <div style={{ fontSize:11 }}>Selecione texto e clique em "✏️ Marcar"</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: FLASHCARDS
// ═══════════════════════════════════════════════════════════════════════════
function TelaFlashcards({ flashcards, setFlashcards, stats, setStats, isMobile }) {
  const [modo, setModo]       = useState("lista");
  const [idx, setIdx]         = useState(0);
  const [virado, setVirado]   = useState(false);
  const [resultado, setResult] = useState(null);

  function responder(acerto) {
    setResult(acerto?"acerto":"erro");
    setFlashcards(fs=>fs.map((f,i)=>i===idx%flashcards.length?{...f,acertos:f.acertos+(acerto?1:0),erros:f.erros+(acerto?0:1)}:f));
    setStats(s=>({ ...s,flashcardsFeitos:s.flashcardsFeitos+1,pontos:s.pontos+(acerto?8:2) }));
    setTimeout(()=>{ setResult(null); setVirado(false); setIdx(i=>(i+1)%flashcards.length); },600);
  }

  if (flashcards.length===0) return (
    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:40,color:T.cinza3,textAlign:"center" }}>
      <div style={{ fontSize:48 }}>🃏</div>
      <div style={{ fontSize:16,fontWeight:700,color:"#fff" }}>Nenhum flashcard</div>
      <div style={{ fontSize:13,maxWidth:280 }}>Abra uma lei, selecione um trecho e toque em 🃏 para criar.</div>
    </div>
  );

  const card = flashcards[idx%flashcards.length];

  return (
    <div style={{ flex:1,overflow:"auto",padding:isMobile?"14px":"28px 36px" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,gap:10 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?20:24,fontWeight:900,color:"#fff" }}>
          {flashcards.length} flashcards
        </h1>
        <div style={{ display:"flex",gap:6 }}>
          {["lista","revisao"].map(m=>(
            <button key={m} onClick={()=>{setModo(m);setIdx(0);setVirado(false);}} className="btn" style={{
              padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,
              background:modo===m?T.verde2:T.fundo3,color:modo===m?"#fff":T.cinza3,border:`1px solid ${T.borda2}`,
            }}>{m==="lista"?"📋 Lista":"🔄 Revisar"}</button>
          ))}
        </div>
      </div>

      {modo==="lista" && (
        <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:10 }}>
          {flashcards.map((f,i)=>(
            <div key={f.id} style={{ background:T.fundo3,border:`1px solid ${T.borda2}`,borderRadius:12,padding:16 }}>
              <div style={{ fontSize:11,color:T.cinza3,marginBottom:6 }}>{f.lei}</div>
              <div style={{ fontSize:13,fontWeight:700,color:"#fff",marginBottom:8,lineHeight:1.5 }}>{f.frente}</div>
              <div style={{ fontSize:12,color:T.cinza3,borderTop:`1px solid ${T.borda2}`,paddingTop:8,lineHeight:1.6 }}>{f.verso}</div>
              <div style={{ display:"flex",gap:6,marginTop:10,alignItems:"center" }}>
                <Badge color="verde" style={{ fontSize:10 }}>✓ {f.acertos}</Badge>
                <Badge color="red"   style={{ fontSize:10 }}>✗ {f.erros}</Badge>
                <button className="btn" onClick={()=>setFlashcards(fs=>fs.filter((_,j)=>j!==i))} style={{ marginLeft:"auto",background:"none",border:"none",color:T.cinza3+"80",fontSize:16,padding:4 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modo==="revisao" && (
        <div style={{ maxWidth:520,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:14,color:T.cinza3,fontSize:12 }}>
            {(idx%flashcards.length)+1} / {flashcards.length}
          </div>
          <div onClick={()=>setVirado(v=>!v)} style={{
            background:virado?"rgba(0,107,63,0.1)":T.fundo3,
            border:`1px solid ${resultado==="acerto"?T.verde2:resultado==="erro"?T.red:virado?"rgba(0,107,63,0.4)":T.borda2}`,
            borderRadius:16,padding:isMobile?"28px 20px":"36px 28px",textAlign:"center",cursor:"pointer",
            minHeight:isMobile?180:220,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            transition:"all .25s",
          }}>
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:virado?T.verde2:T.cinza3,marginBottom:10 }}>
              {virado?"RESPOSTA":"PERGUNTA"} · {card.lei.split("—")[0].trim()}
            </div>
            <div style={{ fontSize:isMobile?16:18,fontWeight:700,color:"#fff",lineHeight:1.6 }}>
              {virado?card.verso:card.frente}
            </div>
            {!virado && <div style={{ fontSize:11,color:T.cinza3,marginTop:16 }}>Toque para revelar</div>}
          </div>

          {virado ? (
            <div style={{ display:"flex",gap:10,marginTop:14 }}>
              <button className="btn" onClick={()=>responder(false)} style={{ flex:1,padding:isMobile?14:16,borderRadius:12,background:"rgba(229,62,62,0.12)",border:"1px solid rgba(229,62,62,0.3)",color:"#FCA5A5",fontWeight:700,fontSize:15 }}>✗ Errei</button>
              <button className="btn" onClick={()=>responder(true)}  style={{ flex:1,padding:isMobile?14:16,borderRadius:12,background:"rgba(0,107,63,0.15)",border:"1px solid rgba(0,107,63,0.4)",color:T.verde3,fontWeight:700,fontSize:15 }}>✓ Acertei</button>
            </div>
          ) : (
            <button className="btn" onClick={()=>setVirado(true)} style={{ width:"100%",padding:14,borderRadius:12,background:T.fundo3,border:`1px solid ${T.borda2}`,color:T.cinza3,fontWeight:600,fontSize:13,marginTop:14 }}>Revelar resposta</button>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: ASSESSOR IA
// ═══════════════════════════════════════════════════════════════════════════
function TelaIA({ leiAtiva, stats, setStats, online, isMobile }) {
  const [modo, setModo]       = useState("questao");
  const [input, setInput]     = useState("");
  const [resultado, setResult] = useState("");
  const [gerando, setGerando] = useState(false);

  const modos = [
    { id:"questao",    icon:"❓", label:"CESPE" },
    { id:"discursiva", icon:"✍️", label:"Discursiva" },
    { id:"resumo",     icon:"📄", label:"Resumo" },
    { id:"juridiques", icon:"📖", label:"Juridiquês" },
  ];
  const prompts = {
    questao:    "Crie uma questão CESPE (Certo/Errado) com gabarito e explicação. Seja objetivo.",
    discursiva: "Crie uma questão discursiva com enunciado e espelho de resposta. Seja direto.",
    resumo:     "Crie um resumo esquematizado com tópicos, destaques e pontos mais cobrados em concursos.",
    juridiques: "Explique o conceito em linguagem simples com exemplos práticos do dia a dia.",
  };

  async function gerar() {
    if (!input.trim()||gerando) return;
    if (!online) { setResult("⚠️ Sem conexão com a internet. Conecte-se para usar o Assessor IA."); return; }
    setGerando(true); setResult("");
    const ctx = leiAtiva?`Contexto: ${leiAtiva.nome}.`:"";
    const r = await callClaude(prompts[modo], `${ctx}\nTema: ${input}`, 1000);
    setResult(r);
    setStats(s=>({ ...s,questoesGeradas:s.questoesGeradas+1,pontos:s.pontos+15 }));
    setGerando(false);
  }

  return (
    <div style={{ flex:1,overflow:"auto",padding:isMobile?"14px":"28px 36px" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:T.verde2,marginBottom:4 }}>🤖 Assessor Jurídico IA</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?20:24,fontWeight:900,color:"#fff" }}>O que você precisa hoje?</h1>
      </div>

      {!online && (
        <div style={{ background:"rgba(237,137,54,0.08)",border:`1px solid rgba(237,137,54,0.25)`,borderRadius:9,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#FCD34D",display:"flex",gap:8 }}>
          <span>📡</span><span>Assessor IA requer conexão com a internet.</span>
        </div>
      )}

      <div style={{ maxWidth:680 }}>
        {/* Seleção de modo */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          {modos.map(m=>(
            <button key={m.id} onClick={()=>setModo(m.id)} className="btn" style={{
              padding:"9px 16px",borderRadius:9,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,
              background:modo===m.id?`linear-gradient(135deg,${T.verde},${T.verde2})`:T.fundo3,
              color:modo===m.id?"#fff":T.cinza3,border:`1px solid ${modo===m.id?"transparent":T.borda2}`,
            }}>{m.icon} {m.label}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ background:T.fundo3,border:`1px solid ${T.borda2}`,borderRadius:12,padding:"16px 18px",marginBottom:12 }}>
          {leiAtiva && <div style={{ marginBottom:8 }}><Badge color="verde" style={{ fontSize:11 }}>📖 {leiAtiva.nome}</Badge></div>}
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={isMobile?2:3}
            placeholder={`Tema para ${modos.find(m=>m.id===modo)?.label.toLowerCase()}...`}
            onKeyDown={e=>{ if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) gerar(); }}
            style={{ width:"100%",background:T.fundo2,border:`1px solid ${T.borda2}`,borderRadius:8,padding:"10px 13px",color:T.branco,fontSize:13,outline:"none",lineHeight:1.6 }} />
          <div style={{ display:"flex",justifyContent:"flex-end",marginTop:10 }}>
            <button className="btn" onClick={gerar} disabled={gerando||!input.trim()||!online} style={{
              background:gerando||!online?T.fundo2:`linear-gradient(135deg,${T.verde},${T.verde2})`,
              color:gerando||!online?T.cinza3:"#fff",padding:"9px 22px",borderRadius:8,fontWeight:700,fontSize:13,
              cursor:gerando||!input.trim()||!online?"not-allowed":"pointer",
            }}>{gerando?"⏳ Gerando…":`${modos.find(m=>m.id===modo)?.icon} Gerar`}</button>
          </div>
        </div>

        {/* Resultado */}
        {(gerando||resultado) && (
          <div style={{ background:T.fundo3,border:`1px solid rgba(0,107,63,0.3)`,borderRadius:12,padding:"18px 20px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <Badge color="verde">✨ Resultado</Badge>
              {resultado && (
                <button className="btn" onClick={()=>navigator.clipboard.writeText(resultado)} style={{ background:"rgba(249,194,49,0.1)",border:`1px solid rgba(249,194,49,0.25)`,color:T.amarelo,padding:"4px 12px",borderRadius:6,fontSize:11,fontWeight:700 }}>📋 Copiar</button>
              )}
            </div>
            {gerando ? <Spinner /> : <div style={{ fontSize:13,color:T.branco,lineHeight:1.9,whiteSpace:"pre-wrap" }}>{resultado}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function TelaDashboard({ stats, leis, flashcards, marcacoes, isMobile }) {
  const totalMarcacoes = Object.values(marcacoes).reduce((s,a)=>s+a.length,0);
  const leidsLidas     = Object.keys(stats.leituras).length;
  const taxaAcerto     = flashcards.length>0
    ? Math.round(flashcards.reduce((s,f)=>s+f.acertos,0)/Math.max(1,flashcards.reduce((s,f)=>s+f.acertos+f.erros,0))*100) : 0;
  const nivel   = Math.floor(stats.pontos/100)+1;
  const progresso = stats.pontos%100;

  const cards = [
    { icon:"🔥", label:"Sequência",     val:`${stats.streakDias}d`,    sub:"de estudo",      cor:T.orange },
    { icon:"⭐", label:"Pontos",        val:stats.pontos,               sub:"acumulados",     cor:T.amarelo },
    { icon:"📖", label:"Leis abertas",  val:leidsLidas,                 sub:`de ${leis.length}`,cor:T.verde2 },
    { icon:"✏️", label:"Marcações",    val:totalMarcacoes,             sub:"destaques",      cor:"#4299E1" },
    { icon:"🃏", label:"Flashcards",   val:flashcards.length,          sub:`${stats.flashcardsFeitos} revisados`,cor:T.verde3 },
    { icon:"✅", label:"Taxa acerto",   val:`${taxaAcerto}%`,           sub:"nos flashcards", cor:T.verde2 },
    { icon:"🤖", label:"Gerado por IA", val:stats.questoesGeradas,      sub:"questões",       cor:"#9F7AEA" },
    { icon:"💾", label:"Cache offline", val:leis.filter(l=>!!getCacheTexto(l.id)).length, sub:"leis salvas", cor:T.cinza3 },
  ];

  return (
    <div style={{ flex:1,overflow:"auto",padding:isMobile?"14px":"28px 36px" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:T.verde2,marginBottom:4 }}>📊 Dashboard</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,fontWeight:900,color:"#fff" }}>Seu progresso</h1>
      </div>

      {/* Nível */}
      <div style={{ background:`linear-gradient(135deg,rgba(0,107,63,0.15),rgba(0,107,63,0.05))`,border:`1px solid rgba(0,107,63,0.3)`,borderRadius:14,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
        <div style={{ width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${T.verde},${T.verde2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",flexShrink:0 }}>{nivel}</div>
        <div style={{ flex:1,minWidth:160 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7 }}>
            <div style={{ fontSize:isMobile?14:16,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',serif" }}>Nível {nivel} · Concurseiro</div>
            <Badge color="amarelo">⭐ {stats.pontos} pts</Badge>
          </div>
          <div style={{ background:T.fundo2,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${progresso}%`,background:`linear-gradient(90deg,${T.verde},${T.verde2})`,borderRadius:99,transition:"width 1s" }} />
          </div>
          <div style={{ fontSize:11,color:T.cinza3,marginTop:4 }}>{100-progresso} pts para Nível {nivel+1}</div>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:20 }}>
        {cards.map(c=>(
          <div key={c.label} style={{ background:T.fundo3,border:`1px solid ${T.borda2}`,borderRadius:12,padding:"14px 16px" }}>
            <div style={{ fontSize:20,marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,fontWeight:900,color:c.cor,lineHeight:1 }}>{c.val}</div>
            <div style={{ fontSize:11,fontWeight:700,color:"#fff",marginTop:3 }}>{c.label}</div>
            <div style={{ fontSize:10,color:T.cinza3,marginTop:2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Leis estudadas */}
      {leidsLidas>0 && (
        <div style={{ background:T.fundo3,border:`1px solid ${T.borda2}`,borderRadius:14,padding:"16px 18px" }}>
          <div style={{ fontSize:13,fontWeight:700,color:"#fff",marginBottom:12 }}>📖 Leis estudadas</div>
          {Object.entries(stats.leituras).map(([id,v])=>{
            const lei=leis.find(l=>l.id===id);
            return (
              <div key={id} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${T.borda2}` }}>
                <span style={{ fontSize:16 }}>{lei?.emoji||"📄"}</span>
                <div style={{ flex:1,fontSize:12,color:T.branco,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{lei?.nome||id}</div>
                <Badge color="verde" style={{ fontSize:10,flexShrink:0 }}>{v}x</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATÁLOGO DE DISCIPLINAS — SEFAZ-BA + padrão FGV (AM 2022 / BA 2019 / projeção 2026)
// 19 disciplinas · 12 originais SEFAZ-BA + 7 identificadas no SEFAZ-AM FGV 2022
// ═══════════════════════════════════════════════════════════════════════════
const DISCIPLINAS = [
  // ── CONHECIMENTOS GERAIS (todas as áreas) ──
  {
    id: "portugues", nome: "Língua Portuguesa", area: "Gerais", emoji: "📝",
    prioridade: 3, peso: "10–15 questões",
    topicos: ["Interpretação de texto","Coesão e coerência","Morfologia","Sintaxe","Pontuação","Redação oficial"],
    dica: "FGV/FCC focam em interpretação e gramática contextualizada. Leia DOU e despachos oficiais.",
    arquivo: "portugues.html"
  },
  {
    id: "dir-constitucional", nome: "Direito Constitucional", area: "Gerais", emoji: "🏛️",
    prioridade: 3, peso: "10–12 questões",
    topicos: ["Princípios fundamentais","Direitos e garantias","Organização do Estado","Tributação (arts. 145–162)","Administração Pública (art. 37)","Controle de constitucionalidade"],
    dica: "Arts. 150–152 (limitações) e 155–162 (ICMS) são essenciais para o fiscal.",
    arquivo: "dir-constitucional.html"
  },
  {
    id: "dir-administrativo", nome: "Direito Administrativo", area: "Gerais", emoji: "🏢",
    prioridade: 3, peso: "10–12 questões",
    topicos: ["Atos administrativos","Poderes da Administração","Licitações (Lei 14.133/21)","Serviços públicos","Responsabilidade civil do Estado","Improbidade (Lei 8.429/92)","Controle da Administração"],
    dica: "Atos administrativos e improbidade são os mais cobrados. Conheça COFIMO e PITA.",
    arquivo: "dir-administrativo.html"
  },
  {
    id: "raciocinio-logico", nome: "Raciocínio Lógico e Matemática", area: "Gerais", emoji: "🔢",
    prioridade: 2, peso: "10 questões",
    topicos: ["Lógica proposicional","Conjuntos","Porcentagem","Razão e proporção","Progressões","Probabilidade","Matemática financeira","Juros simples e compostos"],
    dica: "FGV cobra muito matemática financeira — juros, percentuais e tabelas. Pratique cálculo rápido.",
    arquivo: "raciocinio-logico.html"
  },
  {
    id: "informatica", nome: "Noções de Informática", area: "Gerais", emoji: "💻",
    prioridade: 1, peso: "5–8 questões",
    topicos: ["Office (Word, Excel, PowerPoint)","Internet e segurança","Redes","Sistemas operacionais","SPED e NF-e","Banco de dados básico"],
    dica: "Para fiscal: SPED Fiscal, EFD-ICMS/IPI e NF-e são diferenciais. Domine Excel avançado.",
    arquivo: "informatica.html"
  },
  // ── CONHECIMENTOS ESPECÍFICOS — ADMINISTRAÇÃO TRIBUTÁRIA ──
  {
    id: "dir-tributario", nome: "Direito Tributário", area: "Específico · Tributário", emoji: "💰",
    prioridade: 3, peso: "20–25 questões",
    topicos: ["Sistema Tributário Nacional","Competência tributária","Limitações ao poder de tributar","Obrigação tributária (CTN 113–118)","Crédito tributário (CTN 139–193)","Lançamento","Suspensão, extinção e exclusão do crédito","Responsabilidade tributária","Administração tributária","Processo tributário"],
    dica: "Matéria mais pesada. CTN artigo por artigo. Crédito tributário responde por 40% das questões.",
    arquivo: "dir-tributario.html"
  },
  {
    id: "legislacao-ba", nome: "Legislação Tributária da Bahia", area: "Específico · Tributário", emoji: "⚡",
    prioridade: 3, peso: "20–30 questões",
    topicos: ["Lei 7.014/96 — ICMS BA","RICMS/BA (Dec. 13.780/12)","Substituição tributária (Anexo 01)","CTB — Lei 3.956/81","PAT — Dec. 7.629/99","IPVA — Lei 6.348/91","ITD — Lei 4.826/89","Taxas — Lei 11.631/09","Constituição Estadual (arts. tributários)"],
    dica: "Maior peso na prova. ICMS-BA e PAT são prioritários. Leia a lei 7.014/96 inteira pelo menos 3x.",
    arquivo: "legislacao-ba.html"
  },
  {
    id: "contabilidade", nome: "Contabilidade Geral", area: "Específico · Contábil", emoji: "📊",
    prioridade: 3, peso: "15–20 questões",
    topicos: ["Patrimônio e equação patrimonial","Lançamentos contábeis","Balanço Patrimonial","DRE","Estoques (PEPS, UEPS, MPM)","Imobilizado e depreciação","Patrimônio Líquido","DFC e DMPL","Provisões","AVP e AVJ"],
    dica: "FGV cobra contabilidade de forma aplicada. Saiba elaborar DRE e BP do zero. Estoques caem muito.",
    arquivo: "contabilidade-geral.html"
  },
  {
    id: "auditoria", nome: "Auditoria", area: "Específico · Contábil", emoji: "🔍",
    prioridade: 2, peso: "8–10 questões",
    topicos: ["Conceitos e tipos de auditoria","Planejamento e execução","Papéis de trabalho","Risco de auditoria","Controles internos","Auditoria fiscal","NBC TAs","Fraude e erro","Relatório do auditor"],
    dica: "Foco em auditoria fiscal e controles internos. NBC TAs são cobradas pela FGV com frequência.",
    arquivo: "auditoria.html"
  },
  {
    id: "estatistica", nome: "Estatística Aplicada", area: "Específico · Quantitativo", emoji: "📈",
    prioridade: 2, peso: "8–10 questões",
    topicos: ["Estatística descritiva","Medidas de tendência central","Medidas de dispersão","Distribuições de probabilidade","Amostragem","Regressão linear","Números-índice","Séries temporais"],
    dica: "Estatística descritiva e probabilidade são os mais cobrados. Saiba calcular média, mediana, moda e desvio padrão.",
    arquivo: "estatistica.html"
  },
  {
    id: "dir-financeiro", nome: "Direito Financeiro e Orçamento", area: "Específico · Finanças", emoji: "📋",
    prioridade: 2, peso: "6–8 questões",
    topicos: ["Lei 4.320/64","Lei de Responsabilidade Fiscal (LRF)","PPA, LDO e LOA","Receita pública","Despesa pública","Créditos adicionais","Dívida pública","Controle externo e interno","TCU e TCE"],
    dica: "LRF e Lei 4.320/64 são essenciais. Domine os tipos de receita e despesa e os limites da LRF.",
    arquivo: "dir-financeiro.html"
  },
  {
    id: "igualdade-racial", nome: "Igualdade Racial e de Gênero", area: "Específico · Transversal", emoji: "🤝",
    prioridade: 1, peso: "5 questões",
    topicos: ["Estatuto da Igualdade Racial (Lei 12.288/10)","Lei Maria da Penha","Políticas afirmativas","Discriminação indireta","Conceitos de raça e etnia","Equidade de gênero no serviço público"],
    dica: "Matéria nova no edital. 5 questões objetivas — leia o Estatuto da Igualdade Racial e a Lei Maria da Penha.",
    arquivo: "igualdade-racial.html"
  },

  // ── ADIÇÕES DO PADRÃO FGV — SEFAZ-AM 2022 (referência para SEFAZ-BA 2026) ──

  // Contabilidade Avançada — era embutida, mas FGV cobrou 10 questões separadas no AM
  {
    id: "contabilidade-avancada", nome: "Contabilidade Avançada", area: "Específico · Contábil", emoji: "📐",
    prioridade: 3, peso: "10–12 questões (peso 2 no AM)",
    topicos: [
      "CPC 00 — Estrutura Conceitual","CPC 03 — Demonstração dos Fluxos de Caixa",
      "CPC 06 — Arrendamentos (IFRS 16)","CPC 07 — Subvenções Governamentais",
      "CPC 12 — Ajuste a Valor Presente (AVP)","CPC 15 — Combinação de Negócios (Goodwill)",
      "CPC 18 — Investimentos em Coligadas (MEP)","CPC 26 — Apresentação das Demonstrações Contábeis",
      "CPC 46 — Mensuração do Valor Justo","Demonstrações Consolidadas","IR Diferido"
    ],
    dica: "FGV cobra CPCs literalmente. No SEFAZ-AM caíram: AVP, Arrendamentos, Goodwill, Valor Justo e IR Diferido. Memorize os critérios de mensuração e classificação.",
    arquivo: "contabilidade-avancada.html",
    fonte: "SEFAZ-AM 2022 FGV — 10 questões peso 2"
  },

  // Contabilidade de Custos — 10 questões separadas no AM
  {
    id: "contabilidade-custos", nome: "Contabilidade de Custos", area: "Específico · Contábil", emoji: "🏭",
    prioridade: 3, peso: "10 questões (peso 2 no AM)",
    topicos: [
      "Conceito e classificação de custos","Custeio por Absorção","Custeio Variável (Direto)",
      "Custeio ABC (por Atividade)","Custo Padrão","Análise CVL (Custo-Volume-Lucro)",
      "Ponto de equilíbrio (contábil, econômico, financeiro)","Margem de contribuição",
      "Formação do preço de venda (markup)","Departamentalização","Custeio de serviços"
    ],
    dica: "FGV cobra cálculo direto de custo de produção, ponto de equilíbrio e margem de contribuição. No SEFAZ-AM caiu custo padrão e classificação de gastos. Pratique com números reais.",
    arquivo: "contabilidade-custos.html",
    fonte: "SEFAZ-AM 2022 FGV — 10 questões peso 2"
  },

  // Análise de Dados — novidade FGV, 8 questões peso 2 no AM; tendência crescente
  {
    id: "analise-dados", nome: "Análise de Dados", area: "Específico · Quantitativo", emoji: "🔬",
    prioridade: 3, peso: "8–10 questões (peso 2 no AM)",
    topicos: [
      "Coleta, organização e limpeza de dados","Tabelas e gráficos (interpretação)","Excel avançado — fórmulas, tabelas dinâmicas",
      "Análise exploratória de dados (EDA)","Indicadores fiscais e KPIs","Cruzamento de bases (auditoria analítica)",
      "SPED — análise de arquivos digitais","Inteligência fiscal e analytics","Amostragem para auditoria",
      "Correlação e regressão aplicada","Detecção de inconsistências em NF-e"
    ],
    dica: "NOVIDADE FGV — 8 questões peso 2 no SEFAZ-AM. Ausente no SEFAZ-BA anterior, mas tendência forte para 2026. Foco em auditoria analítica, SPED e cruzamento de dados fiscais. Excel e SQL básico são diferenciais.",
    arquivo: "analise-dados.html",
    fonte: "SEFAZ-AM 2022 FGV — 8 questões peso 2 · NOVIDADE para SEFAZ-BA"
  },

  // Direito Civil — 5 questões no AM; relevante para obrigações e contratos fiscais
  {
    id: "dir-civil", nome: "Direito Civil", area: "Específico · Jurídico", emoji: "📗",
    prioridade: 2, peso: "5–8 questões",
    topicos: [
      "Pessoa natural e jurídica","Negócio jurídico (validade, vícios)","Obrigações — classificação e extinção",
      "Contratos em geral","Responsabilidade civil","Prescrição e decadência (CC x CTN)",
      "Posse e propriedade","LINDB — aplicação da lei no tempo e espaço"
    ],
    dica: "FGV cobra CC na interface com o direito tributário: responsabilidade, obrigações, prescrição/decadência e LINDB. No SEFAZ-AM caíram negócios jurídicos e responsabilidade civil.",
    arquivo: "dir-civil.html",
    fonte: "SEFAZ-AM 2022 FGV — 5 questões · Prova I"
  },

  // Direito Penal — 5 questões no AM; crimes tributários, lavagem, organizações criminosas
  {
    id: "dir-penal", nome: "Direito Penal (Tributário e Econômico)", area: "Específico · Jurídico", emoji: "⚖️",
    prioridade: 2, peso: "5–8 questões",
    topicos: [
      "Teoria geral do crime","Crimes contra a ordem tributária (Lei 8.137/90)",
      "Sonegação fiscal — modalidades e extinção da punibilidade","Lavagem de dinheiro (Lei 9.613/98)",
      "Crimes contra a Administração Pública","Organizações criminosas (Lei 12.850/13)",
      "Anticorrupção (Lei 12.846/13)","Responsabilidade penal da pessoa jurídica",
      "Crime de responsabilidade","Prescrição penal"
    ],
    dica: "FGV foca em crimes tributários (Lei 8.137/90) e lavagem de dinheiro. Sonegação fiscal + extinção da punibilidade pelo pagamento é tema recorrente. Interface com o trabalho do Auditor Fiscal.",
    arquivo: "dir-penal.html",
    fonte: "SEFAZ-AM 2022 FGV — 5 questões · Prova I"
  },

  // Direito Empresarial — 10 questões no AM com peso relevante
  {
    id: "dir-empresarial", nome: "Direito Empresarial", area: "Específico · Jurídico", emoji: "🏢",
    prioridade: 2, peso: "8–10 questões",
    topicos: [
      "Teoria da empresa — empresário e estabelecimento","Tipos societários (LTDA, SA, EIRELI, SLU)",
      "Registro empresarial","Títulos de crédito (cheque, duplicata, NP, letra de câmbio)",
      "Contratos empresariais","Recuperação judicial e extrajudicial (Lei 11.101/05)",
      "Falência — efeitos sobre o crédito tributário","Grupos empresariais e desconsideração da PJ",
      "Propriedade industrial e intelectual","Concorrência e Lei do CADE (Lei 12.529/11)"
    ],
    dica: "FGV cobrou sociedades, títulos de crédito e falência no SEFAZ-AM — 10 questões. Foco em LTDA vs SA, NF duplicata e efeitos da falência sobre crédito tributário (CTN art. 186).",
    arquivo: "dir-empresarial.html",
    fonte: "SEFAZ-AM 2022 FGV — 10 questões · Prova I"
  },

  // Matemática Financeira — separada de Estatística no AM (10 questões)
  {
    id: "mat-financeira", nome: "Matemática Financeira", area: "Específico · Quantitativo", emoji: "🧮",
    prioridade: 2, peso: "5–10 questões",
    topicos: [
      "Juros simples e compostos","Taxa nominal x taxa efetiva","Taxa real x taxa nominal (inflação)",
      "Desconto simples e composto (comercial e racional)","Amortização — SAC, PRICE, SAA",
      "Valor Presente Líquido (VPL)","Taxa Interna de Retorno (TIR)",
      "Séries uniformes (anuidades)","Equivalência de capitais",
      "Índices de preço (IPCA, IGPM) e correção monetária"
    ],
    dica: "No SEFAZ-AM a FGV cobrou taxa real de juros, desconto e amortização. Caiu também distribuição de Poisson. Resolva com calculadora — questões de múltipla escolha têm margem.",
    arquivo: "mat-financeira.html",
    fonte: "SEFAZ-AM 2022 FGV — ~5 questões em Matemática Financeira e Estatística"
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TELA: GUIAS DE DISCIPLINAS
// ═══════════════════════════════════════════════════════════════════════════
function TelaGuias({ isMobile, online }) {
  const [areaFiltro, setAreaFiltro] = useState("Todas");
  const [guiaSelecionado, setGuiaSelecionado]   = useState(null);
  const [guiaDisponivel, setGuiaDisponivel]     = useState({});

  const areas = ["Todas", ...new Set(DISCIPLINAS.map(d => d.area))];
  const filtradas = DISCIPLINAS.filter(d => areaFiltro === "Todas" || d.area === areaFiltro);

  // Verificar quais guias HTML existem (tenta buscar o arquivo)
  useEffect(() => {
    DISCIPLINAS.forEach(async (d) => {
      try {
        const r = await fetch(`/guias/${d.arquivo}`, { method: "HEAD" });
        if (r.ok) setGuiaDisponivel(prev => ({ ...prev, [d.id]: true }));
      } catch {}
    });
  }, []);

  const estrelas = n => n === 3 ? "⭐⭐⭐" : n === 2 ? "⭐⭐" : "⭐";
  const prioCor  = n => n === 3 ? T.amarelo : n === 2 ? T.verde2 : T.cinza3;

  // Modo visualização do guia HTML
  if (guiaSelecionado) {
    const disc = DISCIPLINAS.find(d => d.id === guiaSelecionado);
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:T.fundo2, borderBottom:`1px solid ${T.borda2}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={() => setGuiaSelecionado(null)} className="btn" style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${T.borda2}`, color:T.cinza3, padding:"6px 12px", borderRadius:7, fontSize:12, fontWeight:600 }}>
            ← Voltar
          </button>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{disc?.emoji} {disc?.nome}</div>
            <div style={{ fontSize:10, color:T.cinza3 }}>{disc?.area}</div>
          </div>
          <a href={`/guias/${disc?.arquivo}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft:"auto" }}>
            <button className="btn" style={{ background:"rgba(0,107,63,0.15)", border:`1px solid rgba(0,107,63,0.35)`, color:T.verde3, padding:"6px 12px", borderRadius:7, fontSize:11, fontWeight:600 }}>
              🔗 Abrir completo
            </button>
          </a>
        </div>
        {/* iframe do guia */}
        <iframe
          src={`/guias/${disc?.arquivo}`}
          style={{ flex:1, border:"none", background:T.fundo }}
          title={disc?.nome}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?"14px":"28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.verde2, marginBottom:5 }}>
          📓 Guias de Disciplinas
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?22:26, fontWeight:900, color:"#fff", marginBottom:4 }}>
          SEFAZ-BA · Todas as Matérias
        </h1>
        <p style={{ color:T.cinza3, fontSize:12, lineHeight:1.6 }}>
          {DISCIPLINAS.length} disciplinas · {DISCIPLINAS.filter(d=>d.fonte).length} identificadas no SEFAZ-AM FGV 2022 · {Object.keys(guiaDisponivel).length} guias disponíveis ·{" "}
          <span style={{ color:T.amarelo }}>Coloque seus HTMLs em <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>/public/guias/</code></span>
        </p>
      </div>

      {/* Instrução para adicionar guias */}
      <div style={{ background:"rgba(249,194,49,0.06)", border:`1px solid rgba(249,194,49,0.2)`, borderRadius:10, padding:"12px 16px", marginBottom:20, fontSize:12, color:T.cinza3, lineHeight:1.7 }}>
        <strong style={{ color:T.amarelo }}>📥 Como adicionar seus guias:</strong> Coloque os arquivos HTML na pasta{" "}
        <code style={{ fontFamily:"'JetBrains Mono',monospace", color:T.verde3, fontSize:11 }}>/public/guias/</code> do projeto,
        usando os nomes de arquivo listados em cada card (ex: <code style={{ fontFamily:"'JetBrains Mono',monospace", color:T.verde3, fontSize:11 }}>dir-tributario.html</code>).
        O guia aparece automaticamente integrado na plataforma.
      </div>

      {/* Filtro por área */}
      <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:4, flexWrap:isMobile?"nowrap":"wrap" }}>
        {areas.map(a => (
          <button key={a} onClick={() => setAreaFiltro(a)} className="btn" style={{
            padding:"6px 13px", borderRadius:8, fontSize:11, fontWeight:600, whiteSpace:"nowrap", flexShrink:0,
            background:areaFiltro===a?T.verde2:T.fundo3, color:areaFiltro===a?"#fff":T.cinza3,
            border:`1px solid ${areaFiltro===a?T.verde2:T.borda2}`,
          }}>{a}</button>
        ))}
      </div>

      {/* Grid de disciplinas */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {filtradas.map(disc => {
          const temGuia = guiaDisponivel[disc.id];
          const p = disc.prioridade;
          const topBar = p===3 ? `linear-gradient(90deg,${T.amarelo},${T.orange})` : p===2 ? `linear-gradient(90deg,${T.verde},${T.verde2})` : `rgba(255,255,255,0.07)`;

          return (
            <div key={disc.id} style={{
              background:T.fundo3, border:`1px solid ${temGuia?"rgba(0,107,63,0.35)":T.borda2}`,
              borderRadius:13, overflow:"hidden", position:"relative",
              transition:"all .2s",
            }}>
              {/* Barra topo prioridade */}
              <div style={{ height:3, background:topBar }} />

              <div style={{ padding:"16px 18px" }}>
                {/* Cabeçalho */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:22 }}>{disc.emoji}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{disc.nome}</div>
                      <div style={{ fontSize:10, color:T.cinza3, marginTop:1 }}>{disc.peso}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:10, color:prioCor(p), flexShrink:0 }}>{estrelas(p)}</span>
                </div>

                {/* Tópicos principais */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                  {disc.topicos.slice(0, 4).map((t, i) => (
                    <span key={i} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${T.borda2}`, borderRadius:5, padding:"2px 8px", fontSize:10, color:T.cinza3 }}>{t}</span>
                  ))}
                  {disc.topicos.length > 4 && (
                    <span style={{ fontSize:10, color:T.cinza3, padding:"2px 6px" }}>+{disc.topicos.length-4} mais</span>
                  )}
                </div>

                {/* Dica */}
                <div style={{ fontSize:11, color:T.cinza3, borderLeft:`2px solid ${prioCor(p)}40`, paddingLeft:8, lineHeight:1.5, marginBottom:14 }}>
                  💡 {disc.dica}
                </div>

                {/* Badge de fonte FGV-AM */}
                {disc.fonte && (
                  <div style={{ fontSize:10, color:"#9F7AEA", background:"rgba(159,122,234,0.1)", border:"1px solid rgba(159,122,234,0.25)", borderRadius:6, padding:"3px 8px", marginBottom:8, display:"inline-block" }}>
                    🔍 {disc.fonte}
                  </div>
                )}

                {/* Rodapé: arquivo + botão */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.cinza3+"80", background:"rgba(0,0,0,0.2)", padding:"3px 8px", borderRadius:5 }}>
                    {disc.arquivo}
                  </code>
                  {temGuia ? (
                    <button onClick={() => setGuiaSelecionado(disc.id)} className="btn" style={{
                      background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
                      padding:"6px 16px", borderRadius:8, fontSize:12, fontWeight:700, flexShrink:0,
                    }}>
                      📖 Abrir guia
                    </button>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:11, color:T.cinza3 }}>Guia não adicionado</span>
                      <span style={{ fontSize:16 }}>📭</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo de progresso */}
      <div style={{ marginTop:24, background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:12, padding:"16px 20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:12 }}>📊 Cobertura de guias</div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {["Gerais","Específico · Tributário","Específico · Contábil","Específico · Quantitativo","Específico · Jurídico","Específico · Finanças","Específico · Transversal"].map(area => {
            const total = DISCIPLINAS.filter(d=>d.area===area).length;
            const com   = DISCIPLINAS.filter(d=>d.area===area && guiaDisponivel[d.id]).length;
            return (
              <div key={area} style={{ flex:1, minWidth:140 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:T.cinza3 }}>{area.replace("Específico · ","")}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:com===total?T.verde2:T.cinza3 }}>{com}/{total}</span>
                </div>
                <div style={{ background:T.fundo2, borderRadius:99, height:5, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${total>0?(com/total*100):0}%`, background:`linear-gradient(90deg,${T.verde},${T.verde2})`, borderRadius:99, transition:"width 1s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: JURISPRUDÊNCIA — STF + STJ
// ═══════════════════════════════════════════════════════════════════════════

const CACHE_JURIS = "juris_cache_v1";
function getJurisCache(key) {
  try { const c = JSON.parse(localStorage.getItem(CACHE_JURIS)||"{}"); return c[key]||null; } catch { return null; }
}
function setJurisCache(key, val) {
  try { const c = JSON.parse(localStorage.getItem(CACHE_JURIS)||"{}"); c[key]=val; localStorage.setItem(CACHE_JURIS,JSON.stringify(c)); } catch {}
}

// Informativos STJ numerados mais recentes (vamos buscar por XML do RSS)
async function buscarInformativosSTJ() {
  const cached = getJurisCache("stj_feed");
  if (cached) return cached;
  // RSS oficial do STJ
  const r = await fetch("https://processo.stj.jus.br/jurisprudencia/externo/InformativoFeed");
  const xml = await r.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = [...doc.querySelectorAll("item")].slice(0, 20).map(item => ({
    titulo: item.querySelector("title")?.textContent || "",
    link:   item.querySelector("link")?.textContent || "",
    data:   item.querySelector("pubDate")?.textContent || "",
    resumo: item.querySelector("description")?.textContent?.replace(/<[^>]+>/g,"").slice(0, 300) || "",
    fonte:  "STJ",
  }));
  setJurisCache("stj_feed", items);
  return items;
}

// Tentar buscar PDF do STF por número (URL pública previsível)
async function buscarUltimoSTF() {
  const cached = getJurisCache("stf_recentes");
  if (cached) return cached;
  // STF informativos numerados — número atual estimado ~1219 (jun/2026)
  const numeros = [1219, 1218, 1217, 1216, 1215, 1214, 1213, 1212, 1211, 1210];
  const items = numeros.map(n => ({
    titulo: `Informativo STF nº ${n}`,
    link: `https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_${n}.pdf`,
    data: "",
    resumo: "Clique para abrir o PDF oficial do Informativo STF no portal do Supremo.",
    fonte: "STF",
    numero: n,
  }));
  setJurisCache("stf_recentes", items);
  return items;
}

function TelaJuris({ isMobile, online, leiAtiva, stats, setStats }) {
  const [fonte, setFonte]         = useState("STJ");
  const [area, setArea]           = useState("Todas");
  const [items, setItems]         = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]           = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [comentario, setComentario]  = useState("");
  const [gerando, setGerando]     = useState(false);
  const [savedComents, setSaved]  = useState(() => JSON.parse(localStorage.getItem("juris_comentarios")||"{}"));

  useEffect(() => { localStorage.setItem("juris_comentarios", JSON.stringify(savedComents)); }, [savedComents]);

  useEffect(() => {
    if (!online) { setErro("Sem conexão. Informativos em cache disponíveis."); return; }
    carregar();
  }, [fonte, online]);

  async function carregar() {
    setCarregando(true); setErro(""); setItems([]);
    try {
      if (fonte === "STJ") {
        const data = await buscarInformativosSTJ();
        setItems(data);
      } else {
        const data = await buscarUltimoSTF();
        setItems(data);
      }
    } catch (e) {
      setErro("Não foi possível carregar. Verifique a conexão.");
    }
    setCarregando(false);
  }

  async function gerarComentario(item) {
    setSelecionado(item);
    const cacheKey = `${item.fonte}_${item.titulo}`;
    const cached = savedComents[cacheKey];
    if (cached) { setComentario(cached); return; }
    if (!online) { setComentario("⚠️ Sem conexão para gerar comentário."); return; }
    setGerando(true); setComentario("");
    const prompt = `Você é um professor preparatório especializado em concursos fiscais (SEFAZ-BA, Receita Federal).
Analise este informativo jurídico e produza um comentário didático no seguinte formato:

📌 TESE FIXADA:
[resuma a tese em 1–2 frases diretas]

⚖️ CONTEXTO:
[explique o caso concreto e por que chegou ao tribunal — máx. 3 linhas]

🎯 IMPACTO PARA O FISCAL:
[como isso afeta a prática do Auditor Fiscal? ex: ICMS, execução fiscal, lançamento]

📚 BASE LEGAL:
[cite artigos do CTN, CF/88, lei aplicável]

❓ QUESTÃO CESPE GERADA:
[crie 1 questão Certo/Errado no estilo CESPE com gabarito e breve explicação]

Informativo: ${item.titulo}
Fonte: ${item.fonte}
Resumo disponível: ${item.resumo}`;

    const resp = await callClaude(
      "Você é professor de direito tributário para concursos. Seja direto, didático e preciso. Foque em ICMS, Execução Fiscal e Processo Tributário.",
      prompt, 1200
    );
    setComentario(resp);
    setSaved(prev => ({ ...prev, [cacheKey]: resp }));
    setStats(s => ({ ...s, pontos: s.pontos + 10 }));
    setGerando(false);
  }

  const areas = ["Todas", "Tributário", "Administrativo", "Civil/Empresarial", "Penal"];

  // Filtro simples por palavras-chave na área
  const filtrarArea = (item) => {
    if (area === "Todas") return true;
    const txt = (item.titulo + item.resumo).toLowerCase();
    const mapa = {
      "Tributário": ["icms","tribut","imposto","contribui","fiscal","crédito tributário","lançamento","isenção","execução fiscal"],
      "Administrativo": ["administrat","servidor","licitaç","improbidade","ato admin","serviço público"],
      "Civil/Empresarial": ["civil","contrato","responsabilidade","empresa","falência","sociedade"],
      "Penal": ["penal","crime","sonegação","lavagem","fraude","delito"],
    };
    return (mapa[area]||[]).some(kw => txt.includes(kw));
  };

  const itemsFiltrados = items.filter(filtrarArea);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:isMobile?"column":"row", overflow:"hidden" }}>
      {/* ── LISTA ── */}
      <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px 14px":"24px 28px", minWidth:0 }}>
        {/* Header */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.verde2, marginBottom:4 }}>⚖️ Jurisprudência</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:24, fontWeight:900, color:"#fff", marginBottom:3 }}>Informativos STF e STJ</h1>
          <p style={{ color:T.cinza3, fontSize:12 }}>Clique em um informativo → a IA gera comentário didático para concurso + questão CESPE.</p>
        </div>

        {!online && (
          <div style={{ background:"rgba(237,137,54,0.08)", border:`1px solid rgba(237,137,54,0.25)`, borderRadius:9, padding:"10px 13px", marginBottom:14, fontSize:12, color:"#FCD34D", display:"flex", gap:8 }}>
            <span>📡</span><span>Modo offline — comentários já gerados ficam salvos. Novos informativos precisam de internet.</span>
          </div>
        )}

        {/* Seleção de fonte */}
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          {["STJ","STF"].map(f => (
            <button key={f} onClick={() => setFonte(f)} className="btn" style={{
              padding:"8px 20px", borderRadius:9, fontSize:13, fontWeight:700,
              background:fonte===f?`linear-gradient(135deg,${T.verde},${T.verde2})`:T.fundo3,
              color:fonte===f?"#fff":T.cinza3, border:`1px solid ${fonte===f?"transparent":T.borda2}`,
            }}>{f === "STJ" ? "📘 STJ" : "🏛️ STF"}</button>
          ))}
          <button onClick={carregar} className="btn" disabled={!online||carregando} style={{
            padding:"8px 14px", borderRadius:9, fontSize:12, fontWeight:600,
            background:"rgba(255,255,255,0.05)", border:`1px solid ${T.borda2}`, color:T.cinza3,
            cursor:online&&!carregando?"pointer":"not-allowed",
          }}>{carregando?"⏳ Carregando…":"🔄 Atualizar"}</button>
        </div>

        {/* Filtro por área */}
        <div style={{ display:"flex", gap:5, marginBottom:16, overflowX:"auto", paddingBottom:3 }}>
          {areas.map(a => (
            <button key={a} onClick={() => setArea(a)} className="btn" style={{
              padding:"5px 12px", borderRadius:7, fontSize:11, fontWeight:600, whiteSpace:"nowrap", flexShrink:0,
              background:area===a?T.verde2:T.fundo3, color:area===a?"#fff":T.cinza3,
              border:`1px solid ${area===a?T.verde2:T.borda2}`,
            }}>{a}</button>
          ))}
        </div>

        {/* Lista de informativos */}
        {carregando && <Spinner label="Buscando informativos…" />}
        {erro && !carregando && (
          <div style={{ background:"rgba(229,62,62,0.08)", border:`1px solid rgba(229,62,62,0.2)`, borderRadius:9, padding:"12px 16px", color:"#FCA5A5", fontSize:13 }}>
            ⚠️ {erro}
          </div>
        )}

        {!carregando && itemsFiltrados.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {itemsFiltrados.map((item, i) => {
              const cacheKey = `${item.fonte}_${item.titulo}`;
              const temComent = !!savedComents[cacheKey];
              const ativo = selecionado?.titulo === item.titulo;

              return (
                <div key={i} style={{
                  background:ativo?"rgba(0,107,63,0.1)":T.fundo3,
                  border:`1px solid ${ativo?"rgba(0,107,63,0.4)":T.borda2}`,
                  borderRadius:11, padding:"14px 16px",
                  cursor:"pointer", transition:"all .2s",
                }}
                onMouseEnter={e => { if(!ativo) e.currentTarget.style.borderColor="rgba(0,107,63,0.3)"; }}
                onMouseLeave={e => { if(!ativo) e.currentTarget.style.borderColor=T.borda2; }}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <Badge color={item.fonte==="STJ"?"verde":"cinza"} style={{ fontSize:10 }}>{item.fonte}</Badge>
                        {temComent && <Badge color="amarelo" style={{ fontSize:10 }}>💬 comentado</Badge>}
                        {item.data && <span style={{ fontSize:10, color:T.cinza3 }}>{new Date(item.data).toLocaleDateString("pt-BR")}</span>}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.4 }}>{item.titulo}</div>
                    </div>
                  </div>
                  {item.resumo && (
                    <p style={{ fontSize:12, color:T.cinza3, lineHeight:1.6, marginBottom:10 }}>
                      {item.resumo.slice(0, 180)}{item.resumo.length > 180 ? "…" : ""}
                    </p>
                  )}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button onClick={() => gerarComentario(item)} className="btn" style={{
                      background:temComent?"rgba(0,107,63,0.15)":`linear-gradient(135deg,${T.verde},${T.verde2})`,
                      border:temComent?`1px solid rgba(0,107,63,0.4)`:"none",
                      color:temComent?T.verde3:"#fff", padding:"6px 14px", borderRadius:7, fontSize:12, fontWeight:700,
                    }}>
                      {temComent ? "💬 Ver comentário" : "🤖 Comentar com IA"}
                    </button>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                      <button className="btn" style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${T.borda2}`, color:T.cinza3, padding:"6px 12px", borderRadius:7, fontSize:11 }}>
                        {item.fonte==="STF" ? "📄 PDF" : "🔗 Original"}
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!carregando && itemsFiltrados.length === 0 && items.length > 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:T.cinza3 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
            <div style={{ fontSize:14 }}>Nenhum informativo sobre "{area}"</div>
            <div style={{ fontSize:12, marginTop:4 }}>Tente outro filtro de área</div>
          </div>
        )}
      </div>

      {/* ── PAINEL DO COMENTÁRIO IA ── */}
      {selecionado && (
        <div style={{
          width:isMobile?"100%":380, flexShrink:0,
          background:T.fundo2, borderLeft:isMobile?"none":`1px solid ${T.borda2}`,
          borderTop:isMobile?`1px solid ${T.borda2}`:"none",
          overflow:"auto", padding:isMobile?"14px":"20px",
          maxHeight:isMobile?320:"100%",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <Badge color="verde">🤖 Análise IA</Badge>
            <div style={{ display:"flex", gap:6 }}>
              {comentario && (
                <button onClick={() => navigator.clipboard.writeText(comentario)} className="btn" style={{ background:"rgba(249,194,49,0.1)", border:`1px solid rgba(249,194,49,0.25)`, color:T.amarelo, padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700 }}>📋</button>
              )}
              <button onClick={() => { setSelecionado(null); setComentario(""); }} className="btn" style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${T.borda2}`, color:T.cinza3, padding:"4px 10px", borderRadius:6, fontSize:13 }}>✕</button>
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:10, lineHeight:1.4 }}>{selecionado.titulo}</div>
          {gerando ? <Spinner label="Gerando análise…" /> : (
            comentario ? (
              <div style={{ fontSize:12, color:T.branco, lineHeight:1.9, whiteSpace:"pre-wrap" }}>{comentario}</div>
            ) : (
              <div style={{ textAlign:"center", padding:"30px 10px", color:T.cinza3, fontSize:12 }}>
                Clique em "🤖 Comentar com IA" no informativo
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA: SIMULADO PADRÃO FGV
// ═══════════════════════════════════════════════════════════════════════════

// Prompt-mestre do padrão FGV — construído a partir da análise das provas
// SEFAZ-AM 2022, SEFAZ-BA 2019 (FCC como comparativo) e ISS-SP FGV
const PROMPT_FGV = `Você é um elaborador de questões da Fundação Getulio Vargas (FGV) com 15 anos de experiência em concursos fiscais estaduais.

CALIBRAÇÃO: Você tem acesso aos padrões identificados nas provas reais FGV para SEFAZ:
- SEFAZ-AM 2022 (Auditor Fiscal Tributos Estaduais) — 140 questões analisadas
- SEFAZ-BA 2022 FGV (Agente Tributos Estaduais) — 70 questões, temas cobrados:
  * ICMS BA: hipóteses de incidência, substituição tributária, não cumulatividade, base de cálculo, alíquotas, infrações
  * Simples Nacional (LC 123/06): regras de enquadramento, aquisição de optantes, vedações
  * IPVA BA: repartição de receitas (50% Estado / 50% Município do licenciamento)
  * ITD BA: incidência, base de cálculo
  * Dir. Administrativo: ato administrativo, empresa pública, controle administrativo
  * Contabilidade Geral: CPCs aplicados (AVP, reconhecimento de receita)
  * Estatística: variável aleatória, probabilidade, intervalos de confiança, teste de hipótese
  * PAT BA: processo administrativo tributário, consulta fiscal

PADRÃO FGV OBRIGATÓRIO — siga rigorosamente:

1. ENUNCIADO: Personagem nomeado em situação concreta real (ex: "Ana, Agente de Tributos Estaduais da SEFAZ-BA, ao analisar um auto de infração, verificou que..."). Enunciado narrativo, longo, com dados concretos. NUNCA comece com "Sobre...", "Assinale..." ou "De acordo com a lei...".

2. FÓRMULAS DE COMANDO FGV (use exatamente estas):
   - "Assinale a opção que indica a resposta correta."
   - "Assinale a opção que indica a afirmativa correta."
   - "Com base nas informações acima, assinale a opção correta."
   - "Assinale a única afirmativa correta."

3. ALTERNATIVAS: Exatamente 5 opções (A) a (E). NUNCA Certo/Errado (CESPE).
   - Tamanho similar entre as opções
   - 2–3 opções próximas com diferença técnica sutil (o candidato precisa conhecer o detalhe)
   - Distrator clássico FGV: alternativa quase certa mas com percentual, prazo ou artigo trocado
   - Nenhuma alternativa absurda

4. GABARITO fundamentado no dispositivo legal exato com artigo e inciso.

5. NÍVEL: Médio-alto para Auditor Fiscal ou Agente de Tributos (não básico, não impossível).

6. INTERDISCIPLINARIDADE: misture quando pertinente (ICMS + LC 87/96 + CF/88 art. 155 + RICMS-BA).

7. NOMENCLATURA SEFAZ-BA: quando o cargo for do contexto SEFAZ-BA, use "Agente de Tributos Estaduais" ou "Auditor Fiscal" conforme o caso.

RETORNE APENAS o seguinte JSON (sem markdown, sem explicação fora do JSON):
{
  "disciplina": "nome da disciplina",
  "tema": "subtema específico",
  "dificuldade": "Médio" | "Difícil" | "Muito Difícil",
  "enunciado": "texto completo do enunciado com personagem e situação",
  "alternativas": {
    "A": "texto da alternativa A",
    "B": "texto da alternativa B",
    "C": "texto da alternativa C",
    "D": "texto da alternativa D",
    "E": "texto da alternativa E"
  },
  "gabarito": "A" | "B" | "C" | "D" | "E",
  "fundamentacao": "artigo/lei/dispositivo exato",
  "explicacao_gabarito": "por que a letra correta está certa",
  "explicacao_distratores": {
    "A": "por que está errada (ou 'Gabarito')",
    "B": "por que está errada",
    "C": "por que está errada",
    "D": "por que está errada",
    "E": "por que está errada"
  },
  "dica_prova": "o que o candidato precisa saber para nunca errar este tipo de questão"
}`;

// ── Temas reais extraídos das provas FGV SEFAZ-AM 2022 e SEFAZ-BA 2022 ──
// Mapeados a partir das provas publicadas pela FGV Conhecimento
const PROVAS_REAIS_FGV = [
  // ── SEFAZ-BA 2022 FGV — Administração Tributária (70 questões) ──
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ICMS — hipóteses de incidência", q:"Com relação às hipóteses de incidência do ICMS na legislação baiana" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ICMS — substituição tributária regressiva e progressiva", q:"Em relação ao regime de substituição tributária no ICMS baiano" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ICMS — infrações e penalidades", q:"Com relação às infrações e penalidades previstas na legislação do ICMS BA" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"Simples Nacional — ICMS (LC 123/06)", q:"O Simples Nacional é um regime especial de tributação; sobre suas regras aplicáveis ao ICMS" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"Simples Nacional — aquisições de optantes", q:"Nas aquisições de mercadoria de microempresa optante pelo Simples Nacional" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ICMS — base de cálculo e alíquotas interestaduais", q:"Com relação à base de cálculo do ICMS nas operações interestaduais" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"IPVA BA — repartição de receitas", q:"O produto da arrecadação do IPVA, incluídos os acréscimos correspondentes, é destinado" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"IPVA BA — fato gerador e base de cálculo", q:"Com relação ao Imposto sobre a Propriedade de Veículos Automotores (IPVA) na Bahia" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ITD BA — incidência", q:"Sobre a incidência do Imposto sobre Transmissão Causa Mortis e Doação (ITD) na Bahia" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"PAT BA — processo administrativo tributário", q:"Em relação ao processo administrativo fiscal do Estado da Bahia" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"PAT BA — consulta fiscal", q:"Sobre o processo de consulta junto às autoridades fiscais da SEFAZ-BA" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"CONSEF — Conselho de Fazenda Estadual", q:"O Conselho de Fazenda Estadual (CONSEF) tem competência para" },
  { origem:"SEFAZ-BA 2022", disc:"Legislação Tributária BA", tema:"ICMS — não-cumulatividade e crédito", q:"O ICMS é um imposto não-cumulativo; sobre o mecanismo de crédito e débito" },
  { origem:"SEFAZ-BA 2022", disc:"Direito Tributário (CTN)", tema:"Obrigação tributária principal e acessória", q:"Sobre a obrigação tributária, à luz do Código Tributário Nacional" },
  { origem:"SEFAZ-BA 2022", disc:"Direito Tributário (CTN)", tema:"Inclusão do ICMS na base de cálculo do PIS/COFINS (tese do século)", q:"Sobre a inclusão do ICMS na base de cálculo do PIS e da COFINS" },
  { origem:"SEFAZ-BA 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 47 — Reconhecimento de Receita", q:"O Pronunciamento Técnico CPC 47 disciplina o reconhecimento de receita de contratos com clientes" },
  { origem:"SEFAZ-BA 2022", disc:"Contabilidade Avançada (CPCs)", tema:"Ajuste a Valor Presente (AVP — CPC 12)", q:"Em relação ao reconhecimento do ajuste a valor presente nas demonstrações contábeis" },
  { origem:"SEFAZ-BA 2022", disc:"Contabilidade Avançada (CPCs)", tema:"Ativo de propriedade para investimento — critério de avaliação", q:"Uma sociedade empresária que presta serviços de auditoria possui um terreno mantido para valorização" },
  { origem:"SEFAZ-BA 2022", disc:"Estatística Aplicada", tema:"Distribuição de probabilidade discreta", q:"Uma variável aleatória discreta X tem a seguinte função de probabilidade" },
  { origem:"SEFAZ-BA 2022", disc:"Estatística Aplicada", tema:"Intervalo de confiança para proporção", q:"Uma amostra aleatória simples de candidatos mostrou que determinada proporção" },
  { origem:"SEFAZ-BA 2022", disc:"Estatística Aplicada", tema:"Teste de hipótese — distribuição t-student", q:"Uma amostra aleatória de tamanho n de variável normalmente distribuída será obtida para testar hipóteses" },
  { origem:"SEFAZ-BA 2022", disc:"Igualdade Racial e de Gênero", tema:"Estatuto da Igualdade Racial (Lei 12.288/10)", q:"Maria e João, estudiosos do Estatuto da Igualdade Racial, debatem sobre" },
  // ── SEFAZ-AM 2022 FGV — Auditor Fiscal (140 questões) ──
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Geral", tema:"CPC 00 — Estrutura Conceitual (usuários, características qualitativas)", q:"De acordo com o Pronunciamento Técnico CPC 00 (R2) - Estrutura Conceitual para Relatório Financeiro" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 15 — Combinação de Negócios (Goodwill)", q:"Uma sociedade adquiriu 100% de participação em outra empresa; o valor justo dos ativos e passivos foi estimado" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 18 — Equivalência Patrimonial (MEP)", q:"As Cias. X e Y apresentavam balanços patrimoniais em 31/12/X0. Em janeiro, ocorreram vendas entre elas" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 06 R2 — Arrendamentos (IFRS 16)", q:"Uma sociedade empresária decide começar a atuar no comércio eletrônico, efetuando arrendamento de galpão" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 46 — Mensuração do Valor Justo", q:"De acordo com o Pronunciamento Técnico CPC 46 - Mensuração do Valor Justo, a transação para venda do ativo" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"CPC 07 — Subvenções Governamentais", q:"De acordo com o Pronunciamento Técnico CPC 07 (R1) Subvenção e Assistência Governamentais" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade Avançada (CPCs)", tema:"IR Diferido — crédito fiscal por prejuízo", q:"Uma sociedade empresária apresentava IR diferido — crédito fiscal decorrente de prejuízo fiscal anterior" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade de Custos", tema:"Classificação de gastos — custos vs despesas", q:"Uma sociedade empresária produz e vende produtos. Reconheceu os seguintes gastos no período" },
  { origem:"SEFAZ-AM 2022", disc:"Contabilidade de Custos", tema:"Custo padrão corrente", q:"Em consideração ao custo padrão corrente de um produto" },
  { origem:"SEFAZ-AM 2022", disc:"Matemática Financeira", tema:"Taxa nominal vs taxa real de juros (inflação)", q:"Um banco concedeu empréstimo; ao final do período o cliente pagou valor superior; a inflação foi de X%" },
  { origem:"SEFAZ-AM 2022", disc:"Matemática Financeira", tema:"Amortização — parcela final com saldo devedor", q:"João contraiu empréstimo a taxa de juros de 2% ao mês sobre o saldo devedor; pagou valor no 1º mês" },
  { origem:"SEFAZ-AM 2022", disc:"Estatística Aplicada", tema:"Distribuição de Poisson — probabilidade", q:"O número de eventos que chega a um ponto siga distribuição Poisson com média λ por intervalo de tempo" },
  { origem:"SEFAZ-AM 2022", disc:"Estatística Aplicada", tema:"Teste de qui-quadrado — independência", q:"Para se testar a independência entre dois atributos, dados amostrais serão organizados em tabela de contingência" },
  { origem:"SEFAZ-AM 2022", disc:"Direito Constitucional", tema:"Foro por prerrogativa de função — aposentadoria", q:"João, Juiz de Direito, teve severa briga com vizinho. Como já preencheu requisitos para aposentadoria voluntária" },
  { origem:"SEFAZ-AM 2022", disc:"Direito Constitucional", tema:"Partidos políticos — personalidade jurídica e filiação", q:"Um grupo decidiu constituir um partido político e lançar candidatos nas eleições" },
  { origem:"SEFAZ-AM 2022", disc:"Direito Constitucional", tema:"Medida provisória — vedações e aprovação", q:"Lei municipal vetada pelo prefeito mas promulgada pela câmara por unanimidade" },
  { origem:"SEFAZ-AM 2022", disc:"Direito Administrativo", tema:"Mandado de segurança vs habeas data", q:"João solicitou acesso ao seu cadastro em secretaria municipal e constatou dados incorretos; a retificação foi negada" },
  { origem:"SEFAZ-AM 2022", disc:"Direito Administrativo", tema:"Estrangeiro residente — direitos políticos (reciprocidade)", q:"Maria, de nacionalidade portuguesa, tem residência permanente no Brasil há mais de duas décadas; quer concorrer a cargo eletivo" },
  { origem:"SEFAZ-AM 2022", disc:"Análise de Dados", tema:"Auditoria analítica — cruzamento de bases fiscais", q:"Um Auditor Fiscal, ao realizar auditoria analítica em estabelecimento, cruzou os dados do SPED Fiscal com NF-e" },
];

// Função para sugerir subtema baseado nas provas reais
function getSugestaoProvaReal(discId) {
  const provas = PROVAS_REAIS_FGV.filter(p => {
    const label = DISC_SIMULADO.find(d => d.id === discId)?.label || "";
    return p.disc === label;
  });
  if (provas.length === 0) return null;
  return provas[Math.floor(Math.random() * provas.length)];
}

// Configurações de disciplinas para geração
const DISC_SIMULADO = [
  { id:"dir-tributario",       label:"Direito Tributário (CTN)",         icon:"💰", subtemas:[
      "Obrigação tributária principal e acessória (CTN 113-118)",
      "Sujeição ativa e passiva — contribuinte vs responsável",
      "Solidariedade tributária (CTN 124-125)",
      "Responsabilidade tributária dos sócios e sucessores",
      "Crédito tributário e lançamento (CTN 139-150)",
      "Suspensão da exigibilidade — moratória e parcelamento",
      "Extinção do crédito — pagamento, compensação, remissão",
      "Exclusão do crédito — isenção vs anistia",
      "Garantias e privilégios do crédito tributário",
      "Crédito tributário na falência (CTN 186-188)",
      "Decadência e prescrição tributária",
      "Administração tributária — fiscalização e sigilo",
      "Dívida Ativa — inscrição e certidão",
      "Interpretação da legislação tributária (CTN 107-112)"
    ] },
  { id:"legislacao-ba",        label:"Legislação Tributária BA",          icon:"⚡", subtemas:[
      "ICMS — hipóteses de incidência (Lei 7.014/96)",
      "ICMS — base de cálculo e alíquotas",
      "ICMS — não-cumulatividade e crédito",
      "ICMS — substituição tributária (para frente e para trás)",
      "ICMS — não-incidência e isenções (RICMS/BA)",
      "ICMS — infrações, penalidades e auto de infração",
      "ICMS — DIFAL (EC 87/15 e EC 132/23)",
      "Simples Nacional — ICMS BA (LC 123/06)",
      "IPVA BA — fato gerador, BC, alíquotas e repartição",
      "ITD BA — incidência, base de cálculo, alíquotas",
      "PAT BA — processo administrativo tributário (Dec. 7.629/99)",
      "Consulta fiscal — procedimento e efeitos",
      "Taxas estaduais (Lei 11.631/09)",
      "Reforma Tributária — impacto no ICMS (EC 132/23 + LC 214/25)"
    ] },
  { id:"dir-constitucional",   label:"Direito Constitucional",           icon:"🏛️", subtemas:["Princípios tributários","Imunidades tributárias","Competência tributária","Sistema tributário nacional","Repartição de receitas","Controle de constitucionalidade"] },
  { id:"dir-administrativo",   label:"Direito Administrativo",           icon:"🏢", subtemas:["Atos administrativos","Poderes administrativos","Licitações (Lei 14.133/21)","Improbidade administrativa","Responsabilidade civil do Estado","Serviços públicos","Processo administrativo (Lei 9.784/99)"] },
  { id:"contabilidade",        label:"Contabilidade Geral",              icon:"📊", subtemas:["Balanço Patrimonial","DRE — Demonstração do Resultado","Estoques (PEPS/UEPS/MPM)","Imobilizado e depreciação","DFC — Fluxos de Caixa","Patrimônio Líquido","Provisões e contingências"] },
  { id:"contabilidade-avancada",label:"Contabilidade Avançada (CPCs)",   icon:"📐", subtemas:["CPC 15 — Combinação de negócios (Goodwill)","CPC 18 — MEP (Equivalência Patrimonial)","CPC 06 — Arrendamentos","CPC 03 — Demonstração dos Fluxos de Caixa","CPC 12 — Ajuste a Valor Presente","CPC 46 — Valor Justo","IR Diferido"] },
  { id:"contabilidade-custos", label:"Contabilidade de Custos",          icon:"🏭", subtemas:["Custeio por Absorção x Variável","Ponto de equilíbrio","Margem de contribuição","Custo Padrão","ABC — Custeio por Atividade","Formação do preço (markup)","Classificação de gastos"] },
  { id:"auditoria",            label:"Auditoria Fiscal",                 icon:"🔍", subtemas:["Planejamento e riscos de auditoria","Controles internos","NBC TAs — normas de auditoria","Papéis de trabalho","Auditoria fiscal tributária","Relatório do auditor","Fraude e erro"] },
  { id:"dir-empresarial",      label:"Direito Empresarial",              icon:"🏢", subtemas:["Tipos societários (LTDA vs SA)","Títulos de crédito","Recuperação judicial (Lei 11.101/05)","Falência e crédito tributário","Grupos empresariais","Desconsideração da PJ"] },
  { id:"dir-civil",            label:"Direito Civil",                    icon:"📗", subtemas:["Negócio jurídico e vícios","Obrigações","Responsabilidade civil","Prescrição e decadência (CC x CTN)","LINDB — aplicação da lei","Pessoa jurídica"] },
  { id:"dir-penal",            label:"Direito Penal Tributário",         icon:"⚖️", subtemas:["Crimes contra a ordem tributária (Lei 8.137/90)","Sonegação e extinção da punibilidade","Lavagem de dinheiro (Lei 9.613/98)","Organizações criminosas","Anticorrupção (Lei 12.846/13)"] },
  { id:"analise-dados",        label:"Análise de Dados",                 icon:"🔬", subtemas:["Auditoria analítica — cruzamento de dados","SPED Fiscal e EFD-ICMS","Análise de NF-e e inconsistências","Excel avançado para fiscal","Indicadores de desempenho fiscal","Amostragem para auditoria"] },
  { id:"estatistica",          label:"Estatística Aplicada",             icon:"📈", subtemas:["Distribuições de probabilidade","Testes de hipótese","Regressão linear","Amostragem e inferência","Estatística descritiva","Qui-quadrado e ANOVA"] },
  { id:"mat-financeira",       label:"Matemática Financeira",            icon:"🧮", subtemas:["Juros compostos e taxa efetiva","Taxa real de juros","Amortização SAC e PRICE","VPL e TIR","Séries uniformes (anuidades)","Desconto comercial e racional"] },
  { id:"dir-financeiro",       label:"Direito Financeiro e LRF",         icon:"📋", subtemas:["Lei 4.320/64 — receita e despesa","LRF — limites e vedações","PPA, LDO e LOA","Créditos adicionais","Dívida pública","Controle externo — TCU e TCE"] },
];

// Cache de histórico de questões (evita repetição)
function getHistoricoSimulado() {
  try { return JSON.parse(localStorage.getItem("simulado_historico")||"[]"); } catch { return []; }
}
function addHistorico(q) {
  try {
    const h = getHistoricoSimulado();
    h.unshift({ tema:q.tema, disciplina:q.disciplina, data:new Date().toISOString() });
    localStorage.setItem("simulado_historico", JSON.stringify(h.slice(0,200)));
  } catch {}
}

function TelaSimulado({ isMobile, online, stats, setStats }) {
  const [discSel, setDiscSel]       = useState(null);      // disciplina selecionada
  const [subtema, setSubtema]       = useState("");         // subtema livre ou da lista
  const [temaLivre, setTemaLivre]   = useState("");         // campo livre
  const [questao, setQuestao]       = useState(null);       // questão gerada
  const [gerando, setGerando]       = useState(false);
  const [respostaUser, setRespUser] = useState(null);       // letra escolhida
  const [mostrarGab, setMostrarGab] = useState(false);
  const [historico, setHistorico]   = useState(() => getHistoricoSimulado());
  const [modo, setModo]             = useState("gerar");    // gerar | resultado | historico
  const [placar, setPlacar]         = useState(() => JSON.parse(localStorage.getItem("simulado_placar")||'{"acertos":0,"erros":0,"total":0}'));
  const [qty, setQty]               = useState(1);          // quantas questões gerar de vez
  const [fila, setFila]             = useState([]);         // fila de questões
  const [filaidx, setFilaIdx]       = useState(0);

  useEffect(() => { localStorage.setItem("simulado_placar", JSON.stringify(placar)); }, [placar]);

  const disc = DISC_SIMULADO.find(d => d.id === discSel);

  async function gerarQuestao(temaAlvo, discAlvo, promptCustom) {
    if (!online) return null;
    const d = DISC_SIMULADO.find(x => x.id === discAlvo) || disc;
    const tema = temaAlvo || subtema || temaLivre || (d?.subtemas[Math.floor(Math.random()*d.subtemas.length)]);
    const hist = getHistoricoSimulado().slice(0,10).map(h=>h.tema).join(", ");

    const systemPrompt = promptCustom || PROMPT_FGV;
    const prompt = `Gere uma questão padrão FGV para concurso Auditor Fiscal SEFAZ-BA 2026.
Disciplina: ${d?.label || "Direito Tributário"}
Tema específico: ${tema}
${hist ? `Temas já cobrados recentemente (EVITE repetir): ${hist}` : ""}
Nível: médio-alto, candidato preparado para concurso fiscal estadual.`;

    const resp = await callClaude(systemPrompt, prompt, 1500);
    try {
      const clean = resp.replace(/```json|```/g,"").trim();
      const q = JSON.parse(clean);
      addHistorico(q);
      return q;
    } catch { return null; }
  }

  async function gerarFila() {
    if (!online || !discSel) return;
    setGerando(true); setFila([]); setFilaIdx(0); setQuestao(null); setRespUser(null); setMostrarGab(false);
    const resultado = [];
    for (let i = 0; i < qty; i++) {
      const q = await gerarQuestao(null, discSel);
      if (q) resultado.push(q);
    }
    setFila(resultado);
    if (resultado.length > 0) { setQuestao(resultado[0]); setModo("resultado"); }
    setGerando(false);
    setStats(s => ({ ...s, questoesGeradas: s.questoesGeradas + resultado.length, pontos: s.pontos + resultado.length * 5 }));
  }

  function responder(letra) {
    if (respostaUser) return;
    setRespUser(letra);
    setMostrarGab(true);
    const acertou = letra === questao.gabarito;
    setPlacar(p => ({ acertos: p.acertos+(acertou?1:0), erros: p.erros+(acertou?0:1), total: p.total+1 }));
    setStats(s => ({ ...s, pontos: s.pontos + (acertou ? 20 : 5) }));
    setHistorico(getHistoricoSimulado());
  }

  function proximaQuestao() {
    const next = filaidx + 1;
    if (next < fila.length) {
      setFilaIdx(next);
      setQuestao(fila[next]);
      setRespUser(null);
      setMostrarGab(false);
    } else {
      setModo("gerar");
      setQuestao(null);
      setRespUser(null);
      setMostrarGab(false);
    }
  }

  const taxaAcerto = placar.total > 0 ? Math.round(placar.acertos/placar.total*100) : 0;

  // ── CORES DE ALTERNATIVA ──
  function corAlt(letra) {
    if (!respostaUser) return { bg: T.fundo3, border: T.borda2, color: T.branco };
    if (letra === questao?.gabarito) return { bg:"rgba(0,107,63,0.15)", border:"rgba(0,107,63,0.6)", color:T.verde3 };
    if (letra === respostaUser)      return { bg:"rgba(229,62,62,0.12)", border:"rgba(229,62,62,0.5)", color:"#FCA5A5" };
    return { bg: T.fundo3, border: T.borda2, color: T.cinza3 };
  }

  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px 14px":"24px 32px" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.verde2, marginBottom:4 }}>🎯 Simulado Padrão FGV</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:26, fontWeight:900, color:"#fff", marginBottom:4 }}>
          Questões no Estilo da Banca
        </h1>
        <p style={{ color:T.cinza3, fontSize:12 }}>
          Geradas por IA com enunciado situacional, 5 alternativas, gabarito comentado e fundamentação legal — exatamente como a FGV elabora.
        </p>
      </div>

      {/* ── PLACAR GLOBAL ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {[
          { label:"Acertos", val:placar.acertos, cor:T.verde2 },
          { label:"Erros",   val:placar.erros,   cor:T.red },
          { label:"Total",   val:placar.total,   cor:T.cinza3 },
          { label:"Taxa",    val:`${taxaAcerto}%`, cor:taxaAcerto>=70?T.verde2:taxaAcerto>=50?T.amarelo:T.red },
        ].map(item => (
          <div key={item.label} style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:10, padding:"10px 16px", flex:1, minWidth:80, textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:item.cor, lineHeight:1 }}>{item.val}</div>
            <div style={{ fontSize:10, color:T.cinza3, marginTop:3, fontWeight:600 }}>{item.label}</div>
          </div>
        ))}
        {placar.total > 0 && (
          <button onClick={() => { setPlacar({acertos:0,erros:0,total:0}); localStorage.setItem("simulado_placar","{}"); }} className="btn"
            style={{ background:"transparent", border:`1px solid ${T.borda2}`, color:T.cinza3, borderRadius:10, padding:"10px 14px", fontSize:11 }}>
            🗑️ Zerar
          </button>
        )}
      </div>

      {!online && (
        <div style={{ background:"rgba(237,137,54,0.08)", border:`1px solid rgba(237,137,54,0.25)`, borderRadius:9, padding:"10px 13px", marginBottom:16, fontSize:12, color:"#FCD34D", display:"flex", gap:8 }}>
          <span>📡</span><span>Simulado requer conexão com a internet para gerar questões.</span>
        </div>
      )}

      <div style={{ display:"flex", gap:isMobile?0:20, flexDirection:isMobile?"column":"row", alignItems:"flex-start" }}>

        {/* ── PAINEL ESQUERDO: CONFIGURAÇÃO ── */}
        <div style={{ width:isMobile?"100%":280, flexShrink:0, marginBottom:isMobile?16:0 }}>
          <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, padding:"18px 16px", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.verde2, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>⚙️ Configurar questão</div>

            {/* Seleção de disciplina */}
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:T.cinza3, marginBottom:7, fontWeight:600 }}>Disciplina</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, maxHeight:280, overflowY:"auto" }}>
                {DISC_SIMULADO.map(d => (
                  <button key={d.id} onClick={() => { setDiscSel(d.id); setSubtema(""); setTemaLivre(""); }} className="btn" style={{
                    padding:"8px 11px", borderRadius:8, fontSize:12, fontWeight:discSel===d.id?700:400, textAlign:"left",
                    background:discSel===d.id?"rgba(0,107,63,0.18)":"transparent",
                    border:`1px solid ${discSel===d.id?"rgba(0,107,63,0.4)":"transparent"}`,
                    color:discSel===d.id?T.verde3:T.cinza3,
                    display:"flex", alignItems:"center", gap:7,
                  }}>
                    <span style={{ fontSize:14 }}>{d.icon}</span>
                    <span style={{ lineHeight:1.3 }}>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtema */}
            {disc && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:T.cinza3, marginBottom:7, fontWeight:600 }}>Subtema (opcional)</div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:180, overflowY:"auto" }}>
                  <button onClick={() => setSubtema("")} className="btn" style={{
                    padding:"6px 10px", borderRadius:7, fontSize:11, textAlign:"left",
                    background:!subtema?"rgba(249,194,49,0.1)":"transparent",
                    border:`1px solid ${!subtema?"rgba(249,194,49,0.3)":"transparent"}`,
                    color:!subtema?T.amarelo:T.cinza3,
                  }}>🎲 Aleatório</button>
                  {disc.subtemas.map(s => (
                    <button key={s} onClick={() => setSubtema(s)} className="btn" style={{
                      padding:"6px 10px", borderRadius:7, fontSize:11, textAlign:"left",
                      background:subtema===s?"rgba(0,107,63,0.15)":"transparent",
                      border:`1px solid ${subtema===s?"rgba(0,107,63,0.35)":"transparent"}`,
                      color:subtema===s?T.verde3:T.cinza3,
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Tema livre */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.cinza3, marginBottom:6, fontWeight:600 }}>Ou escreva o tema</div>
              <input value={temaLivre} onChange={e=>setTemaLivre(e.target.value)}
                placeholder="Ex: responsabilidade tributária do sócio..."
                style={{ width:"100%", background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:8, padding:"8px 11px", color:T.branco, fontSize:12, outline:"none" }} />
            </div>

            {/* Quantidade */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.cinza3, marginBottom:7, fontWeight:600 }}>Quantidade de questões</div>
              <div style={{ display:"flex", gap:6 }}>
                {[1,3,5,10].map(n => (
                  <button key={n} onClick={() => setQty(n)} className="btn" style={{
                    flex:1, padding:"7px 4px", borderRadius:7, fontSize:12, fontWeight:700,
                    background:qty===n?T.verde2:T.fundo2,
                    color:qty===n?"#fff":T.cinza3,
                    border:`1px solid ${qty===n?T.verde2:T.borda2}`,
                  }}>{n}</button>
                ))}
              </div>
            </div>

            {/* Botão: Gerar no estilo provas reais */}
            {discSel && getSugestaoProvaReal(discSel) && (
              <button onClick={async () => {
                const sugestao = getSugestaoProvaReal(discSel);
                if (!sugestao || gerando || !online) return;
                setGerando(true); setFila([]); setFilaIdx(0); setQuestao(null); setRespUser(null); setMostrarGab(false);
                const promptEspecial = `${PROMPT_FGV}

REFERÊNCIA DE PROVA REAL: Esta questão deve seguir o padrão exato de uma questão real da ${sugestao.origem}.
Tema: ${sugestao.tema}
Contexto de enunciado: "${sugestao.q}"
Gere uma questão nova e original neste mesmo estilo e dificuldade, com personagem diferente.`;
                const q = await gerarQuestao(sugestao.tema, discSel, promptEspecial);
                if (q) { setFila([q]); setQuestao(q); setModo("resultado"); setStats(s => ({ ...s, questoesGeradas: s.questoesGeradas + 1, pontos: s.pontos + 5 })); }
                setGerando(false);
              }} disabled={gerando||!online} className="btn" style={{
                width:"100%", padding:"10px", borderRadius:9, fontWeight:700, fontSize:12,
                background:"rgba(159,122,234,0.15)", border:"1px solid rgba(159,122,234,0.4)",
                color:"#C084FC", cursor:"pointer", marginBottom:8,
              }}>
                📋 Gerar no Estilo das Provas Reais
              </button>
            )}

            {/* Botão gerar */}
            <button onClick={gerarFila} disabled={!discSel||gerando||!online} className="btn" style={{
              width:"100%", padding:"13px", borderRadius:10, fontWeight:800, fontSize:14,
              background:(!discSel||gerando||!online)?T.fundo2:`linear-gradient(135deg,${T.verde},${T.verde2})`,
              color:(!discSel||gerando||!online)?T.cinza3:"#fff",
              cursor:(!discSel||gerando||!online)?"not-allowed":"pointer",
              boxShadow:(!discSel||gerando||!online)?"none":`0 6px 24px rgba(0,107,63,0.3)`,
            }}>
              {gerando ? `⏳ Gerando ${qty} questão${qty>1?'es':''}…` : `🎯 Gerar ${qty} Questão${qty>1?'es':''} FGV`}
            </button>

            {!discSel && <div style={{ fontSize:11, color:T.cinza3, textAlign:"center", marginTop:8 }}>Selecione uma disciplina acima</div>}
          </div>

          {/* Histórico recente */}
          {historico.length > 0 && (
            <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.cinza3, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>📋 Últimas questões</div>
              {historico.slice(0,6).map((h,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"6px 0", borderBottom:`1px solid ${T.borda2}` }}>
                  <span style={{ fontSize:11, color:T.cinza3, flexShrink:0 }}>{new Date(h.data).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}</span>
                  <div>
                    <div style={{ fontSize:11, color:T.branco, lineHeight:1.4 }}>{h.tema}</div>
                    <div style={{ fontSize:10, color:T.cinza3 }}>{h.disciplina}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ÁREA DA QUESTÃO ── */}
        <div style={{ flex:1, minWidth:0 }}>
          {gerando && !questao && (
            <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, padding:40, textAlign:"center" }}>
              <Spinner label={`Elaborando ${qty} questão${qty>1?'es':''} no padrão FGV…`} />
              <p style={{ color:T.cinza3, fontSize:12, marginTop:8 }}>Analisando situação-problema, criando alternativas e distratores…</p>
            </div>
          )}

          {questao && (
            <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, overflow:"hidden" }}>
              {/* Header da questão */}
              <div style={{ background:"rgba(0,107,63,0.1)", borderBottom:`1px solid rgba(0,107,63,0.2)`, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ background:T.verde2, color:"#fff", fontSize:11, fontWeight:800, borderRadius:6, padding:"3px 10px" }}>
                    FGV {fila.length>1?`${filaidx+1}/${fila.length}`:""}
                  </span>
                  <span style={{ fontSize:12, color:T.verde3, fontWeight:600 }}>{questao.disciplina}</span>
                  <span style={{ fontSize:11, color:T.cinza3 }}>→ {questao.tema}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11, color:questao.dificuldade==="Muito Difícil"?T.red:questao.dificuldade==="Difícil"?T.orange:T.amarelo, fontWeight:700 }}>
                    {questao.dificuldade==="Muito Difícil"?"🔴":questao.dificuldade==="Difícil"?"🟠":"🟡"} {questao.dificuldade}
                  </span>
                  <button onClick={() => { setQuestao(null); setRespUser(null); setMostrarGab(false); setModo("gerar"); }} className="btn"
                    style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${T.borda2}`, color:T.cinza3, padding:"4px 10px", borderRadius:6, fontSize:11 }}>✕</button>
                </div>
              </div>

              {/* Enunciado */}
              <div style={{ padding:"22px 22px 18px" }}>
                <p style={{ fontSize:isMobile?13:14, color:T.branco, lineHeight:1.85, marginBottom:22, fontFamily:"'Georgia',serif" }}>
                  {questao.enunciado}
                </p>

                {/* Alternativas */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["A","B","C","D","E"].map(letra => {
                    const estilo = corAlt(letra);
                    return (
                      <button key={letra} onClick={() => responder(letra)} disabled={!!respostaUser} className="btn" style={{
                        display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px",
                        background:estilo.bg, border:`1px solid ${estilo.border}`,
                        borderRadius:9, textAlign:"left", cursor:respostaUser?"default":"pointer",
                        transition:"all .2s",
                      }}>
                        <span style={{ fontWeight:900, fontSize:14, color:estilo.color, flexShrink:0, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{letra}</span>
                        <span style={{ fontSize:13, color:estilo.color, lineHeight:1.65 }}>{questao.alternativas[letra]}</span>
                        {respostaUser && letra === questao.gabarito && <span style={{ marginLeft:"auto", fontSize:16, flexShrink:0 }}>✅</span>}
                        {respostaUser && letra === respostaUser && letra !== questao.gabarito && <span style={{ marginLeft:"auto", fontSize:16, flexShrink:0 }}>❌</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gabarito + Explicação */}
              {mostrarGab && (
                <div style={{ borderTop:`1px solid ${T.borda2}`, padding:"18px 22px", background:"rgba(0,0,0,0.15)" }}>
                  {/* Resultado */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                    background:respostaUser===questao.gabarito?"rgba(0,107,63,0.15)":"rgba(229,62,62,0.1)",
                    border:`1px solid ${respostaUser===questao.gabarito?"rgba(0,107,63,0.4)":"rgba(229,62,62,0.3)"}`,
                    borderRadius:9, marginBottom:16,
                  }}>
                    <span style={{ fontSize:24 }}>{respostaUser===questao.gabarito?"✅":"❌"}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:respostaUser===questao.gabarito?T.verde3:"#FCA5A5" }}>
                        {respostaUser===questao.gabarito?"Correto! +20 pontos":"Incorreto. Gabarito: "+questao.gabarito}
                      </div>
                      <div style={{ fontSize:11, color:T.cinza3, marginTop:2 }}>Base legal: {questao.fundamentacao}</div>
                    </div>
                  </div>

                  {/* Explicação do gabarito */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.verde2, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>📖 Por que a alternativa {questao.gabarito} está correta</div>
                    <p style={{ fontSize:13, color:T.branco, lineHeight:1.8 }}>{questao.explicacao_gabarito}</p>
                  </div>

                  {/* Distratores */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.cinza3, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>🔍 Por que as outras estão erradas</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {["A","B","C","D","E"].filter(l=>l!==questao.gabarito).map(l => (
                        <div key={l} style={{ display:"flex", gap:8, fontSize:12, color:T.cinza3, lineHeight:1.6 }}>
                          <span style={{ fontWeight:700, color:"#FCA5A5", flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>{l})</span>
                          <span>{questao.explicacao_distratores?.[l]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dica de prova */}
                  <div style={{ background:"rgba(249,194,49,0.06)", border:`1px solid rgba(249,194,49,0.2)`, borderRadius:9, padding:"10px 14px", marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.amarelo, marginBottom:5 }}>💡 Dica para nunca mais errar</div>
                    <p style={{ fontSize:12, color:T.cinza3, lineHeight:1.7 }}>{questao.dica_prova}</p>
                  </div>

                  {/* Botão próxima */}
                  <button onClick={proximaQuestao} className="btn" style={{
                    width:"100%", padding:"13px", borderRadius:10, fontWeight:700, fontSize:14,
                    background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
                    boxShadow:`0 6px 20px rgba(0,107,63,0.3)`,
                  }}>
                    {filaidx+1 < fila.length ? `➡️ Próxima questão (${filaidx+2}/${fila.length})` : "🎯 Gerar nova questão"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Estado vazio */}
          {!questao && !gerando && (
            <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, padding:"48px 32px", textAlign:"center", color:T.cinza3 }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🎯</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#fff", marginBottom:10 }}>Pronto para simular</h2>
              <p style={{ fontSize:13, maxWidth:380, margin:"0 auto 20px", lineHeight:1.7 }}>
                Selecione uma disciplina, escolha o subtema (ou deixe aleatório) e clique em <strong style={{ color:T.verde2 }}>Gerar Questão FGV</strong>. A IA elabora no padrão exato da banca.
              </p>
              <div style={{ background:"rgba(0,107,63,0.08)", border:`1px solid rgba(0,107,63,0.2)`, borderRadius:10, padding:"14px 18px", maxWidth:400, margin:"0 auto", textAlign:"left" }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.verde2, marginBottom:8 }}>🔍 Padrão FGV aplicado:</div>
                {["Situação-problema com personagem nomeado","5 alternativas com distratores sutis","Gabarito com fundamentação legal exata","Explicação de cada alternativa incorreta","Dica estratégica para não errar mais"].map((item,i) => (
                  <div key={i} style={{ display:"flex", gap:8, fontSize:12, color:T.cinza3, marginBottom:4 }}>
                    <span style={{ color:T.verde2 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
