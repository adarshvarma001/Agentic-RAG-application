import { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import MemoryPanel from "./MemoryPanel";
import WelcomeScreen from "./WelcomeScreen";
import { FiLoader, FiCompass } from "react-icons/fi";

export default function ChatWindow() {
  const { messages, isLoading, activeChatId, sendMessage, createNewChat } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const showWelcome    = !activeChatId;
  const loadingHistory = activeChatId && messages.length === 0 && isLoading;
  const emptyChat      = activeChatId && messages.length === 0 && !isLoading;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",        /* exactly fills parent */
      minHeight: 0,
      overflow: "hidden",    /* nothing escapes */
      background: "#0a0a0a",
    }}>

      {/* ── Header — fixed, never shrinks ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#0e0e0e",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiCompass size={14} style={{ color: "#f97316" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>
              {showWelcome ? "AP Tourism AI" : "Chat"}
            </p>
            <p style={{ fontSize: 10, color: "#444", margin: 0 }}>
              Multi-Agent RAG · Andhra Pradesh
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
            boxShadow: "0 0 8px rgba(34,197,94,0.8)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 10, color: "#555" }}>Online</span>
        </div>
      </div>

      {/* ── Messages — the ONLY scrollable area ──
          flex:1 + minHeight:0 = takes all remaining space, scrolls internally
          paddingBottom:0 = no empty space below last message               ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "16px 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        {showWelcome ? (
          <WelcomeScreen />
        ) : loadingHistory ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <FiLoader size={22} style={{ color: "#f97316", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : emptyChat ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, margin: "0 auto 12px",
                background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiCompass size={20} style={{ color: "#f97316" }} />
              </div>
              <p style={{ color: "#555", fontSize: 13 }}>Chat ready — type below</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Memory panel — sits between messages and input ── */}
      <MemoryPanel />

      {/* ── Input — always at bottom, never moves ── */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        hasActiveChat={!!activeChatId}
        createNewChat={createNewChat}
      />
    </div>
  );
}
