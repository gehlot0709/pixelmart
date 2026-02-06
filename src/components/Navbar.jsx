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
      className={`fixed w-full z-50 transition-premium duration-500 top-0 start-0 ${scrolled ? "py-2 glass-dark shadow-2xl" : "py-4 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-10 group">
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-gradient leading-none group-hover:opacity-80 transition-premium">
            PixelMart<span className="text-secondary text-4xl leading-[0]">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12">
          <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-premium ${isActive("/")}`}>Home</Link>

          <div className="relative group/nav">
            <button
              onMouseEnter={() => setActiveDropdown('shop')}
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] transition-premium ${isActive("/shop")}`}
            >
              Shop <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
            </button>

            {/* Simple Shop Dropdown - Mockup Match */}
            <AnimatePresence>
              {activeDropdown === 'shop' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-4 w-72 bg-slate-950 border border-white/10 rounded-[2rem] p-6 shadow-2xl z-50 overflow-hidden"
                >
                  <ul className="space-y-4">
                    {categories.filter(c => !c.parent).map(parent => (
                      <li key={parent._id}>
                        <Link
                          to={`/shop?category=${parent._id}`}
                          className="flex items-center justify-between text-white hover:text-primary transition-premium group"
                        >
                          <span className="text-lg font-black tracking-tight">{parent.name}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-6 mt-6 border-t border-white/5">
                      <Link
                        to="/shop"
                        className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] group"
                      >
                        All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </li>
                  </ul>
                  {/* Decorative element from mockup */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-white/5 rounded-full pointer-events-none opacity-20" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/offers" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-premium flex items-center gap-2 ${isActive("/offers")}`}>
            <Sparkles size={16} className="text-amber-400" /> Offers
          </Link>
          <Link to="/contact" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-premium ${isActive("/contact")}`}>Support</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-5 relative z-10">
          <div className="relative group">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-3 rounded-2xl transition-premium group ${showSearch ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-slate-300'}`}
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <Link to="/cart" className="relative p-3 rounded-2xl hover:bg-white/5 transition-premium group">
            <ShoppingCart size={20} className="text-slate-300 group-hover:text-primary" />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[9px] font-black text-white ring-4 ring-dark animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-premium border border-white/5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-black text-xs shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 opacity-40 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 glass-dark rounded-[2rem] p-4 shadow-premium border border-white/10"
                  >
                    <div className="p-4 mb-2 border-b border-white/5">
                      <p className="text-sm font-black text-white truncate">{user.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                    <ul className="space-y-1">
                      {user.role === 'admin' && (
                        <li>
                          <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-primary font-bold text-xs transition-premium">
                            <LayoutDashboard size={16} /> Admin Panel
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-primary font-bold text-xs transition-premium">
                          <User size={16} /> My Profile
                        </Link>
                      </li>
                      <li>
                        <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 font-black text-xs transition-premium">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-premium">Login</Link>
              <Link to="/register">
                <button className="px-7 py-3.5 bg-white text-dark rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-premium active:scale-95">
                  Register
                </button>
              </Link>
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-premium">
            <AnimatePresence mode="wait">
              {isOpen ? <X size={24} key="close" /> : <Menu size={24} key="open" />}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Redesign */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100vh', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden fixed inset-0 top-0 w-full bg-dark/95 backdrop-blur-2xl z-[45] overflow-hidden flex flex-col"
          >
            <div className="p-8 pb-4 pt-24 flex flex-col gap-8 flex-1 overflow-y-auto">
              <Link to="/" className="text-4xl font-black tracking-tighter hover:text-primary transition-premium border-b border-white/5 pb-4">Home</Link>

              <div className="space-y-4">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === 'shop' ? null : 'shop')}
                  className="w-full text-left text-4xl font-black tracking-tighter flex items-center justify-between border-b border-white/5 pb-4"
                >
                  Shop <ChevronDown className={`transition-transform ${expandedCategory === 'shop' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedCategory === 'shop' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-1 gap-4 pl-4 overflow-hidden"
                    >
                      {categories.filter(c => !c.parent).map(cat => (
                        <Link key={cat._id} to={`/shop?category=${cat._id}`} className="text-xl font-bold text-slate-400 hover:text-white">{cat.name}</Link>
                      ))}
                      <Link to="/shop" className="text-xl font-black text-primary uppercase tracking-widest">View All</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/offers" className="text-4xl font-black tracking-tighter flex items-center gap-3 hover:text-primary transition-premium border-b border-white/5 pb-4">
                Offers <Sparkles size={32} className="text-amber-400" />
              </Link>
              <Link to="/contact" className="text-4xl font-black tracking-tighter hover:text-primary transition-premium border-b border-white/5 pb-4">Support</Link>

              {!user && (
                <div className="flex flex-col gap-4 pt-8">
                  <Link to="/login"><button className="w-full py-5 glass rounded-2xl font-black uppercase tracking-[0.2em] text-sm">Login</button></Link>
                  <Link to="/register"><button className="w-full py-5 bg-white text-dark rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl">Register</button></Link>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/10 bg-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center">PixelMart Laboratory &copy; 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Width White Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="flex items-center gap-6">
                <Search size={24} className="text-slate-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Tell us what you're looking for..."
                  className="w-full bg-transparent border-none outline-none text-2xl font-black tracking-tighter text-slate-900 placeholder:text-slate-300"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-3 text-slate-400 hover:text-primary transition-premium"
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
};

export default Navbar;
