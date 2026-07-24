import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <section
        ref={sectionRef}
        className="relative bg-neutral-950 min-h-screen pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden flex items-center"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12 w-full">
          <div ref={cardRef} className="max-w-lg mx-auto text-center">
            <div className="relative bg-neutral-900/40 border border-zinc-800/60 p-10 md:p-14">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

              <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
                Error 404
              </p>

              <h1 className="font-display text-8xl sm:text-9xl md:text-[10rem] text-white tracking-tight uppercase leading-[0.8]">
                4<span className="text-red-500">0</span>4
              </h1>

              <div className="w-12 h-[2px] bg-zinc-800 mx-auto mt-6" />

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide uppercase mt-6">
                Page Not Found
              </h2>

              <p className="font-body text-xs md:text-sm text-zinc-500 mt-4 max-w-sm mx-auto leading-relaxed">
                The road you're looking for doesn't exist. This route may have
                been moved or discontinued.
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.35em] text-white bg-red-500/90 hover:bg-red-500 px-8 py-4 transition-all duration-500 mt-8 group"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform duration-300" />
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotFound;