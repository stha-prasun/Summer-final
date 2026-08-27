import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Home,
  ArrowLeft,
  Pencil,
  Package,
  Tag,
  Calendar,
  DollarSign,
  Layers,
  Info,
  Palette,
} from "lucide-react";

import {
  BG,
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  TEXT_BODY,
  ACCENT,
} from "../../../components/AdminComponents/Theme";

import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import api from "../../../services/api";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  muscle: "#e8291c",
  imports: "#1a9fd8",
  exotics: "#f2b705",
  originals: "#10b981",
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: INPUT_BG }}>
        <Icon size={15} style={{ color: ACCENT }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium" style={{ color: TEXT_MUTED }}>{label}</p>
        <p className="text-sm mt-0.5 break-words" style={{ color: TEXT_BODY }}>{value}</p>
      </div>
    </div>
  );
}

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch {
        toast.error("Product not found");
        navigate("/admin/view-products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex w-full min-h-screen" style={{ background: BG }}>
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${TEXT_MUTED} transparent ${TEXT_MUTED} ${TEXT_MUTED}` }}
          />
        </main>
      </div>
    );
  }

  if (!product) return null;

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
            Product Details
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
            <Link
              to="/admin/view-products"
              className="hover:text-white transition-colors duration-150"
            >
              View Products
            </Link>
            <ChevronRight size={13} />
            <span
              className="px-2.5 py-0.5 rounded-md text-xs font-medium"
              style={{ background: "rgba(124,58,237,0.18)", color: "#a78bfa" }}
            >
              {product.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — main info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Image + name header */}
            <div
              className="rounded-2xl p-6 flex items-center gap-5"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ background: INPUT_BG, color: TEXT_MUTED }}
                >
                  {product.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{product.name}</h2>
                  {product.badge && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        background:
                          product.badge === "New"
                            ? "rgba(16,185,129,0.18)"
                            : "rgba(234,179,8,0.18)",
                        color: product.badge === "New" ? "#34d399" : "#fbbf24",
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                    style={{
                      background: `${CATEGORY_COLORS[product.category] || "#666"}20`,
                      color: CATEGORY_COLORS[product.category] || "#999",
                    }}
                  >
                    {product.category}
                  </span>
                  <span className="text-sm" style={{ color: TEXT_MUTED }}>
                    {product.series}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            {/* Details grid */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} style={{ color: ACCENT }} />
                <h3 className="font-semibold text-base text-white">Product Information</h3>
              </div>
              <DetailRow icon={Package} label="Name" value={product.name} />
              <DetailRow icon={Layers} label="Series" value={product.series} />
              <DetailRow icon={Calendar} label="Year" value={product.year} />
              <DetailRow icon={DollarSign} label="Price" value={product.price} />
              <DetailRow icon={Tag} label="Category" value={product.category} />
              {product.description && (
                <div className="py-3">
                  <p className="text-xs font-medium" style={{ color: TEXT_MUTED }}>Description</p>
                  <p className="text-sm mt-1 whitespace-pre-line" style={{ color: TEXT_BODY }}>
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Specs */}
            {product.specs && Object.values(product.specs).some((v) => v) && (
              <div
                className="rounded-2xl p-6"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={16} style={{ color: ACCENT }} />
                  <h3 className="font-semibold text-base text-white">Specifications</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {product.specs.scale && <DetailRow icon={Layers} label="Scale" value={product.specs.scale} />}
                  {product.specs.material && <DetailRow icon={Package} label="Material" value={product.specs.material} />}
                  {product.specs.tampo && <DetailRow icon={Tag} label="Tampo" value={product.specs.tampo} />}
                  {product.specs.limited && <DetailRow icon={Info} label="Limited" value={product.specs.limited} />}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6">
            {/* Visual preview */}
            <div
              className="rounded-2xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} style={{ color: ACCENT }} />
                <h3 className="font-semibold text-base text-white">Visual Style</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: TEXT_MUTED }}>Gradient</p>
                  <div
                    className="h-12 rounded-xl"
                    style={{
                      background: product.gradient || "linear-gradient(135deg,#1b1e2e,#12141f)",
                      border: `1px solid ${CARD_BORDER}`,
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1.5" style={{ color: TEXT_MUTED }}>Accent</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ background: product.accent || ACCENT, border: `1px solid ${CARD_BORDER}` }}
                      />
                      <span className="text-xs" style={{ color: TEXT_BODY }}>{product.accent || "#7c3aed"}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1.5" style={{ color: TEXT_MUTED }}>Border</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ background: product.border || CARD_BORDER, border: `1px solid ${CARD_BORDER}` }}
                      />
                      <span className="text-xs" style={{ color: TEXT_BODY }}>{product.border || "#23263a"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <button
                onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
              >
                <Pencil size={14} />
                Edit Product
              </button>
              <button
                onClick={() => navigate("/admin/view-products")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-white/5"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: TEXT_MUTED,
                }}
              >
                <ArrowLeft size={14} />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
