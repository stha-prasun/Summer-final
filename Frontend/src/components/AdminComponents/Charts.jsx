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

export function Charts({ monthlySales = [], categoryBreakdown = [] }) {
  const BAR_COLORS = ["#9333ea", "#3b82f6"];

  const hasMonthly = monthlySales.length > 0;
  const hasCategory = categoryBreakdown.length > 0;

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
          {hasMonthly ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySales}>
                <CartesianGrid vertical={false} stroke={TABLE_BORDER} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
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
                  {monthlySales.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % 2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-sm" style={{ color: TEXT_MUTED }}>No sales data yet</p>
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Products by Category
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-lg"
              style={{ background: "#1b1e2e", color: TEXT_MUTED }}
            >
              All Time
            </span>
          </div>
          {hasCategory ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {categoryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
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
                {categoryBreakdown.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: cat.color }}
                      />
                      <span style={{ color: "#c7cad6" }}>{cat.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: TEXT_MUTED }}>
                      {cat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-sm" style={{ color: TEXT_MUTED }}>No products yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
