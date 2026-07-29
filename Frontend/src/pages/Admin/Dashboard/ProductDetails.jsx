import {
  Card,
  Label,
  HelpText,
  TextInput,
  TextArea,
} from "../../../components/AdminComponents/UiComponents";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronDown,
  ListChecks,
  Image as ImageIcon,
  Palette,
  Info,
} from "lucide-react";
import {
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  PRIMARY_GRADIENT,
  ACCENT,
} from "../../../components/AdminComponents/Theme";

export function ProductDetails() {
     const CATEGORY_OPTIONS = [
    { value: "muscle", label: "Muscle" },
    { value: "imports", label: "Imports" },
    { value: "exotics", label: "Exotics" },
    { value: "originals", label: "Originals" },
  ];

  const initialState = {
    // required
    name: "",
    series: "",
    year: "",
    price: "",
    category: "",
    // optional - main section
    badge: "",
    description: "",
    specs: "",
    // optional - thumbnail card
    image: "",
    // optional - product details card
    gradient: "",
    accent: "",
    border: "",
  };
  const [form, setForm] = useState(initialState);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

 
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main / middle section — everything not carved out for the RHS cards */}
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
                    <option value="" disabled>
                      Select an option
                    </option>
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-3"
                    style={{ color: TEXT_MUTED, pointerEvents: "none" }}
                  />
                </div>
                <HelpText>
                  Must be one of: muscle, imports, exotics, originals.
                </HelpText>
              </div>
            </div>

            <div>
              <Label>Badge</Label>
              <TextInput
                value={form.badge}
                onChange={set("badge")}
                placeholder="e.g. NEW, LIMITED"
              />
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
            <div>
              <Label>Specs</Label>
              <TextArea
                value={form.specs}
                onChange={set("specs")}
                placeholder="e.g. scale: 1:64, wheelType: Real Riders, color: Spectraflame Red"
                rows={3}
              />
              <HelpText>Optional. Key details about the casting.</HelpText>
            </div>
          </Card>

          {/* Actions row — bottom left of the form */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
              style={{ background: PRIMARY_GRADIENT }}
            >
              Save Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
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

        {/* RHS column */}
        <div className="flex flex-col gap-6">
          {/* Thumbnail card -> click to upload image */}
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
              {form.image ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="max-h-full max-w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={32} color="#3a3f57" />
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>
                    Click to upload
                  </span>
                </div>
              )}
            </div>
            <HelpText>
              Optional. Click the box to upload a *.png, *.jpg or *.jpeg file.
            </HelpText>
          </Card>

          {/* Product Details card -> gradient, accent, border */}
          <Card title="Product Details" icon={Palette}>
            <div>
              <Label>Gradient</Label>
              <TextInput
                value={form.gradient}
                onChange={set("gradient")}
                placeholder="linear-gradient(135deg,#e8291c,#f2b705)"
              />
              <HelpText>
                Optional. CSS gradient used for the card background.
              </HelpText>
            </div>
            <div>
              <Label>Accent</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    /^#([0-9a-f]{3}){1,2}$/i.test(form.accent)
                      ? form.accent
                      : ACCENT
                  }
                  onChange={set("accent")}
                  className="w-10 h-10 rounded-lg cursor-pointer"
                  style={{
                    border: `1px solid ${CARD_BORDER}`,
                    padding: 2,
                    background: INPUT_BG,
                  }}
                />
                <TextInput
                  value={form.accent}
                  onChange={set("accent")}
                  placeholder="#7c3aed"
                />
              </div>
              <HelpText>
                Optional. Accent color used for text and icons.
              </HelpText>
            </div>
            <div>
              <Label>Border</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    /^#([0-9a-f]{3}){1,2}$/i.test(form.border)
                      ? form.border
                      : CARD_BORDER
                  }
                  onChange={set("border")}
                  className="w-10 h-10 rounded-lg cursor-pointer"
                  style={{
                    border: `1px solid ${CARD_BORDER}`,
                    padding: 2,
                    background: INPUT_BG,
                  }}
                />
                <TextInput
                  value={form.border}
                  onChange={set("border")}
                  placeholder="#23263a"
                />
              </div>
              <HelpText>
                Optional. Border color used on the product card.
              </HelpText>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
