import { useSelector } from "react-redux";
import { Search,Bell } from "lucide-react";
import { TEXT_MUTED,CARD_BG,CARD_BORDER,LOGO_GRADIENT } from "./Theme";

export function Header(){
    const admin = useSelector((state) => state.Admin?.loggedInAdmin);
    const initials = admin?.name
      ? admin.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "AD";

    return(
        <>
            <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl w-80" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <Search size={16} color={TEXT_MUTED} />
            <input placeholder="Search..." className="bg-transparent outline-none text-sm w-full" style={{ color: "#e5e7eb" }} />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <Bell size={16} color={TEXT_MUTED} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: LOGO_GRADIENT, color: "#fff" }}>
                {initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{admin?.name || "SUPER ADMIN"}</div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>Admin</div>
              </div>
            </div>
          </div>
        </div>
        </>
    );
}