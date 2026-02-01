import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import Input from '../components/Input';
import { motion } from 'framer-motion';
import Button from '../components/Button';


const Checkout = () => {
    const { cart, saveShippingAddress, clearCart } = useCart();
    const { } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(cart.shippingAddress?.name || '');
    const [email, setEmail] = useState(cart.shippingAddress?.email || '');
    const [houseNumber, setHouseNumber] = useState(cart.shippingAddress?.houseNumber || '');
    const [flatSociety, setFlatSociety] = useState(cart.shippingAddress?.flatSociety || '');
    const [address, setAddress] = useState(cart.shippingAddress?.address || '');
    const [city, setCity] = useState(cart.shippingAddress?.city || '');
    const [state, setState] = useState(cart.shippingAddress?.state || '');
    const [postalCode, setPostalCode] = useState(cart.shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(cart.shippingAddress?.country || 'India');
    const [phone, setPhone] = useState(cart.shippingAddress?.phone || '');
    const [paymentMethod, setPaymentMethod] = useState('QR Code');
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalPrice = itemsPrice; // Add shipping/tax logic here if needed

    const uploadFileHandler = async (e) => {
        // ... (existing upload logic) ...
        // Ensure to handle error clearing if needed
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
            window.scrollTo(0, 0); // Scroll to top to see error
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
            console.error(error);
            setError(error.response?.data?.message || 'Order Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                        <strong className="font-bold">Check your inputs: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={submitHandler} id="checkout-form" className="space-y-4">
                    {/* New Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
                        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Home Number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required placeholder="A-101" />
                        <Input label="Flat/Society Name" value={flatSociety} onChange={(e) => setFlatSociety(e.target.value)} required placeholder="Galaxy Apartments" />
                    </div>

                    <Input label="Street Address / Area" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="MG Road, Near Park" />

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Mumbai" />
                        <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required placeholder="Maharashtra" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="400001" />
                        <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="India" />
                    </div>

                    <Input label="Contact Number" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 9876543210" />
                </form>
            </motion.div>

            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="glass dark:glass-dark p-6 rounded-3xl">
                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                    <div className="flex space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('QR Code')}
                            className={`flex-1 py-3 rounded-xl border-2 transition ${paymentMethod === 'QR Code' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200'}`}
                        >
                            QR Code (Scan & Pay)
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('Cash on Delivery')}
                            className={`flex-1 py-3 rounded-xl border-2 transition ${paymentMethod === 'Cash on Delivery' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200'}`}
                        >
                            Cash on Delivery
                        </button>
                    </div>

                    {paymentMethod === 'QR Code' && (
                        <div className="text-center bg-white p-4 rounded-xl border border-slate-200 mb-4">
                            <p className="mb-2 font-bold text-slate-700">Scan to Pay: ₹{totalPrice}</p>
                            {/* Static QR for Demo */}
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=store@upi&pn=PixelMart" alt="QR Code" className="mx-auto mb-4 w-32 h-32" />

                            <label className="block text-sm font-medium mb-2">Upload Payment Screenshot</label>
                            <input
                                type="file"
                                onChange={uploadFileHandler}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {uploading && <p className="text-sm text-primary mt-2">Uploading...</p>}
                            {paymentProof && <p className="text-sm text-green-500 mt-2">Screenshot Uploaded!</p>}
                        </div>
                    )}
                </div>

                <div className="glass dark:glass-dark p-6 rounded-3xl">
                    <div className="flex justify-between font-bold text-xl mb-6">
                        <span>Total Amount</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <Button
                        type="submit"
                        form="checkout-form"
                        className="w-full"
                        disabled={uploading || isProcessing}
                    >
                        {isProcessing ? 'Processing Order...' : 'Place Order'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Checkout;
