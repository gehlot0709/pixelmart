import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import Preloader from './components/Preloader';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatSupport from './components/ChatSupport';

function App() {
  const { loading } = useAuth();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 2000); // 2 seconds for premium feel
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollToTop>
      <AnimatePresence mode="wait">
        {loading || !minLoadingDone ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Preloader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />

                <Route path="shop" element={<Shop />} />
                <Route path="offers" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />

                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />

                <Route path="profile" element={<Profile />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrderList />} />
                  <Route path="products" element={<AdminProductList />} />
                  <Route path="products/add" element={<AdminProductEdit />} />
                  <Route path="products/:id/edit" element={<AdminProductEdit />} />
                </Route>
              </Route>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatSupport />
    </ScrollToTop>
  );
}

export default App;
