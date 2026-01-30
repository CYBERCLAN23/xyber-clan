import React, { useState, useEffect } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LiquidGlassHero = () => {
    const { isDark } = useTheme();
    const [activeId, setActiveId] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = [
        {
            id: 0,
            category: "Cloud Infrastructure",
            title: "XyberCloud Nebulus",
            subtitle: "Enterprise Grid System",
            image: "/portfolio/portfolio_xybershield_app_1766276389826.png", // Portfolio Screenshot
            bg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Abstract Tech Network
            specs: [
                { label: "Uptime Guarantee", value: "99.999% SLA" },
                { label: "Encryption", value: "AES-256 GCM" }
            ]
        },
        {
            id: 1,
            category: "Mobile Solutions",
            title: "XyberApp Native",
            subtitle: "Cross-Platform Core",
            image: "/portfolio/portfolio_nbdance_1766276075058.png",
            bg: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop", // Mobile/Human Interaction
            specs: [
                { label: "Frame Rate", value: "120fps Native" },
                { label: "Codebase", value: "Single Source" }
            ]
        },
        {
            id: 2,
            category: "Cyber Defense",
            title: "Sentinel V2.0",
            subtitle: "AI Threat Detection",
            image: "/portfolio/portfolio_vanguard_1766276251484.png",
            bg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cybersecurity/Code
            specs: [
                { label: "Response Time", value: "< 20ms Latency" },
                { label: "Threat db", value: "Real-time Sync" }
            ]
        },
        {
            id: 3,
            category: "UI/UX Design",
            title: "Liquid Interface",
            subtitle: "Modern Design System",
            image: "/portfolio/portfolio_devilpool_1766276804758.png",
            bg: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop", // Abstract Fluid/Art
            specs: [
                { label: "Components", value: "500+ React Node" },
                { label: "Accessibility", value: "WCAG 2.1 AA" }
            ]
        }
    ];

    // Auto-Scroll Logic
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setActiveId((prev) => (prev + 1) % items.length);
            }, 5000); // 5 seconds per slide
        }
        return () => clearInterval(interval);
    }, [isPlaying, items.length]);

    const activeItem = items.find(i => i.id === activeId);

    return (
        <section className="relative w-full min-h-[100dvh] overflow-hidden bg-black flex flex-col justify-between">

            {/* 1. IMMERSIVE BACKGROUND LAYER */}
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeId === item.id ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Background Image - Professional/Abstract */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10s] ease-linear scale-105"
                        style={{ backgroundImage: `url(${item.bg})`, transform: activeId === item.id ? 'scale(1.1)' : 'scale(1.0)' }}
                    />

                    {/* Blur & Overlay Layer */}
                    <div className={`absolute inset-0 duration-1000 ${isDark
                            ? 'backdrop-blur-[2px] bg-black/40'
                            : 'backdrop-blur-md bg-white/10'
                        }`}></div>

                    {/* Vignette for focus */}
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40"></div>
                </div>
            ))}

            {/* 2. FLOATING UI LAYER */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-8 md:pt-32 md:pb-12 flex flex-col flex-1 pointer-events-none">

                {/* TOP PILL (Center) */}
                <div className="w-full flex justify-center pointer-events-auto mb-6 md:mb-12">
                    <div className={`flex items-center gap-1 p-1 rounded-full border backdrop-blur-xl shadow-lg transition-colors duration-500 ${isDark ? 'bg-black/40 border-white/10 text-gray-300' : 'bg-white/40 border-white/20 text-gray-800'
                        }`}>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                                }`}>
                            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                            {isPlaying ? 'Auto' : 'Paused'}
                        </button>
                    </div>
                </div>

                {/* MAIN GRID CONTENT */}
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start md:items-center flex-1">

                    {/* LEFT SIDEBAR: GLASS MENU */}
                    <div className={`md:col-span-4 pointer-events-auto transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
                        <div className={`rounded-3xl p-3 md:p-4 backdrop-blur-2xl border shadow-2xl transition-colors duration-500 ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/30 border-white/40'
                            }`}>

                            <div className="space-y-2 md:space-y-3">
                                <h3 className={`text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4 ml-4 opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    Our Expertise
                                </h3>
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => { setActiveId(item.id); setIsPlaying(false); }}
                                        className="group cursor-pointer"
                                    >
                                        {/* Label Title */}
                                        <div className={`px-4 py-2 md:py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${activeId === item.id
                                                ? 'bg-transparent'
                                                : (isDark ? 'hover:bg-white/5' : 'hover:bg-black/5')
                                            }`}>
                                            <span className={`text-xs md:text-sm font-bold tracking-wide transition-colors ${activeId === item.id
                                                    ? (isDark ? 'text-white' : 'text-black')
                                                    : (isDark ? 'text-gray-400' : 'text-gray-600')
                                                }`}>
                                                {item.category}
                                            </span>
                                            {/* Loading Bar for Active Item */}
                                            {activeId === item.id && isPlaying && (
                                                <div className="w-8 md:w-12 h-1 rounded-full bg-gray-700 overflow-hidden">
                                                    <div className={`h-full ${isDark ? 'bg-white' : 'bg-black'} animate-progress`}></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* EXPANDED PREVIEW FOR ACTIVE ITEM */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeId === item.id ? 'max-h-[180px] md:max-h-[220px] opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div className={`relative h-28 md:h-44 rounded-xl md:rounded-2xl overflow-hidden border shadow-inner ${isDark ? 'border-white/20' : 'border-white/50'
                                                }`}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 md:p-4">
                                                    <p className="text-white text-[10px] md:text-xs font-bold">{item.title}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* SPACER (Hidden on Mobile) */}
                    <div className="hidden md:block md:col-span-2"></div>

                    {/* RIGHT CARD: SPECS & TITLE */}
                    <div className={`md:col-span-6 flex justify-end pointer-events-auto pb-4 md:pb-0 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
                        <div className={`w-full max-w-md rounded-[24px] md:rounded-[32px] p-6 md:p-10 backdrop-blur-2xl border shadow-2xl transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/50'
                            }`}>

                            {/* Inner Glow - Reduced on mobile */}
                            <div className={`absolute -top-20 -right-20 w-40 h-40 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[80px] opacity-60 pointer-events-none ${isDark ? 'bg-purple-900/50' : 'bg-purple-300/50'
                                }`}></div>

                            {/* Content */}
                            <div className="relative z-10 text-left">
                                <h1 className={`text-3xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-2 md:mb-4 transition-all duration-500 ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {activeItem.title.split(' ')[0]} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                        {activeItem.title.split(' ').slice(1).join(' ')}
                                    </span>
                                </h1>

                                <p className={`text-sm md:text-lg font-medium mb-6 md:mb-8 leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700 '}`}>
                                    {activeItem.subtitle}
                                </p>

                                {/* Specs Grid - Compact */}
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                    {activeItem.specs.map((spec, i) => (
                                        <div key={i} className={`flex flex-col border-l-2 pl-3 ${isDark ? 'border-purple-500/50' : 'border-purple-500/30'}`}>
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-50 mb-0.5">
                                                {spec.label}
                                            </span>
                                            <span className="text-xs md:text-sm font-bold font-mono">
                                                {spec.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Main CTA */}
                                <button className={`w-full group flex items-center justify-between px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all shadow-lg hover:scale-[1.02] ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                                    }`}>
                                    <span className="text-sm md:text-base">Explore Project</span>
                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-black text-white' : 'bg-white text-black'
                                        }`}>
                                        <ArrowRight size={12} className="md:w-[14px] md:h-[14px]" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM LEFT INDICATOR */}
                <div className="hidden md:flex items-center gap-4 pointer-events-auto">
                    <div className="flex gap-1">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`h-1.5 rounded-full transition-all duration-500 ${activeId === item.id
                                        ? 'w-8 bg-cyan-500'
                                        : (isDark ? 'w-2 bg-white/20' : 'w-2 bg-black/20')
                                    }`}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 5s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default LiquidGlassHero;
