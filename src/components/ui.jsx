import { T } from "../theme.js";

export function Badge({ children, color="verde", style={} }) {
  const map = {
    verde:   { bg:"rgba(0,107,63,0.15)",   border:"rgba(0,107,63,0.4)",    color:T.verde2 },
    amarelo: { bg:"rgba(249,194,49,0.10)", border:"rgba(249,194,49,0.3)",  color:T.amarelo },
    cinza:   { bg:"rgba(255,255,255,0.06)",border:T.borda2,                color:T.cinza3 },
    red:     { bg:"rgba(229,62,62,0.12)",  border:"rgba(229,62,62,0.3)",   color:"#FCA5A5" },
  };
  const s = map[color]||map.verde;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:5,background:s.bg,border:`1px solid ${s.border}`,borderRadius:100,padding:"3px 11px",fontSize:11,fontWeight:700,color:s.color,...style }}>{children}</span>;
}

export function Spinner({ label="" }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:48,gap:14 }}>
      <div style={{ width:36,height:36,borderRadius:"50%",border:`3px solid ${T.borda2}`,borderTopColor:T.verde2,animation:"spin 0.8s linear infinite" }} />
      {label && <p style={{ color:T.cinza3,fontSize:13 }}>{label}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
