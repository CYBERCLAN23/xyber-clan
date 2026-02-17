import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Zap, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Free stock video — abstract tech/digital particles, fits XyberClan brand
const VIDEO_SRC = 'https://cdn.pixabay.com/video/2020/07/30/45894-446787346_large.mp4';
// Poster fallback while video loads
const POSTER_SRC = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

const LiquidGlassHero = ({ lang = 'en', translations: t }) => {
    useTheme(); // maintain context connection
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Stagger entrance animations
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Smooth crossfade from poster to video when video can play
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onReady = () => setVideoReady(true);
        video.addEventListener('canplaythrough', onReady);

        // Fallback: if already ready
        if (video.readyState >= 4) setVideoReady(true);

        return () => video.removeEventListener('canplaythrough', onReady);
    }, []);

    const trustBadges = [
        { icon: <Zap size={14} />, label: t?.hero?.fastDelivery || 'Fast Delivery' },
        { icon: <MapPin size={14} />, label: t?.hero?.localExpertise || 'Local Expertise' },
        { icon: <DollarSign size={14} />, label: t?.hero?.fairPricing || 'Fair Pricing' },
        { icon: <TrendingUp size={14} />, label: t?.hero?.provenResults || 'Proven Results' },
    ];

    // Services we showcase in the glass card
    const serviceHighlights = [
        { label: 'Web & App Dev', value: '50+', sublabel: 'Projects' },
        { label: 'Cybersecurity', value: '99.9%', sublabel: 'Uptime' },
        { label: 'Satisfied Clients', value: '40+', sublabel: 'Across Cameroon' },
    ];

    return (
        <section className="relative w-full min-h-[100dvh] overflow-hidden bg-black">

            {/* ─── POSTER IMAGE (visible until video loads) ─── */}
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${videoReady ? 'opacity-0' : 'opacity-100'}`}>
                <img
                    src={POSTER_SRC}
                    alt=""
                    className="w-full h-full object-cover"
                    fetchpriority="high"
                />
            </div>

            {/* ─── VIDEO BACKGROUND ─── */}
            <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${videoReady ? 'opacity-100' : 'opacity-0'}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={POSTER_SRC}
                    className="w-full h-full object-cover"
                >
                    <source src={VIDEO_SRC} type="video/mp4" />
                </video>
            </div>

            {/* ─── OVERLAY ─── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            {/* ─── CONTENT LAYER ─── */}
            <div className="relative z-10 w-full min-h-[100dvh] flex flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-28 md:pt-32 pb-8 md:pb-12">

                {/* ─── MAIN TYPOGRAPHY: Momento-style big bold text ─── */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className={`transition-all duration-1000 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                        {/* Tagline Pill */}
                        <div className="mb-6 md:mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] md:text-xs font-semibold uppercase tracking-widest border border-white/20 bg-white/5 backdrop-blur-md text-white/80">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {lang === 'en' ? 'Digital Agency • Yaoundé, Cameroon' : 'Agence Digitale • Yaoundé, Cameroun'}
                            </span>
                        </div>

                        {/* Hero Headline — HUGE, editorial style */}
                        <h1 className="text-white leading-[0.92] tracking-tight">
                            <span
                                className="block text-[clamp(2.8rem,8vw,7rem)] font-black"
                                style={{ transitionDelay: '0.15s', animation: mounted ? 'heroFadeUp 0.8s ease-out 0.1s both' : 'none' }}
                            >
                                {t?.hero?.titlePrefix || 'Your Trusted'}
                            </span>
                            <span
                                className="block text-[clamp(2.8rem,8vw,7rem)] font-black"
                                style={{ animation: mounted ? 'heroFadeUp 0.8s ease-out 0.25s both' : 'none' }}
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                    {lang === 'en' ? 'Digital' : 'Partenaire'}
                                </span>
                                {' '}
                                <span className="text-white/90 italic font-light">
                                    {lang === 'en' ? 'Partner' : 'Digital'}
                                </span>
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="mt-5 md:mt-7 text-white/60 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-light"
                            style={{ animation: mounted ? 'heroFadeUp 0.8s ease-out 0.4s both' : 'none' }}
                        >
                            {t?.hero?.subtitle || 'Professional digital solutions for ambitious businesses and individuals.'}
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="mt-7 md:mt-10 flex flex-wrap gap-3 md:gap-4"
                            style={{ animation: mounted ? 'heroFadeUp 0.8s ease-out 0.55s both' : 'none' }}
                        >
                            <Link
                                to="/start-project"
                                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm md:text-base font-semibold shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] transition-all duration-300"
                            >
                                {t?.hero?.startProject || 'Start Your Project'}
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="#services"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white text-sm md:text-base font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                            >
                                {t?.hero?.exploreServices || 'Explore Services'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* ─── BOTTOM ROW: Glass card + Trust badges ─── */}
                <div
                    className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 lg:gap-8"
                    style={{ animation: mounted ? 'heroFadeUp 0.8s ease-out 0.7s both' : 'none' }}
                >

                    {/* SINGLE GLASS CARD — Stat highlights */}
                    <div className="w-full max-w-md rounded-2xl md:rounded-3xl p-5 md:p-7 backdrop-blur-2xl border shadow-2xl bg-white/[0.07] border-white/[0.12]">

                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-4 md:mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/50">
                                    {lang === 'en' ? 'Our Impact' : 'Notre Impact'}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-white/30">2024—2025</span>
                        </div>

                        {/* Stat Row */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {serviceHighlights.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] md:text-[11px] font-semibold text-white/40 uppercase tracking-wider mt-0.5">
                                        {stat.sublabel}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 my-4" />

                        {/* Footer text */}
                        <p className="text-[11px] md:text-xs text-white/40 leading-relaxed">
                            {lang === 'en'
                                ? 'Delivering enterprise-grade web, mobile, design, and cybersecurity solutions from Yaoundé.'
                                : 'Fournissant des solutions web, mobile, design et cybersécurité de niveau entreprise depuis Yaoundé.'
                            }
                        </p>
                    </div>

                    {/* Trust Badges — right side, bottom */}
                    <div className="flex flex-wrap gap-2 md:gap-3 lg:justify-end">
                        {trustBadges.map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-medium border border-white/10 bg-white/5 backdrop-blur-md text-white/60"
                            >
                                {badge.icon}
                                {badge.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <ChevronDown size={20} className="text-white/30 animate-bounce" />
                </div>
            </div>

            {/* ─── ANIMATIONS ─── */}
            <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </section>
    );
};

export default LiquidGlassHero;
