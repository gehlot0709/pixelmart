
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/categories`);
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchOffers = async () => {
            setLoadingOffers(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/products?isOffer=true&limit=4`);
                setOfferProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
            setLoadingOffers(false);
        };

        fetchCategories();
        fetchOffers();
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

            {/* Exclusive Offers Section */}
            {offerProducts.length > 0 && (
                <section className="py-24 container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-4 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest flex items-center gap-2 ring-1 ring-secondary/20">
                                    <Sparkles size={12} /> Limited Time Deals
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800 dark:text-white">
                                Exclusive <span className="text-primary italic">Infinity</span> Offers
                            </h2>
                        </div>
                        <Link to="/offers">
                            <button className="group flex items-center gap-3 font-black text-sm uppercase tracking-widest text-primary hover:gap-5 transition-all">
                                Explore All Offers <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {offerProducts.map((product, idx) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex flex-col items-center mb-16">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">Discover</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-800 dark:text-white">
                            Featured <span className="text-primary italic">Collections</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                        {categories.filter(c => !c.parent).length > 0 ? categories.filter(c => !c.parent).map((cat) => {
                            const categoryImages = {
                                "Men": "/assets/categories/men.png",
                                "Women": "/assets/categories/women.png",
                                "Kids": "/assets/categories/kids.png",
                                "Accessories": "/assets/categories/accessories.png"
                            };

                            const catImg = categoryImages[cat.name];
                            if (!catImg) return null;

                            return (
                                <Link to={`/shop?category=${cat._id}`} key={cat._id} className="group">
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            whileHover={{ y: -10 }}
                                            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center p-6 mb-8 group-hover:border-primary/30 transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Subtle Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <img
                                                src={catImg}
                                                alt={cat.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </motion.div>

                                        <div className="flex flex-col items-center">
                                            <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                                                {cat.name}
                                            </span>
                                            <div className="mt-2 w-0 group-hover:w-8 h-1 bg-primary transition-all duration-500 rounded-full" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="w-full py-20 flex justify-center animate-pulse">
                                <p className="text-slate-400 font-bold tracking-widest uppercase italic">Preparing Collections...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
