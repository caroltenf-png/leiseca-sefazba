import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { T } from "../../theme.js";
import { Badge, Spinner } from "../../components/ui.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// TELA: BANCO DE QUESTÕES
// Questões reais (FGV) e geradas por IA armazenadas em cache_questoes.
// Fluxo: lista com filtros → resolução → comentário com grifos
// (verde = fundamento correto · vermelho = pegadinha) → registro em
// questao_respostas (estatísticas por questão atualizadas por trigger).
// ═══════════════════════════════════════════════════════════════════════════

const DIFICULDADES = ["Todas", "Fácil", "Médio", "Difícil", "Muito Difícil"];
const STATUS_FILTROS = ["Todas", "Não respondidas", "Respondidas", "Que errei"];

export default function TelaQuestoes({ user, isMobile, online, stats, setStats }) {
  const [questoes, setQuestoes]     = useState([]);
  const [minhas, setMinhas]         = useState({});   // questao_id -> { acertou, alternativa } (última resposta)
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro]             = useState("");

  // filtros
  const [fDisc, setFDisc]     = useState("Todas");
  const [fDif, setFDif]       = useState("Todas");
  const [fStatus, setFStatus] = useState("Todas");
  const [busca, setBusca]     = useState("");

  // resolução
  const [idx, setIdx]               = useState(null);  // índice na lista filtrada; null = lista
  const [respSel, setRespSel]       = useState(null);
  const [mostrarGab, setMostrarGab] = useState(false);
  const [inicioMs, setInicioMs]     = useState(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setCarregando(true); setErro("");
    const { data, error } = await supabase
      .from("cache_questoes")
      .select("*")
      .order("criado_em", { ascending: true });
    if (error) {
      setErro("Não foi possível carregar as questões: " + error.message);
      setCarregando(false);
      return;
    }
    // aprovado === false fica fora; undefined/null (coluna ainda não criada) entra
    setQuestoes((data || []).filter(q => q.aprovado !== false));

    if (user?.id) {
      const { data: resp } = await supabase
        .from("questao_respostas")
        .select("questao_id, alternativa, acertou, criado_em")
        .eq("user_id", user.id)
        .order("criado_em", { ascending: true });
      const mapa = {};
      (resp || []).forEach(r => { mapa[r.questao_id] = { acertou: r.acertou, alternativa: r.alternativa }; });
      setMinhas(mapa);
    }
    setCarregando(false);
  }

  const disciplinas = useMemo(
    () => ["Todas", ...[...new Set(questoes.map(q => q.disciplina))].sort()],
    [questoes]
  );

  const filtradas = useMemo(() => questoes.filter(q => {
    if (fDisc !== "Todas" && q.disciplina !== fDisc) return false;
    if (fDif !== "Todas" && q.dificuldade !== fDif) return false;
    const minha = minhas[q.id];
    if (fStatus === "Não respondidas" && minha) return false;
    if (fStatus === "Respondidas" && !minha) return false;
    if (fStatus === "Que errei" && (!minha || minha.acertou)) return false;
    if (busca.trim()) {
      const alvo = `${q.tema} ${q.enunciado} ${q.fundamentacao || ""} ${q.prova_referencia || ""}`.toLowerCase();
      if (!alvo.includes(busca.trim().toLowerCase())) return false;
    }
    return true;
  }), [questoes, fDisc, fDif, fStatus, busca, minhas]);

  const questao = idx !== null ? filtradas[idx] : null;

  const resumo = useMemo(() => {
    const ids = Object.keys(minhas);
    const acertos = ids.filter(id => minhas[id].acertou).length;
    return { respondidas: ids.length, acertos, taxa: ids.length ? Math.round(acertos / ids.length * 100) : 0 };
  }, [minhas]);

  function abrirQuestao(i) {
    setIdx(i); setRespSel(null); setMostrarGab(false); setInicioMs(Date.now());
  }

  async function responder(letra) {
    if (respSel || !questao) return;
    setRespSel(letra);
    setMostrarGab(true);
    const acertou = letra === questao.gabarito;
    setMinhas(m => ({ ...m, [questao.id]: { acertou, alternativa: letra } }));
    setStats(s => ({ ...s, pontos: s.pontos + (acertou ? 20 : 5) }));
    // Registro no Supabase — estatísticas da questão são atualizadas por trigger
    try {
      const { error } = await supabase.from("questao_respostas").insert({
        user_id: user.id,
        questao_id: questao.id,
        alternativa: letra,
        acertou,
        tempo_ms: inicioMs ? Date.now() - inicioMs : null,
        contexto: "banco",
      });
      if (error) console.warn("questao_respostas:", error.message);
    } catch (e) { console.warn("questao_respostas:", e.message); }
  }

  function proxima() {
    const next = (idx ?? 0) + 1;
    if (next < filtradas.length) abrirQuestao(next);
    else setIdx(null);
  }

  function corAlt(letra) {
    if (!respSel) return { bg: T.fundo3, border: T.borda2, color: T.branco };
    if (letra === questao?.gabarito) return { bg:"rgba(0,107,63,0.15)", border:"rgba(0,107,63,0.6)", color:T.verde3 };
    if (letra === respSel)           return { bg:"rgba(229,62,62,0.12)", border:"rgba(229,62,62,0.5)", color:"#FCA5A5" };
    return { bg: T.fundo3, border: T.borda2, color: T.cinza3 };
  }

  // ── RESOLUÇÃO ──────────────────────────────────────────────────────────────
  if (questao) {
    const acertou = respSel === questao.gabarito;
    return (
      <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px 14px":"24px 32px" }}>
        <button onClick={() => setIdx(null)} className="btn"
          style={{ background:"transparent", border:`1px solid ${T.borda2}`, color:T.cinza3, borderRadius:8, padding:"7px 14px", fontSize:12, marginBottom:14 }}>
          ← Voltar à lista
        </button>

        <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, overflow:"hidden", maxWidth:860 }}>
          {/* Header */}
          <div style={{ background:"rgba(0,107,63,0.1)", borderBottom:`1px solid rgba(0,107,63,0.2)`, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ background:questao.origem==="fgv_real"?T.verde2:"#7C6FD1", color:"#fff", fontSize:11, fontWeight:800, borderRadius:6, padding:"3px 10px" }}>
                {questao.origem==="fgv_real" ? "PROVA REAL" : "IA"} · {idx+1}/{filtradas.length}
              </span>
              <span style={{ fontSize:12, color:T.verde3, fontWeight:600 }}>{questao.disciplina}</span>
              <span style={{ fontSize:11, color:T.cinza3 }}>→ {questao.tema}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {questao.prova_referencia && <span style={{ fontSize:11, color:T.amarelo, fontWeight:600 }}>📌 {questao.prova_referencia}</span>}
              <span style={{ fontSize:11, color:questao.dificuldade==="Muito Difícil"?T.red:questao.dificuldade==="Difícil"?T.orange:T.amarelo, fontWeight:700 }}>
                {questao.dificuldade==="Muito Difícil"?"🔴":questao.dificuldade==="Difícil"?"🟠":"🟡"} {questao.dificuldade}
              </span>
            </div>
          </div>

          {/* Estatísticas coletivas da questão */}
          {questao.vezes_respondida > 0 && (
            <div style={{ padding:"8px 18px", borderBottom:`1px solid ${T.borda2}`, display:"flex", gap:14, fontSize:11, color:T.cinza3 }}>
              <span>👥 Respondida {questao.vezes_respondida}x pelo grupo</span>
              <span style={{ color:Number(questao.taxa_acerto)>=70?T.verde3:Number(questao.taxa_acerto)>=50?T.amarelo:"#FCA5A5" }}>
                🎯 {Number(questao.taxa_acerto)}% de acerto
              </span>
            </div>
          )}

          {/* Enunciado + alternativas */}
          <div style={{ padding:"22px 22px 18px" }}>
            <p style={{ fontSize:isMobile?13:14, color:T.branco, lineHeight:1.85, marginBottom:22, fontFamily:"'Georgia',serif" }}>
              {questao.enunciado}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {["A","B","C","D","E"].map(letra => {
                const estilo = corAlt(letra);
                if (questao.alternativas[letra] === undefined) return null;
                return (
                  <button key={letra} onClick={() => responder(letra)} disabled={!!respSel} className="btn" style={{
                    display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px",
                    background:estilo.bg, border:`1px solid ${estilo.border}`,
                    borderRadius:9, textAlign:"left", cursor:respSel?"default":"pointer", transition:"all .2s",
                  }}>
                    <span style={{ fontWeight:900, fontSize:14, color:estilo.color, flexShrink:0, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{letra}</span>
                    <span style={{ fontSize:13, color:estilo.color, lineHeight:1.65 }}>{questao.alternativas[letra]}</span>
                    {respSel && letra === questao.gabarito && <span style={{ marginLeft:"auto", fontSize:16, flexShrink:0 }}>✅</span>}
                    {respSel && letra === respSel && letra !== questao.gabarito && <span style={{ marginLeft:"auto", fontSize:16, flexShrink:0 }}>❌</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comentário com grifos */}
          {mostrarGab && (
            <div style={{ borderTop:`1px solid ${T.borda2}`, padding:"18px 22px", background:"rgba(0,0,0,0.15)" }}>
              <div style={{
                display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                background:acertou?"rgba(0,107,63,0.15)":"rgba(229,62,62,0.1)",
                border:`1px solid ${acertou?"rgba(0,107,63,0.4)":"rgba(229,62,62,0.3)"}`,
                borderRadius:9, marginBottom:16,
              }}>
                <span style={{ fontSize:24 }}>{acertou?"✅":"❌"}</span>
                <div style={{ fontSize:13, fontWeight:700, color:acertou?T.verde3:"#FCA5A5" }}>
                  {acertou?"Correto! +20 pontos":`Incorreto. Gabarito: ${questao.gabarito}`}
                </div>
              </div>

              {/* Grifo VERDE: fundamento da resposta correta */}
              <div style={{ background:"rgba(0,166,90,0.07)", borderLeft:`3px solid ${T.verde2}`, borderRadius:"0 9px 9px 0", padding:"12px 16px", marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.verde2, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                  📗 Fundamento — por que a {questao.gabarito} está correta
                </div>
                {questao.fundamentacao && (
                  <p style={{ fontSize:12, marginBottom:8 }}>
                    <mark className="m-verde" style={{ color:T.branco, padding:"1px 4px" }}>{questao.fundamentacao}</mark>
                  </p>
                )}
                <p style={{ fontSize:13, color:T.branco, lineHeight:1.8 }}>{questao.explicacao_gabarito}</p>
              </div>

              {/* Grifo VERMELHO: a pegadinha que o usuário caiu */}
              {!acertou && questao.explicacao_distratores?.[respSel] && (
                <div style={{ background:"rgba(229,62,62,0.06)", borderLeft:`3px solid ${T.red}`, borderRadius:"0 9px 9px 0", padding:"12px 16px", marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#FCA5A5", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                    📕 A pegadinha da alternativa {respSel}
                  </div>
                  <p style={{ fontSize:13, lineHeight:1.8 }}>
                    <mark className="m-red" style={{ color:T.branco, padding:"1px 4px" }}>{questao.explicacao_distratores[respSel]}</mark>
                  </p>
                </div>
              )}

              {/* Demais distratores */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.cinza3, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>🔍 As demais alternativas</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {["A","B","C","D","E"].filter(l => l !== questao.gabarito && l !== respSel).map(l => (
                    questao.explicacao_distratores?.[l] &&
                    <div key={l} style={{ display:"flex", gap:8, fontSize:12, color:T.cinza3, lineHeight:1.6 }}>
                      <span style={{ fontWeight:700, color:"#FCA5A5", flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>{l})</span>
                      <span>{questao.explicacao_distratores[l]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {questao.dica_prova && (
                <div style={{ background:"rgba(249,194,49,0.06)", border:`1px solid rgba(249,194,49,0.2)`, borderRadius:9, padding:"10px 14px", marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.amarelo, marginBottom:5 }}>💡 Dica para nunca mais errar</div>
                  <p style={{ fontSize:12, color:T.cinza3, lineHeight:1.7 }}>{questao.dica_prova}</p>
                </div>
              )}

              <button onClick={proxima} className="btn" style={{
                width:"100%", padding:"13px", borderRadius:10, fontWeight:700, fontSize:14,
                background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
                boxShadow:`0 6px 20px rgba(0,107,63,0.3)`,
              }}>
                {idx+1 < filtradas.length ? `➡️ Próxima questão (${idx+2}/${filtradas.length})` : "✔️ Voltar à lista"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LISTA + FILTROS ────────────────────────────────────────────────────────
  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px 14px":"24px 32px" }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:T.verde2, marginBottom:4 }}>📝 Banco de Questões</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:26, fontWeight:900, color:"#fff", marginBottom:4 }}>
          Questões de Provas Reais
        </h1>
        <p style={{ color:T.cinza3, fontSize:12 }}>
          Filtre por disciplina e dificuldade, resolva e estude o comentário: <mark className="m-verde" style={{ padding:"0 4px" }}>verde = fundamento</mark> · <mark className="m-red" style={{ padding:"0 4px" }}>vermelho = pegadinha</mark>.
        </p>
      </div>

      {/* Placar do usuário */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        {[
          { label:"Disponíveis",  val:questoes.length,      cor:T.branco },
          { label:"Respondidas",  val:resumo.respondidas,   cor:T.cinza3 },
          { label:"Acertos",      val:resumo.acertos,       cor:T.verde2 },
          { label:"Taxa",         val:`${resumo.taxa}%`,    cor:resumo.taxa>=70?T.verde2:resumo.taxa>=50?T.amarelo:T.red },
        ].map(item => (
          <div key={item.label} style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:10, padding:"10px 16px", flex:1, minWidth:80, textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:item.cor, lineHeight:1 }}>{item.val}</div>
            <div style={{ fontSize:10, color:T.cinza3, marginTop:3, fontWeight:600 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, padding:"14px 16px", marginBottom:16 }}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔎 Buscar por tema, enunciado ou fundamento…"
          style={{ width:"100%", background:T.fundo2, border:`1px solid ${T.borda2}`, borderRadius:9, padding:"10px 13px", color:T.branco, fontSize:13, outline:"none", marginBottom:12 }} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {disciplinas.map(d => (
            <button key={d} onClick={() => setFDisc(d)} className="btn" style={{
              padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:fDisc===d?700:500,
              background:fDisc===d?"rgba(0,107,63,0.2)":"transparent",
              border:`1px solid ${fDisc===d?"rgba(0,107,63,0.5)":T.borda2}`,
              color:fDisc===d?T.verde3:T.cinza3,
            }}>{d}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {DIFICULDADES.map(d => (
            <button key={d} onClick={() => setFDif(d)} className="btn" style={{
              padding:"5px 11px", borderRadius:99, fontSize:11,
              background:fDif===d?"rgba(249,194,49,0.12)":"transparent",
              border:`1px solid ${fDif===d?"rgba(249,194,49,0.35)":T.borda2}`,
              color:fDif===d?T.amarelo:T.cinza3,
            }}>{d}</button>
          ))}
          <span style={{ width:1, background:T.borda2, margin:"0 4px" }} />
          {STATUS_FILTROS.map(s => (
            <button key={s} onClick={() => setFStatus(s)} className="btn" style={{
              padding:"5px 11px", borderRadius:99, fontSize:11,
              background:fStatus===s?"rgba(139,167,191,0.12)":"transparent",
              border:`1px solid ${fStatus===s?"rgba(139,167,191,0.4)":T.borda2}`,
              color:fStatus===s?T.branco:T.cinza3,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {erro && (
        <div style={{ background:"rgba(229,62,62,0.1)", border:"1px solid rgba(229,62,62,0.3)", borderRadius:9, padding:"10px 14px", fontSize:12, color:"#FCA5A5", marginBottom:14 }}>
          {erro}
        </div>
      )}

      {carregando && <Spinner label="Carregando banco de questões…" />}

      {!carregando && !erro && filtradas.length === 0 && (
        <div style={{ background:T.fundo3, border:`1px solid ${T.borda2}`, borderRadius:13, padding:"40px 24px", textAlign:"center", color:T.cinza3 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🗂️</div>
          <p style={{ fontSize:13 }}>Nenhuma questão encontrada com esses filtros.</p>
        </div>
      )}

      {/* Botão resolver em sequência */}
      {!carregando && filtradas.length > 0 && (
        <button onClick={() => abrirQuestao(0)} className="btn" style={{
          width:"100%", padding:"13px", borderRadius:10, fontWeight:800, fontSize:14, marginBottom:14,
          background:`linear-gradient(135deg,${T.verde},${T.verde2})`, color:"#fff",
          boxShadow:`0 6px 24px rgba(0,107,63,0.3)`,
        }}>
          ▶️ Resolver {filtradas.length} questão{filtradas.length>1?"es":""} em sequência
        </button>
      )}

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(340px,1fr))", gap:12 }}>
        {filtradas.map((q, i) => {
          const minha = minhas[q.id];
          return (
            <button key={q.id} onClick={() => abrirQuestao(i)} className="btn" style={{
              background:T.fundo3, border:`1px solid ${minha ? (minha.acertou?"rgba(0,107,63,0.4)":"rgba(229,62,62,0.35)") : T.borda2}`,
              borderRadius:12, padding:"14px 16px", textAlign:"left", display:"flex", flexDirection:"column", gap:8,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <Badge color={q.origem==="fgv_real"?"verde":"cinza"}>{q.origem==="fgv_real"?"Prova real":"IA"}</Badge>
                <Badge color="amarelo">{q.dificuldade || "—"}</Badge>
                {minha && <Badge color={minha.acertou?"verde":"red"}>{minha.acertou?"✓ Acertei":"✗ Errei"}</Badge>}
              </div>
              <div>
                <div style={{ fontSize:11, color:T.verde3, fontWeight:700, marginBottom:2 }}>{q.disciplina}</div>
                <div style={{ fontSize:13, color:T.branco, fontWeight:600, lineHeight:1.4 }}>{q.tema}</div>
              </div>
              <div style={{ fontSize:12, color:T.cinza3, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {q.enunciado}
              </div>
              <div style={{ display:"flex", gap:10, fontSize:10, color:T.cinza3, marginTop:"auto" }}>
                {q.prova_referencia && <span>📌 {q.prova_referencia}</span>}
                {q.vezes_respondida > 0 && <span>👥 {q.vezes_respondida}x · {Number(q.taxa_acerto)}%</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
