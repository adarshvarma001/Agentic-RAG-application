import { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiCopy, FiCheck, FiUser, FiCpu, FiZap } from "react-icons/fi";
import WeatherCard from "./WeatherCard";
import AnalyticsRenderer from "./AnalyticsRenderer";
import toast from "react-hot-toast";

const BADGES = {
  rag:            { label:"RAG",         color:"#f97316", bg:"rgba(249,115,22,0.1)",  bd:"rgba(249,115,22,0.25)" },
  analytics:      { label:"Analytics",   color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  bd:"rgba(251,191,36,0.25)" },
  weather:        { label:"Weather",     color:"#38bdf8", bg:"rgba(56,189,248,0.1)",  bd:"rgba(56,189,248,0.25)" },
  planner:        { label:"Planner",     color:"#4ade80", bg:"rgba(74,222,128,0.1)",  bd:"rgba(74,222,128,0.25)" },
  hybrid:         { label:"Hybrid",      color:"#a78bfa", bg:"rgba(167,139,250,0.1)", bd:"rgba(167,139,250,0.25)" },
  recommendation: { label:"Recommend",   color:"#f472b6", bg:"rgba(244,114,182,0.1)", bd:"rgba(244,114,182,0.25)" },
  error:          { label:"Error",       color:"#f87171", bg:"rgba(248,113,113,0.1)", bd:"rgba(248,113,113,0.25)" },
};

const fmtTime = (iso) => {
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }); }
  catch { return ""; }
};

function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const [hov, setHov]       = useState(false);
  const { role, content, source, raw, timestamp, cached } = message;
  const isUser = role === "user";
  const badge  = BADGES[source] || BADGES.rag;

  const isWeather = source==="weather" && raw?.answer &&
    typeof raw.answer==="object" && raw.answer.location!=null;
  const chartData =
    raw?.chart_data ||
    (source==="analytics" && raw?.answer?.type==="visualization" &&
      Array.isArray(raw?.answer?.data) ? raw.answer.data : null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content || "");
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="msg-in"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"flex", gap:10, width:"100%", flexDirection: isUser?"row-reverse":"row" }}
    >
      {/* Avatar */}
      <div style={{
        width:30, height:30, borderRadius:"50%", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center", marginTop:2,
        background: isUser ? "linear-gradient(135deg, #f97316, #ea580c)" : "#141414",
        border: isUser ? "none" : "1px solid #222",
        boxShadow: isUser ? "0 0 14px rgba(249,115,22,0.4)" : "none",
      }}>
        {isUser ? <FiUser size={13} style={{ color:"#fff" }}/> : <FiCpu size={13} style={{ color:"#f97316" }}/>}
      </div>

      {/* Content */}
      <div style={{
        display:"flex", flexDirection:"column", gap:5,
        maxWidth:"78%", alignItems: isUser?"flex-end":"flex-start",
      }}>
        {/* Badge */}
        {!isUser && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{
              fontSize:10, padding:"2px 8px", borderRadius:99,
              background: badge.bg, border:`1px solid ${badge.bd}`,
              color: badge.color, fontWeight:600,
            }}>{badge.label}</span>
            {cached && (
              <span style={{
                display:"flex", alignItems:"center", gap:3,
                fontSize:10, padding:"2px 7px", borderRadius:99,
                background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.2)",
                color:"#fb923c",
              }}><FiZap size={8}/> Cached</span>
            )}
          </div>
        )}

        {/* Body */}
        {isUser ? (
          <div style={{
            background:"#1a1a1a",
            border:"1px solid rgba(249,115,22,0.2)",
            borderRadius:"16px 16px 4px 16px",
            padding:"10px 15px", fontSize:13.5, color:"#f5f5f5", lineHeight:1.6,
            boxShadow:"0 0 0 1px rgba(249,115,22,0.06), 0 4px 16px rgba(0,0,0,0.3)",
          }}>
            {content}
          </div>

        ) : isWeather ? (
          <WeatherCard data={raw.answer}/>

        ) : chartData ? (
          <div style={{ width:"100%", minWidth:280, maxWidth:560 }}>
            <AnalyticsRenderer data={chartData} title="Analytics Result"/>
            {content && (
              <div style={{
                marginTop:8, padding:"10px 14px", borderRadius:12,
                background:"#111", border:"1px solid #1e1e1e",
              }}>
                <p style={{ color:"#aaa", fontSize:13, margin:0 }}>{content}</p>
              </div>
            )}
          </div>

        ) : (
          <div
            className="prose-invert prose-sm"
            style={{
              background:"#111",
              border:"1px solid #1e1e1e",
              borderRadius:"4px 16px 16px 16px",
              padding:"12px 16px", fontSize:13.5, lineHeight:1.75,
              boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
              maxWidth:"none",
              position:"relative", overflow:"hidden",
            }}
          >
            {/* Subtle orange top line */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:1,
              background:"linear-gradient(90deg, rgba(249,115,22,0.3), transparent 60%)",
              pointerEvents:"none",
            }}/>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ""}</ReactMarkdown>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display:"flex", alignItems:"center", gap:8,
          opacity: hov ? 1 : 0, transition:"opacity 0.15s",
          flexDirection: isUser?"row-reverse":"row",
        }}>
          <span style={{ fontSize:10, color:"#333" }}>{fmtTime(timestamp)}</span>
          {!isUser && content && (
            <button onClick={handleCopy} style={{
              background:"none", border:"none", cursor:"pointer",
              color:"#333", display:"flex", padding:0, transition:"color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color="#f97316"}
              onMouseLeave={e => e.currentTarget.style.color="#333"}
            >
              {copied ? <FiCheck size={11} style={{ color:"#4ade80" }}/> : <FiCopy size={11}/>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
