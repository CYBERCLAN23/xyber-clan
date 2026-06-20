import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const CTASection = () => {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const bodyRef = useRef(null);
    const btnsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo([line1Ref.current, line2Ref.current],
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.1, stagger: 0.13, ease: 'power3.out',
                  scrollTrigger: { trigger: line1Ref.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo([bodyRef.current, btnsRef.current],
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: bodyRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    return (
        <section
            ref={sectionRef}
            style={{ backgroundColor: 'transparent', color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="relative overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-32 md:py-44">
                <div className="max-w-3xl">

                    {/* Display headline */}
                    <h2
                        className="leading-[0.9] tracking-[-0.03em] mb-10"
                        style={{ fontWeight: 900, fontSize: 'clamp(3.2rem, 7vw, 7rem)' }}
                    >
                        <span ref={line1Ref} className="block" style={{ opacity: 0 }}>
                            <EditableText contentKey="en.cta.title" fallback="Ready to" />
                        </span>
                        <span ref={line2Ref} className="block pl-[0.1em]" style={{ opacity: 0 }}>
                            get started?
                        </span>
                    </h2>

                    <p
                        ref={bodyRef}
                        className="text-base leading-relaxed mb-10 max-w-sm"
                        style={{ color: muted, fontWeight: 300, opacity: 0 }}
                    >
                        <EditableText
                            contentKey="en.cta.subtitle"
                            fallback="No demos, no lengthy calls. Tell us what you need — we'll build it."
                        />
                    </p>

                    {/* CTAs */}
                    <div ref={btnsRef} className="flex flex-wrap gap-5 items-center" style={{ opacity: 0 }}>
                        <Link
                            to="/start-project"
                            className="group flex items-center gap-3 px-8 py-4 font-bold text-sm tracking-wide text-white transition-all duration-200 hover:gap-4"
                            style={{ background: '#06b6d4', borderRadius: 0 }}
                        >
                            <EditableText contentKey="en.cta.primaryButton" fallback="Start your project" />
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#contact"
                            className="text-sm font-semibold border-b pb-0.5 transition-colors duration-200 hover:text-cyan-500 hover:border-cyan-500"
                            style={{ color: text, borderColor: text }}
                        >
                            <EditableText contentKey="en.cta.secondaryButton" fallback="Or contact us →" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Large background text watermark */}
            <div
                className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden leading-none"
                style={{
                    fontSize: 'clamp(8rem, 18vw, 18rem)',
                    fontWeight: 900,
                    color: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)',
                    letterSpacing: '-0.05em',
                    lineHeight: 0.85,
                }}
            >
                XC
            </div>
        </section>
    );
};

export default CTASection;
