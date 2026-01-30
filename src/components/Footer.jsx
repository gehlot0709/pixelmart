import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-auto w-full bg-black text-white pt-12 pb-6">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                            PixelMart
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            Experience the future of fashion. Premium quality, sustainable materials, and cutting-edge designs tailored for you.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
                            <li><Link to="/offers" className="hover:text-primary transition-colors">Special Offers</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6">Customer Care</h3>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li><Link to="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
                            <li><Link to="/cart" className="hover:text-primary transition-colors">Track Order</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
                        <ul className="space-y-4 text-slate-300 text-sm">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-3 text-primary shrink-0" />
                                <span>123 Fashion Street, Creative Valley, New York, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-3 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-3 text-primary shrink-0" />
                                <span>support@pixelmart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 text-center text-slate-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} PixelMart. All rights reserved. Built with ❤️ for Fashion.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
