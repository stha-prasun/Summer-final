import { NavItem, NavSection } from "./UiComponents";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Eye,
  CalendarClock,
  MessageCircle,
  Mail,
  LogOut,
  } from "lucide-react";
import { TEXT_FAINT } from "./Theme";


export function Sidebar(){
    return (
        <>
            <aside className="w-64 shrink-0 flex flex-col px-4 py-6 h-screen sticky top-0 overflow-hidden" style={{ borderRight: "1px solid #1b1e2e" }}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-2 mb-8">
            <Link
            to="/admin/dashboard"
            className="font-display text-lg sm:text-xl md:text-2xl tracking-widest text-white hover:text-red-400 transition-colors duration-300 uppercase"
          >
            WheelsRUs
          </Link>
            <div className="text-[10px] tracking-widest mt-0.5" style={{ color: TEXT_FAINT, letterSpacing: "0.2em" }}>
              STORE ADMIN
            </div>
          </div>

          <NavItem icon={LayoutDashboard} label="Dashboard" to="/admin/dashboard"/>

          <NavSection title="INVENTORY" />
          <NavItem icon={PlusCircle} label="Add Product" to="/admin/add-products" />
          <NavItem icon={Eye} label="View Products" to="/admin/view-products" />

          <NavSection title="SALES & CUSTOMERS" />
          <NavItem icon={CalendarClock} label="Orders" to="/admin/orders" />

          <NavSection title="SUPPORT" />
          <NavItem icon={MessageCircle} label="Chat" to="/admin/chat" />

          <NavSection title="COMMUNICATION" />
          <NavItem icon={Mail} label="Bulk Email" to="/admin/bulk-email" />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer mt-auto transition-colors duration-150 hover:bg-white/[0.06] hover:text-red-400" style={{ color: "#ef4444" }}>
          <LogOut size={17} className="transition-transform duration-200 group-hover:scale-110" />
          <span>Log Out</span>
        </div>
      </aside>
        </>
    );
}