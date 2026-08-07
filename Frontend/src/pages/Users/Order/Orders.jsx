import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { OrderRow } from "../../../components/UserComponents/Order/OrderRow";
import { useGetAllOrders } from "../../../hooks/useGetAllOrders";
import UserNavbar from "../../../components/UserComponents/UserNavbar";

export default function OrderDashboard() {
  const { orders, loading, error } = useGetAllOrders();
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F6F6F9] text-slate-800">
      <UserNavbar />

      <div className="flex w-full flex-1 pt-16 md:pt-20">
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
          <div className="flex w-full flex-col gap-4">
            {orders.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">
                No orders here yet.
              </p>
            )}

            {orders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                onSelect={() => navigate(`/orders/${o.id}`)}
                isHovered={o.id === hoveredId}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
