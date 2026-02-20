import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Wallet, Zap, ChevronDown, MapPin } from 'lucide-react';
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
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [pincode, setPincode] = useState('');
    const [deliveryEstimate, setDeliveryEstimate] = useState('');
    const [checkingDelivery, setCheckingDelivery] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                setMainImage(data.mainImage || data.images?.[0] || '');
                if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
                if (data.colors?.length > 0) setSelectedColor(data.colors[0]);

                // Fetch recommendations
                console.log(`Fetching recommendations for: ${id}`);
                const recRes = await axios.get(`${API_URL}/api/products/recommend/${id}`);
                console.log("Recommendations received:", recRes.data);
                setRecommendedProducts(recRes.data);
            } catch (error) {
                console.error("Error in ProductDetails fetch:", error);
            }
            setLoading(false);
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleCheckDelivery = async () => {
        if (!pincode || pincode.length !== 6) return;
        setCheckingDelivery(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/products/estimate-delivery`, { pincode });
            setDeliveryEstimate(data.estimate);
        } catch (error) {
            setDeliveryEstimate("Error checking delivery");
        }
        setCheckingDelivery(false);
    };

    const handleAddToCart = () => {
        addToCart(product, qty, selectedSize, selectedColor);
        toast.success(`${product.title} added to cart`);
    };

    const handleBuyNow = () => {
        addToCart(product, qty, selectedSize, selectedColor);
        navigate('/checkout');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-48 animate-pulse">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Loading Perfection...</p>
        </div>
    );

    if (!product) return (
        <div className="text-center py-48">
            <h2 className="text-4xl font-bold text-slate-600 tracking-tighter mb-4">PRODUCT NOT FOUND</h2>
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
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
                    {/* Left: Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-6">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:w-20 no-scrollbar">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(img)}
                                    className={`flex-shrink-0 w-16 md:w-full aspect-square rounded-2xl overflow-hidden border transition-all ${mainImage === img ? 'border-slate-900 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                    <img
                                        src={(() => {
                                            if (img.startsWith('http') && !img.includes('localhost:5000')) return img;
                                            let path = img.replace(/^http:\/\/localhost:5000/, '').replace(/^\/uploads\//, '/assets/').replace(/^\/server\/uploads\//, '/assets/');
                                            return path.startsWith('/') ? path : `${API_URL}${path}`;
                                        })()}
                                        className="w-full h-full object-cover"
                                        alt={`Thumbnail ${index}`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100">
                            <motion.img
                                key={mainImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                src={(() => {
                                    if (mainImage.startsWith('http') && !mainImage.includes('localhost:5000')) return mainImage;
                                    let path = mainImage.replace(/^http:\/\/localhost:5000/, '').replace(/^\/uploads\//, '/assets/').replace(/^\/server\/uploads\//, '/assets/');
                                    return path.startsWith('/') ? path : `${API_URL}${path}`;
                                })()}
                                className="w-full h-full object-contain p-8 md:p-12"
                                alt={product.title}
                            />
                            {product.salePrice > 0 && (
                                <div className="absolute top-6 left-6 bg-secondary text-white py-1.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                    Special Offer
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg">Official Pixel</span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star size={14} className="fill-current" />
                                    <span className="text-xs font-bold text-slate-900">{product.averageRating || '4.8'}</span>
                                    <span className="text-xs font-bold text-slate-600 ml-1">({product.numOfReviews || '120'}+ Reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-[0.95] mb-6">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl md:text-4xl font-bold text-slate-900">₹{(product.salePrice || product.price).toLocaleString()}</span>
                                {product.salePrice && product.price > product.salePrice && (
                                    <span className="text-xl text-slate-600 line-through font-bold">₹{product.price.toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-10 pb-10 border-b border-slate-100 mb-10">
                            {product.sizes?.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                        <span>Select Size</span>
                                        <button className="underline decoration-slate-300">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`h-14 px-6 rounded-2xl border-2 font-bold transition-all ${selectedSize === size ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white rounded-xl transition-all">-</button>
                                        <span className="w-10 text-center font-bold">{qty}</span>
                                        <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white rounded-xl transition-all">+</button>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600">
                                        {product.stock > 0 ? `${product.stock} pieces in stock` : 'Out of Stock'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                        className="h-16 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={product.stock <= 0}
                                        className="h-16 rounded-2xl bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        <Zap size={18} /> Instant Checkout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900"><Truck size={20} /></div>
                                <div><p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Shipping</p><p className="text-xs font-bold">Free over ₹1,999</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900"><RotateCcw size={20} /></div>
                                <div><p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Returns</p><p className="text-xs font-bold">14-day Window</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-32">
                    <div className="flex gap-10 mb-12 border-b border-slate-100 overflow-x-auto no-scrollbar">
                        {['highlights', 'details', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-6 text-xs font-bold uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {tab}
                                {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl">
                        <AnimatePresence mode="wait">
                            {activeTab === 'highlights' && (
                                <motion.div key="h" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {highlights.map((h, i) => (
                                        <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] flex-shrink-0">✓</div>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{h}</p>
                                        </div>
                                    ))}
                                    {remaining && <p className="col-span-full text-base text-slate-500 font-medium italic mt-8 leading-relaxed">"{remaining}"</p>}
                                </motion.div>
                            )}

                            {activeTab === 'details' && (
                                <motion.div key="d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                    {details.map((d, i) => (
                                        <div key={i} className="flex justify-between py-4 border-b border-slate-100 last:border-0 md:last:border-b">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{d.key}</span>
                                            <span className="text-xs font-bold text-slate-900">{d.value}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                                        <div key={i} className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">{r.user?.name?.charAt(0) || 'U'}</div>
                                                    <div><p className="font-bold text-slate-900 text-xs">{r.user?.name || 'Authorized Buyer'}</p><div className="flex text-amber-400 gap-0.5 mt-1">{[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < r.rating ? 'fill-current' : ''} />)}</div></div>
                                                </div>
                                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-green-50 text-green-600 rounded-lg">Verified Purchase</span>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                                        </div>
                                    )) : <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Share your experience first.</p></div>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Recommendations */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-slate-900">Recommended <span className="text-slate-700 italic font-light">for you</span></h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
                            {recommendedProducts.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
