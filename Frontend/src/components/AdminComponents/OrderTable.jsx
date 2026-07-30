import {
  CARD_BG,
  CARD_BORDER,
  TEXT_MUTED,
  STATUS_STYLES,
  TABLE_BORDER,
} from "./Theme";

export function OrderTable() {
    const RECENT_ORDERS = [
  { model: "'71 Datsun 510", ref: "WHL-008", customer: "Marco Fields", date: "Dec 18", price: "$7.49", status: "Delivered" },
  { model: "Bone Shaker", ref: "WHL-003", customer: "Priya Shah", date: "Dec 17", price: "$6.99", status: "Shipped" },
  { model: "Rodger Dodger", ref: "WHL-006", customer: "Leo Whitfield", date: "Dec 16", price: "$6.99", status: "Processing" },
  { model: "Twin Mill", ref: "WHL-002", customer: "Ana Brooks", date: "Dec 15", price: "$6.99", status: "Delivered" },
  { model: "'69 Camaro", ref: "WHL-001", customer: "Jonas Reyes", date: "Dec 14", price: "$6.99", status: "Shipped" },
];
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
              <th className="text-left font-medium pb-3">Ref</th>
              <th className="text-left font-medium pb-3">Order Date</th>
              <th className="text-left font-medium pb-3">Price</th>
              <th className="text-left font-medium pb-3">Customer</th>
              <th className="text-left font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => {
              const modelInfo = MODELS.find((m) => m.name === o.model);
              const st = STATUS_STYLES[o.status];
              return (
                <tr
                  key={o.ref}
                  style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
                >
                  <td className="py-3 flex items-center gap-2 text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: modelInfo?.color || "#666" }}
                    />
                    {o.model}
                  </td>
                  <td className="py-3" style={{ color: TEXT_MUTED }}>
                    {o.ref}
                  </td>
                  <td className="py-3" style={{ color: TEXT_MUTED }}>
                    {o.date}
                  </td>
                  <td className="py-3" style={{ color: "#c7cad6" }}>
                    {o.price}
                  </td>
                  <td className="py-3" style={{ color: "#c7cad6" }}>
                    {o.customer}
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
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
