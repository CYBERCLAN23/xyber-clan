import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Zap, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getLogo } from '../utils/festive';

import heroVideo from '../assets/hero-video.mp4';

// Local video file
const VIDEO_SRC = heroVideo;
const POSTER_SRC = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

const LiquidGlassHero = ({ lang = 'en', translations: t }) => {
    const { isDark } = useTheme();
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [showEndSequence, setShowEndSequence] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Slower playback speed
        video.playbackRate = 0.6;

        const onReady = () => setVideoReady(true);
        video.addEventListener('canplaythrough', onReady);
        if (video.readyState >= 4) setVideoReady(true);
        return () => video.removeEventListener('canplaythrough', onReady);
    }, []);

    const handleVideoEnd = () => {
        setVideoEnded(true);
        // Sequence: Video Ends -> Logo shows (Interstitial) -> Logo hides & Banner shows (Main State)
        setTimeout(() => setShowEndSequence(true), 500);

        // After 5s of logo, hide logo and show banner
        setTimeout(() => {
            setShowEndSequence(false);
            setShowBanner(true);
        }, 5500);
    };

    const [scrolledPast, setScrolledPast] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolledPast(true);
            } else {
                setScrolledPast(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

            {/* POSTER / STATIC BANNER */}
            {/* Shows initially, fades out when video plays, fades back in when sequence completes */}
            <div className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${videoReady && !showBanner ? 'opacity-0' : 'opacity-100'}`}>
                <img src={POSTER_SRC} alt="" className="w-full h-full object-cover" fetchpriority="high" />
            </div>

            {/* VIDEO */}
            {/* Plays once, fades out when ended */}
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${videoReady && !videoEnded ? 'opacity-100' : 'opacity-0'}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster={POSTER_SRC}
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                >
                    <source src={VIDEO_SRC} type="video/mp4" />
                </video>
            </div>

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

            {/* END SEQUENCE OVERLAY - Logo & Motto */}
            {/* Appears after video ends, disappears on Scroll */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-all duration-[1000ms] ${showEndSequence && !scrolledPast ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="bg-black/40 backdrop-blur-xl p-8 rounded-full mb-6 border border-white/10 shadow-2xl shadow-cyan-500/20">
                    <img src={getLogo()} alt="XyberClan Logo" className="w-32 h-32 sm:w-48 sm:h-48 object-contain animate-pulse" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white text-center tracking-tighter mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Xyber</span>Clan
                </h2>
                <p className="text-white/80 text-lg sm:text-xl font-light tracking-widest uppercase items-center flex gap-3">
                    <span className="w-8 h-px bg-white/30 hidden sm:block"></span>
                    {t?.footer?.tagline || 'Building Digital Dreams'}
                    <span className="w-8 h-px bg-white/30 hidden sm:block"></span>
                </p>
            </div>

            {/* CONTENT — Fades out slightly when end sequence shows to let logo take focus, but stays accessible */}
            <div className={`relative z-10 h-full flex flex-col px-5 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 pb-6 sm:pb-8 transition-opacity duration-1000 ${showEndSequence && !scrolledPast ? 'opacity-20 blur-sm' : 'opacity-100'}`}>

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
