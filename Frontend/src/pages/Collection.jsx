import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaCube, FaCarSide, FaGaugeHigh, FaStar, FaXmark, FaSpinner } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { addToCart } from '../redux/cartSlice';
import { useGetAllProducts } from '../hooks/useGetAllProducts';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { key: 'all', label: 'All', icon: FaCube },
  { key: 'muscle', label: 'Muscle', icon: FaCarSide },
  { key: 'imports', label: 'J-Imports', icon: FaFire },
  { key: 'exotics', label: 'Exotics', icon: FaGaugeHigh },
  { key: 'originals', label: 'Originals', icon: FaStar },
];

const Collection = () => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error } = useGetAllProducts(activeCategory);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const detailRef = useRef(null);
  const detailInnerRef = useRef(null);
  const cardRefs = useRef([]);

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleBuyNow = (product) => {
    dispatch(addToCart(product));
    navigate('/payment');
  };

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
  }, [products]);

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

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <FaSpinner className="text-zinc-500 animate-spin" size={28} />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-body text-xs text-zinc-600 uppercase tracking-[0.3em]">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {products.map((item, i) => (
                  <div key={item._id || item.id} ref={(el) => (cardRefs.current[i] = el)}>
                    <ProductCard item={item} index={i} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-body text-xs text-zinc-600 uppercase tracking-[0.3em]">No products in this category</p>
                </div>
              )}
            </>
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
                    <div className="h-64 md:h-80 bg-neutral-900 relative overflow-hidden">
                      <img
                        src={selectedProduct.image || '/placeholder.jpg'}
                        alt={selectedProduct.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                        className="absolute inset-0 w-full h-full object-contain p-8 md:p-12"
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

                    <div className="detail-stagger flex gap-3 mt-6">
                      <button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 font-body text-[11px] md:text-xs uppercase tracking-[0.35em] text-zinc-500 border border-zinc-800/60 py-3 md:py-4 hover:text-white hover:border-red-500/30 transition-all duration-500"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(selectedProduct)}
                        className="flex-1 font-body text-[11px] md:text-xs uppercase tracking-[0.35em] text-white bg-red-500 border border-red-500 py-3 md:py-4 hover:bg-red-600 transition-all duration-500"
                      >
                        Buy Now
                      </button>
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
