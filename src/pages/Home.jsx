
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

    // 1. Static Entrance (Hero Text)
    useGSAP(() => {
        const heroElements = container.current.querySelectorAll(".hero-text");
        if (heroElements.length === 0) return;

        gsap.set(heroElements, { autoAlpha: 0 });
        gsap.fromTo(heroElements,
            {
                y: 100,
                autoAlpha: 0,
                skewY: 7,
                scale: 0.9
            },
            {
                y: 0,
                autoAlpha: 1,
                skewY: 0,
                scale: 1,
                duration: 1.5,
                stagger: 0.15,
                ease: "expo.out",
                delay: 0.5
            }
        );
    }, { scope: container });

    // 2. Category Reveal (Dynamic)
    useGSAP(() => {
        if (categories.length === 0) return;

        const categoryCards = container.current.querySelectorAll(".category-card");
        if (categoryCards.length === 0) return;

        gsap.set(categoryCards, { autoAlpha: 0 });
        gsap.fromTo(categoryCards,
            {
                scale: 0.5,
                autoAlpha: 0,
                rotationX: -45,
                y: 50
            },
            {
                scale: 1,
                autoAlpha: 1,
                rotationX: 0,
                y: 0,
                duration: 1.2,
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

        gsap.fromTo(offerTargets,
            {
                y: 50,
                autoAlpha: 0
            },
            {
                scrollTrigger: {
                    trigger: ".offers-reveal",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                autoAlpha: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
                onComplete: () => ScrollTrigger.refresh()
            }
        );
    }, { scope: container, dependencies: [offerProducts] });

    return (
        <div className="space-y-12 pb-12 overflow-hidden" ref={container}>
            {/* Categories Hero Section */}
            <section className="py-16 bg-[#0a0f1d] rounded-[3rem] text-white overflow-hidden relative mx-4 md:mx-6 shadow-2xl shadow-indigo-500/10">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/10 blur-[150px] -z-1" />
                <div className="absolute bottom-0 left-0 w-[40%] h-full bg-secondary/10 blur-[150px] -z-1" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="hero-text text-primary font-black uppercase tracking-[0.5em] text-xs mb-6">The Collection</span>
                        <h2 className="hero-text text-5xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                            Shop By <span className="text-primary italic">Vibe</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-6 md:gap-16 px-4 md:px-0">
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
                                <Link to={`/shop?category=${cat._id}`} key={cat._id} className="category-card group flex flex-col items-center">
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full border-[4px] md:border-[6px] border-white bg-white shadow-2xl overflow-hidden group-hover:border-primary transition-premium">
                                        <img
                                            src={catImg}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-premium duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-premium flex items-center justify-center">
                                            <span className="text-white font-black uppercase tracking-widest text-[10px] md:text-sm">Explore</span>
                                        </div>
                                    </div>
                                    <span className="mt-4 md:mt-8 text-lg md:text-4xl font-black tracking-tight group-hover:text-primary transition-premium text-center">
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        }) : (
                            <div className="w-full py-20 flex justify-center animate-pulse">
                                <p className="text-slate-400 font-bold tracking-widest uppercase italic">Loading Collections...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Exclusive Offers Section (Main Content) */}
            {offerProducts.length > 0 && (
                <section className="offers-reveal container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-secondary/20">
                                <Sparkles size={12} /> Special Selection
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4">
                                Exclusive <span className="text-gradient italic">Offers</span>
                            </h2>
                        </div>
                        <Link to="/offers" className="w-full md:w-auto">
                            <button className="group w-full md:w-auto flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest text-primary hover:gap-6 transition-premium bg-primary/5 px-6 py-3 rounded-full border border-primary/10">
                                Explore All Offers <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {offerProducts.map((product, idx) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};


export default Home;
