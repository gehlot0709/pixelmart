import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = () => {
    const preloaderRef = useRef();
    const logoRef = useRef();
    const textRef = useRef();
    const cubeRef = useRef();

    useEffect(() => {
        const tl = gsap.timeline();

        // Initial set
        gsap.set([logoRef.current, textRef.current], { opacity: 0, y: 20 });

        // 3D Cube Animation
        gsap.to(cubeRef.current, {
            rotationY: 360,
            rotationX: 360,
            duration: 3,
            repeat: -1,
            ease: "none"
        });

        // Entrance
        tl.to(logoRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out"
        })
            .to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");

        return () => {
            tl.kill();
        };
    }, []);

    const fadeOut = () => {
        gsap.to(preloaderRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                preloaderRef.current.style.display = 'none';
            }
        });
    };

    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-[9999] bg-[#0a0f1d] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full opacity-50" />

            <div className="relative flex flex-col items-center">
                {/* 3D-like High-Fidelity Loader */}
                <div
                    ref={cubeRef}
                    className="w-24 h-24 mb-16 relative"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                    {/* Outer Neon Frame */}
                    <div className="absolute inset-0 border-[3px] border-primary/40 rounded-2xl shadow-[0_0_80px_rgba(99,102,241,0.4)] backdrop-blur-[2px]"
                        style={{ transform: 'translateZ(20px)' }} />

                    {/* Inner Rotating Glass */}
                    <div className="absolute inset-4 border-[2px] border-secondary/30 bg-secondary/10 rounded-xl rotate-45 shadow-[inset_0_0_20px_rgba(244,63,94,0.2)]"
                        style={{ transform: 'translateZ(-20px)' }} />

                    {/* Core Light */}
                    <div className="absolute inset-8 bg-white/20 rounded-full blur-md animate-pulse" />
                    <div className="absolute inset-[34%] bg-white rounded-full shadow-[0_0_30px_#fff]" />
                </div>

                <div className="text-center">
                    <h1
                        ref={logoRef}
                        className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2"
                    >
                        PixelMart<span className="text-primary">.</span>
                    </h1>
                    <p
                        ref={textRef}
                        className="text-[10px] uppercase font-black tracking-[0.5em] text-slate-500"
                    >
                        Curating Aesthetics
                    </p>
                </div>
            </div>

            {/* Progress Bar Mockup */}
            <div className="absolute bottom-12 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary animate-loading-progress" />
            </div>

            <style>{`
                @keyframes loading-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-progress {
                    animation: loading-progress 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default Preloader;
