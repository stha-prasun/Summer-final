import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Eye,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import {
  BG,
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  TABLE_BORDER,
} from "../../../components/AdminComponents/Theme";

import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import { ConfirmModal } from "../../../components/AdminComponents/ConfirmModal";
import api from "../../../services/api";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  muscle: "#e8291c",
  imports: "#1a9fd8",
  exotics: "#f2b705",
  originals: "#10b981",
};

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget.id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.series.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: BG, fontFamily: "Fredoka, system-ui, sans-serif" }}
    >
      <Sidebar />

      <main className="flex-1 px-8 py-6">
        <Header />

        {/* Breadcrumb */}
        <div
          className="flex items-center justify-between rounded-2xl px-6 py-4 mb-6"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h1 className="text-lg font-semibold" style={{ color: "#ffffff" }}>
            View Products
          </h1>
          <div
            className="flex items-center gap-1.5 text-sm"
            style={{ color: TEXT_MUTED }}
          >
            <Link
              to="/admin/dashboard"
              className="flex items-center hover:text-white transition-colors duration-150"
              aria-label="Home"
            >
              <Home size={14} />
            </Link>
            <ChevronRight size={13} />
            <span
              className="px-2.5 py-0.5 rounded-md text-xs font-medium"
              style={{ background: "rgba(124,58,237,0.18)", color: "#a78bfa" }}
            >
              View Products
            </span>
          </div>
        </div>

        {/* Filters */}
        <div
          className="flex items-center gap-4 rounded-2xl px-6 py-4 mb-6"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: TEXT_MUTED }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                border: `1px solid ${CARD_BORDER}`,
                background: INPUT_BG,
                color: "#f5f5f5",
              }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
            style={{
              border: `1px solid ${CARD_BORDER}`,
              background: INPUT_BG,
              color: "#f5f5f5",
            }}
          >
            <option value="all">All Categories</option>
            <option value="muscle">Muscle</option>
            <option value="imports">Imports</option>
            <option value="exotics">Exotics</option>
            <option value="originals">Originals</option>
          </select>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${TEXT_MUTED} transparent ${TEXT_MUTED} ${TEXT_MUTED}` }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Eye size={40} style={{ color: TEXT_MUTED }} />
              <p style={{ color: TEXT_MUTED }}>
                {products.length === 0
                  ? "No products yet. Add your first product!"
                  : "No products match your search."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: TEXT_MUTED }}>
                  <th className="text-left font-medium px-6 py-4">Product</th>
                  <th className="text-left font-medium px-6 py-4">Series</th>
                  <th className="text-left font-medium px-6 py-4">Category</th>
                  <th className="text-left font-medium px-6 py-4">Year</th>
                  <th className="text-left font-medium px-6 py-4">Price</th>
                  <th className="text-left font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product._id}
                    style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: INPUT_BG, color: TEXT_MUTED }}
                          >
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="text-white font-medium">
                            {product.name}
                          </span>
                          {product.badge && (
                            <span
                              className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background:
                                  product.badge === "New"
                                    ? "rgba(16,185,129,0.18)"
                                    : "rgba(234,179,8,0.18)",
                                color:
                                  product.badge === "New" ? "#34d399" : "#fbbf24",
                              }}
                            >
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: TEXT_MUTED }}>
                      {product.series}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          background: `${
                            CATEGORY_COLORS[product.category] || "#666"
                          }20`,
                          color: CATEGORY_COLORS[product.category] || "#999",
                        }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: TEXT_MUTED }}>
                      {product.year}
                    </td>
                    <td className="px-6 py-4" style={{ color: "#c7cad6" }}>
                      {product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="p-2 rounded-lg transition-colors duration-150 hover:bg-white/5"
                          style={{ color: TEXT_MUTED }}
                          title="View details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 rounded-lg transition-colors duration-150 hover:bg-white/5"
                          style={{ color: TEXT_MUTED }}
                          title="Edit product"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 rounded-lg transition-colors duration-150 hover:bg-white/5"
                          style={{ color: "#ef4444" }}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Count */}
        {!loading && products.length > 0 && (
          <div className="mt-4 text-xs" style={{ color: TEXT_MUTED }}>
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
