import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 176;

const Hero = ({ ready }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const scrollHintRef = useRef(null);
  const overlayRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const index = Math.min(Math.floor(self.progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
          const num = String(index + 1).padStart(3, '0');
          imgRef.current.src = `/frames/HeroFrames/ezgif-frame-${num}.jpg`;
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });

      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'top+=300',
          scrub: 1.5,
        },
      });

      gsap.set('.hero-eyebrow', { y: 40 });
      gsap.set('.hero-accent-line', { scaleX: 0 });
      gsap.set('.hero-title', { y: 100, skewY: 3 });
      gsap.set('.hero-subtitle', { y: 40 });
      gsap.set('.hero-buttons > *', { y: 30 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
      tlRef.current = tl;

      tl.to('.hero-eyebrow', { y: 0, opacity: 1, duration: 1 })
        .to('.hero-accent-line', { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.6')
        .to('.hero-title', { y: 0, opacity: 1, duration: 1.4, skewY: 0 }, '-=0.8')
        .to('.hero-subtitle', { y: 0, opacity: 1, duration: 1 }, '-=0.6')
        .to('.hero-buttons > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.4');
    });

    return () => {
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
    <div ref={sectionRef} className="relative" style={{ height: `${TOTAL_FRAMES * 2}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10" />
        <div ref={overlayRef} className="absolute inset-0 bg-black/30 z-10" />

        <img
          ref={imgRef}
          src="/frames/HeroFrames/ezgif-frame-001.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover will-change-transform select-none"
          draggable={false}
        />

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent z-20" />

        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4"
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
            Unleash the Need for Speed — Every Collection Tells a Story
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => navigate('/collection')}
              className="opacity-0 group relative px-10 py-3.5 md:px-14 md:py-4 bg-red-600 hover:bg-red-500 rounded-none text-sm md:text-base font-semibold cursor-pointer uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">
                Explore Collection
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <button className="opacity-0 group relative px-10 py-3.5 md:px-14 md:py-4 border border-zinc-600 hover:border-zinc-400 text-zinc-400 hover:text-white rounded-none text-sm md:text-base font-semibold cursor-pointer uppercase tracking-[0.2em] transition-all duration-300 bg-black/30">
              <span className="relative z-10">
                Watch Trailer
              </span>
            </button>
          </div>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-500"
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
