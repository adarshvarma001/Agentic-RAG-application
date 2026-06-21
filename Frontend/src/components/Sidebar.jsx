import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiPlus, FiSearch, FiMessageSquare, FiBarChart2, FiRefreshCw, FiCompass, FiLoader } from "react-icons/fi";

function ChatRow({ chat, active, onClick }) {
  const [hov, setHov] = useState(false);
  const title = (chat.title || "Untitled").slice(0, 28);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"9px 10px", borderRadius:10, cursor:"pointer", marginBottom:2,
        background: active ? "rgba(249,115,22,0.12)" : hov ? "#161616" : "transparent",
        border: active ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent",
        transition:"all 0.15s",
        position:"relative", overflow:"hidden",
      }}
    >
      {active && (
        <div style={{
          position:"absolute", left:0, top:"20%", bottom:"20%", width:2,
          background:"#f97316", borderRadius:1,
          boxShadow:"0 0 8px rgba(249,115,22,0.8)",
        }}/>
      )}
      <div style={{
        width:5, height:5, borderRadius:"50%", flexShrink:0,
        background: active ? "#f97316" : "#333",
        boxShadow: active ? "0 0 6px rgba(249,115,22,0.9)" : "none",
        transition:"all 0.15s",
      }}/>
      <span style={{
        fontSize:12.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        color: active ? "#fff" : "#666",
        fontWeight: active ? 500 : 400,
        transition:"color 0.15s",
      }}>
        {title}
      </span>
    </div>
  );
}

export default function Sidebar({ activeTab, setTab }) {
  const { allChats, activeChatId, createNewChat, loadChat, fetchAllChats, search, setSearch } = useChat();
  const [creating, setCreating] = useState(false);
  const [sFocus, setSFocus]     = useState(false);

  const handleNew = async () => {
    setCreating(true);
    await createNewChat();
    setCreating(false);
    setTab("chat");
  };

  return (
    <div style={{
      width:252, flexShrink:0, height:"100%", minHeight:0,
      background:"#0e0e0e",
      borderRight:"1px solid #1a1a1a",
      display:"flex", flexDirection:"column",
      overflow:"hidden", position:"relative",
    }}>
      {/* Orange accent line on right */}
      <div style={{
        position:"absolute", top:0, right:0, bottom:0, width:1,
        background:"linear-gradient(to bottom, transparent, rgba(249,115,22,0.2) 40%, rgba(249,115,22,0.1) 70%, transparent)",
        pointerEvents:"none",
      }}/>

      {/* Logo */}
      <div style={{ padding:"18px 16px 12px", flexShrink:0, borderBottom:"1px solid #1a1a1a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:10, flexShrink:0,
            background:"linear-gradient(135deg, #f97316, #ea580c)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 20px rgba(249,115,22,0.4), 0 4px 12px rgba(0,0,0,0.5)",
            animation:"pulseGlow 3s ease-in-out infinite",
          }}>
            <FiCompass size={17} style={{ color:"#fff" }}/>
          </div>
          <div>
            <p style={{ fontSize:13.5, fontWeight:700, color:"#fff", lineHeight:1.2, letterSpacing:"-0.01em" }}>
              AP Tourism
            </p>
            <p style={{ fontSize:9.5, color:"#555", letterSpacing:"0.1em", lineHeight:1 }}>
              AI ASSISTANT
            </p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", padding:"10px 10px 8px", gap:4, flexShrink:0 }}>
        {[
          { id:"chat",      Icon:FiMessageSquare, label:"Chat" },
          { id:"analytics", Icon:FiBarChart2,     label:"Analytics" },
        ].map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center",
            gap:5, padding:"7px 0", borderRadius:9, border:"none", cursor:"pointer",
            background: activeTab===id ? "rgba(249,115,22,0.12)" : "transparent",
            border: activeTab===id ? "1px solid rgba(249,115,22,0.25)" : "1px solid #1e1e1e",
            color: activeTab===id ? "#f97316" : "#555",
            fontSize:12, fontWeight: activeTab===id ? 600 : 400,
            transition:"all 0.15s",
          }}>
            <Icon size={12}/>{label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding:"0 10px 8px", flexShrink:0 }}>
        <div style={{
          display:"flex", alignItems:"center", gap:7,
          padding:"8px 12px", borderRadius:10,
          background:"#141414",
          border: sFocus ? "1px solid rgba(249,115,22,0.4)" : "1px solid #1e1e1e",
          boxShadow: sFocus ? "0 0 0 2px rgba(249,115,22,0.08)" : "none",
          transition:"all 0.15s",
        }}>
          <FiSearch size={12} style={{ color:"#444", flexShrink:0 }}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSFocus(true)}
            onBlur={() => setSFocus(false)}
            placeholder="Search chats…"
            style={{ background:"none", border:"none", outline:"none", color:"#f5f5f5", fontSize:12.5, width:"100%" }}
          />
        </div>
      </div>

      {/* Label */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px 4px", flexShrink:0 }}>
        <span style={{ fontSize:9.5, color:"#333", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em" }}>
          {allChats.length} Chats
        </span>
        <button onClick={fetchAllChats} style={{
          background:"none", border:"none", cursor:"pointer", color:"#333",
          display:"flex", padding:2, transition:"color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color="#f97316"}
          onMouseLeave={e => e.currentTarget.style.color="#333"}
        >
          <FiRefreshCw size={11}/>
        </button>
      </div>

      {/* Chat list */}
      <div style={{ flex:1, minHeight:0, overflowY:"auto", padding:"2px 8px 0" }}>
        {allChats.length === 0 && (
          <div style={{ textAlign:"center", padding:"36px 12px" }}>
            <FiMessageSquare size={22} style={{ color:"#222", display:"block", margin:"0 auto 8px" }}/>
            <p style={{ fontSize:11.5, color:"#333" }}>No chats yet</p>
            <p style={{ fontSize:10.5, color:"#2a2a2a", marginTop:3 }}>Create one below</p>
          </div>
        )}
        {allChats.map(c => (
          <ChatRow key={c.chat_id} chat={c} active={activeChatId===c.chat_id}
            onClick={() => { loadChat(c.chat_id); setTab("chat"); }}
          />
        ))}
      </div>

      {/* New chat — orange pill button */}
      <div style={{ padding:"10px 10px 10px", flexShrink:0, borderTop:"1px solid #1a1a1a" }}>
        <button
          onClick={handleNew}
          disabled={creating}
          style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 14px", borderRadius:12, border:"none",
            background:"linear-gradient(135deg, #f97316, #ea580c)",
            color:"#fff", fontSize:13, fontWeight:700,
            cursor: creating ? "not-allowed" : "pointer",
            opacity: creating ? 0.7 : 1,
            boxShadow:"0 0 24px rgba(249,115,22,0.35), 0 4px 12px rgba(0,0,0,0.4)",
            transition:"all 0.2s",
            position:"relative", overflow:"hidden",
          }}
          onMouseEnter={e => { if(!creating){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 0 36px rgba(249,115,22,0.5), 0 8px 20px rgba(0,0,0,0.4)"; } }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 0 24px rgba(249,115,22,0.35), 0 4px 12px rgba(0,0,0,0.4)"; }}
        >
          {/* Shimmer */}
          <div style={{
            position:"absolute", top:0, height:"100%", width:"40%",
            background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation:"shimmer 2.5s ease-in-out infinite", pointerEvents:"none",
          }}/>
          <span>{creating ? "Creating…" : "New chat"}</span>
          <div style={{
            width:26, height:26, borderRadius:8,
            background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {creating ? <FiLoader size={13} style={{ animation:"spin 0.8s linear infinite" }}/> : <FiPlus size={13}/>}
          </div>
        </button>
      </div>
    </div>
  );
}
