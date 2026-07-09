import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCMS } from '../context/CMSContext';
import EditableText from './cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const partners = [
    {
        name: 'Hult Prize',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hult_Prize_Logo.png/320px-Hult_Prize_Logo.png',
        url: 'https://www.hultprize.org',
    },
    {
        name: 'GEHMIT',
        logo: 'https://ui-avatars.com/api/?name=GEHMIT&background=059669&color=fff&size=128&bold=true&font-size=0.38',
        url: 'https://gehmit.org',
    },
    {
        name: 'Divlab',
        logo: 'https://ui-avatars.com/api/?name=DL&background=6366f1&color=fff&size=128&bold=true&font-size=0.45',
        url: 'https://divlabs-tech.com',
    },
    {
        name: 'UY1',
        logo: 'https://ui-avatars.com/api/?name=UY1&background=007a5e&color=fff&size=128&bold=true&font-size=0.45',
        url: 'https://www.univ-yaounde1.cm',
    },
];

const TrustBadges = () => {
    const { isDark } = useTheme();
    const { language: lang } = useLanguage();
    const { isEditing, getContent } = useCMS();
    const [mounted, setMounted] = useState(false);

    const transitionText = getContent(`${lang}.trust.transitionText`, lang === 'en' ? 'Trusted by industry leaders and innovators worldwide' : "Reconnu par les leaders de l'industrie et les innovateurs du monde entier");
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const marqueeRef = useRef(null);
    const statsRef = useRef([]);
    const transTextRef = useRef(null);
    const transTitleRef = useRef(null);

    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#a0a0a0' : '#666';
    const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
    const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const allPartners = [...partners, ...partners];

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(timer);
    }, []);

    // ─── Entrance animation ────────────────────────────────────────────────────
    useEffect(() => {
        if (!mounted) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(labelRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.3
        );
        tl.fromTo(marqueeRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1 },
            0.5
        );
        tl.fromTo(statsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
            0.8
        );
        return () => tl.kill();
    }, [mounted]);

    // ─── Scroll → Mountain zoom closer + clouds appear ────────────────────────
    useEffect(() => {
        if (!mounted) return;

        const zoomTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
            onUpdate: (self) => {
                const p = self.progress;

                const textFade = Math.max(0, 1 - p * 3);
                if (labelRef.current) gsap.set(labelRef.current, { opacity: textFade, y: -p * 40 });
                if (marqueeRef.current) gsap.set(marqueeRef.current, { opacity: textFade * 0.9, y: -p * 60 });
                if (statsRef.current) gsap.set(statsRef.current, { opacity: textFade * 0.8, y: -p * 80 });

                if (transTextRef.current) {
                    let transOpacity = 0;
                    if (p > 0.1 && p < 0.2) transOpacity = (p - 0.1) / 0.1;
                    else if (p >= 0.2 && p <= 0.75) transOpacity = 1;
                    else if (p > 0.75) transOpacity = Math.max(0, 1 - (p - 0.75) / 0.25);

                    gsap.set(transTextRef.current, {
                        opacity: transOpacity,
                        y: 120 - p * 350,
                        scale: 0.95 + p * 0.05,
                    });
                }
            },
        });

        const textTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: '15% top',
                end: '40% top',
                scrub: 1.2,
            },
        });

        if (transTitleRef.current) {
            const chars = transTitleRef.current.querySelectorAll('[data-char]');
            textTl.fromTo(
                chars,
                { opacity: 0, filter: 'blur(8px)', y: 15 },
                { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, ease: 'power2.out' }
            );
        }

        return () => {
            zoomTrigger.kill();
            textTl.kill();
        };
    }, [mounted, lang, transitionText]);

    const bgRgb = isDark ? '10,10,10' : '245,244,242';

    return (
        <section
            ref={sectionRef}
            className="relative w-full"
            style={{ minHeight: '150svh', fontFamily: FONT }}
        >
            {/* ─── Main Content Wrapper ─── */}
            <div className="absolute top-0 left-0 w-full">

                {/* ─── Trust Phase (100vh) ─── */}
                <div className="flex flex-col justify-center h-screen px-8 md:px-14 lg:px-20 relative z-10">
                    <div className="max-w-7xl mx-auto w-full">
                        <p
                            ref={labelRef}
                            className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase mb-12 md:mb-16"
                            style={{ color: muted, opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.trust.title`} tag="span" fallback="Trusted by" />
                        </p>

                        <div ref={marqueeRef} className="relative" style={{ opacity: 0 }}>
                            <div
                                className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
                                style={{ background: `linear-gradient(to right, rgba(${bgRgb},1), transparent)` }}
                            />
                            <div
                                className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
                                style={{ background: `linear-gradient(to left, rgba(${bgRgb},1), transparent)` }}
                            />

                            <div className="flex animate-trust-marquee">
                                {allPartners.map((partner, index) => {
                                    const originalIdx = index % partners.length;
                                    return (
                                        <div key={index} className="flex-shrink-0 mx-3 md:mx-4">
                                            <a
                                                href={partner.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center rounded-[20px] px-10 md:px-14 py-6 md:py-8 min-w-[200px] md:min-w-[240px] transition-all duration-300 hover:scale-[1.05] hover:shadow-lg cursor-pointer"
                                                style={{
                                                    backgroundColor: cardBg,
                                                    border: `1px solid ${cardBorder}`,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden flex items-center justify-center mb-3" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}>
                                                    <img
                                                        src={partner.logo}
                                                        alt={partner.name}
                                                        className="w-full h-full object-contain p-1.5"
                                                        onError={e => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden w-full h-full items-center justify-center text-lg font-black" style={{ color: text }}>
                                                        {partner.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-[12px] md:text-[13px] font-semibold text-center tracking-wide"
                                                    style={{ color: muted }}
                                                >
                                                    {partner.name}
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-10 md:gap-14 mt-14 md:mt-20 max-w-[700px] mx-auto">
                            {[
                                { valueKey: `${lang}.trust.stat1.value`, labelKey: `${lang}.trust.stat1.label`, value: '100%', label: 'Client Satisfaction' },
                                { valueKey: `${lang}.trust.stat2.value`, labelKey: `${lang}.trust.stat2.label`, value: '24/7', label: 'Support Available' },
                                { valueKey: `${lang}.trust.stat3.value`, labelKey: `${lang}.trust.stat3.label`, value: 'Fast', label: 'Delivery Time' },
                            ].map((stat, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && (
                                        <div className="w-px h-14 self-center" style={{ backgroundColor: divider }} />
                                    )}
                                    <div
                                        ref={el => statsRef.current[i] = el}
                                        className="text-center"
                                        style={{ opacity: 0 }}
                                    >
                                        <div
                                            className="text-3xl md:text-4xl font-black tracking-tight"
                                            style={{ color: text }}
                                        >
                                            <EditableText contentKey={stat.valueKey} tag="span" fallback={stat.value} />
                                        </div>
                                        <div
                                            className="text-[11px] md:text-xs font-medium mt-2 tracking-wide"
                                            style={{ color: muted }}
                                        >
                                            <EditableText contentKey={stat.labelKey} tag="span" fallback={stat.label} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Transition Phase (100vh) ─── */}
                <div className="flex flex-col justify-center items-center h-[100svh] px-8 sm:px-14 lg:px-20 relative z-20 text-center pointer-events-none">
                    <div ref={transTextRef} className="flex flex-col items-center max-w-5xl mx-auto drop-shadow-xl" style={{ textShadow: isDark ? '0 4px 24px rgba(0,0,0,0.8)' : '0 4px 24px rgba(255,255,255,0.8)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mb-6 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold mb-6" style={{ color: muted }}>
                            <EditableText contentKey={`${lang}.trust.network`} fallback="Our Network" />
                        </p>
                        <h2
                            ref={transTitleRef}
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1]"
                            style={{
                                color: text,
                                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                                wordBreak: 'normal',
                                overflowWrap: 'normal',
                            }}
                        >
                            {isEditing ? (
                                <EditableText contentKey={`${lang}.trust.transitionText`} fallback="Trusted by industry leaders and innovators worldwide" />
                            ) : (
                                transitionText.split(' ').map((word, wi, arr) => (
                                    <React.Fragment key={`w${wi}`}>
                                        <span style={{ display: 'inline', whiteSpace: 'nowrap' }}>
                                            {word.split('').map((char, ci) => (
                                                <span key={`c${wi}-${ci}`} data-char style={{ display: 'inline-block', opacity: 0, filter: 'blur(8px)', transform: 'translateY(15px)' }}>{char}</span>
                                            ))}
                                        </span>
                                        {wi < arr.length - 1 && ' '}
                                    </React.Fragment>
                                ))
                            )}
                        </h2>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes trustMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-trust-marquee {
                    animation: trustMarquee 35s linear infinite;
                }
                .animate-trust-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default TrustBadges;
