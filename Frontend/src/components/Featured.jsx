import { useEffect, useRef, useCallback } from 'react';
import { FaStar, FaShieldHalved, FaBolt, FaTrophy } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    icon: FaStar,
    title: 'Premium Casting',
    desc: 'Every model is precision die-cast from zinc alloy. The weight alone tells you it\'s real.',
    color: 'from-red-500/20 to-amber-500/20',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
  },
  {
    icon: FaShieldHalved,
    title: 'Authentic Details',
    desc: 'Factory blueprints. Correct paint codes. Tampography that matches the original down to the badge.',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
  },
  {
    icon: FaBolt,
    title: "Collector's Grade",
    desc: 'Spectraflame finishes. Real Riders rubber. Numbered certificates. Museum quality out of the box.',
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
  },
  {
    icon: FaTrophy,
    title: 'Limited Drops',
    desc: 'Once they sell out, they\'re gone forever. No reprints. No second chances. That\'s the deal.',
    color: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
  },
];

const Featured = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const cardInnerRef = useRef([]);

  const onMouseMove = useCallback((e, i) => {
    const card = cardInnerRef.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  }, []);

  const onMouseLeave = useCallback((i) => {
    const card = cardInnerRef.current[i];
    if (!card) return;
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
        },
      });

      cards.forEach((el, i) => {
        const delay = i * 0.12;
        const fromX = i % 2 === 0 ? -40 : 40;

        gsap.from(el, {
          x: fromX,
          y: 60,
          opacity: 0,
          rotate: i % 2 === 0 ? -1 : 1,
          duration: 1.2,
          ease: 'power4.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.2,
          },
        });

        gsap.from(el.querySelector('.reveal-icon'), {
          scale: 0,
          rotate: -180,
          duration: 0.8,
          ease: 'back.out(3)',
          delay: delay + 0.2,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        });

        gsap.from(el.querySelector('.reveal-text'), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: delay + 0.3,
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.8,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-neutral-950 py-32 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
        }}
      />

      <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-amber-500/[0.02] to-transparent pointer-events-none" />

      <div ref={headerRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mb-16 md:mb-20">
        <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
          The Standard
        </p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
          Built for
          <br />
          <span className="text-red-500">Speed</span>
        </h2>
        <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            const rotations = [-1.2, 1.5, -0.8, 1.1];

            return (
              <div
                key={item.title}
                ref={(el) => (cardsRef.current[i] = el)}
                onMouseMove={(e) => onMouseMove(e, i)}
                onMouseLeave={() => onMouseLeave(i)}
                className="group cursor-default"
                style={{ transform: `rotate(${rotations[i]}deg)` }}
              >
                <div
                  ref={(el) => (cardInnerRef.current[i] = el)}
                  className="relative bg-neutral-900/80 border border-zinc-800/60 p-6 md:p-8 will-change-transform"
                  style={{
                    background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, rgba(9,9,11,0.95) 50%)`,
                    transition: 'background 0.25s ease',
                  }}
                >
                  <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                  <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                  <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                  <div className="flex items-start gap-4">
                    <div
                      className={`reveal-icon w-12 h-12 rounded-full bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg md:text-2xl text-white uppercase tracking-tight reveal-text">
                        {item.title}
                      </h3>
                      <div className={`w-8 h-0.5 ${item.accent} mt-2 mb-3`} />
                      <p className="font-body text-xs md:text-sm text-zinc-400 leading-relaxed reveal-text">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="font-body text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                      Ref: WHL-{String(i + 1).padStart(3, '0')}
                    </span>
                    <span className="font-body text-[10px] text-zinc-700 uppercase tracking-[0.15em]">
                      No. {i + 1} / 4
                    </span>
                  </div>

                  <div
                    className={`absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    style={{
                      border: `1px solid ${i === 0 ? 'rgba(239,68,68,0.4)' : i === 1 ? 'rgba(59,130,246,0.4)' : i === 2 ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`,
                      boxShadow: `0 0 20px ${i === 0 ? 'rgba(239,68,68,0.08)' : i === 1 ? 'rgba(59,130,246,0.08)' : i === 2 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)'}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Featured;
