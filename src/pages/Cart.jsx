import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import API_URL from '../config';

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    const total = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=checkout');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-24">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-4">
                        Shopping <span className="text-slate-400 italic font-light">Bag</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        {cart.cartItems.length} {cart.cartItems.length === 1 ? 'Item' : 'Items'} Ready to ship
                    </p>
                </div>

                {cart.cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <ShoppingBag size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your bag is empty</h2>
                        <Link to="/shop">
                            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cart.cartItems.map((item) => (
                                    <motion.div
                                        key={item.product}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-8 border border-slate-100 bg-white hover:border-slate-200 transition-all hover:shadow-sm"
                                    >
                                        <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
                                            <img
                                                src={(() => {
                                                    if (item.image.startsWith('http') && !item.image.includes('localhost:5000')) return item.image;
                                                    let path = item.image.replace(/^http:\/\/localhost:5000/, '').replace(/^\/uploads\//, '/assets/').replace(/^\/server\/uploads\//, '/assets/');
                                                    return path.startsWith('/') ? path : `${API_URL}${path}`;
                                                })()}
                                                alt={item.name}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <Link to={`/product/${item.product}`} className="text-lg font-bold tracking-tight text-slate-900 hover:text-primary transition-colors block mb-2 leading-tight">
                                                {item.name}
                                            </Link>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                                <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-400">SZ: {item.size}</span>
                                                <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-400">CL: {item.color}</span>
                                            </div>
                                            <p className="text-xl font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Qty: {item.qty}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product)}
                                                className="w-12 h-12 flex items-center justify-center text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 sticky top-32">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
                                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-900 mb-10 border-b border-slate-100 pb-6">Bag Summary</h2>

                                <div className="space-y-6 mb-10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Sales Tax</span>
                                        <span className="text-slate-900">Included</span>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-center text-xs text-slate-900">
                                            <span>Est. Total</span>
                                            <span className="text-2xl tracking-tighter">₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={checkoutHandler}
                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    Proceed to Checkout <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>

                                <div className="mt-10 flex flex-col items-center gap-4 opacity-50">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-5 bg-slate-100 rounded" />
                                        <div className="w-8 h-5 bg-slate-100 rounded" />
                                        <div className="w-8 h-5 bg-slate-100 rounded" />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Encrypted Security</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
