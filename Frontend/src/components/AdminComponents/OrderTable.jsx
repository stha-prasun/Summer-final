import {
  CARD_BG,
  CARD_BORDER,
  TEXT_MUTED,
  TABLE_BORDER,
} from "./Theme";

const STATUS_STYLES = {
  Delivered: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
  Shipped: { bg: "rgba(26,159,216,0.15)", color: "#38bdf8" },
  Processing: { bg: "rgba(234,179,8,0.15)", color: "#fbbf24" },
  paid: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
  pending: { bg: "rgba(234,179,8,0.15)", color: "#fbbf24" },
  failed: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  cancelled: { bg: "rgba(156,163,175,0.15)", color: "#9ca3af" },
};

const CATEGORY_COLORS = {
  muscle: "#e8291c",
  imports: "#1a9fd8",
  exotics: "#f2b705",
  originals: "#10b981",
};

export function OrderTable({ orders = [] }) {
  return (
    <>
      <div
        className="rounded-2xl p-5"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <span
            className="text-xs px-3 py-1 rounded-lg cursor-pointer"
            style={{ background: "#1b1e2e", color: TEXT_MUTED }}
          >
            View All
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: TEXT_MUTED }}>
              <th className="text-left font-medium pb-3">Model</th>
              <th className="text-left font-medium pb-3">Order Date</th>
              <th className="text-left font-medium pb-3">Amount</th>
              <th className="text-left font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center" style={{ color: TEXT_MUTED }}>
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const st = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
                const catColor = CATEGORY_COLORS[o.category] || "#666";
                return (
                  <tr
                    key={o.id}
                    style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
                  >
                    <td className="py-3 flex items-center gap-2 text-white">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: catColor }}
                      />
                      {o.model}
                    </td>
                    <td className="py-3" style={{ color: TEXT_MUTED }}>
                      {o.date}
                    </td>
                    <td className="py-3" style={{ color: "#c7cad6" }}>
                      {o.price}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
