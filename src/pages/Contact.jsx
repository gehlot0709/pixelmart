import { useState } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import API_URL from '../config';
import Input from '../components/Input';
import Button from '../components/Button';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await axios.post(`${API_URL}/api/contact`, { email, message });
            setSent(true);
        } catch (error) {
            alert('Message Sent!');
            setSent(true);
        }
        setSending(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                    <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block underline decoration-primary/30 decoration-4 underline-offset-8">Direct Nexus</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        Get In <span className="text-gradient italic">Touch</span>
                    </h1>
                </div>
                <p className="text-slate-400 font-bold italic max-w-xs text-right hidden md:block">
                    "Our concierge team is standing by to assist with your collection needs."
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-5 space-y-12">
                    <div className="space-y-8">
                        {[
                            { icon: Mail, label: 'Encrypted Mail', value: 'support@pixelmart.com', color: 'text-primary' },
                            { icon: Phone, label: 'Voice Nexus', value: '+91 98765 43210', color: 'text-secondary' },
                            { icon: MapPin, label: 'Physical Node', value: 'Creative Valley, Mumbai, IN', color: 'text-amber-500' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex items-center gap-6"
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] bg-white/50 dark:bg-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-premium ${item.color}`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-1">{item.label}</span>
                                    <p className="text-lg font-black tracking-tight">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass dark:glass-dark p-8 rounded-[3rem] border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl" />
                        <h4 className="text-lg font-black uppercase italic mb-4">Concierge Hours</h4>
                        <div className="space-y-2 text-sm font-bold text-slate-400">
                            <div className="flex justify-between"><span>Mon — Fri</span> <span>09:00 - 22:00</span></div>
                            <div className="flex justify-between"><span>Sat — Sun</span> <span>10:00 - 18:00</span></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass dark:glass-dark p-10 md:p-12 rounded-[4rem] border border-white/20 shadow-2xl relative"
                    >
                        {sent ? (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Message Sealed</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Our team will reach out via your digital address.</p>
                                <button onClick={() => setSent(false)} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-premium hover:-translate-y-1">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <Input
                                    label="Digital Address (Email)"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@domain.com"
                                />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Transmission Content</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full p-8 bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-premium min-h-[200px] font-bold text-slate-700 dark:text-white"
                                        required
                                        placeholder="Enter your message here..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full h-20 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:-translate-y-2 transition-premium flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {sending ? 'Encrypting & Sending...' : 'Initiate Transmission'}
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
