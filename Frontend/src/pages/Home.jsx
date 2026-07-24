import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Featured from '../components/Featured';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (!loader) {
      setReady(true);
      return;
    }

    const timer = setTimeout(() => {
      loader.style.transition = 'opacity 0.6s ease';
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        setReady(true);
      }, 600);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!contentRef.current) return;
      gsap.from(contentRef.current.children, {
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <Hero ready={ready} />
      <Featured />

      <section ref={sectionRef} className="relative bg-neutral-950 py-32 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

        <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
            In the Flesh
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85] mb-6">
            Get Up
            <br />
            <span className="text-red-500">Close</span>
          </h2>
          <p className="font-body text-xs md:text-sm text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
            Spin, zoom, and inspect every detail of the K.I.T.T. model in full 3D.
          </p>
          <Link
            to="/model"
            className="inline-block font-body text-[11px] uppercase tracking-[0.35em] text-white bg-red-500/90 hover:bg-red-500 px-8 py-4 transition-all duration-500"
          >
            Launch 3D Viewer
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
