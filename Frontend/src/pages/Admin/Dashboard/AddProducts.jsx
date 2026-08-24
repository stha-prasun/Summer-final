import { Link} from "react-router-dom";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import {
  BG,
  CARD_BG,
  CARD_BORDER,
  TEXT_MUTED,
} from "../../../components/AdminComponents/Theme";

import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import { ProductDetails } from "./ProductDetails";






export default function AddProductPage() {
  

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: BG, fontFamily: "Fredoka, system-ui, sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 px-8 py-6">
        {/* Top bar */}
        
        <Header />

        {/* Header row */}
        <div
          className="flex items-center justify-between rounded-2xl px-6 py-4 mb-6"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h1 className="text-lg font-semibold" style={{ color: "#ffffff" }}>
            Add Product
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
              className="text-xs font-medium"
              style={{ color: "#c7cad6" }}
            >
              Add Product
            </span>
          </div>
        </div>
        <ProductDetails />
        
      </main>
    </div>
  );
}
