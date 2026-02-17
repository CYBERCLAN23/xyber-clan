import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Zap, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Free stock video — abstract tech/digital particles
const VIDEO_SRC = 'https://cdn.pixabay.com/video/2020/07/30/45894-446787346_large.mp4';
const POSTER_SRC = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

const LiquidGlassHero = ({ lang = 'en', translations: t }) => {
    useTheme();
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onReady = () => setVideoReady(true);
        video.addEventListener('canplaythrough', onReady);
        if (video.readyState >= 4) setVideoReady(true);
        return () => video.removeEventListener('canplaythrough', onReady);
    }, []);

    const trustBadges = [
        { icon: <Zap size={12} />, label: t?.hero?.fastDelivery || 'Fast Delivery' },
        { icon: <MapPin size={12} />, label: t?.hero?.localExpertise || 'Local Expertise' },
        { icon: <DollarSign size={12} />, label: t?.hero?.fairPricing || 'Fair Pricing' },
        { icon: <TrendingUp size={12} />, label: t?.hero?.provenResults || 'Proven Results' },
    ];

    const stats = [
        { value: '50+', label: 'Projects' },
        { value: '99.9%', label: 'Uptime' },
        { value: '40+', label: 'Clients' },
    ];

    return (
        <section className="relative w-full h-[100dvh] overflow-hidden bg-black">

            {/* POSTER */}
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${videoReady ? 'opacity-0' : 'opacity-100'}`}>
                <img src={POSTER_SRC} alt="" className="w-full h-full object-cover" fetchpriority="high" />
            </div>

            {/* VIDEO */}
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${videoReady ? 'opacity-100' : 'opacity-0'}`}>
                <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster={POSTER_SRC} className="w-full h-full object-cover">
                    <source src={VIDEO_SRC} type="video/mp4" />
                </video>
            </div>

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

            {/* CONTENT — flex column, exact viewport fit */}
            <div className="relative z-10 h-full flex flex-col px-5 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 pb-6 sm:pb-8">

                {/* TOP: Headline area — grows to fill available space */}
                <div className="flex-1 flex flex-col justify-center min-h-0">
                    <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

                        {/* Agency pill */}
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] border border-white/15 bg-white/5 backdrop-blur-md text-white/70 mb-4 sm:mb-5"
                            style={{ animation: mounted ? 'heroFadeUp 0.6s ease-out 0.05s both' : 'none' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {lang === 'en' ? 'Digital Agency • Yaoundé' : 'Agence Digitale • Yaoundé'}
                        </span>

                        {/* Headline — compact sizes */}
                        <h1 className="text-white leading-[0.9] tracking-tighter">
                            <span
                                className="block text-[clamp(2.2rem,7vw,5.5rem)] font-black"
                                style={{ fontFamily: "'Inter', sans-serif", animation: mounted ? 'heroFadeUp 0.7s ease-out 0.1s both' : 'none' }}
                            >
                                {t?.hero?.titlePrefix || 'Your Trusted'}
                            </span>
                            <span
                                className="block text-[clamp(2.2rem,7vw,5.5rem)] font-black mt-1"
                                style={{ animation: mounted ? 'heroFadeUp 0.7s ease-out 0.2s both' : 'none' }}
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                    {lang === 'en' ? 'Digital' : 'Partenaire'}
                                </span>
                                {' '}
                                <span className="text-white/80 italic font-extralight">
                                    {lang === 'en' ? 'Partner' : 'Digital'}
                                </span>
                            </span>
                        </h1>

                        {/* Subtitle — tighter */}
                        <p
                            className="mt-3 sm:mt-4 text-white/50 text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, animation: mounted ? 'heroFadeUp 0.7s ease-out 0.3s both' : 'none' }}
                        >
                            {t?.hero?.subtitle || 'Professional digital solutions for ambitious businesses and individuals.'}
                        </p>

                        {/* CTAs — compact */}
                        <div
                            className="mt-4 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3"
                            style={{ animation: mounted ? 'heroFadeUp 0.7s ease-out 0.4s both' : 'none' }}
                        >
                            <Link
                                to="/start-project"
                                className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] transition-all duration-300"
                            >
                                {t?.hero?.startProject || 'Start Your Project'}
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <a
                                href="#services"
                                onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-all duration-300"
                            >
                                {t?.hero?.exploreServices || 'Explore Services'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* BOTTOM — Stats + Trust badges, fixed to bottom */}
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 flex-shrink-0"
                    style={{ animation: mounted ? 'heroFadeUp 0.7s ease-out 0.55s both' : 'none' }}
                >
                    {/* Glass Stats Card — compact */}
                    <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl backdrop-blur-2xl border bg-white/[0.06] border-white/[0.1]">
                        {stats.map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-none">{s.value}</p>
                                    <p className="text-[9px] sm:text-[10px] font-semibold text-white/35 uppercase tracking-wider mt-0.5">{s.label}</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {trustBadges.map((badge, i) => (
                            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border border-white/8 bg-white/[0.04] text-white/50">
                                {badge.icon}
                                {badge.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Scroll chevron — inside the hero, at absolute bottom center */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <ChevronDown size={18} className="text-white/20 animate-bounce" />
                </div>
            </div>

            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default LiquidGlassHero;
