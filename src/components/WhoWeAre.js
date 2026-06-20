import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const WhoWeAre = () => {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const bodyRef = useRef(null);
    const pillarsRef = useRef([]);
    const leafTopLeftRef = useRef(null);
    const leafBottomRightRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section label
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            // Headline lines
            gsap.fromTo([line1Ref.current, line2Ref.current],
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out',
                  scrollTrigger: { trigger: line1Ref.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            // Body text
            gsap.fromTo(bodyRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                  scrollTrigger: { trigger: bodyRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            // Pillars stagger
            gsap.fromTo(pillarsRef.current,
                { opacity: 0, y: 32, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                  scrollTrigger: { trigger: pillarsRef.current[0], start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            // Leaf animations
            gsap.fromTo(leafTopLeftRef.current,
                { opacity: 0, scale: 0, rotation: -45 },
                { opacity: 0.4, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)',
                  scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(leafBottomRightRef.current,
                { opacity: 0, scale: 0, rotation: 45 },
                { opacity: 0.4, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)',
                  scrollTrigger: { trigger: sectionRef.current, start: 'center 80%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const pillars = [
        { num: '01', title: 'Rapid Innovation', body: 'Concept to deployed product in days, not months. We engineer speed without cutting corners.' },
        { num: '02', title: 'Scalable Architecture', body: 'Systems built to handle millions of users from day one, designed for the long game.' },
        { num: '03', title: 'Revenue Enablement', body: 'Every line of code and pixel is intentional — built to convert, retain, and grow.' },
    ];

    const bg = 'transparent';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    return (
        <section
            id="about"
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT }}
            className="relative z-10 overflow-hidden"
        >
            {/* Corner Leaves */}
            <div ref={leafTopLeftRef} className="absolute top-12 left-12 md:top-20 md:left-20 opacity-0 pointer-events-none">
                <Leaf size={32} color="#06b6d4" strokeWidth={1} />
            </div>
            <div ref={leafBottomRightRef} className="absolute bottom-12 right-12 md:bottom-20 md:right-20 opacity-0 pointer-events-none">
                <Leaf size={32} color="#06b6d4" strokeWidth={1} />
            </div>

            {/* ── Main content ── */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36 relative z-10">

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: Headline block */}
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-8"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey="en.seo.h2_why" fallback="Who We Are" />
                        </p>

                        <h2
                            className="leading-[0.9] tracking-[-0.03em] mb-8"
                            style={{ fontWeight: 900, fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                        >
                            <span ref={line1Ref} className="block" style={{ opacity: 0 }}>
                                <EditableText contentKey="en.seo.h2_standards" fallback="Digital" />
                            </span>
                            <span ref={line2Ref} className="block pl-[0.12em]" style={{ opacity: 0 }}>
                                excellence.
                            </span>
                        </h2>

                        <p
                            ref={bodyRef}
                            className="text-base leading-relaxed max-w-sm"
                            style={{ color: muted, fontWeight: 300, opacity: 0 }}
                        >
                            <EditableText
                                contentKey="en.about.subtitle"
                                fallback="University-trained engineers delivering enterprise-grade solutions at startup speed. Based in Cameroon, serving the world."
                            />
                        </p>
                    </div>

                    {/* Right: Pillars / Cards */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {pillars.map((p, i) => (
                            <div
                                key={i}
                                ref={el => pillarsRef.current[i] = el}
                                className="group p-5 sm:p-8 rounded-2xl border flex gap-4 sm:gap-6 items-start cursor-default transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                                style={{ 
                                    opacity: 0,
                                    borderColor: border,
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                    boxShadow: isDark ? '0 10px 40px -10px rgba(0,0,0,0.5)' : '0 10px 40px -10px rgba(0,0,0,0.05)'
                                }}
                            >
                                <span
                                    className="text-[11px] font-mono tracking-widest shrink-0 mt-1.5"
                                    style={{ color: '#06b6d4' }}
                                >
                                    {p.num}
                                </span>
                                <div>
                                    <h3
                                        className="text-xl font-bold tracking-tight mb-3 group-hover:text-cyan-500 transition-colors duration-200"
                                        style={{ color: text }}
                                    >
                                        <EditableText contentKey={`en.whoWeAre.card${i+1}Title`} fallback={p.title} />
                                    </h3>
                                    <p className="text-[14.5px] leading-relaxed" style={{ color: muted, fontWeight: 300 }}>
                                        <EditableText contentKey={`en.whoWeAre.card${i+1}Desc`} fallback={p.body} />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;
