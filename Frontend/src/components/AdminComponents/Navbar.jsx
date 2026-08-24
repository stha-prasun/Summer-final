import { useSelector } from "react-redux";
import { TEXT_MUTED, LOGO_GRADIENT } from "./Theme";

export function Header(){
    const admin = useSelector((state) => state.Admin?.loggedInAdmin);
    const initials = admin?.name
      ? admin.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "AD";

    return(
        <>
            <div className="flex items-center justify-end mb-8">
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
        </>
    );
}