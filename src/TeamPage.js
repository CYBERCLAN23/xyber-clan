import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { FiShield, FiCode, FiFeather, FiZap, FiWifi } from 'react-icons/fi';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { gsap } from 'gsap';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';
import EditableImage from './components/cms/EditableImage';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const detailedTeam = [
    {
        id: 1,
        image: '/team/ceo-member.jpg',
        name: 'Cedrik Darel Yepmo',
        role: 'Co-Founder, CEO & Cybersecurity Analyst',
        icon: <FiShield size={20} />,
        description: "Founder and lead technologist of XyberClan. Cedrik architects and ships AI-powered fullstack web products while conducting cybersecurity analysis and maintaining high-quality data annotation pipelines — uniting executive vision with hands-on engineering.",
        expertise: ['Fullstack AI Web Development', 'Data Annotation', 'Cybersecurity Analysis', 'Strategic Leadership'],
        geography: 'Cameroon',
        industry: 'Cybersecurity & AI Engineering',
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
        role: 'Co-Founder & CTO / AI Security Architect',
        icon: <FiShield size={20} />,
        description: 'Chief Technology Officer and elite Red Teamer at XyberClan. Josias designs AI security architectures, leads offensive security engagements, and engineers cross-platform mobile applications (Flutter) — ensuring every system XyberClan delivers is robust, intelligent, and breach-resilient.',
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
        id: 4,
        image: '/team/ange-demanou.png',
        name: 'Ange Demanou',
        role: 'Data Analyst & UI/UX Designer',
        icon: <FiFeather size={20} />,
        description: 'UI/UX designer, web developer, and data professional at XyberClan. Ange designs intuitive user experiences, builds web interfaces, conducts data and junior business analysis, and manages social media strategy with a data-driven approach — all while actively advancing her expertise in machine learning research.',
        expertise: ['UI/UX Design', 'Web Development', 'Data Analysis', 'Business Analysis (Junior)', 'Machine Learning', 'Social Media Management'],
        geography: 'Cameroon',
        industry: 'UI/UX Design & Data Analytics',
        socials: [
            { name: 'LinkedIn', icon: <FaLinkedinIn size={16} />, url: 'https://www.linkedin.com/in/ange-demanou-367466340/' },
            { name: 'GitHub', icon: <FaGithub size={16} />, url: '#' }
        ],
        portfolio: 'https://www.linkedin.com/in/ange-demanou-367466340/'
    },
    {
        id: 5,
        image: '/team/communications-manager.jpeg?v=2',
        name: 'ONANA GREGOIRE LEGRAND',
        role: 'Co-Founder, COO, IT & Cybersecurity Engineer',
        icon: <FiShield size={20} />,
        description: "Co-Founder and operational backbone of XyberClan. Onana drives high-level business strategy, manages IT infrastructure, and applies cybersecurity engineering to protect systems and data — combining Python-driven data analysis with operational leadership to scale every project to a globally competitive standard.",
        expertise: ['Business Strategy', 'IT Engineering', 'Cybersecurity', 'Python Data Science', 'Operational Precision', 'Market Analysis'],
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
        description: 'Visual content specialist and brand designer at XyberClan. William produces high-impact graphics and branded assets that communicate complex ideas clearly — maintaining a consistent, premium visual identity across all platforms and campaigns.',
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
        image: '/team/theresa-tcheme.jpg',
        name: 'Theresa Tcheme',
        role: 'Media Manager & UI/UX Designer',
        icon: <FiZap size={20} />,
        description: '2nd-year Computer Science student at Université de Yaoundé I. Co-Founder & CEO of Greenfarmers. GDG Yaoundé Volunteer and Organiser of the Hult Prize OnCampus programme at the University of Yaoundé I — driving entrepreneurship, sustainability, and technology on campus.',
        expertise: ['Entrepreneurship', 'UI/UX Design', 'Community Leadership', 'Event Organisation', 'Media & Communications', 'GDG Volunteering'],
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
        image: '/team/frontend-designer.png',
        name: 'ADJIA MVOA NDJI GABRIEL MONFILS',
        role: 'Fullstack Dev & Systems Engineer',
        icon: <FiCode size={20} />,
        description: 'Computer science student at Université de Yaoundé I and a multidisciplinary engineer at XyberClan. Gabriel designs and builds fullstack web applications, writes low-level code in C and Assembly, administers Linux systems, develops games with Godot, conducts offensive and defensive cybersecurity operations, architects networks, orchestrates AI workflows via n8n, and applies financial market analysis — combining academic rigour with real-world engineering delivery.',
        expertise: ['Fullstack Development', 'C & Assembly', 'Linux Sysadmin', 'Game Dev (Godot)', 'Cybersecurity', 'Network Architecture', 'AI Workflows (n8n)', 'Financial Analysis'],
        geography: 'Cameroon',
        industry: 'Software Engineering & Cybersecurity',
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
        role: 'Cybersecurity, DevOps & AI Systems Engineer',
        icon: <FiShield size={20} />,
        description: 'Cybersecurity engineer, DevOps practitioner, and systems architect at XyberClan. Lembou conducts penetration testing, automates and manages CI/CD infrastructure, builds secure web and mobile applications (Flutter), and applies AI to harden systems — delivering solutions that are intelligent, resilient, and production-ready.',
        expertise: ['Penetration Testing', 'DevOps & CI/CD', 'Systems Engineering', 'Applied AI', 'Mobile Dev (Flutter)'],
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
        description: 'Network engineer and Python developer at XyberClan. CCNA-certified, Yann Félix designs and maintains robust network infrastructures, develops automation and data tooling in Python, and contributes graphic design expertise — bridging technical depth with clear visual communication.',
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
    const { language } = useLanguage();
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
        { label: 'Role', key: 'role', value: member.role },
        { label: 'Geography', key: 'geography', value: member.geography },
        { label: 'Industry', key: 'industry', value: member.industry },
        { label: 'Key Expertise', key: 'expertise', value: member.expertise.slice(0, 3).join(', ') },
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
                    <EditableImage
                        contentKey={`${language}.teamPage.members.${member.id}.image`}
                        src={member.image}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
                        pointerEvents: 'none',
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
                    <EditableText contentKey={`${language}.teamPage.members.${member.id}.name`} fallback={member.name} />
                </h2>

                {/* Metadata */}
                <div style={{
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    marginBottom: 36,
                }}>
                    {metaRows.map(({ label, key, value }) => (
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
                                <EditableText contentKey={`${language}.teamPage.members.${member.id}.${key}`} fallback={value} />
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
                    <EditableText contentKey={`${language}.teamPage.members.${member.id}.description`} fallback={member.description} multiline />
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
    const { language } = useLanguage();
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
                    <EditableText contentKey={`${language}.teamPage.members.${member.id}.name`} fallback={member.name} />
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
                    <EditableText contentKey={`${language}.teamPage.members.${member.id}.role`} fallback={member.role} />
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
                title="Our Expert Team | XyberClan Engineers & Strategists"
                description="Meet the visionaries, full-stack developers, and cybersecurity engineers at XyberClan. Our team is dedicated to building secure tech innovations and premium digital solutions."
            />
            <SharedNavbar transparentHero={false} />

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <header className="team-hero" style={{
                padding: 'clamp(80px, 14vh, 140px) clamp(24px, 5vw, 80px) 0',
                position: 'relative',
            }}>
                <div ref={dotRef} className="team-hero-dot" style={{
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

                <div style={{
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
                            <EditableText contentKey={`${language}.teamPage.title`} fallback={t.teamPage.title} /><br />
                            <span style={{ fontWeight: 800 }}><EditableText contentKey={`${language}.teamPage.titleBold`} fallback={t.teamPage.titleBold} /></span>
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
                            <EditableText contentKey={`${language}.teamPage.subtitle`} fallback={t.teamPage.subtitle} />
                        </p>
                    </div>
                </div>

                <style>{`
                    @media (min-width: 768px) {
                        .team-hero > div:first-child > div { grid-template-columns: 1fr 1fr !important; gap: 0 40px !important; }
                        .team-hero-dot { display: block !important; }
                    }
                    @media (max-width: 767px) {
                        .team-hero-dot { display: none !important; }
                    }
                `}</style>
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
