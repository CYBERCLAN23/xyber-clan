import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getLogo } from '../utils/festive';

const Preloader = ({ onComplete }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isGone, setIsGone] = useState(false);
    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const wordmarkRef = useRef(null);
    const counterRef = useRef(null);
    const barFillRef = useRef(null);
    const barTrackRef = useRef(null);
    const taglineRef = useRef(null);
    const scanRef = useRef(null);
    const topPanelRef = useRef(null);
    const bottomPanelRef = useRef(null);
    const cornerTLRef = useRef(null);
    const cornerTRRef = useRef(null);
    const cornerBLRef = useRef(null);
    const cornerBRRef = useRef(null);
    const glitchRef = useRef(null);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('xc_visited');
        if (hasVisited) {
            onComplete?.();
            return;
        }
        setShouldRender(true);
    }, [onComplete]);

    useEffect(() => {
        if (!shouldRender) return;

        const el = {
            container: containerRef.current,
            logo: logoRef.current,
            wordmark: wordmarkRef.current,
            counter: counterRef.current,
            barFill: barFillRef.current,
            barTrack: barTrackRef.current,
            tagline: taglineRef.current,
            scan: scanRef.current,
            topPanel: topPanelRef.current,
            bottomPanel: bottomPanelRef.current,
            corners: [cornerTLRef.current, cornerTRRef.current, cornerBLRef.current, cornerBRRef.current].filter(Boolean),
            glitch: glitchRef.current,
        };

        // Guard: Ensure essential elements are fully loaded in DOM
        if (!el.container || !el.logo || !el.wordmark || !el.barTrack || !el.barFill || !el.topPanel || !el.bottomPanel) {
            return;
        }

        // Start everything invisible
        gsap.set([el.logo, el.wordmark, el.barTrack, el.tagline].filter(Boolean), { opacity: 0 });
        gsap.set(el.barFill, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(el.corners, { opacity: 0, scale: 0 });
        gsap.set(el.topPanel, { yPercent: -100 });
        gsap.set(el.bottomPanel, { yPercent: 100 });

        const count = { val: 0 };

        const master = gsap.timeline({
            onComplete: () => {
                sessionStorage.setItem('xc_visited', 'true');
                onComplete?.();
                // Fully unmount from DOM so nothing lingers
                setIsGone(true);
            }
        });

        // 1. Panels slide in
        master.to([el.topPanel, el.bottomPanel], {
            yPercent: 0,
            duration: 0.55,
            ease: 'power3.inOut',
        });

        // 2. Corner brackets appear
        master.to(el.corners, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.07,
            ease: 'back.out(2)',
        }, '-=0.1');

        // 3. Logo drops in
        master.fromTo(el.logo,
            { opacity: 0, scale: 0.6, filter: 'blur(16px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
            '-=0.1'
        );

        // 4. Wordmark slides up
        master.fromTo(el.wordmark,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            '-=0.3'
        );

        // 5. Bar track appears
        master.to(el.barTrack, { opacity: 1, duration: 0.3 }, '-=0.1');

        // 6. Progress bar + counter animate together (the main body of loading)
        master.to(count, {
            val: 100,
            duration: 2.0,
            ease: 'power1.inOut',
            onUpdate: () => {
                const v = Math.round(count.val);
                if (el.counter) el.counter.textContent = `${v}%`;
                if (el.barFill) gsap.set(el.barFill, { scaleX: v / 100 });

                // Glitch flicker at 30%, 70%, 95%
                if (v === 30 || v === 70 || v === 95) {
                    gsap.fromTo(el.glitch,
                        { opacity: 1, x: gsap.utils.random(-6, 6) },
                        { opacity: 0, x: 0, duration: 0.12, ease: 'none' }
                    );
                }
            }
        });

        // 7. Tagline fades in near end
        master.to(el.tagline, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=1.0');

        // 8. Brief hold at 100%
        master.to({}, { duration: 0.4 });

        // 9. Exit: panels split apart revealing site
        master.to(el.corners, {
            opacity: 0,
            scale: 0,
            duration: 0.2,
            stagger: 0.04,
        });

        master.to([el.topPanel, el.bottomPanel], {
            yPercent: (i) => (i === 0 ? -100 : 100),
            duration: 0.65,
            ease: 'power3.inOut',
        }, '-=0.1');

        return () => master.kill();
    }, [shouldRender, onComplete]);

    if (!shouldRender || isGone) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                pointerEvents: 'all',
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            }}
        >
            {/* TOP PANEL */}
            <div
                ref={topPanelRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '50%',
                    background: '#000',
                    zIndex: 2,
                }}
            >
                {/* Scanlines overlay */}
                <div
                    ref={scanRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
                {/* Top-left corner bracket */}
                <div ref={cornerTLRef} style={{ position: 'absolute', top: 20, left: 20, width: 24, height: 24, borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4', zIndex: 3 }} />
                {/* Top-right corner bracket */}
                <div ref={cornerTRRef} style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderTop: '2px solid #06b6d4', borderRight: '2px solid #06b6d4', zIndex: 3 }} />
            </div>

            {/* BOTTOM PANEL */}
            <div
                ref={bottomPanelRef}
                style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '50%',
                    background: '#000',
                    zIndex: 2,
                }}
            >
                {/* Scanlines overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
                {/* Bottom-left corner bracket */}
                <div ref={cornerBLRef} style={{ position: 'absolute', bottom: 20, left: 20, width: 24, height: 24, borderBottom: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4', zIndex: 3 }} />
                {/* Bottom-right corner bracket */}
                <div ref={cornerBRRef} style={{ position: 'absolute', bottom: 20, right: 20, width: 24, height: 24, borderBottom: '2px solid #06b6d4', borderRight: '2px solid #06b6d4', zIndex: 3 }} />
            </div>

            {/* CENTER CONTENT — sits above both panels at z:10 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                    pointerEvents: 'none',
                }}
            >
                {/* Glitch ghost (hidden layer that twitches) */}
                <div
                    ref={glitchRef}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 72,
                        height: 72,
                        background: 'rgba(6,182,212,0.25)',
                        filter: 'blur(2px)',
                        borderRadius: '50%',
                        marginBottom: 0,
                    }}
                />

                {/* Logo */}
                <div
                    ref={logoRef}
                    style={{
                        position: 'relative',
                        marginBottom: 20,
                        width: 80,
                        height: 80,
                    }}
                >
                    {/* Cyan glow behind logo */}
                    <div style={{
                        position: 'absolute',
                        inset: -16,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)',
                        animation: 'xcPulse 2.4s ease-in-out infinite',
                    }} />
                    <img
                        src={getLogo()}
                        alt="XyberClan"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 0 16px rgba(6,182,212,0.6))',
                        }}
                    />
                </div>

                {/* Wordmark */}
                <div ref={wordmarkRef} style={{ marginBottom: 40, textAlign: 'center' }}>
                    <h1
                        style={{
                            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                            fontWeight: 900,
                            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                            letterSpacing: '-0.04em',
                            color: '#fff',
                            lineHeight: 1,
                            margin: 0,
                        }}
                    >
                        Xyber<span style={{ color: '#06b6d4' }}>Clan</span>
                    </h1>
                    <p
                        ref={taglineRef}
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '0.65rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#555',
                            margin: '8px 0 0 0',
                            opacity: 0,
                        }}
                    >
                        Build · Design · Dominate
                    </p>
                </div>

                {/* Progress area */}
                <div style={{ width: 'min(280px, 55vw)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Track */}
                    <div
                        ref={barTrackRef}
                        style={{
                            width: '100%',
                            height: 1,
                            background: 'rgba(255,255,255,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Fill */}
                        <div
                            ref={barFillRef}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                                boxShadow: '0 0 8px rgba(6,182,212,0.8)',
                                transformOrigin: 'left center',
                                scaleX: 0,
                            }}
                        />
                    </div>

                    {/* Counter row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                            fontFamily: "'Inter', monospace",
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#333',
                        }}>
                            Loading
                        </span>
                        <span
                            ref={counterRef}
                            style={{
                                fontFamily: "'Inter', monospace",
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                color: '#06b6d4',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            0%
                        </span>
                    </div>
                </div>
            </div>

            {/* Keyframe animation injected inline */}
            <style>{`
                @keyframes xcPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.08); }
                }
            `}</style>
        </div>
    );
};

export default Preloader;
