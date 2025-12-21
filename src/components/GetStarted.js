import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Github, Figma, Slack, Globe, Mail, MessageSquare, Zap, Terminal, Code, Youtube, Shield, Cpu, Layout, Chrome, Layers } from 'lucide-react';

const GetStarted = () => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nodes = useMemo(() => {
        if (isMobile) {
            return [
                { icon: <Figma size={28} />, label: 'Design', x: -100, y: -160, color: '#FF7262' },
                { icon: <Shield size={28} />, label: 'Secure', x: 0, y: -200, color: '#3B82F6' },
                { icon: <Slack size={28} />, label: 'Comm', x: 100, y: -160, color: '#4A154B' },
                { icon: <Globe size={28} />, label: 'Web', x: -100, y: 160, color: '#06b6d4' },
                { icon: <Cpu size={28} />, label: 'Fast', x: 0, y: 200, color: '#bef264' },
                { icon: <Zap size={28} />, label: 'Zap', x: 100, y: 160, color: '#FCD34D' },
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

    return (
        <section ref={ref} className={`py-32 px-4 relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className={`text-center mb-24 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <span className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block">Integrations</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Get Started in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-serif italic italic font-normal">Simple Steps</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Whether you're a small business or a large enterprise, our process is designed to enhance your productivity and make your workflow easier.
                    </p>
                </div>

                {/* Hub and Spoke Visual */}
                <div className={`relative flex items-center justify-center ${isMobile ? 'h-[600px]' : 'h-[500px]'}`}>

                    {/* SVG Connections Layer */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                        viewBox={isMobile ? "-200 -300 400 600" : "-400 -250 800 500"}
                    >
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        {lines.map((line) => (
                            <React.Fragment key={line.id}>
                                <path
                                    d={line.path}
                                    stroke="url(#lineGrad)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d={line.path}
                                    stroke="#06b6d4"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="5, 15"
                                    className="animate-data-flow"
                                />
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* Central Hub - Image 0 Style but Larger */}
                    <div className="relative z-10 w-32 h-32 bg-neutral-900 rounded-[3rem] border border-white/5 flex items-center justify-center shadow-2xl group cursor-default">
                        <div className="w-18 h-18 bg-[#bef264] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(190,242,100,0.4)] group-hover:scale-110 transition-transform duration-500">
                            <Code size={42} className="text-black" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Spoke Nodes - Colorful */}
                    {nodes.map((node, i) => (
                        <div
                            key={i}
                            className="absolute flex flex-col items-center group"
                            style={{
                                transform: `translate(${node.x}px, ${node.y}px)`,
                                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transitionDelay: `${i * 100}ms`
                            }}
                        >
                            <div className={`w-20 h-20 rounded-[1.8rem] border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100'}`}>
                                <div style={{ color: node.color }} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                                    {node.icon}
                                </div>
                            </div>
                            {!isMobile && (
                                <span className="text-xs font-bold uppercase tracking-widest mt-3 opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {node.label}
                                </span>
                            )}
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
