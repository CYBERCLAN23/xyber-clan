import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import Meta from './components/Meta';
import SharedNavbar from './components/SharedNavbar';
import Footer from './components/Footer';
import PortfolioGrid, { CATEGORIES } from './components/PortfolioGrid';
import EditableText from './components/cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const PortfolioPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];

    const [activeFilter, setActiveFilter] = useState('All');
    const [mounted, setMounted] = useState(false);

    /* refs for entrance animations */
    const titleRef = useRef(null);
    const descRef  = useRef(null);
    const filterRef = useRef(null);
    const dotRef   = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(dotRef.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
        );
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.1 },
            '-=0.2'
        );
        tl.fromTo(descRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75 },
            '-=0.6'
        );
        tl.fromTo(filterRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4'
        );
        return () => tl.kill();
    }, [mounted]);

    const bg     = isDark ? '#0a0a0a' : '#f0eeec';
    const text   = isDark ? '#f0f0f0' : '#111';
    const muted  = isDark ? '#555' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

    return (
        <div style={{
            minHeight: '100vh',
            background: bg,
            color: text,
            fontFamily: FONT,
            overflowX: 'hidden',
        }}>
            <Meta
                title="Our Portfolio | Innovative Digital Solutions & Tech"
                description="Explore XyberClan's portfolio. See how our cybersecurity and tech innovation startup delivers high-performance web development, mobile apps, and secure digital solutions."
            />
            <SharedNavbar transparentHero={false} />

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <header className="portfolio-hero" style={{
                padding: 'clamp(80px, 14vh, 140px) clamp(24px, 5vw, 80px) 0',
                position: 'relative',
            }}>
                {/* Red dot — hidden on mobile */}
                <div ref={dotRef} className="portfolio-hero-dot" style={{
                    position: 'absolute',
                    left: '48%',
                    top: 'clamp(110px, 15vh, 155px)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#dc2626',
                    boxShadow: '0 0 12px rgba(220,38,38,0.7)',
                    opacity: 0,
                }} />

                <div className="portfolio-hero-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '0',
                    position: 'relative',
                }}>
                    {/* Title — full width on mobile */}
                    <div>
                        <h1
                            ref={titleRef}
                            style={{
                                fontWeight: 300,
                                fontSize: 'clamp(2.8rem, 9vw, 9rem)',
                                letterSpacing: '-0.04em',
                                lineHeight: 0.92,
                                color: text,
                                margin: 0,
                                opacity: 0,
                            }}
                        >
                            <EditableText contentKey={`${language}.portfolioPage.title`} fallback={t.portfolioPage.title} />
                        </h1>
                    </div>

                    {/* Description + Filters */}
                    <div ref={descRef} style={{ paddingTop: 20, paddingBottom: 32, opacity: 0 }}>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: muted,
                            maxWidth: 400,
                            margin: '0 0 24px 0',
                        }}>
                            <EditableText contentKey={`${language}.portfolioPage.subtitle`} fallback={t.portfolioPage.subtitle} />
                        </p>

                        {/* Filter label + buttons */}
                        <div ref={filterRef} style={{ opacity: 1 }}>
                            <p style={{
                                fontSize: '0.58rem',
                                fontWeight: 600,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: muted,
                                margin: '0 0 10px 0',
                            }}>
                                <EditableText contentKey={`${language}.portfolioPage.filterLabel`} fallback={t.portfolioPage.filterLabel} />
                            </p>
                            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            borderRight: `1px solid ${border}`,
                                            cursor: 'pointer',
                                            fontFamily: FONT,
                                            fontSize: '0.7rem',
                                            fontWeight: activeFilter === cat ? 700 : 400,
                                            color: activeFilter === cat ? text : muted,
                                            padding: '6px 12px 6px 0',
                                            marginRight: 12,
                                            marginBottom: 4,
                                            transition: 'color 0.2s',
                                            letterSpacing: '0.02em',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {cat}
                                        <span style={{ marginLeft: 4, fontSize: '0.6rem', opacity: 0.4 }}>⇅</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (min-width: 768px) {
                        .portfolio-hero-grid { grid-template-columns: 1fr 1fr !important; gap: 0 40px !important; }
                        .portfolio-hero-dot { display: block !important; }
                    }
                    @media (max-width: 767px) {
                        .portfolio-hero-dot { display: none !important; }
                    }
                `}</style>
            </header>

            {/* Thin separator */}
            <div style={{
                height: 1,
                background: border,
                margin: '0 clamp(24px, 5vw, 80px)',
            }} />

            {/* ─── Portfolio Grid ───────────────────────────────────────── */}
            <main style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
                <PortfolioGrid activeFilter={activeFilter} />
            </main>

            {/* ─── CTA strip ───────────────────────────────────────────── */}
            <section style={{
                padding: 'clamp(60px, 10vh, 100px) clamp(24px, 5vw, 80px)',
                borderTop: `1px solid ${border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 20,
            }}>
                <p style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: muted,
                    margin: 0,
                }}>
                    <EditableText contentKey={`${language}.portfolioPage.ctaBadge`} fallback={t.portfolioPage.ctaBadge} />
                </p>
                <h2 style={{
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: text,
                    margin: 0,
                    maxWidth: 520,
                }}>
                    <EditableText contentKey={`${language}.portfolioPage.ctaHeading`} fallback={t.portfolioPage.ctaHeading} />
                </h2>
                <a
                    href="/start-project"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: text,
                        textDecoration: 'none',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                        paddingBottom: 2,
                        marginTop: 8,
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.55'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <EditableText contentKey={`${language}.portfolioPage.ctaLink`} fallback={t.portfolioPage.ctaLink} />
                </a>
            </section>

            <Footer translations={t} />
        </div>
    );
};

export default PortfolioPage;
