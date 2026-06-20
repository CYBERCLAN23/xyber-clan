import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import { ArrowRight, Handshake, Trophy, Users, Globe, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';
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

    const t = translations[language];
    const p = t.partnersPage;

    const sectionRef = useRef(null);
    const bgParallaxRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const textRef = useRef(null);
    const statsRef = useRef([]);
    const ctaSectionRef = useRef(null);
    const ctaTitleRef = useRef(null);
    const ctaCardsRef = useRef([]);

    const bg = isDark ? '#0a0a0a' : '#f5f4f2';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    const heroBg = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14, filter: 'blur(4px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 60, scale: 0.95, filter: 'blur(6px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 30, filter: 'blur(3px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out',
                    scrollTrigger: { trigger: textRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 50, scale: 0.9, filter: 'blur(4px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: statsRef.current[0], start: 'top 88%', once: true } }
            );
            gsap.fromTo(bgParallaxRef.current,
                { scale: 1, opacity: 0.1 },
                { scale: 1.15, opacity: 0.06, ease: 'none',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
            );
            gsap.fromTo(ctaTitleRef.current,
                { opacity: 0, y: 30, filter: 'blur(4px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)',
                    duration: 0.9, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ctaSectionRef.current,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
            gsap.fromTo(ctaCardsRef.current,
                { opacity: 0, y: 60, scale: 0.92 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ctaSectionRef.current,
                        start: 'top 75%',
                        once: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const openForm = (type) => {
        setFormType(type);
        setIsFormOpen(true);
    };

    const handleFormComplete = (summary) => {
        console.log("Form completed:", summary);
    };

    return (
        <div style={{ background: bg, color: text, fontFamily: FONT }} className="min-h-screen transition-colors duration-300">
            <Meta
                title="Our Strategic Partners | Collaborative Innovation"
                description="Discover XyberClan's strategic alliances, including our technical sponsorship of Hult Prize UY1. We collaborate to drive social and technological impact."
            />
            <SharedNavbar transparentHero={true} />

            <PageHero
                lang={language}
                contentKeyPrefix={`${language}.partnersPage.hero`}
                badgeText={t.nav.partners}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc=""
                heroBg={heroBg}
                stats={[
                    { value: 'Global', label: 'Reach' },
                    { value: '100%', label: 'Commitment' }
                ]}
                trustBadges={[
                    { icon: <Handshake size={14} />, label: 'Strategic Alliance' },
                    { icon: <Globe size={14} />, label: 'Worldwide Network' }
                ]}
                transitionLabel="Partners"
            />

            {/* ─── HULT PRIZE — THE STRATEGIC PARTNER ─── */}
            <section
                ref={sectionRef}
                className="relative overflow-hidden"
                style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            >
                <div ref={bgParallaxRef} className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, #06b6d4 0%, transparent 70%)` }} />
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
                        <div>
                            <p ref={labelRef} className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: '#06b6d4', opacity: 0 }}>
                                Strategic Partnership
                            </p>
                            <h2 ref={headRef} className="leading-[0.9] tracking-[-0.03em]" style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}>
                                <EditableText contentKey={`${language}.partnersPage.hultStory.title`} fallback={p.hultStory.title} />
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: muted, fontWeight: 300 }}>
                            Technical sponsorship powering the next generation of social entrepreneurs at UY1.
                        </p>
                    </div>

                    <div ref={textRef} className="max-w-3xl space-y-5 mb-16 text-[15px] leading-relaxed" style={{ color: muted, fontWeight: 300, opacity: 0 }}>
                        {p.hultStory.narrative.map((paragraph, idx) => (
                            <p key={idx}>
                                <EditableText contentKey={`${language}.partnersPage.hultStory.narrative${idx}`} fallback={paragraph} multiline />
                            </p>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {HULT_STATS.map((stat, idx) => (
                            <div
                                key={idx}
                                ref={el => statsRef.current[idx] = el}
                                className="group p-8 rounded-2xl border flex items-start gap-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                                style={{
                                    opacity: 0,
                                    borderColor: border,
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                }}
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[#06b6d4] group-hover:bg-[#06b6d4] group-hover:text-white transition-colors duration-300" style={{ background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)' }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-black mb-0.5" style={{ color: text }}>{stat.value}</div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: muted }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA SECTION ─── */}
            <section ref={ctaSectionRef} className="relative overflow-hidden" style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36 text-center">
                    <div ref={ctaTitleRef} className="space-y-4 mb-16" style={{ opacity: 0 }}>
                        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: '#06b6d4' }}>
                            Get Involved
                        </p>
                        <h2 className="leading-[0.9] tracking-[-0.03em]" style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 1 }}>
                            Join the <span style={{ color: '#06b6d4' }}>XyberClan Network</span>
                        </h2>
                        <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: muted, fontWeight: 300 }}>
                            <EditableText contentKey={`${language}.partnersPage.joinSubtitle`} fallback="Whether you want to build the next big thing or support our tech movement, we have a place for you." />
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <button
                            ref={el => ctaCardsRef.current[0] = el}
                            onClick={() => openForm('partner')}
                            className="group relative p-10 rounded-xl border transition-all duration-300 text-left active:scale-[0.98]"
                            style={{ border: `1px solid ${border}`, background: isDark ? '#111' : '#fff', opacity: 0 }}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[#06b6d4] mb-8 transition-transform duration-300 group-hover:scale-105" style={{ background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)' }}>
                                    <Handshake size={24} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight" style={{ color: text }}>{p.ctaPartner}</h3>
                                <div className="flex items-center gap-1 text-sm font-semibold transition-all duration-300 hover:gap-2" style={{ color: '#06b6d4' }}>
                                    <span>Get Started</span>
                                    <ArrowRight size={15} />
                                </div>
                            </div>
                        </button>

                        <button
                            ref={el => ctaCardsRef.current[1] = el}
                            onClick={() => openForm('sponsor')}
                            className="group relative p-10 rounded-xl border transition-all duration-300 text-left active:scale-[0.98]"
                            style={{ border: `1px solid ${border}`, background: isDark ? '#111' : '#fff', opacity: 0 }}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[#06b6d4] mb-8 transition-transform duration-300 group-hover:scale-105" style={{ background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.06)' }}>
                                    <Trophy size={24} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight" style={{ color: text }}>{p.ctaSponsor}</h3>
                                <div className="flex items-center gap-1 text-sm font-semibold transition-all duration-300 hover:gap-2" style={{ color: '#06b6d4' }}>
                                    <span>Support Us</span>
                                    <ArrowRight size={15} />
                                </div>
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
