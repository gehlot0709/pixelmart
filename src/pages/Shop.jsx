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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 relative z-40">
        {/* Category Dropdown Context */}
        <div className="relative w-full md:w-80">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:text-primary transition-colors">
                <Filter size={18} />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">
                {getCategoryName(category)}
              </span>
            </div>
            <ChevronRight className={`transition-all duration-300 text-slate-600 ${showCategoryDropdown ? 'rotate-90' : ''}`} size={16} />
          </button>

          {showCategoryDropdown && (
            <>
              <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setShowCategoryDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-3 w-full max-h-[400px] overflow-y-auto bg-white border border-slate-100 rounded-3xl shadow-2xl p-3 space-y-1 no-scrollbar z-50"
              >
                <div className="px-4 py-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Collections</span>
                </div>

                {categories
                  .filter(c => !c.parent)
                  .map(parent => (
                    <div key={parent._id} className="space-y-1">
                      <button
                        onClick={() => { updateFilters({ category: parent._id, keyword: "" }); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${category === parent._id || (selectedCategory && selectedCategory.parent === parent._id) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {parent.name}
                      </button>

                      <div className="ml-2 pl-4 border-l border-slate-100 flex flex-col gap-1">
                        {categories.filter(c => c.parent === parent._id).map(sub => (
                          <button
                            key={sub._id}
                            onClick={() => { updateFilters({ category: sub._id, keyword: "" }); setShowCategoryDropdown(false); }}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${category === sub._id ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary'}`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            </>
          )}
        </div>

        {/* Sort Dropdown Selector */}
        <div className="relative w-full md:w-64">
          <select
            className="w-full pl-6 pr-12 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-bold text-slate-900 text-sm transition-all"
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="newest text-xs">Recently Added</option>
            <option value="price_asc text-xs">Price: Low to High</option>
            <option value="price_desc text-xs">Price: High to Low</option>
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <ChevronRight className="rotate-90" size={16} />
          </div>
        </div>
      </div>

      {/* 2.5 Visual Subcategory Grid */}
      {activeMainCat && subCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 overflow-x-auto premium-scrollbar"
        >
          <div className="flex gap-6 md:gap-12 pb-6 px-2">
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => { updateFilters({ category: sub._id, keyword: "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-4 group"
              >
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 transition-all duration-500 ${category === sub._id ? 'border-primary shadow-xl scale-105' : 'border-slate-100 group-hover:border-slate-300'}`}>
                  <img
                    src={sub.image ? (() => {
                      const img = sub.image;
                      if (img.startsWith('http') && !img.includes('localhost:5000')) return img;
                      let path = img.replace(/^http:\/\/localhost:5000/, '').replace(/^\/uploads\//, '/assets/').replace(/^\/server\/uploads\//, '/assets/');
                      return path.startsWith('/') ? path : `${API_URL}${path}`;
                    })() : '/assets/placeholder.png'}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${category === sub._id ? 'text-primary' : 'text-slate-600 group-hover:text-slate-900'}`}>
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
          <div className="flex flex-col items-center justify-center py-48">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6" />
            <p className="text-xs font-bold text-slate-600 tracking-[0.4em] uppercase">Loading Selection</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-700 font-medium mb-8">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => updateFilters({ category: "", keyword: "" })}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 transition-premium">
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
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
