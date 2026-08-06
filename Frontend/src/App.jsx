import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import useSmoothScroll from "./hooks/useSmoothScroll";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard"
import AddProductPage from "./pages/Admin/Dashboard/AddProducts";
import { UserLogin } from "./pages/Users/UserLogin";
import { UserRegister } from "./pages/Users/UserRegister";
import { Onboarding } from "./pages/Users/Onboarding";
import { Cart } from "./pages/Users/Cart";
import { Payment } from "./pages/Users/Payment";
import { PaymentVerify } from "./pages/Users/PaymentVerify";
import OrderDashboard from "./pages/Users/Order/Orders";
import OrderById from "./pages/Users/Order/OrderById";

const ModelPage = lazy(() => import("./pages/ModelPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Collection = lazy(() => import("./pages/Collection"));

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
      path: "/collection",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <Collection />
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
      path: "/orders",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <OrderDashboard />
        </Suspense>
      ),
    },
    {
      path: "/orders/:id",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <OrderById />
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
      path: "/admin/dashboard",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: "/admin/add-products",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <AddProductPage />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <UserLogin />
        </Suspense>
      ),
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <UserRegister/>
        </Suspense>
      ),
    },
    {
      path: "/onboarding",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <Onboarding />
        </Suspense>
      ),
    },
        {
      path: "/cart",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <Cart />
        </Suspense>
      ),
    },
    {
      path: "/payment",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <Payment />
        </Suspense>
      ),
    },
    {
      path: "/payment/verify",
      element: (
        <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
          <PaymentVerify />
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
