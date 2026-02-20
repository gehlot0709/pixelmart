import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatSupport from './components/ChatSupport';
import Preloader from './components/Preloader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrderList = lazy(() => import('./pages/admin/AdminOrderList'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const AdminProductEdit = lazy(() => import('./pages/admin/AdminProductEdit'));
const AdminUserList = lazy(() => import('./pages/admin/AdminUserList'));
const AdminCategoryList = lazy(() => import('./pages/admin/AdminCategoryList'));

function App() {
  const { loading } = useAuth();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 1000); // Reduced to 1 second for faster mobile feel
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
            <Suspense fallback={null}>
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
                    <Route path="users" element={<AdminUserList />} />
                    <Route path="categories" element={<AdminCategoryList />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      {minLoadingDone && <ChatSupport />}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </ScrollToTop>
  );
}

export default App;
