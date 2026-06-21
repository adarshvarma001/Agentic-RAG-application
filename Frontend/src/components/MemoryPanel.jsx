import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiChevronDown, FiChevronUp, FiMapPin, FiCoffee, FiStar, FiCalendar, FiBook, FiMessageCircle } from "react-icons/fi";

const KEY_META = {
  destination: { icon: FiMapPin,        color: "#f97316" },
  foods:       { icon: FiCoffee,        color: "#fbbf24" },
  food:        { icon: FiCoffee,        color: "#fbbf24" },
  temples:     { icon: FiStar,          color: "#fbbf24" },
  temple:      { icon: FiStar,          color: "#fbbf24" },
  festivals:   { icon: FiCalendar,      color: "#f472b6" },
  festival:    { icon: FiCalendar,      color: "#f472b6" },
  history:     { icon: FiMessageCircle, color: "#a78bfa" },
};

export default function MemoryPanel() {
  const { memory, activeChatId } = useChat();
  const [open, setOpen] = useState(false);

  if (!memory || !activeChatId) return null;

  const entries = Object.entries(memory).filter(([k,v]) => k!=="history" && Array.isArray(v) && v.length>0);
  const histCount = Array.isArray(memory.history) ? memory.history.length : 0;
  if (entries.length===0 && histCount===0) return null;

  return (
    <div style={{ borderTop:"1px solid #1a1a1a", background:"#0e0e0e", flexShrink:0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"7px 16px", background:"none", border:"none", cursor:"pointer", color:"#555",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <FiBook size={10} style={{ color:"#555" }}/>
          <span style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Memory Context
          </span>
          {entries.length>0 && (
            <span style={{ fontSize:9, padding:"1px 6px", borderRadius:99, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.2)", color:"#f97316" }}>
              {entries.length}
            </span>
          )}
          {histCount>0 && (
            <span style={{ fontSize:9, padding:"1px 6px", borderRadius:99, background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.15)", color:"#a78bfa" }}>
              {histCount} queries
            </span>
          )}
        </div>
        {open ? <FiChevronDown size={11}/> : <FiChevronUp size={11}/>}
      </button>

      {open && (
        <div style={{ padding:"0 12px 10px", display:"flex", flexDirection:"column", gap:6 }}>
          {entries.length>0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))", gap:6 }}>
              {entries.map(([key, values]) => {
                const meta = KEY_META[key.toLowerCase()] || { icon:FiBook, color:"#f97316" };
                const Icon = meta.icon;
                return (
                  <div key={key} style={{ borderRadius:10, padding:"8px 10px", background:"#141414", border:"1px solid #1e1e1e" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
                      <Icon size={10} style={{ color:meta.color }}/>
                      <span style={{ fontSize:10, color:meta.color, fontWeight:600, textTransform:"capitalize" }}>{key}</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {[...new Set(values)].map((v,i) => (
                        <span key={i} style={{ fontSize:10, padding:"2px 6px", borderRadius:5, background:"#1a1a1a", color:"#888", border:"1px solid #222" }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {histCount>0 && (
            <div style={{ borderRadius:10, padding:"8px 10px", background:"#141414", border:"1px solid #1e1e1e" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
                <FiMessageCircle size={10} style={{ color:"#a78bfa" }}/>
                <span style={{ fontSize:10, color:"#a78bfa", fontWeight:600 }}>Queries ({histCount})</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:2, maxHeight:56, overflowY:"auto" }}>
                {memory.history.slice(-5).map((q,i) => (
                  <p key={i} style={{ fontSize:10, color:"#444", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
