import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Star, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
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
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
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
        alert('Added to cart!'); // Replace with Toast later
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
                            <img src={img} alt="" className="w-full h-full object-cover" />
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
                    <img src={mainImage} alt={product.title} className="max-h-full max-w-full object-contain" />
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

                <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                </p>

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

                <div className="flex items-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center border border-slate-300 rounded-xl">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-xl">-</button>
                        <span className="px-4 font-bold">{qty}</span>
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
                    <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1">
                        <ShoppingCart className="mr-2" size={20} /> Add to Cart
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                    <div className="flex items-center"><Truck className="mr-2 text-primary" size={18} /> {product.deliveryTime}</div>
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
