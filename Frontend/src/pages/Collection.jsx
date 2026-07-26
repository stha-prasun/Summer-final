import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaFire, FaCube, FaCarSide, FaGaugeHigh, FaStar, FaXmark } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1, name: "'69 Camaro", series: 'Muscle Mania', year: '2025',
    price: '$6.99', category: 'muscle', badge: 'Limited',
    gradient: 'from-red-600 via-red-500 to-rose-400',
    accent: 'bg-red-500', border: 'border-red-500/20',
    description: 'The first-generation Camaro returns in Spectraflame red with Real Riders rubber tires. A true icon reborn.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: '5000 pcs' },
  },
  {
    id: 2, name: 'Twin Mill', series: 'Originals', year: '2025',
    price: '$6.99', category: 'originals', badge: 'New',
    gradient: 'from-purple-600 via-purple-500 to-fuchsia-400',
    accent: 'bg-purple-500', border: 'border-purple-500/20',
    description: 'The legendary twin-engine custom returns in a head-turning purple finish. Born in the \'70s, built for today.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 3, name: 'Bone Shaker', series: 'Originals', year: '2025',
    price: '$6.99', category: 'originals',
    gradient: 'from-emerald-600 via-emerald-500 to-green-400',
    accent: 'bg-emerald-500', border: 'border-emerald-500/20',
    description: 'Hot Wheels\' most iconic skull-faced hot rod. Emerald green Spectraflame with exposed engine detail.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 4, name: 'Deora II', series: 'Originals', year: '2025',
    price: '$6.99', category: 'originals',
    gradient: 'from-sky-600 via-sky-500 to-cyan-400',
    accent: 'bg-sky-500', border: 'border-sky-500/20',
    description: 'The surf-inspired pickup with the front-mounted cab. Sky-blue metallic with tampo graphics.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 5, name: "'57 Chevy", series: 'Hot Trucks', year: '2025',
    price: '$6.99', category: 'originals',
    gradient: 'from-amber-500 via-yellow-400 to-orange-300',
    accent: 'bg-amber-500', border: 'border-amber-500/20',
    description: 'Classic \'57 Chevy truck in a candy amber finish. Deep-dish wheels and a tailgate that means business.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 6, name: 'Rodger Dodger', series: 'Originals', year: '2025',
    price: '$6.99', category: 'originals', badge: 'New',
    gradient: 'from-orange-600 via-orange-500 to-yellow-400',
    accent: 'bg-orange-500', border: 'border-orange-500/20',
    description: 'The winged wedge returns. Blazing orange with bold racing stripes down the center line.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 7, name: "'70 Superbird", series: 'Muscle Mania', year: '2025',
    price: '$6.99', category: 'muscle', badge: 'Limited',
    gradient: 'from-stone-500 via-neutral-400 to-zinc-300',
    accent: 'bg-stone-500', border: 'border-stone-500/20',
    description: 'The NASCAR legend with the towering rear wing. Limited-run in matte silver with vintage deco.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: '5000 pcs' },
  },
  {
    id: 8, name: "'71 Datsun 510", series: 'J-Imports', year: '2025',
    price: '$7.49', category: 'imports', badge: 'New',
    gradient: 'from-rose-600 via-red-500 to-pink-400',
    accent: 'bg-rose-500', border: 'border-rose-500/20',
    description: 'The iconic Japanese sports sedan in rose-crimson. SSR Mark II wheels and a lowered stance.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 9, name: "'95 Mazda RX-7", series: 'J-Imports', year: '2025',
    price: '$7.49', category: 'imports',
    gradient: 'from-yellow-500 via-amber-400 to-orange-300',
    accent: 'bg-yellow-500', border: 'border-yellow-500/20',
    description: 'Golden-age JDM icon with the legendary rotary. Wide-body stance and polished Watanabe wheels.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 10, name: 'McLaren Senna', series: 'Exotics', year: '2025',
    price: '$7.99', category: 'exotics', badge: 'New',
    gradient: 'from-orange-600 via-orange-500 to-red-400',
    accent: 'bg-orange-500', border: 'border-orange-500/20',
    description: 'Ayrton Senna\'s namesake hypercar in lava orange. Dihedral doors and active aero in miniature.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 11, name: 'Pagani Huayra', series: 'Exotics', year: '2025',
    price: '$7.99', category: 'exotics',
    gradient: 'from-slate-500 via-gray-400 to-zinc-300',
    accent: 'bg-slate-500', border: 'border-slate-500/20',
    description: 'Italian artisan hypercar in polished silver. Active aero flaps and quad exhaust tips detailed.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
  {
    id: 12, name: "'18 Challenger", series: 'Muscle Mania', year: '2025',
    price: '$6.99', category: 'muscle',
    gradient: 'from-zinc-900 via-zinc-800 to-zinc-700',
    accent: 'bg-zinc-600', border: 'border-zinc-600/20',
    description: 'Modern muscle in stealth black. Wide body, racing stripes, and a supercharged hemi under the hood.',
    specs: { scale: '1:64', material: 'Die-cast Zamac', tampo: 'Full', limited: 'Standard' },
  },
];

const categories = [
  { key: 'all', label: 'All', icon: FaCube },
  { key: 'muscle', label: 'Muscle', icon: FaCarSide },
  { key: 'imports', label: 'J-Imports', icon: FaFire },
  { key: 'exotics', label: 'Exotics', icon: FaGaugeHigh },
  { key: 'originals', label: 'Originals', icon: FaStar },
];

const Collection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const detailRef = useRef(null);
  const detailInnerRef = useRef(null);
  const cardRefs = useRef([]);
  const cardInnerRef = useRef([]);

  const filtered = useMemo(
    () => activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  const onMouseMove = useCallback((e, i) => {
    const card = cardInnerRef.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const onMouseLeave = useCallback((i) => {
    const el = cardInnerRef.current[i];
    if (!el) return;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60, opacity: 0, duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 40%', scrub: 1.5 },
      });
      gsap.from(filterRef.current, {
        y: 30, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: filterRef.current, start: 'top 90%', end: 'top 50%', scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;
    const ctx = gsap.context(() => {
      cards.forEach((el, i) => {
        const fromX = i % 2 === 0 ? -40 : 40;
        gsap.from(el, {
          x: fromX, y: 60, opacity: 0, rotate: i % 2 === 0 ? -1 : 1,
          duration: 1.2, ease: 'power4.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: 1.2 },
        });
      });
    });
    return () => ctx.revert();
  }, [filtered]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (!selectedProduct || !detailInnerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(detailInnerRef.current, {
        y: 80, opacity: 0, duration: 1.2, ease: 'power4.out',
      });
      gsap.from(detailInnerRef.current.querySelectorAll('.detail-stagger'), {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        stagger: 0.1, delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, [selectedProduct]);

  return (
    <>
      <Navbar />
      <section ref={sectionRef} className="relative bg-neutral-950 min-h-screen pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div ref={headerRef} className="mb-12 md:mb-16">
            <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
              The Collection
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
              Hot
              <br />
              <span className="text-red-500">Wheels</span>
            </h2>
            <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
            <p className="font-body text-xs md:text-sm text-zinc-500 mt-6 max-w-md leading-relaxed">
              Precision die-cast. Zero compromise. Every drop is a collector&apos;s piece.
            </p>
          </div>

          <div ref={filterRef} className="mb-10 md:mb-12">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] px-4 md:px-5 py-2.5 md:py-3 border transition-all duration-500 ${
                      isActive
                        ? 'text-white border-red-500/40 bg-red-500/10'
                        : 'text-zinc-500 border-zinc-800/60 bg-transparent hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    <Icon className={`text-xs transition-colors duration-500 ${isActive ? 'text-red-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((item, i) => {
              const rotations = [-1.2, 1.5, -0.8, 1.1, -0.6, 0.9, -1.4, 1.3, -0.7, 1.6, -0.5, 0.8];
              return (
                <div
                  key={item.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onMouseMove={(e) => onMouseMove(e, i)}
                  onMouseLeave={() => onMouseLeave(i)}
                  className="group cursor-default"
                  style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
                >
                  <div
                    ref={(el) => (cardInnerRef.current[i] = el)}
                    className="relative bg-neutral-900/80 border border-zinc-800/60 will-change-transform"
                    style={{
                      background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, rgba(9,9,11,0.95) 50%)`,
                      transition: 'background 0.25s ease',
                    }}
                  >
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                    <div className={`h-44 md:h-52 bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                      <img
                        src="/silhouette.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-contain p-4 md:p-6 opacity-60 scale-x-[-1] mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />

                      {item.badge && (
                        <span className={`absolute top-3 right-3 font-body text-[8px] md:text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border ${item.border} text-white bg-${item.accent.replace('bg-', '').replace('500', '500/80')}`}>
                          {item.badge}
                        </span>
                      )}

                      <span className="absolute bottom-3 left-3 font-body text-[8px] text-white/30 uppercase tracking-[0.2em]">
                        Ref: WHL-{String(item.id).padStart(3, '0')}
                      </span>
                    </div>

                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-tight leading-none">
                          {item.name}
                        </h3>
                        <span className="font-display text-lg md:text-xl text-red-400 shrink-0">
                          {item.price}
                        </span>
                      </div>

                      <div className={`w-8 h-0.5 ${item.accent} mb-2.5`} />

                      <div className="flex items-center gap-3 text-[10px] font-body uppercase tracking-[0.2em]">
                        <span className="text-zinc-500">{item.series}</span>
                        <span className="text-zinc-700">|</span>
                        <span className="text-zinc-600">{item.year}</span>
                      </div>

                      <button
                        onClick={() => handleViewDetails(item)}
                        className="mt-4 w-full font-body text-[10px] uppercase tracking-[0.35em] text-zinc-500 border border-zinc-800/60 py-3 hover:text-white hover:border-red-500/30 transition-all duration-500"
                      >
                        View Details
                      </button>
                    </div>

                    <div
                      className="absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        border: `1px solid ${item.border.replace('20', '40')}`,
                        boxShadow: `0 0 20px ${item.border.replace('/20', '/08')}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-xs text-zinc-600 uppercase tracking-[0.3em]">No products in this category</p>
            </div>
          )}

          {selectedProduct && (
            <div ref={detailRef} className="mt-16 md:mt-20 scroll-mt-24">
              <div ref={detailInnerRef} className="relative bg-neutral-900/80 border border-zinc-800/60 p-6 md:p-10 lg:p-12">
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                <button
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 border border-zinc-800 text-zinc-500 hover:text-white hover:border-red-500/30 transition-all duration-300 z-10"
                >
                  <FaXmark size={14} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <div className={`h-64 md:h-80 bg-gradient-to-br ${selectedProduct.gradient} relative overflow-hidden`}>
                      <img
                        src="/silhouette.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-contain p-8 md:p-12 opacity-60 scale-x-[-1] mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                      {selectedProduct.badge && (
                        <span className={`absolute top-4 right-4 font-body text-[9px] md:text-[11px] uppercase tracking-[0.25em] px-3 py-1.5 border ${selectedProduct.border} text-white bg-${selectedProduct.accent.replace('bg-', '').replace('500', '500/80')}`}>
                          {selectedProduct.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="detail-stagger font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-2">
                      {selectedProduct.series}
                    </p>
                    <h3 className="detail-stagger font-display text-4xl sm:text-5xl md:text-7xl text-white uppercase tracking-tight leading-[0.85] mb-3">
                      {selectedProduct.name}
                    </h3>
                    <div className={`detail-stagger w-12 h-[2px] ${selectedProduct.accent} mb-4`} />

                    <p className="detail-stagger font-body text-xs md:text-sm text-zinc-400 leading-relaxed mb-6 max-w-lg">
                      {selectedProduct.description}
                    </p>

                    <div className="detail-stagger grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: 'Price', value: selectedProduct.price },
                        { label: 'Scale', value: selectedProduct.specs.scale },
                        { label: 'Material', value: selectedProduct.specs.material },
                        { label: 'Tampography', value: selectedProduct.specs.tampo },
                        { label: 'Release', value: selectedProduct.year },
                        { label: 'Edition', value: selectedProduct.specs.limited },
                      ].map((spec) => (
                        <div key={spec.label}>
                          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">{spec.label}</p>
                          <p className="font-body text-xs md:text-sm text-white">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Collection;
