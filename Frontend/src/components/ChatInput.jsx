import { useState, useRef, useEffect } from "react";
import { FiSend, FiCloud, FiMap, FiCoffee, FiStar, FiCalendar, FiLoader } from "react-icons/fi";

const QUICK = [
  { icon: FiCloud,    label: "Weather",   query: "What is the current weather?" },
  { icon: FiMap,      label: "Trip Plan", query: "Plan a trip to " },
  { icon: FiCoffee,   label: "Foods",     query: "What are the famous foods?" },
  { icon: FiStar,     label: "Temples",   query: "What are the famous temples?" },
  { icon: FiCalendar, label: "Festivals", query: "What are the upcoming festivals?" },
];

function Pill({ icon: Icon, label, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 999,
        background: hov ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.04)",
        border: hov ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.07)",
        color: hov ? "#f97316" : "#555",
        fontSize: 11.5, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.15s",
      }}
    >
      <Icon size={10} />{label}
    </button>
  );
}

export default function ChatInput({ onSend, isLoading, hasActiveChat, createNewChat }) {
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const textareaRef        = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const doSend = async (text) => {
    const q = (text || input).trim();
    if (!q || isLoading) return;
    if (!hasActiveChat) {
      const id = await createNewChat();
      if (id) onSend(q, id);
    } else {
      onSend(q);
    }
    setInput("");
  };

  const canSend = !!input.trim() && !isLoading;

  return (
    /* ── Wrapper: zero padding/margin everywhere, no background ── */
    <div style={{
      flexShrink: 0,
      flexBasis: "auto",
      display: "flex",
      flexDirection: "column",
      padding: 0,
      paddingBottom: 12,
      margin: 0,
      background: "transparent",
    }}>

      {/* Quick pills */}
      <div style={{
        display: "flex", gap: 5, flexWrap: "wrap",
        justifyContent: "center",
        padding: "6px 16px 0",
        margin: 0,
      }}>
        {QUICK.map(a => (
          <Pill
            key={a.label} icon={a.icon} label={a.label} disabled={isLoading}
            onClick={() => {
              if (a.query.endsWith(" ")) { setInput(a.query); textareaRef.current?.focus(); }
              else doSend(a.query);
            }}
          />
        ))}
      </div>

      {/* Pill-shaped input island */}
      <div style={{
        maxWidth: 740,
        width: "calc(100% - 32px)",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        marginBottom: 0,
        borderRadius: 999,
        padding: "6px 6px 6px 20px",
        display: "flex", alignItems: "center", gap: 6,
        background: "#111",
        border: focus ? "1px solid rgba(249,115,22,0.5)" : "1px solid #222",
        boxShadow: focus
          ? "0 0 0 3px rgba(249,115,22,0.07), 0 4px 20px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.2s",
        position: "relative",
      }}>
        {focus && (
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)",
            borderRadius: 1, pointerEvents: "none",
          }} />
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Ask about destinations, weather, trips, analytics…"
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            color: "#f5f5f5", fontSize: 14, resize: "none",
            lineHeight: 1.5, padding: "7px 0",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => doSend()} disabled={!canSend}
          style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: canSend ? "linear-gradient(135deg, #f97316, #ea580c)" : "#1e1e1e",
            border: "none",
            cursor: canSend ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: canSend ? "#fff" : "#333",
            boxShadow: canSend ? "0 0 16px rgba(249,115,22,0.5)" : "none",
            transition: "all 0.18s",
          }}
          onMouseEnter={e => { if (canSend) { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(249,115,22,0.7)"; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = canSend ? "0 0 16px rgba(249,115,22,0.5)" : "none"; }}
        >
          {isLoading
            ? <FiLoader size={14} style={{ animation: "spin 0.8s linear infinite" }} />
            : <FiSend size={14} />
          }
        </button>
      </div>
    </div>
  );
}
