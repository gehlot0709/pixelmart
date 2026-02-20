import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="relative min-h-screen flex flex-col text-slate-800 dark:text-gray-100 overflow-hidden bg-premium-gradient">

            <Navbar />

            <main className="container mx-auto px-4 py-4 relative z-10 flex-grow mt-16">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
