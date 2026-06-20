import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Handshake, Trophy, Users, Globe, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import PartnershipForm from './PartnershipForm';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const HULT_STATS = [
    { icon: <Zap size={16} />, label: 'Technical Mentorship', value: '100%' },
    { icon: <Users size={16} />, label: 'Innovation Boost', value: '24/7' },
    { icon: <Globe size={16} />, label: 'Social Impact', value: 'Global' },
];

const PartnersPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState('partner');
    const [mounted, setMounted] = useState(false);

    const t = translations[language];
    const p = t.partnersPage;

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const dotRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const textRef = useRef(null);
    const statsRef = useRef([]);
    const ctaSectionRef = useRef(null);
    const ctaTitleRef = useRef(null);
    const ctaCardsRef = useRef([]);

    const bg = isDark ? '#0a0a0a' : '#f0eeec';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#555' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(timer);
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
        return () => tl.kill();
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
                    scrollTrigger: { trigger: textRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: statsRef.current[0], start: 'top 88%', once: true } }
            );
            gsap.fromTo(ctaTitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 80%', once: true } }
            );
            gsap.fromTo(ctaCardsRef.current,
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 75%', once: true } }
            );
        });

        return () => ctx.revert();
    }, [mounted]);

    const openForm = (type) => {
        setFormType(type);
        setIsFormOpen(true);
    };

    const handleFormComplete = (summary) => {
        console.log("Form completed:", summary);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: bg,
            color: text,
            fontFamily: FONT,
            overflowX: 'hidden',
        }}>
            <Meta
                title="Our Strategic Partners | Collaborative Innovation"
                description="Discover XyberClan's strategic alliances, including our technical sponsorship of Hult Prize UY1. We collaborate to drive social and technological impact."
            />
            <SharedNavbar transparentHero={false} />

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <header className="partners-hero" style={{
                padding: 'clamp(80px, 14vh, 140px) clamp(24px, 5vw, 80px) 0',
                position: 'relative',
            }}>
                <div ref={dotRef} className="partners-hero-dot" style={{
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

                <div className="partners-hero-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '0',
                    position: 'relative',
                }}>
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
                            Our Strategic<br />
                            <span style={{ fontWeight: 800 }}>Partners</span>
                        </h1>
                    </div>

                    <div ref={descRef} style={{ paddingTop: 20, paddingBottom: 32, opacity: 0 }}>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: muted,
                            maxWidth: 400,
                            margin: 0,
                        }}>
                            <EditableText contentKey={`${language}.partnersPage.hero.description`} fallback="Collaborating for a greater impact — powering innovation through strategic alliances and shared vision." />
                        </p>
                    </div>
                </div>

                <style>{`
                    @media (min-width: 768px) {
                        .partners-hero-grid { grid-template-columns: 1fr 1fr !important; gap: 0 40px !important; }
                        .partners-hero-dot { display: block !important; }
                    }
                    @media (max-width: 767px) {
                        .partners-hero-dot { display: none !important; }
                    }
                `}</style>
            </header>

            {/* Separator */}
            <div style={{
                height: 1,
                background: border,
                margin: '0 clamp(24px, 5vw, 80px)',
            }} />

            {/* ─── HULT PRIZE SECTION ─── */}
            <section style={{
                background: bg,
                borderTop: `1px solid ${border}`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isDark ? 0.04 : 0.04,
                    pointerEvents: 'none',
                    background: `radial-gradient(ellipse at 50% 50%, #06b6d4 0%, transparent 70%)`,
                }} />
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: 'clamp(80px, 18vh, 140px) clamp(24px, 5vw, 80px)',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: 48,
                        gap: 20,
                    }}>
                        <div>
                            <p ref={labelRef} style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#06b6d4',
                                margin: '0 0 24px 0',
                                opacity: 0,
                            }}>
                                Strategic Partnership
                            </p>
                            <h2 ref={headRef} style={{
                                fontWeight: 900,
                                fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                                lineHeight: 0.9,
                                letterSpacing: '-0.03em',
                                color: text,
                                margin: 0,
                                opacity: 0,
                            }}>
                                <EditableText contentKey={`${language}.partnersPage.hultStory.title`} fallback={p.hultStory.title} />
                            </h2>
                        </div>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: muted,
                            maxWidth: 300,
                            margin: 0,
                        }}>
                            <EditableText contentKey={`${language}.partnersPage.hultStory.description`} fallback="Technical sponsorship powering the next generation of social entrepreneurs at UY1." />
                        </p>
                    </div>

                    <div ref={textRef} style={{
                        maxWidth: 700,
                        marginBottom: 64,
                        opacity: 0,
                    }}>
                        {p.hultStory.narrative.map((paragraph, idx) => (
                            <p key={idx} style={{
                                fontSize: '0.9rem',
                                fontWeight: 300,
                                lineHeight: 1.7,
                                color: muted,
                                margin: '0 0 16px 0',
                            }}>
                                <EditableText contentKey={`${language}.partnersPage.hultStory.narrative${idx}`} fallback={paragraph} multiline />
                            </p>
                        ))}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
                    }}>
                        {HULT_STATS.map((stat, idx) => (
                            <div
                                key={idx}
                                ref={el => statsRef.current[idx] = el}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '4/3',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    border: `1px solid ${border}`,
                                    background: 'transparent',
                                    overflow: 'hidden',
                                    opacity: 0,
                                    padding: '16px 24px',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#06b6d4',
                                    background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)',
                                    marginBottom: 4,
                                }}>
                                    {stat.icon}
                                </div>
                                <span style={{
                                    fontFamily: FONT,
                                    fontWeight: 800,
                                    fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                                    letterSpacing: '-0.02em',
                                    color: text,
                                    lineHeight: 1.1,
                                }}>
                                    {stat.value}
                                </span>
                                <span style={{
                                    fontFamily: FONT,
                                    fontWeight: 600,
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: muted,
                                }}>
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA SECTION ─── */}
            <section ref={ctaSectionRef} style={{
                background: bg,
                borderTop: `1px solid ${border}`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: 'clamp(80px, 18vh, 140px) clamp(24px, 5vw, 80px)',
                    textAlign: 'center',
                }}>
                    <div ref={ctaTitleRef} style={{ marginBottom: 64, opacity: 0 }}>
                        <p style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#06b6d4',
                            margin: '0 0 24px 0',
                        }}>
                            <EditableText contentKey={`${language}.partnersPage.ctaBadge`} fallback="Get Involved" />
                        </p>
                        <h2 style={{
                            fontWeight: 900,
                            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                            lineHeight: 0.9,
                            letterSpacing: '-0.03em',
                            color: text,
                            margin: '0 0 16px 0',
                        }}>
                            <EditableText contentKey={`${language}.partnersPage.ctaHeading`} fallback="Join the XyberClan Network" />
                        </h2>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: muted,
                            maxWidth: 500,
                            margin: '0 auto',
                        }}>
                            <EditableText contentKey={`${language}.partnersPage.ctaSubtitle`} fallback="Whether you want to build the next big thing or support our tech movement, we have a place for you." />
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 24,
                        maxWidth: 700,
                        margin: '0 auto',
                    }}>
                        <button
                            ref={el => ctaCardsRef.current[0] = el}
                            onClick={() => openForm('partner')}
                            style={{
                                position: 'relative',
                                padding: 40,
                                borderRadius: 4,
                                border: `1px solid ${border}`,
                                background: isDark ? '#111' : '#fff',
                                textAlign: 'left',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'transform 0.2s ease',
                                fontFamily: FONT,
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#06b6d4',
                                background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)',
                                marginBottom: 32,
                            }}>
                                <Handshake size={22} />
                            </div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: text,
                                margin: '0 0 16px 0',
                            }}>
                                <EditableText contentKey={`${language}.partnersPage.ctaPartner`} fallback={p.ctaPartner} />
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#06b6d4',
                            }}>
                                <span><EditableText contentKey={`${language}.partnersPage.ctaPartnerButton`} fallback="Get Started" /></span>
                                <ArrowRight size={14} />
                            </div>
                        </button>

                        <button
                            ref={el => ctaCardsRef.current[1] = el}
                            onClick={() => openForm('sponsor')}
                            style={{
                                position: 'relative',
                                padding: 40,
                                borderRadius: 4,
                                border: `1px solid ${border}`,
                                background: isDark ? '#111' : '#fff',
                                textAlign: 'left',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'transform 0.2s ease',
                                fontFamily: FONT,
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#06b6d4',
                                background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)',
                                marginBottom: 32,
                            }}>
                                <Trophy size={22} />
                            </div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: text,
                                margin: '0 0 16px 0',
                            }}>
                                <EditableText contentKey={`${language}.partnersPage.ctaSponsor`} fallback={p.ctaSponsor} />
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#06b6d4',
                            }}>
                                <span><EditableText contentKey={`${language}.partnersPage.ctaSponsorButton`} fallback="Support Us" /></span>
                                <ArrowRight size={14} />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            <PartnershipForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                type={formType}
                lang={language}
                t={t}
                onComplete={handleFormComplete}
            />

            <Footer translations={t} />
        </div>
    );
};

export default PartnersPage;
