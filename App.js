import { useState, useEffect, useRef } from "react";
import { Zap, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, RefreshCw, Cpu, Radio, BarChart2 } from "lucide-react";

const NODES = [
  { id: "N1", label: "Grid Alpha", type: "generator", base: 420, color: "#a855f7" },
  { id: "N2", label: "Grid Beta",  type: "generator", base: 380, color: "#6366f1" },
  { id: "N3", label: "Sector A",   type: "consumer",  base: 210, color: "#22d3ee" },
  { id: "N4", label: "Sector B",   type: "consumer",  base: 190, color: "#22d3ee" },
  { id: "N5", label: "Sector C",   type: "consumer",  base: 160, color: "#22d3ee" },
  { id: "N6", label: "Sub-station",type: "relay",     base: 310, color: "#f59e0b" },
];

const genValue = (base, t, i) =>
  +(base + Math.sin(t * 0.8 + i) * base * 0.12 + (Math.random() - 0.5) * base * 0.06).toFixed(1);

const statusOf = (v, base) =>
  v > base * 1.1 ? "critical" : v > base * 1.05 ? "warning" : "normal";

const STATUS_COLOR = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
const STATUS_ICON  = {
  normal:   <CheckCircle  className="w-4 h-4" style={{ color: "#22c55e" }} />,
  warning:  <AlertTriangle className="w-4 h-4" style={{ color: "#f59e0b" }} />,
  critical: <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} />,
};

const HISTORY_LEN = 40;

export default function App() {
  const [tick, setTick]       = useState(0);
  const [history, setHistory] = useState(() =>
    Array.from({ length: HISTORY_LEN }, () =>
      NODES.map((n, i) => genValue(n.base, 0, i))
    )
  );
  const [paused, setPaused]   = useState(false);
  const [selected, setSelected] = useState("N1");
  const animRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setTick(t => {
        const nt = t + 1;
        setHistory(h => {
          const row = NODES.map((n, i) => genValue(n.base, nt * 0.1, i));
          return [...h.slice(-(HISTORY_LEN - 1)), row];
        });
        return nt;
      });
    }, 700);
    return () => clearInterval(id);
  }, [paused]);

  const latest = history[history.length - 1];
  const totalGen = NODES.filter(n => n.type === "generator").reduce((s, n, i) => s + latest[NODES.indexOf(n)], 0);
  const totalCon = NODES.filter(n => n.type === "consumer").reduce((s, n)  => s + latest[NODES.indexOf(n)], 0);
  const balance  = +(totalGen - totalCon).toFixed(1);

  const selIdx = NODES.findIndex(n => n.id === selected);
  const selNode = NODES[selIdx];
  const selHist = history.map(row => row[selIdx]);
  const selVal  = latest[selIdx];
  const selStatus = statusOf(selVal, selNode.base);

  // Mini sparkline SVG
  const Spark = ({ vals, color, h = 40, w = 120 }) => {
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const pts = vals.map((v, i) =>
      `${(i / (vals.length - 1)) * w},${h - ((v - mn) / rng) * h}`
    ).join(" ");
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  };

  // Bar chart for selected node
  const BarChart = ({ vals, color }) => {
    const mn = Math.min(...vals) * 0.95, mx = Math.max(...vals) * 1.02, rng = mx - mn || 1;
    const show = vals.slice(-20);
    return (
      <svg width="100%" height="80" viewBox={`0 0 200 80`} preserveAspectRatio="none">
        {show.map((v, i) => {
          const barH = ((v - mn) / rng) * 70;
          return (
            <rect
              key={i}
              x={i * 10 + 1} y={80 - barH} width={8} height={barH}
              fill={color} opacity={0.5 + (i / show.length) * 0.5}
              rx={2}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "monospace", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#a855f7", borderRadius: 10, padding: 8 }}>
            <Zap className="w-6 h-6" style={{ color: "#fff" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: 2 }}>QUANTUM ENERGY TRACKER</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#6366f1", letterSpacing: 3 }}>ELECTRICAL NETWORK MONITOR</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: paused ? "#ef4444" : "#22c55e" }}>
            <Radio className="w-4 h-4" />
            {paused ? "PAUSED" : "LIVE"}
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            style={{ background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 8, padding: "6px 14px", color: "#818cf8", cursor: "pointer", fontSize: 12 }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Generation", val: `${totalGen.toFixed(0)} MW`, icon: <TrendingUp className="w-5 h-5" />, color: "#a855f7" },
          { label: "Total Consumption", val: `${totalCon.toFixed(0)} MW`, icon: <TrendingDown className="w-5 h-5" />, color: "#22d3ee" },
          { label: "Grid Balance", val: `${balance > 0 ? "+" : ""}${balance} MW`, icon: <Activity className="w-5 h-5" />, color: balance >= 0 ? "#22c55e" : "#ef4444" },
        ].map(k => (
          <div key={k.label} style={{ background: "#0f0f2e", border: `1px solid ${k.color}44`, borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, color: k.color }}>{k.icon}<span style={{ fontSize: 11, letterSpacing: 2 }}>{k.label.toUpperCase()}</span></div>
            <div style={{ fontSize: 28, fontWeight: 900, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Node Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {NODES.map((node, i) => {
          const val = latest[i];
          const st  = statusOf(val, node.base);
          const nodeHist = history.map(r => r[i]);
          const isSelected = selected === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelected(node.id)}
              style={{
                background: isSelected ? "#1e1b4b" : "#0f0f2e",
                border: `1px solid ${isSelected ? node.color : node.color + "44"}`,
                borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                transition: "all 0.2s", boxShadow: isSelected ? `0 0 16px ${node.color}44` : "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: node.color, marginBottom: 2 }}>
                    {node.type.toUpperCase()} · {node.id}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{node.label}</div>
                </div>
                {STATUS_ICON[st]}
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: node.color, marginBottom: 4 }}>{val} <span style={{ fontSize: 13, opacity: 0.6 }}>MW</span></div>
              <Spark vals={nodeHist} color={node.color} />
              <div style={{ marginTop: 4 }}>
                <div style={{ background: "#1a1a3e", borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${Math.min(100, (val / (node.base * 1.2)) * 100)}%`,
                    background: STATUS_COLOR[st], transition: "width 0.5s"
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div style={{ background: "#0f0f2e", border: `1px solid ${selNode.color}66`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: selNode.color, marginBottom: 4 }}>DETAIL VIEW — {selNode.id}</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{selNode.label}</h2>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Type: <span style={{ color: selNode.color }}>{selNode.type}</span> · Baseline: {selNode.base} MW
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: selNode.color }}>{selVal} MW</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", fontSize: 12 }}>
              {STATUS_ICON[selStatus]}
              <span style={{ color: STATUS_COLOR[selStatus], textTransform: "uppercase", letterSpacing: 1 }}>{selStatus}</span>
            </div>
          </div>
        </div>
        <BarChart vals={selHist} color={selNode.color} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 14 }}>
          {[
            { label: "Current", val: `${selVal} MW` },
            { label: "Peak",    val: `${Math.max(...selHist).toFixed(1)} MW` },
            { label: "Min",     val: `${Math.min(...selHist).toFixed(1)} MW` },
            { label: "Avg",     val: `${(selHist.reduce((a,b)=>a+b,0)/selHist.length).toFixed(1)} MW` },
          ].map(s => (
            <div key={s.label} style={{ background: "#0a0a1a", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontWeight: 700, color: selNode.color, fontSize: 16 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#334155", letterSpacing: 2 }}>
        QUANTUM ENERGY TRACKER · TICK #{tick} · {NODES.length} NODES MONITORED
      </div>
    </div>
  );
}
