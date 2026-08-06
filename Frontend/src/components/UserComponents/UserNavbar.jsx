import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiLogOut } from "react-icons/fi";
import gsap from "gsap";

const UserNavbar = () => {
  const cartItems = useSelector((state) => state.Cart?.items ?? []);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { y: -60 });
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const navLinks = [
    { to: "/orders", label: "Orders" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const linkClass = (active) =>
    `text-xs uppercase tracking-[0.2em] relative transition-colors duration-300 font-semibold ${
      active ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
    }`;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0 bg-white backdrop-blur-md border-b border-slate-300 shadow-sm shadow-slate-900/5 transition-all duration-700"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link
              to="/"
              className="font-display text-xl md:text-2xl tracking-[0.18em] text-slate-900 uppercase hover:text-red-500 transition-colors duration-300"
            >
              WheelsRUs
            </Link>

            <div className="hidden md:flex items-center gap-9">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`${linkClass(location.pathname === to)} group py-1`}
                >
                  {label}
                  <span
                    className={`block h-[1px] mt-0.5 bg-red-500 transition-all duration-300 ${
                      location.pathname === to
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 hover:border-slate-900 hover:text-slate-900 transition-colors duration-300"
            >
              <FiShoppingCart size={14} />
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:text-red-500 transition-colors duration-300"
            >
              <FiLogOut size={13} />
              Log out
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[5px] p-1.5 group cursor-pointer items-end"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block w-5 h-[1px] bg-slate-700 transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[5px] w-full" : ""}`} />
            <span className={`block w-3.5 h-[1px] bg-slate-700 transition-all duration-300 ${menuOpen ? "opacity-0" : "group-hover:w-5"}`} />
            <span className={`block w-4 h-[1px] bg-slate-700 transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[5px] w-full" : "group-hover:w-5"}`} />
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-64" : "max-h-0"}`}>
          <div className="pb-4 pt-2 border-t border-slate-100 flex flex-col gap-3">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                  location.pathname === to ? "text-slate-900" : "text-slate-700"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                location.pathname === "/cart" ? "text-slate-900" : "text-slate-700"
              }`}
            >
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
