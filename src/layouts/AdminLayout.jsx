import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home, Tag, Users, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-gray-100 overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                absolute lg:relative w-64 bg-white dark:bg-slate-900 flex flex-col z-40 shadow-2xl h-full transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        PixelMart
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-primary">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <LayoutDashboard className="mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/products" onClick={() => setIsSidebarOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <Package className="mr-3" /> Products
                    </Link>
                    <Link to="/admin/orders" onClick={() => setIsSidebarOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <ShoppingBag className="mr-3" /> Orders
                    </Link>
                    <Link to="/admin/users" onClick={() => setIsSidebarOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <Users className="mr-3" /> Users
                    </Link>
                    <Link to="/admin/categories" onClick={() => setIsSidebarOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <Tag className="mr-3" /> Categories
                    </Link>
                    <Link to="/" className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <Home className="mr-3" /> View Site
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition">
                        <LogOut className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto z-10">
                {/* Mobile Header for Hamburger */}
                <div className="lg:hidden p-4 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">Admin Panel</span>
                    <div className="w-8"></div> {/* Spacer for center alignment */}
                </div>

                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
