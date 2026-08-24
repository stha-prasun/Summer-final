import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 176;
const frameUrl = (i) => `/frames/HeroFrames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

// draw image centered cover like object-cover
function drawCover(ctx, img, canvasW, canvasH) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const scale = Math.max(canvasW / iw, canvasH / ih);
  const w = iw * scale;
  const h = ih * scale;
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

const Hero = ({ ready }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const scrollHintRef = useRef(null);
  const overlayRef = useRef(null);
  const tlRef = useRef(null);

  const imagesRef = useRef([]);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const ctxRef = useRef(null);

  // Preload all frames with decode, concurrency 8
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let cancelled = false;

    const loadOne = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        // decoded async, let browser cache
        img.decoding = 'async';
        // high priority for first frame
        if (i === 0) img.fetchPriority = 'high';
        img.src = frameUrl(i);
        if (img.decode) {
          img
            .decode()
            .then(() => resolve(img))
            .catch(() => resolve(img));
        } else {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        }
      });

    // progressive: first 10 immediately, then rest batched
    (async () => {
      // load first frame instantly for poster
      const first = await loadOne(0);
      if (cancelled) return;
      images[0] = first;
      // draw first frame ASAP if canvas ready
      if (canvasRef.current && ctxRef.current && first.naturalWidth) {
        const c = canvasRef.current;
        drawCover(ctxRef.current, first, c.width, c.height);
      }

      // load next 15 quickly (visible range)
      const head = await Promise.all(
        Array.from({ length: 15 }, (_, k) => loadOne(k + 1))
      );
      if (cancelled) return;
      head.forEach((img, idx) => {
        images[idx + 1] = img;
      });

      // load remaining in batches of 12 to avoid network burst
      const batchSize = 12;
      for (let start = 16; start < TOTAL_FRAMES; start += batchSize) {
        if (cancelled) break;
        const end = Math.min(start + batchSize, TOTAL_FRAMES);
        const batch = await Promise.all(
          Array.from({ length: end - start }, (_, k) => loadOne(start + k))
        );
        batch.forEach((img, idx) => {
          images[start + idx] = img;
        });
        // allow main thread to breathe
        await new Promise((r) => setTimeout(r, 0));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // canvas setup + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    ctxRef.current = ctx;
    // improve image smoothing quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      // use CSS size * dpr for crispness, but cap to avoid huge memory
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // redraw current
        const img = imagesRef.current[currentRef.current];
        if (img && img.naturalWidth) {
          ctx.clearRect(0, 0, w, h);
          drawCover(ctx, img, w, h);
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // scroll + gsap
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = (idx) => {
      const images = imagesRef.current;
      const img = images[idx];
      const ctx = ctxRef.current;
      if (!ctx) return;
      // if not yet loaded, try to find nearest loaded frame backward
      let useImg = img;
      if (!useImg || !useImg.naturalWidth) {
        for (let d = 1; d < 20; d++) {
          const prev = images[idx - d];
          if (prev && prev.naturalWidth) {
            useImg = prev;
            break;
          }
        }
        if (!useImg) return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCover(ctx, useImg, canvas.width, canvas.height);
      currentRef.current = idx;
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!visibleRef.current) return;
        const t = targetRef.current;
        if (t !== currentRef.current) draw(t);
      });
    };

    // pause when offscreen
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
        if (visibleRef.current) schedule();
      },
      { threshold: 0 }
    );
    io.observe(section);

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // static, no scrub
        const first = imagesRef.current[0];
        if (first && ctxRef.current) draw(0);
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
          if (idx !== targetRef.current) {
            targetRef.current = idx;
            schedule();
          }
        },
      });

      // parallax layers - keep but lighter scrub
      gsap.to(contentRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'top+=250',
          scrub: 0.8,
        },
      });

      gsap.set('.hero-eyebrow', { y: 20 });
      gsap.set('.hero-accent-line', { scaleX: 0 });
      gsap.set('.hero-title', { y: 60 });
      gsap.set('.hero-subtitle', { y: 20 });
      gsap.set('.hero-buttons > *', { y: 16 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
      tlRef.current = tl;

      tl.to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.8 })
        .to('.hero-accent-line', { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to('.hero-title', { y: 0, opacity: 1, duration: 1.1 }, '-=0.6')
        .to('.hero-subtitle', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .to('.hero-buttons > *', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, section);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (ready && tlRef.current) {
      tlRef.current.play();
    }
  }, [ready]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${TOTAL_FRAMES * 1.2}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10 pointer-events-none" />
        <div ref={overlayRef} className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full select-none"
          aria-hidden="true"
          // fixed size CSS, actual pixel size set via dpr in effect
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent z-20 pointer-events-none" />

        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4 will-change-transform"
        >
          <p className="hero-eyebrow opacity-0 font-body text-[10px] md:text-xs uppercase tracking-[0.4em] text-zinc-400 mb-5">
            Hot Wheels Collection
          </p>

          <div className="hero-accent-line opacity-0 w-12 h-[2px] bg-red-500 mb-6 origin-center" />

          <h1 className="hero-title opacity-0 font-display text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] leading-none tracking-wide text-white drop-shadow-2xl select-none">
            WheelsRUs
          </h1>

          <div className="hero-accent-line opacity-0 w-12 h-[2px] bg-red-500 mt-6 mb-6 origin-center" />

          <p className="hero-subtitle opacity-0 font-body text-sm sm:text-base md:text-lg max-w-lg text-zinc-400 leading-relaxed tracking-wider font-light">
            Unleash the Need for Speed Every Collection Tells a Story
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => navigate('/collection')}
              className="opacity-0 group relative px-10 py-3.5 md:px-14 md:py-4 bg-red-600 hover:bg-red-500 rounded-none text-sm md:text-base font-semibold cursor-pointer uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <button className="opacity-0 group relative px-10 py-3.5 md:px-14 md:py-4 border border-zinc-600 hover:border-zinc-400 text-zinc-400 hover:text-white rounded-none text-sm md:text-base font-semibold cursor-pointer uppercase tracking-[0.2em] transition-all duration-300 bg-black/30">
              <span className="relative z-10">Watch Trailer</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-500 pointer-events-none"
        >
          <span className="font-body text-[9px] uppercase tracking-[0.45em]">Scroll</span>
          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
