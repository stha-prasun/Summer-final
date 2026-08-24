import {orderTotals} from "./OrderTotals";
import { ProductThumb } from "./ProductThumb";
import { Calendar, Tag } from "lucide-react";
import { CATEGORY_TINT, STATUS_TINT } from "../../../utils/Constant";

export function OrderRow({ order, onSelect }) {
  const t = orderTotals(order);
  return (
    <button
      onClick={() => onSelect(order.id)}
      className="w-full rounded-2xl border border-zinc-800 bg-neutral-900 p-5 text-left backdrop-blur-sm"
    >
      {/* Top row: order meta */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">
            Orders : #{order.id}
          </span>
          <span className="text-xs text-zinc-500">{order.time}</span>
          <span className="text-xs text-zinc-400">
            Qty : {t.itemCount}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_TINT[order.status]}`}
          >
            {order.status}
          </span>
          <span className="font-bold text-white">
            ${t.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      {/* Item rows: essentials only — no finish/edition, no description */}
      <div className="flex flex-col divide-y divide-zinc-800 border-t border-zinc-800">
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <ProductThumb image={it.image} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  {it.name}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_TINT[it.category] ?? "bg-zinc-800 text-zinc-400"}`}
                >
                  {it.category}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {it.year}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={11} /> ${Number(it.price).toFixed(2)} &nbsp;x
                  {it.qty}
                </span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold text-white">
              ${(Number(it.price) * it.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </button>
  );
}
