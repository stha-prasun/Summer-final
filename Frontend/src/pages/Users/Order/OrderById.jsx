import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { OrderDetail } from "../../../components/UserComponents/Order/OrderDetails";
import { useGetOrderById } from "../../../hooks/useGetOrderById";
import UserNavbar from "../../../components/UserComponents/UserNavbar";

export default function OrderById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useGetOrderById(id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-950 text-zinc-100">
      <UserNavbar />

      <div className="flex w-full flex-1 pt-16 md:pt-20">
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
          {loading ? <div className="text-zinc-500">Loading...</div> : error ? (
            <div className="text-red-400">Error: {error}</div>
          ) : order ? (
            <OrderDetail order={order} onBack={() => navigate("/orders")} />
          ) : (
            <div className="text-zinc-500">Order not found.</div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
