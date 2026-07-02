import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { T } from "../../theme.js";
import { Badge, Spinner } from "../../components/ui.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// TELA: PAINEL ADMINISTRATIVO (papel admin/editor)
// Abas: Questões (fila de moderação do banco), Usuários (papéis), Log.
// A segurança real é feita por RLS (is_admin()); a UI é só a interface.
// ═══════════════════════════════════════════════════════════════════════════

const ABAS = [
  { id: "questoes", icon: "📝", label: "Questões" },
  { id: "usuarios", icon: "👥", label: "Usuários" },
  { id: "log",      icon: "📜", label: "Log" },
];

export default function TelaAdmin({ user, isMobile }) {
  const [aba, setAba] = useState("questoes");

  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px 14px":"24px 32px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.amarelo, marginBottom:4 }}>🛠️ Administração</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:26, fontWeight:900, color:"#fff" }}>Painel da plataforma</h1>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} className="btn" style={{
            padding:"8px 16px", borderRadius:9, fontSize:12, fontWeight:700,
            background: aba===a.id ? "rgba(249,194,49,0.15)" : T.fundo3,
            border: `1px solid ${aba===a.id ? "rgba(249,194,49,0.4)" : T.borda2}`,
            color: aba===a.id ? T.amarelo : T.cinza3,
          }}>{a.icon} {a.label}</button>
        ))}
      </div>

      {aba === "questoes" && <AbaQuestoes user={user} isMobile={isMobile} />}
      {aba === "usuarios" && <AbaUsuarios user={user} />}
      {aba === "log"      && <AbaLog />}
    </div>
  );
}

async function registrarLog(adminId, acao, entidade, entidadeId, detalhes = {}) {
  try {
    await supabase.from("admin_log").insert({
      admin_id: adminId, acao, entidade, entidade_id: String(entidadeId || ""), detalhes,
    });
  } catch (e) { console.warn("admin_log:", e.message); }
}

// ─── ABA: MODERAÇÃO DE QUESTÕES ─────────────────────────────────────────────
function AbaQuestoes({ user, isMobile }) {
  const [questoes, setQuestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("pendentes"); // pendentes | aprovadas | todas
  const [aberta, setAberta] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("cache_questoes")
      .select("id, disciplina, tema, dificuldade, enunciado, gabarito, origem, prova_referencia, aprovado, vezes_respondida, taxa_acerto, criado_em")
      .order("criado_em", { ascending: false });
    if (error) setErro(error.message);
    setQuestoes(data || []);
    setCarregando(false);
  }

  async function setAprovado(q, valor) {
    const { error } = await supabase.from("cache_questoes").update({ aprovado: valor }).eq("id", q.id);
    if (error) { setErro("Sem permissão para moderar: " + error.message); return; }
    setQuestoes(qs => qs.map(x => x.id === q.id ? { ...x, aprovado: valor } : x));
    registrarLog(user.id, valor ? "aprovar_questao" : "reprovar_questao", "cache_questoes", q.id, { tema: q.tema });
  }

  async function excluir(q) {
    if (!window.confirm(`Excluir a questão "${q.tema}"? Essa ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("cache_questoes").delete().eq("id", q.id);
    if (error) { setErro("Sem permissão para excluir: " + error.message); return; }
    setQuestoes(qs => qs.filter(x => x.id !== q.id));
    registrarLog(user.id, "excluir_questao", "cache_questoes", q.id, { tema: q.tema });
  }

  const filtradas = questoes.filter(q =>
    filtro === "todas" ? true : filtro === "pendentes" ? q.aprovado === false : q.aprovado !== false
  );
  const pendentes = questoes.filter(q => q.aprovado === false).length;

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
        {[["pendentes",`⏳ Pendentes${pendentes?` (${pendentes})`:""}`],["aprovadas","✅ Aprovadas"],["todas","Todas"]].map(([id,label]) => (
          <button key={id} onClick={() => setFiltro(id)} className="btn" style={{
            padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:600,
            background: filtro===id ? "rgba(0,107,63,0.2)" : "transparent",
            border: `1px solid ${filtro===id ? "rgba(0,107,63,0.5)" : T.borda2}`,
            color: filtro===id ? T.verde3 : T.cinza3,
          }}>{label}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:11, color:T.cinza3 }}>{questoes.length} no banco</span>
      </div>

      {erro && <div style={{ background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.3)", borderRadius:9, padding:"10px 14px", fontSize:12, color:"#FCA5A5", marginBottom:12 }}>{erro}</div>}
      {carregando && <Spinner label="Carregando questões…" />}

      {!carregando && filtradas.length === 0 && (
        <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:12, padding:"32px 20px", textAlign:"center", color:T.cinza3, fontSize:13 }}>
          {filtro === "pendentes" ? "🎉 Nenhuma questão aguardando moderação." : "Nada aqui."}
        </div>
      )}

      {filtradas.map(q => (
        <div key={q.id} style={{ background:T.fundo3, border:`1px solid ${q.aprovado===false?"rgba(249,194,49,0.35)":T.borda2}`, borderRadius:11, padding:"12px 14px", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
            <Badge color={q.origem==="fgv_real"?"verde":"cinza"}>{q.origem==="fgv_real"?"Prova real":"IA"}</Badge>
            {q.aprovado===false && <Badge color="amarelo">⏳ pendente</Badge>}
            <span style={{ fontSize:12, fontWeight:700, color:T.verde3 }}>{q.disciplina}</span>
            <span style={{ fontSize:11, color:T.cinza3 }}>→ {q.tema}</span>
            {q.vezes_respondida > 0 && <span style={{ fontSize:10, color:T.cinza3 }}>👥 {q.vezes_respondida}x · {Number(q.taxa_acerto)}%</span>}
          </div>
          <button onClick={() => setAberta(aberta===q.id?null:q.id)} className="btn"
            style={{ background:"transparent", border:"none", padding:0, textAlign:"left", width:"100%" }}>
            <p style={{ fontSize:12, color:T.branco, lineHeight:1.6,
              ...(aberta===q.id?{}:{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>
              {q.enunciado}
            </p>
            <span style={{ fontSize:10, color:T.cinza3 }}>{aberta===q.id?"▲ recolher":"▼ expandir"} · gabarito {q.gabarito}{q.prova_referencia?` · ${q.prova_referencia}`:""}</span>
          </button>
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            {q.aprovado===false ? (
              <button onClick={() => setAprovado(q, true)} className="btn" style={{ padding:"6px 14px", borderRadius:7, fontSize:11, fontWeight:700, background:"rgba(0,107,63,0.2)", border:"1px solid rgba(0,107,63,0.5)", color:T.verde3 }}>✅ Aprovar</button>
            ) : (
              <button onClick={() => setAprovado(q, false)} className="btn" style={{ padding:"6px 14px", borderRadius:7, fontSize:11, fontWeight:700, background:"rgba(249,194,49,0.1)", border:"1px solid rgba(249,194,49,0.3)", color:T.amarelo }}>⏳ Suspender</button>
            )}
            <button onClick={() => excluir(q)} className="btn" style={{ padding:"6px 14px", borderRadius:7, fontSize:11, background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.3)", color:"#FCA5A5" }}>🗑️ Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ABA: USUÁRIOS E PAPÉIS ─────────────────────────────────────────────────
function AbaUsuarios({ user }) {
  const [perfis, setPerfis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    supabase.from("perfis").select("id, nome, email, papel, criado_em")
      .order("criado_em", { ascending: true })
      .then(({ data, error }) => {
        if (error) setErro(error.message);
        setPerfis(data || []);
        setCarregando(false);
      });
  }, []);

  async function mudarPapel(p, papel) {
    const { error } = await supabase.from("perfis").update({ papel }).eq("id", p.id);
    if (error) { setErro("Sem permissão: " + error.message); return; }
    setPerfis(ps => ps.map(x => x.id === p.id ? { ...x, papel } : x));
    registrarLog(user.id, "mudar_papel", "perfis", p.id, { de: p.papel, para: papel, email: p.email });
  }

  if (carregando) return <Spinner label="Carregando usuários…" />;

  return (
    <div>
      {erro && <div style={{ background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.3)", borderRadius:9, padding:"10px 14px", fontSize:12, color:"#FCA5A5", marginBottom:12 }}>{erro}</div>}
      {perfis.map(p => (
        <div key={p.id} style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:11, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{p.nome || "Sem nome"}{p.id===user.id?" (você)":""}</div>
            <div style={{ fontSize:11, color:T.cinza3 }}>{p.email}</div>
          </div>
          <Badge color={p.papel==="admin"?"amarelo":p.papel==="editor"?"verde":"cinza"}>{p.papel}</Badge>
          <select value={p.papel} onChange={e => mudarPapel(p, e.target.value)} disabled={p.id===user.id}
            style={{ background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:7, color:T.branco, fontSize:12, padding:"6px 8px", outline:"none" }}>
            <option value="aluna">aluna</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}

// ─── ABA: LOG DE AÇÕES ──────────────────────────────────────────────────────
function AbaLog() {
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.from("admin_log").select("*").order("criado_em", { ascending: false }).limit(80)
      .then(({ data }) => { setLogs(data || []); setCarregando(false); });
  }, []);

  if (carregando) return <Spinner label="Carregando log…" />;
  if (logs.length === 0) return <div style={{ color:T.cinza3, fontSize:13, textAlign:"center", padding:32 }}>Nenhuma ação registrada ainda.</div>;

  const ROTULOS = {
    aprovar_questao: "✅ aprovou questão", reprovar_questao: "⏳ suspendeu questão",
    excluir_questao: "🗑️ excluiu questão", mudar_papel: "👥 alterou papel",
  };

  return (
    <div>
      {logs.map(l => (
        <div key={l.id} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"9px 4px", borderBottom:`1px solid ${T.borda2}` }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.cinza3, flexShrink:0, marginTop:2 }}>
            {new Date(l.criado_em).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}
          </span>
          <div style={{ fontSize:12, color:T.branco, lineHeight:1.5 }}>
            {ROTULOS[l.acao] || l.acao}
            {l.detalhes?.tema && <span style={{ color:T.cinza3 }}> — {l.detalhes.tema}</span>}
            {l.detalhes?.email && <span style={{ color:T.cinza3 }}> — {l.detalhes.email}: {l.detalhes.de} → {l.detalhes.para}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
