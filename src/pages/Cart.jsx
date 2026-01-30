import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import Button from '../components/Button';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const total = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const { user } = useAuth(); // Import user from AuthContext (add import above)

    const checkoutHandler = () => {
        if (!user) {
            alert('Please login to proceed to checkout');
            navigate('/login?redirect=checkout');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {cart.cartItems.length === 0 ? (
                <div className="text-center glass dark:glass-dark p-12 rounded-3xl">
                    <p className="text-xl mb-6">Your cart is empty</p>
                    <Link to="/shop">
                        <Button>Go Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cart.cartItems.map((item) => (
                            <motion.div
                                key={item.product}
                                layout
                                className="glass dark:glass-dark p-4 rounded-2xl flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                    <div>
                                        <Link to={`/product/${item.product}`} className="font-bold hover:text-primary">{item.name}</Link>
                                        <p className="text-sm text-slate-500">Size: {item.size} | Color: {item.color}</p>
                                        <p className="font-bold text-primary mt-1">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold">{item.qty} x</span>
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="glass dark:glass-dark p-6 rounded-3xl h-fit">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal ({cart.cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between mb-6 font-bold text-lg">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                        <Button onClick={checkoutHandler} className="w-full">
                            Proceed to Checkout <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
