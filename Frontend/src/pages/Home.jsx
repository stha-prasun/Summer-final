import { useState, useEffect } from 'react';
import useSmoothScroll from '../hooks/useSmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Featured from '../components/Featured';

const Home = () => {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;

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

  return (
    <>
      <Navbar />
      <Hero ready={ready} />
      <Featured />
    </>
  );
};

export default Home;
