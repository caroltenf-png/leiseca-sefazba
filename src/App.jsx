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


// ─── CACHE COMPARTILHADO SUPABASE ─────────────────────────────────────────────
// Lógica: busca no Supabase primeiro → se não tem, gera via IA → salva para todos

async function getCacheLei(leiId) {
  try {
    const { data } = await supabase
      .from("cache_leis")
      .select("texto_html")
      .eq("id", leiId)
      .single();
    return data?.texto_html || null;
  } catch { return null; }
}

async function saveCacheLei(leiId, nome, textoHtml, userId) {
  try {
    await supabase.from("cache_leis").upsert({
      id: leiId, nome, texto_html: textoHtml, gerado_por: userId,
      atualizado_em: new Date().toISOString()
    }, { onConflict: "id" });
  } catch(e) { console.warn("saveCacheLei:", e.message); }
}

async function getCacheJuris(jurisId) {
  try {
    const { data } = await supabase
      .from("cache_juris")
      .select("resumo_ia, questao_ia")
      .eq("id", jurisId)
      .single();
    return data || null;
  } catch { return null; }
}

async function saveCacheJuris(item, resumoIa, questaoIa, userId) {
  try {
    await supabase.from("cache_juris").upsert({
      id: item.id, fonte: item.fonte, numero: item.numero,
      area: item.area, titulo: item.titulo, tese: item.tese,
      resumo_ia: resumoIa, questao_ia: questaoIa, gerado_por: userId
    }, { onConflict: "id" });
  } catch(e) { console.warn("saveCacheJuris:", e.message); }
}

async function getCacheQuestoes(disciplina, tema, limite=5) {
  try {
    const { data } = await supabase
      .from("cache_questoes")
      .select("*")
      .eq("disciplina", disciplina)
      .eq("tema", tema)
      .order("criado_em", { ascending: false })
      .limit(limite);
    return data || [];
  } catch { return []; }
}

async function saveCacheQuestao(questao, userId) {
  try {
    await supabase.from("cache_questoes").insert({
      ...questao, gerado_por: userId
    });
  } catch(e) { console.warn("saveCacheQuestao:", e.message); }
}

async function getCacheFlashcards(leiId) {
  try {
    const { data } = await supabase
      .from("cache_flashcards")
      .select("*")
      .eq("lei_id", leiId)
      .eq("aprovado", true)
      .order("criado_em", { ascending: false })
      .limit(20);
    return data || [];
  } catch { return []; }
}

async function saveCacheFlashcard(flashcard, userId) {
  try {
    await supabase.from("cache_flashcards").insert({
      ...flashcard, gerado_por: userId
    });
  } catch(e) { console.warn("saveCacheFlashcard:", e.message); }
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
  { id:"lc200", nome:"LC 200/23 — Gestão Fiscal Responsável", area:"Financeiro", emoji:"💼", prioridade:2, destaque:"Normas gerais de gestão fiscal — altera LRF, resultado fiscal, regra de ouro", url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm" },
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

const TEXTOS_EMBUTIDOS = {

"cf88_trib": `<h2>CONSTITUIÇÃO FEDERAL DE 1988 — TEXTO COMPLETO (Seleção Concurso Fiscal)</h2>
<p><em>Artigos essenciais para SEFAZ-BA 2026 — FGV</em></p>

<h2>TÍTULO I — DOS PRINCÍPIOS FUNDAMENTAIS</h2>
<p><strong>Art. 1º</strong> A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos: I — a soberania; II — a cidadania; III — a dignidade da pessoa humana; IV — os valores sociais do trabalho e da livre iniciativa; V — o pluralismo político.<br>Parágrafo único. Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos desta Constituição.</p>
<p><strong>Art. 3º</strong> Constituem objetivos fundamentais da República Federativa do Brasil: I — construir uma sociedade livre, justa e solidária; II — garantir o desenvolvimento nacional; III — erradicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais; IV — promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e quaisquer outras formas de discriminação.</p>

<h2>TÍTULO II — DOS DIREITOS E GARANTIAS FUNDAMENTAIS</h2>
<p><strong>Art. 5º</strong> Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:<br>
I — homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição;<br>
II — ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei;<br>
X — são invioláveis a intimidade, a vida privada, a honra e a imagem das pessoas, assegurado o direito a indenização pelo dano material ou moral decorrente de sua violação;<br>
XXII — é garantido o direito de propriedade;<br>
XXIII — a propriedade atenderá a sua função social;<br>
XXXIV — são a todos assegurados, independentemente do pagamento de taxas: a) o direito de petição aos Poderes Públicos em defesa de direitos ou contra ilegalidade ou abuso de poder; b) a obtenção de certidões em repartições públicas, para defesa de direitos e esclarecimento de situações de interesse pessoal;<br>
XXXV — a lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito;<br>
XXXVI — a lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada;<br>
XXXVII — não haverá juízo ou tribunal de exceção;<br>
XXXIX — não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal;<br>
XL — a lei penal não retroagirá, salvo para beneficiar o réu;<br>
XLVI — a lei regulará a individualização da pena;<br>
LIV — ninguém será privado da liberdade ou de seus bens sem o devido processo legal;<br>
LV — aos litigantes, em processo judicial ou administrativo, e aos acusados em geral são assegurados o contraditório e ampla defesa, com os meios e recursos a ela inerentes;<br>
LXIX — conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público;<br>
LXXI — conceder-se-á mandado de injunção sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania;<br>
LXXII — conceder-se-á habeas data: a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público; b) para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo;<br>
LXXIII — qualquer cidadão é parte legítima para propor ação popular que vise a anular ato lesivo ao patrimônio público ou de entidade de que o Estado participe, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural;<br>
LXXVIII — a todos, no âmbito judicial e administrativo, são assegurados a razoável duração do processo e os meios que garantam a celeridade de sua tramitação.</p>

<h2>TÍTULO III — DA ORGANIZAÇÃO DO ESTADO</h2>
<h2>Seção III — Da Administração Pública</h2>
<p><strong>Art. 37.</strong> A administração pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência e, também, ao seguinte:<br>
I — os cargos, empregos e funções públicas são acessíveis aos brasileiros que preencham os requisitos estabelecidos em lei, assim como aos estrangeiros, na forma da lei;<br>
II — a investidura em cargo ou emprego público depende de aprovação prévia em concurso público de provas ou de provas e títulos;<br>
III — o prazo de validade do concurso público será de até dois anos, prorrogável uma vez, por igual período;<br>
IV — durante o prazo improrrogável previsto no edital de convocação, aquele aprovado em concurso público de provas ou de provas e títulos será convocado com prioridade sobre novos concursados para assumir cargo ou emprego;<br>
VI — é garantido ao servidor público civil o direito à livre associação sindical;<br>
VII — o direito de greve será exercido nos termos e nos limites definidos em lei específica;<br>
IX — a lei estabelecerá os casos de contratação por tempo determinado para atender a necessidade temporária de excepcional interesse público;<br>
XI — a remuneração e o subsídio dos ocupantes de cargos, funções e empregos públicos da administração direta, autárquica e fundacional não poderão exceder o subsídio mensal, em espécie, dos Ministros do Supremo Tribunal Federal (teto remuneratório);<br>
XIII — é vedada a vinculação ou equiparação de quaisquer espécies remuneratórias para o efeito de remuneração de pessoal do serviço público;<br>
XIV — os acréscimos pecuniários percebidos por servidor público não serão computados nem acumulados para fins de concessão de acréscimos ulteriores;<br>
XVI — é vedada a acumulação remunerada de cargos públicos, exceto: a) dois cargos de professor; b) um cargo de professor com outro técnico ou científico; c) dois cargos privativos de profissionais de saúde;<br>
XIX — somente por lei específica poderá ser criada autarquia e autorizada a instituição de empresa pública, de sociedade de economia mista e de fundação;<br>
XXI — ressalvados os casos especificados na legislação, as obras, serviços, compras e alienações serão contratados mediante processo de licitação pública (Lei 14.133/21).<br>
§1º A publicidade dos atos, programas, obras, serviços e campanhas dos órgãos públicos deverá ter caráter educativo, informativo ou de orientação social, dela não podendo constar nomes, símbolos ou imagens que caracterizem promoção pessoal de autoridades ou servidores públicos.<br>
§2º A não observância do disposto nos incisos II e III implicará a nulidade do ato e a punição da autoridade responsável, nos termos da lei.<br>
§4º Os atos de improbidade administrativa importarão a suspensão dos direitos políticos, a perda da função pública, a indisponibilidade dos bens e o ressarcimento ao erário, na forma e gradação previstas em lei, sem prejuízo da ação penal cabível.<br>
§5º A lei estabelecerá os prazos de prescrição para ilícitos praticados por qualquer agente, servidor ou não, que causem prejuízos ao erário, ressalvadas as respectivas ações de ressarcimento.<br>
§6º As pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa.</p>

<p><strong>Art. 38.</strong> Ao servidor público da administração direta, autárquica e fundacional, no exercício de mandato eletivo, aplicam-se as seguintes disposições: I — tratando-se de mandato eletivo federal, estadual ou distrital, ficará afastado de seu cargo, emprego ou função; II — investido no mandato de Prefeito, será afastado do cargo, emprego ou função, sendo-lhe facultado optar pela sua remuneração; III — investido no mandato de Vereador, havendo compatibilidade de horários, perceberá as vantagens de seu cargo, emprego ou função.</p>

<p><strong>Art. 39.</strong> A União, os Estados, o Distrito Federal e os Municípios instituirão conselho de política de administração e remuneração de pessoal, integrado por servidores designados pelos respectivos Poderes.<br>
§3º Aplica-se aos servidores ocupantes de cargo público o disposto no art. 7º, IV, VII, VIII, IX, XII, XIII, XV, XVI, XVII, XVIII, XIX, XX, XXII e XXX, podendo a lei estabelecer requisitos diferenciados de admissão quando a natureza do cargo o exigir.</p>

<p><strong>Art. 40.</strong> O regime próprio de previdência social dos servidores titulares de cargos efetivos da União, dos Estados, do Distrito Federal e dos Municípios, inclui os de autarquias e fundações, é de caráter contributivo e solidário (RPPS).<br>
§1º O servidor abrangido por regime próprio de previdência social será aposentado: I — por incapacidade permanente para o trabalho, no cargo em que estiver investido, quando insuscetível de readaptação, hipótese em que será obrigatória a realização de avaliações periódicas para verificação da continuidade das condições que ensejaram a concessão da aposentadoria; II — compulsoriamente, com proventos proporcionais ao tempo de contribuição, aos 75 (setenta e cinco) anos de idade; III — voluntariamente, desde que cumprido tempo mínimo de 10 anos de efetivo exercício no serviço público e 5 anos no cargo efetivo em que se dará a aposentadoria, observadas as seguintes condições: a) 60 anos de idade e 25 anos de contribuição, se mulher; b) 65 anos de idade e 25 anos de contribuição, se homem.</p>

<h2>TÍTULO VI — DA TRIBUTAÇÃO E DO ORÇAMENTO</h2>
<h2>CAPÍTULO I — DO SISTEMA TRIBUTÁRIO NACIONAL</h2>
<h2>Seção I — Dos Princípios Gerais</h2>

<p><strong>Art. 145.</strong> A União, os Estados, o Distrito Federal e os Municípios poderão instituir os seguintes tributos:<br>
I — impostos;<br>
II — taxas, em razão do exercício do poder de polícia ou pela utilização, efetiva ou potencial, de serviços públicos específicos e divisíveis, prestados ao contribuinte ou postos a sua disposição;<br>
III — contribuição de melhoria, decorrente de obras públicas.<br>
§1º Sempre que possível, os impostos terão caráter pessoal e serão graduados segundo a capacidade econômica do contribuinte.<br>
§2º As taxas não poderão ter base de cálculo própria de impostos.</p>

<p><strong>Art. 146.</strong> Cabe à lei complementar:<br>
I — dispor sobre conflitos de competência em matéria tributária;<br>
II — regular as limitações constitucionais ao poder de tributar;<br>
III — estabelecer normas gerais em matéria de legislação tributária, especialmente sobre: a) definição de tributos e de suas espécies; b) obrigação, lançamento, crédito, prescrição e decadência tributários; c) adequado tratamento tributário ao ato cooperativo; d) definição de tratamento diferenciado e favorecido para ME e EPP (Simples Nacional).</p>

<p><strong>Art. 146-A.</strong> Lei complementar poderá estabelecer critérios especiais de tributação para prevenir desequilíbrios da concorrência.</p>

<p><strong>Art. 147.</strong> Competem à União, em Território Federal, os impostos estaduais e, se o Território não for dividido em Municípios, cumulativamente, os impostos municipais; ao Distrito Federal cabem os impostos municipais.</p>

<p><strong>Art. 148.</strong> A União, mediante lei complementar, poderá instituir empréstimos compulsórios:<br>
I — para atender a despesas extraordinárias, decorrentes de calamidade pública, de guerra externa ou sua iminência;<br>
II — no caso de investimento público de caráter urgente e de relevante interesse nacional.<br>
Parágrafo único. A aplicação dos recursos provenientes de empréstimo compulsório será vinculada à despesa que fundamentou sua instituição.</p>

<p><strong>Art. 149.</strong> Compete exclusivamente à União instituir contribuições sociais, de intervenção no domínio econômico e de interesse das categorias profissionais ou econômicas, como instrumento de sua atuação nas respectivas áreas, observado o disposto nos arts. 146, III, e 150, I e III, e sem prejuízo do previsto no art. 195, § 6º, relativamente às contribuições a que alude o dispositivo.<br>
§1º A União, os Estados, o Distrito Federal e os Municípios instituirão, por meio de lei, contribuições para custeio de regime próprio de previdência social, cobradas dos servidores ativos, dos aposentados e dos pensionistas.<br>
§2º As contribuições sociais e de intervenção no domínio econômico de que trata o caput deste artigo: I — não incidirão sobre as receitas decorrentes de exportação; II — incidirão também sobre a importação de produtos estrangeiros ou serviços.</p>

<p><strong>Art. 149-A.</strong> Os Municípios e o Distrito Federal poderão instituir contribuição, na forma das respectivas leis, para o custeio do serviço de iluminação pública (COSIP).</p>

<h2>Seção II — Das Limitações do Poder de Tributar</h2>

<p><strong>Art. 150.</strong> Sem prejuízo de outras garantias asseguradas ao contribuinte, é vedado à União, aos Estados, ao Distrito Federal e aos Municípios:<br>
I — exigir ou aumentar tributo sem lei que o estabeleça (legalidade);<br>
II — instituir tratamento desigual entre contribuintes que se encontrem em situação equivalente (isonomia);<br>
III — cobrar tributos: a) em relação a fatos geradores ocorridos antes do início da vigência da lei que os houver instituído ou aumentado (irretroatividade); b) no mesmo exercício financeiro em que haja sido publicada a lei que os instituiu ou aumentou (anterioridade anual); c) antes de decorridos noventa dias da data em que haja sido publicada a lei que os instituiu ou aumentou (noventena);<br>
IV — utilizar tributo com efeito de confisco;<br>
V — estabelecer limitações ao tráfego de pessoas ou bens por meio de tributos interestaduais ou intermunicipais, ressalvada a cobrança de pedágio pela utilização de vias conservadas pelo Poder Público;<br>
VI — instituir impostos sobre: a) patrimônio, renda ou serviços, uns dos outros (imunidade recíproca); b) templos de qualquer culto; c) patrimônio, renda ou serviços dos partidos políticos, suas fundações, entidades sindicais dos trabalhadores, instituições de educação e assistência social sem fins lucrativos (terceiro setor); d) livros, jornais, periódicos e o papel destinado a sua impressão; e) fonogramas e videofonogramas musicais produzidos no Brasil.<br>
§1º EXCEÇÕES à anterioridade anual (III,b): II, IE, IPI, IOF, IEG, EC (guerra/calamidade). EXCEÇÕES à noventena (III,c): II, IE, IR, IOF, IEG, EC (guerra/calamidade), BC do IPVA e BC do IPTU.<br>
§2º A imunidade recíproca é extensiva às autarquias e fundações públicas, vinculadas às suas finalidades essenciais.<br>
§3º As imunidades não se aplicam ao patrimônio, renda e serviços relacionados com exploração de atividades econômicas de entes públicos.<br>
§4º As imunidades dos templos e do terceiro setor compreendem somente o patrimônio, renda e serviços relacionados com as finalidades essenciais.<br>
§5º A lei determinará medidas para que os consumidores sejam esclarecidos acerca dos impostos que incidam sobre mercadorias e serviços (transparência fiscal).<br>
§6º Qualquer isenção, redução de base de cálculo, crédito presumido, anistia ou remissão só poderá ser concedido mediante lei específica.<br>
§7º A lei poderá atribuir a sujeito passivo de obrigação tributária a condição de responsável pelo pagamento de imposto cujo fato gerador deva ocorrer posteriormente — substituição tributária progressiva —, assegurada a imediata e preferencial restituição da quantia paga, caso não se realize o fato gerador presumido.</p>

<p><strong>Art. 151.</strong> É vedado à União:<br>
I — instituir tributo não uniforme em todo o território nacional (uniformidade geográfica);<br>
II — tributar renda das obrigações da dívida pública estadual/municipal em nível superior à da União;<br>
III — instituir isenções heterotópicas de tributos estaduais e municipais.</p>

<p><strong>Art. 152.</strong> É vedado aos Estados, ao Distrito Federal e aos Municípios estabelecer diferença tributária entre bens e serviços, em razão de sua procedência ou destino (não discriminação).</p>

<h2>Seção III — Dos Impostos da União</h2>

<p><strong>Art. 153.</strong> Compete à União instituir impostos sobre:<br>
I — importação de produtos estrangeiros (II) — extrafiscal, não sujeito à anterioridade;<br>
II — exportação, para o exterior, de produtos nacionais ou nacionalizados (IE) — extrafiscal;<br>
III — renda e proventos de qualquer natureza (IR) — sujeito à anterioridade anual, mas não à noventena;<br>
IV — produtos industrializados (IPI) — extrafiscal, seletivo, não cumulativo;<br>
V — operações de crédito, câmbio e seguro, ou relativas a títulos ou valores mobiliários (IOF) — extrafiscal;<br>
VI — propriedade territorial rural (ITR) — progressivo para desestimular improdutividade;<br>
VII — grandes fortunas, nos termos de lei complementar (IGF — não regulamentado).<br>
§1º É facultado ao Poder Executivo, atendidas as condições e os limites estabelecidos em lei, alterar as alíquotas dos impostos enumerados nos incisos I, II, IV e V (extrafiscalidade por decreto).<br>
§2º O IR informar-se-á pelos critérios da generalidade, da universalidade e da progressividade.<br>
§3º O IPI: I — será seletivo, em função da essencialidade do produto; II — será não cumulativo; III — não incidirá sobre produtos industrializados destinados ao exterior; IV — terá reduzido seu impacto sobre a aquisição de bens de capital pelo contribuinte.<br>
§4º O ITR será progressivo e terá suas alíquotas fixadas de forma a desestimular a manutenção de propriedades improdutivas e não incidirá sobre pequenas glebas rurais, definidas em lei.</p>

<p><strong>Art. 154.</strong> A União poderá instituir:<br>
I — por lei complementar, impostos residuais — não cumulativos, com FG e BC não previstos na Constituição;<br>
II — impostos extraordinários de guerra (IEG) — sem sujeição à anterioridade.</p>

<h2>Seção IV — Dos Impostos dos Estados e do Distrito Federal</h2>

<p><strong>Art. 155.</strong> Compete aos Estados e ao Distrito Federal instituir impostos sobre:<br>
I — transmissão causa mortis e doação, de quaisquer bens ou direitos (ITCMD/ITD);<br>
II — operações relativas à circulação de mercadorias e sobre prestações de serviços de transporte interestadual e intermunicipal e de comunicação, ainda que as operações e as prestações se iniciem no exterior (ICMS);<br>
III — propriedade de veículos automotores (IPVA).<br>
§1º O ITCMD:<br>
I — relativamente a bens imóveis, compete ao Estado da situação do bem;<br>
II — relativamente a bens móveis, títulos e créditos, compete ao Estado onde se processar o inventário ou arrolamento, ou tiver domicílio o doador;<br>
IV — terá suas alíquotas máximas fixadas pelo Senado Federal (máx. 8% — Res. 9/1992; STF admite progressividade — RE 562.045).<br>
§2º O ICMS atenderá ao seguinte:<br>
I — não cumulativo, compensando-se o que for devido em cada operação com o montante cobrado nas anteriores;<br>
II — a isenção ou não incidência: a) não implicará crédito para compensação com o montante devido nas operações seguintes; b) acarretará a anulação do crédito relativo às operações anteriores;<br>
III — poderá ser seletivo, em função da essencialidade das mercadorias e dos serviços;<br>
IV — resolução do Senado Federal estabelecerá as alíquotas aplicáveis às operações e prestações interestaduais (12% para Sul/Sudeste; 7% para demais) e de exportação;<br>
V — é facultado ao Senado Federal fixar alíquotas mínimas internas e máximas para resolver conflitos;<br>
VI — salvo deliberação em contrário dos Estados e do Distrito Federal (CONFAZ), as alíquotas internas serão superiores às interestaduais;<br>
VII — nas operações e prestações que destinem bens e serviços a consumidor final, contribuinte ou não do imposto, localizado em outro Estado: a) a alíquota interestadual quando o destinatário for contribuinte do imposto; b) a alíquota interna quando o destinatário não for contribuinte (DIFAL — EC 87/2015);<br>
VIII — a responsabilidade pelo recolhimento do imposto correspondente à diferença entre a alíquota interna e a interestadual caberá: a) ao destinatário, quando este for contribuinte do imposto; b) ao remetente, quando o destinatário não for contribuinte do imposto;<br>
IX — incidirá também: a) sobre a entrada de bem ou mercadoria importados do exterior por pessoa física ou jurídica, ainda que não seja contribuinte habitual do imposto; b) sobre o valor total da operação, quando mercadorias forem fornecidas com serviços não compreendidos na competência tributária dos Municípios;<br>
X — não incidirá: a) sobre operações que destinem mercadorias para o exterior; b) sobre operações que destinem a outros Estados petróleo e energia elétrica; c) sobre ouro, quando ativo financeiro; d) nas prestações de serviço de comunicação nas modalidades de radiodifusão sonora e de sons e imagens de recepção livre e gratuita;<br>
XI — não compreenderá, em sua base de cálculo, o montante do IPI, quando a operação for entre contribuintes e relativa a produto destinado à industrialização ou comercialização;<br>
XII — cabe à lei complementar: a) definir seus contribuintes; b) dispor sobre substituição tributária; c) disciplinar o regime de compensação; d) fixar, para efeito de sua cobrança e definição do estabelecimento responsável, o local das operações relativas à circulação de mercadorias e das prestações de serviços; e) excluir da incidência do imposto, nas exportações para o exterior, serviços e outros produtos; f) prever casos de manutenção de crédito, relativamente à remessa para outro Estado e exportação para o exterior, de serviços e de mercadorias; g) regular a forma como, mediante deliberação dos Estados e do DF, isenções, incentivos e benefícios fiscais serão concedidos e revogados (regra do CONFAZ — LC 24/75).<br>
§3º Nenhum outro imposto poderá incidir sobre operações relativas a energia elétrica, serviços de telecomunicações, derivados de petróleo, combustíveis e minerais do País, à exceção do ICMS, II e IE.<br>
§6º O IPVA: I — terá alíquotas mínimas fixadas pelo Senado Federal; II — poderá ter alíquotas diferenciadas em função do tipo e utilização; III — terá sua arrecadação repartida 50% ao Estado e 50% ao Município do licenciamento.</p>

<h2>Seção V — Dos Impostos dos Municípios</h2>

<p><strong>Art. 156.</strong> Compete aos Municípios instituir impostos sobre:<br>
I — propriedade predial e territorial urbana (IPTU) — pode ser progressivo em razão do valor do imóvel e ter alíquotas diferentes conforme localização e uso;<br>
II — transmissão inter vivos, a qualquer título, por ato oneroso, de bens imóveis (ITBI) — compete ao Município da situação do bem; NÃO incide sobre integralização de capital social (RE 796.376 — Tema 796);<br>
III — serviços de qualquer natureza, não compreendidos no art. 155, II, definidos em lei complementar (ISS — LC 116/03).<br>
§3º Em relação ao ISS, a lei complementar: I — fixará as suas alíquotas máximas e mínimas; II — excluirá da sua incidência exportações de serviços para o exterior; III — regulará a forma e as condições como isenções, incentivos e benefícios fiscais serão concedidos e revogados.</p>

<h2>Seção VI — Da Repartição das Receitas Tributárias</h2>

<p><strong>Art. 157.</strong> Pertencem aos Estados e ao Distrito Federal:<br>
I — o produto da arrecadação do IR incidente na fonte sobre rendimentos pagos pelos Estados e DF;<br>
II — 20% do produto da arrecadação do imposto residual (art. 154, I).</p>

<p><strong>Art. 158.</strong> Pertencem aos Municípios:<br>
I — o produto da arrecadação do IR na fonte sobre rendimentos pagos pelo Município;<br>
II — 50% do produto da arrecadação do ITR dos imóveis no Município, ou 100% se o Município fiscalizar e cobrar o ITR;<br>
III — 50% do produto da arrecadação do IPVA licenciado em seu território;<br>
IV — 25% do produto da arrecadação do ICMS (3/4 conforme critérios definidos em lei estadual; 1/4 de acordo com lei estadual).</p>

<p><strong>Art. 159.</strong> A União entregará:<br>
I — do produto da arrecadação do IR e do IPI, 49% assim distribuídos: a) 21,5% ao FPE — Fundo de Participação dos Estados; b) 22,5% ao FPM — Fundo de Participação dos Municípios; c) 3% para financiamento do setor produtivo do Norte, Nordeste e Centro-Oeste; d) 1% ao FPM no primeiro decêndio de dezembro; e) 1% ao FPM no primeiro decêndio de julho;<br>
II — do produto da arrecadação do IPI, 10% aos Estados e DF, proporcional às exportações de produtos industrializados;<br>
III — do produto da arrecadação da CIDE-Combustíveis, 29% aos Estados e DF.</p>

<p><strong>Art. 160.</strong> É vedada a retenção ou qualquer restrição à entrega e ao emprego dos recursos atribuídos aos Estados, ao Distrito Federal e aos Municípios. Parágrafo único. A vedação não impede a União e os Estados de condicionarem a entrega de recursos ao pagamento de seus créditos.</p>

<p><strong>Art. 161.</strong> Cabe à lei complementar: I — definir valor adicionado para fins do disposto no art. 158, IV, a; II — estabelecer normas sobre a entrega dos recursos de que trata o art. 159, especialmente sobre os critérios de rateio dos fundos previstos em seu inciso I; III — dispor sobre o acompanhamento, pelos beneficiários, do cálculo das quotas e da liberação das participações previstas nos arts. 157, 158 e 159. Parágrafo único. O Tribunal de Contas da União efetuará o cálculo das quotas referentes aos fundos de participação.</p>

<p><strong>Art. 162.</strong> A União, os Estados, o Distrito Federal e os Municípios divulgarão, até o último dia do mês subsequente ao da arrecadação, os montantes de cada um dos tributos arrecadados, os recursos recebidos, os valores de origem tributária entregues e a entregar e a expressão numérica dos critérios de rateio.</p>

<h2>CAPÍTULO II — DAS FINANÇAS PÚBLICAS</h2>

<p><strong>Art. 163.</strong> Lei complementar disporá sobre: I — finanças públicas; II — dívida pública externa e interna, incluída a das autarquias, fundações e demais entidades controladas pelo Poder Público; III — concessão de garantias pelas entidades públicas; IV — emissão e resgate de títulos da dívida pública; V — fiscalização financeira da administração pública direta e indireta; VI — operações de câmbio realizadas por órgãos e entidades da União, dos Estados, do Distrito Federal e dos Municípios; VII — compatibilização das funções das instituições oficiais de crédito da União, resguardadas as características e condições operacionais plenas das voltadas ao desenvolvimento regional.</p>

<p><strong>Art. 165.</strong> Leis de iniciativa do Poder Executivo estabelecerão: I — o plano plurianual (PPA — 4 anos); II — as diretrizes orçamentárias (LDO — anual, orienta LOA); III — os orçamentos anuais (LOA).<br>
§5º A lei orçamentária anual compreenderá: I — o orçamento fiscal; II — o orçamento de investimento das empresas estatais; III — o orçamento da seguridade social.<br>
§6º O projeto de lei orçamentária será acompanhado de demonstrativo regionalizado do efeito, sobre as receitas e despesas, decorrente de isenções, anistias, remissões, subsídios e benefícios de natureza financeira, tributária e creditícia.<br>
§8º A lei orçamentária anual não conterá dispositivo estranho à previsão da receita e à fixação da despesa (Princípio da Exclusividade).</p>

<p><strong>Art. 167.</strong> São vedados: I — o início de programas ou projetos não incluídos na lei orçamentária anual; II — a realização de despesas ou a assunção de obrigações diretas que excedam os créditos orçamentários ou adicionais; III — a realização de operações de créditos que excedam o montante das despesas de capital (regra de ouro); IV — a vinculação de receita de impostos a órgão, fundo ou despesa, ressalvados os casos previstos (saúde, educação, MDE).</p>

<h2>EMENDAS CONSTITUCIONAIS RELEVANTES</h2>

<p><strong>EC 87/2015 — DIFAL ICMS:</strong> Operações e prestações interestaduais a consumidor final não contribuinte: alíquota interestadual + DIFAL ao Estado destino. Partilha transitória 2015-2018; desde 2019, 100% ao Estado destino. Exige LC prévia (LC 190/2022 — STF: válida a partir de 2022).</p>

<p><strong>EC 132/2023 — Reforma Tributária:</strong><br>
— Extingue gradualmente ICMS (estados) e ISS (municípios) até 2032, criando IBS — Imposto sobre Bens e Serviços (competência compartilhada estados/municípios).<br>
— CBS — Contribuição sobre Bens e Serviços substitui PIS/COFINS (competência federal).<br>
— IS — Imposto Seletivo sobre bens e serviços prejudiciais à saúde ou ao meio ambiente.<br>
— Comitê Gestor do IBS — administração compartilhada.<br>
— Cashback para faixas de baixa renda — devolução parcial dos tributos.<br>
— Fundo de Desenvolvimento Regional (FNDR) — R$ 60 bi até 2043.<br>
— Transição: 2026-2032 para IBS/CBS. Extinção total ICMS/ISS em 01/01/2033.<br>
— Regulamentado pela LC 214/2025.</p>`,

"ba_lei7014": `<h2>LEI Nº 7.014, DE 4 DE DEZEMBRO DE 1996</h2>
<p>Dispõe sobre o Imposto sobre Operações Relativas à Circulação de Mercadorias e sobre Prestações de Serviços de Transporte Interestadual e Intermunicipal e de Comunicação — ICMS.</p>

<h2>TÍTULO I — DA INCIDÊNCIA</h2>

<p><strong>Art. 1º</strong> O Imposto sobre Operações Relativas à Circulação de Mercadorias e sobre Prestações de Serviços de Transporte Interestadual e Intermunicipal e de Comunicação — ICMS —, de competência do Estado da Bahia, tem como fato gerador as operações relativas à circulação de mercadorias e as prestações de serviços de transporte interestadual e intermunicipal e de comunicação, ainda que as operações e as prestações se iniciem no exterior.</p>

<p><strong>Art. 2º</strong> O ICMS incide sobre:<br>
I — operações relativas à circulação de mercadorias, inclusive o fornecimento de alimentação e bebidas em bares, restaurantes e estabelecimentos similares;<br>
II — prestações de serviços de transporte interestadual e intermunicipal, por qualquer via, de pessoas, bens, mercadorias ou valores;<br>
III — prestações onerosas de serviços de comunicação, por qualquer meio, inclusive a geração, a emissão, a recepção, a transmissão, a retransmissão, a repetição e a ampliação de comunicação de qualquer natureza;<br>
IV — fornecimento de mercadorias com prestação de serviços não compreendidos na competência tributária dos municípios;<br>
V — fornecimento de mercadorias com prestação de serviços sujeitos ao ISS, quando a lei complementar aplicável expressamente o sujeitar à incidência do ICMS;<br>
VI — a entrada de mercadoria ou bem importados do exterior, por pessoa física ou jurídica, ainda que não seja contribuinte habitual do imposto, qualquer que seja a sua finalidade;<br>
VII — o serviço prestado no exterior ou cuja prestação se tenha iniciado no exterior;<br>
VIII — a entrada, no território do Estado, de petróleo, inclusive lubrificantes e combustíveis líquidos e gasosos dele derivados, e de energia elétrica, quando não destinados à comercialização ou industrialização;<br>
IX — a entrada, neste Estado, decorrente de operação interestadual, de bens ou mercadorias destinadas ao uso, consumo ou ativo permanente do adquirente, contribuinte do imposto, bem como a utilização, por contribuinte, de serviço cuja prestação se tenha iniciado em outro Estado e não esteja vinculada a operação ou prestação subsequente.</p>

<p><strong>Art. 3º</strong> O ICMS não incide sobre:<br>
I — operações com livros, jornais, periódicos e o papel destinado a sua impressão;<br>
II — operações e prestações que destinem ao exterior mercadorias, inclusive produtos primários e produtos industrializados semielaborados, ou serviços;<br>
III — operações interestaduais relativas à energia elétrica e petróleo, inclusive lubrificantes e combustíveis líquidos e gasosos dele derivados, quando destinados à industrialização ou à comercialização;<br>
IV — operações com ouro, quando definido em lei como ativo financeiro ou instrumento cambial;<br>
V — operações relativas a mercadorias que tenham sido ou que se destinem a ser utilizadas na prestação, pelo próprio autor da saída, de serviço de qualquer natureza definido em lei complementar como sujeito ao ISS;<br>
VI — operações de qualquer natureza de que decorra a transferência de propriedade de estabelecimento industrial, comercial ou de outra espécie;<br>
VII — operações decorrentes de alienação fiduciária em garantia, inclusive a operação efetuada pelo credor em decorrência do inadimplemento do devedor;<br>
VIII — operações de arrendamento mercantil, não compreendida a venda do bem arrendado ao arrendatário;<br>
IX — operações de qualquer natureza de que decorra a transferência de bens móveis salvados de sinistro para companhias seguradoras.</p>

<h2>TÍTULO II — DA BASE DE CÁLCULO</h2>

<p><strong>Art. 13.</strong> A base de cálculo do ICMS é:<br>
I — na saída de mercadoria prevista no art. 2º, I, o valor da operação;<br>
II — na hipótese do art. 2º, IV, o valor da operação, compreendendo mercadoria e serviço;<br>
III — na prestação de serviço de transporte interestadual e intermunicipal e de comunicação, o preço do serviço;<br>
IV — no fornecimento de que trata o art. 2º, V, o preço corrente da mercadoria fornecida ou empregada;<br>
V — na hipótese do art. 2º, VI, a soma das seguintes parcelas: a) o valor da mercadoria ou bem constante dos documentos de importação; b) imposto de importação; c) imposto sobre produtos industrializados; d) imposto sobre operações de câmbio; e) quaisquer outros impostos, taxas, contribuições e despesas aduaneiras.</p>

<p><strong>Art. 17.</strong> As alíquotas do ICMS são:<br>
I — nas operações internas e de importação:<br>
a) 12% — para mercadorias e serviços em geral;<br>
b) 17% — para operações com energia elétrica, combustíveis, lubrificantes, cigarros e serviços de telecomunicação;<br>
c) 25% — para bebidas alcoólicas, armas, munições e fogos de artifício;<br>
d) 7% — para produtos da cesta básica;<br>
e) 28% — para operações com fumo.<br>
II — nas operações interestaduais com contribuintes: 12% (destinatário no Sul/Sudeste); 7% (demais regiões);<br>
III — nas prestações interestaduais de transporte: 12%.</p>

<h2>TÍTULO III — DA SUBSTITUIÇÃO TRIBUTÁRIA</h2>

<p><strong>Art. 354.</strong> Fica atribuída ao sujeito passivo por substituição tributária a responsabilidade pela retenção e recolhimento do ICMS incidente nas operações subsequentes, com as mercadorias e serviços relacionados nos Anexos 1 e 2 deste Regulamento.</p>

<p><strong>Art. 355.</strong> A base de cálculo para fins de substituição tributária é:<br>
I — nas operações de saída do substituto tributário: o valor da operação própria mais o valor da margem de valor agregado (MVA), que inclui os valores pertinentes a frete, seguro, impostos, contribuições e outros encargos;<br>
II — quando o preço final ao consumidor for fixado por órgão público: o preço assim fixado.</p>`,

"ba_dec7629": `<h2>DECRETO Nº 7.629, DE 9 DE JULHO DE 1999</h2>
<p>Aprova o Regulamento do Processo Administrativo Tributário — PAT, do Estado da Bahia.</p>

<h2>TÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 1º</strong> O processo administrativo tributário compreende os procedimentos destinados à determinação e exigência do crédito tributário, à consulta e às impugnações e recursos relativos a atos e decisões proferidos por autoridades administrativas estaduais em matéria tributária.</p>

<p><strong>Art. 2º</strong> A administração tributária é exercida pela Secretaria da Fazenda do Estado da Bahia, através de seus órgãos e agentes.</p>

<h2>TÍTULO II — DO AUTO DE INFRAÇÃO</h2>

<p><strong>Art. 42.</strong> O Auto de Infração é o instrumento pelo qual a autoridade fiscal competente formaliza a exigência do crédito tributário, identificando o sujeito passivo, descrevendo o fato, indicando a disposição legal infringida, apurando o montante do crédito tributário e aplicando a penalidade cabível.</p>

<p><strong>Art. 43.</strong> O Auto de Infração deverá conter:<br>
I — a qualificação do autuado;<br>
II — o local, a data e a hora da lavratura;<br>
III — a descrição clara e precisa do fato que constitui a infração;<br>
IV — a indicação da disposição legal infringida e da penalidade aplicável;<br>
V — o valor do tributo, da multa, dos juros e da atualização monetária, quando cabíveis;<br>
VI — a intimação para o pagamento ou impugnação no prazo de 30 (trinta) dias;</p>

<p><strong>Art. 44.</strong> A impugnação deverá ser apresentada no prazo de 30 (trinta) dias, contados da intimação, e suspenderá a exigibilidade do crédito tributário.</p>

<h2>TÍTULO III — DA IMPUGNAÇÃO</h2>

<p><strong>Art. 51.</strong> A impugnação tempestiva instaura a fase litigiosa do procedimento e suspende a exigibilidade do crédito tributário.</p>

<p><strong>Art. 52.</strong> A impugnação deve ser feita por escrito e indicar:<br>
I — a autoridade julgadora a que é dirigida;<br>
II — a qualificação do impugnante;<br>
III — os motivos de fato e de direito em que se fundamenta;<br>
IV — as diligências que o impugnante pretenda sejam efetuadas, expostos os motivos que as justifiquem;<br>
V — a prova documental que o impugnante desejar produzir.</p>

<h2>TÍTULO IV — DOS RECURSOS</h2>

<p><strong>Art. 79.</strong> Da decisão de primeira instância caberá recurso voluntário ao Conselho de Fazenda Estadual — CONSEF, no prazo de 30 (trinta) dias, contados da intimação da decisão.</p>

<p><strong>Art. 80.</strong> O recurso voluntário será interposto pelo sujeito passivo quando:<br>
I — a decisão de primeira instância lhe for total ou parcialmente contrária;<br>
II — a decisão de primeira instância lhe for favorável, e o representante fazendário interpuser recurso de ofício.</p>

<h2>TÍTULO V — DO CONSEF</h2>

<p><strong>Art. 96.</strong> O Conselho de Fazenda Estadual — CONSEF é o órgão de segunda instância administrativa para julgamento de processos tributários no Estado da Bahia, com composição paritária entre representantes da Fazenda Estadual e dos contribuintes.</p>

<p><strong>Art. 97.</strong> As decisões do CONSEF são definitivas na esfera administrativa e, quando contrárias à Fazenda, vinculam a administração tributária estadual.</p>`,

"ba_lei6348": `<h2>LEI Nº 6.348, DE 27 DE DEZEMBRO DE 1991</h2>
<p>Institui o Imposto sobre a Propriedade de Veículos Automotores — IPVA, e dá outras providências.</p>

<p><strong>Art. 1º</strong> O Imposto sobre a Propriedade de Veículos Automotores — IPVA — tem como fato gerador a propriedade de veículo automotor terrestre, aquático ou aéreo.</p>

<p><strong>Art. 2º</strong> Contribuinte do IPVA é o proprietário do veículo automotor.</p>

<p><strong>Art. 3º</strong> A base de cálculo do IPVA é o valor venal do veículo, assim considerado o preço de mercado divulgado em tabela aprovada pelo Secretário da Fazenda.</p>

<p><strong>Art. 4º</strong> As alíquotas do IPVA são:<br>
I — 1,0% — para veículos de carga;<br>
II — 1,5% — para motocicletas, motonetas e ciclomotores;<br>
III — 2,5% — para automóveis, camionetes e utilitários;<br>
IV — 3,5% — para embarcações e aeronaves de uso particular.</p>

<p><strong>Art. 5º</strong> O produto da arrecadação do IPVA, incluídos os acréscimos correspondentes, é destinado:<br>
I — 50% ao Estado da Bahia;<br>
II — 50% ao município onde o veículo for licenciado.</p>

<p><strong>Art. 6º</strong> São isentos do IPVA:<br>
I — os veículos de propriedade de entidades sem fins lucrativos;<br>
II — os veículos utilizados no transporte coletivo de passageiros;<br>
III — máquinas e implementos agrícolas;<br>
IV — veículos pertencentes a pessoas com deficiência física;<br>
V — veículos com mais de 20 (vinte) anos de fabricação.</p>`,

"ba_lei4826": `<h2>LEI Nº 4.826, DE 27 DE JANEIRO DE 1989</h2>
<p>Dispõe sobre o Imposto sobre Transmissão Causa Mortis e Doação de Quaisquer Bens ou Direitos — ITD.</p>

<p><strong>Art. 1º</strong> O Imposto sobre Transmissão Causa Mortis e Doação — ITD — incide sobre a transmissão de quaisquer bens ou direitos havidos:<br>
I — por sucessão legítima ou testamentária, inclusive a sucessão provisória;<br>
II — por doação.</p>

<p><strong>Art. 2º</strong> O ITD tem como fato gerador:<br>
I — a transmissão causa mortis de quaisquer bens ou direitos;<br>
II — a doação, a qualquer título, de quaisquer bens ou direitos.</p>

<p><strong>Art. 3º</strong> Contribuinte do ITD é:<br>
I — na transmissão causa mortis: o herdeiro ou legatário;<br>
II — na doação: o donatário.</p>

<p><strong>Art. 7º</strong> A base de cálculo do ITD é o valor venal dos bens ou direitos transmitidos ou doados.</p>

<p><strong>Art. 8º</strong> As alíquotas do ITD são progressivas conforme o valor da base de cálculo:<br>
I — até 85 UPF/BA: 3,5%;<br>
II — de 85 a 255 UPF/BA: 4%;<br>
III — de 255 a 425 UPF/BA: 6%;<br>
IV — acima de 425 UPF/BA: 8%.</p>

<p><strong>Art. 9º</strong> São isentos do ITD:<br>
I — a transmissão causa mortis de imóvel de pequeno valor que constitua o único bem do espólio;<br>
II — as transmissões de bens ao cônjuge ou companheiro e aos descendentes ou ascendentes em linha reta.</p>`,

"ba_lei3956": `<h2>LEI Nº 3.956, DE 11 DE DEZEMBRO DE 1981</h2>
<p>Código Tributário do Estado da Bahia — CTB.</p>

<h2>TÍTULO I — DAS DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 1º</strong> Esta Lei regula, com fundamento na Constituição Federal e no Código Tributário Nacional, as relações jurídicas de natureza tributária entre o Estado da Bahia e as pessoas sujeitas ao pagamento de tributos estaduais.</p>

<h2>TÍTULO II — DA OBRIGAÇÃO TRIBUTÁRIA</h2>

<p><strong>Art. 98.</strong> A obrigação tributária é principal ou acessória.<br>
§1º A obrigação principal surge com a ocorrência do fato gerador, tem por objeto o pagamento de tributo ou penalidade pecuniária e extingue-se juntamente com o crédito dela decorrente.<br>
§2º A obrigação acessória decorre da legislação tributária e tem por objeto as prestações positivas ou negativas nela previstas no interesse da arrecadação ou da fiscalização dos tributos.</p>

<h2>TÍTULO III — DO CRÉDITO TRIBUTÁRIO</h2>

<p><strong>Art. 120.</strong> O crédito tributário decorre da obrigação principal e tem a mesma natureza desta.</p>

<p><strong>Art. 121.</strong> As circunstâncias que modificam o crédito tributário, sua extensão ou seus efeitos, ou as garantias ou os privilégios a ele atribuídos, ou que excluem sua exigibilidade não afetam a obrigação tributária que lhe deu origem.</p>

<h2>TÍTULO IV — DAS INFRAÇÕES E PENALIDADES</h2>

<p><strong>Art. 163.</strong> Constitui infração toda ação ou omissão, voluntária ou involuntária, que importe em inobservância, por parte do sujeito passivo ou de terceiro, de norma estabelecida por esta Lei, pelo Regulamento ou pelos atos administrativos de caráter normativo.</p>

<p><strong>Art. 164.</strong> As infrações serão punidas com as seguintes penalidades:<br>
I — multa;<br>
II — sujeição a regime especial de fiscalização;<br>
III — suspensão ou cancelamento de benefícios fiscais;<br>
IV — cassação de regime especial para pagamento, apuração ou recolhimento do tributo.</p>`,

"ctn": `<h2>LEI Nº 5.172, DE 25 DE OUTUBRO DE 1966</h2>
<p>Dispõe sobre o Sistema Tributário Nacional e institui normas gerais de direito tributário aplicáveis à União, Estados e Municípios.</p>

<h2>LIVRO PRIMEIRO — SISTEMA TRIBUTÁRIO NACIONAL</h2>

<h2>TÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 1º</strong> Esta Lei regula, com fundamento na Emenda Constitucional n. 18, de 1º de dezembro de 1965, o sistema tributário nacional e estabelece, com fundamento no art. 5º, XV, b, da Constituição Federal, as normas gerais de direito tributário aplicáveis à União, aos Estados, ao Distrito Federal e aos Municípios.</p>

<h2>TÍTULO II — DAS LIMITAÇÕES DO PODER DE TRIBUTAR</h2>

<p><strong>Art. 9º</strong> É vedado à União, aos Estados, ao Distrito Federal e aos Municípios:<br>
I — instituir ou majorar tributos sem que a lei o estabeleça;<br>
II — cobrar imposto sobre o patrimônio e a renda com base em lei posterior à data inicial do exercício financeiro a que corresponda;<br>
III — estabelecer limitações ao tráfego, no território nacional, de pessoas ou mercadorias, por meio de tributos interestaduais ou intermunicipais.</p>

<h2>LIVRO SEGUNDO — NORMAS GERAIS DE DIREITO TRIBUTÁRIO</h2>

<h2>TÍTULO II — DA OBRIGAÇÃO TRIBUTÁRIA</h2>

<h2>CAPÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 113.</strong> A obrigação tributária é principal ou acessória.<br>
§1º A obrigação principal surge com a ocorrência do fato gerador, tem por objeto o pagamento de tributo ou penalidade pecuniária e extingue-se juntamente com o crédito dela decorrente.<br>
§2º A obrigação acessória decorre da legislação tributária e tem por objeto as prestações, positivas ou negativas, nela previstas no interesse da arrecadação ou da fiscalização dos tributos.<br>
§3º A obrigação acessória, pelo simples fato da sua inobservância, converte-se em obrigação principal relativamente à penalidade pecuniária.</p>

<p><strong>Art. 114.</strong> Fato gerador da obrigação principal é a situação definida em lei como necessária e suficiente à sua ocorrência.</p>

<p><strong>Art. 115.</strong> Fato gerador da obrigação acessória é qualquer situação que, na forma da legislação aplicável, impõe a prática ou a abstenção de ato que não configure obrigação principal.</p>

<p><strong>Art. 116.</strong> Salvo disposição de lei em contrário, considera-se ocorrido o fato gerador e existentes os seus efeitos:<br>
I — tratando-se de situação de fato, desde o momento em que o se verifiquem as circunstâncias materiais necessárias a que produza os efeitos que normalmente lhe são próprios;<br>
II — tratando-se de situação jurídica, desde o momento em que esteja definitivamente constituída, nos termos de direito aplicável.</p>

<p><strong>Art. 121.</strong> Sujeito passivo da obrigação principal é a pessoa obrigada ao pagamento de tributo ou penalidade pecuniária.<br>
Parágrafo único. O sujeito passivo da obrigação principal diz-se:<br>
I — contribuinte, quando tenha relação pessoal e direta com a situação que constitua o respectivo fato gerador;<br>
II — responsável, quando, sem revestir a condição de contribuinte, sua obrigação decorra de disposição expressa de lei.</p>

<h2>TÍTULO III — DO CRÉDITO TRIBUTÁRIO</h2>

<h2>CAPÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 139.</strong> O crédito tributário decorre da obrigação principal e tem a mesma natureza desta.</p>

<p><strong>Art. 140.</strong> As circunstâncias que modificam o crédito tributário, sua extensão ou seus efeitos, ou as garantias ou os privilégios a ele atribuídos, ou que excluem sua exigibilidade não afetam a obrigação tributária que lhe deu origem.</p>

<p><strong>Art. 141.</strong> O crédito tributário regularmente constituído somente se modifica ou extingue, ou tem sua exigibilidade suspensa ou excluída, nos casos previstos nesta Lei, fora dos quais não podem ser dispensadas, sob pena de responsabilidade funcional na forma da lei, a sua efetivação ou as respectivas garantias.</p>

<h2>CAPÍTULO II — CONSTITUIÇÃO DO CRÉDITO TRIBUTÁRIO</h2>

<h2>Seção I — Do Lançamento</h2>

<p><strong>Art. 142.</strong> Compete privativamente à autoridade administrativa constituir o crédito tributário pelo lançamento, assim entendido o procedimento administrativo tendente a verificar a ocorrência do fato gerador da obrigação correspondente, determinar a matéria tributável, calcular o montante do tributo devido, identificar o sujeito passivo e, sendo caso, propor a aplicação da penalidade cabível.</p>

<p><strong>Art. 150.</strong> O lançamento por homologação, que ocorre quanto aos tributos cuja legislação atribua ao sujeito passivo o dever de antecipar o pagamento sem prévio exame da autoridade administrativa, opera-se pelo ato em que a referida autoridade, tomando conhecimento da atividade assim exercida pelo obrigado, expressamente a homologa.<br>
§4º Se a lei não fixar prazo a homologação, será ele de cinco anos, a contar da ocorrência do fato gerador; expirado esse prazo sem que a Fazenda Pública se tenha pronunciado, considera-se homologado o lançamento e definitivamente extinto o crédito, salvo se comprovada a ocorrência de dolo, fraude ou simulação.</p>

<h2>CAPÍTULO III — SUSPENSÃO DO CRÉDITO TRIBUTÁRIO</h2>

<p><strong>Art. 151.</strong> Suspendem a exigibilidade do crédito tributário:<br>
I — moratória;<br>
II — o depósito do seu montante integral;<br>
III — as reclamações e os recursos, nos termos das leis reguladoras do processo tributário administrativo;<br>
IV — a concessão de medida liminar em mandado de segurança;<br>
V — a concessão de medida liminar ou de tutela antecipada, em outras espécies de ação judicial;<br>
VI — o parcelamento.</p>

<h2>CAPÍTULO IV — EXTINÇÃO DO CRÉDITO TRIBUTÁRIO</h2>

<p><strong>Art. 156.</strong> Extinguem o crédito tributário:<br>
I — o pagamento;<br>
II — a compensação;<br>
III — a transação;<br>
IV — remissão;<br>
V — a prescrição e a decadência;<br>
VI — a conversão de depósito em renda;<br>
VII — o pagamento antecipado e a homologação do lançamento nos termos do disposto no art. 150 e seus §§1º a 4º;<br>
VIII — a consignação em pagamento, nos termos do disposto no § 2º do art. 164;<br>
IX — a decisão administrativa irreformável, assim entendida a definitiva na órbita administrativa, que não mais possa ser objeto de ação anulatória;<br>
X — a decisão judicial passada em julgado;<br>
XI — a dação em pagamento em bens imóveis.</p>

<h2>CAPÍTULO V — EXCLUSÃO DO CRÉDITO TRIBUTÁRIO</h2>

<p><strong>Art. 175.</strong> Excluem o crédito tributário:<br>
I — a isenção;<br>
II — a anistia.<br>
Parágrafo único. A exclusão do crédito tributário não dispensa o cumprimento das obrigações acessórias dependentes da obrigação principal cujo crédito seja excluído, ou dela consequente.</p>

<p><strong>Art. 176.</strong> A isenção, ainda quando prevista em contrato, é sempre decorrente de lei que especifique as condições e requisitos exigidos para a sua concessão, os tributos a que se aplica e, sendo caso, o prazo de sua duração.</p>

<h2>CAPÍTULO VI — GARANTIAS E PRIVILÉGIOS DO CRÉDITO TRIBUTÁRIO</h2>

<p><strong>Art. 183.</strong> A enumeração das garantias atribuídas neste Capítulo ao crédito tributário não exclui outras que sejam expressamente previstas em lei, em função da natureza ou das características do tributo a que se refiram.</p>

<p><strong>Art. 186.</strong> O crédito tributário prefere a qualquer outro, seja qual for sua natureza ou o tempo de sua constituição, ressalvados os créditos decorrentes da legislação do trabalho ou do acidente de trabalho.<br>
Parágrafo único. Na falência:<br>
I — o crédito tributário não prefere aos créditos extraconcursais ou às importâncias passíveis de restituição, nos termos da lei falimentar, nem aos créditos com garantia real, no limite do valor do bem gravado;<br>
II — a lei poderá estabelecer limites e condições para a preferência dos créditos decorrentes da legislação do trabalho; e<br>
III — a multa tributária prefere apenas aos créditos subordinados.</p>

<h2>TÍTULO IV — ADMINISTRAÇÃO TRIBUTÁRIA</h2>

<p><strong>Art. 194.</strong> A legislação tributária, observado o disposto nesta Lei, regulará, em caráter geral, ou especificamente em função da natureza do tributo de que se tratar, a competência e os poderes das autoridades administrativas em matéria de fiscalização da sua aplicação.</p>

<p><strong>Art. 195.</strong> Para os efeitos da legislação tributária, não têm aplicação quaisquer disposições legais excludentes ou limitativas do direito de examinar mercadorias, livros, arquivos, documentos, papéis e efeitos comerciais ou fiscais dos comerciantes industriais ou produtores, ou da obrigação destes de exibi-los.</p>`,
"lei9784": `<h2>LEI Nº 9.784, DE 29 DE JANEIRO DE 1999</h2>
<p>Regula o processo administrativo no âmbito da Administração Pública Federal.</p>

<h2>CAPÍTULO I — DO ÂMBITO DE APLICAÇÃO</h2>

<p><strong>Art. 1º</strong> Esta Lei estabelece normas básicas sobre o processo administrativo no âmbito da Administração Federal direta e indireta, visando, em especial, à proteção dos direitos dos administrados e ao melhor cumprimento dos fins da Administração.<br>
§1º Os preceitos desta Lei também se aplicam aos órgãos dos Poderes Legislativo e Judiciário da União, quando no desempenho de função administrativa.<br>
§2º Para os fins desta Lei, consideram-se: I — órgão — a unidade de atuação integrante da estrutura da Administração direta e da estrutura da Administração indireta; II — entidade — a unidade de atuação dotada de personalidade jurídica; III — autoridade — o servidor ou agente público dotado de poder de decisão.</p>

<h2>CAPÍTULO II — DOS PRINCÍPIOS</h2>

<p><strong>Art. 2º</strong> A Administração Pública obedecerá, dentre outros, aos princípios da legalidade, finalidade, motivação, razoabilidade, proporcionalidade, moralidade, ampla defesa, contraditório, segurança jurídica, interesse público e eficiência.<br>
Parágrafo único. Nos processos administrativos serão observados, entre outros, os critérios de:<br>
I — atuação conforme a lei e o Direito;<br>
II — atendimento a fins de interesse geral, vedada a renúncia total ou parcial de poderes ou competências, salvo autorização em lei;<br>
III — objetividade no atendimento do interesse público, vedada a promoção pessoal de agentes ou autoridades;<br>
IV — atuação segundo padrões éticos de probidade, decoro e boa-fé;<br>
V — divulgação oficial dos atos administrativos, ressalvadas as hipóteses de sigilo previstas na Constituição;<br>
VI — adequação entre meios e fins, vedada a imposição de obrigações, restrições e sanções em medida superior àquelas estritamente necessárias ao atendimento do interesse público;<br>
VII — indicação dos pressupostos de fato e de direito que determinarem a decisão;<br>
VIII — observância das formalidades essenciais à garantia dos direitos dos administrados;<br>
IX — adoção de formas simples, suficientes para propiciar adequado grau de certeza, segurança e respeito aos direitos dos administrados;<br>
X — garantia dos direitos à comunicação, à apresentação de alegações finais, à produção de provas e à interposição de recursos, nos processos de que possam resultar sanções e nas situações de litígio;<br>
XI — proibição de cobrança de despesas processuais, salvo as previstas expressamente em lei;<br>
XII — impulsão, de ofício, do processo administrativo, sem prejuízo da atuação dos interessados;<br>
XIII — interpretação da norma administrativa da forma que melhor garanta o atendimento do fim público a que se dirige, vedada aplicação retroativa de nova interpretação.</p>

<h2>CAPÍTULO III — DOS DIREITOS DOS ADMINISTRADOS</h2>

<p><strong>Art. 3º</strong> O administrado tem os seguintes direitos perante a Administração, sem prejuízo de outros que lhe sejam assegurados:<br>
I — ser tratado com respeito pelas autoridades e servidores, que deverão facilitar o exercício de seus direitos e o cumprimento de suas obrigações;<br>
II — ter ciência da tramitação dos processos administrativos em que tenha a condição de interessado, ter vista dos autos, obter cópias de documentos neles contidos e conhecer as decisões proferidas;<br>
III — formular alegações e apresentar documentos antes da decisão, os quais serão objeto de consideração pelo órgão competente;<br>
IV — fazer-se assistir, facultativamente, por advogado, salvo quando obrigatória a representação, por força de lei.</p>

<h2>CAPÍTULO IV — DOS DEVERES DO ADMINISTRADO</h2>

<p><strong>Art. 4º</strong> São deveres do administrado perante a Administração, sem prejuízo de outros previstos em ato normativo:<br>
I — expor os fatos conforme a verdade;<br>
II — proceder com lealdade, urbanidade e boa-fé;<br>
III — não agir de modo temerário;<br>
IV — prestar as informações que lhe forem solicitadas e colaborar para o esclarecimento dos fatos.</p>

<h2>CAPÍTULO V — DA COMPETÊNCIA</h2>

<p><strong>Art. 11.</strong> A competência é irrenunciável e se exerce pelos órgãos administrativos a que foi atribuída como própria, salvo os casos de delegação e avocação legalmente admitidos.</p>

<p><strong>Art. 12.</strong> Um órgão administrativo e seu titular poderão, se não houver impedimento legal, delegar parte da sua competência a outros órgãos ou titulares, ainda que estes não lhe sejam hierarquicamente subordinados, quando for conveniente, em razão de circunstâncias de índole técnica, social, econômica, jurídica ou territorial.</p>

<p><strong>Art. 13.</strong> Não podem ser objeto de delegação:<br>
I — a edição de atos de caráter normativo;<br>
II — a decisão de recursos administrativos;<br>
III — as matérias de competência exclusiva do órgão ou autoridade.</p>

<p><strong>Art. 15.</strong> Será permitida, em caráter excepcional e por motivos relevantes devidamente justificados, a avocação temporária de competência atribuída a órgão hierarquicamente inferior.</p>

<h2>CAPÍTULO VI — DOS IMPEDIMENTOS E DA SUSPEIÇÃO</h2>

<p><strong>Art. 18.</strong> É impedido de atuar em processo administrativo o servidor ou autoridade que:<br>
I — tenha interesse direto ou indireto na matéria;<br>
II — tenha participado ou venha a participar como perito, testemunha ou representante, ou se tais situações ocorrem quanto ao cônjuge, companheiro ou parente e afins até o terceiro grau;<br>
III — esteja litigando judicial ou administrativamente com o interessado ou respectivo cônjuge ou companheiro.</p>

<h2>CAPÍTULO VII — DA FORMA, TEMPO E LUGAR DOS ATOS DO PROCESSO</h2>

<p><strong>Art. 22.</strong> Os atos do processo administrativo não dependem de forma determinada senão quando a lei expressamente a exigir.<br>
§1º Os atos do processo devem ser produzidos por escrito, em vernáculo, com a data e o local de sua realização e a assinatura da autoridade responsável.<br>
§2º Salvo imposição legal, o reconhecimento de firma somente será exigido quando houver dúvida de autenticidade.<br>
§3º A autenticação de documentos exigidos em cópia poderá ser feita pelo órgão administrativo.<br>
§4º O processo deverá ter suas páginas numeradas sequencialmente e rubricadas.</p>

<p><strong>Art. 23.</strong> Os atos do processo devem realizar-se em dias úteis, no horário normal de funcionamento da repartição na qual tramitar o processo.</p>

<p><strong>Art. 24.</strong> Inexistindo disposição específica, os atos do órgão ou autoridade responsável pelo processo e dos administrados que dele participem devem ser praticados no prazo de cinco dias, salvo motivo de força maior.</p>

<h2>CAPÍTULO VIII — DA INSTRUÇÃO</h2>

<p><strong>Art. 29.</strong> As atividades de instrução destinadas a averiguar e comprovar os dados necessários à tomada de decisão realizam-se de ofício ou mediante impulsão do órgão responsável pelo processo, sem prejuízo do direito dos interessados de propor atuações probatórias.</p>

<p><strong>Art. 30.</strong> São inadmissíveis no processo administrativo as provas obtidas por meios ilícitos.</p>

<p><strong>Art. 38.</strong> O interessado poderá, na fase instrutória e antes da tomada da decisão, juntar documentos e pareceres, requerer diligências e perícias, bem como aduzir alegações referentes à matéria objeto do processo.</p>

<h2>CAPÍTULO X — DO DEVER DE DECIDIR</h2>

<p><strong>Art. 48.</strong> A Administração tem o dever de explicitamente emitir decisão nos processos administrativos e sobre solicitações ou reclamações, em matéria de sua competência.</p>

<p><strong>Art. 49.</strong> Concluída a instrução de processo administrativo, a Administração tem o prazo de até trinta dias para decidir, salvo prorrogação por igual período expressamente motivada.</p>

<h2>CAPÍTULO XI — DA MOTIVAÇÃO</h2>

<p><strong>Art. 50.</strong> Os atos administrativos deverão ser motivados, com indicação dos fatos e dos fundamentos jurídicos, quando:<br>
I — neguem, limitem ou afetem direitos ou interesses;<br>
II — imponham ou agravem deveres, encargos ou sanções;<br>
III — decidam processos administrativos de concurso ou seleção pública;<br>
IV — dispensem ou declarem a inexigibilidade de processo licitatório;<br>
V — decidam recursos administrativos;<br>
VI — decorram de reexame de ofício;<br>
VII — deixem de aplicar jurisprudência firmada sobre a questão ou discrepem de pareceres, laudos, propostas e relatórios oficiais;<br>
VIII — importem anulação, revogação, suspensão ou convalidação de ato administrativo.</p>

<h2>CAPÍTULO XII — DA DESISTÊNCIA E OUTROS CASOS DE EXTINÇÃO DO PROCESSO</h2>

<p><strong>Art. 51.</strong> O interessado poderá, mediante manifestação escrita, desistir total ou parcialmente do pedido formulado ou, ainda, renunciar a direitos disponíveis.<br>
§1º Havendo vários interessados, a desistência ou renúncia atinge somente quem a formulou.<br>
§2º A desistência ou renúncia do interessado, conforme o caso, não prejudica o prosseguimento do processo, se a Administração considerar que o interesse público assim o exige.</p>

<h2>CAPÍTULO XIII — DA ANULAÇÃO, REVOGAÇÃO E CONVALIDAÇÃO</h2>

<p><strong>Art. 53.</strong> A Administração deve anular seus próprios atos, quando eivados de vício de legalidade, e pode revogá-los por motivo de conveniência ou oportunidade, respeitados os direitos adquiridos.</p>

<p><strong>Art. 54.</strong> O direito da Administração de anular os atos administrativos de que decorram efeitos favoráveis para os destinatários decai em cinco anos, contados da data em que foram praticados, salvo comprovada má-fé.<br>
§1º No caso de efeitos patrimoniais contínuos, o prazo de decadência contar-se-á da percepção do primeiro pagamento.<br>
§2º Considera-se exercício do direito de anular qualquer medida de autoridade administrativa que importe impugnação à validade do ato.</p>

<p><strong>Art. 55.</strong> Em decisão na qual se evidencie não acarretarem lesão ao interesse público nem prejuízo a terceiros, os atos que apresentarem defeitos sanáveis poderão ser convalidados pela própria Administração.</p>

<h2>CAPÍTULO XIV — DO RECURSO ADMINISTRATIVO E DA REVISÃO</h2>

<p><strong>Art. 56.</strong> Das decisões administrativas cabe recurso, em face de razões de legalidade e de mérito.<br>
§1º O recurso será dirigido à autoridade que proferiu a decisão, a qual, se não a reconsiderar no prazo de cinco dias, o encaminhará à autoridade superior.<br>
§2º Salvo exigência legal, a interposição de recurso administrativo independe de caução.</p>

<p><strong>Art. 57.</strong> O recurso administrativo tramitará no máximo por três instâncias administrativas, salvo disposição legal diversa.</p>

<p><strong>Art. 58.</strong> Têm legitimidade para interpor recurso administrativo:<br>
I — os titulares de direitos e interesses que forem parte no processo;<br>
II — aqueles cujos direitos ou interesses forem indiretamente afetados pela decisão recorrida;<br>
III — as organizações e associações representativas, no tocante a direitos e interesses coletivos;<br>
IV — os cidadãos ou associações, quanto a direitos ou interesses difusos.</p>

<p><strong>Art. 59.</strong> Salvo disposição legal específica, é de dez dias o prazo para interposição de recurso administrativo, contado a partir da ciência ou divulgação oficial da decisão recorrida.</p>

<p><strong>Art. 61.</strong> Salvo disposição legal em contrário, o recurso não tem efeito suspensivo.<br>
Parágrafo único. Havendo justo receio de prejuízo de difícil ou incerta reparação decorrente da execução, a autoridade recorrida ou a imediatamente superior poderá, de ofício ou a pedido, dar efeito suspensivo ao recurso.</p>

<p><strong>Art. 62.</strong> Interposto o recurso, o órgão competente para dele conhecer deverá intimar os demais interessados para que, no prazo de cinco dias úteis, apresentem alegações.</p>

<p><strong>Art. 64.</strong> O órgão competente para decidir o recurso poderá confirmar, modificar, anular ou revogar, total ou parcialmente, a decisão recorrida, se a matéria for de sua competência.<br>
Parágrafo único. Se da aplicação do disposto neste artigo puder decorrer gravame à situação do recorrente, este deverá ser cientificado para que formule suas alegações antes da decisão (reformatio in pejus — vedada sem contraditório).</p>

<p><strong>Art. 65.</strong> Os processos administrativos de que resultem sanções poderão ser revistos, a qualquer tempo, a pedido ou de ofício, quando surgirem fatos novos ou circunstâncias relevantes suscetíveis de justificar a inadequação da sanção aplicada.<br>
Parágrafo único. Da revisão do processo não poderá resultar agravamento da sanção.</p>

<h2>CAPÍTULO XV — DOS PRAZOS</h2>

<p><strong>Art. 66.</strong> Os prazos começam a correr a partir da data da cientificação oficial, excluindo-se da contagem o dia do começo e incluindo-se o do vencimento.<br>
§1º Considera-se prorrogado o prazo até o primeiro dia útil seguinte se o vencimento cair em dia em que não houver expediente ou este for encerrado antes da hora normal.<br>
§2º Os prazos expressos em dias contam-se de modo contínuo.<br>
§3º Os prazos fixados em meses ou anos contam-se de data a data. Se no mês do vencimento não houver o dia equivalente àquele do início do prazo, tem-se como termo o último dia do mês.</p>

<p><strong>Art. 67.</strong> Salvo motivo de força maior devidamente comprovado, os prazos processuais não se suspendem.</p>

<p><strong>Art. 69.</strong> Os processos administrativos específicos continuarão a reger-se por lei própria, aplicando-se-lhes apenas subsidiariamente os preceitos desta Lei.</p>`,
"lc123": `<h2>LEI COMPLEMENTAR Nº 123, DE 14 DE DEZEMBRO DE 2006</h2>
<p>Institui o Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte; dispõe sobre o Simples Nacional.</p>

<h2>CAPÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 1º</strong> Esta Lei Complementar estabelece normas gerais relativas ao tratamento diferenciado e favorecido a ser dispensado às microempresas e empresas de pequeno porte no âmbito dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios, especialmente no que se refere: I — à apuração e recolhimento dos impostos e contribuições da União, dos Estados, do Distrito Federal e dos Municípios, mediante regime único de arrecadação, inclusive obrigações acessórias (Simples Nacional); II — ao cumprimento de obrigações trabalhistas e previdenciárias; III — ao acesso a crédito e ao mercado.</p>

<p><strong>Art. 3º</strong> Para os efeitos desta Lei Complementar, consideram-se microempresas ou empresas de pequeno porte, a sociedade empresária, a sociedade simples, a empresa individual de responsabilidade limitada e o empresário, devidamente registrados no Registro de Empresas Mercantis ou no Registro Civil de Pessoas Jurídicas, conforme o caso, desde que:<br>
I — no caso da microempresa, aufira, em cada ano-calendário, receita bruta igual ou inferior a R$ 360.000,00;<br>
II — no caso da empresa de pequeno porte, aufira, em cada ano-calendário, receita bruta superior a R$ 360.000,00 e igual ou inferior a R$ 4.800.000,00.</p>

<p><strong>Art. 4º</strong> Na elaboração de normas de sua competência, os órgãos e entidades envolvidos na abertura e fechamento de empresas, dos 3 (três) poderes, em todas as esferas de governo, deverão considerar a criação de procedimentos simplificados, atendidas as peculiaridades locais.</p>

<h2>CAPÍTULO IV — DO SIMPLES NACIONAL</h2>
<h2>Seção I — Da Instituição e Abrangência</h2>

<p><strong>Art. 12.</strong> Fica instituído o Regime Especial Unificado de Arrecadação de Tributos e Contribuições devidos pelas Microempresas e Empresas de Pequeno Porte — Simples Nacional.</p>

<p><strong>Art. 13.</strong> O Simples Nacional implica o recolhimento mensal, mediante documento único de arrecadação, dos seguintes impostos e contribuições:<br>
I — Imposto sobre a Renda da Pessoa Jurídica — IRPJ;<br>
II — Imposto sobre Produtos Industrializados — IPI;<br>
III — Contribuição Social sobre o Lucro Líquido — CSLL;<br>
IV — Contribuição para o Financiamento da Seguridade Social — COFINS;<br>
V — Contribuição para o PIS/Pasep;<br>
VI — Contribuição Patronal Previdenciária — CPP;<br>
VII — Imposto sobre Operações Relativas à Circulação de Mercadorias e Sobre Prestações de Serviços de Transporte Interestadual e Intermunicipal e de Comunicação — ICMS;<br>
VIII — Imposto sobre Serviços de Qualquer Natureza — ISS.<br>
§1º O recolhimento na forma deste artigo não exclui a incidência dos seguintes impostos ou contribuições: I — IOF; II — II; III — IE; IV — ITR; V — IR sobre ganhos de capital; VI — ITCMD; VII — IPVA; VIII — IPTU; IX — ITBI; X — ISS ou ICMS (quando a ME/EPP for substituta tributária).</p>

<p><strong>Art. 14.</strong> Consideram-se isentos do IR, na fonte e na declaração de ajuste do beneficiário, os valores efetivamente pagos ou distribuídos ao titular ou sócio da microempresa ou empresa de pequeno porte optante pelo Simples Nacional, salvo os que corresponderem a pró-labore, aluguéis ou serviços prestados.</p>

<h2>Seção II — Das Vedações ao Ingresso no Simples Nacional</h2>

<p><strong>Art. 17.</strong> Não poderão recolher os impostos e contribuições na forma do Simples Nacional a microempresa ou a empresa de pequeno porte:<br>
I — que explore atividade de prestação cumulativa e contínua de serviços de assessoria creditícia, gestão de crédito, seleção e riscos, administração de contas a pagar e a receber, gerenciamento de ativos (factoring);<br>
II — que tenha sócio domiciliado no exterior;<br>
III — de cujo capital participe entidade da administração pública, direta ou indireta, federal, estadual ou municipal;<br>
V — que possua débito com o INSS, ou com as Fazendas Públicas Federal, Estadual ou Municipal, cuja exigibilidade não esteja suspensa;<br>
VI — que preste serviço de transporte intermunicipal e interestadual de passageiros, exceto quando na modalidade fluvial ou quando possuir características de transporte urbano ou metropolitano;<br>
XII — que realize cessão ou locação de mão-de-obra;<br>
XIII — que se dedique ao loteamento e à incorporação de imóveis.</p>

<h2>Seção IV — Da Apuração e Recolhimento dos Tributos</h2>

<p><strong>Art. 18.</strong> O valor devido mensalmente pela microempresa ou empresa de pequeno porte optante pelo Simples Nacional será determinado mediante aplicação das alíquotas efetivas, calculadas a partir das alíquotas nominais constantes das tabelas dos Anexos I a V desta Lei Complementar, sobre a base de cálculo de que trata o § 3º deste artigo, observado o disposto no § 15 do art. 3º.<br>
§3º Sobre a receita bruta auferida no mês incidirá a alíquota efetiva determinada na forma do caput e do § 1º deste artigo, podendo tal incidência se dar, à opção do contribuinte, na forma regulamentada pelo Comitê Gestor, sobre a receita recebida no mês.</p>

<p><strong>Art. 18-A.</strong> O Microempreendedor Individual — MEI que optar pelo recolhimento dos impostos e contribuições abrangidos pelo Simples Nacional em valores fixos mensais, independentemente da receita bruta por ele auferida no mês, na forma prevista neste artigo, não estará sujeito à falta de pagamento das referidas contribuições por insuficiência de recolhimentos.<br>
§1º Para os efeitos desta Lei Complementar, considera-se MEI o empresário individual que se enquadre na definição do art. 966 da Lei nº 10.406, de 10 de janeiro de 2002 — Código Civil, ou o empreendedor que exerça as atividades de industrialização, comercialização e prestação de serviços no âmbito rural, que tenha auferido receita bruta, no ano-calendário anterior, de até R$ 81.000,00.</p>

<h2>Seção VI — Das Obrigações Fiscais Acessórias</h2>

<p><strong>Art. 25.</strong> A microempresa ou empresa de pequeno porte optante pelo Simples Nacional deverá apresentar anualmente à Secretaria da Receita Federal do Brasil declaração única e simplificada de informações socioeconômicas e fiscais.</p>

<h2>Seção VIII — Da Exclusão do Simples Nacional</h2>

<p><strong>Art. 28.</strong> A exclusão do Simples Nacional será feita de ofício ou mediante comunicação da empresa.<br>
Parágrafo único. As regras de exclusão e os respectivos efeitos são estabelecidos pelo Comitê Gestor.</p>

<p><strong>Art. 29.</strong> A exclusão de ofício das empresas optantes pelo Simples Nacional dar-se-á quando:<br>
I — verificada a falta de comunicação de exclusão obrigatória;<br>
II — for oferecido embaraço à fiscalização;<br>
III — for oferecida resistência à fiscalização;<br>
IV — a sua constituição ocorrer por interpostas pessoas;<br>
V — tiver sido constatada prática reiterada de infração ao disposto nesta Lei Complementar;<br>
VI — a empresa for declarada inapta, nos termos dos arts. 81 e 82 da Lei nº 9.430, de 27 de dezembro de 1996;<br>
VII — comercializar mercadorias objeto de contrabando ou descaminho;<br>
VIII — houver falta de escrituração do livro-caixa ou não permitir a identificação da movimentação financeira.<br>
§1º Nas hipóteses previstas nos incisos II a VIII do caput deste artigo, a exclusão produzirá efeitos a partir do próprio mês em que incorridas, impedindo a opção pelo Simples Nacional pelos 3 (três) anos-calendário subsequentes.<br>
§2º Na hipótese do inciso V do caput deste artigo, o prazo de impedimento é de 10 (dez) anos-calendário.</p>

<h2>Seção XII — Do Acesso aos Mercados</h2>

<p><strong>Art. 47.</strong> Nas licitações públicas, a comprovação de regularidade fiscal e trabalhista das microempresas e empresas de pequeno porte somente será exigida para efeito de assinatura do contrato.</p>

<p><strong>Art. 48.</strong> Para o cumprimento do disposto no art. 47 desta Lei Complementar, o edital deverá conter item específico com as regras de participação de microempresa e empresa de pequeno porte, nos termos desta Lei Complementar, sob pena de nulidade.</p>

<h2>CAPÍTULO X — DO MICROEMPREENDEDOR INDIVIDUAL</h2>

<p><strong>Art. 68.</strong> Considera-se pequeno empresário, para efeito de aplicação do disposto nos arts. 970 e 1.179 da Lei nº 10.406, de 10 de janeiro de 2002, o empresário individual caracterizado como microempresa na forma desta Lei Complementar que aufira receita bruta anual até o limite previsto no § 1º do art. 18-A.</p>`,
"lc200": `<h2>NOTA: LC 200/2023 — NORMAS FINANCEIRAS PÚBLICAS</h2>
<p><em>A LC 200/2023 trata de normas gerais de gestão fiscal responsável. Verifique se a lei desejada é a LC 200/2023 (gestão fiscal) ou outro número.</em></p>

<h2>LEI COMPLEMENTAR Nº 200, DE 30 DE AGOSTO DE 2023</h2>
<p>Institui, com fundamento no art. 163, inciso I, da Constituição Federal, normas gerais para gestão fiscal responsável; altera as Leis Complementares nºs 101, de 4 de maio de 2000 (Lei de Responsabilidade Fiscal), e 156, de 28 de dezembro de 2016.</p>

<h2>CAPÍTULO I — DISPOSIÇÕES GERAIS</h2>

<p><strong>Art. 1º</strong> Esta Lei Complementar institui, com fundamento no inciso I do art. 163 da Constituição Federal, normas gerais para gestão fiscal responsável, observadas as disposições da Lei Complementar nº 101, de 4 de maio de 2000 (Lei de Responsabilidade Fiscal).</p>

<p><strong>Art. 2º</strong> Para os efeitos desta Lei Complementar, entende-se por:<br>
I — resultado fiscal: a diferença entre receitas e despesas primárias dentro de um exercício financeiro;<br>
II — meta de resultado fiscal: o valor estabelecido na lei de diretrizes orçamentárias para o resultado fiscal do exercício;<br>
III — regra de ouro: vedação de realização de operações de crédito que excedam as despesas de capital, nos termos do art. 167, III, da Constituição Federal.</p>

<h2>CAPÍTULO II — DO RESULTADO FISCAL</h2>

<p><strong>Art. 3º</strong> Os entes da Federação ficam obrigados a instituir e manter sistema de controle do resultado fiscal, de forma a garantir o cumprimento das metas estabelecidas nas respectivas leis de diretrizes orçamentárias.</p>

<p><strong>Art. 4º</strong> O descumprimento das metas de resultado fiscal sujeitará o ente da Federação às seguintes sanções:<br>
I — vedação de receber transferências voluntárias da União;<br>
II — vedação de contratar operações de crédito com instituições financeiras controladas pela União;<br>
III — vedação de obter garantias da União.</p>

<h2>ALTERAÇÕES NA LRF (LC 101/2000)</h2>

<p><strong>Art. 5º</strong> (Altera a LRF — LC 101/00):<br>
— Amplia o conceito de despesa primária;<br>
— Estabelece novas regras para limitação de empenho;<br>
— Determina critérios para avaliação de sustentabilidade fiscal;<br>
— Define mecanismo de correção de desvios fiscais com prazo de ajuste de até 24 meses.</p>

<p><strong>Art. 6º</strong> A União, os Estados, o Distrito Federal e os Municípios publicarão, até 30 de setembro de cada ano, relatório de avaliação do cumprimento das metas de resultado fiscal do exercício em curso, com projeções para os 2 (dois) exercícios subsequentes.</p>

<h2>PONTOS RELEVANTES PARA CONCURSO</h2>

<p><strong>Relação com a LRF (LC 101/00):</strong> A LC 200/2023 complementa a LRF, não a substitui. Traz conceitos mais precisos sobre resultado fiscal e mecanismos de enforcement mais claros.<br>
<strong>Transparência:</strong> Amplia obrigações de publicação de informações fiscais.<br>
<strong>Regra de ouro:</strong> Reforça a vedação do art. 167, III da CF (operações de crédito não podem exceder despesas de capital).<br>
<strong>Sanções:</strong> Sistematiza as consequências do descumprimento fiscal — vedação de transferências voluntárias, operações de crédito e garantias da União.</p>

<hr>
<p><em>⚠️ Atenção: Se você buscava a LC 200/2023 referente à Reforma Tributária — a norma correta é a LC 214/2025 (IBS/CBS/IS). Se buscava a LC 87/96 (Lei Kandir — ICMS), ela está cadastrada separadamente no acervo. Verifique qual LC 200 é objeto do seu edital.</em></p>`,
"lkandir": `<h2>LEI COMPLEMENTAR Nº 87, DE 13 DE SETEMBRO DE 1996 — LEI KANDIR</h2>
<p>Dispõe sobre o imposto dos Estados e do Distrito Federal sobre operações relativas à circulação de mercadorias e sobre prestações de serviços de transporte interestadual e intermunicipal e de comunicação, e dá outras providências.</p>

<h2>CAPÍTULO I — DA INCIDÊNCIA</h2>

<p><strong>Art. 1º</strong> Compete aos Estados e ao Distrito Federal instituir o imposto sobre operações relativas à circulação de mercadorias e sobre prestações de serviços de transporte interestadual e intermunicipal e de comunicação, ainda que as operações e as prestações se iniciem no exterior.</p>

<p><strong>Art. 2º</strong> O imposto incide sobre:<br>
I — operações relativas à circulação de mercadorias, inclusive o fornecimento de alimentação e bebidas em bares, restaurantes e estabelecimentos similares;<br>
II — prestações de serviços de transporte interestadual e intermunicipal, por qualquer via, de pessoas, bens, mercadorias ou valores;<br>
III — prestações onerosas de serviços de comunicação, por qualquer meio, inclusive a geração, a emissão, a recepção, a transmissão, a retransmissão, a repetição e a ampliação de comunicação de qualquer natureza;<br>
IV — fornecimento de mercadorias com prestação de serviços não compreendidos na competência tributária dos Municípios;<br>
V — fornecimento de mercadorias com prestação de serviços sujeitos ao imposto sobre serviços, de competência dos Municípios, quando a lei complementar aplicável expressamente o sujeitar à incidência do imposto estadual.<br>
§1º O imposto incide também:<br>
I — sobre a entrada de mercadoria ou bem importados do exterior, por pessoa física ou jurídica, ainda que não seja contribuinte habitual do imposto, qualquer que seja a sua finalidade;<br>
II — sobre o serviço prestado no exterior ou cuja prestação se tenha iniciado no exterior;<br>
III — sobre a entrada, no território do Estado destinatário, de petróleo, inclusive lubrificantes e combustíveis líquidos e gasosos dele derivados, e de energia elétrica, quando não destinados à comercialização ou à industrialização, decorrentes de operações interestaduais, cabendo o imposto ao Estado onde estiver localizado o adquirente.<br>
§2º A caracterização do fato gerador independe da natureza jurídica da operação que o constitua.</p>

<p><strong>Art. 3º</strong> O imposto não incide sobre:<br>
I — operações com livros, jornais, periódicos e o papel destinado a sua impressão;<br>
II — operações e prestações que destinem ao exterior mercadorias, inclusive produtos primários e produtos industrializados semielaborados, ou serviços;<br>
III — operações interestaduais relativas a energia elétrica e petróleo, inclusive lubrificantes e combustíveis líquidos e gasosos dele derivados, quando destinados à industrialização ou à comercialização;<br>
IV — operações com ouro, quando definido em lei como ativo financeiro ou instrumento cambial;<br>
V — operações relativas a mercadorias que tenham sido ou que se destinem a ser utilizadas na prestação, pelo próprio autor da saída, de serviço de qualquer natureza definido em lei complementar como sujeito ao ISS;<br>
VI — operações de qualquer natureza de que decorra a transferência de propriedade de estabelecimento industrial, comercial ou de outra espécie;<br>
VII — operações decorrentes de alienação fiduciária em garantia, inclusive a operação efetuada pelo credor em decorrência do inadimplemento do devedor;<br>
VIII — operações de arrendamento mercantil, não compreendida a venda do bem arrendado ao arrendatário;<br>
IX — operações de qualquer natureza de que decorra a transferência de bens móveis salvados de sinistro para companhias seguradoras.</p>

<p><strong>Art. 4º</strong> Contribuinte é qualquer pessoa, física ou jurídica, que realize, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria ou prestações de serviços de transporte interestadual e intermunicipal e de comunicação, ainda que as operações e as prestações se iniciem no exterior.<br>
Parágrafo único. É também contribuinte a pessoa física ou jurídica que, mesmo sem habitualidade ou intuito comercial: I — importe mercadorias ou bens do exterior, qualquer que seja a sua finalidade; II — seja destinatária de serviço prestado no exterior ou cuja prestação se tenha iniciado no exterior; III — adquira em licitação mercadorias ou bens apreendidos ou abandonados; IV — adquira lubrificantes e combustíveis líquidos e gasosos derivados de petróleo e energia elétrica oriundos de outro Estado, quando não destinados à comercialização ou à industrialização.</p>

<h2>CAPÍTULO II — DA NÃO-CUMULATIVIDADE</h2>

<p><strong>Art. 19.</strong> O imposto é não-cumulativo, compensando-se o que for devido em cada operação relativa à circulação de mercadorias ou prestação de serviços de transporte interestadual e intermunicipal e de comunicação com o montante cobrado nas anteriores pelo mesmo ou por outro Estado.</p>

<p><strong>Art. 20.</strong> Para a compensação a que se refere o artigo anterior, é assegurado ao sujeito passivo o direito de creditar-se do imposto anteriormente cobrado em operações de que tenha resultado a entrada de mercadoria, real ou simbólica, no estabelecimento, inclusive a destinada ao seu uso ou consumo ou ao ativo permanente, ou o recebimento de serviços de transporte interestadual e intermunicipal ou de comunicação.<br>
§1º Não dão direito a crédito as entradas de mercadorias ou utilização de serviços resultantes de operações ou prestações isentas ou não tributadas, ou que se refiram a mercadorias ou serviços alheios à atividade do estabelecimento.<br>
§2º Salvo prova em contrário, presumem-se alheios à atividade do estabelecimento os veículos de transporte pessoal.<br>
§3º É vedado o crédito relativo a mercadoria entrada no estabelecimento ou a prestação de serviços a ele feita:<br>
I — para integração ou consumo em processo de industrialização ou produção rural, quando a saída do produto resultante não for tributada ou estiver isenta do imposto, exceto se tratar-se de saída para o exterior;<br>
II — para comercialização ou prestação de serviço, quando a saída ou a prestação subsequente não forem tributadas ou estiverem isentas do imposto, exceto as destinadas ao exterior.<br>
§5º Para efeito do disposto no caput deste artigo, relativamente aos créditos decorrentes de entrada de mercadorias no estabelecimento destinadas ao ativo permanente, deverá ser observado: I — a apropriação será feita à razão de um quarenta e oito avos por mês, devendo a primeira fração ser apropriada no mês em que ocorrer a entrada no estabelecimento (regra de 1/48 — ativo permanente).</p>

<p><strong>Art. 21.</strong> O sujeito passivo deverá efetuar o estorno do imposto de que se tiver creditado sempre que o serviço tomado ou a mercadoria entrada no estabelecimento:<br>
I — for objeto de saída ou prestação de serviço não tributada ou isenta, sendo esta circunstância imprevisível na data da entrada da mercadoria ou da utilização do serviço;<br>
II — for integrada ou consumida em processo de produção ou industrialização, quando a saída do produto resultante for não tributada ou isenta;<br>
III — vier a ser utilizada em fim alheio à atividade do estabelecimento;<br>
IV — vier a perecer, deteriorar-se ou extraviar-se.</p>

<h2>CAPÍTULO III — DA BASE DE CÁLCULO</h2>

<p><strong>Art. 13.</strong> A base de cálculo do imposto é:<br>
I — na saída de mercadoria prevista nos incisos I, III e IV do art. 12, o valor da operação;<br>
II — na hipótese do inciso II do art. 12, o valor da operação, compreendendo mercadoria e serviço;<br>
III — na prestação de serviço de transporte interestadual e intermunicipal e de comunicação, o preço do serviço;<br>
IV — no fornecimento de que trata o inciso VIII do art. 2º: a) o valor da operação, na hipótese da alínea a; b) o preço corrente da mercadoria fornecida ou empregada, na hipótese da alínea b;<br>
§1º Integra a base de cálculo do imposto, inclusive na hipótese do inciso V do caput deste artigo:<br>
I — o montante do próprio imposto, constituindo o respectivo destaque mera indicação para fins de controle;<br>
II — o valor correspondente a: a) seguros, juros e demais importâncias pagas, recebidas ou debitadas, bem como descontos concedidos sob condição; b) frete, caso o transporte seja efetuado pelo próprio remetente ou por sua conta e ordem e seja cobrado em separado.<br>
§2º Não integra a base de cálculo do imposto o montante do IPI quando a operação, realizada entre contribuintes e relativa a produto destinado à industrialização ou à comercialização, configurar fato gerador de ambos os impostos.<br>
§6º Nas operações e prestações interestaduais que destinem bens e serviços a consumidor final não contribuinte do imposto, o valor do imposto correspondente à diferença entre a alíquota interna e a interestadual será calculado pela fórmula: (DIFAL = [BC × ALQ interna] − [BC × ALQ interestadual]).</p>

<h2>CAPÍTULO IV — DA SUBSTITUIÇÃO TRIBUTÁRIA</h2>

<p><strong>Art. 6º</strong> Lei estadual poderá atribuir a contribuinte do imposto ou a depositário a qualquer título a responsabilidade pelo seu pagamento, hipótese em que assumirá a condição de substituto tributário.<br>
§1º A responsabilidade poderá ser atribuída em relação ao imposto incidente sobre uma ou mais operações ou prestações, sejam antecedentes, concomitantes ou subsequentes, inclusive ao valor decorrente da diferença entre alíquotas interna e interestadual nas operações e prestações que destinem bens e serviços a consumidor final localizado em outro Estado, que seja contribuinte do imposto.<br>
§2º A atribuição de responsabilidade dar-se-á em relação a mercadorias, bens ou serviços previstos em lei de cada Estado.</p>

<p><strong>Art. 8º</strong> A base de cálculo, para fins de substituição tributária, será:<br>
I — em relação às operações ou prestações antecedentes ou concomitantes, o valor da operação ou prestação praticado pelo contribuinte substituído;<br>
II — em relação às operações ou prestações subsequentes, obtida pelo somatório das parcelas seguintes: a) o valor da operação ou prestação própria realizada pelo substituto tributário ou pelo substituído intermediário; b) o montante dos valores de seguro, de frete e de outros encargos cobrados ou transferíveis aos adquirentes ou tomadores de serviço; c) a margem de valor agregado, inclusive lucro, relativa às operações ou prestações subsequentes (MVA).</p>

<p><strong>Art. 10.</strong> É assegurado ao contribuinte substituído o direito à restituição do valor do imposto pago por força da substituição tributária, correspondente ao fato gerador presumido que não se realizar. (RE 593.849 — STF: também quando BC real < BC presumida)</p>

<h2>CAPÍTULO V — DO LOCAL DA OPERAÇÃO OU DA PRESTAÇÃO</h2>

<p><strong>Art. 11.</strong> O local da operação ou da prestação, para os efeitos da cobrança do imposto e definição do estabelecimento responsável, é:<br>
I — tratando-se de mercadoria ou bem: a) o do estabelecimento onde se encontre, no momento da ocorrência do fato gerador; b) onde se encontre, quando em situação irregular pela falta de documentação fiscal ou quando acompanhado de documentação inidônea; c) o do estabelecimento que transfira a propriedade, ou o título que a represente, de mercadoria por ele adquirida no País e que por ele não tenha transitado; d) importado do exterior, o do estabelecimento onde ocorrer a entrada física; e) importado do exterior, o do domicílio do adquirente, quando não estabelecido;<br>
II — tratando-se de prestação de serviço de transporte: a) onde tenha início a prestação; b) onde se encontre o transportador, quando em situação irregular pela falta de documentação fiscal ou quando acompanhada de documentação inidônea;<br>
III — tratando-se de prestação onerosa de serviço de comunicação: a) o da prestação do serviço de radiodifusão sonora e de som e imagem, assim entendido o da geração, emissão, transmissão e retransmissão, repetição, ampliação e recepção; b) o do estabelecimento da concessionária ou da permissionária que forneça ficha, cartão, ou assemelhados com que o serviço é pago; c) o do estabelecimento destinatário do serviço, na hipótese e para os efeitos do inciso XIII do art. 12; d) o do estabelecimento ou domicílio do tomador do serviço, quando prestado por meio de satélite.<br>
§3º Para efeito desta Lei Complementar, estabelecimento é o local, privado ou público, edificado ou não, próprio ou de terceiro, onde pessoas físicas ou jurídicas exerçam suas atividades em caráter temporário ou permanente, bem como onde se encontrem armazenadas mercadorias.</p>`,
"lc24": `<h2>LEI COMPLEMENTAR Nº 24, DE 7 DE JANEIRO DE 1975</h2>
<p>Dispõe sobre os convênios para a concessão de isenções do imposto sobre operações relativas à circulação de mercadorias, e dá outras providências.</p>

<p><strong>Art. 1º</strong> As isenções do imposto sobre operações relativas à circulação de mercadorias serão concedidas ou revogadas nos termos de convênios celebrados e ratificados pelos Estados e pelo Distrito Federal, segundo esta Lei.<br>
Parágrafo único. O disposto neste artigo também se aplica: I — à redução da base de cálculo; II — à devolução total ou parcial, direta ou indireta, condicionada ou não, do tributo, ao contribuinte, a responsável ou a terceiros; III — à concessão de créditos presumidos; IV — a quaisquer outros incentivos ou favores fiscais ou financeiro-fiscais, concedidos com base no Imposto de Circulação de Mercadorias, dos quais resulte redução ou eliminação, direta ou indireta, do respectivo ônus; V — às prorrogações e às extensões das isenções vigentes nesta data.</p>

<p><strong>Art. 2º</strong> Os convênios a que alude o art. 1º, serão celebrados em reuniões para esse fim convocadas pelo Ministério da Fazenda, das quais participarão representantes de todos os Estados e do Distrito Federal.<br>
§1º As reuniões se realizarão com a presença de representantes da maioria das Unidades da Federação.<br>
§2º A concessão de benefícios dependerá sempre de decisão unânime dos Estados representados (unanimidade para conceder).<br>
§3º A revogação total ou parcial dependerá de aprovação de quatro quintos, pelo menos, dos representantes presentes (4/5 para revogar).</p>

<p><strong>Art. 8º</strong> A inobservância dos dispositivos desta Lei acarretará, cumulativamente:<br>
I — a nulidade do ato e a ineficácia do crédito fiscal atribuído ao estabelecimento recebedor da mercadoria;<br>
II — a exigibilidade do imposto não pago ou devolvido e a ineficácia da lei ou ato que conceda remissão do débito correspondente.<br>
Parágrafo único. As sanções previstas neste artigo poder-se-ão acrescer a presunção de irregularidade das operações acobertadas, incidentalmente, por documentos fiscais remetidos por estabelecimento beneficiário de isenção concedida nos termos desta lei.</p>

<p><strong>⚠️ RELEVÂNCIA PARA CONCURSO:</strong> A LC 24/75 é a base da regra do CONFAZ — qualquer benefício de ICMS concedido sem convênio unânime do CONFAZ é inconstitucional (Tema 745 STF — Guerra Fiscal). A EC 132/2023 manteve o CONFAZ transitoriamente até a extinção do ICMS (2033).</p>`,
"lrf": `<h2>LEI COMPLEMENTAR Nº 101, DE 4 DE MAIO DE 2000 — LEI DE RESPONSABILIDADE FISCAL</h2>
<p>Estabelece normas de finanças públicas voltadas para a responsabilidade na gestão fiscal e dá outras providências.</p>

<h2>CAPÍTULO I — DISPOSIÇÕES PRELIMINARES</h2>

<p><strong>Art. 1º</strong> Esta Lei Complementar estabelece normas de finanças públicas voltadas para a responsabilidade na gestão fiscal, com amparo no Capítulo II do Título VI da Constituição.<br>
§1º A responsabilidade na gestão fiscal pressupõe a ação planejada e transparente, em que se previnem riscos e corrigem desvios capazes de afetar o equilíbrio das contas públicas, mediante o cumprimento de metas de resultados entre receitas e despesas e a obediência a limites e condições no que tange a renúncia de receita, geração de despesas com pessoal, da seguridade social e outras, dívidas consolidada e mobiliária, operações de crédito, inclusive por antecipação de receita, concessão de garantia e inscrição em Restos a Pagar.</p>

<p><strong>Art. 2º</strong> Para os efeitos desta Lei Complementar, entende-se como:<br>
I — ente da Federação: a União, cada Estado, o Distrito Federal e cada Município;<br>
II — empresa controlada: sociedade cuja maioria do capital social com direito a voto pertença, direta ou indiretamente, a ente da Federação;<br>
III — empresa estatal dependente: empresa controlada que receba do ente controlador recursos financeiros para pagamento de despesas com pessoal ou de custeio em geral ou de capital;<br>
IV — receita corrente líquida: somatório das receitas tributárias, de contribuições, patrimoniais, industriais, agropecuárias, de serviços, transferências correntes e outras receitas também correntes, deduzidos: a) na União, os valores transferidos aos Estados e Municípios por determinação constitucional ou legal, e as contribuições mencionadas na alínea a do inciso I e no inciso II do art. 195, e no art. 239 da Constituição; b) nos Estados, as parcelas entregues aos Municípios por determinação constitucional; c) na União, nos Estados e nos Municípios, a contribuição dos servidores para o custeio do seu sistema de previdência e assistência social e as receitas provenientes da compensação financeira citada no § 9º do art. 201 da Constituição.</p>

<h2>CAPÍTULO II — DO PLANEJAMENTO</h2>

<p><strong>Art. 4º</strong> A lei de diretrizes orçamentárias atenderá o disposto no § 2º do art. 165 da Constituição e: I — disporá também sobre equilíbrio entre receitas e despesas; II — critérios e forma de limitação de empenho; III — normas relativas ao controle de custos e à avaliação dos resultados dos programas financiados com recursos dos orçamentos; IV — demais condições e exigências para transferências de recursos a entidades públicas e privadas.<br>
§1º Integrará o projeto de lei de diretrizes orçamentárias o Anexo de Metas Fiscais, em que serão estabelecidas metas anuais, em valores correntes e constantes, relativas a receitas, despesas, resultados nominal e primário e montante da dívida pública, para o exercício a que se referirem e para os dois seguintes.</p>

<h2>CAPÍTULO III — DA RECEITA PÚBLICA</h2>

<p><strong>Art. 11.</strong> Constituem requisitos essenciais da responsabilidade na gestão fiscal a instituição, previsão e efetiva arrecadação de todos os tributos da competência constitucional do ente da Federação.<br>
Parágrafo único. É vedada a realização de transferências voluntárias para o ente que não observe o disposto no caput, no que se refere aos impostos.</p>

<p><strong>Art. 14.</strong> A concessão ou ampliação de incentivo ou benefício de natureza tributária da qual decorra renúncia de receita deverá estar acompanhada de estimativa do impacto orçamentário-financeiro no exercício em que deva iniciar sua vigência e nos dois seguintes, atender ao disposto na lei de diretrizes orçamentárias e a pelo menos uma das seguintes condições: I — demonstração pelo proponente de que a renúncia foi considerada na estimativa de receita da lei orçamentária, na forma do art. 12, e de que não afetará as metas de resultados fiscais previstas no anexo próprio da lei de diretrizes orçamentárias; II — estar acompanhada de medidas de compensação, no período mencionado no caput, por meio do aumento de receita, proveniente da elevação de alíquotas, ampliação da base de cálculo, majoração ou criação de tributo ou contribuição.</p>

<h2>CAPÍTULO IV — DA DESPESA PÚBLICA</h2>

<p><strong>Art. 15.</strong> Serão consideradas não autorizadas, irregulares e lesivas ao patrimônio público a geração de despesa ou assunção de obrigação que não atendam o disposto nos arts. 16 e 17.</p>

<p><strong>Art. 16.</strong> A criação, expansão ou aperfeiçoamento de ação governamental que acarrete aumento da despesa será acompanhado de: I — estimativa do impacto orçamentário-financeiro no exercício em que deva entrar em vigor e nos dois subsequentes; II — declaração do ordenador da despesa de que o aumento tem adequação orçamentária e financeira com a lei orçamentária anual e compatibilidade com o plano plurianual e com a lei de diretrizes orçamentárias.</p>

<h2>Seção II — Das Despesas com Pessoal</h2>

<p><strong>Art. 19.</strong> Para os fins do disposto no caput do art. 169 da Constituição, a despesa total com pessoal, em cada período de apuração e em cada ente da Federação, não poderá exceder os percentuais da receita corrente líquida, a seguir discriminados:<br>
I — União: 50%;<br>
II — Estados: 60%;<br>
III — Municípios: 60%.</p>

<p><strong>Art. 20.</strong> A repartição dos limites globais do art. 19 não poderá exceder os seguintes percentuais:<br>
I — na esfera federal: a) 2,5% para o Legislativo, incluído o Tribunal de Contas da União; b) 6% para o Judiciário; c) 40,9% para o Executivo; d) 0,6% para o Ministério Público da União;<br>
II — na esfera estadual: a) 3% para o Legislativo, incluído o Tribunal de Contas do Estado; b) 6% para o Judiciário; c) 49% para o Executivo; d) 2% para o Ministério Público dos Estados;<br>
III — na esfera municipal: a) 6% para o Legislativo, incluído o Tribunal de Contas do Município, quando houver; b) 54% para o Executivo.</p>

<p><strong>Art. 22.</strong> A verificação do cumprimento dos limites estabelecidos nos arts. 19 e 20 será realizada ao final de cada quadrimestre.<br>
Parágrafo único. Se a despesa total com pessoal exceder a 95% do limite, são vedados ao Poder ou órgão referido no art. 20 que houver incorrido no excesso: I — concessão de vantagem, aumento, reajuste ou adequação de remuneração a qualquer título; II — criação de cargo, emprego ou função; III — alteração de estrutura de carreira que implique aumento de despesa; IV — provimento de cargo público, admissão ou contratação de pessoal a qualquer título; V — contratação de hora extra, salvo para situações previstas na LDO.</p>

<h2>CAPÍTULO VII — DO CONTROLE E DA FISCALIZAÇÃO</h2>

<p><strong>Art. 48.</strong> São instrumentos de transparência da gestão fiscal, aos quais será dada ampla divulgação, inclusive em meios eletrônicos de acesso público: os planos, orçamentos e leis de diretrizes orçamentárias; as prestações de contas e o respectivo parecer prévio; o Relatório Resumido da Execução Orçamentária e o Relatório de Gestão Fiscal; e as versões simplificadas desses documentos.<br>
§1º A transparência será assegurada também mediante: I — incentivo à participação popular e realização de audiências públicas, durante os processos de elaboração e discussão dos planos, lei de diretrizes orçamentárias e orçamentos; II — liberação ao pleno conhecimento e acompanhamento da sociedade, em tempo real, de informações pormenorizadas sobre a execução orçamentária e financeira, em meios eletrônicos de acesso público.</p>

<p><strong>Art. 54.</strong> Ao final de cada quadrimestre será emitido pelos titulares dos Poderes e órgãos referidos no art. 20 o Relatório de Gestão Fiscal, assinado pelo: I — Chefe do Poder Executivo; II — Presidente e demais membros da Mesa Diretora ou órgão decisório equivalente, conforme regimentos internos dos órgãos do Poder Legislativo; III — Presidente de Tribunal e demais membros de Conselho de Administração ou órgão decisório equivalente, conforme regimentos internos dos órgãos do Poder Judiciário; IV — Chefe do Ministério Público, da Defensoria Pública e do Tribunal de Contas.</p>`,
"lei9613": `<h2>LEI Nº 9.613, DE 3 DE MARÇO DE 1998 — LEI DE LAVAGEM DE DINHEIRO</h2>
<p>Dispõe sobre os crimes de "lavagem" ou ocultação de bens, direitos e valores; a prevenção da utilização do sistema financeiro para os ilícitos previstos nesta Lei; cria o Conselho de Controle de Atividades Financeiras — COAF.</p>

<h2>CAPÍTULO I — DOS CRIMES DE "LAVAGEM" OU OCULTAÇÃO DE BENS, DIREITOS E VALORES</h2>

<p><strong>Art. 1º</strong> Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal.<br>
Pena: reclusão, de 3 (três) a 10 (dez) anos, e multa.<br>
§1º Incorre na mesma pena quem, para ocultar ou dissimular a utilização de bens, direitos ou valores provenientes de infração penal: I — os converte em ativos lícitos; II — os adquire, recebe, troca, negocia, dá ou recebe em garantia, guarda, tem em depósito, movimenta ou transfere; III — importa ou exporta bens com valores não correspondentes aos verdadeiros.<br>
§2º Incorre, ainda, na mesma pena quem: I — utiliza, na atividade econômica ou financeira, bens, direitos ou valores provenientes de infração penal; II — participa de grupo, associação ou escritório tendo conhecimento de que sua atividade principal ou secundária é dirigida à prática de crimes previstos nesta Lei.<br>
§3º A tentativa é punida.<br>
§4º A pena será aumentada de um a dois terços, se os crimes definidos nesta Lei forem cometidos de forma reiterada ou por intermédio de organização criminosa.<br>
§5º A pena poderá ser reduzida de um a dois terços e ser cumprida em regime aberto ou semiaberto, facultando-se ao juiz deixar de aplicá-la ou substituí-la, a qualquer tempo, por pena restritiva de direitos, se o autor, coautor ou partícipe colaborar espontaneamente com as autoridades, prestando esclarecimentos que conduzam à apuração das infrações penais, à identificação dos autores, coautores e partícipes, ou à localização dos bens, direitos ou valores objeto do crime (colaboração premiada).</p>

<h2>CAPÍTULO V — DO COAF</h2>

<p><strong>Art. 14.</strong> É criado, no âmbito do Ministério da Fazenda, o Conselho de Controle de Atividades Financeiras — COAF, com a finalidade de disciplinar, aplicar penas administrativas, receber, examinar e identificar as ocorrências suspeitas de atividades ilícitas previstas nesta Lei, sem prejuízo da competência de outros órgãos e entidades.<br>
§1º As instruções referidas no art. 10 destinadas aos setores referidos no art. 9º, para os quais não exista órgão próprio fiscalizador ou regulador, serão expedidas pelo COAF, competindo-lhe, para esses setores, a definição das pessoas abrangidas e a aplicação das sanções enumeradas no art. 12.<br>
§2º O COAF deverá, ainda, coordenar e propor mecanismos de cooperação e de troca de informações que viabilizem ações rápidas e eficientes no combate à ocultação ou dissimulação de bens, direitos e valores.</p>`,
"crimes": `<h2>LEI Nº 8.137, DE 27 DE DEZEMBRO DE 1990</h2>
<p>Define crimes contra a ordem tributária, econômica e contra as relações de consumo, e dá outras providências.</p>

<h2>CAPÍTULO I — DOS CRIMES CONTRA A ORDEM TRIBUTÁRIA</h2>
<h2>Seção I — Dos crimes praticados por particulares</h2>

<p><strong>Art. 1º</strong> Constitui crime contra a ordem tributária suprimir ou reduzir tributo, ou contribuição social e qualquer acessório, mediante as seguintes condutas:<br>
I — omitir informação, ou prestar declaração falsa às autoridades fazendárias;<br>
II — fraudar a fiscalização tributária, inserindo elementos inexatos, ou omitindo operação de qualquer natureza, em documento ou livro exigido pela lei fiscal;<br>
III — falsificar ou alterar nota fiscal, fatura, duplicata, nota de venda, ou qualquer outro documento relativo à operação tributável;<br>
IV — elaborar, distribuir, fornecer, emitir ou utilizar documento que saiba ou deva saber falso ou inexato;<br>
V — negar ou deixar de fornecer, quando obrigatório, nota fiscal ou documento equivalente, relativa a venda de mercadoria ou prestação de serviço, efetivamente realizada, ou fornecê-la em desacordo com a legislação.<br>
Pena: reclusão de 2 (dois) a 5 (cinco) anos, e multa.<br>
Parágrafo único. A falta de atendimento da exigência da autoridade, no prazo de 10 (dez) dias, que poderá ser convertido em horas em razão da maior ou menor complexidade da matéria ou da dificuldade quanto ao atendimento da exigência, caracteriza a infração prevista no inciso V.</p>

<p><strong>Art. 2º</strong> Constitui crime da mesma natureza:<br>
I — fazer declaração falsa ou omitir declaração sobre rendas, bens ou fatos, ou empregar outra fraude, para eximir-se, total ou parcialmente, de pagamento de tributo;<br>
II — deixar de recolher, no prazo legal, valor de tributo ou de contribuição social, descontado ou cobrado, na qualidade de sujeito passivo de obrigação e que deveria recolher aos cofres públicos;<br>
III — exigir, pagar ou receber, para si ou para o contribuinte beneficiário, qualquer percentagem sobre a parcela dedutível ou deduzida de imposto ou de contribuição como incentivo fiscal;<br>
IV — deixar de aplicar, ou aplicar em desacordo com o estatuído, incentivo fiscal ou parcelas de imposto liberadas por órgão ou entidade de desenvolvimento;<br>
V — utilizar ou divulgar programa de processamento de dados que permita ao sujeito passivo da obrigação tributária possuir informação contábil diversa daquela que é, por lei, fornecida à Fazenda Pública.<br>
Pena: detenção, de 6 (seis) meses a 2 (dois) anos, e multa.</p>

<h2>Seção II — Dos crimes praticados por funcionários públicos</h2>

<p><strong>Art. 3º</strong> Constitui crime funcional contra a ordem tributária, além dos previstos no Decreto-Lei nº 2.848, de 7 de dezembro de 1940 — Código Penal (Título XI, Capítulo I):<br>
I — extraviar livro oficial, processo fiscal ou qualquer documento, de que tenha a guarda em razão da função; sonegá-lo, ou inutilizá-lo, total ou parcialmente, acarretando pagamento indevido ou inexato de tributo ou contribuição social;<br>
II — exigir, solicitar ou receber, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de iniciar seu exercício, mas em razão dela, vantagem indevida; ou aceitar promessa de tal vantagem, para deixar de lançar ou cobrar tributo ou contribuição social, ou cobrá-los parcialmente;<br>
III — patrocinar, direta ou indiretamente, interesse privado perante a administração fazendária, valendo-se da qualidade de funcionário público.<br>
Pena: reclusão, de 3 (três) a 8 (oito) anos, e multa.</p>

<p><strong>EXTINÇÃO DA PUNIBILIDADE — SÚMULA VINCULANTE 24:</strong> Não se tipifica crime material contra a ordem tributária, previsto no art. 1º, incisos I a IV, da Lei nº 8.137/1990, antes do lançamento definitivo do tributo. O pagamento do tributo, a qualquer tempo, extingue a punibilidade do crime tributário material (art. 9º da Lei 10.684/2003 — entendimento atual do STJ/STF).</p>`,
"lef": `<h2>LEI Nº 6.830, DE 22 DE SETEMBRO DE 1980 — LEI DE EXECUÇÃO FISCAL</h2>
<p>Dispõe sobre a cobrança judicial da Dívida Ativa da Fazenda Pública, e dá outras providências.</p>

<p><strong>Art. 1º</strong> A execução judicial para cobrança da Dívida Ativa da União, dos Estados, do Distrito Federal, dos Municípios e respectivas autarquias será regida por esta Lei e, subsidiariamente, pelo Código de Processo Civil.</p>

<p><strong>Art. 2º</strong> Constitui Dívida Ativa da Fazenda Pública aquela definida como tributária ou não tributária na Lei nº 4.320, de 17 de março de 1964, com as alterações posteriores, que estatui normas gerais de direito financeiro para elaboração e controle dos orçamentos e balanços da União, dos Estados, dos Municípios e do Distrito Federal.<br>
§2º A Dívida Ativa Tributária é o crédito da Fazenda Pública dessa natureza, proveniente de obrigação legal relativa a tributos e respectivos adicionais e multas, e a Dívida Ativa não Tributária são os demais créditos da Fazenda Pública, tais como os provenientes de empréstimos compulsórios, contribuições estabelecidas em lei, multa de qualquer origem ou natureza, exceto as tributárias, foros, laudêmios, alugueis ou taxas de ocupação, custas processuais, preços de serviços prestados por estabelecimentos públicos, indenizações, reposições, restituições, alcances dos responsáveis definitivamente julgados, bem assim os créditos decorrentes de obrigações em moeda estrangeira, de subrogação de hipoteca, fiança, aval ou outra garantia, de contratos em geral ou de outras obrigações legais.<br>
§5º A Certidão de Dívida Ativa (CDA) conterá: I — o nome do devedor, dos co-responsáveis e, sempre que conhecido, o domicílio ou residência de um e de outros; II — o valor originário da dívida, bem como o termo inicial e a forma de calcular os juros de mora e demais encargos previstos em lei ou contrato; III — a origem, a natureza e o fundamento legal ou contratual da dívida; IV — a indicação, se for o caso, de estar a dívida sujeita à atualização monetária, bem como o respectivo fundamento legal e o termo inicial para o cálculo; V — a data e o número da inscrição, no Registro de Dívida Ativa; VI — o número do processo administrativo ou do auto de infração, se neles estiver apurado o valor da dívida.</p>

<p><strong>Art. 4º</strong> A execução fiscal poderá ser promovida contra: I — o devedor; II — o fiador; III — o espólio; IV — a massa; V — o responsável, nos termos da lei, por dívidas, tributárias ou não, de pessoas físicas ou pessoas jurídicas de direito privado; VI — os sucessores a qualquer título.</p>

<p><strong>Art. 8º</strong> O executado será citado para, no prazo de 5 (cinco) dias, pagar a dívida com os juros e multa de mora e encargos indicados na Certidão de Dívida Ativa, ou garantir a execução.<br>
§2º O despacho do Juiz, que ordenar a citação, interrompe a prescrição.</p>

<p><strong>Art. 9º</strong> Em garantia da execução, pelo valor da dívida, juros e multa de mora e encargos indicados na Certidão de Dívida Ativa, o executado poderá: I — efetuar depósito em dinheiro, à ordem do Juízo em estabelecimento oficial de crédito, que assegure atualização monetária; II — oferecer fiança bancária ou seguro garantia; III — nomear bens à penhora, observada a ordem do art. 11; IV — indicar à penhora bens oferecidos por terceiros e aceitos pela Fazenda Pública.</p>

<p><strong>Art. 11.</strong> A penhora ou arresto de bens obedecerá à seguinte ordem: I — dinheiro; II — título da dívida pública, bem como título de crédito, que tenham cotação em bolsa; III — pedras e metais preciosos; IV — imóveis; V — navios e aeronaves; VI — veículos; VII — móveis ou semoventes; e VIII — direitos e ações.</p>

<p><strong>Art. 16.</strong> O executado oferecerá embargos, no prazo de 30 (trinta) dias, contados: I — do depósito; II — da juntada da prova da fiança bancária ou do seguro garantia; III — da intimação da penhora.<br>
§1º Não são admissíveis embargos do executado antes de garantida a execução.<br>
§2º No prazo dos embargos, o executado deverá alegar toda matéria útil à defesa, requerer provas e juntar aos autos os documentos e rol de testemunhas, até três, ou, a critério do juiz, até o dobro desse limite.</p>

<p><strong>Art. 40.</strong> O Juiz suspenderá o curso da execução, enquanto não for localizado o devedor ou encontrados bens sobre os quais possa recair a penhora, e, nesses casos, não correrá o prazo de prescrição.<br>
§4º Se da decisão que ordenar o arquivamento tiver decorrido o prazo prescricional, o juiz, depois de ouvida a Fazenda Pública, poderá, de ofício, reconhecer a prescrição intercorrente e decretá-la de imediato (prescrição intercorrente na execução fiscal).</p>`,
"lei4320": `<h2>LEI Nº 4.320, DE 17 DE MARÇO DE 1964</h2>
<p>Estatui Normas Gerais de Direito Financeiro para elaboração e controle dos orçamentos e balanços da União, dos Estados, dos Municípios e do Distrito Federal.</p>

<h2>TÍTULO I — DA LEI DE ORÇAMENTO</h2>

<p><strong>Art. 1º</strong> Esta lei estatui normas gerais de direito financeiro para elaboração e controle dos orçamentos e balanços da União, dos Estados, dos Municípios e do Distrito Federal, de acordo com o disposto no art. 5º, inciso XV, letra b, da Constituição Federal.</p>

<p><strong>Art. 2º</strong> A Lei do Orçamento conterá a discriminação da receita e despesa de forma a evidenciar a política econômica financeira e o programa de trabalho do Governo, obedecidos os princípios de unidade, universalidade e anualidade.<br>
§1º Integrarão a Lei de Orçamento: I — Sumário geral da receita por fontes e da despesa por funções do Governo; II — Quadro demonstrativo da Receita e Despesa segundo as Categorias Econômicas; III — Quadro discriminativo da receita por fontes e respectiva legislação; IV — Quadro das dotações por órgãos do Governo e da Administração.<br>
§2º Acompanharão a Lei de Orçamento: I — Quadros demonstrativos da receita e planos de aplicação dos fundos especiais; II — Quadros demonstrativos da despesa, na forma dos Anexos nºs 6 a 9; III — Quadro demonstrativo do programa anual de trabalho do Governo, em termos de realização de obras e de prestação de serviços.</p>

<p><strong>Art. 8º</strong> A discriminação da despesa far-se-á, no mínimo, por elementos. Parágrafo único. Para efeito desta lei, entende-se por elementos o desdobramento da despesa com pessoal, material, serviços, obras e outros meios de que se serve a administração pública para consecução dos seus fins.</p>

<h2>TÍTULO III — DA RECEITA E DA DESPESA</h2>
<h2>Capítulo I — Da Receita</h2>

<p><strong>Art. 9º</strong> Tributo é a receita derivada instituída pelas entidades de direito público, compreendendo os impostos, as taxas e contribuições nos termos da constituição e das leis vigentes em matéria financeira, destinado-se o seu produto ao custeio de atividades gerais ou específicas exercidas por essas entidades.</p>

<p><strong>Art. 11.</strong> A receita classificar-se-á nas seguintes categorias econômicas: Receitas Correntes e Receitas de Capital.<br>
§1º São Receitas Correntes as receitas tributária, de contribuições, patrimonial, agropecuária, industrial, de serviços e outras e, ainda, as provenientes de recursos financeiros recebidos de outras pessoas de direito público ou privado, quando destinadas a atender despesas classificáveis em Despesas Correntes.<br>
§2º São Receitas de Capital as provenientes da realização de recursos financeiros oriundos de constituição de dívidas; da conversão, em espécie, de bens e direitos; os recursos recebidos de outras pessoas de direito público ou privado, destinados a atender despesas classificáveis em Despesas de Capital e, ainda, o superávit do Orçamento Corrente.<br>
§4º A classificação da receita obedecerá ao seguinte esquema: (11) Receita Tributária: (111) Impostos; (112) Taxas; (113) Contribuições de Melhoria.</p>

<h2>Capítulo II — Da Despesa</h2>

<p><strong>Art. 12.</strong> A despesa será classificada nas seguintes categorias econômicas: Despesas Correntes e Despesas de Capital.<br>
§1º Classificam-se como Despesas Correntes as dotações para manutenção dos serviços anteriormente criados, inclusive as destinadas a atender a obras de conservação e adaptação de bens imóveis.<br>
§2º Classificam-se como Despesas de Capital as dotações para o planejamento e a execução de obras, inclusive as destinadas à aquisição de imóveis considerados necessários à realização destas últimas, bem como para os programas especiais de trabalho, aquisição de instalações, equipamentos e material permanente e constituição ou aumento do capital de empresas que não sejam de caráter comercial ou financeiro.</p>

<p><strong>Art. 13.</strong> Observada a discriminação constante dos Anexos nºs 4 e 5, as Despesas Correntes classificam-se em: Despesas de Custeio e Transferências Correntes. As Despesas de Capital classificam-se em: Investimentos, Inversões Financeiras e Transferências de Capital.</p>

<p><strong>Art. 16.</strong> Fundamentalmente e nos termos da legislação vigente, a despesa só pode ser realizada se houver prévia autorização legislativa.</p>

<h2>TÍTULO IV — DOS CRÉDITOS ADICIONAIS</h2>

<p><strong>Art. 40.</strong> São créditos adicionais, as autorizações de despesa não computadas ou insuficientemente dotadas na Lei de Orçamento.</p>

<p><strong>Art. 41.</strong> Os créditos adicionais classificam-se em: I — suplementares, os destinados a refôrço de dotação orçamentária; II — especiais, os destinados a despesas para as quais não haja dotação orçamentária específica; III — extraordinários, os destinados a despesas urgentes e imprevistas, em caso de guerra, comoção intestina ou calamidade pública.</p>

<p><strong>Art. 42.</strong> Os créditos suplementares e especiais serão autorizados por lei e abertos por decreto executivo. Os créditos extraordinários serão abertos por decreto do Poder Executivo, que deles dará imediato conhecimento ao Poder Legislativo.</p>

<h2>TÍTULO V — DO EXERCÍCIO FINANCEIRO</h2>

<p><strong>Art. 34.</strong> O exercício financeiro coincidirá com o ano civil.</p>

<p><strong>Art. 35.</strong> Pertencem ao exercício financeiro: I — as receitas nele arrecadadas; II — as despesas nele legalmente empenhadas (regime de competência para despesas — empenho).</p>

<p><strong>Art. 36.</strong> Consideram-se Restos a Pagar as despesas empenhadas mas não pagas até o dia 31 de dezembro distinguindo-se as processadas das não processadas. Parágrafo único. Os empenhos que sorvem Restos a Pagar com prescrição interrompida e os empenhados à conta de créditos com vigência plurianual, que não reúnam os requisitos estabelecidos no art. 67 da Lei nº 5.172, de 25 de outubro de 1966, poderão ser cancelados, podendo os respectivos créditos serem reabertos no exercício seguinte à conta de despesas de exercícios anteriores.</p>`,
"ec132": `<h2>EMENDA CONSTITUCIONAL Nº 132, DE 20 DE DEZEMBRO DE 2023 — REFORMA TRIBUTÁRIA</h2>
<p>Altera o Sistema Tributário Nacional.</p>

<h2>PRINCIPAIS DISPOSIÇÕES</h2>

<p><strong>Art. 1º</strong> A Constituição Federal passa a vigorar com as seguintes alterações: [EC 132 altera arts. 145, 148, 153, 155, 156, 167, 195 e acrescenta arts. 156-A, 195-A e Ato das Disposições Constitucionais Transitórias — ADCT]</p>

<h2>IBS — IMPOSTO SOBRE BENS E SERVIÇOS (Art. 156-A)</h2>

<p><strong>Art. 156-A.</strong> Lei complementar instituirá imposto sobre bens e serviços de competência compartilhada entre Estados, Distrito Federal e Municípios.<br>
§1º O imposto previsto no caput será informado pelo princípio da neutralidade e atenderá ao seguinte:<br>
I — incidirá sobre operações com bens materiais ou imateriais, inclusive direitos, ou com serviços;<br>
II — será não cumulativo, compensando-se o imposto devido pelo contribuinte com o montante cobrado sobre todas as operações nas quais seja adquirente de bem material ou imaterial, inclusive direito, ou de serviço, excetuadas exclusivamente as consideradas de uso ou consumo pessoal especificadas em lei complementar e as hipóteses previstas nesta Constituição;<br>
III — não incidirá sobre as exportações de bens materiais ou imateriais, inclusive direitos, ou de serviços, e será assegurada a manutenção e o aproveitamento dos créditos relativos às operações antecedentes;<br>
IV — incidirá também sobre a importação de bens materiais ou imateriais, inclusive direitos, ou de serviços realizada por pessoa física ou jurídica, ainda que não seja sujeito passivo habitual do imposto;<br>
V — terá legislação uniforme em todo o território nacional, ressalvadas as exceções previstas nesta Constituição;<br>
VI — será cobrado pelo destino;<br>
VII — não incidirá sobre as prestações de serviço de comunicação nas modalidades de radiodifusão sonora e de sons e imagens de recepção livre e gratuita;<br>
VIII — terá suas alíquotas fixadas por lei de cada Estado e do Distrito Federal, no âmbito de suas competências, para os contribuintes localizados em seus territórios, e por lei de cada Município e do Distrito Federal, no âmbito de suas competências, para os contribuintes localizados em seus territórios;<br>
IX — as alíquotas dos Estados e dos Municípios serão iguais para todas as operações com bens materiais ou imateriais, inclusive direitos, ou com serviços, ressalvadas as exceções previstas nesta Constituição;</p>

<h2>CBS — CONTRIBUIÇÃO SOBRE BENS E SERVIÇOS</h2>

<p>A CBS substitui o PIS e a COFINS, com competência federal. Mesmas regras gerais do IBS — não cumulativa, cobrada no destino, legislação uniforme. Regulamentada pela LC 214/2025.</p>

<h2>IS — IMPOSTO SELETIVO (Art. 153, VIII)</h2>

<p><strong>Art. 153, VIII.</strong> A União poderá instituir imposto sobre produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente, nos termos de lei complementar.<br>
§6º O imposto previsto no inciso VIII: I — não incidirá sobre as exportações; II — poderá incidir sobre os mesmos bens e serviços sujeitos às contribuições de que trata o art. 195-A, hipótese em que terá as suas alíquotas reduzidas; III — não constituirá base de cálculo para a incidência do IBS e da CBS.</p>

<h2>COMITÊ GESTOR DO IBS</h2>

<p>Criado para administrar o IBS de forma compartilhada entre estados e municípios. Cada estado tem um voto e cada município tem um voto (ponderados pela participação na receita). Responsável por editar normas, fiscalizar, arrecadar e distribuir o IBS.</p>

<h2>FUNDO DE DESENVOLVIMENTO REGIONAL (FNDR)</h2>

<p>Criado para compensar as regiões menos desenvolvidas pela perda do poder de concessão de benefícios fiscais de ICMS (guerra fiscal). Dotação de R$ 60 bilhões ao ano até 2043, com prioridade para Norte, Nordeste e Centro-Oeste.</p>

<h2>TRANSIÇÃO — CRONOGRAMA</h2>

<p>2026: alíquota teste de IBS e CBS (0,1% cada) para fins de validação;<br>
2027–2028: cobrança plena de CBS, extinção do PIS/COFINS;<br>
2029–2032: redução gradual de ICMS e ISS, aumento de IBS;<br>
01/01/2033: extinção total do ICMS e do ISS; IBS pleno.<br>
IPVA: alíquotas mínimas pelo Senado; incidirá sobre veículos aquáticos e aéreos.<br>
ITCMD: caberá ao Senado fixar alíquotas progressivas máximas.<br>
IPTU: base de cálculo poderá ser atualizada por decreto, sem lei (nova regra).</p>

<p><strong>CASHBACK:</strong> IBS e CBS deverão prever a devolução do imposto para famílias de baixa renda (mecanismo regulamentado pela LC 214/2025).</p>`,
"lc214": `<h2>LEI COMPLEMENTAR Nº 214, DE 16 DE JANEIRO DE 2025</h2>
<p>Regulamenta a Emenda Constitucional nº 132, de 2023 (Reforma Tributária). Institui o IBS, a CBS e o Imposto Seletivo.</p>

<h2>LIVRO I — DA CBS (Contribuição sobre Bens e Serviços)</h2>

<p><strong>Art. 1º</strong> Esta Lei Complementar institui, em conformidade com o art. 195-A da Constituição Federal e com fundamento nos arts. 146, III, e 195, § 4º, da Constituição Federal: I — a Contribuição sobre Bens e Serviços — CBS; II — o Imposto sobre Bens e Serviços — IBS; III — o Imposto Seletivo — IS.</p>

<p><strong>Art. 3º</strong> A CBS e o IBS têm como fato gerador as operações onerosas que envolvam: I — a transmissão de bens tangíveis; II — a transmissão de bens intangíveis; III — a prestação de serviços; IV — a licença de direitos.<br>
Parágrafo único. A CBS e o IBS incidem sobre todas as etapas da cadeia econômica, vedada a cumulatividade.</p>

<p><strong>Art. 5º</strong> Considera-se contribuinte da CBS e do IBS a pessoa física ou jurídica que realize operações de forma habitual ou em volume que caracterize intuito econômico.</p>

<p><strong>Art. 10.</strong> A CBS e o IBS são não cumulativos, assegurando-se ao contribuinte o direito de crédito do valor da CBS e do IBS incidente sobre as operações de aquisição de bens e serviços utilizados na atividade econômica.<br>
§1º O crédito será apurado na forma de crédito financeiro — incidindo sobre qualquer aquisição utilizada na atividade econômica, inclusive bens de capital.<br>
§2º Não geram crédito as aquisições de bens e serviços de uso e consumo pessoal.</p>

<h2>REGIMES DIFERENCIADOS</h2>

<p><strong>Art. 30.</strong> Ficam sujeitos a regimes diferenciados da CBS e do IBS: I — os serviços financeiros; II — os seguros; III — os planos de saúde; IV — o mercado imobiliário; V — as cooperativas; VI — os combustíveis e lubrificantes; VII — o transporte coletivo; VIII — as operações com bens imóveis; IX — as agências de viagens e operadoras de turismo.</p>

<h2>LIVRO II — DO IBS</h2>

<p><strong>Art. 156-A.</strong> O IBS tem competência compartilhada entre Estados, Distrito Federal e Municípios. A arrecadação é centralizada pelo Comitê Gestor e distribuída conforme participação de cada ente.<br>
Alíquota de referência: fixada pelo Comitê Gestor para garantir manutenção das receitas dos entes durante a transição. Estados e Municípios podem ajustar dentro dos limites fixados pelo Comitê.</p>

<h2>LIVRO III — DO IMPOSTO SELETIVO (IS)</h2>

<p><strong>Art. 409.</strong> O Imposto Seletivo tem como fato gerador a produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente, incluindo:<br>
I — veículos automotores;<br>
II — embarcações e aeronaves;<br>
III — produtos fumígenos;<br>
IV — bebidas alcoólicas;<br>
V — bebidas açucaradas;<br>
VI — bens minerais extraídos;<br>
VII — concursos de prognósticos e fantasias esportivas.</p>

<h2>CASHBACK — DEVOLUÇÃO DE TRIBUTO</h2>

<p><strong>Art. 33.</strong> A CBS e o IBS preverão a devolução de parte do imposto pago por pessoas físicas de baixa renda (Cadastro Único — CadÚnico). O percentual de devolução será maior para: I — energia elétrica e gás de cozinha (100% da CBS e IBS para famílias CadÚnico); II — serviços de telecomunicações (100% para beneficiários do CadÚnico); III — demais bens e serviços (percentual definido em lei).</p>

<h2>CRONOGRAMA DE TRANSIÇÃO</h2>

<p>2026: alíquotas de teste — CBS 0,9% e IBS 0,1% (offset do PIS/COFINS). Arrecadação usada para validar sistemas.<br>
2027–2028: CBS plena substituindo PIS/COFINS integralmente. IBS em 0,1%.<br>
2029: IBS começa a crescer; ICMS e ISS começam a cair proporcionalmente.<br>
2033: Extinção total do ICMS e do ISS. IBS e CBS em pleno funcionamento.<br>
Prazos especiais: serviços financeiros, imóveis e combustíveis têm cronogramas próprios.</p>`,
"lc116": `<h2>LEI COMPLEMENTAR Nº 116, DE 31 DE JULHO DE 2003</h2>
<p>Dispõe sobre o Imposto Sobre Serviços de Qualquer Natureza, de competência dos Municípios e do Distrito Federal, e dá outras providências.</p>

<p><strong>Art. 1º</strong> O Imposto Sobre Serviços de Qualquer Natureza, de competência dos Municípios e do Distrito Federal, tem como fato gerador a prestação de serviços constantes da lista anexa, ainda que esses não se constituam como atividade preponderante do prestador.<br>
§1º O imposto incide também sobre o serviço proveniente do exterior do País ou cuja prestação se tenha iniciado no exterior do País.<br>
§2º Ressalvadas as exceções expressas na lista anexa, os serviços nela mencionados não ficam sujeitos ao ICMS, ainda que sua prestação envolva fornecimento de mercadorias.<br>
§3º O imposto de que trata esta Lei Complementar incide ainda sobre os serviços prestados mediante a utilização de bens e serviços públicos explorados economicamente mediante autorização, permissão ou concessão, com o pagamento de tarifa, preço ou pedágio pelo usuário final do serviço.</p>

<p><strong>Art. 2º</strong> O imposto não incide sobre:<br>
I — as exportações de serviços para o exterior do País;<br>
II — a prestação de serviços em relação de emprego, dos trabalhadores avulsos, dos diretores e membros de conselho consultivo ou de conselho fiscal de sociedades e fundações, bem como dos sócios-gerentes e dos gerentes-delegados;<br>
III — o valor intermediado no mercado de títulos e valores mobiliários, o valor dos depósitos bancários, o principal, juros e acréscimos moratórios relativos a operações de crédito realizadas por instituições financeiras.<br>
Parágrafo único. Não se enquadram no disposto no inciso I os serviços desenvolvidos no Brasil, cujo resultado aqui se verifique, ainda que o pagamento seja feito por residente no exterior.</p>

<p><strong>Art. 3º</strong> O serviço considera-se prestado, e o imposto, devido, no local do estabelecimento prestador ou, na falta do estabelecimento, no local do domicílio do prestador, exceto nas hipóteses previstas nos incisos I a XXV, quando o imposto será devido nos seguintes locais:<br>
I — no local do estabelecimento do tomador ou intermediário do serviço ou, na falta de estabelecimento, onde ele estiver domiciliado, na hipótese do § 1º do art. 1º desta Lei Complementar;<br>
II — no local da instalação dos andaimes, palcos, coberturas e outras estruturas, no caso dos serviços descritos no subitem 3.05 da lista anexa;<br>
III — no local da execução da obra, no caso dos serviços descritos no subitem 7.02 e 7.19 da lista anexa;<br>
IV — no local da demolição, no caso dos serviços descritos no subitem 7.04 da lista anexa;</p>

<p><strong>Art. 7º</strong> A base de cálculo do imposto é o preço do serviço.<br>
§1º Quando os serviços descritos pelo subitem 3.04 da lista anexa forem prestados no território de mais de um Município, a base de cálculo será proporcional, conforme o caso, à extensão da ferrovia, rodovia, dutos e condutos de qualquer natureza, cabos de qualquer natureza, ou ao número de postes, existentes em cada Município.<br>
§2º Não se incluem na base de cálculo do Imposto Sobre Serviços de Qualquer Natureza: I — o valor dos materiais fornecidos pelo prestador dos serviços previstos nos itens 7.02 e 7.05 da lista de serviços anexa a esta Lei Complementar.</p>

<p><strong>Art. 8º</strong> As alíquotas máximas do Imposto Sobre Serviços de Qualquer Natureza são as seguintes: II — demais serviços: 5%.<br>
§2º (Omitido na redação original) — Alíquota mínima: 2% (LC 157/2016 fixou em 2% para evitar guerra fiscal municipal).</p>

<p><strong>Art. 10.</strong> É instituída a Lista de Serviços anexa a esta Lei Complementar.<br>
Principais grupos da lista: 1. Serviços de informática e congêneres; 2. Serviços de pesquisas e desenvolvimento; 3. Serviços prestados mediante locação, cessão de direito de uso e congêneres; 4. Serviços de saúde, assistência médica e congêneres; 5. Serviços de medicina e assistência veterinária; 6. Serviços de cuidados pessoais, estética, atividades físicas e congêneres; 7. Serviços relativos a engenharia, arquitetura, geologia, urbanismo, construção civil, manutenção, limpeza, meio ambiente, saneamento e congêneres; 8. Serviços de educação, ensino, orientação pedagógica e educacional, instrução, treinamento e avaliação pessoal de qualquer grau ou natureza; 14. Serviços bancários, financeiros, de crédito e congêneres; 17. Serviços de apoio técnico, administrativo, jurídico, contábil, comercial e congêneres; 26. Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores.</p>`,
"lei8429": `<h2>LEI Nº 8.429, DE 2 DE JUNHO DE 1992 — LEI DE IMPROBIDADE ADMINISTRATIVA</h2>
<p>Dispõe sobre as sanções aplicáveis em virtude da prática de atos de improbidade administrativa. Alterada pela Lei 14.230/2021.</p>

<p><strong>Art. 1º</strong> O sistema de responsabilização por atos de improbidade administrativa, na forma desta Lei, tem por objetivo proteger a probidade na organização do Estado e no exercício das funções administrativas, incluindo toda a atividade realizada pelo agente público, representante ou administrador de entidades referidas no art. 1º, parágrafo único, com recursos dos entes públicos.<br>
§1º Consideram-se atos de improbidade administrativa as condutas dolosas tipificadas nos arts. 9º, 10 e 11 desta Lei, ressalvados tipos previstos em leis especiais.<br>
§2º Apenas são improbidade administrativa intencionais as condutas de que trata esta Lei. (Após Lei 14.230/21 — exige DOLO; não há mais improbidade culposa)</p>

<p><strong>Art. 2º</strong> Para os efeitos desta Lei, consideram-se agente público o agente político, o servidor público e todo aquele que exerce, ainda que transitoriamente ou sem remuneração, por eleição, nomeação, designação, contratação ou qualquer outra forma de investidura ou vínculo, mandato, cargo, emprego ou função nas entidades referidas no art. 1º desta Lei.</p>

<p><strong>Art. 9º</strong> Constituem atos de improbidade administrativa que importam enriquecimento ilícito auferir qualquer tipo de vantagem patrimonial indevida em razão do exercício de cargo, de mandato, de função, de emprego ou de atividade nas entidades referidas no art. 1º desta Lei, e notadamente:<br>
I — receber, para si ou para outrem, dinheiro, bem móvel ou imóvel, ou qualquer outra vantagem econômica, direta ou indireta, a título de comissão, percentagem, gratificação ou presente de quem tenha interesse, direto ou indireto, que possa ser atingido ou amparado por ação ou omissão decorrente das atribuições do agente público;<br>
II — perceber vantagem econômica, direta ou indireta, para facilitar a aquisição, permuta ou locação de bem móvel ou imóvel, ou a contratação de serviços pelas entidades referidas no art. 1º desta Lei por preço superior ao valor de mercado.</p>

<p><strong>Art. 10.</strong> Constituem atos de improbidade administrativa que causam dano ao erário qualquer ação ou omissão dolosa para conceder, aplicar ou manter benefício financeiro ou tributário contrário ao que dispõem o caput e o § 1º do art. 8º-A da Lei Complementar nº 116, de 31 de julho de 2003; e notadamente:<br>
I — facilitar ou concorrer, por qualquer forma, para a indevida incorporação ao patrimônio particular, de pessoa física ou jurídica, de bens, rendas, verbas ou valores integrantes do acervo patrimonial das entidades mencionadas no art. 1º desta Lei;<br>
IX — agir negligentemente na celebração, fiscalização e análise das prestações de contas de parcerias firmadas pela administração pública com entidades privadas (DOLO necessário — não há mais negligência como fundamento).</p>

<p><strong>Art. 11.</strong> Constituem atos de improbidade administrativa que atentam contra os princípios da administração pública a ação ou omissão dolosa que viole os deveres de honestidade, de imparcialidade e de legalidade, caracterizada por uma das seguintes condutas:<br>
I — praticar ato visando fim proibido em lei ou regulamento ou diverso daquele previsto na regra de competência;<br>
II — retardar ou deixar de praticar, indevidamente, ato de ofício;<br>
VI — celebrar contrato de rateio de consórcio público sem suficiente e prévia dotação orçamentária, ou sem observar as formalidades previstas na lei.</p>

<p><strong>SANÇÕES (Art. 12 — após Lei 14.230/21):</strong><br>
Enriquecimento ilícito (Art. 9): perda dos bens, ressarcimento integral, suspensão direitos políticos 14 anos, multa civil 3x valor do acréscimo patrimonial, proibição de contratar com Poder Público 14 anos.<br>
Dano ao erário (Art. 10): perda dos bens, ressarcimento integral, suspensão direitos políticos 12 anos, multa civil 2x valor do dano, proibição de contratar com Poder Público 12 anos.<br>
Violação aos princípios (Art. 11): ressarcimento integral (se houver dano), suspensão direitos políticos 4 anos, multa civil até 24x a remuneração, proibição de contratar com Poder Público 4 anos.</p>

<p><strong>PRESCRIÇÃO (Art. 23 — após Lei 14.230/21):</strong> 8 anos após a prática do ato ou, no caso de infração permanente ou continuada, do dia em que cessou a permanência ou continuidade. O ressarcimento ao erário é imprescritível (art. 37, §5º CF).</p>`,
"lei14133": `<h2>LEI Nº 14.133, DE 1º DE ABRIL DE 2021 — NOVA LEI DE LICITAÇÕES</h2>
<p>Lei de Licitações e Contratos Administrativos.</p>

<p><strong>Art. 1º</strong> Esta Lei estabelece normas gerais de licitação e contratação para as Administrações Públicas diretas, autárquicas e fundacionais da União, dos Estados, do Distrito Federal e dos Municípios, e abrange: I — os órgãos dos Poderes Legislativo e Judiciário da União, dos Estados e do Distrito Federal e os órgãos do Poder Legislativo dos Municípios, quando no desempenho de função administrativa; II — os fundos especiais e as demais entidades controladas direta ou indiretamente pela Administração Pública.</p>

<p><strong>Art. 5º</strong> Na aplicação desta Lei, serão observados os princípios da legalidade, da impessoalidade, da moralidade, da publicidade, da eficiência, do interesse público, da probidade administrativa, da igualdade, do planejamento, da transparência, da eficácia, da segregação de funções, da motivação, da vinculação ao edital, do julgamento objetivo, da segurança jurídica, da razoabilidade, da competitividade, da proporcionalidade, da celeridade, da economicidade e do desenvolvimento nacional sustentável.</p>

<p><strong>Art. 6º</strong> Para os fins desta Lei, consideram-se:<br>
I — obra: toda construção, reforma, fabricação, recuperação ou ampliação de bem imóvel público;<br>
II — serviço: toda atividade destinada a obter determinada utilidade de interesse para a Administração;<br>
XXIV — contratação direta: contratação que pode ser realizada sem licitação, nas hipóteses de inexigibilidade ou dispensa previstas nesta Lei;<br>
XLII — dispensa de licitação: modalidade de contratação direta em que a licitação é dispensável ou dispensada;<br>
XLIII — inexigibilidade de licitação: modalidade de contratação direta em que é inviável a competição.</p>

<p><strong>MODALIDADES DE LICITAÇÃO (Art. 28):</strong> I — pregão; II — concorrência; III — concurso; IV — leilão; V — diálogo competitivo. (Fim da tomada de preços e convite da Lei 8.666/93).</p>

<p><strong>Art. 29.</strong> A concorrência e o pregão seguem o rito procedimental comum a que se refere o art. 17 desta Lei. A concorrência é obrigatória para contratos de grande valor e obras acima de R$ 3.300.000,00. O pregão é obrigatório para bens e serviços comuns.</p>

<p><strong>DISPENSA DE LICITAÇÃO (Art. 75):</strong> I — obras e serviços de engenharia de valor até R$ 100.000,00; II — outros serviços e compras de valor até R$ 50.000,00; III — obras e serviços de engenharia para manutenção e conservação de bens e instalações de valor até R$ 50.000,00; XV — para aquisição ou locação de imóvel cujas características de instalações e de localização tornem necessária sua escolha; XVI — nas compras de hortifrutigranjeiros, pão e outros gêneros perecíveis.</p>

<p><strong>INEXIGIBILIDADE (Art. 74):</strong> I — aquisição de materiais, de equipamentos ou de gêneros ou contratação de serviços que só possam ser fornecidos por produtor, empresa ou representante comercial exclusivos; II — contratação de profissional do setor artístico, diretamente ou mediante empresário exclusivo, desde que consagrado pela crítica especializada ou pela opinião pública; III — contratação dos seguintes serviços técnicos especializados de natureza predominantemente intelectual com profissionais ou empresas de notória especialização.</p>

<p><strong>CRIMES (Arts. 337-E a 337-P):</strong> Contratação direta ilegal, frustrar caráter competitivo, manipular licitação, afastar licitante — penas de 4 a 8 anos de reclusão + multa. Agravamento: 1/3 a 1/2 se envolver agente público.</p>

<p><strong>MICROEMPRESA E EPP:</strong> Tratamento favorecido mantido — empate ficto (5%), cota reservada de 25% para ME/EPP em licitações para bens de natureza divisível, preferência no desempate.</p>`,

"lei8112": `<h2>LEI Nº 8.112, DE 11 DE DEZEMBRO DE 1990</h2>
<p>Dispõe sobre o regime jurídico dos servidores públicos civis da União, das autarquias e das fundações públicas federais.</p>

<p><strong>Art. 1º</strong> Esta Lei institui o Regime Jurídico dos Servidores Públicos Civis da União, das autarquias, inclusive as em regime especial, e das fundações públicas federais.</p>

<p><strong>Art. 2º</strong> Para os efeitos desta Lei, servidor é a pessoa legalmente investida em cargo público.</p>

<p><strong>Art. 3º</strong> Cargo público é o conjunto de atribuições e responsabilidades previstas na estrutura organizacional que devem ser cometidas a um servidor. Parágrafo único. Os cargos públicos, acessíveis a todos os brasileiros, são criados por lei, com denominação própria e vencimento pago pelos cofres públicos, para provimento em caráter efetivo ou em comissão.</p>

<p><strong>Art. 8º</strong> São formas de provimento de cargo público: I — nomeação; II — promoção; III — readaptação; IV — reversão; V — aproveitamento; VI — reintegração; VII — recondução.</p>

<p><strong>Art. 9º</strong> A nomeação far-se-á: I — em caráter efetivo, quando se tratar de cargo isolado de provimento efetivo ou de carreira; II — em comissão, inclusive na condição de interino, para cargos de confiança vagos.</p>

<p><strong>Art. 10.</strong> A nomeação para cargo de carreira ou cargo isolado de provimento efetivo depende de prévia habilitação em concurso público de provas ou de provas e títulos, obedecidos a ordem de classificação e o prazo de sua validade.</p>

<p><strong>Art. 11.</strong> O concurso será de provas ou de provas e títulos, podendo ser realizado em duas etapas, conforme dispuserem a lei e o regulamento do respectivo plano de carreira, condicionada a inscrição do candidato ao pagamento do valor fixado no edital, quando indispensável ao seu custeio, e restituível quando o concurso não se realizar.</p>

<p><strong>Art. 13.</strong> O provimento se dá pela posse. §1º A posse se dará pela assinatura do respectivo termo, no qual deverão constar as atribuições, os deveres, as responsabilidades e os direitos inerentes ao cargo ocupado. §2º A posse ocorrerá no prazo de trinta dias contados da publicação do ato de provimento. §3º A posse poderá dar-se mediante procuração específica. §4º Só haverá posse nos casos de provimento de cargo por nomeação.</p>

<p><strong>Art. 20.</strong> Ao entrar em exercício, o servidor nomeado para cargo de provimento efetivo ficará sujeito a estágio probatório por período de 24 (vinte e quatro) meses, durante o qual a sua aptidão e capacidade serão objeto de avaliação para o desempenho do cargo.</p>

<p><strong>Art. 21.</strong> O servidor habilitado em concurso público e empossado em cargo de provimento efetivo adquirirá estabilidade no serviço público ao completar 3 (três) anos de efetivo exercício.</p>

<p><strong>Art. 41.</strong> São deveres do servidor: I — exercer com zelo e dedicação as atribuições do cargo; II — ser leal às instituições a que servir; III — observar as normas legais e regulamentares; IV — cumprir as ordens superiores, exceto quando manifestamente ilegais; V — atender com presteza: a) ao público em geral, prestando as informações requeridas; b) à expedição de certidões requeridas para defesa de direito ou esclarecimento de situações de interesse pessoal; c) às requisições para a defesa da Fazenda Pública.</p>

<p><strong>Art. 116.</strong> São proibições ao servidor: I — ausentar-se do serviço durante o expediente, sem prévia autorização do chefe imediato; II — retirar, sem prévia anuência da autoridade competente, qualquer documento ou objeto da repartição; III — recusar fé a documentos públicos; IV — opor resistência injustificada ao andamento de documento e processo ou execução de serviço; V — promover manifestação de apreço ou desapreço no recinto da repartição; VI — cometer a pessoa estranha à repartição, fora dos casos previstos em lei, o desempenho de atribuição que seja de sua responsabilidade ou de seu subordinado.</p>`,

"lei14230": `<h2>LEI Nº 14.230, DE 25 DE OUTUBRO DE 2021</h2>
<p>Altera a Lei nº 8.429, de 2 de junho de 1992 — Lei de Improbidade Administrativa.</p>

<p><strong>Art. 1º</strong> O sistema de responsabilização por atos de improbidade administrativa tutelará a probidade na organização do Estado e no exercício das funções administrativas, com o objetivo de proteger o patrimônio público e social, nos termos desta Lei.</p>

<p><strong>Art. 1º, §1º</strong> Consideram-se atos de improbidade administrativa as condutas dolosas tipificadas nos arts. 9º, 10 e 11 desta Lei, ressalvados tipos previstos em leis especiais.</p>

<p><strong>Art. 1º, §2º</strong> Considera-se dolo a vontade livre e consciente de alcançar o resultado ilícito tipificado nos arts. 9º, 10 e 11 desta Lei, não bastando a voluntariedade do agente.</p>

<p><strong>Art. 1º, §3º</strong> O mero exercício da função ou desempenho de competências públicas, sem comprovação de ato doloso com fim ilícito, afasta a responsabilidade por ato de improbidade administrativa.</p>

<p><strong>Art. 3º</strong> As disposições desta Lei são aplicáveis, no que couber, àquele que, mesmo não sendo agente público, induza ou concorra dolosamente para a prática do ato de improbidade.</p>

<p><strong>Art. 17.</strong> O Ministério Público é parte legítima para o ajuizamento da ação por ato de improbidade administrativa. §14. Enquanto não transitada em julgado a sentença condenatória, é vedada a imposição das sanções previstas no art. 12 desta Lei.</p>

<p><strong>Art. 17-B.</strong> O Ministério Público poderá, com o objetivo de apurar a existência de atos de improbidade, instaurar inquérito civil ou procedimento administrativo de investigação preliminar.</p>

<p><strong>Art. 23.</strong> A ação para a aplicação das sanções previstas nesta Lei prescreve em 8 (oito) anos, contados da data do ato ou do fato impugnado.</p>`,

"lei6404": `<h2>LEI Nº 6.404, DE 15 DE DEZEMBRO DE 1976</h2>
<p>Dispõe sobre as Sociedades por Ações.</p>

<p><strong>Art. 176.</strong> Ao fim de cada exercício social, a diretoria fará elaborar, com base na escrituração mercantil da companhia, as seguintes demonstrações financeiras: I — balanço patrimonial; II — demonstração dos lucros ou prejuízos acumulados; III — demonstração do resultado do exercício; IV — demonstração dos fluxos de caixa; V — se companhia aberta, demonstração do valor adicionado.</p>

<p><strong>Art. 177.</strong> A escrituração da companhia será mantida em registros permanentes, com obediência aos preceitos da legislação comercial e desta Lei e aos princípios de contabilidade geralmente aceitos, devendo observar métodos ou critérios contábeis uniformes no tempo e registrar as mutações patrimoniais segundo o regime de competência.</p>

<p><strong>Art. 178.</strong> No balanço, as contas serão classificadas segundo os elementos do patrimônio que registrem, e agrupadas de modo a facilitar o conhecimento e a análise da situação financeira da companhia. §1º No ativo, as contas serão dispostas em ordem decrescente de grau de liquidez. §2º No passivo, as contas serão classificadas nos seguintes grupos: a) passivo circulante; b) passivo não circulante; c) patrimônio líquido.</p>

<p><strong>Art. 179.</strong> As contas serão classificadas do seguinte modo: I — no ativo circulante: as disponibilidades, os direitos realizáveis no curso do exercício social subsequente e as aplicações de recursos em despesas do exercício seguinte; II — no ativo realizável a longo prazo: os direitos realizáveis após o término do exercício seguinte; III — em investimentos; IV — no ativo imobilizado; V — no intangível.</p>

<p><strong>Art. 182.</strong> A conta do capital social discriminará o montante subscrito e, por dedução, a parcela ainda não realizada. §1º Serão classificadas como reservas de capital as contas que registrarem: a) a contribuição do subscritor de ações que ultrapassar o valor nominal e a parte do preço de emissão das ações sem valor nominal que ultrapassar a importância destinada à formação do capital social; b) o produto da alienação de partes beneficiárias e bônus de subscrição.</p>

<p><strong>Art. 183.</strong> No balanço, os elementos do ativo serão avaliados segundo os seguintes critérios: I — os títulos de negociação e os disponíveis para venda: pelo valor justo; II — os estoques: ao custo de aquisição ou produção; III — os investimentos em coligadas e controladas: pelo método de equivalência patrimonial; IV — os ativos imobilizados e intangíveis: ao custo de aquisição; V — os demais ativos: pelo custo de aquisição deduzido de provisão para ajustá-lo ao valor de mercado, quando este for inferior.</p>

<p><strong>Art. 184.</strong> No balanço, os elementos do passivo serão avaliados pelos seguintes critérios: I — as obrigações, encargos e riscos, conhecidos ou calculáveis, pelo valor atualizado; II — as obrigações em moeda estrangeira: com a taxa de câmbio em vigor na data do balanço; III — as obrigações sujeitas a correção monetária: pelo valor atualizado.</p>

<p><strong>Art. 187.</strong> A demonstração do resultado do exercício discriminará: I — a receita bruta das vendas e serviços; II — as deduções das vendas, os abatimentos e os impostos; III — a receita líquida; IV — o custo das mercadorias e serviços vendidos; V — o lucro bruto; VI — as despesas com vendas, as despesas financeiras, deduzidas das receitas, as despesas gerais e administrativas, e outras despesas operacionais; VII — o lucro ou prejuízo operacional; VIII — as outras receitas e outras despesas; IX — o resultado do exercício antes do imposto sobre a renda e a provisão para o imposto; X — as participações de debêntures, empregados, administradores e partes beneficiárias; XI — o lucro ou prejuízo líquido do exercício e o seu montante por ação do capital social.</p>

<p><strong>Art. 188.</strong> As demonstrações referidas nos incisos IV e V do art. 176 desta Lei indicarão, no mínimo: I — demonstração dos fluxos de caixa — as alterações ocorridas no exercício no saldo de caixa e equivalentes de caixa, segregadas em, no mínimo, 3 (três) fluxos: a) das operações; b) dos financiamentos; c) dos investimentos.</p>

<p><strong>Art. 193.</strong> Do lucro líquido do exercício, 5% (cinco por cento) serão aplicados, antes de qualquer outra destinação, na constituição da reserva legal, que não excederá de 20% (vinte por cento) do capital social.</p>

<p><strong>Art. 195.</strong> A assembleia geral poderá, por proposta dos órgãos da administração, destinar para a reserva de lucros a realizar a parcela do lucro líquido do exercício resultante de receitas não recebidas. §1º Para os efeitos desta Lei, são receitas não recebidas os lucros em decorrência do método da equivalência patrimonial e o lucro na venda a prazo realizado após o término do exercício social seguinte.</p>

<p><strong>Art. 248.</strong> No balanço patrimonial da companhia, os investimentos relevantes em sociedades coligadas sobre cuja administração tenha influência significativa, ou de que participe com 20% (vinte por cento) ou mais do capital votante, em sociedades controladas, e em outras sociedades que façam parte de um mesmo grupo serão avaliados pelo método da equivalência patrimonial.</p>`,

"cpcs_contab": `<h2>CPCs — PRONUNCIAMENTOS DO COMITÊ DE PRONUNCIAMENTOS CONTÁBEIS</h2>
<p><em>Resumo dos artigos/itens mais cobrados pela FGV — SEFAZ-BA 2026</em></p>

<h2>CPC 03 — DEMONSTRAÇÃO DOS FLUXOS DE CAIXA</h2>

<p><strong>Item 6.</strong> A demonstração dos fluxos de caixa deve apresentar os fluxos de caixa do período, classificados em atividades operacionais, de investimento e de financiamento.</p>

<p><strong>Item 18.</strong> A entidade deve apresentar os fluxos de caixa das atividades operacionais usando um destes dois métodos: (a) método direto — classes de recebimentos brutos e pagamentos brutos são divulgadas; (b) método indireto — o lucro ou prejuízo é ajustado pelos efeitos de transações não monetárias, quaisquer diferimentos ou acréscimos de recebimentos ou pagamentos operacionais passados ou futuros e itens de receita ou despesa associados com fluxos de caixa das atividades de investimento ou financiamento.</p>

<p><strong>Item 20.</strong> A entidade pode apresentar os fluxos de caixa das atividades operacionais usando o método indireto, pelo qual o lucro ou prejuízo é ajustado pelos efeitos das transações que não envolvem caixa.</p>

<p><strong>Item 38.</strong> Os seguintes são exemplos de fluxos de caixa provenientes de atividades de financiamento: (a) caixa recebido pela emissão de ações; (b) pagamentos a proprietários para adquirir ou resgatar as ações da entidade; (c) caixa recebido de empréstimos de curto e longo prazos; (d) pagamentos de empréstimos.</p>

<h2>CPC 12 — AJUSTE A VALOR PRESENTE</h2>

<p><strong>Item 4.</strong> O ajuste a valor presente é o processo de trazer a valor presente um ativo ou passivo originado por uma transação de longo prazo.</p>

<p><strong>Item 9.</strong> A taxa de desconto a ser utilizada deve ser aquela que melhor reflita as avaliações do mercado corrente com relação ao valor do dinheiro no tempo e os riscos específicos do ativo ou passivo.</p>

<p><strong>Item 17.</strong> O ajuste a valor presente é obrigatório para os elementos dos ativos e dos passivos de longo prazo. Para elementos de curto prazo deve ser aplicado quando o efeito for considerado relevante em relação às demonstrações contábeis.</p>

<h2>CPC 15 — COMBINAÇÃO DE NEGÓCIOS</h2>

<p><strong>Item 4.</strong> Combinação de negócios é uma operação ou outro evento por meio do qual um adquirente obtém o controle de um ou mais negócios. Transações por vezes chamadas de fusões entre iguais ou fusões também são combinações de negócios conforme esse Pronunciamento.</p>

<p><strong>Item 18.</strong> O adquirente deve mensurar os ativos identificáveis adquiridos e os passivos assumidos pelos respectivos valores justos na data da aquisição.</p>

<p><strong>Item 32.</strong> O adquirente deve reconhecer o ágio por expectativa de rentabilidade futura (goodwill) como ativo. O goodwill não é amortizado; em vez disso, a entidade deve testá-lo quanto à redução ao valor recuperável anualmente.</p>

<p><strong>Item 34.</strong> Se a participação do adquirente no valor justo líquido dos ativos identificáveis e passivos assumidos exceder o valor do custo da combinação, o adquirente deve reconhecer o ganho resultante — ganho por compra vantajosa (deságio) imediatamente no resultado.</p>

<h2>CPC 16 — ESTOQUES</h2>

<p><strong>Item 6.</strong> Estoques são ativos: (a) mantidos para venda no curso normal dos negócios; (b) em processo de produção para venda; ou (c) na forma de materiais ou suprimentos a serem consumidos no processo de produção ou na prestação de serviços.</p>

<p><strong>Item 10.</strong> O custo dos estoques deve incluir todos os custos de aquisição e de transformação, bem como outros custos incorridos para trazer os estoques à sua condição e localização atuais.</p>

<p><strong>Item 25.</strong> O custo dos estoques deve ser atribuído usando-se as fórmulas PEPS (primeiro a entrar, primeiro a sair) ou custo médio ponderado. A entidade deve usar a mesma fórmula de custo para todos os estoques que tenham natureza e uso similares.</p>

<p><strong>Item 28.</strong> Os estoques devem ser mensurados pelo valor de custo ou pelo valor realizável líquido, dos dois o menor. Valor realizável líquido é o preço de venda estimado no curso normal dos negócios menos os custos estimados para completar a produção e os custos estimados para realizar a venda.</p>

<h2>CPC 18 — INVESTIMENTO EM COLIGADA, EM CONTROLADA E EM EMPREENDIMENTO CONTROLADO EM CONJUNTO</h2>

<p><strong>Item 10.</strong> Investimento em coligada deve ser contabilizado pelo método de equivalência patrimonial.</p>

<p><strong>Item 11.</strong> Coligada é uma entidade sobre a qual o investidor tem influência significativa. Se o investidor detém, direta ou indiretamente, 20% ou mais do poder de voto da investida, presume-se que ele tem influência significativa.</p>

<h2>CPC 25 — PROVISÕES, PASSIVOS CONTINGENTES E ATIVOS CONTINGENTES</h2>

<p><strong>Item 14.</strong> Uma provisão deve ser reconhecida quando: (a) a entidade tem uma obrigação presente (legal ou não formalizada) como resultado de evento passado; (b) seja provável que uma saída de recursos que incorporam benefícios econômicos será necessária para liquidar a obrigação; e (c) possa ser feita uma estimativa confiável do valor da obrigação.</p>

<p><strong>Item 27.</strong> Passivos contingentes não são reconhecidos. A entidade deve divulgar um passivo contingente quando é possível (mas não provável) que uma saída de recursos será necessária.</p>

<p><strong>Item 31.</strong> Ativos contingentes não são reconhecidos nas demonstrações contábeis. Eles devem ser divulgados quando for provável a entrada de benefícios econômicos. Quando a entrada de benefícios for praticamente certa, o ativo correspondente não é contingente e deve ser reconhecido.</p>

<p><strong>Item 86.</strong> Quando for provável a entrada de benefícios econômicos, a entidade deve divulgar o ativo contingente em notas explicativas.</p>

<h2>CPC 27 — ATIVO IMOBILIZADO</h2>

<p><strong>Item 6.</strong> Ativo imobilizado é o item tangível que: (a) é mantido para uso na produção ou fornecimento de mercadorias ou serviços, para aluguel a outros, ou para fins administrativos; e (b) se espera utilizar por mais de um período.</p>

<p><strong>Item 30.</strong> Cada parte de um item do ativo imobilizado com custo significativo em relação ao custo total do item deve ser depreciada separadamente (componentização).</p>

<p><strong>Item 43.</strong> A vida útil de um ativo é definida em termos de utilidade esperada do ativo para a entidade. A política de gestão de ativos da entidade pode envolver a alienação de ativos após um período especificado ou após o consumo de uma proporção específica dos benefícios econômicos futuros incorporados ao ativo.</p>

<h2>CPC 46 — MENSURAÇÃO DO VALOR JUSTO</h2>

<p><strong>Item 9.</strong> Valor justo é o preço que seria recebido pela venda de um ativo ou que seria pago pela transferência de um passivo em uma transação não forçada entre participantes do mercado na data de mensuração.</p>

<p><strong>Item 24.</strong> Hierarquia do valor justo: Nível 1 — preços cotados em mercados ativos para ativos e passivos idênticos; Nível 2 — dados observáveis que não sejam os preços cotados do Nível 1; Nível 3 — dados não observáveis para o ativo ou passivo.</p>

<p><strong>Item 72.</strong> A entidade deve divulgar informações que ajudem os usuários das demonstrações contábeis a avaliar: (a) para ativos e passivos mensurados pelo valor justo de forma recorrente após o reconhecimento inicial, as técnicas de avaliação e os dados utilizados.</p>

<p><strong>Item 86.</strong> A entidade deve divulgar o nível da hierarquia do valor justo dentro do qual as mensurações do valor justo são categorizadas em sua totalidade.</p>

<h2>CPC 47 — RECEITA DE CONTRATO COM CLIENTE</h2>

<p><strong>Item 9.</strong> A entidade deve reconhecer a receita para representar a transferência de bens ou serviços prometidos a clientes em um valor que reflita a contraprestação à qual a entidade espera ter direito em troca desses bens ou serviços.</p>

<p><strong>Item 31.</strong> A entidade deve reconhecer a receita quando (ou à medida que) satisfizer a obrigação de desempenho pela transferência do bem ou serviço prometido (ou seja, o ativo) ao cliente.</p>

<p><strong>Item 35.</strong> A entidade transfere o controle de um bem ou serviço ao longo do tempo e, portanto, satisfaz a obrigação de desempenho e reconhece a receita ao longo do tempo se um dos seguintes critérios for atendido: (a) o cliente recebe e consome simultaneamente os benefícios proporcionados pelo desempenho da entidade à medida que a entidade realiza o desempenho; (b) o desempenho da entidade cria ou melhora um ativo que o cliente controla à medida que o ativo é criado ou melhorado; (c) o desempenho da entidade não cria um ativo com uso alternativo para a entidade e a entidade tem direito exequível a pagamento pelo desempenho concluído até a data.</p>

<h2>NBC TG 16 — ESTOQUES (equivalente ao CPC 16)</h2>

<p><strong>Item 25.</strong> O custo dos estoques deve ser atribuído usando-se as fórmulas PEPS (primeiro a entrar, primeiro a sair) ou custo médio ponderado. A entidade deve usar a mesma fórmula de custo para todos os estoques que tenham natureza e uso similares para a entidade.</p>

<p><strong>Item 28.</strong> Os estoques devem ser mensurados pelo valor de custo ou pelo valor realizável líquido, dos dois o menor.</p>

<h2>NBC TG 26 — APRESENTAÇÃO DAS DEMONSTRAÇÕES CONTÁBEIS</h2>

<p><strong>Item 54.</strong> Uma entidade deve apresentar um balanço patrimonial classificado que distingue ativos e passivos correntes dos não correntes, a menos que uma apresentação baseada em liquidez forneça informações confiáveis e mais relevantes.</p>

<p><strong>Item 60.</strong> Um ativo deve ser classificado como circulante quando satisfizer qualquer dos seguintes critérios: (a) espera-se que seja realizado, ou pretende-se que seja vendido ou consumido no decurso normal do ciclo operacional da entidade; (b) está mantido essencialmente com a finalidade de ser negociado; (c) espera-se que seja realizado até doze meses após a data do balanço; ou (d) é caixa ou equivalente de caixa.</p>

<p><strong>Item 76.</strong> Uma entidade deve apresentar, no mínimo, os seguintes itens na demonstração do resultado: receitas, custos financeiros, participação nos lucros de associadas, imposto de renda, resultado único para operações descontinuadas, resultado do período.</p>

<h2>MCASP — MANUAL DE CONTABILIDADE APLICADA AO SETOR PÚBLICO</h2>

<p><strong>Princípio do regime de competência:</strong> As receitas e despesas devem ser reconhecidas no exercício em que ocorrem, independentemente do recebimento ou pagamento. No setor público, o orçamento segue o regime de caixa, mas a contabilidade patrimonial segue o regime de competência.</p>

<p><strong>PCASP — Plano de Contas Aplicado ao Setor Público:</strong> Padroniza as contas de todos os entes da federação. Estrutura: Ativo (1), Passivo e PL (2), Variações Patrimoniais Diminutivas (3), Variações Patrimoniais Aumentativas (4), Controles (7 e 8).</p>

<p><strong>Art. 35 Lei 4.320/64 — Regime orçamentário:</strong> Pertencem ao exercício financeiro as receitas nele arrecadadas e as despesas nele legalmente empenhadas. O regime orçamentário é o de caixa para receitas e de competência para despesas (empenho).</p>

<p><strong>Art. 36 Lei 4.320/64 — Restos a pagar:</strong> Consideram-se Restos a Pagar as despesas empenhadas mas não pagas até o dia 31 de dezembro, distinguindo-se as processadas das não processadas.</p>

<p><strong>Art. 39 Lei 4.320/64 — Dívida ativa:</strong> Os créditos da Fazenda Pública, de natureza tributária ou não tributária, serão escriturados como receita do exercício em que forem arrecadados, nas respectivas rubricas orçamentárias.`,

};


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
  { id:"amarelo", label:"Dourado",  bg:"rgba(249,194,49,0.55)",  border:"#F9C231", text:"#000" },
  { id:"verde",   label:"Verde",    bg:"rgba(0,220,100,0.45)",   border:"#00DC64", text:"#000" },
  { id:"azul",    label:"Azul",     bg:"rgba(66,153,225,0.5)",   border:"#4299E1", text:"#fff" },
  { id:"rosa",    label:"Rosa",     bg:"rgba(237,100,166,0.55)", border:"#ED64A6", text:"#000" },
  { id:"red",     label:"Vermelho", bg:"rgba(252,100,100,0.5)",  border:"#FC6464", text:"#fff" },
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
  // Proxy /api/ai: tenta Claude primeiro, fallback automático para OpenAI
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user, maxTokens }),
      signal: AbortSignal.timeout(35000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Erro " + res.status);
    }
    const data = await res.json();
    return data.text || "";
  } catch(err) {
    console.error("callClaude:", err.message);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════



// ─── EXTRAI ARTIGO DO TEXTO EMBUTIDO ────────────────────────────────────────
function extrairArtigos(textoHtml, ancora) {
  if (!textoHtml || !ancora) return [];
  // Pega números dos artigos âncora: "art. 113 · art. 114" → [113, 114]
  const matches = ancora.matchAll(/art(?:s)?\.?\s*(\d[\w.-]*)/gi);
  const nums = [...new Set([...matches].map(m => m[1]))];
  const resultados = [];
  // Parse simples: busca parágrafos com "Art. N"
  const blocos = textoHtml.split(/<p[^>]*>/i).filter(b => b.trim());
  nums.forEach(num => {
    const bloco = blocos.find(b => {
      const sem = b.replace(/<[^>]+>/g,"");
      return new RegExp(`Art\\.\\s*${num}[^\\d]`,"i").test(sem);
    });
    if (bloco && !resultados.find(r => r.num === num)) {
      const texto = bloco.replace(/<\/p>/i,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
      if (texto.length > 10) resultados.push({ num, texto });
    }
  });
  return resultados.slice(0, 5);
}

// ─── MAPEAMENTO LEI → CHAVE TEXTOS_EMBUTIDOS ─────────────────────────────────
const LEI_KEY_MAP = {
  "CTN": "ctn",
  "CF/88": "cf88_trib",
  "Lei 7.014/96": "ba_lei7014",
  "LC 87/96": "lkandir",
  "Lei 4.826/03": "ba_lei4826",
  "Lei 6.348/91": "ba_lei6348",
  "Dec. 7.629/99": "ba_dec7629",
  "Lei 4.320/64": "lei4320",
  "LC 101/00": "lrf",
  "Lei 14.133/21": "lei14133",
  "Lei 8.429/92": "lei8429",
  "Lei 9.784/99": "lei9784",
  "Lei 8.112/90": "lei8112",
  "Lei 14.230/21": "lei14230",
  "Lei 6.404/76": "lei6404",
  "CPC 03": "cpcs_contab",
  "CPC 12": "cpcs_contab",
  "CPC 15": "cpcs_contab",
  "CPC 16": "cpcs_contab",
  "CPC 18": "cpcs_contab",
  "CPC 25": "cpcs_contab",
  "CPC 27": "cpcs_contab",
  "CPC 46": "cpcs_contab",
  "CPC 47": "cpcs_contab",
  "NBC TG 16": "cpcs_contab",
  "NBC TG 26": "cpcs_contab",
  "MCASP": "cpcs_contab",
};

function getLeiKey(arts) {
  if (!arts) return null;
  for (const [nome, key] of Object.entries(LEI_KEY_MAP)) {
    if (arts.includes(nome)) return key;
  }
  return null;
}

// ─── COMPONENTE ACCORDEON DE ARTIGOS ─────────────────────────────────────────
function ArtigoAccordeon({ dia }) {
  const [aberto, setAberto] = useState(false);
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const leiKey = getLeiKey(dia.arts);

  async function abrir() {
    if (aberto) { setAberto(false); return; }
    setAberto(true);
    if (artigos.length > 0) return;
    if (!leiKey) return;
    setCarregando(true);
    // Busca do TEXTOS_EMBUTIDOS (disponível globalmente)
    try {
      const textoHtml = TEXTOS_EMBUTIDOS[leiKey];
      if (textoHtml) {
        const extraidos = extrairArtigos(textoHtml, dia.ancora);
        setArtigos(extraidos);
      }
    } catch(e) { console.warn("ArtigoAccordeon:", e); }
    setCarregando(false);
  }

  return (
    <div style={{ marginBottom:6 }}>
      {/* Linha de artigos clicável */}
      <div onClick={abrir} style={{
        fontSize:10, fontFamily:"'JetBrains Mono',monospace", color:T.verde3,
        lineHeight:1.6, cursor: leiKey ? "pointer" : "default",
        display:"flex", alignItems:"flex-start", gap:6,
        background:"rgba(0,107,63,0.06)", border:"1px solid rgba(0,107,63,0.18)",
        borderRadius:6, padding:"5px 8px",
      }}>
        <span>📖</span>
        <span style={{ flex:1 }}>{dia.arts}</span>
        {leiKey && (
          <span style={{ color:T.cinza3, fontSize:9, flexShrink:0, marginTop:1 }}>
            {aberto ? "▲" : "▼"} ver artigos
          </span>
        )}
      </div>

      {/* Accordeon expandido */}
      {aberto && (
        <div style={{
          marginTop:4, background:"rgba(0,107,63,0.04)",
          border:"1px solid rgba(0,107,63,0.15)",
          borderRadius:"0 0 8px 8px", overflow:"hidden"
        }}>
          {carregando && (
            <div style={{ padding:"10px 12px", fontSize:11, color:T.cinza3 }}>⏳ Carregando artigos…</div>
          )}
          {!carregando && artigos.length === 0 && (
            <div style={{ padding:"10px 12px", fontSize:11, color:T.cinza3 }}>
              Texto não disponível offline para esta lei.
            </div>
          )}
          {artigos.map((art, i) => (
            <div key={i} style={{
              padding:"10px 12px",
              borderBottom: i < artigos.length-1 ? "1px solid rgba(0,107,63,0.10)" : "none"
            }}>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700,
                color:T.verde2, marginBottom:4, textTransform:"uppercase", letterSpacing:.5
              }}>
                Art. {art.num}
              </div>
              <div style={{ fontSize:11, color:T.branco, lineHeight:1.65 }}>
                {art.texto.length > 500 ? art.texto.substring(0,500)+"…" : art.texto}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── COMPONENTE: TELA CRONOGRAMA VISUAL ──────────────────────────────────────
function TelaCronograma({ isMobile, online, user, setTela }) {

  const MAT_COR_CRONO = {
    DT:"#F9C231", LE:"#FDBA74", CO:"#68D391",
    AF:"#8BA7BF", DA:"#00A65A", DC:"#8BA7BF",
    RE:"#FCA5A5", DS:"rgba(255,255,255,0.08)"
  };
  const MAT_NOME_CRONO = {
    DT:"Dir. Tributário", LE:"Leg. Estadual",
    CO:"Contabilidade", AF:"AFO",
    DA:"Dir. Adm.", DC:"Dir. Const.",
    RE:"Revisão", DS:"Descanso"
  };
  const FASES = [
    { num:"01", titulo:"Fundamentos", desc:"Dias 01–30 · CTN + CF + ICMS/BA", ini:1, fim:30 },
    { num:"02", titulo:"Aprofundamento", desc:"Dias 31–60 · CO + AFO + DA + DC", ini:31, fim:60 },
    { num:"03", titulo:"Consolidação", desc:"Dias 61–90 · 2ª Leitura + Simulados + Reta Final", ini:61, fim:90 },
  ];

  const [filtroMat, setFiltroMat]     = useState("TODOS");
  const [concluidos, setConcluidos]   = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("crono_concluidos") || "[]")); }
    catch { return new Set(); }
  });
  const [vistaAtiva, setVistaAtiva]   = useState("cards"); // cards | calendario
  const diaAtual                      = getDiaAtual();

  // Salvar progresso localmente
  function toggleDia(d) {
    setConcluidos(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      localStorage.setItem("crono_concluidos", JSON.stringify([...next]));
      return next;
    });
  }

  const totalUteis = CRONOGRAMA_90.filter(d => d.mat !== "DS").length;
  const totalFeitos = [...concluidos].filter(d => parseInt(d) >= 1 && parseInt(d) <= 90).length;
  const pct = Math.round(totalFeitos / totalUteis * 100);

  const revisoesPorDia = {};
  CRONOGRAMA_90.forEach(d => {
    if (d.mat === "DS" || d.mat === "RE") return;
    [d.d+1, d.d+7, d.d+30].forEach((r, i) => {
      if (r <= 90) {
        if (!revisoesPorDia[r]) revisoesPorDia[r] = [];
        revisoesPorDia[r].push({ tipo: ["R1","R2","R3"][i], diaOrigem: d.d, mat: d.mat });
      }
    });
  });

  const filtros = ["TODOS","DT","LE","CO","AF","DA","DC","RE"];

  function corFiltro(mat) {
    if (mat === "TODOS") return filtroMat === "TODOS";
    return filtroMat === mat;
  }

  function cardVisivel(d) {
    if (filtroMat === "TODOS") return true;
    if (d.mat === "DS") return true;
    return d.mat === filtroMat;
  }

  return (
    <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

      {/* ── HEADER ── */}
      <div style={{
        background:"linear-gradient(135deg,#050D17 0%,#08170A 50%,#0A1628 100%)",
        borderBottom:`1px solid rgba(255,255,255,0.07)`,
        padding: isMobile ? "14px 14px 10px" : "20px 28px 14px",
        flexShrink:0
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:12 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:T.verde2, marginBottom:3 }}>
              📅 Cronograma 90 Dias
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:900, color:"#fff" }}>
              Lei Seca · <span style={{ color:T.amarelo }}>SEFAZ-BA · FGV</span>
            </h2>
          </div>
          {/* Vista toggle */}
          <div style={{ display:"flex", gap:6 }}>
            {[{id:"cards",icon:"🗂️"},{id:"calendario",icon:"📆"}].map(v => (
              <button key={v.id} onClick={() => setVistaAtiva(v.id)} className="btn" style={{
                padding:"7px 12px", borderRadius:8, fontSize:12, fontWeight:700,
                background: vistaAtiva===v.id ? `rgba(0,107,63,0.25)` : T.fundo3,
                border: `1px solid ${vistaAtiva===v.id ? "rgba(0,107,63,0.5)" : T.borda2}`,
                color: vistaAtiva===v.id ? T.verde3 : T.cinza3
              }}>{v.icon}</button>
            ))}
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${T.verde},${T.verde2})`, borderRadius:99, transition:"width .5s" }} />
          </div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:T.verde2, whiteSpace:"nowrap" }}>{pct}%</span>
          <span style={{ fontSize:11, color:T.cinza3, whiteSpace:"nowrap" }}>{totalFeitos}/{totalUteis} dias</span>
        </div>

        {/* Filtros matéria */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {filtros.map(mat => (
            <button key={mat} onClick={() => setFiltroMat(mat)} className="btn" style={{
              padding:"4px 11px", borderRadius:100, fontSize:10, fontWeight:700,
              background: corFiltro(mat) ? (mat==="TODOS"?"rgba(0,107,63,0.2)":`rgba(0,0,0,0.3)`) : "rgba(255,255,255,0.04)",
              border: `1px solid ${corFiltro(mat) ? (MAT_COR_CRONO[mat]||T.verde2)+"66" : T.borda2}`,
              color: corFiltro(mat) ? (MAT_COR_CRONO[mat]||T.verde2) : T.cinza3,
            }}>
              {mat === "TODOS" ? "Todos" : MAT_NOME_CRONO[mat]}
            </button>
          ))}
        </div>
      </div>

      {/* ── VISTA CALENDÁRIO ── */}
      {vistaAtiva === "calendario" && (
        <div style={{ padding: isMobile?"14px":"24px 28px", flex:1, overflow:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?5:10},1fr)`, gap:5, marginBottom:24 }}>
            {CRONOGRAMA_90.map(dia => {
              const isDs = dia.mat === "DS";
              const feito = concluidos.has(String(dia.d));
              const isHoje = dia.d === diaAtual;
              const temRevisao = revisoesPorDia[dia.d]?.length > 0;
              const cor = MAT_COR_CRONO[dia.mat] || "rgba(255,255,255,0.1)";
              return (
                <div key={dia.d} onClick={() => !isDs && toggleDia(String(dia.d))}
                  title={isDs ? "Descanso" : `Dia ${dia.d} · ${dia.tema}`}
                  style={{
                    aspectRatio:"1", borderRadius:7,
                    background: feito ? "rgba(0,107,63,0.18)" : T.fundo3,
                    border: `1px solid ${isHoje ? T.amarelo : feito ? "rgba(0,107,63,0.4)" : T.borda2}`,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    cursor: isDs ? "default" : "pointer", opacity: isDs ? 0.35 : 1,
                    position:"relative", transition:"all .15s",
                    borderTop: !isDs ? `2px solid ${cor}55` : undefined,
                  }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color: feito ? T.verde2 : isHoje ? T.amarelo : "rgba(255,255,255,0.35)" }}>
                    {dia.d}
                  </span>
                  {feito && <span style={{ fontSize:7, color:T.verde2 }}>✓</span>}
                  {temRevisao && !feito && (
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#FCA5A5", position:"absolute", top:3, right:3 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {Object.entries(MAT_COR_CRONO).filter(([k])=>k!=="DS").map(([mat,cor])=>(
              <div key={mat} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.cinza3 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:cor }} />
                {MAT_NOME_CRONO[mat]}
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#FCA5A5" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#FCA5A5" }} />
              Revisão pendente
            </div>
          </div>
        </div>
      )}

      {/* ── VISTA CARDS ── */}
      {vistaAtiva === "cards" && (
        <div style={{ padding: isMobile?"12px":"20px 24px", flex:1, overflow:"auto" }}>
          {FASES.map(fase => {
            const diasFase = CRONOGRAMA_90.filter(d => d.d >= fase.ini && d.d <= fase.fim && cardVisivel(d));
            if (diasFase.length === 0) return null;
            return (
              <div key={fase.num} style={{ marginBottom:36 }}>
                {/* Fase header */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, fontWeight:700, color:T.amarelo, opacity:.7, lineHeight:1 }}>{fase.num}</span>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:900, color:"#fff" }}>{fase.titulo}</div>
                    <div style={{ fontSize:11, color:T.cinza3, marginTop:2 }}>{fase.desc}</div>
                  </div>
                  <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(249,194,49,.2),transparent)" }} />
                </div>

                {/* Grid de cards */}
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
                  {diasFase.map(dia => {
                    const isDs = dia.mat === "DS";
                    const feito = concluidos.has(String(dia.d));
                    const isHoje = dia.d === diaAtual;
                    const revisoesDia = revisoesPorDia[dia.d] || [];
                    const cor = MAT_COR_CRONO[dia.mat] || "rgba(255,255,255,0.1)";

                    return (
                      <div key={dia.d} style={{
                        background: feito ? "rgba(0,107,63,0.09)" : T.fundo3,
                        border: `1px solid ${isHoje ? T.amarelo+"88" : feito ? "rgba(0,107,63,0.32)" : T.borda2}`,
                        borderTop: `3px solid ${isDs ? "rgba(255,255,255,0.06)" : cor+"99"}`,
                        borderRadius:12, padding:"14px 16px",
                        opacity: isDs ? 0.4 : 1,
                        position:"relative"
                      }}>
                        {/* Topo */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div>
                            <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:.8, color:"rgba(255,255,255,0.2)", marginBottom:1 }}>
                              {["","SEG","TER","QUA","QUI","SEX","SAB","DOM"][((dia.d-1)%7)+1] || ""}
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:32, fontWeight:700, lineHeight:1, color: feito ? "rgba(0,166,90,0.25)" : "rgba(255,255,255,0.1)" }}>
                              {String(dia.d).padStart(2,"0")}
                            </div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                            {/* Badge hoje */}
                            {isHoje && (
                              <div style={{ background:"rgba(249,194,49,0.15)", border:"1px solid rgba(249,194,49,0.4)", borderRadius:100, padding:"2px 8px", fontSize:9, fontWeight:700, color:T.amarelo }}>
                                HOJE
                              </div>
                            )}
                            {/* Check */}
                            {!isDs && (
                              <div onClick={() => toggleDia(String(dia.d))} style={{
                                width:20, height:20, borderRadius:"50%",
                                border: `2px solid ${feito ? T.verde2 : "rgba(255,255,255,0.2)"}`,
                                background: feito ? T.verde2 : "transparent",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:9, color:"#fff", cursor:"pointer"
                              }}>
                                {feito ? "✓" : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pill matéria */}
                        <div style={{
                          display:"inline-block", padding:"2px 9px", borderRadius:100,
                          fontSize:9, fontWeight:700, marginBottom:8,
                          background: `${cor}18`, border:`1px solid ${cor}44`, color:cor
                        }}>
                          {MAT_NOME_CRONO[dia.mat]}
                        </div>

                        {!isDs && (
                          <>
                            <div style={{ fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.4, marginBottom:8 }}>
                              {dia.tema}
                            </div>

                            {/* Artigos — clique para ver texto literal */}
                            {dia.arts && (
                              <ArtigoAccordeon dia={dia} />
                            )}

                            {/* Âncoras */}
                            {dia.ancora && (
                              <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:6 }}>
                                {dia.ancora.split(" · ").map((a,i) => (
                                  <span key={i} style={{
                                    fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700,
                                    background:"rgba(249,194,49,0.08)", border:"1px solid rgba(249,194,49,0.22)",
                                    borderRadius:5, padding:"1px 6px", color:T.amarelo
                                  }}>{a}</span>
                                ))}
                              </div>
                            )}

                            {/* Jurisprudência */}
                            {dia.juri && (
                              <div style={{
                                background:"rgba(104,211,145,0.05)", border:"1px solid rgba(104,211,145,0.15)",
                                borderLeft:"3px solid rgba(104,211,145,0.4)", borderRadius:"0 6px 6px 0",
                                padding:"5px 8px", fontSize:10, color:T.verde3, lineHeight:1.5, marginBottom:8
                              }}>
                                ⚖️ {dia.juri}
                              </div>
                            )}

                            {/* Badges de revisão */}
                            {revisoesDia.length > 0 && (
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:6 }}>
                                {revisoesDia.map((r,i) => (
                                  <span key={i} style={{
                                    background:"rgba(252,165,165,0.10)", border:"1px solid rgba(252,165,165,0.28)",
                                    borderRadius:100, padding:"2px 7px", fontSize:9, fontWeight:700, color:"#FCA5A5"
                                  }}>🔁 {r.tipo} · Dia {r.diaOrigem}</span>
                                ))}
                              </div>
                            )}

                            {/* Botões de ação */}
                            <div style={{ display:"flex", gap:6, marginTop:8 }}>
                              <button onClick={() => setTela("sessao")} className="btn" style={{
                                flex:1, padding:"7px 10px", borderRadius:8, fontSize:11, fontWeight:700,
                                background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff", border:"none"
                              }}>
                                🧠 Estudar agora
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── DADOS DO CRONOGRAMA 90 DIAS ──────────────────────────────────────────────
const DATA_INICIO = new Date("2026-06-29T00:00:00-03:00");

const CRONOGRAMA_90 = [
{d:1,mat:"DT",assunto:"Direito Tributário",tema:"Sistema Tributário Nacional — Conceito de tributo e espécies tributárias",arts:"CTN Arts. 1–18 · CF/88 Arts. 145–149-A",ancora:"art. 3 CTN · art. 5 CTN · art. 145 CF · art. 149 CF",juri:"STF Súm. 545 (preço público ≠ taxa) · STF Súm. 666 (contribuição confederativa) · STF RE 566.621 (pecunia non olet) · STF ADI 447 (natureza jurídica pelo fato gerador)"},
{d:2,mat:"DT",assunto:"Direito Tributário",tema:"Competência Tributária — Privativa, comum, cumulativa, residual e extraordinária",arts:"CTN Arts. 6–15 · CF/88 Arts. 153–156",ancora:"art. 6 CTN · art. 8 CTN · art. 153 CF · art. 155 CF",juri:"STF Súm. 69 · STF ADI 2.056 (competência indelegável) · STJ REsp 1.221.170"},
{d:3,mat:"DT",assunto:"Direito Tributário",tema:"Obrigação Tributária — Principal e acessória. Fato gerador. Hipótese de incidência",arts:"CTN Arts. 113–118",ancora:"art. 113 · art. 114 · art. 115 · art. 116",juri:"STJ REsp 1.141.990 · STF RE 598.677 (obrigação acessória autônoma) · STJ Súm. 391"},
{d:4,mat:"DT",assunto:"Direito Tributário",tema:"Sujeito Ativo e Passivo — Solidariedade. Capacidade tributária. Domicílio",arts:"CTN Arts. 119–130",ancora:"art. 121 · art. 122 · art. 124 · art. 127",juri:"STJ Súm. 430 · STJ Súm. 435 · STF RE 562.276 (solidariedade exige interesse comum)"},
{d:5,mat:"DT",assunto:"Direito Tributário",tema:"Lançamento Tributário — Conceito, natureza jurídica e modalidades",arts:"CTN Arts. 142–150",ancora:"art. 142 · art. 147 · art. 149 · art. 150",juri:"STF Súm. 436 (declaração constitui crédito) · STJ Súm. 397 · STJ REsp 1.130.545 · STF RE 94.462"},
{d:6,mat:"DT",assunto:"Direito Tributário",tema:"Suspensão do Crédito Tributário — Moratória, parcelamento, depósito, liminar",arts:"CTN Arts. 151–155-A",ancora:"art. 151 · art. 152 · art. 155-A",juri:"STJ Súm. 112 (depósito integral em dinheiro) · STJ Súm. 213 · STF RE 389.808 · STJ REsp 1.167.543"},
{d:7,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:8,mat:"DT",assunto:"Direito Tributário",tema:"Extinção do Crédito Tributário — Pagamento, compensação, remissão, decadência, prescrição",arts:"CTN Arts. 156–174",ancora:"art. 156 · art. 168 · art. 173 · art. 174",juri:"STJ Súm. 622 · STF RE 556.664 (prazo decadencial só por CTN) · STJ Súm. 555 · STJ REsp 1.120.295"},
{d:9,mat:"DT",assunto:"Direito Tributário",tema:"Exclusão do Crédito — Isenção e Anistia. Diferenças e pegadinhas FGV",arts:"CTN Arts. 175–182",ancora:"art. 175 · art. 176 · art. 180 · art. 182",juri:"STF Súm. 544 · STF ADI 286 (isenção ≠ imunidade) · STJ REsp 1.240.045 · STF RE 204.062"},
{d:10,mat:"DT",assunto:"Direito Tributário",tema:"Responsabilidade Tributária — Por transferência, dos sucessores, de terceiros, por infrações",arts:"CTN Arts. 128–138",ancora:"art. 128 · art. 130 · art. 134 · art. 135 · art. 138",juri:"STJ Súm. 430 · STJ Súm. 554 · STJ REsp 1.101.728 (denúncia espontânea) · STF RE 562.276"},
{d:11,mat:"DC",assunto:"Dir. Constitucional",tema:"Princípios Constitucionais Tributários — Legalidade, anterioridade, irretroatividade, isonomia, capacidade contributiva",arts:"CF/88 Arts. 150–152",ancora:"art. 150, I · art. 150, III, b · art. 150, III, c · art. 150, VI",juri:"STF RE 627.543 (anterioridade nonagesimal) · STF ADI 939 · STF RE 566.032 · STF Súm. Vinc. 50"},
{d:12,mat:"DC",assunto:"Dir. Constitucional",tema:"Imunidades Tributárias — Recíproca, religiosa, partidos, livros. Imunidade vs isenção",arts:"CF/88 Art. 150, VI · CTN Arts. 9–11",ancora:"art. 150, VI, a · b · c · d",juri:"STF Súm. 657 · STF RE 562.351 · STF RE 608.872 (templos) · STF RE 595.676 (e-books)"},
{d:13,mat:"DC",assunto:"Dir. Constitucional",tema:"Repartição de Receitas Tributárias — FPM, FPE, fundos constitucionais, ICMS, IPI",arts:"CF/88 Arts. 157–162",ancora:"art. 157 · art. 158 · art. 159 · art. 160",juri:"STF RE 705.423 · STF ADI 1.075"},
{d:14,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:15,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Fato Gerador: hipóteses de incidência, momento de ocorrência, territorialidade",arts:"Lei 7.014/96 Arts. 1–8 · LC 87/96 Arts. 1–3",ancora:"art. 1 · art. 2 · art. 3 · art. 7 Lei 7014",juri:"STF Súm. 660 · STF RE 540.829 (desembaraço aduaneiro) · STJ Súm. 350"},
{d:16,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Não-Incidência Constitucional e Legal. Diferenças com isenção",arts:"CF/88 Art. 155, §2º, X · LC 87/96 Arts. 3–4 · Lei 7.014/96 Art. 5",ancora:"art. 155, §2º, X, a · b · art. 3 LC 87 · art. 5 Lei 7014",juri:"STF Súm. 536 · STF RE 439.796 · STJ REsp 1.085.376"},
{d:17,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Contribuintes e Responsáveis. Sujeito passivo. Solidariedade",arts:"Lei 7.014/96 Arts. 9–16 · LC 87/96 Arts. 4–6",ancora:"art. 9 · art. 11 · art. 12 · art. 13",juri:"STF RE 781.926 · STJ Súm. 432 · STF ADI 1.945"},
{d:18,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Base de Cálculo: regra geral, inclusão do ICMS, importação, casos especiais",arts:"Lei 7.014/96 Arts. 17–32 · LC 87/96 Arts. 8–13",ancora:"art. 17 · art. 18 · art. 19 · art. 24",juri:"STF RE 212.209 (cálculo por dentro) · STJ Súm. 68 · STF RE 274.639"},
{d:19,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Alíquotas: internas BA, interestaduais, DIFAL (EC 87/15). Res. SF 13/12",arts:"Lei 7.014/96 Arts. 33–40 · CF/88 Art. 155, §2º, IV–V · Res. SF 13/12",ancora:"art. 33 · art. 34 · art. 155, §2º, IV CF · Res. SF 13 art. 1",juri:"STF ADI 4.628 (Protocolo 21/11 inconstitucional) · STF RE 1.287.019 · STF ADI 7.158 (DIFAL só 2023)"},
{d:20,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Substituição Tributária: para frente, concomitante, MVA. Cálculo do ICMS-ST",arts:"Lei 7.014/96 Arts. 9–16 · LC 87/96 Arts. 6–10",ancora:"art. 9 Lei 7014 · art. 6 LC 87 · art. 8 LC 87 · art. 10 LC 87",juri:"STF RE 213.396 · STF ADI 1.851 (overruled) · STF RE 593.849 (restituição BC real < presumida — PONTO CERTO FGV)"},
{d:21,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:22,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Crédito Fiscal: direito ao crédito, vedações, estorno obrigatório e facultativo",arts:"Lei 7.014/96 Arts. 59–78 · LC 87/96 Arts. 19–26",ancora:"art. 59 · art. 62 · art. 65 · art. 20 LC 87 · art. 21 LC 87",juri:"STF RE 161.031 · STJ Súm. 457 · STF RE 635.688 · STJ REsp 1.141.990"},
{d:23,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Crédito Presumido, Transferência de Crédito e Saldo Credor Acumulado",arts:"Lei 7.014/96 Arts. 78–95",ancora:"art. 78 · art. 83 · art. 84 · art. 88",juri:"STF ADI 3.796 (vedação sem CONFAZ) · STF ADI 4.481 · STF RE 851.421"},
{d:24,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Obrigações Acessórias: NF-e, EFD-ICMS/IPI, SPED. Prazo e responsabilidade",arts:"Lei 7.014/96 Arts. 96–120",ancora:"art. 96 · art. 97 · art. 100 · art. 104",juri:"STJ REsp 1.705.920 · STF RE 760.931 · STJ Súm. 360"},
{d:25,mat:"LE",assunto:"Leg. Estadual BA",tema:"ICMS/BA — Infrações e Penalidades. Processo Administrativo Fiscal da Bahia (PAF-BA)",arts:"Lei 7.014/96 Arts. 121–155 · Dec. 7.629/99 Arts. 1–20",ancora:"art. 121 · art. 124 · art. 130 · art. 142",juri:"STF Súm. Vinc. 21 · STJ Súm. 565 · STF RE 640.452"},
{d:26,mat:"LE",assunto:"Leg. Estadual BA",tema:"ITCD — Fato gerador, BC, alíquotas, obrigações. Lei 4.826/03",arts:"Lei 4.826/03 Arts. 1–30",ancora:"art. 1 · art. 3 · art. 7 · art. 10 · art. 13",juri:"STF RE 562.045 (progressividade constitucional) · STF Súm. 331 · STF RE 851.108"},
{d:27,mat:"LE",assunto:"Leg. Estadual BA",tema:"IPVA — Fato gerador, base de cálculo, alíquotas, isenções. Lei 6.348/91",arts:"Lei 6.348/91 Arts. 1–25",ancora:"art. 1 · art. 2 · art. 5 · art. 8 · art. 10",juri:"STF RE 1.016.605 · STF Súm. 585"},
{d:28,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:29,mat:"LE",assunto:"Leg. Estadual BA",tema:"LC 87/96 (Lei Kandir) — Estrutura completa: incidência, não-incidência, BC, alíquota, crédito",arts:"LC 87/96 Arts. 1–34",ancora:"art. 2 · art. 3 · art. 8 · art. 19 · art. 20 · art. 21",juri:"STF ADC 49 (sem ICMS em transferências entre estabelecimentos do mesmo titular) · STF RE 748.543"},
{d:30,mat:"RE",assunto:"Revisão",tema:"🔁 REVISÃO FASE 01 — Simulado 30 questões: CTN + CF + ICMS/BA + ITCD + IPVA",arts:"CTN 1–182 · Lei 7.014/96 1–95 · CF/88 145–162",ancora:"Pontos críticos · Pegadinhas FGV",juri:""},
{d:31,mat:"CO",assunto:"Contabilidade Geral",tema:"Balanço Patrimonial — Ativo, Passivo e PL. Grupos e subgrupos. Lei 6.404/76",arts:"Lei 6.404/76 Arts. 176–188 · NBC TG 26 Itens 54–76",ancora:"art. 179 · art. 180 · art. 181 · art. 182",juri:"STJ REsp 1.464.711 · STJ REsp 1.221.170 · STF RE 583.955"},
{d:32,mat:"CO",assunto:"Contabilidade Geral",tema:"DRE — Receitas, custos e despesas. Resultado do exercício. Reconhecimento (CPC 47)",arts:"Lei 6.404/76 Arts. 187–189 · CPC 47 Itens 1–50",ancora:"art. 187 · art. 188 · CPC 47 item 31 · item 35",juri:"STF RE 949.297 (IRPJ/CSLL com base no lucro real)"},
{d:33,mat:"CO",assunto:"Contabilidade Geral",tema:"Estoques — Custo de aquisição, PEPS, Custo Médio, NRV. Variações de estoque (CPC 16)",arts:"CPC 16 Itens 1–40 · Lei 6.404/76 Art. 183, II",ancora:"CPC 16 item 10 · item 25 · item 28 · art. 183 II",juri:"STF RE 592.616 (UEPS não aceito pelo Fisco)"},
{d:34,mat:"CO",assunto:"Contabilidade Geral",tema:"Ativo Imobilizado — Reconhecimento, mensuração, depreciação, baixas (CPC 27)",arts:"CPC 27 Itens 1–62 · Lei 6.404/76 Art. 183, V",ancora:"CPC 27 item 6 · item 30 · item 43 · art. 183 V",juri:"STJ REsp 1.112. (depreciação contábil ≠ fiscal) · STF RE 588.322"},
{d:35,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:36,mat:"CO",assunto:"Contabilidade Geral",tema:"Patrimônio Líquido — Capital social, reservas de capital, reservas de lucros, ajustes de avaliação",arts:"Lei 6.404/76 Arts. 182–200",ancora:"art. 182 · art. 182-A · art. 187 · art. 193 · art. 195",juri:"STF RE 445.134 (ajustes PL não tributáveis até realização)"},
{d:37,mat:"CO",assunto:"Contabilidade Geral",tema:"DFC — Método direto e indireto. Atividades operacionais, de investimento e de financiamento (CPC 03)",arts:"CPC 03 Itens 1–55 · Lei 6.404/76 Art. 188, I",ancora:"CPC 03 item 18 · item 20 · item 38",juri:"STJ (DFC obrigatória para grandes companhias desde Lei 11.638/07)"},
{d:38,mat:"CO",assunto:"Contabilidade Geral",tema:"Provisões, Passivos e Ativos Contingentes — Reconhecimento e mensuração (CPC 25)",arts:"CPC 25 Itens 1–63 · Lei 6.404/76 Art. 183, §2º",ancora:"CPC 25 item 14 · item 27 · item 31 · item 86",juri:"STF RE 614.464 (PDD dedutível conforme Lei 9.430/96)"},
{d:39,mat:"CO",assunto:"Contabilidade Avançada",tema:"AVP (CPC 12) — Ajuste a valor presente: conceito, taxa de desconto, reconhecimento",arts:"CPC 12 Itens 1–30 · Lei 6.404/76 Art. 183, VIII",ancora:"CPC 12 item 4 · item 9 · item 17 · art. 183 VIII",juri:"STJ REsp 1.221.AVP · STF RE 591.033"},
{d:40,mat:"CO",assunto:"Contabilidade Avançada",tema:"AVJ (CPC 46) — Valor justo: definição, hierarquia (Nível 1, 2, 3), mensuração",arts:"CPC 46 Itens 1–50",ancora:"CPC 46 item 9 · item 24 · item 72 · item 86",juri:"STF RE 627.543 (ajustes a valor justo integram BC do IRPJ na realização)"},
{d:41,mat:"CO",assunto:"Contabilidade Avançada",tema:"Operações com Mercadorias — CMV, escrituração, inventário permanente e periódico",arts:"Lei 6.404/76 Arts. 183–187 · NBC TG 16 Itens 1–40",ancora:"art. 183 II · NBC TG 16 item 25 · item 28",juri:"STJ REsp 1.111.CMV · STJ Súm. 281"},
{d:42,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:43,mat:"AF",assunto:"AFO",tema:"Orçamento Público — Princípios orçamentários, tipos, ciclo. PPA, LDO, LOA (CF arts. 165–169)",arts:"CF/88 Arts. 165–169 · Lei 4.320/64 Arts. 1–15",ancora:"art. 165 CF · art. 166 CF · art. 167 CF · art. 2 Lei 4.320",juri:"STF ADI 4.048 · STF ADPF 45 (orçamento não é peça de ficção)"},
{d:44,mat:"AF",assunto:"AFO",tema:"Receita Pública — Conceito, classificações orçamentária e econômica. Estágios da receita",arts:"Lei 4.320/64 Arts. 51–73 · MCASP Cap. 2",ancora:"art. 51 · art. 52 · art. 53 · art. 57",juri:"TCU Acórdão 825/2015"},
{d:45,mat:"AF",assunto:"AFO",tema:"Despesa Pública — Classificação funcional e por natureza. Estágios: empenho, liquidação, pagamento",arts:"Lei 4.320/64 Arts. 58–93",ancora:"art. 58 · art. 60 · art. 62 · art. 63 · art. 64",juri:"STF ADI 2.925 · STF RE 705.423 (empenho é pressuposto)"},
{d:46,mat:"AF",assunto:"AFO",tema:"Créditos Adicionais — Suplementares, especiais e extraordinários. Fontes de recursos",arts:"Lei 4.320/64 Arts. 40–46",ancora:"art. 40 · art. 41 · art. 42 · art. 43 · art. 44",juri:"STF ADI 1.726 · STF RE 399.371"},
{d:47,mat:"AF",assunto:"AFO",tema:"Lei de Responsabilidade Fiscal — Metas fiscais, resultado primário e nominal. Transparência",arts:"LC 101/00 Arts. 1–17",ancora:"art. 1 · art. 4 · art. 9 · art. 13 · art. 14",juri:"STF ADI 2.238 (LRF constitucional)"},
{d:48,mat:"AF",assunto:"AFO",tema:"LRF — Limites de pessoal (arts. 18–23). Dívida pública e operações de crédito",arts:"LC 101/00 Arts. 18–42",ancora:"art. 18 · art. 19 · art. 20 · art. 29 · art. 30",juri:"STF ADI 3.756 · STF RE 961.263 (regra de ouro) · TCU Acórdão 3.030/2017"},
{d:49,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:50,mat:"DA",assunto:"Dir. Administrativo",tema:"Atos Administrativos — Conceito, elementos, atributos e espécies",arts:"Lei 9.784/99 Arts. 22–30",ancora:"art. 22 · art. 26 · art. 27 · art. 29",juri:"STF Súm. 473 (autotutela) · STF MS 24.073 · STF RE 632.853"},
{d:51,mat:"DA",assunto:"Dir. Administrativo",tema:"Poderes da Administração — Vinculado, discricionário, hierárquico, disciplinar, regulamentar, de polícia",arts:"CTN Arts. 194–208 · CF/88 Arts. 84–85",ancora:"art. 78 CTN · art. 84 CF · art. 194 CTN",juri:"STF RE 633.782 · STF Súm. Vinc. 12"},
{d:52,mat:"DA",assunto:"Dir. Administrativo",tema:"Licitações — Lei 14.133/21: princípios, modalidades, fases, dispensa e inexigibilidade",arts:"Lei 14.133/21 Arts. 1–25 · Arts. 72–91",ancora:"art. 5 · art. 6 · art. 17 · art. 20 · art. 28",juri:"STF RE 341.905 · STJ Súm. 333 · STF AP 470"},
{d:53,mat:"DA",assunto:"Dir. Administrativo",tema:"Contratos Administrativos — Cláusulas exorbitantes, equilíbrio econômico-financeiro, rescisão",arts:"Lei 14.133/21 Arts. 92–117",ancora:"art. 92 · art. 99 · art. 104 · art. 108 · art. 112",juri:"STF RE 594.477 · STF ADI 3.735"},
{d:54,mat:"DA",assunto:"Dir. Administrativo",tema:"Agentes Públicos — Espécies. Lei 8.112/90: provimento, direitos, deveres, proibições",arts:"Lei 8.112/90 Arts. 1–30 · CF/88 Arts. 37–41",ancora:"art. 2 · art. 8 · art. 9 · art. 13 · art. 37 CF",juri:"STF Súm. Vinc. 13 (nepotismo — MAIS COBRADO FGV) · STF RE 598.099 · STJ Súm. 266"},
{d:55,mat:"DA",assunto:"Dir. Administrativo",tema:"Controle da Administração — Interno, externo, TCU/TCE. Controle judicial",arts:"CF/88 Arts. 70–75 · Lei 8.443/92 Arts. 1–10",ancora:"art. 70 CF · art. 71 CF · art. 74 CF · art. 75 CF",juri:"STF Súm. Vinc. 37 · STF RE 848.826 · STJ REsp 1.236.controle"},
{d:56,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:57,mat:"DC",assunto:"Dir. Constitucional",tema:"Administração Pública CF/88 — Arts. 37–41: LIMPE, concurso, estabilidade, teto, nepotismo",arts:"CF/88 Arts. 37–41 · Súm. Vinc. 13 e 43",ancora:"art. 37, I · II · XIX · art. 41",juri:"STF Súm. Vinc. 43 · STF RE 589.998 · STF ADI 2.135 · STF RE 638.971"},
{d:58,mat:"DC",assunto:"Dir. Constitucional",tema:"Controle de Constitucionalidade — Concentrado (ADI, ADC, ADPF, ADO) e difuso. Efeitos",arts:"CF/88 Arts. 102–103 · Lei 9.868/99 Arts. 1–28",ancora:"art. 102, I, a CF · art. 103 CF · art. 10 Lei 9868 · art. 27 Lei 9868",juri:"STF ADI 3.522 (modulação) · STF ADPF 132 · STF RE 197.917 · STF MS 26.604"},
{d:59,mat:"DC",assunto:"Dir. Constitucional",tema:"Poder Judiciário e MP — Organização, STF, STJ, competências. Garantias do MP",arts:"CF/88 Arts. 92–135",ancora:"art. 92 CF · art. 102 CF · art. 105 CF · art. 127 CF · art. 129 CF",juri:"STF RE 405.579 · STF ADI 4.811 · STF RE 593.727 · STJ REsp 1.696.396"},
{d:60,mat:"RE",assunto:"Revisão",tema:"🔁 REVISÃO FASE 02 — Simulado 50 questões mistas: CO + AFO + Dir. Adm. + Dir. Const.",arts:"Todas as matérias da Fase 02",ancora:"Pontos críticos · Pegadinhas FGV",juri:""},
{d:61,mat:"DT",assunto:"Dir. Tributário",tema:"2ª Leitura CTN Arts. 1–95 — Normas gerais, vigência, interpretação e integração",arts:"CTN Arts. 1–95",ancora:"art. 3 · art. 97 · art. 100 · art. 108",juri:"STF RE 343.446 · STJ (norma complementar e boa-fé) · STF ADI 2.556"},
{d:62,mat:"DT",assunto:"Dir. Tributário",tema:"2ª Leitura CTN Arts. 96–218 — Administração tributária, fiscalização, sigilo, certidões",arts:"CTN Arts. 96–218",ancora:"art. 196 · art. 197 · art. 198 · art. 201 · art. 205",juri:"STF RE 389.808 · STJ REsp 1.134.257 · STJ Súm. 446"},
{d:63,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:64,mat:"LE",assunto:"Leg. Estadual BA",tema:"2ª Leitura ICMS — Lei 7.014/96 Arts. 1–60: fato gerador, BC e alíquotas consolidados",arts:"Lei 7.014/96 Arts. 1–60",ancora:"art. 2 · art. 3 · art. 17 · art. 33 · art. 59",juri:"STF ADC 49 · STF RE 781.926 · STJ Súm. 457"},
{d:65,mat:"LE",assunto:"Leg. Estadual BA",tema:"2ª Leitura ICMS — Lei 7.014/96 Arts. 61–155: crédito, obrigações, infrações",arts:"Lei 7.014/96 Arts. 61–155",ancora:"art. 62 · art. 65 · art. 78 · art. 97 · art. 121",juri:"STF RE 635.688 · STF ADI 3.796 · STJ REsp 1.705.920"},
{d:66,mat:"LE",assunto:"Leg. Estadual BA",tema:"2ª Leitura LC 87/96 — Lei Kandir completa: estrutura e divergências com Lei 7.014/96",arts:"LC 87/96 Arts. 1–34",ancora:"art. 2 · art. 3 · art. 6 · art. 8 · art. 19 · art. 21",juri:"STF ADC 49 + LC 204/2023 · STF RE 539.130 · STJ REsp 1.125.416"},
{d:67,mat:"CO",assunto:"Contabilidade",tema:"2ª Leitura CPCs críticos FGV: CPC 03, 16, 25, 27, 46, 47. Questões comentadas",arts:"CPC 03 + CPC 16 + CPC 25 + CPC 27 + CPC 46 + CPC 47",ancora:"CPC 16 item 25 · CPC 25 item 14 · CPC 27 item 43 · CPC 47 item 31",juri:"STF RE 949.297 · STJ REsp 1.221.170"},
{d:68,mat:"CO",assunto:"Contabilidade Avançada",tema:"Combinações de Negócios (CPC 15) — Método de aquisição, ágio, goodwill",arts:"CPC 15 Itens 1–30",ancora:"CPC 15 item 4 · item 18 · item 32",juri:"STJ REsp 1.818. (goodwill = impairment anual) · STF RE 583.955 (ágio fiscal 60 meses)"},
{d:69,mat:"CO",assunto:"Contabilidade Avançada",tema:"Equivalência Patrimonial (CPC 18 e CPC 36) — Coligadas, controladas, resultado de equivalência",arts:"CPC 18 Itens 1–25 · Lei 6.404/76 Art. 248",ancora:"art. 248 · CPC 18 item 10 · CPC 36 item 22",juri:"STJ REsp 1.122. (MEP não integra BC do IRPJ) · STF RE 611.586"},
{d:70,mat:"DS",assunto:"",tema:"Descanso",arts:"",ancora:"",juri:""},
{d:71,mat:"AF",assunto:"AFO",tema:"2ª Leitura LRF — LC 101/00 Arts. 1–28: metas, resultado primário, despesa com pessoal",arts:"LC 101/00 Arts. 1–28",ancora:"art. 1 · art. 4 · art. 9 · art. 17 · art. 18 · art. 19",juri:"STF ADI 2.238 · STF RE 591.054 · TCU Acórdão 1.084/2018"},
{d:72,mat:"AF",assunto:"AFO",tema:"Contabilidade Pública — MCASP, PCASP, reconhecimento de receitas e despesas no setor público",arts:"MCASP 9ª ed. Cap. 2–4 · Lei 4.320/64 Arts. 1–115",ancora:"art. 35 Lei 4320 · art. 36 · art. 39",juri:"STF RE 213.739 · TCU Acórdão 825/2015 (PCASP obrigatório)"},
{d:73,mat:"DA",assunto:"Dir. Administrativo",tema:"Improbidade Administrativa — Lei 8.429/92 c/c Lei 14.230/21: atos, sanções, prazo prescricional",arts:"Lei 8.429/92 Arts. 1–12 · Lei 14.230/21 Arts. 1–23",ancora:"art. 9 · art. 10 · art. 11 · art. 12",juri:"STF AP 470 · STF RE 852.475 (ressarcimento imprescritível) · STJ REsp 1.802. · STF RE 976.566"},
{d:74,mat:"DA",assunto:"Dir. Administrativo",tema:"Processo Administrativo — Lei 9.784/99: princípios, competência, forma, prazos, recursos",arts:"Lei 9.784/99 Arts. 1–69",ancora:"art. 2 · art. 3 · art. 26 · art. 56 · art. 59",juri:"STF Súm. Vinc. 21 · STJ REsp 1.148.343 · STF RE 388.359"},
{d:75,mat:"DC",assunto:"Dir. Constitucional",tema:"Direitos e Garantias Fundamentais — Art. 5º CF: rol, remédios constitucionais",arts:"CF/88 Art. 5º",ancora:"art. 5, LXIX · LXX · LXXI · LXXIII",juri:"STF RE 592.581 · STF Súm. 271 · STF RE 906.400 · STF Súm. Vinc. 28"},
{d:76,mat:"RE",assunto:"Revisão",tema:"🔁 SIMULADO COMPLETO 01 — 100 questões FGV. Cronometrado (4h). Todas as matérias",arts:"Todas as matérias",ancora:"Estilo real FGV · Gestão de tempo",juri:""},
{d:77,mat:"DS",assunto:"",tema:"Descanso — Análise detalhada do simulado 01",arts:"",ancora:"",juri:""},
{d:78,mat:"DT",assunto:"Revisão Final",tema:"RF CTN — Súmulas STF tributárias: 112, 213, 436, 582. STJ: REsp repetitivos tributários",arts:"CTN pontos âncora · Súm. STF 112, 213, 436",ancora:"Súm. STF 112 · 213 · 436 · 582",juri:"STF Súm. 436 · STJ Súm. 213 · STF Súm. 112 · STF Súm. 582"},
{d:79,mat:"LE",assunto:"Revisão Final",tema:"RF ICMS/BA — Mapa dos artigos mais cobrados. Não-incidência vs isenção. ADC 49",arts:"Lei 7.014/96 + LC 87/96 arts. âncora",ancora:"art. 5 Lei 7014 · art. 3 LC 87 · art. 19 LC 87 · art. 21 LC 87",juri:"STF ADC 49 · STF RE 593.849 · STF ADI 7.158"},
{d:80,mat:"CO",assunto:"Revisão Final",tema:"RF Contabilidade — Fórmulas de BP, DRE e DFC. CPCs críticos. Mapa mental integrado",arts:"Lei 6.404/76 Arts. 176–200 · CPCs Resumo final",ancora:"CPC 16 item 25 · CPC 25 item 14 · CPC 46 item 9 · CPC 47 item 31",juri:"STF RE 949.297 · STJ REsp 1.122.MEP · STF RE 583.955"},
{d:81,mat:"AF",assunto:"Revisão Final",tema:"RF AFO — Princípios orçamentários, LRF limites, MCASP. Tabela-resumo receita e despesa",arts:"CF/88 Arts. 165–169 · LC 101/00 arts. chave",ancora:"art. 167 CF · art. 19 LC 101 · art. 41 Lei 4320 · art. 58 Lei 4320",juri:"STF ADI 2.238 · STF RE 961.263 · TCU (PCASP obrigatório)"},
{d:82,mat:"DA",assunto:"Revisão Final",tema:"RF Dir. Adm. + DC — Atos, licitações, agentes, art. 37 CF. Súmulas Vinculantes selecionadas",arts:"CF/88 Arts. 37–41 · Lei 14.133/21 Pontos críticos",ancora:"Súm. Vinc. 13 · Súm. Vinc. 43 · art. 37 CF · art. 41 CF",juri:"STF Súm. Vinc. 13 · STF RE 598.099 · STF Súm. Vinc. 43"},
{d:83,mat:"RE",assunto:"Revisão",tema:"🔁 SIMULADO COMPLETO 02 — 100 questões. Foco nas matérias de maior peso no edital SEFAZ-BA",arts:"Todas as matérias",ancora:"Pesos edital SEFAZ-BA · Estilo real FGV",juri:""},
{d:84,mat:"DS",assunto:"",tema:"Descanso — Análise e correção do simulado 02",arts:"",ancora:"",juri:""},
{d:85,mat:"DT",assunto:"Reta Final",tema:"⚡ RETA FINAL DT — CTN: pontos mais errados nos simulados. Revisão cirúrgica",arts:"CTN arts. críticos",ancora:"art. 142 · art. 150 · art. 156 · art. 173 · art. 174",juri:"STF RE 556.664 · STF Súm. 436 · STJ REsp 1.101.728"},
{d:86,mat:"LE",assunto:"Reta Final",tema:"⚡ RETA FINAL LE — ICMS/BA: artigos âncora. ST e crédito fiscal — pontos mais cobrados FGV",arts:"Lei 7.014/96 arts. âncora",ancora:"art. 3 · art. 17 · art. 59 · art. 62 · art. 65",juri:"STF ADC 49 · STF RE 593.849 · STF ADI 7.158"},
{d:87,mat:"CO",assunto:"Reta Final",tema:"⚡ RETA FINAL CO — Checklist CPCs. Fórmulas e macetes. Questões relâmpago 20 itens",arts:"CPCs resumo geral",ancora:"CPC 03 · CPC 16 · CPC 25 · CPC 27 · CPC 46 · CPC 47",juri:"STF RE 949.297 · STJ (MEP) · STF RE 583.955"},
{d:88,mat:"AF",assunto:"Reta Final",tema:"⚡ RETA FINAL AFO — Lei 4.320/64 + LRF: mapa visual de receita, despesa, créditos adicionais",arts:"Lei 4.320/64 arts. chave · LC 101/00 arts. chave",ancora:"art. 41 · art. 42 · art. 58 · art. 62 · art. 19 LC 101",juri:"STF ADPF 45 · STF ADI 1.726 · TCU Acórdão 3.030/2017"},
{d:89,mat:"RE",assunto:"Reta Final",tema:"🎯 SIMULADO FINAL — 60 questões. Estratégia de prova: ordem, tempo, gestão de itens difíceis",arts:"Todas as matérias",ancora:"Gestão de 4h · Ordem de resolução",juri:"ADC 49 + RE 593.849 + ADI 7.158 (trio ICMS) · Súm. 436 + REsp 1.101.728 (CTN)"},
{d:90,mat:"RE",assunto:"Reta Final",tema:"✅ VÉSPERA DE PROVA — Leitura dos artigos âncora, mapas mentais, descanso às 16h. Você chegou!",arts:"Artigos âncora",ancora:"Confiança · Foco · Você está pronta!",juri:"ADC 49 · RE 593.849 · ADI 7.158 · Súm. 436 · REsp 1.101.728 · Súm. Vinc. 13 · RE 598.099"},
];

const MAT_COR_SESSAO = {
  DT:"#F9C231", LE:"#FDBA74", CO:"#68D391",
  AF:"#8BA7BF", DA:"#00A65A", DC:"#8BA7BF",
  RE:"#FCA5A5", DS:"rgba(255,255,255,0.15)"
};
const MAT_NOME_SESSAO = {
  DT:"Direito Tributário", LE:"Legislação Estadual BA — ICMS/BA · Lei 7.014/96 · LC 87/96",
  CO:"Contabilidade Geral e Avançada — CPC · Lei 6.404/76",
  AF:"Administração Financeira e Orçamentária — AFO · LRF · Lei 4.320/64",
  DA:"Direito Administrativo", DC:"Direito Constitucional",
  RE:"Revisão/Simulado", DS:"Descanso"
};

function getDiaAtual() {
  const hoje = new Date();
  const inicio = new Date("2026-06-29T00:00:00-03:00");
  const diffMs = hoje - inicio;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dia = diffDias + 1;
  if (dia < 1) return 1;
  if (dia > 90) return 90;
  return dia;
}

function getRevisoesHoje(diaAtual) {
  const revisoes = [];
  CRONOGRAMA_90.forEach(d => {
    if (d.mat === "DS" || d.mat === "RE") return;
    const r1 = d.d + 1;
    const r2 = d.d + 7;
    const r3 = d.d + 30;
    if (r1 === diaAtual) revisoes.push({ tipo: "R1", dia: d, label: "Revisão 24h" });
    if (r2 === diaAtual) revisoes.push({ tipo: "R2", dia: d, label: "Revisão 7 dias" });
    if (r3 === diaAtual) revisoes.push({ tipo: "R3", dia: d, label: "Revisão 30 dias" });
  });
  return revisoes;
}

// ─── COMPONENTE: TELA SESSÃO DO DIA ──────────────────────────────────────────
function TelaSessaoDia({ isMobile, online, user }) {
  const diaAtual = getDiaAtual();
  const dadosDia = CRONOGRAMA_90.find(d => d.d === diaAtual) || CRONOGRAMA_90[0];
  const revisoes = getRevisoesHoje(diaAtual);

  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sessaoIniciada, setSessaoIniciada] = useState(false);
  const [diaEscolhido, setDiaEscolhido] = useState(diaAtual);
  const [dadosEscolhidos, setDadosEscolhidos] = useState(dadosDia);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  function buildSystemPrompt(d) {
    const matNome = MAT_NOME_SESSAO[d.mat] || d.assunto;
    return `Você é o maior especialista do Brasil em ${matNome} para concursos públicos de Auditor Fiscal — especificamente para a banca FGV e o edital SEFAZ-BA.

Não é um professor genérico: você passou os últimos 20 anos analisando padrões de questões FGV, pegadinhas recorrentes e os artigos mais cobrados nessa banca específica.

CONTEXTO DA SESSÃO DE HOJE:
• Dia do cronograma: ${d.d} de 90
• Tema: ${d.tema}
• Artigos: ${d.arts || "—"}
• Dispositivos âncora FGV: ${d.ancora || "—"}
• Jurisprudência prioritária: ${d.juri || "—"}
• Tempo disponível: 3 horas

MÉTODO DE ENSINO — siga SEMPRE esta ordem em cada bloco:
1. Explique o conceito com uma analogia do cotidiano (como se a pessoa tivesse 15 anos).
2. Mostre como isso aparece numa questão FGV real.
3. Destaque a pegadinha FGV desse ponto.
4. No fim do bloco, peça para o aluno te explicar o conceito com as próprias palavras.

FEEDBACK SOCRÁTICO:
- Se acertar: confirme e aprofunde.
- Se errar: NÃO dê a resposta. Dê uma pista. Só revele na terceira tentativa.

FECHAMENTO DE BLOCO:
1. Resumo em tópicos (estilo ficha de revisão FGV).
2. 1 questão inédita no estilo FGV sobre o ponto mais cobrado.
3. Pergunte se quer continuar ou revisar.

FEYNMAN — quando o aluno disser "Feynman":
1. Peça para fechar tudo.
2. Peça para explicar sem consultar nada.
3. Enquanto explica: se travar, anote; se errar, deixe terminar; se usar jargão, pergunte o significado.
4. Ao final: relatório com o que acertou, onde travou (lacuna de memória) e onde errou (lacuna de compreensão) + questão FGV mais provável sobre o ponto de travamento.

Seja direto, preciso e calibrado para a banca FGV. Comece com o DIAGNÓSTICO: faça exatamente 3 perguntas para entender o nível atual do aluno nesse tema antes de ensinar qualquer coisa.`;
  }

  async function iniciarSessao(d) {
    if (!online) return;
    setEnviando(true);
    setSessaoIniciada(true);
    setMsgs([]);
    try {
      const system = buildSystemPrompt(d);
      const res = await callClaude(system, "Iniciar sessão de hoje.", 1000);
      setMsgs([{ role: "assistant", content: res }]);
    } catch(e) {
      setMsgs([{ role: "assistant", content: "⚠️ Erro ao conectar com o assistente. Verifique sua conexão." }]);
    }
    setEnviando(false);
  }

  async function enviarMsg() {
    if (!input.trim() || enviando || !online) return;
    const novaMsg = { role: "user", content: input.trim() };
    const novasMsgs = [...msgs, novaMsg];
    setMsgs(novasMsgs);
    setInput("");
    setEnviando(true);
    try {
      const system = buildSystemPrompt(dadosEscolhidos);
      const histUser = novasMsgs.filter(m => m.role === "user").map(m => m.content).join("\n\n---\n\n");
      const histAll = novasMsgs.map(m => `${m.role === "user" ? "ALUNO" : "PROFESSOR"}: ${m.content}`).join("\n\n");
      const res = await callClaude(system, histAll, 1200);
      setMsgs(m => [...m, { role: "assistant", content: res }]);
    } catch(e) {
      setMsgs(m => [...m, { role: "assistant", content: "⚠️ Erro ao processar sua mensagem." }]);
    }
    setEnviando(false);
  }

  const corMat = MAT_COR_SESSAO[dadosEscolhidos.mat] || "#8BA7BF";
  const isDescanso = dadosEscolhidos.mat === "DS";
  const isSimulado = dadosEscolhidos.mat === "RE";

  return (
    <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", height:"100%" }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#050D17 0%,#08170A 60%,#0A1628 100%)`, borderBottom:`1px solid rgba(255,255,255,0.07)`, padding:isMobile?"12px 14px":"16px 28px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:T.verde2, marginBottom:3 }}>🧠 Sessão do Dia</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?17:20, fontWeight:900, color:"#fff", lineHeight:1.2 }}>
              Dia {dadosEscolhidos.d} <span style={{ color:corMat }}>· {dadosEscolhidos.assunto || dadosEscolhidos.mat}</span>
            </h2>
          </div>
          {/* Seletor de dia */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:T.cinza3 }}>Dia:</span>
            <select value={diaEscolhido} onChange={e => {
              const nd = parseInt(e.target.value);
              setDiaEscolhido(nd);
              const novo = CRONOGRAMA_90.find(d => d.d === nd) || CRONOGRAMA_90[0];
              setDadosEscolhidos(novo);
              setSessaoIniciada(false);
              setMsgs([]);
            }} style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:7, color:T.branco, fontSize:12, padding:"5px 9px", cursor:"pointer" }}>
              {CRONOGRAMA_90.map(d => (
                <option key={d.d} value={d.d}>
                  {String(d.d).padStart(2,"0")} — {d.mat === "DS" ? "Descanso" : d.tema.substring(0,40)+"..."}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dados do dia */}
        {!isDescanso && (
          <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
            {dadosEscolhidos.arts && (
              <div style={{ background:"rgba(0,107,63,0.12)", border:"1px solid rgba(0,107,63,0.25)", borderRadius:7, padding:"4px 10px", fontSize:11, color:T.verde3 }}>
                📖 {dadosEscolhidos.arts}
              </div>
            )}
            {dadosEscolhidos.ancora && (
              <div style={{ background:"rgba(249,194,49,0.08)", border:"1px solid rgba(249,194,49,0.22)", borderRadius:7, padding:"4px 10px", fontSize:11, color:T.amarelo }}>
                ⭐ {dadosEscolhidos.ancora}
              </div>
            )}
          </div>
        )}
        {dadosEscolhidos.juri && (
          <div style={{ marginTop:6, background:"rgba(104,211,145,0.05)", border:"1px solid rgba(104,211,145,0.15)", borderLeft:`3px solid rgba(104,211,145,0.4)`, borderRadius:"0 7px 7px 0", padding:"5px 10px", fontSize:11, color:T.verde3 }}>
            ⚖️ {dadosEscolhidos.juri}
          </div>
        )}

        {/* Revisões de hoje */}
        {revisoes.length > 0 && (
          <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap" }}>
            {revisoes.map((r,i) => (
              <div key={i} style={{ background:"rgba(229,62,62,0.10)", border:"1px solid rgba(229,62,62,0.28)", borderRadius:100, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#FCA5A5", cursor:"pointer" }}
                onClick={() => {
                  setDiaEscolhido(r.dia.d);
                  setDadosEscolhidos(r.dia);
                  setSessaoIniciada(false);
                  setMsgs([]);
                }}>
                🔁 {r.label}: Dia {r.dia.d} · {r.dia.assunto}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corpo */}
      {!sessaoIniciada ? (
        /* Tela inicial */
        <div style={{ flex:1, overflow:"auto", padding:isMobile?"16px":"28px 36px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {isDescanso ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>😴</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", marginBottom:8 }}>Dia de Descanso</h3>
              <p style={{ color:T.cinza3, fontSize:14 }}>Recuperação é parte do método. Use o seletor acima para estudar outro dia se quiser.</p>
            </div>
          ) : isSimulado ? (
            <div style={{ textAlign:"center", maxWidth:500 }}>
              <div style={{ fontSize:56, marginBottom:14 }}>🎯</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#fff", marginBottom:8 }}>{dadosEscolhidos.tema}</h3>
              <p style={{ color:T.cinza3, fontSize:13, lineHeight:1.7, marginBottom:20 }}>
                Nos dias de revisão e simulado, faça o simulado sem auxílio. Use o assistente abaixo <strong style={{color:"#fff"}}>apenas para corrigir erros depois</strong>: <em>"Errei esta questão. Me dê uma pista para eu entender onde errei, sem revelar a resposta."</em>
              </p>
              <button onClick={() => iniciarSessao(dadosEscolhidos)} disabled={!online} className="btn" style={{
                background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
                padding:"12px 28px", borderRadius:10, fontWeight:700, fontSize:14,
                opacity:!online?0.5:1, cursor:!online?"not-allowed":"pointer"
              }}>
                🤖 Abrir Corretor de Erros
              </button>
            </div>
          ) : (
            <div style={{ textAlign:"center", maxWidth:520 }}>
              <div style={{ fontSize:52, marginBottom:14 }}>🧠</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, color:"#fff", marginBottom:6, lineHeight:1.3 }}>
                {dadosEscolhidos.tema}
              </h3>
              <p style={{ color:T.cinza3, fontSize:13, lineHeight:1.7, marginBottom:22 }}>
                O assistente já sabe o tema, os artigos, os âncoras e a jurisprudência do dia. Clique em Iniciar e ele começa pelo Diagnóstico — 3 perguntas para calibrar o ensino ao seu nível atual.
              </p>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => iniciarSessao(dadosEscolhidos)} disabled={!online || enviando} className="btn" style={{
                  background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
                  padding:"13px 32px", borderRadius:10, fontWeight:800, fontSize:15,
                  opacity:!online||enviando?0.5:1, cursor:!online||enviando?"not-allowed":"pointer",
                  boxShadow:`0 6px 24px rgba(0,107,63,0.3)`
                }}>
                  {enviando ? "⏳ Iniciando…" : "🚀 Iniciar Sessão de Hoje"}
                </button>
              </div>
              {!online && <p style={{ color:"#FCD34D", fontSize:12, marginTop:12 }}>📡 Sem conexão — o assistente requer internet.</p>}
            </div>
          )}
        </div>
      ) : (
        /* Chat */
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Mensagens */}
          <div ref={chatRef} style={{ flex:1, overflow:"auto", padding:isMobile?"12px":"20px 28px", display:"flex", flexDirection:"column", gap:12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start"
              }}>
                <div style={{
                  maxWidth:"82%", padding:"11px 15px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  background:m.role==="user"?`linear-gradient(135deg,${T.verde},${T.verde2})`:`${T.fundo3}`,
                  border:m.role==="user"?"none":`1px solid ${T.borda2}`,
                  color:m.role==="user"?"#fff":T.branco,
                  fontSize:isMobile?12.5:13, lineHeight:1.75,
                  whiteSpace:"pre-wrap", wordBreak:"break-word"
                }}>
                  {m.role==="assistant" && <div style={{ fontSize:10, fontWeight:700, color:T.verde2, marginBottom:4, textTransform:"uppercase", letterSpacing:.8 }}>🧠 Assistente</div>}
                  {m.content}
                </div>
              </div>
            ))}
            {enviando && (
              <div style={{ display:"flex", justifyContent:"flex-start" }}>
                <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:"14px 14px 14px 4px", padding:"11px 15px", fontSize:12, color:T.cinza3 }}>
                  ⏳ Pensando…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding:isMobile?"10px 12px":"14px 24px", borderTop:`1px solid ${T.borda2}`, background:T.fundo2, flexShrink:0 }}>
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", maxWidth:800, margin:"0 auto" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); enviarMsg(); }}}
                placeholder='Digite sua resposta… (Enter para enviar · Shift+Enter para nova linha) · Diga "Feynman" nos últimos 10 min'
                rows={2}
                style={{
                  flex:1, background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:10,
                  padding:"10px 13px", color:T.branco, fontSize:13, outline:"none",
                  lineHeight:1.6, resize:"none"
                }}
              />
              <button onClick={enviarMsg} disabled={!input.trim()||enviando||!online} className="btn" style={{
                background:!input.trim()||enviando||!online?T.fundo3:`linear-gradient(135deg,${T.verde},${T.verde2})`,
                color:!input.trim()||enviando||!online?T.cinza3:"#fff",
                padding:"10px 16px", borderRadius:10, fontWeight:700, fontSize:13,
                border:`1px solid ${T.borda2}`, cursor:!input.trim()||enviando||!online?"not-allowed":"pointer",
                flexShrink:0, alignSelf:"flex-end"
              }}>
                {enviando ? "⏳" : "➤"}
              </button>
            </div>
            <div style={{ textAlign:"center", marginTop:6 }}>
              <button onClick={() => { setSessaoIniciada(false); setMsgs([]); }} className="btn" style={{
                background:"transparent", border:"none", color:T.cinza3, fontSize:11, cursor:"pointer", textDecoration:"underline"
              }}>
                ← Nova sessão / Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


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

    // 0. Texto embutido (sempre disponível offline)
    const textoEmbutido = TEXTOS_EMBUTIDOS[lei.id];
    if (textoEmbutido) {
      setTextoLei(textoEmbutido);
      setCarregando(false);
      setStats(s => ({ ...s, leituras:{ ...s.leituras, [lei.id]:(s.leituras[lei.id]||0)+1 }, pontos:s.pontos+10 }));
      return;
    }

    // 1. Cache local (offline imediato)
    const cachedLocal = getCacheTexto(lei.id);
    if (cachedLocal) { setTextoLei(cachedLocal); setCarregando(false); }
    if (!online) { if (!cachedLocal) setTextoLei("<p style=\"color:#FCA5A5\">⚠️ Sem conexão e sem cache.</p>"); setCarregando(false); return; }

    // 2. Cache compartilhado Supabase (gerado por qualquer membro do grupo)
    const cachedSupabase = await getCacheLei(lei.id);
    if (cachedSupabase) {
      setTextoLei(cachedSupabase);
      setCacheTexto(lei.id, cachedSupabase); // salva local tb
      setStats(s => ({ ...s, leituras:{ ...s.leituras, [lei.id]:(s.leituras[lei.id]||0)+1 }, pontos:s.pontos+10 }));
      setCarregando(false);
      return;
    }

    // 3. Proxy serverless — busca texto direto do Planalto/SEFAZ-BA
    try {
      const proxyUrl = "/api/lei?url=" + encodeURIComponent(lei.url);
      const r = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(r.status);
      const textoRaw = await r.text();
      const linhas = textoRaw.split("\n").filter(l => l.trim());
      const html = linhas.map(l => {
        const t = l.trim();
        if (/^(CAPÍTULO|TÍTULO|SEÇÃO|SUBSEÇÃO|LIVRO|DISPOSIÇÃO)/i.test(t)) return "<h2>" + t + "</h2>";
        if (/^Art\.\s*\d+/i.test(t)) return "<p><strong>" + t.substring(0,14) + "</strong>" + t.substring(14) + "</p>";
        if (t.length > 0) return "<p>" + t + "</p>";
        return "";
      }).join("");
      const textoFinal = html || "<p>" + textoRaw + "</p>";
      setTextoLei(textoFinal);
      setCacheTexto(lei.id, textoFinal);
      // Salva no Supabase para todo o grupo
      await saveCacheLei(lei.id, lei.nome, textoFinal, user?.id);
      setStats(s => ({ ...s, leituras:{ ...s.leituras, [lei.id]:(s.leituras[lei.id]||0)+1 }, pontos:s.pontos+10 }));
    } catch(err) {
      if (!cachedLocal) setTextoLei(
        "<div style=\"padding:16px;background:rgba(249,194,49,0.08);border:1px solid rgba(249,194,49,0.2);border-radius:12px\">" +
        "<p style=\"color:#F9C231;font-weight:700;margin-bottom:8px\">⚠️ Texto não disponível via acesso direto</p>" +
        "<p style=\"color:#8BA7BF;font-size:13px;line-height:1.7\">Configure a API key do Claude nas configurações para gerar o texto via IA, ou acesse:<br><br>" +
        "<a href=\"" + lei.url + "\" target=\"_blank\" style=\"color:#68D391\">" + lei.url + "</a></p></div>"
      );
    }
    setCarregando(false);
  }

  const navItems = [
    { id:"acervo",     icon:"📚", label:"Acervo" },
    { id:"leitura",    icon:"📖", label:"Leitura",    disabled:!leiAtiva },
    { id:"cronograma", icon:"📅", label:"Cronograma" },
    { id:"sessao",     icon:"🧠", label:"Sessão" },
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
          {tela==="cronograma" && <TelaCronograma isMobile={isMobile} online={online} user={user} setTela={setTela} />}
          {tela==="sessao"     && <TelaSessaoDia  isMobile={isMobile} online={online} user={user} />}
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

// ─── COMPONENTE: AUDIO PLAYER ESTILO SPEECHIFY ───────────────────────────────
function AudioPlayer({ texto, lei }) {
  const [status, setStatus]     = useState("idle"); // idle | loading | playing | paused
  const [velocidade, setVel]    = useState(1.0);
  const [voz, setVoz]           = useState("nova");
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro]         = useState("");
  const audioRef                = useRef(null);
  const urlRef                  = useRef(null);

  // Limpa URL do audio ao desmontar
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  // Extrai texto puro do HTML
  function extrairTexto(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText || div.textContent || "";
  }

  // Fallback: Web Speech API (gratuito, voz do browser)
  const synthRef    = useRef(null);
  const containerRef = useRef(null);
  const [palavraAtual, setPalavraAtual] = useState(-1);
  const palavrasRef = useRef([]);

  // Prepara o texto em palavras para destaque
  function prepararPalavras(textoPuro) {
    return textoPuro.split(/(\s+)/).filter(w => w.trim().length > 0);
  }

  function usarWebSpeech(textoPuro) {
    if (!window.speechSynthesis) {
      setErro("Seu browser não suporta síntese de voz.");
      setStatus("idle"); return;
    }
    window.speechSynthesis.cancel();
    setPalavraAtual(-1);
    palavrasRef.current = prepararPalavras(textoPuro);

    const utter = new SpeechSynthesisUtterance(textoPuro);
    utter.lang = "pt-BR";
    utter.rate = velocidade;
    const vozes = window.speechSynthesis.getVoices();
    const vozPT = vozes.find(v => v.lang.startsWith("pt")) || vozes[0];
    if (vozPT) utter.voice = vozPT;

    utter.onstart  = () => setStatus("playing");
    utter.onend    = () => { setStatus("idle"); setProgresso(0); setPalavraAtual(-1); };
    utter.onerror  = () => { setErro("Erro na síntese de voz."); setStatus("idle"); };
    utter.onboundary = (e) => {
      if (e.name === "word" && utter.text.length > 0) {
        // Encontrar índice da palavra pelo charIndex
        const textoAte = textoPuro.substring(0, e.charIndex);
        const palavrasAte = textoAte.split(/\s+/).filter(w => w.length > 0);
        setPalavraAtual(palavrasAte.length - 1);
        setProgresso(Math.round(e.charIndex / utter.text.length * 100));
      }
    };
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
    setModoTTS("web");
  }

  const [modoTTS, setModoTTS] = useState("openai"); // openai | web

  async function gerar() {
    if (!texto) return;
    setStatus("loading"); setErro("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);

    const textoPuro = extrairTexto(texto).slice(0, 4000);

    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoPuro, voz, velocidade }),
        signal: AbortSignal.timeout(40000),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${resp.status}`);
      }

      const blob = await resp.blob();
      const url  = URL.createObjectURL(blob);
      urlRef.current = url;

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = velocidade;
        await audioRef.current.play();
        setStatus("playing");
        setModoTTS("openai");
      }
    } catch(err) {
      // Fallback automático para Web Speech API
      console.warn("OpenAI TTS falhou, usando Web Speech:", err.message);
      setErro("");
      usarWebSpeech(textoPuro);
    }
  }

  function togglePlay() {
    if (modoTTS === "web" && status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused"); return;
    }
    if (modoTTS === "web" && status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing"); return;
    }
    if (!audioRef.current && modoTTS !== "web") return;
    if (status === "playing") {
      audioRef.current?.pause();
      setStatus("paused");
    } else if (status === "paused") {
      audioRef.current?.play();
      setStatus("playing");
    } else {
      gerar();
    }
  }

  function parar() {
    window.speechSynthesis.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setStatus("idle"); setProgresso(0); setModoTTS("openai");
  }

  function mudarVelocidade() {
    const opcoes = [0.75, 1.0, 1.25, 1.5, 2.0];
    const idx = opcoes.indexOf(velocidade);
    const nova = opcoes[(idx + 1) % opcoes.length];
    setVel(nova);
    if (audioRef.current) audioRef.current.playbackRate = nova;
  }

  const vozes = [
    { id:"nova",    label:"Nova (feminina)" },
    { id:"alloy",   label:"Alloy (neutra)"  },
    { id:"shimmer", label:"Shimmer (suave)" },
    { id:"onyx",    label:"Onyx (grave)"    },
  ];

  return (
    <div style={{
      background:"rgba(0,107,63,0.08)", border:"1px solid rgba(0,107,63,0.25)",
      borderRadius:13, padding:"12px 14px", marginBottom:12
    }}>
      {/* Título */}
      <div style={{ fontSize:11, fontWeight:700, color:T.verde2, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
        🎧 Leitura em Áudio
      </div>

      {/* Barra de progresso */}
      {(status === "playing" || status === "paused") && (
        <div style={{ background:T.fundo2, borderRadius:99, height:4, marginBottom:10, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progresso}%`, background:`linear-gradient(90deg,${T.verde},${T.verde2})`, borderRadius:99, transition:"width .5s" }} />
        </div>
      )}

      {/* Controles principais */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        {/* Play/Pause */}
        <button onClick={togglePlay} disabled={status==="loading"} style={{
          width:44, height:44, borderRadius:"50%",
          background: status==="loading" ? T.fundo2 : `linear-gradient(135deg,${T.verde},${T.verde2})`,
          border:"none", color:"#fff", fontSize:18, cursor: status==="loading"?"wait":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          boxShadow:`0 4px 14px rgba(0,107,63,0.3)`
        }}>
          {status==="loading" ? "⏳" : status==="playing" ? "⏸" : "▶️"}
        </button>

        {/* Stop */}
        {(status==="playing"||status==="paused") && (
          <button onClick={parar} style={{
            width:36, height:36, borderRadius:"50%", background:T.fundo2,
            border:`1px solid ${T.borda2}`, color:T.cinza3, fontSize:14, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>⏹</button>
        )}

        {/* Velocidade */}
        <button onClick={mudarVelocidade} style={{
          padding:"6px 10px", borderRadius:7, background:T.fundo2,
          border:`1px solid ${T.borda2}`, color:T.amarelo, fontSize:12, fontWeight:700, cursor:"pointer"
        }}>{velocidade}x</button>

        {/* Seletor de voz */}
        <select value={voz} onChange={e=>setVoz(e.target.value)} disabled={status==="playing"||status==="loading"} style={{
          flex:1, padding:"6px 8px", borderRadius:7, background:T.fundo2,
          border:`1px solid ${T.borda2}`, color:T.branco, fontSize:11, cursor:"pointer"
        }}>
          {vozes.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
      </div>

      {/* Status / erro */}
      {status === "loading" && (
        <p style={{ fontSize:11, color:T.cinza3 }}>⏳ Gerando áudio…</p>
      )}
      {status === "playing" && (
        <p style={{ fontSize:11, color:T.verde3 }}>
          {modoTTS === "openai" ? "🎙️ OpenAI TTS" : "🔊 Voz do dispositivo (fallback)"}
        </p>
      )}
      {erro && (
        <p style={{ fontSize:11, color:"#FCA5A5" }}>⚠️ {erro}</p>
      )}
      {status === "idle" && !erro && (
        <p style={{ fontSize:11, color:T.cinza3 }}>▶️ Toque para ouvir — usa OpenAI TTS ou voz do dispositivo</p>
      )}

      {/* Painel destaque palavra por palavra (Web Speech) */}
      {modoTTS === "web" && status === "playing" && palavrasRef.current.length > 0 && (
        <div style={{
          background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"8px 10px",
          marginTop:6, fontSize:12, lineHeight:1.8, color:T.cinza3,
          maxHeight:60, overflow:"hidden"
        }}>
          {palavrasRef.current.slice(Math.max(0,palavraAtual-3), palavraAtual+8).map((palavra, i) => {
            const idx = Math.max(0,palavraAtual-3) + i;
            return (
              <span key={idx} style={{
                background: idx === palavraAtual ? T.amarelo : "transparent",
                color: idx === palavraAtual ? "#000" : T.cinza3,
                borderRadius: idx === palavraAtual ? 3 : 0,
                padding: idx === palavraAtual ? "0 3px" : 0,
                fontWeight: idx === palavraAtual ? 700 : 400,
                marginRight:4,
                transition:"all .1s"
              }}>{palavra}</span>
            );
          })}
        </div>
      )}

      {/* Audio element oculto */}
      <audio ref={audioRef} style={{ display:"none" }}
        onTimeUpdate={e => {
          const el = e.target;
          if (el.duration) setProgresso(Math.round(el.currentTime/el.duration*100));
        }}
        onEnded={() => { setStatus("idle"); setProgresso(0); }}
        onError={() => { setErro("Erro ao reproduzir áudio"); setStatus("idle"); }}
      />
    </div>
  );
}

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
    if (!sel || sel.isCollapsed) return;
    const textoSel = sel.toString().trim();
    if (!textoSel || textoSel.length < 3) return;

    // Abordagem robusta: extrai o fragmento, envolve em mark
    const range = sel.getRangeAt(0);
    const cor = MARK_COLORS.find(c => c.id === corAtiva) || MARK_COLORS[0];

    try {
      // Tenta surroundContents (funciona quando seleção é dentro de um único elemento)
      const mark = document.createElement("mark");
      mark.style.cssText = `background:${cor.bg};color:${cor.text};border-radius:3px;padding:1px 3px;cursor:pointer;font-weight:600;`;
      mark.title = "Duplo toque para remover";
      mark.addEventListener("dblclick", () => {
        const p = mark.parentNode;
        while (mark.firstChild) p.insertBefore(mark.firstChild, mark);
        p.removeChild(mark);
      });
      range.surroundContents(mark);
    } catch {
      // Fallback: extrai conteúdo e reinsere envolvido
      try {
        const fragment = range.extractContents();
        const mark = document.createElement("mark");
        mark.style.cssText = `background:${cor.bg};color:${cor.text};border-radius:3px;padding:1px 3px;cursor:pointer;font-weight:600;`;
        mark.title = "Duplo toque para remover";
        mark.addEventListener("dblclick", () => {
          const p = mark.parentNode;
          while (mark.firstChild) p.insertBefore(mark.firstChild, mark);
          p.removeChild(mark);
        });
        mark.appendChild(fragment);
        range.insertNode(mark);
      } catch { return; }
    }

    sel.removeAllRanges();
    setMarcacoes(m => ({
      ...m,
      [lei.id]: [...(m[lei.id]||[]), { texto:textoSel, cor:corAtiva, data:new Date().toISOString() }]
    }));
    setStats(s => ({ ...s, pontos:s.pontos+2 }));
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
          <AudioPlayer texto={texto} lei={lei} />
          {carregando ? <Spinner label={`Carregando ${lei.nome}…`} /> : (
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

// ─── BANCO DE JURISPRUDÊNCIAS TRIBUTÁRIAS — SEFAZ-BA (Jun/2026) ──────────────
// Curado por Carolina Teixeira · 9 julgados essenciais para FGV
const INFORMATIVOS_BASE = [
  {
    id:"adc49", fonte:"STF", numero:"ADC 49 · Tema 1.099", area:"Tributário",
    titulo:"Transferência entre Filiais — Sem ICMS",
    tier:"1",
    tese:"O ICMS não incide nas transferências de mercadorias entre estabelecimentos do mesmo contribuinte (filiais), mesmo interestaduais. O art. 12, I, da LC 87/96 (trecho 'ainda que para outro estabelecimento do mesmo titular') foi declarado inconstitucional. Efeitos a partir de 01/01/2024.",
    modulacao:"Prospectiva — efeitos a partir de 01/01/2024. Ressalva: processos pendentes até 29/04/2021.",
    pegadinhas:[
      "A modulação NÃO autorizou estados a cobrarem retroativamente. Autuações pré-2024 sem processo pendente foram anuladas (Tema 1.367, set/2025).",
      "Mesmo sem ICMS, o crédito das operações anteriores é MANTIDO e transferido obrigatoriamente ao destinatário (LC 204/2023 + Conv. 178/2023).",
      "Bahia: Lei 14.790/2024 regulamentou a transferência de créditos no âmbito estadual."
    ],
    mnemonico:"FATO = FICÇÃO → SEM ICMS. Transferência entre filiais = fato físico, mas ficção jurídica de circulação. Sem circulação jurídica, sem ICMS. Mas há crédito!",
    relator:"Min. Edson Fachin", data:"2021/2023",
    questoes:[
      {
        enunciado:"A empresa Nordeste Distribuidora LTDA, com sede na Bahia e filial no Ceará, transferiu, em março de 2024, mercadorias de seu estoque baiano para a filial cearense. O Estado do Ceará, ao receber as mercadorias, exigiu o estorno dos créditos de ICMS. Assinale a alternativa correta:",
        alternativas:{
          A:"O ICMS incide normalmente sobre a transferência, pois o art. 12, I, da LC 87/96 permanece vigente.",
          B:"O ICMS incide sobre a transferência apenas se o valor da mercadoria for superior a R$ 10.000,00.",
          C:"O ICMS não incide sobre a transferência a partir de 2024, sendo garantida a manutenção e transferência dos créditos ao estabelecimento destinatário.",
          D:"O ICMS não incide, mas os créditos da operação anterior devem ser estornados, pois não há operação tributada subsequente.",
          E:"A modulação de efeitos da ADC 49 permite que o Estado do Ceará cobre retroativamente o ICMS de 2022 e 2023."
        },
        gabarito:"C",
        explicacao:"C é correta: desde 01/01/2024, o ICMS não incide e o crédito é obrigatoriamente transferido ao destinatário (LC 204/2023). A: art. 12, I foi declarado inconstitucional. B: não há limite por valor. D: o crédito é mantido pela não-cumulatividade. E: Tema 1.367 vedou cobrança retroativa.",
        dificuldade:"Difícil"
      }
    ]
  },
  {
    id:"tema69", fonte:"STF", numero:"Tema 69 · RE 574.706", area:"Tributário",
    titulo:"ICMS Fora da Base do PIS/COFINS",
    tier:"1",
    tese:"O ICMS não compõe a base de cálculo para a incidência do PIS e da COFINS. O ICMS excluído é o DESTACADO NA NOTA FISCAL (não o recolhido). Efeitos a partir de 15/03/2017.",
    modulacao:"Efeitos a partir de 15/03/2017. Ressalvadas ações judiciais e administrativas protocoladas até essa data.",
    pegadinhas:[
      "O ICMS excluído é o DESTACADO na NF, não o RECOLHIDO ao estado. Diferença pode ser significativa.",
      "A tese NÃO se aplica retroativamente — marco temporal: 15/03/2017.",
      "ICMS-ST na base do PIS/COFINS é tema INFRACONSTITUCIONAL (Tema 1.098 STF) — quem decide é o STJ."
    ],
    mnemonico:"ICMS = PASSAGEM, NÃO PATRIMÔNIO. Regra prática: 'Nota exclui, cheque não.' Exclui o que está na nota (destacado), não o que foi para o estado (recolhido).",
    relator:"Min. Cármen Lúcia", data:"2017",
    questoes:[
      {
        enunciado:"Com base no entendimento fixado pelo STF no julgamento do RE 574.706 (Tema 69), é correto afirmar que:",
        alternativas:{
          A:"O ICMS recolhido ao Estado deve ser excluído da base de cálculo do PIS e da COFINS.",
          B:"O ICMS destacado na nota fiscal não integra a base de cálculo do PIS e da COFINS, com efeitos a partir de 15/03/2017.",
          C:"O ICMS-ST pode ser excluído da base do PIS/COFINS diretamente com base no Tema 69, por decisão constitucional do STF.",
          D:"A tese do Tema 69 se aplica retroativamente a todos os fatos geradores, sem modulação de efeitos.",
          E:"O ISS também incide sobre a base do PIS/COFINS, pois o Tema 69 é restrito ao ICMS."
        },
        gabarito:"B",
        explicacao:"B é correta: tese exata do RE 574.706 com modulação temporal. A: pegadinha principal — exclui o DESTACADO, não o RECOLHIDO. C: Tema 1.098 definiu que ICMS-ST é infraconstitucional — quem decide é o STJ. D: há modulação (marco: 15/03/2017). E: ISS também é excluído (Tema 118, RE 592.616).",
        dificuldade:"Médio"
      }
    ]
  },
  {
    id:"sumula166", fonte:"STJ", numero:"Súmula 166 STJ · Tema 259", area:"Tributário",
    titulo:"Transferência entre Filiais — Antecedente Histórico",
    tier:"2",
    tese:"Não constitui fato gerador do ICMS o simples deslocamento de mercadoria de um para outro estabelecimento do mesmo contribuinte.",
    modulacao:"Sem modulação — eficácia infraconstitucional. Precede a ADC 49.",
    pegadinhas:[
      "A Súmula 166 STJ (1996) antecipou a ADC 49 no âmbito infraconstitucional. A diferença é que tinha eficácia inter partes até o STF pacificar constitucionalmente.",
      "Hoje coexistem: Súmula 166 (STJ, infraconstitucional) + ADC 49 (STF, constitucional). A FGV pode cobrar a relação cronológica e hierárquica."
    ],
    mnemonico:"Súmula 166 = avô da ADC 49. Mesma ideia, geração mais antiga, menor força.",
    relator:"STJ", data:"1996",
    questoes:[]
  },
  {
    id:"re593", fonte:"STF", numero:"RE 593.849 · Tema 201", area:"Tributário",
    titulo:"Restituição do ICMS-ST quando BC Real < BC Presumida",
    tier:"2",
    tese:"É devida a restituição da diferença do ICMS pago a mais no regime de substituição tributária para a frente se a base de cálculo efetiva da operação for inferior à presumida.",
    modulacao:"Sem modulação. Revisão da teoria da definitividade.",
    pegadinhas:[
      "Antes do RE 593.849: ICMS-ST era definitivo (teoria da definitividade). A corte reverteu.",
      "O direito à restituição é do SUBSTITUÍDO (varejista que vendeu abaixo do presumido), não do substituto.",
      "Se a operação real foi por valor SUPERIOR ao presumido → estado pode cobrar complementação."
    ],
    mnemonico:"BC real < BC presumida = restituição ao substituído. BC real > BC presumida = complementação ao estado.",
    relator:"Min. Edson Fachin", data:"2016",
    questoes:[]
  },
  {
    id:"tema745", fonte:"STF", numero:"Tema 745 · RE 851.421", area:"Tributário",
    titulo:"Guerra Fiscal — Benefícios Unilaterais de ICMS",
    tier:"2",
    tese:"É vedada a concessão unilateral de benefícios fiscais de ICMS sem convênio CONFAZ. Benefício concedido sem convênio é inconstitucional e o estado destinatário pode glosar os créditos correspondentes.",
    modulacao:"Modulação: concessão de prazo para estados regularizarem benefícios mediante convênio.",
    pegadinhas:[
      "Relevante para a Bahia: pode glosar créditos de ICMS oriundos de benefícios ilegítimos concedidos por outros estados.",
      "Reforma Tributária (EC 132/23) cria mecanismo de compensação para evitar litígios de guerra fiscal no IBS."
    ],
    mnemonico:"Sem CONFAZ = sem validade. Benefício de ICMS unilateral = inconstitucional = crédito glosável.",
    relator:"STF Pleno", data:"2021",
    questoes:[]
  },
  {
    id:"imunidades", fonte:"STF", numero:"Súmulas 657 · 724 · 730 + RE 330.817", area:"Tributário",
    titulo:"Imunidades Tributárias — Limites e Extensões",
    tier:"2",
    tese:"STF 657: imunidade cultural abrange filmes e papéis fotográficos para jornais. STF 724: imunidade de entidade do art. 150, VI, c permanece com imóvel alugado se renda reverte à atividade-fim. STF 730: entidade fechada de previdência só tem imunidade se não houver contribuição dos beneficiários. RE 330.817 (Tema 593): imunidade de livros abrange e-books.",
    modulacao:"Sem modulação.",
    pegadinhas:[
      "Imunidade de livros (art. 150, VI, d) abrange e-books — critério é o CONTEÚDO, não o suporte físico.",
      "Fundos de pensão COM contribuição dos participantes NÃO têm imunidade (Súmula 730).",
      "Imunidade de templos abrange estacionamento voltado à atividade religiosa (RE 694.453).",
      "NUNCA confunda: imunidade (constitucional) ≠ isenção (legal) ≠ não incidência."
    ],
    mnemonico:"PARTE = Patrimônio recíproco + Autarquias + Religiosos + Terceiro setor + Educação/Livros.",
    relator:"STF", data:"Diversas datas",
    questoes:[]
  },
  {
    id:"lc204", fonte:"STF", numero:"LC 204/2023 · Conv. 178/2023", area:"Tributário",
    titulo:"Implementação Legislativa da ADC 49",
    tier:"2",
    tese:"A LC 204/2023 e o Convênio ICMS 178/2023 implementaram a ADC 49 na legislação infraconstitucional. Transferência de crédito ao destinatário é obrigatória nas operações interestaduais entre estabelecimentos do mesmo titular.",
    modulacao:"Vigência: fevereiro/2024.",
    pegadinhas:[
      "A transferência de crédito é OBRIGATÓRIA ao destinatário — não é faculdade.",
      "Bahia editou Lei 14.790/2024 para regulamentar no âmbito estadual."
    ],
    mnemonico:"ADC 49 = tese constitucional. LC 204/2023 = implementação legal. Lei 14.790/2024-BA = regulamentação estadual.",
    relator:"Legislativo Federal", data:"2023",
    questoes:[]
  },
  {
    id:"tema1367", fonte:"STF", numero:"Tema 1.367 · ADC 49-ED", area:"Tributário",
    titulo:"Modulação ADC 49 — Vedação de Cobrança Retroativa",
    tier:"1",
    tese:"A modulação prospectiva da ADC 49 (efeitos a partir de 01/01/2024) NÃO autorizou os estados a cobrarem ICMS retroativamente sobre fatos geradores pré-2024. Autuações sobre operações de 2022-2023 sem processo pendente até 29/04/2021 foram anuladas.",
    modulacao:"Julgado em setembro/2025.",
    pegadinhas:[
      "Pegadinha clássica: modulação prospectiva ≠ autorização de cobrança retroativa pelos estados.",
      "Processos pendentes até 29/04/2021 são ressalvados."
    ],
    mnemonico:"Modulação PROSPECTIVA = apenas para o futuro. Não vira autorização retroativa para os estados.",
    relator:"Min. Edson Fachin", data:"2025",
    questoes:[]
  },
  {
    id:"re330817", fonte:"STF", numero:"RE 330.817 · Tema 593", area:"Tributário",
    titulo:"Imunidade de Livros — E-books e Suportes Digitais",
    tier:"2",
    tese:"A imunidade tributária de livros, jornais, periódicos e papel (CF/88, art. 150, VI, d) abrange os livros eletrônicos (e-books) e os suportes exclusivamente utilizados para fixá-los. O critério é o CONTEÚDO veiculado, não o suporte físico.",
    modulacao:"Sem modulação.",
    pegadinhas:[
      "E-book SIM. Impressora de e-books NÃO — o suporte deve ser exclusivamente destinado ao livro.",
      "Audiolivro: tema pendente — FGV pode cobrar como questão aberta."
    ],
    mnemonico:"Imunidade segue o CONTEÚDO, não o suporte. E-book = livro digital = imune.",
    relator:"Min. Dias Toffoli", data:"2017",
    questoes:[]
  },
];


async function buscarInformativosSTJ() {
  // Retorna informativos do banco local (STJ)
  return INFORMATIVOS_BASE.filter(i => i.fonte === "STJ");
}

async function buscarUltimoSTF() {
  // Retorna informativos do banco local (STF)
  return INFORMATIVOS_BASE.filter(i => i.fonte === "STF");
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

    // 1. Cache local
    const cachedLocal = savedComents[cacheKey];
    if (cachedLocal) { setComentario(cachedLocal); return; }

    if (!online) { setComentario("⚠️ Sem conexão para gerar comentário."); return; }

    // 2. Cache Supabase — já gerado por outro membro do grupo?
    const cachedSupa = await getCacheJuris(item.id);
    if (cachedSupa?.resumo_ia) {
      setComentario(cachedSupa.resumo_ia);
      setSaved(s => ({ ...s, [cacheKey]: cachedSupa.resumo_ia }));
      return;
    }

    // Comentário local imediato com tese + pegadinhas + mnemônico (sem precisar de IA)
    const comentarioLocal = [
      item.tese ? `📌 **TESE:**\n${item.tese}` : "",
      item.modulacao ? `⏰ **MODULAÇÃO:**\n${item.modulacao}` : "",
      item.pegadinhas?.length ? `🚨 **PEGADINHAS FGV:**\n${item.pegadinhas.map((p,i) => `${i+1}. ${p}`).join("\n")}` : "",
      item.mnemonico ? `🧠 **MNEMÔNICO:**\n${item.mnemonico}` : "",
    ].filter(Boolean).join("\n\n");

    if (comentarioLocal) {
      setComentario(comentarioLocal);
      setSaved(s => ({ ...s, [cacheKey]: comentarioLocal }));
      await saveCacheJuris(item, comentarioLocal, null, null);
      setGerando(false);
      return;
    }

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
          <p style={{ color:T.cinza3, fontSize:12 }}>Toque em um informativo → a IA gera comentário didático + questão FGV. Acumule pontos! 🎯</p>
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
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
                          background: item.fonte==="STJ"?"rgba(0,107,63,0.15)":"rgba(139,167,191,0.1)",
                          border: `1px solid ${item.fonte==="STJ"?"rgba(0,107,63,0.4)":"rgba(139,167,191,0.2)"}`,
                          color: item.fonte==="STJ"?T.verde3:T.cinza3
                        }}>{item.fonte}</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
                          background: item.tier==="1"?"rgba(229,62,62,0.1)":item.tier==="2"?"rgba(249,194,49,0.08)":"rgba(139,167,191,0.08)",
                          border: `1px solid ${item.tier==="1"?"rgba(229,62,62,0.3)":item.tier==="2"?"rgba(249,194,49,0.25)":"rgba(139,167,191,0.2)"}`,
                          color: item.tier==="1"?"#FCA5A5":item.tier==="2"?T.amarelo:T.cinza3
                        }}>{item.tier==="1"?"🔴 Obrigatório":item.tier==="2"?"🟡 Alta prob.":"⚪ Complementar"}</span>
                        {temComent && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"rgba(0,107,63,0.12)", border:"1px solid rgba(0,107,63,0.3)", color:T.verde3 }}>✅ comentado</span>}
                        {item.questoes?.length > 0 && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"rgba(159,122,234,0.1)", border:"1px solid rgba(159,122,234,0.25)", color:"#C084FC" }}>📝 {item.questoes.length} questão</span>}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.4, marginBottom:4 }}>{item.titulo}</div>
                      <div style={{ fontSize:10, color:T.cinza3, marginBottom:6, fontFamily:"monospace" }}>{item.numero} · {item.relator} · {item.data}</div>
                      <div style={{ fontSize:11, color:T.cinza3, lineHeight:1.6 }}>{item.tese?.slice(0,130)}…</div>
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
