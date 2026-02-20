import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/contact`,
                { email, message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSent(true);
            setMessage('');
            toast.success('Message sent successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification Error');
        }
        setSending(false);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
                <div className="flex flex-col items-center text-center mb-24 gap-6">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6">
                            Contact <span className="text-slate-400 italic font-light">Us</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 max-w-md mx-auto">
                            We're here to help with any inquiries
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 md:p-14 rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50"
                    >
                        {!user ? (
                            <div className="text-center py-16 space-y-10">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                                    <LogIn size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-3">Identity Verified?</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Please authenticate to dispatch a message.</p>
                                </div>
                                <Link to="/login" className="inline-block px-12 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all active:scale-95">
                                    Sign In To Access
                                </Link>
                            </div>
                        ) : sent ? (
                            <div className="text-center py-16 space-y-10">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-3">Transmission Successful</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">We've received your data and will correspond shortly.</p>
                                </div>
                                <button
                                    onClick={() => setSent(false)}
                                    className="px-12 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all active:scale-95"
                                >
                                    New Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Your Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder=""
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 transition-all font-black text-[10px] placeholder:text-slate-300"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Your Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all min-h-[200px] font-bold text-[11px] placeholder:text-slate-300 resize-none leading-relaxed"
                                        required
                                        placeholder=""
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
