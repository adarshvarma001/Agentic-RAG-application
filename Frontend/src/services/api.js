import axios from "axios";

// Empty string = relative URLs → Vite dev proxy forwards to localhost:8000
// This avoids CORS completely. Never set VITE_API_URL to http://localhost:8000
// unless you add flask-cors to the backend.
const BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// ── Endpoints ────────────────────────────────────────────────

/** POST /new-chat → { chat_id: "uuid" } */
export const createNewChatApi = async () => {
  const res = await api.post("/new-chat");
  return res.data;
};

/** POST /chat → { source, answer } */
export const sendChatMessage = async (chat_id, query) => {
  const res = await api.post("/chat", { chat_id, query });
  return res.data;
};

/** GET /all-chats → [{ chat_id, title }] */
export const getAllChats = async () => {
  const res = await api.get("/all-chats");
  return res.data;
};

/** GET /chat-history?chat_id=uuid → [{ role, content }] */
export const getChatHistory = async (chat_id) => {
  const res = await api.get(`/chat-history?chat_id=${chat_id}`);
  return res.data;
};

/** GET /memory?chat_id=uuid → { destination:[...], history:[...], ... } */
export const getMemory = async (chat_id) => {
  const res = await api.get(`/memory?chat_id=${chat_id}`);
  return res.data;
};

/** POST /analytics/trend → { type, data|answer } */
export const getAnalyticsTrend = async (query) => {
  const res = await api.post("/analytics/trend", { query });
  return res.data;
};

export default api;
