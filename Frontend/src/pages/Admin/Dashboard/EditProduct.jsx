import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  ChevronDown,
  ListChecks,
  Image as ImageIcon,
  Palette,
  Info,
} from "lucide-react";

import {
  Card,
  Label,
  HelpText,
  TextInput,
  TextArea,
} from "../../../components/AdminComponents/UiComponents";

import {
  BG,
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  PRIMARY_GRADIENT,
  ACCENT,
} from "../../../components/AdminComponents/Theme";

import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import api from "../../../services/api";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  { value: "muscle", label: "Muscle" },
  { value: "imports", label: "Imports" },
  { value: "exotics", label: "Exotics" },
  { value: "originals", label: "Originals" },
];

const GRADIENT_PRESETS = [
  { label: "Red Flame", value: "linear-gradient(135deg,#e8291c,#f2b705)" },
  { label: "Purple Haze", value: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
  { label: "Ocean Blue", value: "linear-gradient(135deg,#1d4ed8,#38bdf8)" },
  { label: "Emerald", value: "linear-gradient(135deg,#059669,#34d399)" },
  { label: "Sunset", value: "linear-gradient(135deg,#f97316,#fbbf24)" },
  { label: "Midnight", value: "linear-gradient(135deg,#1e1b4b,#6366f1)" },
  { label: "Rose", value: "linear-gradient(135deg,#e11d48,#fb7185)" },
  { label: "Steel", value: "linear-gradient(135deg,#374151,#9ca3af)" },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", series: "", year: "", price: "", category: "",
    badge: "", description: "", scale: "", material: "", tampo: "", limited: "",
    image: "", gradient: "", accent: "", border: "",
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || "",
          series: p.series || "",
          year: p.year || "",
          price: p.price || "",
          category: p.category || "",
          badge: p.badge || "",
          description: p.description || "",
          scale: p.specs?.scale || "",
          material: p.specs?.material || "",
          tampo: p.specs?.tampo || "",
          limited: p.specs?.limited || "",
          image: "",
          gradient: p.gradient || "",
          accent: p.accent || "",
          border: p.border || "",
        });
        if (p.image) setExistingImage(p.image);
      } catch {
        toast.error("Product not found");
        navigate("/admin/view-products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, image: file }));
    setExistingImage("");
  };

  const handleSubmit = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("series", form.series);
    fd.append("year", form.year);
    fd.append("price", form.price);
    fd.append("category", form.category);
    if (form.badge) fd.append("badge", form.badge);
    if (form.description) fd.append("description", form.description);
    if (form.gradient) fd.append("gradient", form.gradient);
    if (form.accent) fd.append("accent", form.accent);
    if (form.border) fd.append("border", form.border);
    if (form.image) fd.append("image", form.image);

    const specs = {};
    if (form.scale) specs.scale = form.scale;
    if (form.material) specs.material = form.material;
    if (form.tampo) specs.tampo = form.tampo;
    if (form.limited) specs.limited = form.limited;
    if (Object.keys(specs).length) fd.append("specs", JSON.stringify(specs));

    try {
      const { data } = await api.put(`/products/${id}`, fd);
      toast.success(data.message || "Product updated successfully");
      navigate(`/admin/products/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}
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
            Edit Product
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
              Edit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card title="Product Info" icon={ListChecks}>
              <div>
                <Label required>Name</Label>
                <TextInput
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Twin Mill"
                />
                <HelpText>Enter the product name.</HelpText>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Series</Label>
                  <TextInput
                    value={form.series}
                    onChange={set("series")}
                    placeholder="e.g. Originals"
                  />
                  <HelpText>Enter the product series.</HelpText>
                </div>
                <div>
                  <Label required>Year</Label>
                  <TextInput
                    value={form.year}
                    onChange={set("year")}
                    placeholder="e.g. 2025"
                  />
                  <HelpText>Enter the release year.</HelpText>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Price</Label>
                  <TextInput
                    value={form.price}
                    onChange={set("price")}
                    placeholder="e.g. $6.99"
                  />
                  <HelpText>Enter the product price.</HelpText>
                </div>
                <div>
                  <Label required>Category</Label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={set("category")}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none appearance-none"
                      style={{
                        border: `1px solid ${CARD_BORDER}`,
                        background: INPUT_BG,
                        color: form.category ? "#f5f5f5" : TEXT_MUTED,
                      }}
                    >
                      <option value="" disabled>Select an option</option>
                      {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3 top-3"
                      style={{ color: TEXT_MUTED, pointerEvents: "none" }}
                    />
                  </div>
                  <HelpText>Must be one of: muscle, imports, exotics, originals.</HelpText>
                </div>
              </div>

              <div>
                <Label>Badge</Label>
                <div className="relative">
                  <select
                    value={form.badge}
                    onChange={set("badge")}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none appearance-none"
                    style={{
                      border: `1px solid ${CARD_BORDER}`,
                      background: INPUT_BG,
                      color: form.badge ? "#f5f5f5" : TEXT_MUTED,
                    }}
                  >
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Limited">Limited</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-3"
                    style={{ color: TEXT_MUTED, pointerEvents: "none" }}
                  />
                </div>
                <HelpText>Optional tag shown on the product card.</HelpText>
              </div>
            </Card>

            <Card title="Description & Specs" icon={Info}>
              <div>
                <Label>Description</Label>
                <TextArea
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Short description of the model..."
                  rows={4}
                />
                <HelpText>Optional. Shown on the product detail page.</HelpText>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scale</Label>
                  <TextInput value={form.scale} onChange={set("scale")} placeholder="e.g. 1:64" />
                </div>
                <div>
                  <Label>Material</Label>
                  <TextInput value={form.material} onChange={set("material")} placeholder="e.g. Die-cast" />
                </div>
                <div>
                  <Label>Tampo</Label>
                  <TextInput value={form.tampo} onChange={set("tampo")} placeholder="e.g. Full" />
                </div>
                <div>
                  <Label>Limited</Label>
                  <TextInput value={form.limited} onChange={set("limited")} placeholder="e.g. 5000 pcs" />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                style={{ background: PRIMARY_GRADIENT }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/products/${id}`)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-white/5 hover:text-white active:scale-[0.98]"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: TEXT_MUTED,
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* RHS — thumbnail & visual */}
          <div className="flex flex-col gap-6">
            <Card title="Thumbnail" icon={ImageIcon}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageFile}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-150 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#1b1e2e,#12141f)",
                  border: "1px dashed #33374d",
                  height: 160,
                }}
              >
                {preview ? (
                  <img src={preview} alt="preview" className="max-h-full max-w-full rounded-lg object-cover" />
                ) : existingImage ? (
                  <img src={existingImage} alt="current" className="max-h-full max-w-full rounded-lg object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={32} color="#3a3f57" />
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>Click to upload</span>
                  </div>
                )}
              </div>
              <HelpText>
                {existingImage && !preview
                  ? "Current image shown. Click to replace."
                  : "Click the box to upload a *.png, *.jpg or *.jpeg file."}
              </HelpText>
            </Card>

            <Card title="Product Details" icon={Palette}>
              <div>
                <Label>Gradient</Label>
                <div
                  className="h-10 rounded-xl mb-2"
                  style={{
                    background: form.gradient || "linear-gradient(135deg,#1b1e2e,#12141f)",
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {GRADIENT_PRESETS.map((g) => (
                    <div
                      key={g.value}
                      onClick={() => setForm((f) => ({ ...f, gradient: g.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border-2 transition-all duration-150 hover:scale-110"
                      style={{
                        background: g.value,
                        borderColor: form.gradient === g.value ? ACCENT : "transparent",
                      }}
                      title={g.label}
                    />
                  ))}
                </div>
                <TextInput
                  value={form.gradient}
                  onChange={set("gradient")}
                  placeholder="linear-gradient(135deg,#e8291c,#f2b705)"
                />
                <HelpText>Optional. CSS gradient used for the card background.</HelpText>
              </div>
              <div>
                <Label>Accent</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={/^#([0-9a-f]{3}){1,2}$/i.test(form.accent) ? form.accent : ACCENT}
                    onChange={set("accent")}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    style={{ border: `1px solid ${CARD_BORDER}`, padding: 2, background: INPUT_BG }}
                  />
                  <TextInput value={form.accent} onChange={set("accent")} placeholder="#7c3aed" />
                </div>
                <HelpText>Optional. Accent color used for text and icons.</HelpText>
              </div>
              <div>
                <Label>Border</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={/^#([0-9a-f]{3}){1,2}$/i.test(form.border) ? form.border : CARD_BORDER}
                    onChange={set("border")}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    style={{ border: `1px solid ${CARD_BORDER}`, padding: 2, background: INPUT_BG }}
                  />
                  <TextInput value={form.border} onChange={set("border")} placeholder="#23263a" />
                </div>
                <HelpText>Optional. Border color used on the product card.</HelpText>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
