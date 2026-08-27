import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { OrderRow } from "../../../components/UserComponents/Order/OrderRow";
import { useGetAllOrders } from "../../../hooks/useGetAllOrders";
import UserNavbar from "../../../components/UserComponents/UserNavbar";

export default function OrderDashboard() {
  const { orders, loading, error } = useGetAllOrders();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-zinc-500">Loading orders...</div>;
  if (error) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-950 text-zinc-100">
      <UserNavbar />

      <div className="flex w-full flex-1 pt-16 md:pt-20">
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
          <div className="flex w-full flex-col gap-4">
            {orders.length === 0 && (
              <p className="py-10 text-center text-sm text-zinc-500">
                No orders here yet.
              </p>
            )}

            {orders.map((o, idx) => (
              <div key={o.id} className="w-full">
                <OrderRow order={o} onSelect={() => navigate(`/orders/${o.id}`)} />
                {idx !== orders.length - 1 && (
                  <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
