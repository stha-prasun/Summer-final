import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import useSmoothScroll from "./hooks/useSmoothScroll";
import AdminLogin from "./pages/auth/AdminLogin";

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
      path: "/admin/login",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <AdminLogin />
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
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
