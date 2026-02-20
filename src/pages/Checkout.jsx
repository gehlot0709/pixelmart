import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from '../config';
import Input from '../components/Input';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Zap, ShieldCheck, Truck, ArrowRight } from 'lucide-react';


const Checkout = () => {
    const { cart, saveShippingAddress, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
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

    useEffect(() => {
        if (!authLoading && !user) {
            toast.warning('Please login to continue to checkout', { toastId: 'login-warning' });
            navigate('/login?redirect=checkout');
        }
    }, [user, authLoading, navigate]);

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
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

        // 1. Name Validation
        if (!name || name.trim().length < 3) {
            setError('❌ Full Name must be at least 3 characters long.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('❌ Please enter a valid Email Address.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 3. Phone Validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone || !phoneRegex.test(phone)) {
            setError('❌ Please enter a valid 10-digit Mobile Number.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 4. Address Details Validation
        if (!houseNumber || houseNumber.trim() === '') {
            setError('❌ Home/House Number is required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!flatSociety || flatSociety.trim() === '') {
            setError('❌ Society or Apartment Name is required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!address || address.trim() === '') {
            setError('❌ Area/Street details are required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!city || city.trim() === '') {
            setError('❌ City name is required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!state || state.trim() === '') {
            setError('❌ State selection is required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 5. Pin Code Validation (6 digits)
        const pinRegex = /^[0-9]{6}$/;
        if (!postalCode || !pinRegex.test(postalCode)) {
            setError('❌ Please enter a valid 6-digit Pin Code.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 6. Landmark/Country
        if (!country || country.trim() === '') {
            setError('❌ Landmark/Location details are required.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        saveShippingAddress({ name, email, houseNumber, flatSociety, address, city, state, postalCode, country, phone });

        if (paymentMethod === 'QR Code' && !paymentProof) {
            setError('❌ Please upload the payment screenshot.');
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
            toast.success('First Order Placed Successfully!');
            navigate('/profile');
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'Order Failed';
            console.error("Order Submission Failure:", error.response?.data || error.message);
            setError(msg);
            toast.error(msg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-24">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-4">
                        Secure <span className="text-slate-700 italic font-light">Checkout</span>
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600">
                        <ShieldCheck size={14} className="text-green-600" />
                        <span>Encrypted Transaction</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-16">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 font-bold text-sm"
                            >
                                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">!</span>
                                {error}
                            </motion.div>
                        )}

                        {/* Step 1: Shipping */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">01</span>
                                <h2 className="text-xl font-bold tracking-tight uppercase text-slate-900">Delivery Address</h2>
                            </div>

                            <form onSubmit={submitHandler} id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <Input label="Receiver's Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="" />
                                </div>
                                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="" />
                                <Input label="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="" />

                                <div className="md:col-span-2 grid grid-cols-2 gap-8">
                                    <Input label="House/Flat No." value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required placeholder="" />
                                    <Input label="Society/Building" value={flatSociety} onChange={(e) => setFlatSociety(e.target.value)} required placeholder="" />
                                </div>

                                <div className="md:col-span-2">
                                    <Input label="Street/Area" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="" />
                                </div>

                                <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="" />
                                <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required placeholder="" />

                                <Input label="Pincode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="" />
                                <Input label="Landmark (Optional)" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="" />
                            </form>
                        </section>

                        {/* Step 2: Payment */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">02</span>
                                <h2 className="text-xl font-bold tracking-tight uppercase text-slate-900">Payment Option</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('QR Code')}
                                    className={`group p-8 rounded-3xl border-2 text-left transition-all ${paymentMethod === 'QR Code' ? 'bg-slate-50 border-slate-900 shadow-xl shadow-slate-900/5' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl mb-6 flex items-center justify-center transition-all ${paymentMethod === 'QR Code' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="font-bold text-sm mb-2 uppercase tracking-widest text-slate-900">UPI / QR Scan</h4>
                                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">Instant verification. Faster shipping.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('Cash on Delivery')}
                                    className={`group p-8 rounded-3xl border-2 text-left transition-all ${paymentMethod === 'Cash on Delivery' ? 'bg-slate-50 border-slate-900 shadow-xl shadow-slate-900/5' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl mb-6 flex items-center justify-center transition-all ${paymentMethod === 'Cash on Delivery' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                        <Truck size={20} />
                                    </div>
                                    <h4 className="font-bold text-sm mb-2 uppercase tracking-widest text-slate-900">Cash on Delivery</h4>
                                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">Pay in person. Standard fulfillment.</p>
                                </button>
                            </div>

                            {paymentMethod === 'QR Code' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center"
                                >
                                    <div className="max-w-[180px] mx-auto p-4 bg-white rounded-2xl mb-8 shadow-xl">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=pixelmart0206@okaxis&pn=PixelMart&am=${totalPrice}&cu=INR`} alt="Payment QR" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-8 underline decoration-slate-200 underline-offset-8">Scan to Transfer ₹{totalPrice.toLocaleString()}</p>

                                    <div className="space-y-4">
                                        <label className="inline-block px-10 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-primary transition-all shadow-2xl shadow-slate-900/20">
                                            {paymentProof ? 'Update Screenshot' : 'Upload Proof'}
                                            <input type="file" onChange={uploadFileHandler} className="hidden" />
                                        </label>
                                        {uploading && <p className="text-[10px] font-bold text-slate-900 animate-pulse uppercase tracking-widest">Verifying...</p>}
                                        {paymentProof && (
                                            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest mt-4">
                                                <ShieldCheck size={14} /> Confirmation Received
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </section>
                    </div>

                    {/* Order Sidebar */}
                    <div className="lg:col-span-4 sticky top-32">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-900 mb-10 border-b border-slate-100 pb-6">Your Order</h2>

                            <div className="space-y-6 mb-12">
                                {cart.cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1">
                                                <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-900 line-clamp-1 truncate w-32">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.qty} Unit × {item.size}</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-900">₹{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-100 mb-12">
                                <div className="flex justify-between items-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-widest">Total Amount</span>
                                    <span className="text-2xl tracking-tighter font-bold italic">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={uploading || isProcessing}
                                className={`w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 group ${isProcessing ? 'animate-pulse' : ''}`}
                            >
                                {isProcessing ? 'Finalizing...' : 'Complete Purchase'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>

                            <div className="mt-10 flex flex-col items-center gap-4 opacity-50">
                                <div className="flex gap-4 text-slate-600">
                                    <ShieldCheck size={16} />
                                    <Truck size={16} />
                                    <Zap size={16} />
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Verified Secure Checkpoint</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
