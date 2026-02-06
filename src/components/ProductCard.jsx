
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

// GSAP
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const cardRef = useRef();
    const imageRef = useRef();
    const wishlistBtnRef = useRef();

    const { contextSafe } = useGSAP({ scope: cardRef });

    const onMouseEnter = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: -12,
            duration: 0.5,
            ease: "power2.out",
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.2)"
        });
        gsap.to(imageRef.current, {
            scale: 1.15,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    const onMouseMove = contextSafe((e) => {
        const { clientX, clientY } = e;
        const rect = cardRef.current.getBoundingClientRect();

        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;

        gsap.to(cardRef.current, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });

    const onMouseLeave = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: 0,
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power4.inOut",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        });
        gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.8,
            ease: "power3.inOut"
        });
    });

    const onWishlistEnter = contextSafe(() => {
        gsap.to(wishlistBtnRef.current, {
            scale: 1.3,
            rotate: 15,
            duration: 0.4,
            ease: "back.out(2)"
        });
    });

    const onWishlistLeave = contextSafe(() => {
        gsap.to(wishlistBtnRef.current, {
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });

    const onWishlistMove = contextSafe((e) => {
        const btn = wishlistBtnRef.current;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    return (
        <div
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden transition-premium shadow-sm hover:shadow-xl h-full flex flex-col"
            style={{ willChange: "transform" }}
        >
            <Link to={`/product/${product._id}`} className="block flex-1 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-[2rem] m-2">
                    <img
                        ref={imageRef}
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
                        className="w-full h-full object-cover transition-premium duration-700"
                    />

                    {/* Wishlist Button */}
                    <button
                        ref={wishlistBtnRef}
                        onMouseEnter={onWishlistEnter}
                        onMouseMove={onWishlistMove}
                        onMouseLeave={onWishlistLeave}
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
        </div>
    );
};

export default ProductCard;
