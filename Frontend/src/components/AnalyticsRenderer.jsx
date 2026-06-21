import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const PALETTE = ["#93c5fd", "#86efac", "#fde68a", "#f9a8d4", "#a5b4fc", "#6ee7b7", "#fca5a5"];

const fmtNum = (v) => {
  if (typeof v !== "number") return v;
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (Math.abs(v) >= 1_000)     return (v / 1_000).toFixed(1) + "K";
  return v.toLocaleString();
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.3)",
      fontSize: 12, minWidth: 140,
    }}>
      {label !== undefined && (
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 6, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 4 }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600, margin: "2px 0" }}>
          {p.name}: {fmtNum(p.value)}
        </p>
      ))}
    </div>
  );
};

const parseKeys = (data) => {
  if (!data?.length) return { xKey: "name", numKeys: ["value"] };
  const keys = Object.keys(data[0]);
  const sample = data[0];
  const xCandidates = keys.filter(k =>
    /^(year|date|month|quarter|week|period|name|label|district|destination|category|type|region)$/i.test(k) ||
    typeof sample[k] === "string"
  );
  const xKey = xCandidates[0] || keys[0];
  const numKeys = keys.filter(k => k !== xKey && typeof sample[k] === "number");
  return { xKey, numKeys: numKeys.length ? numKeys : [keys[1]] };
};

const detectType = (data) => {
  if (!data?.length) return "bar";
  const keys = Object.keys(data[0]);
  if (keys.some(k => /^(year|date|month|quarter|week|period)$/i.test(k))) return "area";
  if (data.length <= 6) return "pie";
  return "bar";
};

const normalizeData = (data, xKey) =>
  data.map(row => ({ ...row, [xKey]: String(row[xKey]) }));

const axisStyle = { fill: "rgba(255,255,255,0.45)", fontSize: 11 };
const gridStyle = { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.08)", vertical: false };

export default function AnalyticsRenderer({ data, chartType: forcedType, title }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const { xKey, numKeys } = parseKeys(data);
  const type = forcedType || detectType(data);
  const chartData = normalizeData(data, xKey);
  const axisProps = { tick: axisStyle, tickLine: false, axisLine: { stroke: "rgba(255,255,255,0.1)" } };
  const common = { data: chartData, margin: { top: 8, right: 16, left: 8, bottom: 4 } };
  const legendStyle = { fontSize: 11, color: "rgba(255,255,255,0.5)" };

  const renderChart = () => {
    if (type === "pie") {
      return (
        <PieChart>
          <Pie data={chartData} dataKey={numKeys[0]} nameKey={xKey}
            cx="50%" cy="50%" outerRadius={100} innerRadius={45} paddingAngle={3}
            label={({ name, percent }) => percent > 0.04 ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
            labelLine={false}
          >
            {chartData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={legendStyle} />
        </PieChart>
      );
    }
    if (type === "area") {
      return (
        <AreaChart {...common}>
          <defs>
            {numKeys.map((k, i) => (
              <linearGradient key={k} id={`ag_${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.4} />
                <stop offset="90%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} tickFormatter={fmtNum} width={48} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={legendStyle} />
          {numKeys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k}
              stroke={PALETTE[i % PALETTE.length]} strokeWidth={2}
              fill={`url(#ag_${i})`} dot={false} activeDot={{ r: 4 }} />
          ))}
        </AreaChart>
      );
    }
    if (type === "line") {
      return (
        <LineChart {...common}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} tickFormatter={fmtNum} width={48} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={legendStyle} />
          {numKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k}
              stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      );
    }
    return (
      <BarChart {...common}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} tickFormatter={fmtNum} width={48} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={legendStyle} />
        {numKeys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={PALETTE[i % PALETTE.length]} radius={[4, 4, 0, 0]} maxBarSize={48} />
        ))}
      </BarChart>
    );
  };

  return (
    <div style={{
      borderRadius: 16,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: 16, width: "100%",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.2)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Shine */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
        pointerEvents: "none",
      }} />
      {title && (
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
