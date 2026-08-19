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
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Back to orders
      </button>

      {/* Header: order meta */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5">
        <div>
          <p className="text-xs text-slate-400">Orders ID</p>
          <p className="text-lg font-bold text-slate-900">#{order.id}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Time</p>
          <p className="text-lg font-bold text-slate-900">{order.time}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Status</p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_TINT[order.status]}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Full item breakdown — images + all product info */}
      <div className="flex flex-col gap-4">
        {order.items.map((it, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 sm:flex-row sm:items-start"
          >
            <ProductThumb image={it.image} size="lg" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-slate-900">
                  {it.name}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${CATEGORY_TINT[it.category] ?? "bg-slate-100 text-slate-500"}`}
                >
                  {it.category}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {it.series} &nbsp;·&nbsp; Finish: {it.finish}
              </p>
              <p className="mt-2 text-sm text-slate-600">{it.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
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
              <p className="text-xs text-slate-400">Line total</p>
              <p className="text-lg font-bold text-slate-900">
                ${(Number(it.price) * it.qty).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals + payment info (read-only, from Order.payment schema) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Items ({totals.itemCount})</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Payment</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                PAYMENT_STATUS_TINT[pay.status] ?? "bg-slate-100 text-slate-500"
              }`}
            >
              {pay.status ?? "pending"}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Gateway</span>
              <span className="font-medium capitalize text-slate-700">
                {pay.gateway}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID</span>
              <span className="font-medium text-slate-700">
                {pay.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pidx</span>
              <span className="font-medium text-slate-700">
                {pay.pidx}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2">
              <span>Amount</span>
              <span className="font-semibold text-slate-900">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}