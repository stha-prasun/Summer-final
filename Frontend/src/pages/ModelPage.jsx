import { useEffect, lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';

const ModelViewer = lazy(() => import('../components/ModelViewer'));

const ModelPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="h-screen bg-neutral-950 flex items-center justify-center">
        <span className="font-body text-xs text-zinc-600 uppercase tracking-[0.3em]">Loading viewer…</span>
      </div>}>
        <ModelViewer />
      </Suspense>
    </>
  );
};

export default ModelPage;
