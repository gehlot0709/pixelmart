import { useState, useEffect } from 'react';
import axios from 'axios';
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
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send message.');
        }
        setSending(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 animate-fade-in relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 blur-[120px] -z-10" />

            <div className="flex flex-col items-center text-center mb-16 gap-6">
                <div className="max-w-2xl">
                    <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block underline decoration-primary/30 decoration-4 underline-offset-8 mx-auto w-fit">Contact Us</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                        Get In <span className="text-gradient italic">Touch</span>
                    </h1>
                    <p className="text-slate-400 font-bold italic max-w-md mx-auto">
                        "Our support team is standing by to assist with your needs. Send us a message and we'll respond as soon as possible."
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-dark p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-premium relative overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                    {!user ? (
                        <div className="text-center py-20 space-y-8">
                            <div className="w-24 h-24 bg-white/5 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
                                <LogIn size={40} />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Login Required</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-xs mx-auto">Please login to your account to send us a message.</p>
                            <Link to="/login" className="inline-block px-10 py-5 bg-white text-dark rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:-translate-y-2 transition-premium active:scale-95">
                                Login Now
                            </Link>
                        </div>
                    ) : sent ? (
                        <div className="text-center py-20 space-y-8">
                            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                                <Mail size={40} />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Message Sent</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-xs mx-auto">We've received your signal. We'll get back to you shortly.</p>
                            <button
                                onClick={() => setSent(false)}
                                className="px-10 py-5 bg-white text-dark rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:-translate-y-2 transition-premium active:scale-95"
                            >
                                New Input
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-6">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="user@network.com"
                                    className="w-full h-20 px-8 bg-white/5 border border-white/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-premium font-bold text-white placeholder:text-slate-700"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-6">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-premium min-h-[250px] font-bold text-white placeholder:text-slate-700 resize-none"
                                    required
                                    placeholder="Describe your requirement..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full h-24 bg-white text-dark rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:-translate-y-2 transition-premium flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
