import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";;
import {OrderRow} from "./OrderRow";
import {OrderDetail} from "./OrderDetails";
import { ORDERS } from "../../../utils/Constant";

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
