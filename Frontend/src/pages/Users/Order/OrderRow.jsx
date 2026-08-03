import {orderTotals} from "./OrderTotals";
import { ProductThumb } from "./ProductThumb";
import { Calendar, Tag } from "lucide-react";
import { CATEGORY_TINT, STATUS_TINT } from "../../../utils/Constant";

export function OrderRow({ order, onSelect, isHovered, onHover, onLeave }) {
  const t = orderTotals(order);
  return (
    <button
      onClick={() => onSelect(order.id)}
      onMouseEnter={() => onHover(order.id)}
      onMouseLeave={onLeave}
      style={
        isHovered
          ? {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }
          : undefined
      }
      className={`w-full rounded-2xl border-2 bg-white p-5 text-left transition-all duration-150 ${
        isHovered ? "border-orange-400" : "border-slate-100"
      }`}
    >
      {/* Top row: order meta */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">
            Orders : #{order.id}
          </span>
          <span className="text-xs text-slate-400">{order.time}</span>
          <span className="text-xs text-slate-500">
            Type : {order.type} &nbsp;·&nbsp; Qty : {t.itemCount}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_TINT[order.status]}`}
          >
            {order.status}
          </span>
          <span className="font-bold text-slate-900">
            ${t.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Item rows: essentials only — no finish/edition, no description */}
      <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <ProductThumb image={it.image} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {it.name}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_TINT[it.category] ?? "bg-slate-100 text-slate-500"}`}
                >
                  {it.category}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {it.year}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={11} /> ${Number(it.price).toFixed(2)} &nbsp;x
                  {it.qty}
                </span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-900">
              ${(Number(it.price) * it.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </button>
  );
}