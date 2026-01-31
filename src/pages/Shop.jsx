import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const location = useLocation();

  // Check if we are on the Offers page or have category param
  const isOffersPage = location.pathname === "/offers";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const catParam = queryParams.get("category");

    if (catParam && catParam !== category) {
      setCategory(catParam);
    }

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories`,
        );
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [location, category]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Current API URL:", import.meta.env.VITE_API_URL);
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_URL}/api/products?keyword=${keyword}&sort=${sort}`;
        if (category) url += `&category=${category}`;
        if (isOffersPage) url += `&isOffer=true`; // Filter by Offer

        const { data } = await axios.get(url);
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    // Debounce search
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword, category, sort, isOffersPage]); // Re-run when filters change

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {isOffersPage ? "Special Offers" : "Shop All Products"}
      </h1>

      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Categories */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg glass">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${!category ? "bg-primary text-white" : "hover:bg-slate-50"}`}
                >
                  All Products
                </button>
              </li>
              {categories
                .filter((c) => !c.parent)
                .map((parent) => (
                  <li key={parent._id}>
                    <button
                      onClick={() => setCategory(parent._id)}
                      className={`w-full text-left py-2 px-3 rounded-lg flex justify-between items-center transition-colors font-medium ${category === parent._id ? "bg-indigo-50 text-primary" : "hover:bg-slate-50"}`}
                    >
                      {parent.name}
                    </button>

                    {/* Sidebar Subcategories (Always visible if Parent is selected, or we can toggle) */}
                    {(category === parent._id ||
                      categories.find((c) => c._id === category)?.parent ===
                      parent._id) && (
                        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-slate-100 pl-2">
                          {categories
                            .filter((c) => c.parent === parent._id)
                            .map((sub) => (
                              <li key={sub._id}>
                                <button
                                  onClick={() => setCategory(sub._id)}
                                  className={`w-full text-left py-1 text-sm rounded transition-colors ${category === sub._id ? "text-primary font-bold" : "text-slate-500 hover:text-primary"}`}
                                >
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                        </ul>
                      )}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Top Bar & Grid */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-lg mb-8 glass flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <select
              className="p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary min-w-[200px]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <p className="text-center text-xl">Loading...</p>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-slate-400">No products found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
