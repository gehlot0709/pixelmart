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
  ArrowRight
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

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-500 top-0 start-0 ${scrolled ? "py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100" : "py-5 bg-white shadow-none"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-50 group flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-glow-primary group-hover:rotate-12 transition-transform duration-300">
            P
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tighter text-slate-900 leading-none group-hover:text-primary transition-colors">
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

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 relative z-50">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2.5 rounded-full transition-all ${showSearch ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            {showSearch ? <X size={18} /> : <Search size={18} />}
          </button>

          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-all group">
            <ShoppingCart size={18} className="group-hover:text-primary" />
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
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
            <Link to="/login" className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-full bg-slate-900 text-white hover:bg-primary transition-colors shadow-lg shadow-black/10"
          >
            <AnimatePresence mode="wait">
              {isOpen ? <X size={20} key="close" /> : <Menu size={20} key="open" />}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Premium Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 w-full bg-white z-[40] overflow-hidden flex flex-col"
          >
            <div className="p-8 pt-28 flex flex-col gap-6 flex-1 overflow-y-auto">

              {/* Shop Accordion */}
              <div>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === 'shop' ? null : 'shop')}
                  className="w-full text-left text-5xl font-bold tracking-tight text-slate-900 flex items-center justify-between py-2"
                >
                  Shop <ChevronDown size={32} className={`transition-transform duration-300 ${expandedCategory === 'shop' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedCategory === 'shop' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col gap-4 pl-4 pt-4 border-l-2 border-slate-100"
                    >
                      {categories.filter(c => !c.parent).map(cat => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${cat._id}`}
                          onClick={() => setIsOpen(false)}
                          className="text-2xl font-bold text-slate-600 hover:text-slate-900"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <Link
                        to="/shop"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-bold text-primary"
                      >
                        All Products
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Offers */}
              <Link
                to="/offers"
                onClick={() => setIsOpen(false)}
                className="text-5xl font-bold tracking-tight text-slate-900 flex items-center gap-4 hover:text-primary transition-colors py-2"
              >
                Offers <Sparkles size={32} className="text-amber-400" />
              </Link>

              {/* Support */}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="text-5xl font-bold tracking-tight text-slate-900 hover:text-primary transition-colors py-2"
              >
                Contact
              </Link>

              {/* Auth for Mobile */}
              {!user && (
                <div className="flex flex-col gap-4 pt-8">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-5 border-2 border-slate-900 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-primary transition-colors">
                      Join PixelMart
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">P</Link>
                <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">Modern E-Commerce</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">PixelMart &copy; MMXXVI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Width White Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="flex items-center gap-6">
                <Search size={24} className="text-slate-600 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Tell us what you're looking for..."
                  className="w-full bg-transparent border-none outline-none text-2xl font-bold tracking-tighter text-slate-900 placeholder:text-slate-400"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-3 text-slate-600 hover:text-primary transition-premium"
                >
                  <X size={24} />
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
