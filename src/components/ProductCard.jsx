
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group rounded-3xl glass dark:glass-dark overflow-hidden relative"
        >
            <Link to={`/product/${product._id}`}>
                <div className="h-64 overflow-hidden relative bg-white">
                    <img
                        src={product.images && product.images[0]
                            ? (product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`)
                            : 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category?.name || 'Category'}</p>
                        <Link to={`/product/${product._id}`}>
                            <h3 className="font-bold text-lg truncate hover:text-primary transition">{product.title}</h3>
                        </Link>
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-current mr-1" />
                        {product.averageRating || 0}
                    </div>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div>
                        {product.salePrice > 0 ? (
                            <div className="flex flex-col">
                                <span className="text-slate-400 line-through text-xs">₹{product.price}</span>
                                <span className="text-xl font-bold text-primary">₹{product.salePrice}</span>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-slate-800 dark:text-white">₹{product.price}</span>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        disabled={product.stock <= 0}
                        className={`p-3 rounded-xl transition-colors ${product.stock > 0
                            ? 'bg-slate-800 dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart size={20} />
                    </motion.button>
                </div>

                {product.deliveryTime && (
                    <p className="text-xs text-slate-400 mt-3 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Delivery in {product.deliveryTime}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
