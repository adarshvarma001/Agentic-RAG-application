import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import AnalyticsPage from "./AnalyticsPage";

export default function HomePage() {
  const [tab, setTab] = useState("chat");

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      overflow: "hidden",
    }}>
      {/* Sidebar — fixed width, full height, never resizes */}
      <Sidebar activeTab={tab} setTab={setTab} />

      {/* Main content — takes remaining space */}
      <div style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {tab === "chat" ? <ChatWindow /> : <AnalyticsPage />}
      </div>
    </div>
  );
}
