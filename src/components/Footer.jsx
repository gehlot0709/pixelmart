import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-950 text-white relative overflow-hidden mt-16">
            {/* Decorative background gradients */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
                    {/* Brand Identity */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 tracking-tighter">
                                PixelMart.
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium italic opacity-80">
                                "The intersection of cutting-edge technology and timeless elegance. We craft experiences, not just apparel."
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-premium hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Inventory</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Man', link: '/shop?category=men' },
                                { name: 'Woman', link: '/shop?category=women' },
                                { name: 'Collection', link: '/shop' },
                                { name: 'Limited Drops', link: '/offers' }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link to={item.link} className="text-slate-400 hover:text-white transition-premium font-bold text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-4 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Service</h3>
                        <ul className="space-y-4 text-slate-400 text-sm font-bold">
                            <li><Link to="/profile" className="hover:text-white transition-premium">Nexus Account</Link></li>
                            <li><a href="#" className="hover:text-white transition-premium">Pulse Tracking</a></li>
                            <li><a href="#" className="hover:text-white transition-premium">Exchanges</a></li>
                            <li><Link to="/contact" className="hover:text-white transition-premium">Concierge</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="lg:col-span-4 space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Direct Nexus</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white transition-premium">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Encrypted Mail</p>
                                    <p className="text-sm font-bold">hello@pixelmart.io</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-premium">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Physical Node</p>
                                    <p className="text-sm font-bold">101 Digital Avenue, SL Valley, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                        &copy; {new Date().getFullYear()} PixelMart Laboratory. All Rights Reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <a href="#" className="hover:text-white transition-premium">Privacy Protocol</a>
                        <a href="#" className="hover:text-white transition-premium">Terms of Origin</a>
                        <a href="#" className="hover:text-white transition-premium">Compliance</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
