import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import useSmoothScroll from "./hooks/useSmoothScroll";

const ModelPage = lazy(() => import("./pages/ModelPage"));
const Contact = lazy(() => import("./pages/Contact"));

const App = () => {
  useSmoothScroll();

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/model",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <ModelPage />
        </Suspense>
      ),
    },
    {
      path: "/contact",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <Contact />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <div>
      <CustomCursor />
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
