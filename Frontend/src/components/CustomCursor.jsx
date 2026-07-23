import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const move = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: 'power2.out' });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
    };

    const hide = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.2 });
    };

    const show = () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-red-500 rounded-full pointer-events-none z-[9999]"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(239,68,68,0.6), 0 0 20px rgba(239,68,68,0.3)',
        }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-red-400/50 rounded-full pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;
