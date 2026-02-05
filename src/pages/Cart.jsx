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
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div className="max-w-xl">
                    <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Your Selection</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        Shopping <span className="text-gradient italic">Bag</span>
                    </h1>
                </div>
                <p className="text-slate-400 font-bold italic">
                    {cart.cartItems.length} {cart.cartItems.length === 1 ? 'Masterpiece' : 'Masterpieces'} Reserved
                </p>
            </div>

            {cart.cartItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 glass dark:glass-dark rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800"
                >
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-300 mb-6">YOUR BAG IS BREATHING...</h2>
                    <Link to="/shop">
                        <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-110 active:scale-95 transition-premium">
                            Start Collecting
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence>
                            {cart.cartItems.map((item) => (
                                <motion.div
                                    key={item.product}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group glass dark:glass-dark p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 border border-white/20 hover:border-primary/20 transition-premium"
                                >
                                    <div className="w-32 h-32 flex-shrink-0 rounded-3xl overflow-hidden bg-white/50 p-2">
                                        <img
                                            src={(() => {
                                                if (item.image.startsWith('http') && !item.image.includes('localhost:5000')) return item.image;
                                                let path = item.image.replace(/^http:\/\/localhost:5000/, '');
                                                path = path.replace(/^\/uploads\//, '/assets/');
                                                path = path.replace(/^\/server\/uploads\//, '/assets/');
                                                return path.startsWith('/') ? path : `${API_URL}${path}`;
                                            })()}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-premium duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product/${item.product}`} className="text-xl font-black tracking-tight text-slate-900 dark:text-white hover:text-primary transition-premium leading-tight block mb-2">
                                            {item.name}
                                        </Link>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">Size: {item.size}</span>
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">Color: {item.color}</span>
                                        </div>
                                        <p className="text-2xl font-black text-primary">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl">
                                            <span className="px-4 font-black text-slate-400 text-xs uppercase tracking-widest">Qty: {item.qty}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="w-14 h-14 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-500 hover:text-white transition-premium shadow-lg shadow-red-500/5 hover:rotate-12"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-4 sticky top-32">
                        <div className="glass dark:glass-dark p-8 md:p-10 rounded-[3rem] border border-white/20 shadow-2xl">
                            <h2 className="text-2xl font-black tracking-tighter mb-8 uppercase italic underline decoration-primary decoration-4 underline-offset-8">Summary</h2>

                            <div className="space-y-6 mb-10 text-sm font-bold text-slate-500 dark:text-slate-400">
                                <div className="flex justify-between">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Subtotal</span>
                                    <span className="text-slate-900 dark:text-white font-black">₹{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Shipping</span>
                                    <span className="text-green-500 font-black tracking-widest">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Est. Taxes</span>
                                    <span className="text-slate-900 dark:text-white font-black">₹0</span>
                                </div>
                                <div className="h-px bg-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between text-xl text-slate-900 dark:text-white">
                                    <span className="font-black italic">GRAND TOTAL</span>
                                    <span className="font-black">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:-translate-y-1 transition-premium flex items-center justify-center gap-3 group active:scale-95"
                            >
                                Checkout Now <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
                                <span className="text-[10px] font-black uppercase tracking-widest">Secured by PixelPay</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
