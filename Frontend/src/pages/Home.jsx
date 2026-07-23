import useSmoothScroll from '../hooks/useSmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const Home = () => {
  useSmoothScroll();

  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
};

export default Home;
