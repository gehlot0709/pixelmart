import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Wallet, Zap, ChevronDown } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('highlights');

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                setMainImage(data.images[0]);
                if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
                if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty, selectedSize, selectedColor);
        // Using a more premium notification could be better, but sticking to basics for now
    };

    const handleBuyNow = () => {
        addToCart(product, qty, selectedSize, selectedColor);
        navigate('/checkout');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-48 animate-pulse">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Perfection...</p>
        </div>
    );

    if (!product) return (
        <div className="text-center py-48">
            <h2 className="text-4xl font-black text-slate-300 tracking-tighter mb-4">PRODUCT NOT FOUND</h2>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
    );

    const parseDescription = (desc) => {
        if (!desc) return { highlights: [], details: [], remaining: '' };
        const details = [];
        const highlights = [];
        let remaining = desc;
        const attributeRegex = /([A-Za-z\s\(\)]+):\s*([^:]+?)(?=\s+[A-Z][a-z\s\(\)]+\:|\r?\n|$)/g;
        let match;
        const matchedKeys = [];
        while ((match = attributeRegex.exec(desc)) !== null) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key && value && key.length < 50 && value.length < 150) {
                details.push({ key, value });
                matchedKeys.push(match[0]);
            }
        }
        matchedKeys.forEach(k => { remaining = remaining.replace(k, ''); });
        const highlightRegex = /✓\s*([^✓\n]+)/g;
        while ((match = highlightRegex.exec(desc)) !== null) { highlights.push(match[1].trim()); }
        remaining = remaining.replace(/✓\s*[^✓\n]+/g, '').trim();
        return { highlights, details, remaining };
    };

    const { highlights, details, remaining } = parseDescription(product.description);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
                {/* Left: Gallery */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 h-fit">
                    {/* Vertical Thumbnails */}
                    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`flex-shrink-0 w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-premium ${mainImage === img ? 'border-primary ring-4 ring-primary/10 scale-95' : 'border-transparent hover:border-slate-200'
                                    }`}
                            >
                                <img
                                    src={img.startsWith('http') ? img : `${API_URL}${img}`}
                                    className="w-full h-full object-cover"
                                    alt={`Thumbnail ${index}`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Stage */}
                    <div className="flex-1 relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-900 group">
                        <motion.img
                            key={mainImage}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            src={mainImage.startsWith('http') ? mainImage : `${API_URL}${mainImage}`}
                            className="w-full h-full object-contain p-8 md:p-12 mix-blend-multiply dark:mix-blend-normal"
                            alt={product.title}
                        />
                        {product.salePrice > 0 && (
                            <div className="absolute top-8 left-8 bg-primary text-white py-2 px-6 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                                -{Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                            </div>
                        )}
                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-premium">
                            <button className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-xl hover:scale-110 active:scale-95 transition-premium">
                                <Zap size={24} className="text-secondary" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Info */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">New Arrival</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.floor(product.averageRating) ? 'fill-current' : ''} />
                                    ))}
                                </div>
                                <span>({product.numOfReviews} Verified)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white leading-[1.1]">
                            {product.title}
                        </h1>
                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-4xl font-black text-primary">₹{product.salePrice > 0 ? product.salePrice : product.price}</span>
                            {product.salePrice > 0 && (
                                <span className="text-xl text-slate-400 line-through font-medium">₹{product.price}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                        {/* Selections */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-gradient">Select Size</h4>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[56px] h-14 rounded-2xl border-2 font-black transition-premium ${selectedSize === size
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-xl scale-105'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-gradient">Select Color</h4>
                                <div className="flex gap-4">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            style={{ backgroundColor: color }}
                                            className={`w-12 h-12 rounded-full border-4 transition-premium ${selectedColor === color ? 'border-primary ring-4 ring-primary/20 scale-110 shadow-lg' : 'border-white dark:border-slate-900 hover:scale-105 shadow-sm'
                                                }`}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Cart */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-premium"
                                >-</button>
                                <span className="w-12 text-center font-black">{qty}</span>
                                <button
                                    onClick={() => qty < product.stock && setQty(qty + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-premium"
                                >+</button>
                            </div>
                            <span className="text-xs font-bold text-slate-400 italic">
                                {product.stock > 0 ? `Only ${product.stock} units left!` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="h-16 rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-premium flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                className="h-16 rounded-[1.25rem] bg-secondary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-premium flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                <Zap size={18} /> Buy Now
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-y-6 gap-x-12">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary group transition-premium hover:bg-primary/5">
                                <Truck size={24} className="transition-premium group-hover:scale-110" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Shipping</p>
                                <p className="text-sm font-bold">{product.deliveryTime}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-secondary group transition-premium hover:bg-secondary/5">
                                <ShieldCheck size={24} className="transition-premium group-hover:scale-110" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Warranty</p>
                                <p className="text-sm font-bold">PixelMart Assured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Details & Reviews */}
            <div className="mt-16 md:mt-20">
                <div className="flex gap-8 mb-12 border-b border-slate-100 dark:border-slate-800">
                    {['highlights', 'details', 'reviews'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-6 text-sm font-black uppercase tracking-[0.3em] transition-premium relative ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl">
                    <AnimatePresence mode="wait">
                        {activeTab === 'highlights' && (
                            <motion.div
                                key="highlights"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                {highlights.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {highlights.map((h, i) => (
                                            <div key={i} className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl group hover:-translate-y-1 transition-premium">
                                                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-125 transition-premium">✓</div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{h}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {remaining && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                                            "{remaining}"
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4"
                            >
                                {details.map((detail, idx) => (
                                    <div key={idx} className="flex justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 md:last:border-b">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{detail.key}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{detail.value}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((review, i) => (
                                        <div key={i} className="p-8 glass dark:glass-dark rounded-[2.5rem] border border-white/20">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white">{review.user?.name || 'Anonymous User'}</p>
                                                        <div className="flex text-amber-400 gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} className={i < review.rating ? 'fill-current' : ''} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Buyer</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                                        <Star size={40} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest">No stories shared yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
