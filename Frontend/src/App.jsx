import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", background:"#0a0a0a" }}>

      {/* Ambient orange orbs */}
      <div style={{
        position:"absolute", top:"-10%", left:"-5%",
        width:"50vw", height:"50vw", maxWidth:600,
        borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)",
        animation:"orbFloat 20s ease-in-out infinite",
        zIndex:0,
      }}/>
      <div style={{
        position:"absolute", bottom:"-10%", right:"5%",
        width:"40vw", height:"40vw", maxWidth:500,
        borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 65%)",
        animation:"orbFloat 28s ease-in-out infinite reverse",
        zIndex:0,
      }}/>
      <div style={{
        position:"absolute", top:"50%", left:"55%",
        width:"25vw", height:"25vw", maxWidth:300,
        borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)",
        animation:"orbFloat 18s ease-in-out infinite 5s",
        zIndex:0,
      }}/>

      {/* Grid dot pattern */}
      <div style={{
        position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:0.018,
        backgroundImage:"radial-gradient(circle, #f97316 1px, transparent 1px)",
        backgroundSize:"28px 28px",
      }}/>

      {/* App */}
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", height:"100%", width:"100%", top:0, left:0, margin:0, padding:0 }}>
        <BrowserRouter>
          <ChatProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style:{
                  background:"#1a1a1a", color:"#f5f5f5",
                  border:"1px solid #f97316",
                  fontSize:"13px", borderRadius:"12px",
                  boxShadow:"0 0 20px rgba(249,115,22,0.2)",
                },
                success:{iconTheme:{primary:"#f97316",secondary:"#0a0a0a"}},
                error:  {iconTheme:{primary:"#ef4444",secondary:"#0a0a0a"}},
              }}
            />
            <Routes>
              <Route path="/"  element={<HomePage />}/>
              <Route path="*" element={<HomePage />}/>
            </Routes>
          </ChatProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
