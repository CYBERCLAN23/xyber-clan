import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const AnimatedNumber = ({ value, suffix, trigger }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let start = 0;
        const steps = 60;
        const inc = value / steps;
        const id = setInterval(() => {
            start += inc;
            if (start >= value) { setCount(value); clearInterval(id); }
            else setCount(Math.floor(start));
        }, 2000 / steps);
        return () => clearInterval(id);
    }, [trigger, value]);
    return <>{count}{suffix}</>;
};

const StatsCounter = () => {
    const { isDark } = useTheme();
    const [triggered, setTriggered] = useState(false);
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const statsRef = useRef([]);

    const stats = [
        { value: 50, suffix: '+', label: 'Projects\nCompleted', key: 'projects' },
        { value: 30, suffix: '+', label: 'Happy\nClients',    key: 'clients'  },
        { value: 9,  suffix: '',  label: 'Team\nExperts',     key: 'experts'  },
        { value: 3,  suffix: '+', label: 'Years\nExperience', key: 'years'    },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 36 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                  scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: {
                      trigger: statsRef.current[0],
                      start: 'top 88%',
                      toggleActions: 'play reverse play reverse',
                      onEnter: () => setTriggered(true),
                      onLeaveBack: () => setTriggered(false),
                  }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const bg = isDark ? '#111' : '#f5f4f2';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#555' : '#999';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    return (
        <section
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT }}
            className="relative overflow-hidden"
        >
            {/* Horizontal rule at top */}
            <div style={{ borderTop: `1px solid ${border}` }} />

            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            Impact
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey="en.stats.title" fallback={<>Numbers that<br />tell the story.</>} />
                        </h2>
                    </div>
                    <p
                        className="text-sm leading-relaxed max-w-xs"
                        style={{ color: muted, fontWeight: 300 }}
                    >
                        <EditableText
                            contentKey="en.stats.subtitle"
                            fallback="Real results, real clients, real growth."
                        />
                    </p>
                </div>

                {/* Stats row */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
                    style={{ borderColor: border }}
                >
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            ref={el => statsRef.current[i] = el}
                            className="group px-8 py-10 flex flex-col gap-3 cursor-default"
                            style={{ opacity: 0 }}
                        >
                            <span
                                className="text-[clamp(3.5rem,7vw,6rem)] font-black leading-none tracking-[-0.04em] tabular-nums"
                                style={{ color: text }}
                            >
                                <AnimatedNumber value={s.value} suffix={s.suffix} trigger={triggered} />
                            </span>
                            <span
                                className="text-[11px] font-semibold tracking-[0.15em] uppercase whitespace-pre-line leading-relaxed"
                                style={{ color: muted }}
                            >
                                <EditableText contentKey={`en.stats.items.${i}.label`} fallback={s.label} />
                            </span>
                            {/* Cyan accent line on hover */}
                            <div
                                className="h-px w-0 group-hover:w-8 transition-all duration-400 mt-1"
                                style={{ background: '#06b6d4' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
