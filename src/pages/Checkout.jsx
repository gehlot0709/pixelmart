import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import Input from '../components/Input';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Zap, ShieldCheck, Truck, ArrowRight } from 'lucide-react';


const Checkout = () => {
    const { cart, saveShippingAddress, clearCart } = useCart();
    const navigate = useNavigate();

    const [name, setName] = useState(cart.shippingAddress?.name || '');
    const [email, setEmail] = useState(cart.shippingAddress?.email || '');
    const [houseNumber, setHouseNumber] = useState(cart.shippingAddress?.houseNumber || '');
    const [flatSociety, setFlatSociety] = useState(cart.shippingAddress?.flatSociety || '');
    const [address, setAddress] = useState(cart.shippingAddress?.address || '');
    const [city, setCity] = useState(cart.shippingAddress?.city || '');
    const [state, setState] = useState(cart.shippingAddress?.state || '');
    const [postalCode, setPostalCode] = useState(cart.shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(cart.shippingAddress?.country || '');
    const [phone, setPhone] = useState(cart.shippingAddress?.phone || '');
    const [paymentMethod, setPaymentMethod] = useState('QR Code');
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalPrice = itemsPrice;

    const uploadFileHandler = async (e) => {
        setError('');
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            };

            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);
            setPaymentProof(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setError('Image upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        saveShippingAddress({ name, email, houseNumber, flatSociety, address, city, state, postalCode, country, phone });

        if (!name || !email || !houseNumber || !flatSociety || !address || !city || !state || !postalCode || !country || !phone) {
            setError('Please fill in all shipping fields correctly.');
            window.scrollTo(0, 0);
            return;
        }

        if (paymentMethod === 'QR Code' && !paymentProof) {
            setError('Please upload the payment screenshot.');
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const orderData = {
                orderItems: cart.cartItems,
                shippingAddress: { name, email, houseNumber, flatSociety, address, city, state, postalCode, country, phone },
                paymentMethod,
                itemsPrice,
                totalPrice,
                paymentProof: paymentMethod === 'QR Code' ? paymentProof : null
            };

            await axios.post(`${API_URL}/api/orders`, orderData, config);

            clearCart();
            alert('Order Placed Successfully!');
            navigate('/profile');
        } catch (error) {
            console.error("Order Submission Failure:", error.response?.data || error.message);
            setError(error.response?.data?.error || error.response?.data?.message || 'Order Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="mb-8">
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block underline decoration-primary/30 decoration-4 underline-offset-8">Secure Checkout</span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">
                    Complete Your <span className="text-gradient italic">Style</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-7 space-y-12">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-600 dark:text-red-400 font-bold"
                        >
                            <span className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">!</span>
                            {error}
                        </motion.div>
                    )}

                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black">01</span>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Shipping Essence</h2>
                        </div>

                        <form onSubmit={submitHandler} id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="md:col-span-2">
                                <Input label="Full Identity" value={name} onChange={(e) => setName(e.target.value)} required placeholder="" />
                            </div>
                            <Input label="Digital Addr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="" />
                            <Input label="Direct Line" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="" />

                            <div className="md:col-span-2 grid grid-cols-2 gap-8">
                                <Input label="Foundation #" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required placeholder="" />
                                <Input label="Domain Name" value={flatSociety} onChange={(e) => setFlatSociety(e.target.value)} required placeholder="" />
                            </div>

                            <div className="md:col-span-2">
                                <Input label="Street Pathway" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="" />
                            </div>

                            <Input label="Nexus City" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="" />
                            <Input label="Province State" value={state} onChange={(e) => setState(e.target.value)} required placeholder="" />

                            <Input label="Cipher Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="" />
                            <Input label="Nation Territory" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="" />
                        </form>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black">02</span>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Payment Ritual</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('QR Code')}
                                className={`group p-6 rounded-[2.5rem] border-2 text-left transition-premium ${paymentMethod === 'QR Code'
                                    ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-premium ${paymentMethod === 'QR Code' ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-slate-100'}`}>
                                    <Zap size={24} />
                                </div>
                                <h4 className="font-black text-lg mb-2 uppercase tracking-tight">QR Master</h4>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">Instant scan and pay via any UPI app.</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('Cash on Delivery')}
                                className={`group p-6 rounded-[2.5rem] border-2 text-left transition-premium ${paymentMethod === 'Cash on Delivery'
                                    ? 'bg-secondary/5 border-secondary shadow-xl shadow-secondary/5'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-premium ${paymentMethod === 'Cash on Delivery' ? 'bg-secondary text-white scale-110 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-slate-100'}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="font-black text-lg mb-2 uppercase tracking-tight">Handover Cash</h4>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">Pay in person when the masterpiece arrives.</p>
                            </button>
                        </div>

                        {paymentMethod === 'QR Code' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass dark:glass-dark p-10 rounded-[3rem] border border-white/20 text-center"
                            >
                                <div className="max-w-[200px] mx-auto p-4 bg-white rounded-3xl mb-8 shadow-2xl">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=pixelexpress@idbi&pn=PixelMart&am=${totalPrice}&cu=INR`} alt="Payment QR" className="w-full h-full object-contain" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Scan to Transfer ₹{totalPrice}</p>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-primary italic underline underline-offset-4 cursor-pointer hover:opacity-80 transition-premium">
                                        {paymentProof ? 'Update Confirmation' : 'Seal Payment Confirmation'}
                                        <input type="file" onChange={uploadFileHandler} className="hidden" />
                                    </label>
                                    {uploading && <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-widest">Encrypting Upload...</p>}
                                    {paymentProof && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full font-black text-[10px] uppercase tracking-widest">
                                            ✓ Digital Receipt Sealed
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </section>
                </div>

                <div className="lg:col-span-5 sticky top-32">
                    <div className="glass dark:glass-dark p-10 rounded-[4rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 blur-[60px] rounded-full" />

                        <h2 className="text-3xl font-black tracking-tighter mb-10 uppercase italic underline decoration-primary decoration-4 underline-offset-8">Reservation</h2>

                        <div className="space-y-6 mb-12">
                            {cart.cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-1 flex-shrink-0">
                                            <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 truncate w-40">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.qty} Unit × {item.size}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-900 dark:text-white">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800 mb-12">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Value</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">₹{totalPrice}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={uploading || isProcessing}
                            className={`w-full h-20 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:-translate-y-2 transition-premium flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 hover:ring-4 ring-primary/20 ${isProcessing ? 'animate-pulse' : ''}`}
                        >
                            {isProcessing ? 'Processing Order...' : 'Seal the Deal'} <ArrowRight size={24} />
                        </button>

                        <div className="mt-10 flex flex-col items-center gap-4 opacity-40">
                            <div className="flex gap-4">
                                <ShieldCheck size={20} />
                                <Truck size={20} />
                                <Zap size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Final Inspection Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
