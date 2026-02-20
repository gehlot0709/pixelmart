import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#172337] text-white mt-32">
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand Identity */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tighter uppercase italic">
                                Pixel<span className="text-slate-400 font-light">Mart</span>
                            </h2>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                                Redefining the shopping experience with curated premium collections and exceptional service.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <Link key={idx} to="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Navigation</h3>
                        <ul className="space-y-4">
                            {['Home', 'Shop', 'Offers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-300 hover:text-white transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Services</h3>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Shipping Info', 'Returns'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-300 hover:text-white transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Bar Style (No Extra Content) */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Connect</h3>
                        <div className="flex items-center gap-4 text-slate-300">
                            <Mail size={18} className="text-blue-400" />
                            <span className="text-sm">Contact Support</span>
                        </div>
                    </div>
                </div>

                <div className="pt-16 mt-16 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} PixelMart. All Rights Reserved
                    </p>
                    <div className="flex gap-4 items-center opacity-30 grayscale brightness-200">
                        {['VISA', 'MASTERCARD', 'PAYPAL', 'AMEX'].map(card => (
                            <span key={card} className="text-[8px] font-bold tracking-tighter border border-white/50 px-1 rounded">{card}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
