import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

import { motion } from 'framer-motion';
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
        alert('Added to cart!');
    };

    const handleBuyNow = () => {
        addToCart(product, qty, selectedSize, selectedColor);
        navigate('/checkout');
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Images - Redesigned Vertical Gallery */}
            <div className="flex gap-6 h-[500px]">
                {/* Vertical Thumbnails */}
                <div className="flex flex-col space-y-4 overflow-y-auto pr-2 w-24 scrollbar-thin scrollbar-thumb-slate-300">
                    {product.images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setMainImage(img)}
                            className={`w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-slate-300'
                                }`}
                        >
                            <img src={img.startsWith('http') ? img : `${API_URL}${img}`} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <motion.div
                    key={mainImage}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 rounded-3xl overflow-hidden glass dark:glass-dark p-4 flex items-center justify-center bg-white relative"
                >
                    <img src={mainImage.startsWith('http') ? mainImage : `${API_URL}${mainImage}`} alt={product.title} className="max-h-full max-w-full object-contain" />
                </motion.div>
            </div>

            {/* Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center text-yellow-500 font-bold">
                            <Star className="fill-current w-4 h-4 mr-1" /> {product.averageRating}
                        </div>
                        <span>|</span>
                        <span>{product.numOfReviews} Reviews</span>
                        <span>|</span>
                        <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>

                <div className="text-3xl font-bold text-primary">
                    ₹{product.salePrice > 0 ? product.salePrice : product.price}
                    {product.salePrice > 0 && <span className="text-slate-400 line-through text-lg ml-3">₹{product.price}</span>}
                </div>

                {/* Structured Description Parsing */}
                {(() => {
                    const parseDescription = (desc) => {
                        if (!desc) return { highlights: [], details: [], remaining: '' };

                        const details = [];
                        const highlights = [];
                        let remaining = desc;

                        // Improved Regex to capture Attribute: Value patterns
                        // Look for phrases like "Material: Cotton" or "Net Quantity (N): 1"
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

                        // Remove matched details from remaining text to find description/highlights
                        matchedKeys.forEach(k => {
                            remaining = remaining.replace(k, '');
                        });

                        // Extract Checkmark highlights
                        const highlightRegex = /✓\s*([^✓\n]+)/g;
                        while ((match = highlightRegex.exec(desc)) !== null) {
                            highlights.push(match[1].trim());
                        }

                        // Clean up remaining text
                        remaining = remaining.replace(/✓\s*[^✓\n]+/g, '').trim();

                        return { highlights, details, remaining };
                    };

                    const { highlights, details, remaining } = parseDescription(product.description);

                    return (
                        <div className="space-y-8">
                            {/* Product Highlights Grid */}
                            {details.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Product Highlights</h3>
                                        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Copy</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                        {details.slice(0, 4).map((detail, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                <span className="text-slate-500 text-xs font-medium uppercase tracking-tight">{detail.key}</span>
                                                <span className="text-slate-900 dark:text-slate-200 font-semibold">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Details Accordion-style or List */}
                            {details.length > 4 && (
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Additional Details</h3>
                                        <ChevronDown size={20} className="text-slate-400" />
                                    </div>
                                    <div className="space-y-3">
                                        {details.slice(4).map((detail, idx) => (
                                            <div key={idx} className="flex justify-between items-start py-1">
                                                <span className="text-slate-500 text-sm font-medium w-1/2">{detail.key}</span>
                                                <span className="text-slate-800 dark:text-slate-300 text-sm font-semibold w-1/2">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full Description / More Info */}
                            {remaining && (
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">More Information</h3>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm">
                                        {remaining}
                                    </p>
                                </div>
                            )}

                            {/* Bullet Highlights */}
                            {highlights.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                                    <ul className="space-y-2">
                                        {highlights.map((h, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                                                <span className="text-green-500 mr-2">✓</span>
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Options */}
                <div className="space-y-4">
                    {product.sizes?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Select Size</h4>
                            <div className="flex space-x-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-lg border ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-slate-300 hover:border-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Select Color</h4>
                            <div className="flex space-x-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center border border-slate-300 rounded-xl w-full sm:w-auto">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-xl">-</button>
                        <span className="px-4 font-bold flex-1 text-center">{qty}</span>
                        <button
                            onClick={() => {
                                if (qty >= product.stock) {
                                    alert('Stock limit reached! You cannot add more quantities.');
                                } else {
                                    setQty(qty + 1);
                                }
                            }}
                            className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-xl"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex flex-1 gap-2 w-full">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="flex-1 px-6 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 transition"
                        >
                            <ShoppingCart className="mr-2" size={20} /> Add to Cart
                        </button>
                        <Button
                            onClick={handleBuyNow}
                            disabled={product.stock <= 0}
                            className="flex-1 py-4"
                        >
                            <Zap className="mr-2" size={20} /> Buy Now
                        </Button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-2">
                            <RotateCcw size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">10-Day Return</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-2">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cash on Delivery</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-2">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PixelMart Assured</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 pt-6">
                    <div className="flex items-center"><Truck className="mr-2 text-primary" size={18} /> {product.deliveryTime} Delivery</div>
                    <div className="flex items-center"><ShieldCheck className="mr-2 text-primary" size={18} /> Secure Transaction</div>
                </div>
            </div>

            {/* Reviews Section Placeholder */}
            <div className="md:col-span-2 mt-12">
                <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                <div className="glass dark:glass-dark p-6 rounded-3xl">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, i) => (
                            <div key={i} className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
                                <div className="flex items-center mb-2">
                                    <div className="font-bold mr-2">{review.user?.name || 'User'}</div>
                                    <div className="flex text-yellow-500"><Star size={14} className="fill-current" /> {review.rating}</div>
                                </div>
                                <p className="text-slate-600">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
                    )}

                    {/* Add Review Form can go here */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
