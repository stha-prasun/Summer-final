import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiShoppingCart, FiPackage, FiUser, FiMessageCircle } from 'react-icons/fi';
import gsap from 'gsap';

const Navbar = () => {
  const user = useSelector((state) => state.User?.loggedInUser);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { y: -80 });
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { to: '/collection', label: 'Collection' },
    { to: '/model', label: '3D Model' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const iconClass = (active) =>
    `${active ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/10'} transition-colors duration-300 p-2 -m-1 rounded-full`;
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0 bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/40 transition-all duration-700"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="font-display text-lg sm:text-xl md:text-2xl tracking-widest text-white hover:text-red-400 transition-colors duration-300 uppercase"
          >
            WheelsRUs
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-[11px] uppercase tracking-[0.3em] transition-colors duration-300 relative group px-2 py-2 -my-1 rounded-md ${active ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1.5 left-2 right-2 h-[1px] bg-red-500 transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <Link to="/chat" aria-label="Chat" className={iconClass(isActive('/chat'))}>
                  <FiMessageCircle size={16} />
                </Link>
              )}
              <Link to="/cart" aria-label="Cart" className={iconClass(isActive('/cart'))}>
                <FiShoppingCart size={16} />
              </Link>
              {user ? (
                <Link to="/orders" aria-label="Orders" className={iconClass(isActive('/orders'))}>
                  <FiPackage size={16} />
                </Link>
              ) : (
                <Link to="/login" aria-label="Login" className={iconClass(isActive('/login'))}>
                  <FiUser size={16} />
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1 p-2 -m-1 group cursor-pointer items-end rounded-md"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`block w-5 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[5px] w-full' : ''}`} />
              <span className={`block w-3.5 h-[1.5px] bg-zinc-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'group-hover:w-5'}`} />
              <span className={`block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[5px] w-full' : 'group-hover:w-5'}`} />
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? 'max-h-80' : 'max-h-0'}`}>
          <div className="pb-4 pt-2 border-t border-white/[0.06] space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2.5 px-2 -mx-2 rounded-md text-base font-display tracking-wider uppercase transition-colors duration-300 ${active ? 'text-white bg-white/[0.06]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-6 pt-3 border-t border-white/[0.04] mt-3">
              {user && (
                <Link
                  to="/chat"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Chat"
                  className={`flex flex-col items-center gap-1 p-2 -m-1 rounded-md transition-colors ${isActive('/chat') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`}
                >
                  <FiMessageCircle size={18} />
                  <span className="text-[10px] uppercase tracking-widest">Chat</span>
                </Link>
              )}
              {user ? (
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Orders"
                  className={`flex flex-col items-center gap-1 p-2 -m-1 rounded-md transition-colors ${isActive('/orders') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`}
                >
                  <FiPackage size={18} />
                  <span className="text-[10px] uppercase tracking-widest">Orders</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Login"
                  className={`flex flex-col items-center gap-1 p-2 -m-1 rounded-md transition-colors ${isActive('/login') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`}
                >
                  <FiUser size={18} />
                  <span className="text-[10px] uppercase tracking-widest">Login</span>
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                aria-label="Cart"
                className={`flex flex-col items-center gap-1 p-2 -m-1 rounded-md transition-colors ${isActive('/cart') ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'}`}
              >
                <FiShoppingCart size={18} />
                <span className="text-[10px] uppercase tracking-widest">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-100" />
    </nav>
  );
};

export default Navbar;
