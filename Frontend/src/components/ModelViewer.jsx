import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ThrottledRender = () => {
  const { invalidate } = useThree();
  useEffect(() => {
    const id = setInterval(() => invalidate(), 50);
    return () => clearInterval(id);
  }, [invalidate]);
  return null;
};

const modelPath = '/models/hot_wheels_-_unleashed_k.i.t.t..glb';

const Model = () => {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.envMapIntensity = 2;
        }
      });
    }
  }, []);

  return <primitive ref={meshRef} object={scene} scale={0.08} position={[0, 8, 0]} />;
};

const ModelViewer = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const controlsRef = useRef(null);

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
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = entry.isIntersecting;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
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

      <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

      <div ref={headerRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mb-16 md:mb-20">
        <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
          In the Flesh
        </p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
          Get Up
          <br />
          <span className="text-red-500">Close</span>
        </h2>
        <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/50" data-lenis-prevent>
          <Canvas
            camera={{ position: [15, 20, 25], fov: 45 }}
            gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1, pixelRatio: Math.min(1.5, window.devicePixelRatio) }}
            style={{ background: '#0a0a0b' }}
          >
            <Suspense fallback={
              <Html center>
                <div className="flex items-center gap-3 text-zinc-500">
                  <span className="w-4 h-4 border border-zinc-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-body text-xs uppercase tracking-[0.2em]">Loading…</span>
                </div>
              </Html>
            }>
              <ThrottledRender />
              <ambientLight intensity={0.8} />
              <directionalLight position={[8, 6, 6]} intensity={2.5} />
              <directionalLight position={[-4, 3, -3]} intensity={1} />
              <Model />
              <Environment preset="city" />
              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                target={[0, 8, 0]}
                minDistance={5}
                maxDistance={50}
                autoRotate={true}
                autoRotateSpeed={2}
                rotateSpeed={0.8}
                minPolarAngle={0}
                maxPolarAngle={1.5}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="flex items-center justify-between mt-6 text-zinc-600">
          <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em]">
            Drag to explore · Scroll to zoom
          </span>
          <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-zinc-700">
            K.I.T.T. Hot Wheels Unleashed
          </span>
        </div>
      </div>
    </section>
  );
};

export default ModelViewer;
