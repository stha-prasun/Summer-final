import { useState, useEffect } from "react";
import {
  Tag,
  DollarSign,
  Users,
  ShoppingCart,
} from "lucide-react";

import { PRIMARY_GRADIENT, LOGO_GRADIENT } from "../../../components/AdminComponents/Theme";
import { StatCard } from "../../../components/AdminComponents/UiComponents";
import { OrderTable } from "../../../components/AdminComponents/OrderTable";
import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Charts } from "../../../components/AdminComponents/Charts";
import { Header } from "../../../components/AdminComponents/Navbar";
import api from "../../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    if (!stats) return;

    const rows = [];

    // Summary
    rows.push(["WHEELSRUS - Sales Report"]);
    rows.push(["Generated", new Date().toLocaleString()]);
    rows.push([]);
    rows.push(["SUMMARY"]);
    rows.push(["Total Products", stats.totalProducts]);
    rows.push(["Total Orders", stats.totalOrders]);
    rows.push(["Total Revenue", `Rs. ${stats.totalRevenue.toLocaleString()}`]);
    rows.push(["Total Customers", stats.totalUsers]);
    rows.push([]);

    // Monthly Sales
    rows.push(["MONTHLY SALES"]);
    rows.push(["Month", "Units Sold", "Revenue (Rs.)"]);
    stats.monthlySales.forEach((m) => {
      rows.push([m.month, m.units, m.revenue]);
    });
    rows.push([]);

    // Category Breakdown
    rows.push(["PRODUCTS BY CATEGORY"]);
    rows.push(["Category", "Count"]);
    stats.categoryBreakdown.forEach((c) => {
      rows.push([c.name, c.value]);
    });
    rows.push([]);

    // Recent Orders
    rows.push(["RECENT ORDERS"]);
    rows.push(["Model", "Date", "Amount", "Status"]);
    stats.recentOrders.forEach((o) => {
      rows.push([o.model, o.date, o.price, o.status]);
    });

    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wheelsrus-sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex w-full min-h-screen" style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}>
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

  return (
    <div className="flex w-full min-h-screen" style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}>
      <Sidebar />

      <main className="flex-1 px-8 py-6">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: PRIMARY_GRADIENT }}
          >
            Export Sales Report
          </button>
        </div>

        {/* Stat cards */}
        <div className="flex gap-5 mb-6">
          <StatCard label="TOTAL PRODUCTS" value={stats?.totalProducts || 0} percent={Math.round(stats?.totalProducts ? Math.min((stats.totalProducts / 50) * 100, 100) : 0)} gradient={PRIMARY_GRADIENT} Icon={Tag} />
          <StatCard label="TOTAL ORDERS" value={stats?.totalOrders || 0} percent={Math.round(stats?.totalOrders ? Math.min((stats.totalOrders / 30) * 100, 100) : 0)} gradient={LOGO_GRADIENT} Icon={ShoppingCart} />
          <StatCard label="TOTAL REVENUE" value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`} percent={Math.round(stats?.totalRevenue ? Math.min((stats.totalRevenue / 100000) * 100, 100) : 0)} gradient="linear-gradient(90deg,#059669,#34d399)" Icon={DollarSign} />
          <StatCard label="TOTAL CUSTOMERS" value={stats?.totalUsers || 0} percent={Math.round(stats?.totalUsers ? Math.min((stats.totalUsers / 100) * 100, 100) : 0)} gradient="linear-gradient(90deg,#1a9fd8,#38bdf8)" Icon={Users} />
        </div>

        {/* Charts */}
        <Charts
          monthlySales={stats?.monthlySales || []}
          categoryBreakdown={stats?.categoryBreakdown || []}
        />

        {/* Recent orders table */}
        <OrderTable orders={stats?.recentOrders || []} />
      </main>
    </div>
  );
}
