import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';
import { useCMS } from '../context/CMSContext';

const PageHero = ({
    lang = 'en',
    contentKeyPrefix, // e.g., "en.partnersPage.hero"
    badgeText,
    title,
    highlightedText,
    subtitle,
    imageSrc,
    stats = [],
    trustBadges = []
}) => {
    const [mounted, setMounted] = useState(false);
    const [scrolledPast, setScrolledPast] = useState(false);
    const { isEditing, getContent } = useCMS();

    // Resolve the current background from CMS or default
    const bgKey = contentKeyPrefix ? `${contentKeyPrefix}.bg` : null;
    const currentBg = bgKey ? getContent(bgKey, imageSrc) : imageSrc;

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolledPast(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToNext = (e) => {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <section className="relative w-full h-[100dvh] overflow-hidden bg-black">

            {/* BACKGROUND IMAGE — plain img, no hover edit overlay */}
            <div className="absolute inset-0">
                <img
                    src={currentBg}
                    alt=""
                    className="w-full h-full object-cover"
                    fetchpriority="high"
                />
            </div>

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 h-full flex flex-col px-5 sm:px-8 md:px-12 lg:px-16 pt-32 sm:pt-40 pb-6 sm:pb-8">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center min-h-0">
                    <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                        {/* Optional Badge */}
                        {badgeText && (
                            <span
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md text-cyan-400 mb-6"
                                style={{ animation: mounted ? 'pageHeroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' : 'none' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.badge`} fallback={badgeText} />
                                ) : badgeText}
                            </span>
                        )}

                        {/* Headline */}
                        <h1 className="text-white leading-[0.95] tracking-tighter max-w-5xl">
                            <span
                                className="block text-[clamp(2.5rem,8vw,6.5rem)] font-black"
                                style={{ fontFamily: "'Inter', sans-serif", animation: mounted ? 'pageHeroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' : 'none' }}
                            >
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.title`} fallback={title} />
                                ) : title}
                            </span>
                            {(highlightedText || (contentKeyPrefix && contentKeyPrefix.includes('events'))) && (
                                <span
                                    className="block text-[clamp(2.5rem,8vw,6.5rem)] font-black mt-2"
                                    style={{ animation: mounted ? 'pageHeroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' : 'none' }}
                                >
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                        {contentKeyPrefix ? (
                                            <EditableText contentKey={`${contentKeyPrefix}.highlight`} fallback={highlightedText} />
                                        ) : highlightedText}
                                    </span>
                                </span>
                            )}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p
                                className="mt-6 text-white/50 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, animation: mounted ? 'pageHeroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' : 'none' }}
                            >
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.subtitle`} fallback={subtitle} />
                                ) : subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* BOTTOM: Stats / Badges */}
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 flex-shrink-0 relative z-20"
                    style={{ animation: mounted ? 'pageHeroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' : 'none' }}
                >
                    {/* Stats Card */}
                    {stats.length > 0 && (
                        <div className="flex items-center gap-4 sm:gap-8 px-5 sm:px-8 py-4 sm:py-5 rounded-3xl backdrop-blur-2xl border bg-white/[0.03] border-white/[0.08] shadow-2xl">
                            {stats.map((s, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div className="w-px h-10 bg-white/10" />}
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                                            {contentKeyPrefix ? (
                                                <EditableText contentKey={`${contentKeyPrefix}.stats.${i}.value`} fallback={s.value} />
                                            ) : s.value}
                                        </p>
                                        <p className="text-[10px] sm:text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em] mt-1">
                                            {contentKeyPrefix ? (
                                                <EditableText contentKey={`${contentKeyPrefix}.stats.${i}.label`} fallback={s.label} />
                                            ) : s.label}
                                        </p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* Trust badges */}
                    {trustBadges.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 max-w-sm justify-start sm:justify-end">
                            {trustBadges.map((badge, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium border border-white/10 bg-white/[0.02] text-white/60 backdrop-blur-sm">
                                    {badge.icon}
                                    {contentKeyPrefix ? (
                                        <EditableText contentKey={`${contentKeyPrefix}.trust.${i}`} fallback={badge.label} />
                                    ) : badge.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scroll Indicator */}
                <button
                    onClick={scrollToNext}
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${scrolledPast ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-bounce'}`}
                >
                    <ArrowDown size={20} />
                </button>
            </div>

            {/* ═══ CMS HERO MEDIA GUIDE ═══ */}
            {isEditing && contentKeyPrefix && (
                <div className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2 flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 bg-gray-900/90 border border-white/10 backdrop-blur-xl rounded-2xl z-[100] pointer-events-auto shadow-2xl transition-all hover:border-cyan-500/30">
                    <h3 className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest text-center border-b border-white/10 pb-2 mb-1">
                        Hero Media
                    </h3>

                    {/* Background Image */}
                    <div className="flex flex-col gap-1.5 items-center">
                        <span className="text-[8px] sm:text-[9px] text-white/70 uppercase tracking-wider font-semibold">Background</span>
                        <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg shadow-inner bg-black/50 relative hover:ring-2 hover:ring-cyan-500 transition-all cursor-pointer">
                            <EditableImage
                                contentKey={`${contentKeyPrefix}.bg`}
                                src={imageSrc}
                                className="absolute inset-0 w-full h-full"
                                imageClassName="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pageHeroFadeUp {
                    0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
            `}</style>
        </section>
    );
};

export default PageHero;
