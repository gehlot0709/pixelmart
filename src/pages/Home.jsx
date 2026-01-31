
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Gradient Removed as per request */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-pink-100 dark:from-slate-900 dark:to-slate-800 -z-10" /> */}

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-xl z-10"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Experience The Future.
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">
                            Premium fashion for Men, Women, and Kids. Discover the latest trends tailored for the modern lifestyle. Quality you can trust.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/shop">
                                <Button className="flex items-center">
                                    Shop Now <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/offers">
                                <button className="px-6 py-3 rounded-2xl glass font-semibold hover:bg-white/50 transition-all border border-slate-200">
                                    View Offers
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
                        transition={{
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            },
                            scale: { duration: 0.8 }
                        }}
                        className="relative hidden md:block flex justify-center"
                    >
                        {/* 3D Model Image */}
                        <img
                            src="/hero-model.png"
                            alt="Fashion Model 3D"
                            className="w-full max-w-lg object-contain drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Truck size={40} />, title: 'Fast Delivery', desc: 'Get your products in record time.' },
                        { icon: <ShieldCheck size={40} />, title: 'Secure Payment', desc: '100% secure payment with QR Code.' },
                        { icon: <Zap size={40} />, title: 'Top Quality', desc: 'Only the best products for you.' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700"
                        >
                            <div className="mb-4 text-primary">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-slate-500">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12">Featured Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.filter(c => !c.parent).length > 0 ? categories.filter(c => !c.parent).map((cat, idx) => (
                        <Link to={`/shop?category=${cat._id}`} key={idx}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="h-40 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-xl text-slate-800 shadow-sm"
                            >
                                {cat.name}
                            </motion.div>
                        </Link>
                    )) : (
                        <p>Loading Categories...</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
