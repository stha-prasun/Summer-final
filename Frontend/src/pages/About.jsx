import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShieldHalved, FaUsers, FaHandshake, FaArrowRight } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: FaStar,
    title: 'Precision Engineering',
    desc: 'Every model starts as a digital twin of the real vehicle. We obsess over wheel arches, panel gaps, and paint codes so you don\'t have to.',
    color: 'from-red-500/20 to-amber-500/20',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
  },
  {
    icon: FaShieldHalved,
    title: 'Authentic Detail',
    desc: 'Factory blueprints. Correct tampo printing. Interior dashboards you can barely see but we know are there. That\'s the standard.',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
  },
  {
    icon: FaUsers,
    title: 'Collector Focus',
    desc: 'Numbered certificates. Limited production runs. Packaging designed to display, not just protect. Built for the shelf, not the toy box.',
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
  },
  {
    icon: FaHandshake,
    title: 'Community Driven',
    desc: 'We pick models based on what you ask for. Our Discord shapes every drop. This isn\'t a store — it\'s a crew of people who get it.',
    color: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
  },
];

const stats = [
  { value: '2019', label: 'Founded' },
  { value: '150+', label: 'Models Released' },
  { value: '12K', label: 'Collectors Worldwide' },
  { value: '48', label: 'Countries Shipped' },
];

const About = () => {
  const headerRef = useRef(null);
  const missionRef = useRef(null);
  const valuesHeaderRef = useRef(null);
  const cardsRef = useRef([]);
  const cardInnerRef = useRef([]);
  const statsRef = useRef([]);
  const storyRef = useRef(null);
  const ctaRef = useRef(null);

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

      gsap.from(missionRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: missionRef.current,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1.2,
        },
      });

      gsap.from(valuesHeaderRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: valuesHeaderRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
        },
      });

      cardsRef.current.filter(Boolean).forEach((el, i) => {
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

      statsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1,
          },
        });
      });

      gsap.from(storyRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1.2,
        },
      });

      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 90%',
          end: 'top 55%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <section className="relative bg-neutral-950 min-h-screen pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12">

          {/* Header */}
          <div ref={headerRef} className="mb-16 md:mb-24">
            <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
              Our Story
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
              About
              <br />
              <span className="text-red-500">Us</span>
            </h2>
            <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
            <p className="font-body text-xs md:text-sm text-zinc-500 mt-6 max-w-lg leading-relaxed">
              WheelsRUs was born from a simple frustration: why can't you buy die-cast models that actually look like the real thing?
            </p>
          </div>

          {/* Mission Statement */}
          <div ref={missionRef} className="mb-20 md:mb-28">
            <div className="relative bg-neutral-900/80 border border-zinc-800/60 p-8 md:p-12 max-w-4xl">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">Mission</p>
              <h3 className="font-display text-2xl md:text-4xl text-white uppercase tracking-tight leading-tight mb-4">
                Die-Cast Without<br />
                <span className="text-red-500">Compromise</span>
              </h3>
              <div className="w-8 h-0.5 bg-red-500 mb-6" />
              <p className="font-body text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
                We partner directly with factories, negotiate for better paint processes, and reject anything that doesn't meet our standard. Every model that ships from WheelsRUs has been inspected, photographed, and approved by someone who actually collects.
              </p>
            </div>
          </div>

          {/* Values Header */}
          <div ref={valuesHeaderRef} className="mb-16 md:mb-20">
            <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
              What Drives Us
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
              Core
              <br />
              <span className="text-red-500">Values</span>
            </h2>
            <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-20 md:mb-28">
            {values.map((item, i) => {
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
                      className="absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-20 md:mb-28">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => (statsRef.current[i] = el)}
                className="relative bg-neutral-900/80 border border-zinc-800/60 p-6 text-center group"
              >
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                <p className="font-display text-3xl md:text-5xl text-white uppercase tracking-tight">
                  {stat.value}
                </p>
                <div className="w-6 h-0.5 bg-red-500 mx-auto mt-3 mb-2" />
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {stat.label}
                </p>

                <div
                  className="absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: '1px solid rgba(239,68,68,0.4)',
                    boxShadow: '0 0 20px rgba(239,68,68,0.08)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story */}
          <div ref={storyRef} className="mb-20 md:mb-28 max-w-3xl">
            <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
              The Origin
            </p>
            <h3 className="font-display text-3xl md:text-5xl text-white uppercase tracking-tight leading-tight mb-6">
              How It{' '}
              <span className="text-red-500">Started</span>
            </h3>
            <div className="w-8 h-0.5 bg-red-500 mb-6" />
            <div className="space-y-4">
              <p className="font-body text-sm md:text-base text-zinc-400 leading-relaxed">
                It started in 2019 with a shelf of mismatched Hot Wheels and a realization: the models we actually wanted — the JDM legends, the obscure exotics, the cars our parents drove — never got the premium treatment.
              </p>
              <p className="font-body text-sm md:text-base text-zinc-400 leading-relaxed">
                So we started making them ourselves. First as a small Discord group swapping customs, then as a proper operation working with manufacturers to produce runs of models nobody else would touch.
              </p>
              <p className="font-body text-sm md:text-base text-zinc-400 leading-relaxed">
                Today, WheelsRUs ships to collectors in 48 countries. We're still small. We still inspect every batch. And we still say no to anything that doesn't meet the standard.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="text-center">
            <p className="font-body text-xs md:text-sm text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
              Ready to see what we've been building? Every model in the collection was made for people who actually care about this stuff.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.35em] text-white bg-red-500/90 hover:bg-red-500 px-8 py-4 transition-all duration-500 group"
            >
              Browse Collection
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
