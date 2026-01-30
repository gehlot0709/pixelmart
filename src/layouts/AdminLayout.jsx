import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-gray-100 overflow-hidden relative">
            <ParticlesBackground />

            {/* Sidebar */}
            <aside className="w-64 glass dark:glass-dark flex flex-col z-20 shadow-2xl">
                <div className="p-6 text-2xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent border-b border-gray-200 dark:border-gray-700">
                    PixelMart Admin
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <LayoutDashboard className="mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <Package className="mr-3" /> Products
                    </Link>
                    <Link to="/admin/orders" className="flex items-center p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition">
                        <ShoppingBag className="mr-3" /> Orders
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
            <main className="flex-1 overflow-y-auto p-8 z-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
