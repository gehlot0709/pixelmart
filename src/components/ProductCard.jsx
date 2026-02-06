
import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden transition-premium shadow-sm hover:shadow-xl h-full flex flex-col"
        >
            <Link to={`/product/${product._id}`} className="block flex-1 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-[2rem] m-2">
                    <img
                        src={(() => {
                            const img = product.mainImage || (product.images && product.images[0]);
                            if (!img) return 'https://via.placeholder.com/300x400';
                            if (img.startsWith('http') && !img.includes('localhost:5000')) return img;
                            let path = img.replace(/^http:\/\/localhost:5000/, '');
                            path = path.replace(/^\/uploads\//, '/assets/');
                            path = path.replace(/^\/server\/uploads\//, '/assets/');
                            return path.startsWith('/') ? path : `${API_URL}${path}`;
                        })()}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-700"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-800 hover:text-secondary hover:scale-110 transition-premium shadow-sm z-10"
                    >
                        <Heart size={18} className={isWishlisted ? "fill-secondary text-secondary" : ""} />
                    </button>

                    {/* Stock Status */}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 pt-2 flex-1 flex flex-col">
                    <div className="mb-2">
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                            {product.title}
                        </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                            ₹{product.salePrice || product.price}
                        </span>
                        {product.salePrice && product.price > product.salePrice && (
                            <span className="text-base font-bold text-slate-400 line-through">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-sm border border-green-100">
                            Hot Deal
                        </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-white/5">
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium flex items-center gap-1">
                            Delivery by <span className="font-black text-slate-900 dark:text-slate-200">5th Feb</span>
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
