import { FiDroplet, FiWind, FiThermometer, FiSun, FiCloud, FiCloudRain } from "react-icons/fi";

const icon = (c="") => {
  const l = c.toLowerCase();
  if (l.includes("rain")||l.includes("storm")) return <FiCloudRain size={30} style={{ color:"#38bdf8" }}/>;
  if (l.includes("cloud")||l.includes("mist"))  return <FiCloud    size={30} style={{ color:"#94a3b8" }}/>;
  return <FiSun size={30} style={{ color:"#fbbf24" }}/>;
};

export default function WeatherCard({ data }) {
  if (!data || !data.location) return null;
  const { location, temperature, humidity, wind_speed, condition, recommendation } = data;

  return (
    <div style={{
      borderRadius:18, padding:"18px 18px", maxWidth:300, width:"100%",
      background:"#111", border:"1px solid #1e1e1e",
      boxShadow:"0 0 0 1px rgba(249,115,22,0.06), 0 12px 40px rgba(0,0,0,0.4)",
      position:"relative", overflow:"hidden",
    }}>
      {/* Orange left accent */}
      <div style={{
        position:"absolute", left:0, top:"15%", bottom:"15%", width:2,
        background:"linear-gradient(to bottom, transparent, #f97316, transparent)",
      }}/>

      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div>
          <p style={{ fontSize:9, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 3px" }}>Live Weather</p>
          <p style={{ fontSize:16, fontWeight:700, color:"#fff", margin:"0 0 3px" }}>{location}</p>
          <p style={{ fontSize:12, color:"#888", margin:0, textTransform:"capitalize" }}>{condition}</p>
        </div>
        {icon(condition)}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
        {[
          { icon:<FiThermometer size={13} style={{ color:"#f97316" }}/>, val:`${temperature}°C`, label:"Temp" },
          { icon:<FiDroplet    size={13} style={{ color:"#38bdf8" }}/>, val:`${humidity}%`,    label:"Humidity" },
          { icon:<FiWind       size={13} style={{ color:"#4ade80" }}/>, val:String(wind_speed), label:"Wind" },
        ].map((s,i) => (
          <div key={i} style={{
            borderRadius:10, padding:"8px 6px", textAlign:"center",
            background:"#161616", border:"1px solid #1e1e1e",
          }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:3 }}>{s.icon}</div>
            <p style={{ fontSize:12, fontWeight:700, color:"#fff", margin:"0 0 1px" }}>{s.val}</p>
            <p style={{ fontSize:9, color:"#555", margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {recommendation && (
        <div style={{
          borderRadius:10, padding:"8px 10px",
          background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.15)",
        }}>
          <p style={{ fontSize:9, color:"#f97316", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 4px", fontWeight:600 }}>Travel Tip</p>
          <p style={{ fontSize:11.5, color:"#aaa", margin:0, lineHeight:1.5 }}>{recommendation}</p>
        </div>
      )}
    </div>
  );
}
