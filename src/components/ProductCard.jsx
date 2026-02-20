import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useState, useRef, memo, useCallback, useMemo } from 'react';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

// GSAP
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ProductCard = memo(({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    const imageUrl = useMemo(() => {
        const img = product?.mainImage || (product?.images && product?.images[0]);
        if (!img) return 'https://via.placeholder.com/300x400';
        if (img.startsWith('http') && !img.includes('localhost:5000')) return img;
        let path = img.replace(/^http:\/\/localhost:5000/, '');
        path = path.replace(/^\/uploads\//, '/assets/');
        path = path.replace(/^\/server\/uploads\//, '/assets/');
        return path.startsWith('/') ? path : `${API_URL}${path}`;
    }, [product?.mainImage, product?.images]);

    const toggleWishlist = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(prev => !prev);
    }, []);

    const handleAddToCart = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            await addToCart(product);
            toast.success(`${product.title} added to cart`);
        } finally {
            setLoading(false);
        }
    }, [product, addToCart]);

    return (
        <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-500 overflow-hidden h-full">
            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-secondary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 md:opacity-0"
            >
                <Heart size={16} className={isWishlisted ? "fill-secondary text-secondary border-none" : ""} />
            </button>

            {/* Product Image */}
            <Link to={`/product/${product?._id}`} className="relative overflow-hidden cursor-pointer block border-b border-slate-50">
                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                    <img
                        loading="lazy"
                        src={imageUrl}
                        alt={product?.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />

                    {product?.salePrice && product?.price > product?.salePrice && (
                        <div className="absolute top-4 left-4 px-2 py-1 bg-secondary rounded-lg shadow-lg">
                            <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                            </span>
                        </div>
                    )}

                    {product?.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 md:p-6 flex flex-col flex-1 gap-2 md:gap-4">
                <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900 mb-1">
                        Official Product
                    </p>
                    <Link to={`/product/${product?._id}`}>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2 hover:text-primary transition-colors leading-tight min-h-[2.8em]">
                            {product?.title}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex flex-col">
                        {product?.salePrice ? (
                            <>
                                <span className="text-base md:text-xl font-bold text-slate-900 leading-none">
                                    ₹{product.salePrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] md:text-xs text-slate-500 line-through mt-1">
                                    ₹{product.price.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-base md:text-xl font-bold text-slate-900">
                                ₹{product?.price?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={loading || product?.stock <= 0}
                        className="p-3 md:p-4 bg-slate-900 text-white rounded-2xl md:rounded-[1.25rem] hover:bg-primary transition-all active:scale-90 disabled:opacity-50 shadow-lg shadow-black/5"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
