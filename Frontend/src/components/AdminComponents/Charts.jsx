import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { CARD_BG, CARD_BORDER, TEXT_MUTED } from "./theme";
import { TABLE_BORDER } from "./theme";

export function Charts() {
  const MODELS = [
    { name: "'69 Camaro", sold: 8, color: "#e8291c" },
    { name: "Twin Mill", sold: 5, color: "#9333ea" },
    { name: "Bone Shaker", sold: 10, color: "#10b981" },
    { name: "Deora II", sold: 6, color: "#1a9fd8" },
    { name: "'57 Chevy", sold: 7, color: "#eab308" },
    { name: "Rodger Dodger", sold: 9, color: "#f2600c" },
    { name: "'70 Superbird", sold: 4, color: "#9ca3af" },
    { name: "'71 Datsun 510", sold: 12, color: "#e0115f" },
  ];
  const MONTHLY_SALES = [
    { month: "Jan", units: 3 },
    { month: "Feb", units: 4 },
    { month: "Mar", units: 6 },
    { month: "Apr", units: 5 },
    { month: "May", units: 8 },
    { month: "Jun", units: 7 },
    { month: "Jul", units: 10 },
    { month: "Aug", units: 12 },
    { month: "Sep", units: 14 },
    { month: "Oct", units: 16 },
    { month: "Nov", units: 18 },
    { month: "Dec", units: 20 },
  ];
  const BAR_COLORS = ["#9333ea", "#3b82f6"];
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Bar chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Sales Over Time
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-lg"
              style={{ background: "#1b1e2e", color: TEXT_MUTED }}
            >
              This Year
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MONTHLY_SALES}>
              <CartesianGrid vertical={false} stroke={TABLE_BORDER} />
              <XAxis
                dataKey="month"
                tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 20]}
                tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#1b1e2e",
                  border: "1px solid #2c3049",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Bar dataKey="units" radius={[6, 6, 0, 0]} maxBarSize={26}>
                {MONTHLY_SALES.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % 2]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Units Sold by Model
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-lg"
              style={{ background: "#1b1e2e", color: TEXT_MUTED }}
            >
              All Time
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={MODELS}
                  dataKey="sold"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {MODELS.map((m, i) => (
                    <Cell key={i} fill={m.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1b1e2e",
                    border: "1px solid #2c3049",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {MODELS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: m.color }}
                    />
                    <span style={{ color: "#c7cad6" }}>{m.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: TEXT_MUTED }}>
                    {m.sold}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
