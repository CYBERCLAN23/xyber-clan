import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

/* ─── Project Data ────────────────────────────────────────────────── */
const projects = [
    {
        id: 1,
        client: 'NB Dance Awards',
        logoText: 'NB Dance',
        image: '/portfolio/portfolio_nbdance_1766276075058.png',
        previewImage: '/portfolio/portfolio_nbdance_1766276075058.png',
        url: 'https://www.nbdanceawards.app/',
        category: 'Event Platform',
        status: 'Live',
        geography: 'Cameroon',
        industry: 'Entertainment',
        description: 'A comprehensive event voting and ticketing platform for dance competitions. Features real-time voting, mobile money payments, and live results broadcasting.',
    },
    {
        id: 2,
        client: 'Vanguard Elite',
        logoText: 'VANGUARD',
        image: '/portfolio/portfolio_vanguard_1766276251484.png',
        previewImage: '/portfolio/portfolio_vanguard_1766276251484.png',
        url: 'https://vangaurd-elite.vercel.app/',
        category: 'Corporate Identity',
        status: 'Live',
        geography: 'Global',
        industry: 'Security',
        description: 'Premium corporate website for a security and executive protection firm. Features elegant design, service showcase, and secure contact systems.',
    },
    {
        id: 3,
        client: 'African Marketplace',
        logoText: 'AfriMarket',
        image: '/portfolio/portfolio_marketplace_1766277433883.png',
        previewImage: '/portfolio/portfolio_marketplace_1766277433883.png',
        url: 'https://v0-africanmarketplace22.vercel.app/',
        category: 'E-Commerce',
        status: 'Live',
        geography: 'Africa',
        industry: 'Retail',
        description: 'Multi-vendor e-commerce platform connecting African artisans with global buyers. Features product listings, secure checkout, and vendor dashboards.',
    },
    {
        id: 4,
        client: 'Devil Pool',
        logoText: 'DEVIL POOL',
        image: '/portfolio/portfolio_devilpool_1766276804758.png',
        previewImage: '/portfolio/portfolio_devilpool_1766276804758.png',
        url: 'https://devil-po-ol.vercel.app/',
        category: 'Creative Portfolio',
        status: 'Live',
        geography: 'Global',
        industry: 'Creative',
        description: 'Stunning creative portfolio with immersive animations and visual storytelling. Features smooth transitions, Three.js effects, and interactive elements.',
    },
    {
        id: 5,
        client: 'XyberShield App',
        logoText: 'XyberShield',
        image: '/portfolio/portfolio_xybershield_app_1766276389826.png',
        previewImage: '/portfolio/portfolio_xybershield_app_1766276389826.png',
        url: '#',
        category: 'Cybersecurity',
        status: 'In Portfolio',
        geography: 'Cameroon',
        industry: 'Technology',
        description: 'Mobile cybersecurity application providing real-time threat detection, VPN services, and security auditing for enterprise clients.',
    },
    {
        id: 6,
        client: 'Secure Login UI',
        logoText: 'SecureAuth',
        image: '/portfolio/portfolio_blur_login_1766277063816.png',
        previewImage: '/portfolio/portfolio_blur_login_1766277063816.png',
        url: 'https://v0-login-screen-blur.vercel.app/',
        category: 'Security UI',
        status: 'Live',
        geography: 'Global',
        industry: 'Technology',
        description: 'Modern authentication interface with glassmorphism design. Features secure input handling, animated backgrounds, and responsive layout.',
    },
    {
        id: 7,
        client: 'XyberShield Web',
        logoText: 'XyberShield Web',
        image: '/portfolio/portfolio_xybershield_web_1766276548512.png',
        previewImage: '/portfolio/portfolio_xybershield_web_1766276548512.png',
        url: '#',
        category: 'Web Application',
        status: 'In Portfolio',
        geography: 'Africa',
        industry: 'Technology',
        description: 'Web dashboard for XyberShield security platform. Real-time threat monitoring, incident response, and network visualisation for enterprise clients.',
    },
];

const CATEGORIES = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

/* ─── Hover image that follows mouse ─────────────────────────────── */
const FloatingPreview = ({ src, visible }) => {
    const ref = useRef(null);

    useEffect(() => {
        const move = (e) => {
            if (!ref.current) return;
            gsap.to(ref.current, {
                x: e.clientX + 20,
                y: e.clientY - 100,
                duration: 0.4,
                ease: 'power2.out',
            });
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 280,
                height: 190,
                pointerEvents: 'none',
                zIndex: 9000,
                opacity: visible ? 1 : 0,
                transform: 'translate(0,0)',
                transition: 'opacity 0.25s ease',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
        >
            {src && (
                <img
                    src={src}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            )}
        </div>
    );
};

/* ─── Detail Panel ────────────────────────────────────────────────── */
const DetailPanel = ({ project, onClose, isDark }) => {
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
    }, [project, isMobile]);

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

    const metaRows = [
        { label: 'Category', value: project.category },
        { label: 'Status', value: project.status },
        { label: 'Geography', value: project.geography },
        { label: 'Industry', value: project.industry },
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
            {/* ── Left: dark panel with logo + image ── */}
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
                            {project.client}
                        </span>
                    </div>
                )}

                {/* Project image — fills remaining space */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={project.image}
                        alt={project.client}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    {/* subtle dark vignette */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
                    }} />
                </div>
            </div>

            {/* ── Right: light panel with details ── */}
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
                {/* Close button — top right */}
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

                {/* Project name */}
                <h2 style={{
                    fontWeight: 300,
                    fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: isDark ? '#f0f0f0' : '#111',
                    margin: '0 0 40px 0',
                }}>
                    {project.client}
                </h2>

                {/* Metadata rows */}
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
                    {project.description}
                </p>

                {/* Visit link */}
                {project.url && project.url !== '#' && (
                    <a
                        href={project.url}
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
                        Visit the site
                        <ArrowUpRight size={14} />
                    </a>
                )}

                {/* Red dot — bottom right (brand accent matching reference) */}
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

/* ─── Logo Grid Cell ──────────────────────────────────────────────── */
const GridCell = ({ project, onOpen, setHoverProject, isDark }) => {
    const [hovered, setHovered] = useState(false);
    const cellRef = useRef(null);
    const imgRef = useRef(null);

    const handleEnter = () => {
        setHovered(true);
        setHoverProject(project);
        gsap.fromTo(imgRef.current,
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
        );
    };

    const handleLeave = () => {
        setHovered(false);
        setHoverProject(null);
        gsap.to(imgRef.current, { opacity: 0, scale: 1.04, duration: 0.3, ease: 'power2.in' });
    };

    const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';
    const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    return (
        <div
            ref={cellRef}
            onClick={() => onOpen(project)}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
                position: 'relative',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: `1px solid ${borderColor}`,
                background: hovered ? hoverBg : 'transparent',
                transition: 'background 0.3s',
                overflow: 'hidden',
            }}
        >
            {/* Project image — only visible on hover */}
            <div
                ref={imgRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    zIndex: 1,
                }}
            >
                <img
                    src={project.previewImage}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: isDark ? 'brightness(0.65)' : 'brightness(0.75)',
                    }}
                />
                {/* overlay so the logo still reads on top */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                        ? 'rgba(0,0,0,0.45)'
                        : 'rgba(255,255,255,0.12)',
                }} />
            </div>

            {/* Logo / wordmark — always visible, on top of image */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'transform 0.3s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                padding: '16px 24px',
                textAlign: 'center',
            }}>
                <span style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 'clamp(0.8rem, 1.4vw, 1.1rem)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: hovered
                        ? '#fff'
                        : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'),
                    transition: 'color 0.3s',
                    lineHeight: 1.2,
                }}>
                    {project.logoText}
                </span>
                <span style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: '0.6rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: hovered
                        ? 'rgba(255,255,255,0.7)'
                        : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'),
                    transition: 'color 0.3s',
                }}>
                    {project.category}
                </span>
            </div>
        </div>
    );
};

/* ─── Main Export ─────────────────────────────────────────────────── */
const PortfolioGrid = ({ activeFilter = 'All' }) => {
    const { isDark } = useTheme();
    const [activeProject, setActiveProject] = useState(null);
    const [hoverProject, setHoverProject] = useState(null);

    const filtered = activeFilter === 'All'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    const bgColor = isDark ? '#0a0a0a' : '#f0eeec';

    return (
        <section style={{ background: bgColor, fontFamily: FONT }}>
            {/* Logo grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
            }}>
                {filtered.map(project => (
                    <GridCell
                        key={project.id}
                        project={project}
                        onOpen={setActiveProject}
                        setHoverProject={setHoverProject}
                        isDark={isDark}
                    />
                ))}
            </div>

            {/* Floating image preview that follows cursor */}
            <FloatingPreview
                src={hoverProject?.previewImage || null}
                visible={!!hoverProject}
            />

            {/* Detail panel */}
            {activeProject && (
                <DetailPanel
                    project={activeProject}
                    onClose={() => setActiveProject(null)}
                    isDark={isDark}
                />
            )}
        </section>
    );
};

export { CATEGORIES };
export default PortfolioGrid;
