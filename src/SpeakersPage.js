import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Globe, Twitter } from 'lucide-react';
import { FaLinkedinIn, FaGithub, FaYoutube, FaInstagram } from 'react-icons/fa';
import { gsap } from 'gsap';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const speakers = [
    {
        id: 1,
        image: '/team/ceo-member.jpg',
        name: 'Cedrik Darel Yepmo',
        role: 'AI & Cybersecurity Expert',
        description: 'Co-Founder and CEO of XyberClan. Cedrik delivers deep-dive sessions on AI-powered cybersecurity, fullstack development strategies, and building resilient digital infrastructures for the African market.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/cedrik-darel-yepmo-b0544034a/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/cedarroyal21' }
        ]
    },
    {
        id: 2,
        image: '/team/cto-redteamer.jpg',
        name: 'AKANA SIGNING JOSIAS AARON',
        role: 'Red Teaming & AI Security',
        description: 'CTO of XyberClan and elite Red Teamer. Josias shares practical knowledge on offensive security, LLM security architecture, and building breach-resilient systems.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/akana-signing-josias-aaron/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/Josiasange37' }
        ]
    },
    {
        id: 3,
        image: '/team/communications-manager.jpeg?v=2',
        name: 'ONANA GREGOIRE LEGRAND',
        role: 'Business Strategy & Cybersecurity',
        description: 'COO of XyberClan. Onana presents on business-driven cybersecurity strategies, operational excellence, and scaling tech startups in emerging markets.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/onana-gregoire-legrand-a18529282/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/psycho237-prog' }
        ]
    },
    {
        id: 4,
        image: '/team/cybersecurity-chief.jpg',
        name: 'Lembou Pharel',
        role: 'DevOps & AI Systems',
        description: 'Cybersecurity engineer and DevOps practitioner at XyberClan. Lembou leads workshops on CI/CD automation, penetration testing, and AI-driven system hardening.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/lembou-pharel/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/lemboupharel' }
        ]
    },
    {
        id: 5,
        image: '/team/frontend-designer.png',
        name: 'ADJIA MVOA NDJI GABRIEL MONFILS',
        role: 'Fullstack & Systems Engineering',
        description: 'Multidisciplinary engineer at XyberClan. Gabriel covers fullstack development, Linux systems, AI workflow orchestration with n8n, and cybersecurity operations.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/zealda-junior-9352b1277/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/zealdajunior' }
        ]
    },
    {
        id: 6,
        image: '/team/yann-felix-wandji.png',
        name: 'Wandji Tchaleu Yann Félix',
        role: 'Network Engineering & Python',
        description: 'CCNA-certified network engineer at XyberClan. Yann Félix provides insights on network infrastructure design, Python automation, and the intersection of networking with cybersecurity.',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: '#' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: '#' }
        ]
    }
];

const socialIconMap = {
    LinkedIn: <FaLinkedinIn size={16} />,
    GitHub: <FaGithub size={16} />,
    YouTube: <FaYoutube size={16} />,
    Instagram: <FaInstagram size={16} />,
    Twitter: <Twitter size={16} />,
    Website: <Globe size={16} />
};

/* ─── Detail Panel ─────────────────────────────────────────── */
const SpeakerDetailPanel = ({ speaker, onClose, isDark }) => {
    const { language } = useLanguage();
    const t = translations[language];
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
    }, [speaker, isMobile]);

    const handleClose = useCallback(() => {
        gsap.to(panelRef.current, {
            opacity: 0, duration: 0.25, onComplete: onClose,
        });
    }, [onClose]);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleClose]);

    return (
        <div
            ref={panelRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                fontFamily: FONT, opacity: 0, overflowY: isMobile ? 'auto' : 'hidden',
                background: isDark ? '#0d0d0d' : '#fff',
            }}
        >
            {/* Left: image panel */}
            <div
                style={{
                    width: isMobile ? '100%' : '42%',
                    height: isMobile ? '35vh' : 'auto',
                    background: isDark ? '#111' : '#1a1a1a',
                    display: 'flex', flexDirection: 'column',
                    position: 'relative', flexShrink: 0,
                }}
            >
                {!isMobile && (
                    <div style={{ padding: '28px 32px' }}>
                        <span style={{
                            fontWeight: 800, fontSize: '0.75rem',
                            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555',
                        }}>
                            <EditableText contentKey={`${language}.speakersPage.label`} tag="span" fallback={t.speakersPage.label} />
                        </span>
                    </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={speaker.image}
                        alt={speaker.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
                        pointerEvents: 'none',
                    }} />
                </div>
            </div>

            {/* Right: details */}
            <div
                ref={contentRef}
                style={{
                    flex: 1, background: isDark ? '#0d0d0d' : '#fff',
                    overflowY: isMobile ? 'visible' : 'auto',
                    display: 'flex', flexDirection: 'column',
                    padding: isMobile ? '24px 28px 48px 28px' : '28px 48px 48px 48px',
                    position: 'relative',
                }}
            >
                {/* Close */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
                    <button onClick={handleClose} aria-label="Close" style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        color: isDark ? '#666' : '#999', lineHeight: 1, fontSize: '0.7rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: FONT,
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <X size={14} />
                    </button>
                </div>

                {/* Name */}
                <h2 style={{
                    fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                    letterSpacing: '-0.03em', lineHeight: 1.05,
                    color: isDark ? '#f0f0f0' : '#111', margin: '0 0 12px 0',
                }}>
                    <EditableText contentKey={`${language}.speakersPage.speakers.${speaker.id}.name`} fallback={speaker.name} />
                </h2>

                {/* Role */}
                <p style={{
                    fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: '#06b6d4', marginBottom: 28,
                }}>
                    <EditableText contentKey={`${language}.speakersPage.speakers.${speaker.id}.role`} fallback={speaker.role} />
                </p>

                {/* Description */}
                <p style={{
                    fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.75,
                    color: isDark ? '#888' : '#555', maxWidth: 440, marginBottom: 40,
                }}>
                    <EditableText contentKey={`${language}.speakersPage.speakers.${speaker.id}.description`} fallback={speaker.description} multiline />
                </p>

                {/* Socials */}
                <div style={{ marginTop: 'auto' }}>
                    <p style={{
                        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: isDark ? '#444' : '#aaa',
                        marginBottom: 12,
                    }}>
                        <EditableText contentKey={`${language}.speakersPage.connect`} tag="span" fallback={t.speakersPage.connect} />
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {speaker.socials.map((social, i) => (
                            social.url && social.url !== '#' && (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '8px 16px', borderRadius: 9999,
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                                        color: isDark ? '#ccc' : '#555',
                                        fontSize: '0.8rem', fontWeight: 500,
                                        textDecoration: 'none', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#06b6d4';
                                        e.currentTarget.style.color = '#06b6d4';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                                        e.currentTarget.style.color = isDark ? '#ccc' : '#555';
                                    }}
                                >
                                    {social.icon || socialIconMap[social.name] || <Globe size={16} />}
                                    {social.name}
                                </a>
                            )
                        ))}
                    </div>
                </div>

                {/* Red dot */}
                <div style={{
                    position: 'absolute', bottom: 28, right: 28,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#dc2626', boxShadow: '0 0 10px rgba(220,38,38,0.6)',
                }} />
            </div>
        </div>
    );
};

/* ─── Grid Cell ────────────────────────────────────────────── */
const SpeakerGridCell = ({ speaker, onOpen, setHoverSpeaker, isDark }) => {
    const [hovered, setHovered] = useState(false);
    const imgRef = useRef(null);

    const handleEnter = () => {
        setHovered(true);
        setHoverSpeaker(speaker);
        gsap.fromTo(imgRef.current,
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
        );
    };

    const handleLeave = () => {
        setHovered(false);
        setHoverSpeaker(null);
        gsap.to(imgRef.current, { opacity: 0, scale: 1.04, duration: 0.3, ease: 'power2.in' });
    };

    const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';
    const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    return (
        <div
            onClick={() => onOpen(speaker)}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
                position: 'relative', aspectRatio: '4/3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: `1px solid ${borderColor}`,
                background: hovered ? hoverBg : 'transparent',
                transition: 'background 0.3s', overflow: 'hidden',
            }}
        >
            <div
                ref={imgRef}
                style={{
                    position: 'absolute', inset: 0, opacity: 0, zIndex: 1,
                }}
            >
                <img
                    src={speaker.image}
                    alt=""
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                        filter: isDark ? 'brightness(0.65)' : 'brightness(0.75)',
                    }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.12)',
                }} />
            </div>

            <div style={{
                position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'transform 0.3s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                padding: '16px 24px', textAlign: 'center',
            }}>
                <span style={{
                    fontFamily: FONT, fontWeight: 700,
                    fontSize: 'clamp(0.8rem, 1.4vw, 1.1rem)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: hovered ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'),
                    transition: 'color 0.3s', lineHeight: 1.2,
                }}>
                    {speaker.name}
                </span>
                <span style={{
                    fontFamily: FONT, fontWeight: 400, fontSize: '0.6rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: hovered ? 'rgba(255,255,255,0.7)' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'),
                    transition: 'color 0.3s',
                }}>
                    {speaker.role}
                </span>
            </div>
        </div>
    );
};

/* ─── Floating preview ────────────────────────────────────── */
const FloatingPreview = ({ src, visible }) => {
    const ref = useRef(null);
    useEffect(() => {
        const move = (e) => {
            if (!ref.current) return;
            gsap.to(ref.current, {
                x: e.clientX + 20, y: e.clientY - 100,
                duration: 0.4, ease: 'power2.out',
            });
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);
    return (
        <div
            ref={ref}
            style={{
                position: 'fixed', top: 0, left: 0, width: 260, height: 320,
                pointerEvents: 'none', zIndex: 9000,
                opacity: visible ? 1 : 0, transform: 'translate(0,0)',
                transition: 'opacity 0.25s ease', overflow: 'hidden',
                borderRadius: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
        >
            {src && (
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
        </div>
    );
};

/* ─── SpeakersPage ─────────────────────────────────────────── */
const SpeakersPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];

    const [activeSpeaker, setActiveSpeaker] = useState(null);
    const [hoverSpeaker, setHoverSpeaker] = useState(null);
    const [mounted, setMounted] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const dotRef = useRef(null);

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
            { opacity: 1, y: 0, duration: 1.1 }, '-=0.2'
        );
        tl.fromTo(descRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75 }, '-=0.6'
        );
        return () => tl.kill();
    }, [mounted]);

    const bg = isDark ? '#0a0a0a' : '#f0eeec';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#555' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

    return (
        <div style={{
            minHeight: '100vh', background: bg, color: text, fontFamily: FONT, overflowX: 'hidden',
        }}>
            <Meta
                title={t.speakersPage.metaTitle}
                description={t.speakersPage.metaDesc}
            />
            <SharedNavbar transparentHero={false} />

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <header style={{
                padding: 'clamp(80px, 14vh, 140px) clamp(24px, 5vw, 80px) 0',
                position: 'relative',
            }}>
                <div ref={dotRef} style={{
                    position: 'absolute', left: '48%',
                    top: 'clamp(110px, 15vh, 155px)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#dc2626', boxShadow: '0 0 12px rgba(220,38,38,0.7)',
                    opacity: 0,
                }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0, position: 'relative' }}>
                    <div>
                        <h1
                            ref={titleRef}
                            style={{
                                fontWeight: 300, fontSize: 'clamp(2.8rem, 9vw, 9rem)',
                                letterSpacing: '-0.04em', lineHeight: 0.92, color: text, margin: 0, opacity: 0,
                            }}
                        >
                            <EditableText contentKey={`${language}.speakersPage.title`} fallback={t.speakersPage.title} /><br />
                            <span style={{ fontWeight: 800 }}>
                                <EditableText contentKey={`${language}.speakersPage.titleBold`} fallback={t.speakersPage.titleBold} />
                            </span>
                        </h1>
                    </div>
                    <div ref={descRef} style={{ paddingTop: 20, paddingBottom: 32, opacity: 0 }}>
                        <p style={{
                            fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.7,
                            color: muted, maxWidth: 400, margin: 0,
                        }}>
                            <EditableText contentKey={`${language}.speakersPage.subtitle`} fallback={t.speakersPage.subtitle} />
                        </p>
                    </div>
                </div>
            </header>

            {/* Separator */}
            <div style={{ height: 1, background: border, margin: '0 clamp(24px, 5vw, 80px)' }} />

            {/* ─── Grid ─────────────────────────────────────────────── */}
            <main style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
                }}>
                    {speakers.map(s => (
                        <SpeakerGridCell
                            key={s.id}
                            speaker={s}
                            onOpen={setActiveSpeaker}
                            setHoverSpeaker={setHoverSpeaker}
                            isDark={isDark}
                        />
                    ))}
                </div>
            </main>

            {/* Floating preview */}
            <FloatingPreview src={hoverSpeaker?.image || null} visible={!!hoverSpeaker} />

            {/* Modal Detail Panel */}
            {activeSpeaker && (
                <SpeakerDetailPanel
                    speaker={activeSpeaker}
                    onClose={() => setActiveSpeaker(null)}
                    isDark={isDark}
                />
            )}

            <Footer translations={t} />
        </div>
    );
};

export default SpeakersPage;
