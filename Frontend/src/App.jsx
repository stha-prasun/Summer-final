import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
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
