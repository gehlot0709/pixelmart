import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import API_URL from '../config';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { cartItems } = cart;
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // 🔑 Mobile interaction states
  const [profileOpen, setProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/categories`);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // 🔁 Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
    setShopOpen(false);
    setActiveParent(null);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/shop' && location.pathname.startsWith('/shop')) {
      return 'text-primary font-bold';
    }
    return location.pathname === path
      ? 'text-primary font-bold'
      : 'text-slate-600 hover:text-primary';
  };

  return (
    <nav className="fixed w-full z-50 glass top-0 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          PixelMart
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4 md:order-2">
          {/* Auth */}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border
                ${profileOpen ? 'block' : 'hidden'} md:group-hover:block`}
              >
                <div className="p-3 border-b">
                  <p className="font-bold truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <ul className="py-2 text-sm">
                  <li>
                    <Link to="/profile" className="flex gap-2 px-4 py-2 hover:bg-gray-50">
                      <User size={16} /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="flex gap-2 px-4 py-2 hover:bg-gray-50">
                      <Sparkles size={16} /> My Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="w-full flex gap-2 px-4 py-2 text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="font-bold text-primary">Login</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-xl">
                Register
              </Link>
            </>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:gap-8`}>
          <Link to="/" className={isActive('/')}>Home</Link>

          {/* Shop */}
          <div className="relative group">
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className={`flex items-center gap-1 ${isActive('/shop')}`}
            >
              Shop
              <ChevronDown
                size={16}
                className={`transition ${shopOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Shop Dropdown */}
            <div
              className={`absolute bg-white shadow-xl rounded-lg w-64 mt-2 border
              ${shopOpen ? 'block' : 'hidden'} md:group-hover:block`}
            >
              <Link
                to="/shop"
                className="block px-4 py-2 font-bold text-primary hover:bg-gray-50"
              >
                Shop All
              </Link>

              {categories.filter(c => !c.parent).map(parent => (
                <div key={parent._id} className="relative">
                  <button
                    onClick={() =>
                      setActiveParent(activeParent === parent._id ? null : parent._id)
                    }
                    className="w-full flex justify-between px-4 py-2 hover:bg-gray-50"
                  >
                    {parent.name}
                    <ChevronDown size={14} />
                  </button>

                  {/* Subcategories */}
                  <div
                    className={`bg-white border rounded-lg shadow-xl ml-4
                    ${activeParent === parent._id ? 'block' : 'hidden'} md:absolute md:left-full md:top-0 md:group-hover:block`}
                  >
                    {categories.filter(c => c.parent === parent._id).length ? (
                      categories
                        .filter(c => c.parent === parent._id)
                        .map(sub => (
                          <Link
                            key={sub._id}
                            to={`/shop?category=${sub._id}`}
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            {sub.name}
                          </Link>
                        ))
                    ) : (
                      <p className="px-4 py-2 text-xs text-gray-400">
                        No subcategories
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/offers" className={isActive('/offers')}>
            Offers
          </Link>
          <Link to="/contact" className={isActive('/contact')}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
