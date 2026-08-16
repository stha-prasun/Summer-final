import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
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
} from "../../../components/AdminComponents/Theme";
import api from "../../../services/api";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  paid: { bg: "rgba(16,185,129,0.15)", color: "#34d399", label: "Paid" },
  pending: { bg: "rgba(234,179,8,0.15)", color: "#fbbf24", label: "Pending" },
  failed: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Failed" },
  cancelled: { bg: "rgba(156,163,175,0.15)", color: "#9ca3af", label: "Cancelled" },
};

const CATEGORY_COLORS = {
  muscle: "#e8291c",
  imports: "#1a9fd8",
  exotics: "#f2b705",
  originals: "#10b981",
};

const STATUS_FILTERS = ["all", "paid", "pending", "failed", "cancelled"];

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter !== "all") params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get("/admin/orders", { params });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: "#0a0b14", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <div className="text-sm" style={{ color: TEXT_MUTED }}>
            {total} total order{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Filters bar */}
        <div
          className="flex items-center gap-4 mb-6 rounded-2xl p-4"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1"
              style={{ background: INPUT_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <Search size={16} style={{ color: TEXT_MUTED }} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by customer name..."
                className="bg-transparent outline-none text-sm w-full"
                style={{ color: "#e5e7eb" }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setPage(1);
                  }}
                  style={{ color: TEXT_MUTED }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: PRIMARY_GRADIENT }}
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((s) => {
              const st = STATUS_STYLES[s];
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    background: isActive
                      ? st?.bg || "rgba(124,58,237,0.15)"
                      : "transparent",
                    color: isActive
                      ? st?.color || "#7c3aed"
                      : TEXT_MUTED,
                    border: `1px solid ${isActive ? "transparent" : CARD_BORDER}`,
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#8b90a8 transparent #8b90a8 #8b90a8" }}
              />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center" style={{ color: TEXT_MUTED }}>
              No orders found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: TEXT_MUTED, borderBottom: `1px solid ${TABLE_BORDER}` }}>
                  <th className="text-left font-medium px-6 py-4">Order ID</th>
                  <th className="text-left font-medium px-6 py-4">Customer</th>
                  <th className="text-left font-medium px-6 py-4">Items</th>
                  <th className="text-left font-medium px-6 py-4">Total</th>
                  <th className="text-left font-medium px-6 py-4">Date</th>
                  <th className="text-left font-medium px-6 py-4">Status</th>
                  <th className="text-left font-medium px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const st = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                  const firstItem = order.items?.[0];
                  const catColor = CATEGORY_COLORS[firstItem?.category] || "#666";
                  return (
                    <tr
                      key={order.id}
                      style={{ borderBottom: `1px solid ${TABLE_BORDER}` }}
                      className="transition-colors duration-150 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono" style={{ color: TEXT_MUTED }}>
                          #{String(order.id).slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{order.customerName}</div>
                        <div className="text-xs" style={{ color: TEXT_MUTED }}>
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: catColor }}
                          />
                          <span style={{ color: "#c7cad6" }}>
                            {firstItem?.name || "Unknown"}
                            {order.items.length > 1 && (
                              <span className="text-xs" style={{ color: TEXT_MUTED }}>
                                {" "}
                                +{order.items.length - 1} more
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "#c7cad6" }}>
                        Rs. {order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4" style={{ color: TEXT_MUTED }}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-[1.03] active:scale-[0.98]"
                          style={{
                            background: "rgba(124,58,237,0.15)",
                            color: "#a78bfa",
                          }}
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
            >
              <span className="text-xs" style={{ color: TEXT_MUTED }}>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                  style={{
                    background: INPUT_BG,
                    border: `1px solid ${CARD_BORDER}`,
                    color: page === 1 ? TEXT_FAINT : "#e5e7eb",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                  style={{
                    background: INPUT_BG,
                    border: `1px solid ${CARD_BORDER}`,
                    color: page === totalPages ? TEXT_FAINT : "#e5e7eb",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
