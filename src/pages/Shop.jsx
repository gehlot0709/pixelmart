import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Search, Filter, X, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filters from URL
  const keyword = queryParams.get("keyword") || "";
  const category = queryParams.get("category") || "";
  const sort = queryParams.get("sort") || "newest";

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Check if we are on the Offers page
  const isOffersPage = location.pathname === "/offers";

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === null || newParams[key] === "") {
        params.delete(key);
      } else {
        params.set(key, newParams[key]);
      }
    });
    navigate(`${location.pathname}?${params.toString()}`);
  };

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/products?keyword=${keyword}&sort=${sort}`;
        if (category) url += `&category=${category}`;
        if (isOffersPage) url += `&isOffer=true`;

        const { data } = await axios.get(url);
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [keyword, category, sort, isOffersPage]);

  const getCategoryName = (id) => {
    if (!id) return "All Collections";
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : "All Collections";
  };

  const selectedCategory = categories.find(c => c._id === category);
  const activeMainCat = selectedCategory ? (selectedCategory.parent ? categories.find(c => c._id === selectedCategory.parent) : selectedCategory) : null;
  const subCategories = activeMainCat ? categories.filter(c => c.parent === activeMainCat._id) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* 2. Unified Controls Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-10 relative z-40">
        {/* Category Dropdown Context */}
        <div className="relative w-full md:w-[320px]">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full flex items-center justify-between px-8 py-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 shadow-xl hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <Filter size={20} />
              </div>
              <span className="font-extrabold text-slate-700 dark:text-slate-200 tracking-tight">
                {getCategoryName(category)}
              </span>
            </div>
            <ChevronRight className={`transition-all duration-300 ${showCategoryDropdown ? 'rotate-90 text-primary' : 'text-slate-300'}`} size={20} />
          </button>

          {showCategoryDropdown && (
            <>
              <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setShowCategoryDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-0 mt-4 w-full max-h-[450px] overflow-y-auto bg-white/98 dark:bg-slate-800/98 backdrop-blur-2xl border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-4 space-y-2 no-scrollbar z-50"
              >
                <div className="px-6 py-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">All Infinity Products</span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4 mb-2" />

                {categories
                  .filter(c => !c.parent && (!activeMainCat || c._id === activeMainCat._id))
                  .map(parent => (
                    <div key={parent._id} className="space-y-1">
                      <button
                        onClick={() => { updateFilters({ category: parent._id, keyword: "" }); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest ${category === parent._id || (selectedCategory && selectedCategory.parent === parent._id) ? 'bg-primary/5 text-primary' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                      >
                        {parent.name}
                      </button>

                      <div className="ml-4 pl-4 border-l-2 border-slate-50 dark:border-slate-700 flex flex-col gap-1">
                        {categories.filter(c => c.parent === parent._id).map(sub => (
                          <button
                            key={sub._id}
                            onClick={() => { updateFilters({ category: sub._id, keyword: "" }); setShowCategoryDropdown(false); }}
                            className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${category === sub._id ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-primary hover:translate-x-1'}`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {activeMainCat && (
                  <button
                    onClick={() => { updateFilters({ category: "" }); setShowCategoryDropdown(false); }}
                    className="w-full text-center mt-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                  >
                    View All Collections
                  </button>
                )}
              </motion.div>
            </>
          )}
        </div>

        {/* Sort Dropdown Selector */}
        <div className="relative w-full md:w-[280px]">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            <SlidersHorizontal size={20} />
          </div>
          <select
            className="w-full pl-16 pr-12 py-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 shadow-xl focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer font-extrabold text-slate-700 dark:text-slate-200 transition-all tracking-tight"
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated Only</option>
          </select>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronRight className="rotate-90 text-slate-300" size={20} />
          </div>
        </div>

        {category && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => updateFilters({ category: "" })}
            className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
          >
            Clear: {getCategoryName(category)} <X size={14} />
          </motion.button>
        )}
      </div>

      {/* 2.5 Visual Subcategory Grid (per screenshot) */}
      {activeMainCat && subCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 overflow-x-auto premium-scrollbar scroll-smooth"
        >
          <div className="flex gap-4 md:gap-10 pb-4 min-w-max px-2">
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => { updateFilters({ category: sub._id, keyword: "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-4 group transition-all"
              >
                <div className={`w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 transition-all duration-500 ${category === sub._id ? 'border-primary shadow-2xl shadow-primary/30 scale-105' : 'border-white dark:border-slate-800 shadow-xl group-hover:border-primary/50'}`}>
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className={`text-xs md:text-sm font-black tracking-tight transition-all duration-300 ${category === sub._id ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'} text-center max-w-[120px]`}>
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Dynamic Product Grid */}
      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 animate-pulse">
            <div className="w-20 h-20 border-8 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <p className="text-2xl font-black text-slate-300 tracking-tighter uppercase italic">Redefining Infinity...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-40 bg-white/40 dark:bg-slate-800/40 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-700"
              >
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                  <Search size={48} />
                </div>
                <h3 className="text-4xl font-black text-slate-400 mb-4 tracking-tighter">ZERO MATCHES</h3>
                <p className="text-slate-500 text-lg mb-10">We couldn't find anything matching your current filters.</p>
                <button onClick={() => updateFilters({ category: "", keyword: "" })} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-110 active:scale-95 transition-all">Reset All Filters</button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-premium">
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Shop;
