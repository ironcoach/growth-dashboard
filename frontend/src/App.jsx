import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { fetchOverview, fetchTimeseries } from "./api";

function fmtCurrency(v) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(v || 0);
}
function fmtPct(v) {
  return `${((v || 0) * 100).toFixed(1)}%`;
}

function Kpi({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [grain, setGrain] = useState("week");
  const [kpis, setKpis] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [ov, ts] = await Promise.all([
        fetchOverview(startDate, endDate),
        fetchTimeseries(startDate, endDate, grain)
      ]);
      setKpis(ov.kpis);
      setPoints(ts.points || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(
    () => points.map(p => ({ periodStart: p.periodStart, revenue: Number(p.revenue || 0) })),
    [points]
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>Growth Dashboard</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <label>
          Start Date<br />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date<br />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label>
          Grain<br />
          <select value={grain} onChange={e => setGrain(e.target.value)}>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>
          </select>
        </label>
        <button style={{ height: 30, alignSelf: "end" }} onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {kpis && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
          <Kpi label="Revenue" value={fmtCurrency(kpis.revenue)} />
          <Kpi label="Orders" value={kpis.orders} />
          <Kpi label="New Customers" value={kpis.newCustomers} />
          <Kpi label="Sessions" value={kpis.sessions} />
          <Kpi label="Purchasers" value={kpis.purchasers} />
          <Kpi label="Conversion Rate" value={fmtPct(kpis.conversionRate)} />
          <Kpi label="Avg Order Value" value={fmtCurrency(kpis.avgOrderValue)} />
        </div>
      )}

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Revenue Trend</h3>
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodStart" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

