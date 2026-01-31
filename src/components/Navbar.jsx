import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import API_URL from '../config';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { cartItems } = cart;
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/categories`);
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    const isActive = (path) => {
        if (path === '/shop' && location.pathname.startsWith('/shop')) {
            return 'text-primary font-bold';
        }
        return location.pathname === path ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary';
    };

    return (
        <nav className="fixed w-full z-50 glass top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PixelMart</span>
                </Link>

                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary hidden md:block">
                                    Admin Panel
                                </Link>
                            )}

                            <div className="relative group z-50">
                                <button className="flex items-center gap-2 py-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:block font-medium text-slate-700 group-hover:text-primary">
                                        {user.name}
                                    </span>
                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-transform group-hover:rotate-180" />
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 pt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block transition-all animate-fade-in-down">
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    <ul className="py-2 text-sm text-slate-700">
                                        <li>
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition-colors">
                                                <User size={16} /> My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition-colors">
                                                <Sparkles size={16} className="text-yellow-500" /> My Orders
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <button className="px-5 py-2 rounded-xl text-primary font-bold hover:bg-primary/10 border border-primary/20 transition-all">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}

                    <Link to="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6 text-slate-700 hover:text-primary transition-colors" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <li>
                            <Link to="/" className={`block py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive('/')}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="relative group">
                                <button className={`flex items-center py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive('/shop')}`}>
                                    Shop <ChevronDown size={16} className="ml-1" />
                                </button>
                                {/* Mega Dropdown menu */}
                                <div className="absolute z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-xl w-64 group-hover:block animate-fade-in-down top-full left-0 border border-gray-100">
                                    <ul className="py-2 text-sm text-gray-700">
                                        <li>
                                            <Link to="/shop" className="block px-4 py-2 hover:bg-slate-50 font-bold text-primary">Shop All</Link>
                                        </li>
                                        {categories.filter(c => !c.parent).map(parent => (
                                            <li key={parent._id} className="relative group/sub px-4 py-2 hover:bg-slate-50 cursor-pointer">
                                                <div className="flex justify-between items-center w-full">
                                                    <Link to={`/shop?category=${parent._id}`} className="block w-full">{parent.name}</Link>
                                                    <ChevronDown size={14} className="-rotate-90 text-gray-400 group-hover/sub:text-primary" />
                                                </div>

                                                {/* Submenu */}
                                                <div className="absolute left-full top-0 hidden group-hover/sub:block bg-white border border-gray-100 rounded-lg shadow-xl w-48 ml-1">
                                                    <ul className="py-2">
                                                        {categories.filter(c => c.parent === parent._id).length > 0 ? (
                                                            categories.filter(c => c.parent === parent._id).map(sub => (
                                                                <li key={sub._id}>
                                                                    <Link to={`/shop?category=${sub._id}`} className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-primary">
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-xs text-gray-400">No subcategories</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link to="/offers" className={`flex items-center py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive('/offers')}`}>
                                <Sparkles size={16} className="mr-1 text-yellow-500" /> Offers
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`block py-2 px-3 rounded md:p-0 transition-all duration-300 ${isActive('/contact')}`}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
