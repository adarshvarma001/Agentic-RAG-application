import {
  createContext, useContext, useState,
  useCallback, useEffect, useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  createNewChatApi,
  sendChatMessage,
  getChatHistory,
  getMemory,
  getAllChats,
} from "../services/api";
import toast from "react-hot-toast";

const ChatContext = createContext(null);

// ── helpers ────────────────────────────────────────────────────
const LS_ACTIVE = "ap_active_chat_id";

const buildMsg = (role, content, source = "rag", raw = null) => ({
  id: uuidv4(),
  role,
  content,
  source,
  raw,
  timestamp: new Date().toISOString(),
  cached: false,
});

// ── provider ───────────────────────────────────────────────────
export const ChatProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [allChats,    setAllChats]      = useState([]);   // [{ chat_id, title }] from backend
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages,    setMessages]      = useState([]);
  const [isLoading,   setIsLoading]     = useState(false);
  const [memory,      setMemory]        = useState(null);
  const [search,      setSearch]        = useState("");

  // streaming-ready ref (future SSE/WS)
  const abortRef = useRef(null);

  // ── boot: restore last active chat ──────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(LS_ACTIVE);
    // load sidebar list first
    fetchAllChats().then(() => {
      if (saved) restoreChat(saved);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── fetch all chats for sidebar ──────────────────────────────
  const fetchAllChats = useCallback(async () => {
    try {
      const data = await getAllChats(); // [{ chat_id, title }]
      setAllChats(Array.isArray(data) ? data : []);
    } catch {
      // backend not yet running — silently ignore
    }
  }, []);

  // ── restore chat on refresh ───────────────────────────────────
  const restoreChat = useCallback(async (chatId) => {
    if (!chatId) return;
    setActiveChatId(chatId);
    localStorage.setItem(LS_ACTIVE, chatId);
    // Don't setIsLoading here — causes blank spinner on boot
    try {
      const history = await getChatHistory(chatId);
      const mapped  = (history || []).map((m) =>
        buildMsg(m.role, m.content, m.role === "user" ? "user" : "rag", null)
      );
      setMessages(mapped);
      const mem = await getMemory(chatId);
      setMemory(mem);
    } catch {
      // Stale chat_id — clear it
      localStorage.removeItem(LS_ACTIVE);
      setActiveChatId(null);
      setMessages([]);
    }
  }, []);

  // ── NEW CHAT — always call backend ───────────────────────────
  const createNewChat = useCallback(async () => {
    // Don't set isLoading here — it blocks the input immediately after creation
    try {
      const { chat_id } = await createNewChatApi(); // POST /new-chat
      setActiveChatId(chat_id);
      localStorage.setItem(LS_ACTIVE, chat_id);
      setMessages([]);
      setMemory(null);
      fetchAllChats(); // fire and forget — sidebar refresh
      return chat_id;
    } catch {
      toast.error("Could not create chat. Is the backend running?");
      return null;
    }
  }, [fetchAllChats]);

  // ── load existing chat ────────────────────────────────────────
  const loadChat = useCallback(async (chatId) => {
    if (chatId === activeChatId) return;
    setActiveChatId(chatId);
    localStorage.setItem(LS_ACTIVE, chatId);
    setMessages([]);
    setMemory(null);
    setIsLoading(true);
    try {
      const history = await getChatHistory(chatId); // GET /chat-history?chat_id=
      const mapped  = (history || []).map((m) =>
        buildMsg(m.role, m.content, m.role === "user" ? "user" : "rag", null)
      );
      setMessages(mapped);
      const mem = await getMemory(chatId);
      setMemory(mem);
    } catch {
      setMessages([]);
      toast.error("Failed to load chat history.");
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId]);

  // ── SEND MESSAGE ──────────────────────────────────────────────
  // chatIdOverride: used by WelcomeScreen to pass freshly-created id
  // without waiting for activeChatId state to update
  const sendMessage = useCallback(async (query, chatIdOverride) => {
    const resolvedId = chatIdOverride || activeChatId;
    if (!resolvedId) {
      toast.error("Please create a new chat first.");
      return;
    }

    // Cancel any in-flight request (streaming-ready)
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    // Optimistically add user message
    const userMsg = buildMsg("user", query, "user", null);
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Frontend ONLY sends { chat_id, query } — backend resolves all context
      const data = await sendChatMessage(resolvedId, query);
      const elapsed = Date.now() - startTime;

      // Determine display content
      let displayContent = "";
      if (typeof data.answer === "string") {
        displayContent = data.answer;
      } else if (data.source === "weather" && typeof data.answer === "object") {
        displayContent = data.answer?.recommendation || "";
      } else if (data.source === "analytics") {
        displayContent = data.answer?.answer || "";
      } else {
        displayContent = JSON.stringify(data.answer, null, 2);
      }

      const assistantMsg = {
        ...buildMsg("assistant", displayContent, data.source || "rag", data),
        cached: elapsed < 400, // Redis cache badge if suspiciously fast
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh sidebar (title appears after first message)
      fetchAllChats(); // fire and forget

      // Refresh memory
      try {
        const mem = await getMemory(resolvedId);
        setMemory(mem);
      } catch {}
    } catch (err) {
      if (err.name === "CanceledError") return; // aborted
      toast.error("Backend unreachable. Is the server running on port 8000?");
      setMessages((prev) => [
        ...prev,
        buildMsg(
          "assistant",
          "Sorry, I couldn't reach the server. Please make sure the backend is running.",
          "error",
          null
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, fetchAllChats]);

  // ── sidebar search (filters allChats) ────────────────────────
  const filteredChats = allChats.filter(
    (c) =>
      !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.chat_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ChatContext.Provider
      value={{
        // state
        sidebarOpen, setSidebarOpen,
        allChats: filteredChats,
        activeChatId,
        messages,
        isLoading,
        memory,
        search, setSearch,
        // actions
        createNewChat,
        loadChat,
        sendMessage,
        fetchAllChats,
        clearMessages: () => { setMessages([]); setMemory(null); },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
