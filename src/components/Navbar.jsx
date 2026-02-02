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
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../context/CartContext";
import API_URL from "../config";

const Navbar = () => {
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

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  const isActive = (path) => {
    const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
    return active ? "text-primary font-black scale-105" : "text-slate-600 dark:text-slate-300 hover:text-primary";
  };

  const handleSearchSubmit = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && navSearch.trim()) {
      navigate(`/shop?keyword=${navSearch}`);
      setShowSearch(false);
      setNavSearch("");
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-premium duration-500 top-0 start-0 ${scrolled ? "py-2 glass shadow-lg" : "py-3 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-10">
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-gradient leading-none">
            PixelMart<span className="text-secondary text-4xl leading-[0]">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <Link to="/" className={`text-sm font-bold uppercase tracking-[0.15em] transition-premium ${isActive("/")}`}>Home</Link>

          <div className="relative group/nav">
            <button
              onClick={() => toggleDropdown('shop')}
              className={`flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.15em] transition-premium ${isActive("/shop")}`}
            >
              Shop <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
            </button>

            {/* Shop Mega Menu Redesign */}
            {activeDropdown === 'shop' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-[2.5rem] p-8 grid grid-cols-2 gap-8 shadow-2xl border border-slate-100"
              >
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 mb-2">Categories</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {categories.filter(c => !c.parent).map(parent => (
                      <li key={parent._id}>
                        <Link
                          to={`/shop?category=${parent._id}`}
                          className="text-sm font-black text-slate-800 dark:text-white hover:text-primary transition-premium flex items-center gap-2 group/item"
                        >
                          {parent.name}
                          <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-premium" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary pt-4 border-t border-slate-100"
                  >
                    View All Collections <Zap size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary/60 mb-4">Hot Offers</h4>
                    <p className="text-sm text-slate-500 font-medium">Limited time deals up to 70% off. Grab them before they are gone!</p>
                  </div>
                  <Link to="/offers" className="w-full">
                    <button className="w-full py-3 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-premium">
                      Explore Offers
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <Link to="/offers" className={`text-sm font-bold uppercase tracking-[0.15em] transition-premium flex items-center gap-1.5 ${isActive("/offers")}`}>
            <Sparkles size={16} className="text-amber-400" /> Offers
          </Link>
          <Link to="/contact" className={`text-sm font-bold uppercase tracking-[0.15em] transition-premium ${isActive("/contact")}`}>Support</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-6 relative z-10">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-premium group"
          >
            <Search size={22} className="text-slate-700 dark:text-slate-200 group-hover:text-primary" />
          </button>

          <Link to="/cart" className="relative p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-premium group">
            <ShoppingCart size={22} className="text-slate-700 dark:text-slate-200 group-hover:text-primary" />
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-white ring-2 ring-white animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-premium"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-xs font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-4 w-64 bg-white rounded-[2.5rem] p-4 shadow-2xl border border-slate-100"
                >
                  <div className="p-4 mb-2 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.email}</p>
                  </div>
                  <ul className="space-y-1">
                    {user.role === 'admin' && (
                      <li>
                        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 hover:text-primary font-bold text-sm transition-premium">
                          <LayoutDashboard size={18} /> Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-slate-700 hover:text-primary font-bold text-sm transition-premium">
                        <User size={18} /> My Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-black text-sm transition-premium">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-premium">Login</Link>
              <Link to="/register">
                <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-premium">
                  Register
                </button>
              </Link>
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-premium">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              <Link to="/" className="text-2xl font-black tracking-tighter hover:text-primary transition-premium">Home</Link>
              <Link to="/shop" className="text-2xl font-black tracking-tighter hover:text-primary transition-premium">Shop</Link>
              <Link to="/offers" className="text-2xl font-black tracking-tighter flex items-center gap-2 hover:text-primary transition-premium">Offers <Sparkles size={20} className="text-amber-400" /></Link>
              <Link to="/contact" className="text-2xl font-black tracking-tighter hover:text-primary transition-premium">Support</Link>

              {!user && (
                <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Link to="/login"><button className="w-full py-4 glass rounded-2xl font-black uppercase tracking-widest">Login</button></Link>
                  <Link to="/register"><button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Register</button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ultra-Minimalist Full-Width Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="absolute top-full left-0 w-full bg-white border-t border-b border-slate-100 shadow-2xl z-[40] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 relative flex items-center gap-4">
              <Search size={18} className="text-slate-400" />
              <input
                autoFocus
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search PixelMart..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold tracking-tight py-3 text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-premium"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
