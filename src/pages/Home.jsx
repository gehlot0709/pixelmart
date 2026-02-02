
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

// Import category images
import menImg from '../assets/categories/men.png';
import womenImg from '../assets/categories/women.png';
import kidsImg from '../assets/categories/kids.png';
import accessoriesImg from '../assets/categories/accessories.png';

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
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/5">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
                            <Sparkles size={14} /> New Season Arrival
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
                            Style <span className="text-gradient italic">Infinite</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                            Step into the future of fashion. Discover curated collections crafted for those who define the trends.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link to="/shop">
                                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-premium flex items-center justify-center gap-3">
                                    Shop Collection <ArrowRight size={22} />
                                </button>
                            </Link>
                            <Link to="/offers">
                                <button className="w-full sm:w-auto px-8 py-4 glass dark:glass-dark rounded-2xl font-black text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-premium border border-slate-200 dark:border-slate-700">
                                    View Offers
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden md:block"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-premium" />
                            <img
                                src="/hero-model.png"
                                alt="Fashion Model"
                                className="relative w-full max-w-lg object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] animate-float"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    {[
                        { icon: <Truck size={32} />, title: 'Global Shipping', desc: 'Secure delivery to your doorstep.' },
                        { icon: <ShieldCheck size={32} />, title: 'Secured Payments', desc: 'Encrypted transactions for safety.' },
                        { icon: <Zap size={32} />, title: 'Premium Quality', desc: 'Expertly crafted with fine materials.' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-premium"
                        >
                            <div className="mb-6 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Exclusive Offers Section */}
            {offerProducts.length > 0 && (
                <section className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-secondary/20">
                                <Sparkles size={12} /> Seasonal Drop
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4">
                                Most Wanted <span className="text-gradient italic">Infinity</span>
                            </h2>
                        </div>
                        <Link to="/offers" className="w-full md:w-auto">
                            <button className="group w-full md:w-auto flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest text-primary hover:gap-6 transition-premium bg-primary/5 px-6 py-3 rounded-full border border-primary/10">
                                Explore All Offers <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {offerProducts.map((product, idx) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="py-12 bg-slate-900 rounded-[4rem] text-white overflow-hidden relative mx-4 md:mx-6">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/10 blur-[150px] -z-1" />
                <div className="absolute bottom-0 left-0 w-[40%] h-full bg-secondary/10 blur-[150px] -z-1" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <span className="text-primary font-black uppercase tracking-[0.5em] text-xs mb-4">The Collection</span>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                            Shop By <span className="text-primary italic">Vibe</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-14">
                        {categories.filter(c => !c.parent).length > 0 ? categories.filter(c => !c.parent).map((cat) => {
                            const categoryImages = {
                                "Men": menImg,
                                "Women": womenImg,
                                "Kids": kidsImg,
                                "Accessories": accessoriesImg
                            };

                            const catImg = categoryImages[cat.name];
                            if (!catImg) return null;

                            return (
                                <Link to={`/shop?category=${cat._id}`} key={cat._id} className="group flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className="relative w-36 h-36 md:w-56 md:h-56 rounded-full border-[6px] border-white/5 bg-slate-800 shadow-2xl overflow-hidden group-hover:border-primary/50 transition-premium"
                                    >
                                        <img
                                            src={catImg}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-premium duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-premium flex items-center justify-center">
                                            <span className="text-white font-black uppercase tracking-widest text-sm">View All</span>
                                        </div>
                                    </motion.div>
                                    <span className="mt-8 text-xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-premium">
                                        {cat.name}
                                    </span>
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
