import {orderTotals} from "./OrderTotals";
import { ProductThumb } from "./ProductThumb";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { CATEGORY_TINT, STATUS_TINT, PAYMENT_STATUS_TINT } from "../../../utils/Constant";

export function OrderDetail({ order, onBack }) {
  const totals = orderTotals(order);
  const pay = order.payment ?? {};

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to orders
      </button>

      {/* Header: order meta */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-800 bg-neutral-900 p-5 backdrop-blur-sm">
        <div>
          <p className="text-xs text-zinc-500">Orders ID</p>
          <p className="text-lg font-bold text-white">#{order.id}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Time</p>
          <p className="text-lg font-bold text-white">{order.time}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Status</p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_TINT[order.status]}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      {/* Full item breakdown — images + all product info */}
      <div className="flex flex-col gap-4">
        {order.items.map((it, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-neutral-900 p-5 sm:flex-row sm:items-start backdrop-blur-sm"
          >
            <ProductThumb image={it.image} size="lg" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-white">
                  {it.name}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${CATEGORY_TINT[it.category] ?? "bg-zinc-800 text-zinc-400"}`}
                >
                  {it.category}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {it.series} &nbsp;·&nbsp; Finish: {it.finish}
              </p>
              <p className="mt-2 text-sm text-zinc-400">{it.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Year: {it.year}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={12} /> Unit price: ${Number(it.price).toFixed(2)}
                </span>
                <span>Qty: {it.qty}</span>
              </div>
            </div>

            <div className="shrink-0 text-right sm:min-w-[100px]">
              <p className="text-xs text-zinc-500">Line total</p>
              <p className="text-lg font-bold text-white">
                ${(Number(it.price) * it.qty).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Separator before totals */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      {/* Totals + payment info (read-only, from Order.payment schema) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-neutral-900 p-5 text-sm backdrop-blur-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Items ({totals.itemCount})</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-zinc-700 pt-2 text-base font-bold text-white">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-neutral-900 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Payment</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                PAYMENT_STATUS_TINT[pay.status] ?? "bg-zinc-800 text-zinc-400"
              }`}
            >
              {pay.status ?? "pending"}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs text-zinc-500">
            <div className="flex justify-between">
              <span>Gateway</span>
              <span className="font-medium capitalize text-zinc-300">
                {pay.gateway}
              </span>
            </div>
            <div className="h-px w-full bg-zinc-800 my-1" />
            <div className="flex justify-between">
              <span>Transaction ID</span>
              <span className="font-medium text-zinc-300">
                {pay.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pidx</span>
              <span className="font-medium text-zinc-300">
                {pay.pidx}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-700 pt-2">
              <span>Amount</span>
              <span className="font-semibold text-white">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
