import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaDiscord, FaXTwitter, FaArrowUp } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { to: '/collection', label: 'Collection' },
  { to: '/model', label: '3D Model' },
  { to: '/about', label: 'About' },
];

const Footer = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!contentRef.current) return;
      gsap.from(contentRef.current.children, {
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          end: 'top 40%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClass = 'block font-body text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors duration-300 relative group w-fit';

  return (
    <footer ref={sectionRef} className="relative bg-neutral-950 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
        }}
      />

      <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      <img src="/silhouette.png" alt="" aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-auto opacity-15 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <Link to="/" className="font-display text-xl md:text-2xl tracking-widest text-white hover:text-red-400 transition-colors duration-300 uppercase">
              WheelsRUs
            </Link>
            <p className="font-body text-xs text-zinc-600 mt-3 leading-relaxed max-w-xs">
              Precision die-cast. Zero compromise.
            </p>
          </div>

          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-zinc-700 mb-4">Navigate</p>
            <div className="space-y-3">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass}>
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500 group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-zinc-700 mb-4">Connect</p>
            <div className="flex items-center gap-4 mb-6">
              <a href="#" aria-label="GitHub" className="text-zinc-500 hover:text-white transition-colors duration-300">
                <FaGithub size={16} />
              </a>
              <a href="#" aria-label="Discord" className="text-zinc-500 hover:text-white transition-colors duration-300">
                <FaDiscord size={16} />
              </a>
              <a href="#" aria-label="X" className="text-zinc-500 hover:text-white transition-colors duration-300">
                <FaXTwitter size={16} />
              </a>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors duration-300 group"
            >
              <FaArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              Back to top
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-800/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-zinc-700">
            &copy; {new Date().getFullYear()} WheelsRUs
          </span>
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-zinc-800">
            All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
