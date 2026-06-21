import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiCompass, FiMap, FiCloud, FiSun, FiStar, FiTrendingUp, FiPlus, FiZap } from "react-icons/fi";

const CARDS = [
  { icon: FiCompass,    text: "Tell me about Araku Valley" },
  { icon: FiMap,        text: "Plan a 2-day trip to Vijayawada" },
  { icon: FiCloud,      text: "Weather in Lambasingi" },
  { icon: FiSun,        text: "Best beaches in Andhra Pradesh" },
  { icon: FiStar,       text: "Famous foods in AP" },
  { icon: FiTrendingUp, text: "Tourism trends in AP" },
];

const AGENTS = ["RAG", "Weather", "Planner", "Hybrid", "Analytics", "Recommendation"];

function Card({ icon: Icon, text, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"flex-start", gap:10,
        padding:"14px 14px", borderRadius:14, textAlign:"left",
        background: hov ? "#161616" : "#111",
        border: hov ? "1px solid rgba(249,115,22,0.4)" : "1px solid #1e1e1e",
        cursor:"pointer",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.1)" : "none",
        transition:"all 0.2s cubic-bezier(0.34,1.1,0.64,1)",
        position:"relative", overflow:"hidden",
      }}
    >
      {hov && (
        <div style={{
          position:"absolute", top:0, height:"100%", width:"40%",
          background:"linear-gradient(90deg, transparent, rgba(249,115,22,0.06), transparent)",
          animation:"shimmer 1.2s ease-in-out",
          pointerEvents:"none",
        }}/>
      )}
      <div style={{
        width:30, height:30, borderRadius:9, flexShrink:0,
        background: hov ? "rgba(249,115,22,0.15)" : "#1a1a1a",
        border: hov ? "1px solid rgba(249,115,22,0.35)" : "1px solid #252525",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow: hov ? "0 0 10px rgba(249,115,22,0.25)" : "none",
        transition:"all 0.18s",
      }}>
        <Icon size={14} style={{ color: hov ? "#f97316" : "#555" }}/>
      </div>
      <span style={{
        fontSize:13, lineHeight:1.4,
        color: hov ? "#f0f0f0" : "#666",
        transition:"color 0.15s",
      }}>
        {text}
      </span>
    </button>
  );
}

export default function WelcomeScreen() {
  const { createNewChat, sendMessage } = useChat();

  const handleCard = async (text) => {
    const id = await createNewChat();
    if (id) sendMessage(text, id);
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      flex:1, padding:"24px 20px", gap:24, overflowY:"auto",
    }}>

      {/* Hero card */}
      <div style={{
        borderRadius:24, padding:"32px 36px",
        maxWidth:540, width:"100%", textAlign:"center",
        background:"#0e0e0e",
        border:"1px solid #1e1e1e",
        boxShadow:"0 0 0 1px rgba(249,115,22,0.06), 0 24px 60px rgba(0,0,0,0.5)",
        position:"relative", overflow:"hidden",
      }}>
        {/* Orange top line */}
        <div style={{
          position:"absolute", top:0, left:"15%", right:"15%", height:1,
          background:"linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)",
        }}/>
        {/* Corner glow */}
        <div style={{
          position:"absolute", top:-40, right:-40, width:120, height:120,
          borderRadius:"50%", pointerEvents:"none",
          background:"radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        }}/>

        {/* Logo */}
        <div style={{ position:"relative", width:64, height:64, margin:"0 auto 20px" }}>
          <div style={{
            position:"absolute", inset:-10, borderRadius:22,
            background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.12)",
            animation:"float 3s ease-in-out infinite",
          }}/>
          <div style={{
            width:64, height:64, borderRadius:18, position:"relative",
            background:"linear-gradient(135deg, #f97316, #ea580c)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 40px rgba(249,115,22,0.4), 0 8px 24px rgba(0,0,0,0.6)",
          }}>
            <FiCompass size={28} style={{ color:"#fff" }}/>
          </div>
        </div>

        <h1 style={{
          fontSize:"clamp(22px,3vw,32px)", fontWeight:800,
          color:"#fff", margin:"0 0 10px",
          letterSpacing:"-0.03em", lineHeight:1.2,
        }}>
          How can I help you
          <br/>
          <span style={{ color:"#f97316" }}>explore AP today?</span>
        </h1>
        <p style={{ color:"#555", fontSize:13.5, lineHeight:1.65, maxWidth:340, margin:"0 auto" }}>
          Destinations, trips, weather, food, festivals and tourism analytics.
        </p>

        {/* Agent dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:18 }}>
          {AGENTS.map(a => (
            <span key={a} style={{
              fontSize:9, padding:"3px 8px", borderRadius:99,
              background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.18)",
              color:"rgba(249,115,22,0.7)", fontWeight:600, letterSpacing:"0.04em",
            }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestion cards */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(185px, 1fr))",
        gap:8, width:"100%", maxWidth:680,
      }}>
        {CARDS.map((c, i) => (
          <Card key={i} icon={c.icon} text={c.text} onClick={() => handleCard(c.text)}/>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={createNewChat}
        style={{
          display:"flex", alignItems:"center", gap:9,
          padding:"12px 26px", borderRadius:999, border:"none",
          background:"linear-gradient(135deg, #f97316, #ea580c)",
          color:"#fff", fontSize:13, fontWeight:700,
          cursor:"pointer",
          boxShadow:"0 0 28px rgba(249,115,22,0.35), 0 4px 12px rgba(0,0,0,0.4)",
          transition:"all 0.2s",
          position:"relative", overflow:"hidden",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 44px rgba(249,115,22,0.55), 0 8px 20px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 0 28px rgba(249,115,22,0.35), 0 4px 12px rgba(0,0,0,0.4)"; }}
      >
        <div style={{
          width:22, height:22, borderRadius:7,
          background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <FiPlus size={13}/>
        </div>
        Start a New Conversation
      </button>

      <p style={{ fontSize:11, color:"#333" }}>or type below ↓</p>
    </div>
  );
}
