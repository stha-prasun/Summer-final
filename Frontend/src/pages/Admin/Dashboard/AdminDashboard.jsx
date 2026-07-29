import React from "react";
import {
  
} from "recharts";
import {
    Tag,
  PackageOpen,
} from "lucide-react";

import { PRIMARY_GRADIENT, LOGO_GRADIENT } from "../../../components/AdminComponents/Theme";
import {  StatCard } from "../../../components/AdminComponents/UiComponents";
import { OrderTable } from "../../../components/AdminComponents/OrderTable";
import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Charts } from "../../../components/AdminComponents/Charts";
import { Header } from "../../../components/AdminComponents/Navbar";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const MODELS = [
  { name: "'69 Camaro", sold: 8, color: "#e8291c" },
  { name: "Twin Mill", sold: 5, color: "#9333ea" },
  { name: "Bone Shaker", sold: 10, color: "#10b981" },
  { name: "Deora II", sold: 6, color: "#1a9fd8" },
  { name: "'57 Chevy", sold: 7, color: "#eab308" },
  { name: "Rodger Dodger", sold: 9, color: "#f2600c" },
  { name: "'70 Superbird", sold: 4, color: "#9ca3af" },
  { name: "'71 Datsun 510", sold: 12, color: "#e0115f" },
];

const TOTAL_SALES = MODELS.reduce((sum, m) => sum + m.sold, 0);
const INVENTORY_LEFT = 45;


export default function Dashboard() {
  return (
    <div className="flex w-full min-h-screen" style={{ background: "#0a0b14", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 px-8 py-6">
        {/* Top bar */}
        <Header />

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: PRIMARY_GRADIENT }}>
            Export Sales Report
          </button>
        </div>

        {/* Stat cards */}
        <div className="flex gap-5 mb-6">
          <StatCard label="TOTAL SALES" value={TOTAL_SALES} percent={78} gradient={LOGO_GRADIENT} Icon={Tag} />
          <StatCard label="INVENTORY LEFT" value={INVENTORY_LEFT} percent={45} gradient={PRIMARY_GRADIENT} Icon={PackageOpen} />
        </div>

        {/* Charts */}
        <Charts />

        {/* Recent orders table */}
        <OrderTable />
      </main>
    </div>
  );
}