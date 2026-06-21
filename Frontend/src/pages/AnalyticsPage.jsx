import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAnalyticsTrend } from "../services/api";
import AnalyticsRenderer from "../components/AnalyticsRenderer";
import { FiBarChart2, FiSearch, FiTrendingUp, FiPieChart, FiLoader, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";

const PRESETS = [
  "Show yearly visitor trend",
  "Show district wise tourist count",
  "Top visited destinations in AP",
  "Monthly tourism statistics for Visakhapatnam",
  "Festival-wise tourist growth in AP",
  "Hotel occupancy trends in AP",
  "Weather impact on tourism in AP",
  "Compare domestic vs foreign visitors",
];

function PresetPill({ label, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 11.5, padding: "5px 12px", borderRadius: 999,
        background: hov ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
        border: hov ? "1px solid rgba(255,255,255,0.32)" : "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        color: hov ? "#fff" : "rgba(255,255,255,0.55)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        boxShadow: hov ? "inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
        transition: "all 0.15s",
        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </button>
  );
}

export default function AnalyticsPage() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const run = async (q) => {
    const finalQuery = (q || query).trim();
    if (!finalQuery) return;
    setLoading(true);
    try {
      const data = await getAnalyticsTrend(finalQuery);
      const isViz     = data?.type === "visualization" && Array.isArray(data?.data);
      const isSummary = data?.type === "summary" && typeof data?.answer === "string";
      setResults(prev => [{
        id: Date.now(), query: finalQuery, type: data?.type || "unknown",
        chartData: isViz ? data.data : null,
        answer:    isSummary ? data.answer : null,
      }, ...prev]);
    } catch {
      toast.error("Analytics query failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px", flexShrink: 0,
        background: "rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          }}>
            <FiBarChart2 size={14} style={{ color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              Analytics Dashboard
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>
              POST /analytics/trend
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 20px" }}>

        {/* Search bar — glass island */}
        <div style={{ maxWidth: 760, margin: "0 auto 12px", display: "flex", gap: 8 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 16,
            background: "rgba(255,255,255,0.1)",
            border: focused ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            boxShadow: focused
              ? "inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 3px rgba(255,255,255,0.06)"
              : "inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "all 0.2s",
          }}>
            <FiSearch size={14} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && run()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. Show yearly visitor trend"
              style={{
                background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: 13.5, flex: 1,
              }}
            />
          </div>
          <button
            onClick={() => run()}
            disabled={loading || !query.trim()}
            style={{
              padding: "10px 20px", borderRadius: 14, flexShrink: 0,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px)",
              color: "#fff", fontWeight: 600, fontSize: 13,
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              opacity: loading || !query.trim() ? 0.5 : 1,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {loading ? <FiLoader size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : "Analyze"}
          </button>
        </div>

        {/* Preset pills */}
        <div style={{ maxWidth: 760, margin: "0 auto 20px" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            Quick Queries
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PRESETS.map(p => (
              <PresetPill key={p} label={p} disabled={loading} onClick={() => run(p)} />
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 150, 300].map(d => (
                <div key={d} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "rgba(255,255,255,0.6)",
                  animation: `bounce 1s ${d}ms ease-in-out infinite`,
                  boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              <FiPieChart size={22} style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 14, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>No analytics yet</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 6 }}>
              Try "Show yearly visitor trend"
            </p>
          </div>
        )}

        {/* Results */}
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {results.map(r => (
            <div key={r.id}>
              {/* Query label */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <FiTrendingUp size={13} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                  {r.query}
                </p>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 99,
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.6)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                  {r.type === "visualization" ? "Chart" : "Summary"}
                </span>
              </div>

              {/* Chart */}
              {r.chartData && <AnalyticsRenderer data={r.chartData} />}

              {/* Summary — glass card */}
              {r.answer && (
                <div style={{
                  borderRadius: 16, padding: "16px 18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.2)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    pointerEvents: "none",
                  }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <FiFileText size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                      Data Summary
                    </span>
                  </div>
                  <div className="prose-invert prose-sm" style={{ maxWidth: "none" }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{r.answer}</ReactMarkdown>
                  </div>
                </div>
              )}

              {!r.chartData && !r.answer && (
                <div style={{
                  borderRadius: 14, padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: 0 }}>No data returned.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
