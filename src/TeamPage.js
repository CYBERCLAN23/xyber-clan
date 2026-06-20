import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { FiShield, FiCode, FiMonitor, FiBriefcase, FiFeather, FiZap, FiWifi } from 'react-icons/fi';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { gsap } from 'gsap';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import Meta from './components/Meta';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const detailedTeam = [
    {
        id: 1,
        image: '/team/ceo-member.jpg',
        name: 'Cedrik Darel Yepmo',
        role: 'CEO & Co-Founder',
        icon: <FiBriefcase size={20} />,
        description: "Visionary leader driving XyberClan's mission to deliver world-class digital solutions across Cameroon. Expert in strategic planning and business development.",
        expertise: ['Strategic Leadership', 'Business Development', 'Vision & Planning'],
        geography: 'Cameroon',
        industry: 'Executive / Strategy',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/cedrik-darel-yepmo-b0544034a/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/cedarroyal21' }
        ],
        portfolio: 'https://www.linkedin.com/in/cedrik-darel-yepmo-b0544034a/'
    },
    {
        id: 2,
        image: '/team/cto-redteamer.jpg',
        name: 'AKANA SIGNING JOSIAS AARON',
        role: 'CTO & AI Security Architect',
        icon: <FiShield size={20} />,
        description: 'Strategic technology leader and elite Red Teamer specializing in the intersection of cybersecurity and AI. He is an expert in Web & Mobile development (Flutter), networking infrastructure, and computer maintenance, driving innovation through intelligent and secure engineering.',
        expertise: ['Red Teaming', 'LLM Architect', 'Mobile Dev (Flutter)', 'Network Engineering', 'Computer Maintenance'],
        geography: 'Cameroon',
        industry: 'Cybersecurity & Engineering',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/akana-signing-josias-aaron/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/Josiasange37' }
        ],
        portfolio: 'https://almightportfolio.vercel.app/'
    },
    {
        id: 3,
        image: '/team/dev-member.jpg',
        name: 'YVANA EMILIA LALANE LARCIER',
        role: 'Frontend Developer',
        icon: <FiMonitor size={20} />,
        description: 'Expert in modern web technologies and creating seamless user experiences. Passionate about clean code and innovative solutions.',
        expertise: ['React & Next.js', 'UI/UX Implementation', 'Responsive Design'],
        geography: 'Global / Remote',
        industry: 'Software Development',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/yvana-emilia-lalane-larcier-50761337b/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/lalanelarcier-ai' }
        ],
        portfolio: 'https://www.linkedin.com/in/yvana-emilia-lalane-larcier-50761337b/'
    },
    {
        id: 4,
        image: '/team/ange-demanou.png',
        name: 'Ange Demanou',
        role: 'Digital Generalist & Data Analyst',
        icon: <FiFeather size={20} />,
        description: 'A versatile polymath bridging technology and business. Her multidisciplinary stack includes Web Development, Data & Business Analysis, Graphic Design, and Machine Learning research. She also manages social media strategy with a data-driven approach.',
        expertise: ['Web Development', 'Data Analysis', 'Machine Learning', 'Graphic Design', 'Social Media Management', 'Business Analysis'],
        geography: 'Cameroon',
        industry: 'Data & Analytics',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/ange-demanou-367466340/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: '#' }
        ],
        portfolio: 'https://www.linkedin.com/in/ange-demanou-367466340/'
    },
    {
        id: 5,
        image: '/team/communications-manager.jpg',
        name: 'ONANA GREGOIRE LEGRAND',
        role: 'Co-Founder & Business Strategist',
        icon: <FiCode size={20} />,
        description: "A strategic mastermind and technical architect, Onana Gregoire Legrand is the engine behind XyberClan's operational precision. He combines advanced Python data analysis with high-level business strategy to optimize growth, identify market opportunities, and ensures every project scales towards global standards.",
        expertise: ['Business Strategy', 'Python Data Science', 'Operational Precision', 'Market Analysis'],
        geography: 'Cameroon',
        industry: 'Business Intelligence',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/onana-gregoire-legrand-a18529282/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/psycho237-prog' }
        ],
        portfolio: 'https://psycho.is-a.dev'
    },
    {
        id: 6,
        image: '/team/william-chandler.png',
        name: 'William Chandler',
        role: 'Visual Content & Canva Designer',
        icon: <FiFeather size={20} />,
        description: 'A visual architect who masters the art of high-impact design through Canva. He brings ideas to life with stunning graphics, ensuring every piece of content tells a compelling story and maintains a pristine brand identity.',
        expertise: ['Canva Pro Design', 'Visual Storytelling', 'Social Media Branding'],
        geography: 'Cameroon',
        industry: 'Branding & Design',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/william-chandler-106147353/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/Evina-Darren' }
        ],
        portfolio: 'https://www.linkedin.com/in/william-chandler-106147353/'
    },
    {
        id: 7,
        image: '/team/theresa-tcheme.png',
        name: 'Theresa Tcheme',
        role: 'Media & Communication Manager',
        icon: <FiZap size={20} />,
        description: 'Expert in media relations and strategic communications. Theresa leads the narrative at XyberClan, ensuring a consistent and impactful brand voice across all digital channels and media platforms.',
        expertise: ['Media Relations', 'Strategic Communication', 'Digital Storytelling'],
        geography: 'Cameroon',
        industry: 'Communications & Media',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/theresa-tcheme-a5402a358/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: '#' }
        ],
        portfolio: 'https://www.linkedin.com/in/theresa-tcheme-a5402a358/'
    },
    {
        id: 8,
        image: '/team/frontend-designer.jpg',
        name: 'Zealda Junior',
        role: 'Web Developer & Network Associate',
        icon: <FiCode size={20} />,
        description: 'A multidisciplinary technician blending the worlds of network engineering and modern web development. Zealda specializes in building responsive interfaces and designing intuitive user journeys in Figma, while maintaining a strong focus on the underlying network infrastructure.',
        expertise: ['Web Development', 'Figma Design', 'Network Engineering'],
        geography: 'Cameroon',
        industry: 'Frontend & Networks',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/zealda-junior-9352b1277/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/zealdajunior' }
        ],
        portfolio: 'https://www.linkedin.com/in/zealda-junior-9352b1277/'
    },
    {
        id: 9,
        image: '/team/cybersecurity-chief.jpg',
        name: 'Lembou Pharel',
        role: 'Cybersecurity, AI & Systems Engineer',
        icon: <FiShield size={20} />,
        description: 'Expert in cybersecurity, web development, and mobile applications using Flutter. He bridges systems engineering with applied AI to build resilient, intelligent, and secure software solutions.',
        expertise: ['Penetration Testing', 'Systems Engineering', 'Applied AI', 'Mobile Dev (Flutter)'],
        geography: 'Cameroon',
        industry: 'Cybersecurity & AI',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/lembou-pharel/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: 'https://github.com/lemboupharel' }
        ],
        portfolio: 'https://www.pharel.dev'
    },
    {
        id: 10,
        image: '/team/yann-felix-wandji.png',
        name: 'Wandji Tchaleu Yann Félix',
        role: 'Network Engineer, Python Dev & Designer',
        icon: <FiWifi size={20} />,
        description: 'A versatile technician with a strong foundation in networking infrastructure (CCNA certified), Python development, and creative design. Yann Félix bridges the gap between robust network architecture and elegant visual communication, ensuring solutions are both technically sound and beautifully presented.',
        expertise: ['Réseau & CCNA', 'Python Development', 'Graphic Design', 'Network Infrastructure'],
        geography: 'Cameroon',
        industry: 'Networks & Development',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: '#' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: '#' }
        ],
        portfolio: '#'
    }
];

/* ─── Hover photo that follows mouse ─────────────────────────────── */
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
                width: 260,
                height: 320,
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
const TeamDetailPanel = ({ member, onClose, isDark }) => {
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
    }, [member, isMobile]);

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
        { label: 'Role', value: member.role },
        { label: 'Geography', value: member.geography },
        { label: 'Industry', value: member.industry },
        { label: 'Key Expertise', value: member.expertise.slice(0, 3).join(', ') },
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
            {/* ── Left: dark panel with member image ── */}
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
                            XyberClan Team
                        </span>
                    </div>
                )}

                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={member.image}
                        alt={member.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
                    }} />
                </div>
            </div>

            {/* ── Right: details ── */}
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

                {/* Name */}
                <h2 style={{
                    fontWeight: 300,
                    fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: isDark ? '#f0f0f0' : '#111',
                    margin: '0 0 40px 0',
                }}>
                    {member.name}
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
                                paddingLeft: 16,
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
                    {member.description}
                </p>

                {/* Socials & Portfolio */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {member.socials.map((social, i) => (
                            social.url && social.url !== '#' && (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                                        color: isDark ? '#ccc' : '#555',
                                        transition: 'all 0.2s',
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
                                    {social.icon}
                                </a>
                            )
                        ))}
                    </div>

                    {member.portfolio && member.portfolio !== '#' && (
                        <a
                            href={member.portfolio}
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
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Visit Portfolio
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>

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

/* ─── Grid Cell ──────────────────────────────────────────────── */
const GridCell = ({ member, onOpen, setHoverMember, isDark }) => {
    const [hovered, setHovered] = useState(false);
    const cellRef = useRef(null);
    const imgRef = useRef(null);

    const handleEnter = () => {
        setHovered(true);
        setHoverMember(member);
        gsap.fromTo(imgRef.current,
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
        );
    };

    const handleLeave = () => {
        setHovered(false);
        setHoverMember(null);
        gsap.to(imgRef.current, { opacity: 0, scale: 1.04, duration: 0.3, ease: 'power2.in' });
    };

    const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';
    const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    return (
        <div
            ref={cellRef}
            onClick={() => onOpen(member)}
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
            {/* Photo — only visible on hover */}
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
                    src={member.image}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: isDark ? 'brightness(0.65)' : 'brightness(0.75)',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                        ? 'rgba(0,0,0,0.45)'
                        : 'rgba(255,255,255,0.12)',
                }} />
            </div>

            {/* Title / Role */}
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
                    {member.name}
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
                    {member.role}
                </span>
                <span style={{
                    fontFamily: FONT,
                    fontWeight: 500,
                    fontSize: '0.5rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: hovered
                        ? 'rgba(255,255,255,0.45)'
                        : 'transparent',
                    transition: 'color 0.35s ease, opacity 0.35s ease',
                    marginTop: 4,
                    opacity: hovered ? 1 : 0,
                }}>
                    Click for more
                </span>
            </div>
        </div>
    );
};

/* ─── TeamPage Component ──────────────────────────────────────────── */
const TeamPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];

    const [activeProject, setActiveProject] = useState(null);
    const [hoverProject, setHoverProject] = useState(null);
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

    const bg = isDark ? '#0a0a0a' : '#f0eeec';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#555' : '#888';
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
                title="Our Expert Team | Engineering the Future"
                description="Meet the visionaries, developers, and cybersecurity experts at XyberClan. Our team is dedicated to building innovative digital solutions for Cameroon and the world."
            />
            <SharedNavbar transparentHero={false} />

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <header style={{
                padding: 'clamp(100px, 14vh, 140px) clamp(24px, 5vw, 80px) 0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'auto auto',
                gap: '0 40px',
                position: 'relative',
            }}>
                <div ref={dotRef} style={{
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

                <div />

                <div>
                    <h1
                        ref={titleRef}
                        style={{
                            fontWeight: 300,
                            fontSize: 'clamp(3.8rem, 9vw, 9rem)',
                            letterSpacing: '-0.04em',
                            lineHeight: 0.92,
                            color: text,
                            margin: 0,
                            opacity: 0,
                        }}
                    >
                        Meet Our<br />
                        <span style={{ fontWeight: 800 }}>Specialists</span>
                    </h1>
                </div>

                <div ref={descRef} style={{ paddingTop: 40, paddingBottom: 48, opacity: 0 }}>
                    <p style={{
                        fontSize: '0.9rem',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        color: muted,
                        maxWidth: 260,
                        margin: 0,
                    }}>
                        A premium collective of engineers, designers, and strategists working together to build exceptional technologies.
                    </p>
                </div>

                <div />
            </header>

            {/* Separator */}
            <div style={{
                height: 1,
                background: border,
                margin: '0 clamp(24px, 5vw, 80px)',
            }} />

            {/* ─── Grid ─────────────────────────────────────────────────── */}
            <main style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
                }}>
                    {detailedTeam.map(member => (
                        <GridCell
                            key={member.id}
                            member={member}
                            onOpen={setActiveProject}
                            setHoverMember={setHoverProject}
                            isDark={isDark}
                        />
                    ))}
                </div>
            </main>

            {/* Floating preview on hover */}
            <FloatingPreview
                src={hoverProject?.image || null}
                visible={!!hoverProject}
            />

            {/* Modal Detail Panel */}
            {activeProject && (
                <TeamDetailPanel
                    member={activeProject}
                    onClose={() => setActiveProject(null)}
                    isDark={isDark}
                />
            )}

            {/* ─── Footer ─── */}
            <Footer translations={t} />
        </div>
    );
};

export default TeamPage;
