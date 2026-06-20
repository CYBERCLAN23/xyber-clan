import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../translations';
import EditableText from './cms/EditableText';
import { Terminal, Shield, Smartphone, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const FeaturesGrid = () => {
    const { isDark } = useTheme();
    const t = translations['en'];
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                  scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(itemsRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: itemsRef.current[0], start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const services = [
        {
            num: '01',
            icon: <Terminal className="w-5 h-5" />,
            title: t.seo.h3_web,
            body: 'Performant, scalable web applications built with modern frameworks. Clean code, clean architecture.',
            tag: 'Web & Apps',
        },
        {
            num: '02',
            icon: <Shield className="w-5 h-5" />,
            title: t.seo.h3_cyber,
            body: 'Enterprise-grade security audits, pen testing, and hardening. Your data, defended.',
            tag: 'Security',
        },
        {
            num: '03',
            icon: <Smartphone className="w-5 h-5" />,
            title: t.seo.h3_mobile,
            body: 'Cross-platform mobile experiences that feel native on iOS and Android.',
            tag: 'Mobile',
        },
        {
            num: '04',
            icon: <Globe className="w-5 h-5" />,
            title: t.seo.h3_design,
            body: 'UI/UX design that converts. Pixel-perfect, accessibility-first, and human-centered.',
            tag: 'Design',
        },
    ];

    const bg = isDark ? '#0a0a0a' : '#fff';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    const cardBg = isDark ? 'rgba(255,255,255,0.02)' : '#f5f4f2';

    return (
        <section
            ref={sectionRef}
            id="services"
            style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="relative overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey="en.features.badge" fallback="Services" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey="en.features.title" fallback={<>What we<br />build for you.</>} />
                        </h2>
                    </div>
                    <p
                        className="text-sm leading-relaxed max-w-xs"
                        style={{ color: muted, fontWeight: 300 }}
                    >
                        <EditableText
                            contentKey="en.features.subtitle"
                            fallback="Four core disciplines. One unified team. Infinite possibilities."
                        />
                    </p>
                </div>

                {/* ── Services grid ── */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: border }}>
                    {services.map((s, i) => (
                        <div
                            key={i}
                            ref={el => itemsRef.current[i] = el}
                            className="group relative p-6 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-8 cursor-default transition-colors duration-300"
                            style={{ background: cardBg, opacity: 0 }}
                            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(6,182,212,0.04)' : '#fff'}
                            onMouseLeave={e => e.currentTarget.style.background = cardBg}
                        >
                            {/* Top: number + icon */}
                            <div className="flex items-start justify-between">
                                <span
                                    className="text-[11px] font-mono tracking-widest"
                                    style={{ color: '#06b6d4' }}
                                >
                                    {s.num}
                                </span>
                                <span
                                    className="opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ color: text }}
                                >
                                    {s.icon}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex-1 flex flex-col justify-end gap-3">
                                <h3
                                    className="text-xl font-bold tracking-tight leading-tight group-hover:text-cyan-500 transition-colors duration-200"
                                    style={{ color: text }}
                                >
                                    <EditableText contentKey={`en.features.items.${i}.title`} fallback={s.title} />
                                </h3>
                                <p
                                    className="text-[13px] leading-relaxed"
                                    style={{ color: muted, fontWeight: 300 }}
                                >
                                    <EditableText contentKey={`en.features.items.${i}.description`} fallback={s.body} />
                                </p>
                            </div>

                            {/* Bottom tag */}
                            <span
                                className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                                style={{ color: muted }}
                            >
                                {s.tag}
                            </span>

                            {/* Hover cyan bottom line */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-px bg-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
