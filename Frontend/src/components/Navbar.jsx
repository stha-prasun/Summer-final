import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { FiShoppingCart, FiPackage, FiUser } from 'react-icons/fi';
import gsap from 'gsap';

const Navbar = () => {
  const user = useSelector((state) => state.User?.loggedInUser);
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

  const iconClass = 'text-zinc-500 hover:text-white transition-colors duration-300';

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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-body text-[11px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/cart" aria-label="Cart" className={iconClass}>
                <FiShoppingCart size={16} />
              </Link>
              {user ? (
                <Link to="/orders" aria-label="Orders" className={iconClass}>
                  <FiPackage size={16} />
                </Link>
              ) : (
                <Link to="/login" aria-label="Login" className={iconClass}>
                  <FiUser size={16} />
                </Link>
              )}
              <span className="w-px h-4 bg-zinc-700" />
              <a href="#" aria-label="GitHub" className={iconClass}>
                <FaGithub size={14} />
              </a>
              <a href="#" aria-label="Discord" className={iconClass}>
                <FaDiscord size={14} />
              </a>
              <a href="#" aria-label="X" className={iconClass}>
                <FaXTwitter size={14} />
              </a>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1 p-1.5 group cursor-pointer items-end"
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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2.5 text-base font-display tracking-wider uppercase transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] mt-3">
              <div className="flex items-center gap-6">
                {user ? (
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Orders"
                    className="text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1"
                  >
                    <FiPackage size={18} />
                    <span className="text-[10px] uppercase tracking-widest">Orders</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Login"
                    className="text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1"
                  >
                    <FiUser size={18} />
                    <span className="text-[10px] uppercase tracking-widest">Login</span>
                  </Link>
                )}
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cart"
                  className="text-zinc-400 hover:text-white transition-colors flex flex-col items-center gap-1"
                >
                  <FiShoppingCart size={18} />
                  <span className="text-[10px] uppercase tracking-widest">Cart</span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" aria-label="GitHub" className="text-zinc-500 hover:text-white transition-colors">
                  <FaGithub size={16} />
                </a>
                <a href="#" aria-label="Discord" className="text-zinc-500 hover:text-white transition-colors">
                  <FaDiscord size={16} />
                </a>
                <a href="#" aria-label="X" className="text-zinc-500 hover:text-white transition-colors">
                  <FaXTwitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-100" />
    </nav>
  );
};

export default Navbar;
