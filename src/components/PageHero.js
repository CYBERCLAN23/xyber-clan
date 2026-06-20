import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import mountainBg from '../assets/hero-mountain.png';
import EditableText from './cms/EditableText';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const PageHero = ({
    lang = 'en',
    contentKeyPrefix,
    badgeText,
    title,
    subtitle,
    imageSrc,
    stats = [],
    trustBadges = [],
    transitionLabel = 'About',
    transitionText = 'Building the future of digital innovation across Africa',
    heroBg
}) => {
    const { isDark } = useTheme();
    const [mounted, setMounted] = useState(false);
    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const cloudTopRef = useRef(null);
    const cloudBottomRef = useRef(null);
    const cloudLeftRef = useRef(null);
    const badgeRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const subtitleRef = useRef(null);
    const statsRef = useRef(null);
    const transTextRef = useRef(null);
    const transTitleRef = useRef(null);

    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#a0a0a0' : '#666';
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(timer);
    }, []);

    // ─── Entrance animation ────────────────────────────────────────────────────
    useEffect(() => {
        if (!mounted) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(imgRef.current,
            { opacity: 0, scale: 1.04 },
            { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
            0
        );
        if (badgeRef.current) {
            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.6 },
                0.3
            );
        }
        tl.fromTo([line1Ref.current, line2Ref.current].filter(Boolean),
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
            0.35
        );
        if (subtitleRef.current) {
            tl.fromTo(subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8 },
                0.7
            );
        }
        if (statsRef.current) {
            tl.fromTo(statsRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7 },
                0.9
            );
        }
        return () => tl.kill();
    }, [mounted]);

    // ─── Scroll → Mountain zoom + clouds + content parallax ───────────────────
    useEffect(() => {
        if (!mounted) return;

        const zoomTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
            onUpdate: (self) => {
                const p = self.progress;

                if (imgRef.current) {
                    gsap.set(imgRef.current, {
                        scale: 1 + p * 0.5,
                        filter: `brightness(${1.05 - p * 0.1}) contrast(${0.88 + p * 0.12})`,
                    });
                }

                if (cloudTopRef.current) gsap.set(cloudTopRef.current, { opacity: p * 0.9 });
                if (cloudBottomRef.current) gsap.set(cloudBottomRef.current, { opacity: Math.min(1, p * 1.5) });
                if (cloudLeftRef.current) gsap.set(cloudLeftRef.current, { opacity: p * 0.75 });

                const textFade = Math.max(0, 1 - p * 3);
                if (badgeRef.current) gsap.set(badgeRef.current, { opacity: textFade, y: -p * 40 });
                
                const lines = [line1Ref.current, line2Ref.current].filter(Boolean);
                if (lines.length) gsap.set(lines, { opacity: textFade, y: -p * 60 });
                
                if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: textFade * 0.8, y: -p * 50 });
                if (statsRef.current) gsap.set(statsRef.current, { opacity: textFade * 0.8, y: -p * 40 });

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
    }, [mounted]);

    // ─── Mouse parallax ───────────────────────────────────────────────────────
    useEffect(() => {
        const handleMove = (e) => {
            const xPct = (e.clientX / window.innerWidth - 0.5) * 14;
            const yPct = (e.clientY / window.innerHeight - 0.5) * 7;
            gsap.to(imgRef.current, { x: xPct, y: yPct, duration: 1.8, ease: 'power1.out' });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const bgRgb = isDark ? '10,10,10' : '245,244,242';

    return (
        <section
            ref={sectionRef}
            className="relative w-full"
            style={{ minHeight: '200svh', fontFamily: FONT }}
        >
            {/* ─── Mountain Background (Fixed) ─── */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <img
                    ref={imgRef}
                    src={heroBg || mountainBg}
                    alt=""
                    aria-hidden="true"
                    className="absolute w-full h-full object-cover object-center"
                    style={{
                        opacity: 0,
                        filter: 'brightness(1.05) contrast(0.88)',
                        mixBlendMode: isDark ? 'lighten' : 'multiply',
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '45%', background: `linear-gradient(to right, rgba(${bgRgb},1) 0%, rgba(${bgRgb},0.4) 60%, transparent 100%)` }}
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                    style={{ background: `linear-gradient(to top, rgba(${bgRgb},1) 0%, transparent 100%)` }}
                />
                <div
                    className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                    style={{ background: `linear-gradient(to bottom, rgba(${bgRgb},1) 0%, transparent 100%)` }}
                />
                <div
                    ref={cloudTopRef}
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{ opacity: 0, height: '55%', background: `linear-gradient(to bottom, rgba(${bgRgb},0.98) 0%, rgba(${bgRgb},0.7) 40%, transparent 100%)` }}
                />
                <div
                    ref={cloudBottomRef}
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{ opacity: 0, height: '60%', background: `linear-gradient(to top, rgba(${bgRgb},1) 0%, rgba(${bgRgb},0.85) 35%, rgba(${bgRgb},0.3) 70%, transparent 100%)` }}
                />
                <div
                    ref={cloudLeftRef}
                    className="absolute top-0 bottom-0 left-0 pointer-events-none"
                    style={{ opacity: 0, width: '40%', background: `linear-gradient(to right, rgba(${bgRgb},0.95) 0%, rgba(${bgRgb},0.5) 60%, transparent 100%)` }}
                />
            </div>

            {/* ─── Main Content Wrapper ─── */}
            <div className="absolute top-0 left-0 w-full">
                {/* ─── Hero Phase (100vh) ─── */}
                <div className="flex flex-col justify-between h-screen px-8 md:px-14 lg:px-20 pt-32 sm:pt-36 pb-12 relative z-10">
                    <div className="flex-1 flex flex-col justify-center">
                        {badgeText && (
                            <p
                                ref={badgeRef}
                                className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6 sm:mb-8"
                                style={{ color: '#06b6d4', opacity: 0 }}
                            >
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.badge`} fallback={badgeText} />
                                ) : badgeText}
                            </p>
                        )}

                        <h1
                            className="leading-[0.9] tracking-[-0.03em] select-none"
                            style={{
                                color: text,
                                fontWeight: 900,
                                fontSize: 'clamp(2.8rem, 10vw, 10rem)',
                            }}
                        >
                            <span ref={line1Ref} className="block" style={{ opacity: 0 }}>
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.title`} fallback={title} />
                                ) : title}
                            </span>
                        </h1>

                        {subtitle && (
                            <p
                                ref={subtitleRef}
                                className="mt-6 sm:mt-8 text-sm sm:text-base leading-relaxed max-w-md"
                                style={{ color: muted, fontWeight: 300, opacity: 0 }}
                            >
                                {contentKeyPrefix ? (
                                    <EditableText contentKey={`${contentKeyPrefix}.subtitle`} fallback={subtitle} />
                                ) : subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-8 sm:mt-12 gap-6">
                        {stats.length > 0 && (
                            <div
                                ref={statsRef}
                                className="flex items-center gap-6 sm:gap-10"
                                style={{ opacity: 0 }}
                            >
                                {stats.map((s, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && (
                                            <div className="w-px h-10" style={{ background: border }} />
                                        )}
                                        <div className="text-left">
                                            <p className="text-xl sm:text-3xl font-black tracking-tight leading-none" style={{ color: text }}>
                                                {contentKeyPrefix ? (
                                                    <EditableText contentKey={`${contentKeyPrefix}.stats.${i}.value`} fallback={s.value} />
                                                ) : s.value}
                                            </p>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-1" style={{ color: muted }}>
                                                {contentKeyPrefix ? (
                                                    <EditableText contentKey={`${contentKeyPrefix}.stats.${i}.label`} fallback={s.label} />
                                                ) : s.label}
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {trustBadges.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {trustBadges.map((badge, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1.5 text-[11px] font-medium"
                                        style={{ color: muted, letterSpacing: '0.05em' }}
                                    >
                                        <span style={{ color: '#06b6d4' }}>{badge.icon}</span>
                                        {contentKeyPrefix ? (
                                            <EditableText contentKey={`${contentKeyPrefix}.trust.${i}`} fallback={badge.label} />
                                        ) : badge.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Transition Phase (100vh) ─── */}
                <div className="flex flex-col justify-center items-center h-[100svh] px-8 sm:px-14 lg:px-20 relative z-20 text-center pointer-events-none">
                    <div ref={transTextRef} className="flex flex-col items-center max-w-5xl mx-auto drop-shadow-xl" style={{ textShadow: isDark ? '0 4px 24px rgba(0,0,0,0.8)' : '0 4px 24px rgba(255,255,255,0.8)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mb-6 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold mb-6" style={{ color: muted }}>
                            {transitionLabel}
                        </p>
                        <h2
                            ref={transTitleRef}
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1]"
                            style={{ color: text, fontFamily: FONT }}
                        >
                            {transitionText.split('').map((char, i) => (
                                char === ' '
                                    ? <span key={`s${i}`}>&nbsp;</span>
                                    : <span key={`c${i}`} data-char style={{ display: 'inline-block', opacity: 0, filter: 'blur(8px)', transform: 'translateY(15px)' }}>{char}</span>
                            ))}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageHero;
