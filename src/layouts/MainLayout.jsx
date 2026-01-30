import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBackground from '../components/ParticlesBackground';

const MainLayout = () => {
    return (
        <div className="relative min-h-screen flex flex-col text-slate-800 dark:text-gray-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-light dark:bg-dark -z-20" />
            <ParticlesBackground />

            <Navbar />

            <main className="container mx-auto px-4 py-8 relative z-10 flex-grow mt-20">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
