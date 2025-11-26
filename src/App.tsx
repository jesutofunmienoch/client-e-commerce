// src/App.tsx
import { Toaster as ToastProvider } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { OrdersProvider } from "./contexts/OrdersContext";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";  // ← NEW SECRET LOGIN PAGE

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <OrdersProvider>
          <ToastProvider />
          <Toaster position="top-center" richColors />

          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* SECRET ADMIN ACCESS — ONLY YOU KNOW THIS URL */}
              <Route path="/a1b2c3d4e5f6g7h8i9j0-admin-emperor" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </OrdersProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;