import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import API_URL from "../config";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { cartItems } = cart;
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'shop', 'profile', or null
  const [expandedCategory, setExpandedCategory] = useState(null);

  const location = useLocation();
  const navRef = useRef(null);

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

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setExpandedCategory(null);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        // Don't close main mobile menu on outside click potentially, but definitely dropdowns
        if (window.innerWidth >= 768) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const isActive = (path) => {
    if (path === "/shop" && location.pathname.startsWith("/shop")) {
      return "text-primary font-bold";
    }
    return location.pathname === path
      ? "text-primary font-bold"
      : "text-slate-600 hover:text-primary";
  };

  return (
    <nav ref={navRef} className="fixed w-full z-50 glass top-0 start-0 border-b border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PixelMart
          </span>
        </Link>

        {/* Right Side Icons (Cart, Mobile Menu Toggle) */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-primary hidden md:block"
                >
                  Admin Panel
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('profile')}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium text-slate-700 hover:text-primary">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Content */}
                {activeDropdown === 'profile' && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-down">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul className="py-2 text-sm text-slate-700 dark:text-gray-200">
                      {user.role === 'admin' && (
                        <li>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <LayoutDashboard size={16} /> Admin Panel
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <User size={16} /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <Sparkles size={16} className="text-yellow-500" /> My
                          Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            logout();
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login">
                <button className="px-5 py-2 rounded-xl text-primary font-bold hover:bg-primary/10 border border-primary/20 transition-all">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
                  Register
                </button>
              </Link>
            </div>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-gray-200 hover:text-primary transition-colors" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Main Menu Links */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-300 ease-in-out`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive("/")}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>

            {/* Shop Dropdown */}
            <li>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('shop')}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive("/shop")}`}
                >
                  Shop <ChevronDown size={16} className={`ml-1 transition-transform ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
                </button>

                {/* Shop Mega Menu */}
                <div className={`${activeDropdown === 'shop' ? 'block' : 'hidden'} md:absolute z-10 font-normal bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-lg shadow-xl w-full md:w-64 top-full left-0 border border-gray-100 dark:border-gray-700 mt-2 md:mt-4`}>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 p-2">
                    <li>
                      <Link
                        to="/shop"
                        className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 font-bold text-primary rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Shop All
                      </Link>
                    </li>
                    {categories
                      .filter((c) => !c.parent)
                      .map((parent) => (
                        <li key={parent._id} className="relative group/sub">
                          <div className="flex justify-between items-center w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                            <Link
                              to={`/shop?category=${parent._id}`}
                              className="w-full"
                              onClick={() => setIsOpen(false)}
                            >
                              {parent.name}
                            </Link>

                            {/* Mobile Submenu Toggle */}
                            {categories.some(c => c.parent === parent._id) && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setExpandedCategory(expandedCategory === parent._id ? null : parent._id);
                                }}
                                className="md:hidden p-1"
                              >
                                <ChevronDown size={14} className={`transform ${expandedCategory === parent._id ? 'rotate-180' : ''}`} />
                              </button>
                            )}

                            {/* Desktop Submenu Indicator */}
                            {categories.some(c => c.parent === parent._id) && (
                              <ChevronRight size={14} className="hidden md:block text-gray-400" />
                            )}
                          </div>

                          {/* Desktop Submenu (Hover) -- Optional: could make this click too, but hover is standard for nested. Keeping simple for now. 
                              Actually, let's make it show if Expanded on mobile OR hover on desktop? 
                              For simplicity, we just list them flat on mobile if expanded.
                          */}

                          {/* Submenu Content */}
                          <div className={`
                            ${expandedCategory === parent._id ? 'block' : 'hidden'} 
                            md:hidden pl-4
                          `}>
                            {/* Mobile Nested List */}
                            <ul className="border-l-2 border-gray-100 dark:border-gray-700 ml-2">
                              {categories
                                .filter((c) => c.parent === parent._id)
                                .map((sub) => (
                                  <li key={sub._id}>
                                    <Link
                                      to={`/shop?category=${sub._id}`}
                                      className="block px-4 py-2 text-slate-600 hover:text-primary"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          {/* Desktop Submenu (Absolute) */}
                          <div className="hidden md:group-hover/sub:block absolute left-full top-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl w-48 ml-1">
                            <ul className="py-2">
                              {categories.filter((c) => c.parent === parent._id)
                                .length > 0 ? (
                                categories
                                  .filter((c) => c.parent === parent._id)
                                  .map((sub) => (
                                    <li key={sub._id}>
                                      <Link
                                        to={`/shop?category=${sub._id}`}
                                        className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-600 hover:text-primary"
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))
                              ) : (
                                <li className="px-4 py-2 text-xs text-gray-400">
                                  No subcategories
                                </li>
                              )}
                            </ul>
                          </div>

                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <Link
                to="/offers"
                className={`flex items-center py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive("/offers")}`}
                onClick={() => setIsOpen(false)}
              >
                <Sparkles size={16} className="mr-1 text-yellow-500" /> Offers
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive("/contact")}`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            {/* Mobile Only: Login/Register if not logged in */}
            {!user && (
              <li className="grid grid-cols-2 gap-2 mt-4 md:hidden">
                <Link to="/login" className="w-full">
                  <button className="w-full px-5 py-2 rounded-xl text-primary font-bold hover:bg-primary/10 border border-primary/20 transition-all">
                    Login
                  </button>
                </Link>
                <Link to="/register" className="w-full">
                  <button className="w-full bg-primary text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-primary/30">
                    Register
                  </button>
                </Link>
              </li>
            )}

            {/* Mobile Only: Admin Panel Link */}
            {user && user.role === 'admin' && (
              <li className="md:hidden mt-2">
                <Link
                  to="/admin/dashboard"
                  className="block py-2 px-3 text-slate-600 hover:text-primary rounded md:p-0 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={16} /> Admin Panel
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
