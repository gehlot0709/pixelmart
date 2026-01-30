import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
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

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-primary">
        Loading...
      </div>
    );
  }

  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

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
    </ScrollToTop>
  );
}

export default App;
