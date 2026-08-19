import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CreditCard,
  User,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
} from "lucide-react";
import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import {
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  TEXT_FAINT,
  TABLE_BORDER,
  PRIMARY_GRADIENT,
  REQUIRED_COLOR,
} from "../../../components/AdminComponents/Theme";
import api from "../../../services/api";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  paid: { bg: "rgba(16,185,129,0.15)", color: "#34d399", icon: CheckCircle2, label: "Paid" },
  pending: { bg: "rgba(234,179,8,0.15)", color: "#fbbf24", icon: Clock, label: "Pending" },
  failed: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", icon: XCircle, label: "Failed" },
  cancelled: { bg: "rgba(156,163,175,0.15)", color: "#9ca3af", icon: Ban, label: "Cancelled" },
};

const CATEGORY_COLORS = {
  muscle: "#e8291c",
  imports: "#1a9fd8",
  exotics: "#f2b705",
  originals: "#10b981",
};

const VALID_STATUSES = ["pending", "paid", "failed", "cancelled"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!order || order.status === newStatus) return;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      setOrder(data.order);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex w-full min-h-screen"
        style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}
      >
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b90a8 transparent #8b90a8 #8b90a8" }}
          />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="flex w-full min-h-screen"
        style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p style={{ color: TEXT_MUTED }}>Order not found.</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-sm font-medium"
            style={{ color: "#a78bfa" }}
          >
            Back to Orders
          </button>
        </main>
      </div>
    );
  }

  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = st.icon;

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <Header />

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 text-sm transition-colors duration-150"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft size={16} />
            Orders
          </button>
          <span style={{ color: TEXT_FAINT }}>/</span>
          <span className="text-sm font-medium" style={{ color: "#e5e7eb" }}>
            #{String(order.id).slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Order #{String(order.id).slice(-6).toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: TEXT_MUTED }}>
              <span className="flex items-center gap-1.5">
                <CalendarClock size={14} />
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: st.bg }}
          >
            <StatusIcon size={16} style={{ color: st.color }} />
            <span className="text-sm font-semibold" style={{ color: st.color }}>
              {st.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Order items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Items */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Package size={16} style={{ color: "#7c3aed" }} />
                <h3 className="font-semibold text-base text-white">
                  Order Items ({order.items.length})
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {order.items.map((item, idx) => {
                  const catColor = CATEGORY_COLORS[item.category] || "#666";
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: INPUT_BG, border: `1px solid ${CARD_BORDER}` }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: "#1a1d2e" }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} style={{ color: TEXT_FAINT }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: catColor }} />
                          <span className="text-white font-medium truncate">{item.name}</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                          {item.series && `${item.series} · `}
                          {item.year && `${item.year} · `}
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold" style={{ color: "#c7cad6" }}>
                          Rs. {item.price?.toLocaleString()}
                        </div>
                        <div className="text-xs" style={{ color: TEXT_MUTED }}>
                          each
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div
                className="mt-5 pt-4 flex items-center justify-between"
                style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
              >
                <span className="text-sm" style={{ color: TEXT_MUTED }}>
                  Total Amount
                </span>
                <span className="text-xl font-bold text-white">
                  Rs. {order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="flex flex-col gap-6">
            {/* Customer info */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-5">
                <User size={16} style={{ color: "#7c3aed" }} />
                <h3 className="font-semibold text-base text-white">Customer</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                    Name
                  </div>
                  <div className="text-sm font-medium text-white">{order.customerName}</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                    Email
                  </div>
                  <div className="text-sm" style={{ color: "#c7cad6" }}>
                    {order.customerEmail}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={16} style={{ color: "#7c3aed" }} />
                <h3 className="font-semibold text-base text-white">Payment</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                    Gateway
                  </div>
                  <div className="text-sm font-medium capitalize" style={{ color: "#c7cad6" }}>
                    {order.payment?.gateway || "Khalti"}
                  </div>
                </div>
                {order.payment?.transactionId && (
                  <div>
                    <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                      Transaction ID
                    </div>
                    <div className="text-sm font-mono" style={{ color: "#c7cad6" }}>
                      {order.payment.transactionId}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                    Payment Status
                  </div>
                  <div className="text-sm font-medium capitalize" style={{ color: "#c7cad6" }}>
                    {order.payment?.status || "pending"}
                  </div>
                </div>
              </div>
            </div>

            {/* Update status */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Clock size={16} style={{ color: "#7c3aed" }} />
                <h3 className="font-semibold text-base text-white">Update Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {VALID_STATUSES.map((s) => {
                  const config = STATUS_CONFIG[s];
                  const Icon = config.icon;
                  const isCurrent = order.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={updating || isCurrent}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150"
                      style={{
                        background: isCurrent ? config.bg : "transparent",
                        border: `1px solid ${isCurrent ? "transparent" : CARD_BORDER}`,
                        color: isCurrent ? config.color : TEXT_MUTED,
                        cursor: isCurrent || updating ? "not-allowed" : "pointer",
                        opacity: updating ? 0.5 : 1,
                      }}
                    >
                      <Icon size={14} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
