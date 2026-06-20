import React, { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';
import { Github, Figma, Slack, Globe, Mail, MessageSquare, Code } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const GetStarted = () => {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const subtitleRef = useRef(null);
    const hubRef = useRef(null);
    const nodesRef = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            gsap.fromTo(subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                  scrollTrigger: { trigger: subtitleRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(hubRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)',
                  scrollTrigger: { trigger: hubRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(nodesRef.current,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)',
                  scrollTrigger: { trigger: hubRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const nodes = useMemo(() => {
        if (isMobile) {
            return [
                { icon: <Figma size={20} />, label: 'Design', x: -90, y: -80, color: '#FF7262' },
                { icon: <Github size={20} />, label: 'Code', x: -110, y: 10, color: isDark ? '#ffffff' : '#000000' },
                { icon: <Slack size={20} />, label: 'Comm', x: -90, y: 100, color: '#4A154B' },
                { icon: <Globe size={20} />, label: 'Deploy', x: 90, y: -80, color: '#06b6d4' },
                { icon: <Mail size={20} />, label: 'Contact', x: 110, y: 10, color: '#3B82F6' },
                { icon: <MessageSquare size={20} />, label: 'Support', x: 90, y: 100, color: '#FCD34D' },
            ];
        }
        return [
            { icon: <Figma size={28} />, label: 'Design', x: -220, y: -100, color: '#FF7262' },
            { icon: <Github size={28} />, label: 'Code', x: -250, y: 10, color: isDark ? '#ffffff' : '#000000' },
            { icon: <Slack size={28} />, label: 'Comm', x: -220, y: 120, color: '#4A154B' },
            { icon: <Globe size={28} />, label: 'Deploy', x: 220, y: -100, color: '#06b6d4' },
            { icon: <Mail size={28} />, label: 'Contact', x: 250, y: 10, color: '#3B82F6' },
            { icon: <MessageSquare size={28} />, label: 'Support', x: 220, y: 120, color: '#FCD34D' },
        ];
    }, [isMobile, isDark]);

    const lines = useMemo(() => {
        return nodes.map((node, i) => {
            const x1 = 0;
            const y1 = 0;
            const x2 = node.x;
            const y2 = node.y;

            let cx1, cy1, cx2, cy2;

            if (isMobile) {
                cx1 = 0;
                cy1 = y2 / 2;
                cx2 = x2;
                cy2 = y2 / 2;
            } else {
                cx1 = x2 / 2;
                cy1 = 0;
                cx2 = x2 / 2;
                cy2 = y2;
            }

            return {
                path: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`,
                id: i
            };
        });
    }, [nodes, isMobile]);

    const bg = isDark ? '#0a0a0a' : '#fff';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    return (
        <section
            ref={sectionRef}
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
                            <EditableText contentKey="en.get_started.badge" tag="span" fallback="Integrations" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey="en.get_started.title" tag="span" fallback={<>Get started in<br />simple steps.</>} />
                        </h2>
                    </div>
                    <p
                        ref={subtitleRef}
                        className="text-sm leading-relaxed max-w-xs"
                        style={{ color: muted, fontWeight: 300, opacity: 0 }}
                    >
                        <EditableText
                            contentKey="en.get_started.subtitle"
                            tag="span"
                            fallback="Whether you're a small business or a large enterprise, our process enhances productivity and simplifies your workflow."
                        />
                    </p>
                </div>

                {/* Hub and Spoke Visual */}
                <div className={`relative flex items-center justify-center ${isMobile ? 'h-[360px]' : 'h-[500px]'}`}>

                    {/* SVG Connections Layer */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                        viewBox={isMobile ? "-160 -150 320 300" : "-400 -250 800 500"}
                    >
                        <defs>
                            <linearGradient id="lineGradEditorial" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
                            </linearGradient>
                        </defs>
                        {lines.map((line) => (
                            <React.Fragment key={line.id}>
                                <path
                                    d={line.path}
                                    stroke="url(#lineGradEditorial)"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <path
                                    d={line.path}
                                    stroke="#06b6d4"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeDasharray="5, 15"
                                    className="animate-data-flow"
                                />
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* Central Hub */}
                    <div
                        ref={hubRef}
                        className="relative z-10 rounded-[3rem] flex items-center justify-center shadow-2xl group cursor-default"
                        style={{
                            width: isMobile ? '80px' : '128px',
                            height: isMobile ? '80px' : '128px',
                            borderRadius: isMobile ? '2rem' : '3rem',
                            backgroundColor: isDark ? '#111' : '#f5f4f2',
                            border: `1px solid ${border}`,
                            opacity: 0,
                        }}
                    >
                        <div 
                            className="bg-[#bef264] flex items-center justify-center shadow-[0_0_40px_rgba(190,242,100,0.4)] group-hover:scale-110 transition-transform duration-500"
                            style={{
                                width: isMobile ? '48px' : '72px',
                                height: isMobile ? '48px' : '72px',
                                borderRadius: isMobile ? '0.75rem' : '1rem',
                            }}
                        >
                            <Code size={isMobile ? 26 : 42} className="text-black" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Spoke Nodes */}
                    {nodes.map((node, i) => (
                        <div
                            key={i}
                            ref={el => nodesRef.current[i] = el}
                            className="absolute flex flex-col items-center group"
                            style={{
                                transform: `translate(${node.x}px, ${node.y}px)`,
                                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transitionDelay: `${i * 100}ms`,
                                opacity: 0,
                            }}
                        >
                            <div
                                className="border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                                style={{
                                    width: isMobile ? '48px' : '80px',
                                    height: isMobile ? '48px' : '80px',
                                    borderRadius: isMobile ? '1.2rem' : '1.8rem',
                                    backgroundColor: isDark ? '#111' : '#f5f4f2',
                                    borderColor: border,
                                }}
                            >
                                <div style={{ color: node.color }} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                                    {node.icon}
                                </div>
                            </div>
                            <span
                                className={`font-semibold uppercase tracking-[0.18em] transition-opacity whitespace-nowrap ${isMobile ? 'text-[7px] opacity-60 mt-1.5' : 'text-[10px] opacity-40 mt-3 group-hover:opacity-100'}`}
                                style={{ color: text }}
                            >
                                {node.label}
                            </span>
                        </div>
                    ))}
                </div>

            </div>

            <style>{`
                @keyframes data-flow {
                    0% { stroke-dashoffset: 80; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-data-flow {
                    animation: data-flow 4s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default GetStarted;
