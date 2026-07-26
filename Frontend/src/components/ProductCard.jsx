import { useState, useRef, useCallback } from 'react';

const rotations = [-1.2, 1.5, -0.8, 1.1, -0.6, 0.9, -1.4, 1.3, -0.7, 1.6, -0.5, 0.8];

const ProductCard = ({ item, index, onViewDetails }) => {
  const [hovered, setHovered] = useState(false);
  const innerRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = innerRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
    setHovered(false);
  }, []);

  return (
    <div
      className="group cursor-default"
      style={{ transform: `rotate(${rotations[index % rotations.length]}deg)` }}
    >
      <div
        ref={innerRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
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

        <div className="h-44 md:h-52 relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-all duration-500 ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <img
              src="/silhouette.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain p-4 md:p-6 opacity-60 scale-x-[-1] mix-blend-overlay"
            />
          </div>

          <div
            className={`absolute inset-0 bg-neutral-900 transition-all duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-contain p-4 md:p-6"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />

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
            onClick={() => onViewDetails(item)}
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
};

export default ProductCard;
