import { useState } from "react";
import { Car, ArrowLeft, Calendar, Tag } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ---- Static order data (items now carry product-schema fields) ----
  const ORDERS = [
  {
    id: "907653",
    type: "Pickup",
    time: "20:30pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 53.82,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 4,
      },
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 2,
      },
      {
        name: "Bone Shaker",
        series: "Limited Editions",
        year: "2006",
        price: "6.99",
        category: "originals",
        description:
          "A chopper-inspired hot rod with a skull grille and flame details.",
        finish: "Limited Edition",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907654",
    type: "Ship",
    time: "20:35pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 30.76,
    },
    items: [
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 3,
      },
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907655",
    type: "Pickup",
    time: "20:40pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "failed",
      amount: 15.38,
    },
    items: [
      {
        name: "Bone Shaker",
        series: "Limited Editions",
        year: "2006",
        price: "6.99",
        category: "originals",
        description:
          "A chopper-inspired hot rod with a skull grille and flame details.",
        finish: "Limited Edition",
        image: "",
        qty: 2,
      },
    ],
  },
  {
    id: "907656",
    type: "Ship",
    time: "20:45pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 46.13,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 5,
      },
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907648",
    type: "Pickup",
    time: "18:10pm",
    status: "Completed",
    payment: {
      gateway: "khalti",
      transactionId: "TXN-907648-KH",
      status: "paid",
      amount: 23.07,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 3,
      },
    ],
  },
  {
    id: "907641",
    type: "Ship",
    time: "16:50pm",
    status: "Completed",
    payment: {
      gateway: "khalti",
      transactionId: "TXN-907641-KH",
      status: "paid",
      amount: 30.76,
    },
    items: [
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 2,
      },
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 2,
      },
    ],
  },
];
const PAYMENT_STATUS_TINT = {
  pending: "bg-amber-100 text-amber-600",
  paid: "bg-emerald-100 text-emerald-600",
  failed: "bg-red-100 text-red-600",
};

const STATUS_TINT = {
  "On-process": "bg-amber-100 text-amber-600",
  Completed: "bg-emerald-100 text-emerald-600",
};

const CATEGORY_TINT = {
  muscle: "bg-red-100 text-red-600",
  imports: "bg-blue-100 text-blue-600",
  exotics: "bg-purple-100 text-purple-600",
  originals: "bg-slate-200 text-slate-600",
};

function orderTotals(order) {
  const subtotal = order.items.reduce(
    (sum, it) => sum + Number(it.price) * it.qty,
    0,
  );
  const tax = subtotal * 0.1;
  const itemCount = order.items.reduce((sum, it) => sum + it.qty, 0);
  return { subtotal, tax, total: subtotal + tax, itemCount };
}

// Reusable image slot — shows real product image if present, else icon tile
function ProductThumb({ image, size = "md" }) {
  const dims = size === "lg" ? "h-16 w-16" : "h-11 w-11";
  const iconSize = size === "lg" ? 26 : 18;

  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={`${dims} shrink-0 rounded-xl object-cover`}
      />
    );
  }
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-xl bg-slate-100`}
    >
      <Car size={iconSize} className="text-slate-500" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order list row — compact view for the total orders page
// ---------------------------------------------------------------------------
function OrderRow({ order, onSelect, isHovered, onHover, onLeave }) {
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

// ---------------------------------------------------------------------------
// Order detail view — full info + images, loaded when an order is selected
// ---------------------------------------------------------------------------
function OrderDetail({ order, onBack }) {
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
          <p className="text-xs text-slate-400">Fulfillment</p>
          <p className="text-lg font-bold text-slate-900">{order.type}</p>
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
          <div className="flex justify-between text-slate-500">
            <span>Tax (10%)</span>
            <span>${totals.tax.toFixed(2)}</span>
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
                {pay.gateway || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID</span>
              <span className="font-medium text-slate-700">
                {pay.transactionId || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pidx</span>
              <span className="font-medium text-slate-700">
                {pay.pidx || "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2">
              <span>Amount</span>
              <span className="font-semibold text-slate-900">
                ${Number(pay.amount ?? totals.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function OrderDashboard() {
  const [tab, setTab] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const visibleOrders =
    tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);
  const selectedOrder = ORDERS.find((o) => o.id === selectedId);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F6F6F9] text-slate-800">
      <Navbar />

      <div className="flex w-full flex-1 pt-16 md:pt-20">
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
          {selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <>
              <div className="mb-5 flex gap-2">
                {["All", "On-process", "Completed"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      tab === t
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-100 text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex w-full flex-col gap-4">
                {visibleOrders.length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-400">
                    No orders here yet.
                  </p>
                )}

                {visibleOrders.map((o) => (
                  <OrderRow
                    key={o.id}
                    order={o}
                    onSelect={setSelectedId}
                    isHovered={o.id === hoveredId}
                    onHover={setHoveredId}
                    onLeave={() => setHoveredId(null)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
