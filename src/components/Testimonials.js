import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const testimonials = [
    { quote: "Concept to launched product in record time. XyberClan delivered exactly what we needed.", author: "Paul Smith", role: "Software Tester", company: "Monaco", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop" },
    { quote: "Their attention to UX detail is unmatched. Our conversion rate jumped 40% after the redesign.", author: "Tim Williams", role: "Business Owner", company: "Proline", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" },
    { quote: "The security audit they performed found critical vulnerabilities we didn't know existed. Outstanding work.", author: "Katie Adams", role: "Entrepreneur", company: "Delaware", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" },
    { quote: "From design to deploy in two weeks. Responsive, fast, and exactly on brand. Highly recommend.", author: "Alex Schiller", role: "Senior Engineer", company: "Luminous", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop" },
];

const Testimonials = () => {
    const { isDark } = useTheme();
    const { language: lang } = useLanguage();
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out',
                  scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const bg = isDark ? '#111' : '#fff';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    const cardBg = isDark ? 'rgba(255,255,255,0.02)' : '#f5f4f2';

    const doubled = [...testimonials, ...testimonials];

    return (
        <section
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 pt-28 md:pt-36 pb-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.testimonials.badge`} fallback="Testimonials" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.testimonials.title`} fallback={<>What our<br />clients say.</>} />
                        </h2>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: muted, fontWeight: 300 }}>
                        <EditableText contentKey={`${lang}.testimonials.subtitle`} fallback="Real words from real clients who've shipped with us." />
                    </p>
                </div>
            </div>

            {/* Marquee strip — full bleed */}
            <div className="relative pb-28 md:pb-36">
                <style>{`
                    @keyframes marquee-ltr { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .testimonial-track { animation: marquee-ltr 38s linear infinite; }
                    .testimonial-track:hover { animation-play-state: paused; }
                `}</style>

                {/* Edge fade */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />

                <div className="overflow-hidden">
                    <div className="flex w-max testimonial-track gap-5 px-5">
                        {doubled.map((t, i) => {
                            const idx = i % testimonials.length;
                            return (
                                <div
                                    key={i}
                                    className="w-[300px] sm:w-[340px] shrink-0 flex flex-col justify-between p-6 sm:p-8 gap-5 sm:gap-8"
                                    style={{ background: cardBg, border: `1px solid ${border}` }}
                                >
                                    <p className="text-[15px] leading-relaxed font-light" style={{ color: muted }}>
                                        "<EditableText contentKey={`${lang}.testimonials.list.${idx}.quote`} fallback={t.quote} />"
                                    </p>
                                    <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                                            <EditableImage
                                                contentKey={`${lang}.testimonials.list.${idx}.avatar`}
                                                src={t.avatar}
                                                alt={t.author}
                                                className="w-full h-full object-cover grayscale"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-bold truncate" style={{ color: text }}>
                                                <EditableText contentKey={`${lang}.testimonials.list.${idx}.author`} fallback={t.author} />
                                            </p>
                                            <p className="text-[11px] truncate" style={{ color: muted }}>
                                                <EditableText contentKey={`${lang}.testimonials.list.${idx}.role`} fallback={t.role} />
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#06b6d4' }}>
                                            <EditableText contentKey={`${lang}.testimonials.list.${idx}.company`} fallback={t.company} />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
