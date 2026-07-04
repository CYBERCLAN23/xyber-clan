import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';
import EditableImage from './components/cms/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

/* ─── Mini Image Carousel for Left Side ──────────────────────────── */
const LeftPanelCarousel = ({ images, title }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const handlePrev = (e) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: idx === activeIndex ? 1 : 0,
                        transform: idx === activeIndex ? 'scale(1)' : 'scale(1.05)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                    }}
                >
                    <img
                        src={img}
                        alt={`${title} - ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            ))}

            {/* Subtle Vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
                pointerEvents: 'none',
            }} />

            {/* Controls */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 24,
                    display: 'flex',
                    gap: 12,
                    zIndex: 10,
                }}>
                    <button
                        onClick={handlePrev}
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            color: '#fff',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#06b6d4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            color: '#fff',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#06b6d4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

/* ─── Event Detail Panel ─────────────────────────────────────────── */
const EventDetailPanel = ({ article, onClose, isDark }) => {
    const panelRef = useRef(null);
    const contentRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!panelRef.current) return;
        gsap.fromTo(panelRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(contentRef.current,
            { x: isMobile ? 0 : 60, y: isMobile ? 40 : 0, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
        );
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [article, isMobile]);

    const handleClose = useCallback(() => {
        gsap.to(panelRef.current, {
            opacity: 0,
            duration: 0.25,
            onComplete: onClose,
        });
    }, [onClose]);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleClose]);

    const images = article.images || [article.image];

    const metaRows = [
        { label: 'Event Type', value: article.type },
        { label: 'Date / Period', value: article.date },
        { label: 'Status', value: 'Completed' },
        { label: 'Focus', value: 'Technology & Impact' },
    ];

    return (
        <div
            ref={panelRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                fontFamily: FONT,
                opacity: 0,
                overflowY: isMobile ? 'auto' : 'hidden',
                background: isDark ? '#0d0d0d' : '#fff',
            }}
        >
            {/* ── Left: Event Image Carousel ── */}
            <div
                style={{
                    width: isMobile ? '100%' : '42%',
                    height: isMobile ? '35vh' : 'auto',
                    background: isDark ? '#111' : '#1a1a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    flexShrink: 0,
                }}
            >
                {!isMobile && (
                    <div style={{ padding: '28px 32px' }}>
                        <span style={{
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#555',
                        }}>
                            XyberClan Event
                        </span>
                    </div>
                )}

                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <LeftPanelCarousel images={images} title={article.title} />
                </div>
            </div>

            {/* ── Right: Event details ── */}
            <div
                ref={contentRef}
                style={{
                    flex: 1,
                    background: isDark ? '#0d0d0d' : '#fff',
                    overflowY: isMobile ? 'visible' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: isMobile ? '24px 28px 48px 28px' : '28px 48px 48px 48px',
                    position: 'relative',
                }}
            >
                {/* Close */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            color: isDark ? '#666' : '#999',
                            lineHeight: 1,
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontFamily: FONT,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Title */}
                <h2 style={{
                    fontWeight: 300,
                    fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: isDark ? '#f0f0f0' : '#111',
                    margin: '0 0 40px 0',
                }}>
                    {article.title}
                </h2>

                {/* Metadata */}
                <div style={{
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    marginBottom: 36,
                }}>
                    {metaRows.map(({ label, value }) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 0',
                                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                            }}
                        >
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: isDark ? '#444' : '#aaa',
                            }}>
                                {label}
                            </span>
                            <span style={{
                                fontSize: '0.82rem',
                                fontWeight: 400,
                                color: isDark ? '#ccc' : '#333',
                                textAlign: 'right',
                            }}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <p style={{
                    fontSize: '0.95rem',
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: isDark ? '#888' : '#555',
                    maxWidth: 440,
                    marginBottom: 40,
                }}>
                    {article.description}
                </p>

                {/* External Link */}
                {article.url && article.url !== '#' && (
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: isDark ? '#f0f0f0' : '#111',
                            textDecoration: 'none',
                            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                            paddingBottom: 2,
                            width: 'fit-content',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        View external post
                        <ArrowUpRight size={14} />
                    </a>
                )}

                {/* Red dot */}
                <div style={{
                    position: 'absolute',
                    bottom: 28,
                    right: 28,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#dc2626',
                    boxShadow: '0 0 10px rgba(220,38,38,0.6)',
                }} />
            </div>
        </div>
    );
};

/* ─── Main EventsPage Component ──────────────────────────────────── */
const EventsPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];
    const ep = t.eventsPage;
    const articles = ep.articles || [];

    const [activeArticle, setActiveArticle] = useState(null);

    const sectionRef = useRef(null);
    const bgParallaxRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const cardsRef = useRef([]);

    const bg = isDark ? '#0a0a0a' : '#f5f4f2';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    const heroBg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!articles.length) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14, filter: 'blur(4px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 50, scale: 0.95, filter: 'blur(6px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 60, scale: 0.9, filter: 'blur(6px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: cardsRef.current[0], start: 'top 88%', once: true } }
            );
            gsap.fromTo(bgParallaxRef.current,
                { scale: 1, opacity: 0.08 },
                { scale: 1.2, opacity: 0.03, ease: 'none',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [articles.length]);

    return (
        <div style={{ background: bg, color: text, fontFamily: FONT }} className="min-h-screen transition-colors duration-300">
            <Meta
                title="Events & Blog | Stay Connected"
                description="Follow XyberClan's latest news, event participations, and technical insights. Stay updated with the African tech ecosystem."
            />
            <SharedNavbar transparentHero={true} />

            <PageHero
                lang={language}
                contentKeyPrefix={`${language}.eventsPage.hero`}
                badgeText={ep.badge}
                title={ep.title}
                subtitle={ep.subtitle}
                imageSrc=""
                heroBg={heroBg}
                stats={[
                    { value: `${articles.length}+`, label: 'Events' },
                    { value: 'Impact', label: 'Driven' }
                ]}
                trustBadges={[]}
                transitionLabel="Events & Blog"
                transitionText="Stay connected with XyberClan's latest news, events, and technical insights"
            />

            {/* ─── UPCOMING WEBINAR ─── */}
            <section className="relative overflow-hidden" style={{ background: bg, color: text, fontFamily: FONT }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-16 md:py-20 relative z-10">
                    <div className="rounded-3xl border p-8 md:p-12 text-center" style={{
                        background: isDark ? '#111' : '#fff',
                        borderColor: isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.15)',
                    }}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style={{
                            background: 'rgba(6,182,212,0.12)',
                            color: '#06b6d4',
                        }}>
                            Upcoming Webinar
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                            Building the Future with XyberClan
                        </h2>
                        <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: muted }}>
                            Join our free webinar on web development, cybersecurity, and digital innovation. 
                            <strong>Date: July 10, 2026 at 8:00 PM (WAT).</strong> 
                            Reserve your spot now — add it to your Google Calendar.
                        </p>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Mmpzamg1M2MybWkwNzBuZm4zbW1wMm03MmUgcHN5Y2hvQGFsbWlnaHQubWU&tmsrc=psycho%40almight.me"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '14px 32px',
                                borderRadius: 9999,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                                color: '#fff',
                                textDecoration: 'none',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.35)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Add to Google Calendar
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── EVENTS GRID ─── */}
            <section
                ref={sectionRef}
                className="relative overflow-hidden"
                style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            >
                <div ref={bgParallaxRef} className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, #06b6d4 0%, transparent 60%)` }} />
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
                        <div>
                            <p ref={labelRef} className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: '#06b6d4', opacity: 0 }}>
                                {ep.badge}
                            </p>
                            <h2 ref={headRef} className="leading-[0.9] tracking-[-0.03em]" style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}>
                                Latest<br />Updates
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: muted, fontWeight: 300 }}>
                            From hackathons to conferences — follow our journey through the tech ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, idx) => {
                            const images = article.images || [article.image];
                            const displayImage = images[0];
                            return (
                                <div
                                    key={article.id}
                                    ref={el => cardsRef.current[idx] = el}
                                    onClick={() => setActiveArticle(article)}
                                    className="group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                                    style={{ opacity: 0, borderColor: border, background: isDark ? '#111' : '#fff' }}
                                >
                                    <div className="relative h-40 sm:h-48 overflow-hidden">
                                        <EditableImage
                                            contentKey={`${language}.eventsPage.article${idx}.image`}
                                            src={displayImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ objectPosition: article.objectPosition || 'center 20%' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ background: '#06b6d4', color: '#fff' }}>
                                                <EditableText contentKey={`${language}.eventsPage.article${idx}.type`} fallback={article.type} />
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                                            <Calendar size={11} />
                                            <EditableText contentKey={`${language}.eventsPage.article${idx}.date`} fallback={article.date} />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-black tracking-tight leading-tight mb-2 group-hover:text-cyan-500 transition-colors duration-200" style={{ color: text }}>
                                            <EditableText contentKey={`${language}.eventsPage.article${idx}.title`} fallback={article.title} />
                                        </h3>
                                        <p className="text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ color: muted, fontWeight: 300 }}>
                                            <EditableText contentKey={`${language}.eventsPage.article${idx}.description`} fallback={article.description} multiline />
                                        </p>
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold"
                                            style={{ color: '#06b6d4' }}
                                        >
                                            View details
                                            <ArrowUpRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modal Detail Panel */}
            {activeArticle && (
                <EventDetailPanel
                    article={activeArticle}
                    onClose={() => setActiveArticle(null)}
                    isDark={isDark}
                />
            )}

            <Footer translations={t} />
        </div>
    );
};

export default EventsPage;
