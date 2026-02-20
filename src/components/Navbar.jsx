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
  Search,
  Zap,
  ArrowRight,
  Home,
  Grid
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../context/CartContext";
import API_URL from "../config";

// GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = memo(() => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { cartItems } = cart;

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: navRef });

  const onLinkEnter = useCallback(contextSafe((e) => {
    gsap.to(e.currentTarget, {
      x: 5,
      y: -2,
      duration: 0.3,
      ease: "power2.out",
      color: "#6366f1" // primary color
    });
  }), [contextSafe]);

  const onLinkLeave = useCallback(contextSafe((e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.inOut",
      color: "" // revert to css
    });
  }), [contextSafe]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setExpandedCategory(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setShowSearch(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((name) => setActiveDropdown(prev => prev === name ? null : name), []);

  const isActive = useCallback((path) => {
    const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
    return active ? "text-primary font-bold scale-105" : "text-slate-600 hover:text-primary";
  }, [location.pathname]);

  const handleSearchSubmit = useCallback((e) => {
    if ((e.key === 'Enter' || e.type === 'click') && navSearch.trim()) {
      navigate(`/shop?keyword=${navSearch}`);
      setShowSearch(false);
      setNavSearch("");
    }
  }, [navSearch, navigate]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 top-0 start-0 ${scrolled ? "h-16 bg-white shadow-md" : "h-20 bg-white shadow-none"
        } flex items-center shadow-sm`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-[60] group flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">
            P
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tighter text-black leading-none group-hover:text-primary transition-colors">
            PixelMart<span className="text-secondary">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="relative group/nav">
            <button
              onMouseEnter={(e) => {
                setActiveDropdown('shop');
                onLinkEnter(e);
              }}
              onMouseLeave={onLinkLeave}
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-premium ${isActive("/shop")}`}
            >
              Shop <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'shop' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white border border-slate-100 rounded-3xl p-4 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {categories.filter(c => !c.parent).map(parent => (
                      <Link
                        key={parent._id}
                        to={`/shop?category=${parent._id}`}
                        className="px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-all font-bold text-sm"
                      >
                        {parent.name}
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <Link
                        to="/shop"
                        className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-center font-bold text-[10px] uppercase tracking-widest block hover:bg-primary transition-colors"
                      >
                        All Items
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/offers"
            onMouseEnter={onLinkEnter}
            onMouseLeave={onLinkLeave}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-premium flex items-center gap-1.5 ${isActive("/offers")}`}
          >
            <Sparkles size={14} className="text-amber-400" /> Offers
          </Link>
          <Link
            to="/contact"
            onMouseEnter={onLinkEnter}
            onMouseLeave={onLinkLeave}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-premium ${isActive("/contact")}`}
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-3 relative z-[60]">
          {/* Search Icon - Mobile & Desktop */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            {showSearch ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Cart Icon - Mobile & Desktop */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors group">
            <ShoppingCart size={20} className="group-hover:text-black" />
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Profile Dropdown (Desktop Only) */}
          {user ? (
            <div className="hidden lg:block relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={12} className={`transition-transform duration-300 text-slate-600 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-60 bg-white rounded-3xl p-3 shadow-2xl border border-slate-100"
                  >
                    <div className="px-4 py-3 mb-2 bg-slate-50 rounded-2xl">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] font-medium text-slate-700 truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors">
                          <LayoutDashboard size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors">
                        <User size={14} /> My Profile
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-xs transition-colors text-left">
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:text-black transition-colors">
              Sign In
            </Link>
          )}

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full text-black hover:bg-slate-100 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isOpen ? <X size={24} key="close" /> : <Menu size={24} key="open" />}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer - Full Height (100vh) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-[90]"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white z-[100] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <span className="text-xl font-bold tracking-tighter">Menu</span>
                <button onClick={() => setIsOpen(false)} title="Close Menu" className="p-2 rounded-full bg-slate-100 text-black">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body - Scrollable Links */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                <div className="space-y-8">
                  {/* Primary Nav */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</p>
                    <div className="flex flex-col gap-4">
                      <Link to="/" onClick={() => setIsOpen(false)} className="text-xl font-bold text-black border-b border-transparent hover:border-black pb-1 transition-all flex items-center gap-3">
                        <Home size={20} /> Home
                      </Link>
                      <Link to="/offers" onClick={() => setIsOpen(false)} className="text-xl font-bold text-black border-b border-transparent hover:border-black pb-1 transition-all flex items-center gap-3">
                        <Sparkles size={20} className="text-amber-500" /> Offers
                      </Link>
                      <Link to="/contact" onClick={() => setIsOpen(false)} className="text-xl font-bold text-black border-b border-transparent hover:border-black pb-1 transition-all flex items-center gap-3">
                        <Zap size={20} className="text-primary" /> Support
                      </Link>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shop By Category</p>
                    <div className="flex flex-col gap-4">
                      {categories.filter(c => !c.parent).map(cat => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${cat._id}`}
                          onClick={() => setIsOpen(false)}
                          className="text-lg font-bold text-slate-700 hover:text-black transition-colors flex items-center justify-between"
                        >
                          {cat.name} <ChevronRight size={16} className="text-slate-300" />
                        </Link>
                      ))}
                      <Link
                        to="/shop"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                      >
                        <Grid size={18} /> View All Products
                      </Link>
                    </div>
                  </div>

                  {/* Auth / Account */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</p>
                    {user ? (
                      <div className="space-y-3">
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold text-black">
                          <User size={20} /> My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold text-black">
                            <LayoutDashboard size={20} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-3 text-lg font-bold text-red-500 w-full text-left">
                          <LogOut size={20} /> Log Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 rounded-xl border-2 border-black font-bold text-sm">
                          Sign In
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 rounded-xl bg-black text-white font-bold text-sm shadow-xl shadow-black/10">
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PixelMart &copy; 2026</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full Width White Search Bar Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-[80] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 sm:py-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Looking for something specific?"
                  className="w-full bg-transparent border-none outline-none text-lg sm:text-2xl font-bold tracking-tight text-black placeholder:text-slate-300"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 text-slate-400 hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export default Navbar;
