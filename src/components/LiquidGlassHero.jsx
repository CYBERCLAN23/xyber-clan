import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import mountainBg from '../assets/hero-mountain.png';
import EditableText from './cms/EditableText';
import { useTheme } from '../context/ThemeContext';
import { useCMS } from '../context/CMSContext';

gsap.registerPlugin(ScrollTrigger);

const LiquidGlassHero = ({ lang = 'en', translations: t }) => {
    const { isDark } = useTheme();
    const { isEditing, getContent } = useCMS();
    const [mounted, setMounted] = useState(false);

    const transitionText = getContent(`${lang}.hero.transitionText`, lang === 'en' ? 'A premium digital agency focused on driving technological growth' : 'Une agence numérique premium axée sur le développement technologique');
    const sectionRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const descRef = useRef(null);
    const scrollRef = useRef(null);
    const dotRef = useRef(null);
    const imgRef = useRef(null);
    const cloudTopRef = useRef(null);
    const cloudBottomRef = useRef(null);
    const cloudLeftRef = useRef(null);
    const transTextRef = useRef(null);
    const transTitleRef = useRef(null);

    const text = isDark ? '#f0f0f0' : '#111';

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
        tl.fromTo([line1Ref.current, line2Ref.current, line3Ref.current],
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
            0.2
        );
        tl.fromTo([descRef.current, scrollRef.current],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
            0.7
        );
        tl.fromTo(dotRef.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
            0.9
        );
        return () => tl.kill();
    }, [mounted]);

    // ─── Scroll → Mountain zoom closer + clouds appear ────────────────────────
    useEffect(() => {
        if (!mounted) return;

        // Mountain zooms in as you scroll down the hero and into the next section
        const zoomTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
            onUpdate: (self) => {
                const p = self.progress;
                // Mountain scales from 1 → 1.5 (zoom in = getting closer)
                if (imgRef.current) {
                    gsap.set(imgRef.current, {
                        scale: 1 + p * 0.5,
                        filter: `brightness(${1.05 - p * 0.1}) contrast(${0.88 + p * 0.12})`,
                    });
                }
                // Clouds grow in from edges (opacity 0 → 1)
                if (cloudTopRef.current) gsap.set(cloudTopRef.current, { opacity: p * 0.9 });
                if (cloudBottomRef.current) gsap.set(cloudBottomRef.current, { opacity: Math.min(1, p * 1.5) });
                if (cloudLeftRef.current) gsap.set(cloudLeftRef.current, { opacity: p * 0.75 });

                // Headline text drifts up & fades as you scroll
                const textFade = Math.max(0, 1 - p * 3);
                const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);
                if (lines.length) {
                    gsap.set(lines, {
                        opacity: textFade,
                        y: -p * 60,
                    });
                }
                
                const decs = [descRef.current, scrollRef.current, dotRef.current].filter(Boolean);
                if (decs.length) {
                    gsap.set(decs, {
                        opacity: textFade * 0.8,
                    });
                }

                // Transition text parallax & fade
                if (transTextRef.current) {
                    let transOpacity = 0;
                    if (p > 0.1 && p < 0.2) transOpacity = (p - 0.1) / 0.1; // Quick fade in for the container/badge
                    else if (p >= 0.2 && p <= 0.75) transOpacity = 1;
                    else if (p > 0.75) transOpacity = Math.max(0, 1 - (p - 0.75) / 0.25);
                    
                    gsap.set(transTextRef.current, {
                        opacity: transOpacity,
                        y: 120 - p * 350,
                        scale: 0.95 + p * 0.05
                    });
                }
            },
        });

        // Staggered text reveal timeline linked to scroll
        const textTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: '15% top',
                end: '40% top',
                scrub: 1.2
            }
        });
        
        if (transTitleRef.current) {
            const chars = transTitleRef.current.querySelectorAll('[data-char]');
            textTl.fromTo(chars, 
                { opacity: 0, filter: 'blur(8px)', y: 15 },
                { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, ease: 'power2.out' }
            );
        }

        return () => {
            zoomTrigger.kill();
            textTl.kill();
        };
    }, [mounted, lang, transitionText]);

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
            style={{ minHeight: '220svh' }}
        >
            {/* ─── Mountain Background (Fixed) ─── */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <img
                    ref={imgRef}
                    src={mountainBg}
                    alt=""
                    aria-hidden="true"
                    className="absolute w-full h-full object-cover object-center"
                    style={{
                        opacity: 0,
                        filter: 'brightness(1.05) contrast(0.88)',
                        mixBlendMode: isDark ? 'lighten' : 'multiply',
                    }}
                />
                {/* Fade edges: left & bottom (always on) */}
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

                {/* ─── Scroll-driven cloud overlays ─── */}
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
                <div className="flex flex-col justify-between h-screen px-6 sm:px-8 md:px-14 lg:px-20 pt-28 sm:pt-36 pb-8 sm:pb-12 relative z-10">
                    <div className="flex-1 flex flex-col justify-center">
                        <h1
                            className="leading-[0.88] tracking-[-0.03em] select-none"
                            style={{
                                color: text,
                                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                                fontWeight: 900,
                                fontSize: 'clamp(3.5rem, 14vw, 13rem)',
                            }}
                        >
                            <span ref={line1Ref} className="block" style={{ opacity: 0 }}>
                                <EditableText
                                    contentKey={`${lang}.hero.titleLine1`}
                                    fallback={lang === 'en' ? 'Build' : 'Construire'}
                                />
                            </span>
                            <span ref={line2Ref} className="block pl-[0.1em] sm:pl-[0.15em]" style={{ opacity: 0 }}>
                                <EditableText
                                    contentKey={`${lang}.hero.titleLine2a`}
                                    fallback={lang === 'en' ? 'to' : 'pour'}
                                />
                            </span>
                            <span ref={line3Ref} className="block pl-[0.2em] sm:pl-[0.35em]" style={{ opacity: 0 }}>
                                <span style={{ color: text }}>
                                    <EditableText
                                        contentKey={`${lang}.hero.titleLine2b`}
                                        fallback={lang === 'en' ? 'dominate' : 'dominer'}
                                    />
                                </span>
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-end justify-between mt-12 sm:mt-16 gap-4">
                        <span ref={scrollRef} className="text-[10px] font-bold tracking-[0.2em] uppercase origin-left transform -rotate-90 translate-y-8 select-none hidden sm:block" style={{ color: isDark ? '#666' : '#888' }}>
                            <EditableText contentKey={`${lang}.hero.scroll`} fallback="Scroll" />
                        </span>

                        <div
                            ref={descRef}
                            className="flex flex-col items-start gap-4 max-w-[220px] sm:max-w-[240px] md:max-w-[280px]"
                        >
                            <span
                                ref={dotRef}
                                className="w-2.5 h-2.5 rounded-full bg-cyan-500 self-end mb-1"
                                style={{ opacity: 0 }}
                            />

                            <p
                                className="leading-relaxed"
                                style={{
                                    color: isDark ? '#a0a0a0' : '#444',
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                    fontSize: '0.8rem',
                                    lineHeight: 1.65,
                                }}
                            >
                                <EditableText
                                    contentKey={`${lang}.hero.subtitle`}
                                    fallback={
                                        lang === 'en'
                                            ? 'Premium digital solutions for high-growth brands and ambitious entrepreneurs.'
                                            : 'Solutions digitales premium pour les marques en forte croissance.'
                                    }
                                />
                            </p>

                            <Link
                                to="/start-project"
                                className="text-[12px] font-semibold border-b pb-0.5 hover:text-cyan-600 hover:border-cyan-600 transition-colors duration-200 tracking-wide uppercase"
                                style={{ color: text, borderColor: text, letterSpacing: '0.05em' }}
                            >
                                <EditableText
                                    contentKey={`${lang}.hero.startProject`}
                                    fallback={t?.hero?.startProject || 'Digital Services'}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── Transition Phase (120vh) ─── */}
                <div className="flex flex-col justify-center items-center h-[120svh] px-8 sm:px-14 lg:px-20 relative z-20 text-center pointer-events-none">
                    <div ref={transTextRef} className="flex flex-col items-center max-w-5xl mx-auto drop-shadow-xl" style={{ textShadow: isDark ? '0 4px 24px rgba(0,0,0,0.8)' : '0 4px 24px rgba(255,255,255,0.8)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 mb-6 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold mb-6" style={{ color: isDark ? '#a0a0a0' : '#666' }}>
                            <EditableText contentKey={`${lang}.hero.aboutXyberclan`} fallback="About XyberClan" />
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
                                <EditableText contentKey={`${lang}.hero.transitionText`} fallback="A premium digital agency focused on driving technological growth" />
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
        </section>
    );
};

export default LiquidGlassHero;
