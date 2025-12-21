import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const HeroArc = () => {
    const { isDark } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(2); // Start centered

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 5);
        }, 3000); // Switch every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { src: '/portfolio/portfolio_xybershield_app_1766276389826.png', title: 'XyberShield App' },
        { src: '/portfolio/portfolio_nbdance_1766276075058.png', title: 'NB Dance' },
        { src: '/portfolio/portfolio_vanguard_1766276251484.png', title: 'Vanguard' },
        { src: '/portfolio/portfolio_marketplace_1766277433883.png', title: 'Marketplace' },
        { src: '/portfolio/portfolio_devilpool_1766276804758.png', title: 'Creative' },
    ];

    const getCardStyle = (index) => {
        const total = cards.length;
        // Circular difference calculation
        let diff = (index - activeIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const rotate = diff * 15;
        const z = 50 - Math.abs(diff) * 10;
        const scale = 1 - Math.abs(diff) * 0.1;
        const opacity = 1 - Math.abs(diff) * 0.1; // Reduced fading for visibility
        const y = Math.abs(diff) * 20; // Flatter arch

        return {
            transformOrigin: '50% 1200px',
            transform: mounted
                ? `rotate(${rotate}deg) translateY(${y}px) scale(${scale})`
                : `rotate(0deg) translateY(200px)`,
            zIndex: z,
            opacity: opacity
        };
    };

    return (
        <section className={`relative min-h-[90vh] flex flex-col items-center justify-start pt-32 overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>

            {/* Background accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="relative z-10 text-center max-w-5xl px-4 mb-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <Sparkles size={16} className="text-cyan-500" />
                    <span className="text-sm font-bold tracking-wide uppercase">Digital Excellence</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight animate-fade-in-up delay-100">
                    We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Digital</span> <br />
                    Empires
                </h1>

                <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Precision-engineered software for ambitious brands. <br />
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium">Built to scale. Built to flex.</span>
                </p>

                <div className="flex justify-center gap-4 animate-fade-in-up delay-300">
                    <Link to="/start-project" className="px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-black/20">
                        Start Project <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* ARC CONTAINER */}
            <div className="relative w-full max-w-[1400px] h-[500px] -mt-12 perspective-1000">
                {/* The Pivot Point is bottom-center */}
                <div className="absolute bottom-[-320px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] flex items-start justify-center">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className="absolute top-0 w-[240px] md:w-[320px] aspect-[4/3] rounded-2xl border-4 border-white dark:border-gray-800 shadow-2xl transition-all duration-700 ease-out origin-center hover:z-50 hover:scale-110 cursor-pointer group bg-gray-900 overflow-hidden"
                            style={getCardStyle(idx)}
                        >
                            <img src={card.src} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-bold text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{card.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative curved text or line */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent z-40"></div>
            </div>

        </section>
    );
};

export default HeroArc;
