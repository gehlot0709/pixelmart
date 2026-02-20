
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

// GSAP
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Import category images
import menImg from '../assets/categories/men.png';
import womenImg from '../assets/categories/women.png';
import kidsImg from '../assets/categories/kids.png';
import accessoriesImg from '../assets/categories/accessories.png';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const container = useRef();

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


    // 2. Category Reveal (Dynamic)
    useGSAP(() => {
        if (categories.length === 0) return;

        const categoryCards = container.current.querySelectorAll(".category-card");
        if (categoryCards.length === 0) return;

        const isMobile = window.innerWidth < 768;

        gsap.set(categoryCards, { autoAlpha: 0 });
        gsap.fromTo(categoryCards,
            {
                scale: isMobile ? 0.8 : 0.5,
                autoAlpha: 0,
                rotationX: isMobile ? 0 : -45,
                y: 50
            },
            {
                scale: 1,
                autoAlpha: 1,
                rotationX: 0,
                y: 0,
                duration: isMobile ? 0.8 : 1.2,
                stagger: 0.1,
                ease: "back.out(1.2)",
                onComplete: () => ScrollTrigger.refresh()
            }
        );
    }, { scope: container, dependencies: [categories] });

    // 3. Offers Reveal (Dynamic Scroll)
    useGSAP(() => {
        if (offerProducts.length === 0) return;

        const offerTargets = container.current.querySelectorAll(".offers-reveal > *");
        if (offerTargets.length === 0) return;

        const isMobile = window.innerWidth < 768;

        gsap.fromTo(offerTargets,
            {
                y: 50,
                autoAlpha: 0
            },
            {
                scrollTrigger: {
                    trigger: ".offers-reveal",
                    start: isMobile ? "top 95%" : "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                autoAlpha: 1,
                duration: isMobile ? 0.6 : 1,
                stagger: 0.1,
                ease: "power4.out",
                onComplete: () => ScrollTrigger.refresh()
            }
        );
    }, { scope: container, dependencies: [offerProducts] });

    return (
        <div className="bg-white min-h-screen" ref={container}>

            {/* Categories Section - Clean & Modern */}
            <section className="py-12 md:py-24 px-4 md:px-8 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Categories</span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
                            Shop by <span className="text-slate-700">Style</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-16">
                        {categories.filter(c => !c.parent).map((cat) => {
                            const categoryImages = {
                                "Men": menImg,
                                "Women": womenImg,
                                "Kids": kidsImg,
                                "Accessories": accessoriesImg
                            };
                            const catImg = categoryImages[cat.name];
                            if (!catImg) return null;

                            return (
                                <Link to={`/shop?category=${cat._id}`} key={cat._id} className="category-card group flex flex-col items-center">
                                    <div className="relative aspect-square w-full rounded-full border border-slate-100 p-2 md:p-4 bg-slate-50 shadow-sm group-hover:border-primary group-hover:shadow-xl transition-all duration-500 overflow-hidden">
                                        <div className="w-full h-full rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                            <img
                                                src={catImg}
                                                alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-100">
                                                <ArrowRight size={16} className="text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="mt-6 text-base md:text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex justify-center">
                        <Link to="/shop">
                            <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 flex items-center gap-3 group">
                                Explore All Products <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Section - 2 columns on mobile */}
            {offerProducts.length > 0 && (
                <section className="offers-reveal py-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-secondary/10">
                                <Sparkles size={12} /> Seasonal Drop
                            </div>
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-slate-900 mb-6">
                                Featured <span className="italic font-light text-slate-700">Offers</span>
                            </h2>
                            <p className="text-slate-900 font-medium md:text-lg">
                                Don't miss out on our limited-time deals on these premium selected items.
                            </p>
                        </div>
                        <Link to="/offers" className="w-full md:w-auto">
                            <button className="group w-full md:w-auto flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest text-slate-900 transition-all border-b-2 border-slate-900 pb-2 hover:text-primary hover:border-primary">
                                Browse All Offers <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
                        {offerProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link to="/shop">
                            <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-3">
                                Explore All Products <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                </section>
            )}

        </div>
    );
};


export default Home;
