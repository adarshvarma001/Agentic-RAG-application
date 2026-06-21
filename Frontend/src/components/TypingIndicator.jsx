export default function TypingIndicator() {
  return (
    <div className="msg-in" style={{ display:"flex", gap:10, width:"100%" }}>
      <div style={{
        width:30, height:30, borderRadius:"50%", flexShrink:0,
        background:"#141414", border:"1px solid #222",
        display:"flex", alignItems:"center", justifyContent:"center", marginTop:2,
      }}>
        <span style={{ fontSize:9, color:"#f97316", fontWeight:700 }}>AI</span>
      </div>
      <div style={{
        padding:"13px 18px", borderRadius:"4px 16px 16px 16px",
        background:"#111", border:"1px solid #1e1e1e",
        boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:1,
          background:"linear-gradient(90deg, rgba(249,115,22,0.3), transparent 60%)",
        }}/>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {[0, 180, 360].map((d, i) => (
            <span key={i} style={{
              width:6, height:6, borderRadius:"50%",
              background:"#f97316",
              display:"inline-block",
              boxShadow:"0 0 6px rgba(249,115,22,0.7)",
              animation:`bounce 1.1s ${d}ms ease-in-out infinite`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}
