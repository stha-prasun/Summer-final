import React from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  TEXT_FAINT,
  TEXT_BODY,
  REQUIRED_COLOR,
  PRIMARY_GRADIENT,
  ACCENT,
} from "./Theme";

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

export function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      {title && (
        <div className="flex items-center gap-2 mb-5">
          {Icon && <Icon size={16} style={{ color: ACCENT }} />}
          <h3 className="font-semibold text-base" style={{ color: "#ffffff" }}>
            {title}
          </h3>
        </div>
      )}
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar nav
// ---------------------------------------------------------------------------

import { Link, useLocation } from "react-router-dom";

export function NavItem({ to = "#", icon: Icon, label, indent, badge, hasChevron }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150"
      style={{
        marginLeft: indent ? 20 : 0,
        background: isActive ? PRIMARY_GRADIENT : "transparent",
        color: isActive ? "#ffffff" : "#9ca3af",
        fontWeight: isActive ? 600 : 500,
      }}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={17} />}
        <span>{label}</span>
      </div>
      
      {hasChevron && <ChevronDown size={14} />}
      
      {badge && (
        <span
          className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
          style={{ background: REQUIRED_COLOR, color: "#fff" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export function NavSection({ title }) {
  return (
    <div className="px-3 pt-5 pb-2 text-xs tracking-widest" style={{ color: TEXT_FAINT, fontWeight: 700, letterSpacing: "0.12em" }}>
      {title}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------

export function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT_BODY }}>
      {children}
      {required && <span style={{ color: REQUIRED_COLOR }}> *</span>}
    </label>
  );
}

export function HelpText({ children }) {
  return (
    <p className="text-xs mt-1.5" style={{ color: TEXT_MUTED }}>
      {children}
    </p>
  );
}

export function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
      style={{ border: `1px solid ${CARD_BORDER}`, background: INPUT_BG, color: "#f5f5f5" }}
    />
  );
}

export function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none"
      style={{ border: `1px solid ${CARD_BORDER}`, background: INPUT_BG, color: "#f5f5f5" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Dashboard-specific blocks
// ---------------------------------------------------------------------------

export function StatCard({ label, value, suffix, percent, gradient, Icon }) {
  return (
    <div
      className="rounded-2xl p-5 flex-1"
      style={{ background: "linear-gradient(155deg, #171a2b 0%, #12141f 100%)", border: `1px solid ${CARD_BORDER}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest" style={{ color: TEXT_MUTED, letterSpacing: "0.1em" }}>
          {label}
        </span>
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: "1px solid #33374d", color: TEXT_MUTED }}>
          <ArrowUpRight size={14} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
            <Icon size={18} color="#ffffff" />
          </div>
          <span className="text-3xl font-bold text-white">{value}</span>
          {suffix && (
            <span className="text-sm mb-0.5" style={{ color: TEXT_MUTED }}>
              {suffix}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold" style={{ color: TEXT_MUTED }}>
          {percent}%
        </span>
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ background: CARD_BORDER }}>
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: gradient }} />
      </div>
    </div>
  );
}