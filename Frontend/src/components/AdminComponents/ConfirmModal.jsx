import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import {
  CARD_BG,
  CARD_BORDER,
  TEXT_MUTED,
  REQUIRED_COLOR,
} from "./Theme";

export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors duration-150 hover:bg-white/5"
          style={{ color: TEXT_MUTED }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(239,68,68,0.12)" }}
        >
          <AlertTriangle size={22} style={{ color: REQUIRED_COLOR }} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-white/5"
            style={{
              border: `1px solid ${CARD_BORDER}`,
              color: TEXT_MUTED,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: REQUIRED_COLOR }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
