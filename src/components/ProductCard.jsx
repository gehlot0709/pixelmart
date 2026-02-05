
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discountPercentage = product.price && product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden transition-premium"
        >
            <Link to={`/product/${product._id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-[2rem]">
                    <img
                        src={product.images && product.images[0]
                            ? (() => {
                                const img = product.images[0];
                                if (img.startsWith('http') && !img.includes('localhost:5000')) return img;
                                const path = img.replace(/^http:\/\/localhost:5000/, '');
                                return path.startsWith('http') ? path : `${API_URL}${path}`;
                            })()
                            : 'https://via.placeholder.com/300x400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-700"
                    />


                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-800 hover:text-secondary hover:scale-110 transition-premium shadow-sm"
                    >
                        <Heart size={20} className={isWishlisted ? "fill-secondary text-secondary" : ""} />
                    </button>


                    {/* Stock Status */}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                    <div className="mb-2">
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                            {product.title}
                        </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 mb-2">
                        {discountPercentage > 0 && (
                            <span className="text-sm font-black text-green-600 flex items-center gap-0.5">
                                <span className="text-[10px] transform rotate-180">↑</span>
                                {discountPercentage}%
                            </span>
                        )}
                        <span className="text-sm md:text-base font-bold text-slate-400 line-through">
                            ₹{product.price}
                        </span>
                        <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                            ₹{product.salePrice || product.price}
                        </span>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-sm border border-green-100 flex items-center gap-1">
                            Hot Deal
                        </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between mt-auto">
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium">
                            Delivery by <span className="font-black text-slate-900 dark:text-slate-200">5th Feb</span>
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
