import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import RouteLoadingBar from "./components/RouteLoadingBar";
import useSmoothScroll from "./hooks/useSmoothScroll";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard"
import AddProductPage from "./pages/Admin/Dashboard/AddProducts";
import ViewProductsPage from "./pages/Admin/Dashboard/ViewProducts";
import ProductViewPage from "./pages/Admin/Dashboard/ProductView";
import EditProductPage from "./pages/Admin/Dashboard/EditProduct";
import AdminOrders from "./pages/Admin/Dashboard/Orders";
import AdminOrderDetail from "./pages/Admin/Dashboard/OrderDetail";
import AdminChat from "./pages/Admin/Dashboard/Chat";
import AdminBulkEmail from "./pages/Admin/Dashboard/BulkEmail";
import UserChat from "./pages/Users/Chat";
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
const About = lazy(() => import("./pages/About"));
const Game = lazy(() => import("./pages/Game"));

function RootLayout() {
  return (
    <>
      <RouteLoadingBar />
      <Outlet />
    </>
  );
}

const App = () => {
  useSmoothScroll();

  const appRouter = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
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
          path: "/about",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <About />
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
          path: "/chat",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <UserChat />
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
          path: "/admin/view-products",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <ViewProductsPage />
            </Suspense>
          ),
        },
        {
          path: "/admin/products/:id",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <ProductViewPage />
            </Suspense>
          ),
        },
        {
          path: "/admin/products/:id/edit",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <EditProductPage />
            </Suspense>
          ),
        },
        {
          path: "/admin/orders",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <AdminOrders />
            </Suspense>
          ),
        },
        {
          path: "/admin/orders/:id",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <AdminOrderDetail />
            </Suspense>
          ),
        },
        {
          path: "/admin/chat",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <AdminChat />
            </Suspense>
          ),
        },
        {
          path: "/admin/bulk-email",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <AdminBulkEmail />
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
          path: "/game",
          element: (
            <Suspense fallback={<div className="h-screen bg-neutral-950" />}>
              <Game />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
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
