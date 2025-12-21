import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { User, Code, Palette, Zap, ArrowRight, ExternalLink } from 'lucide-react';

const TeamMinimal = () => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();

    const teamFeatures = [
        {
            title: "Engineering Excellence",
            desc: "Our developers aren't just coders; they're engineers. We build for performance, security, and longevity.",
            visual: (
                <div className="relative w-full h-32 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-xl overflow-hidden p-4 flex flex-col justify-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-1/4 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        <div className="w-1/2 h-2 bg-cyan-300 dark:bg-cyan-700 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2 h-2 bg-cyan-300 dark:bg-cyan-700 rounded-full"></div>
                        <div className="w-1/3 h-2 bg-cyan-500 rounded-full"></div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Code size={40} className="text-cyan-500/30" />
                    </div>
                </div>
            )
        },
        {
            title: "Design-First Mindset",
            desc: "We believe in interfaces that are intuitive and beautiful. Every pixel serves a purpose in our designs.",
            visual: (
                <div className="relative w-full h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-xl overflow-hidden p-4 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 border-dashed animate-spin-slow"></div>
                    <Palette size={32} className="text-blue-500 absolute" />
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-blue-500 opacity-50">#3B82F6</div>
                </div>
            )
        },
        {
            title: "Strategic Growth",
            desc: "Helping startups and enterprises scale their digital footprint with data-backed strategies and tools.",
            visual: (
                <div className="relative w-full h-32 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-xl overflow-hidden p-4 flex flex-col justify-end">
                    <div className="flex items-end gap-1 h-full">
                        <div className="w-3 h-8 bg-indigo-500 rounded-t-sm animate-bounce-short"></div>
                        <div className="w-3 h-12 bg-indigo-400 rounded-t-sm animate-bounce-short delay-75"></div>
                        <div className="w-3 h-16 bg-indigo-300 rounded-t-sm animate-bounce-short delay-150"></div>
                        <div className="w-3 h-20 bg-indigo-500 rounded-t-sm animate-bounce-short delay-200"></div>
                    </div>
                    <Zap size={20} className="text-indigo-500 absolute top-4 right-4" />
                </div>
            )
        }
    ];

    return (
        <section id="team" ref={ref} className={`py-24 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-16 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <span className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                        The XyberClan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        Meet Our <span className="font-serif italic text-cyan-500">Expert</span> Team
                    </h2>
                    <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        A collective of software engineers, designers, and strategists dedicated to delivering enterprise-grade quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {teamFeatures.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`group p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 border ${isDark ? 'bg-neutral-900/50 border-neutral-800 hover:border-cyan-500/50' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-cyan-500/5 hover:border-cyan-200'}`}
                        >
                            <div className="mb-8 transform transition-transform duration-500 group-hover:scale-105">
                                {feature.visual}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-500 transition-colors">
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className={`flex flex-col md:flex-row items-center justify-between p-10 rounded-3xl border ${isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-cyan-50/50 border-cyan-100'} ${visible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
                    <div>
                        <h4 className="text-2xl font-bold mb-2">Want to see the full list of our specialists?</h4>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>We have a diverse clan ready to tackle any challenge.</p>
                    </div>
                    <a
                        href="/team"
                        className="mt-6 md:mt-0 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-cyan-500/20"
                    >
                        View Full Team
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TeamMinimal;
