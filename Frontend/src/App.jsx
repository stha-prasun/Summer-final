import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import CustomCursor from "./components/CustomCursor";

const ModelPage = lazy(() => import("./pages/ModelPage"));

const App = () => {
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
  ]);
  return (
    <div>
      <CustomCursor />
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
