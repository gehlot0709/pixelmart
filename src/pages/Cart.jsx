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
                <div className="mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-4">
                        Shopping <span className="text-slate-400 italic font-light">Bag</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                        {cart.cartItems.length} {cart.cartItems.length === 1 ? 'Item' : 'Items'} Ready to ship
                    </p>
                </div>

                {cart.cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 md:py-40 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm text-slate-400">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Your bag is empty</h2>
                        <Link to="/shop">
                            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cart.cartItems.map((item) => (
                                    <motion.div
                                        key={item.product}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group p-5 md:p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 md:gap-8 border border-slate-100 bg-white hover:border-slate-200 transition-all hover:shadow-sm"
                                    >
                                        <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
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

                                        <div className="flex-1 text-center sm:text-left space-y-3">
                                            <Link to={`/product/${item.product}`} className="text-lg md:text-xl font-bold tracking-tight text-slate-900 hover:text-primary transition-colors block leading-tight">
                                                {item.name}
                                            </Link>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-700">SZ: {item.size}</span>
                                                <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-700">CL: {item.color}</span>
                                            </div>
                                            <p className="text-xl font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                            <div className="flex-1 sm:flex-none flex items-center justify-center px-6 h-14 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                                Qty: {item.qty}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product)}
                                                className="w-14 h-14 flex items-center justify-center text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={22} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 sticky top-32">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
                                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-900 mb-8 border-b border-slate-100 pb-6 text-center lg:text-left">Order Summary</h2>

                                <div className="space-y-6 mb-10 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                    <div className="flex justify-between items-center">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Packaging</span>
                                        <span className="text-slate-900">No Extra Cost</span>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-center text-xs text-slate-900">
                                            <span className="font-bold">Total Payable</span>
                                            <span className="text-3xl tracking-tighter font-bold">₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={checkoutHandler}
                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    Review & Checkout <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>

                                <div className="mt-8 flex flex-col items-center gap-4 opacity-70">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200" />
                                        <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200" />
                                        <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200" />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500">100% Secure Transaction</span>
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
