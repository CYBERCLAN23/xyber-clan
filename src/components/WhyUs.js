import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Globe, Zap, Users, Headset } from 'lucide-react';

const WhyUs = ({ translations: t }) => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();

    const icons = [
        <Zap className="w-6 h-6 text-yellow-400" />,
        <Globe className="w-6 h-6 text-cyan-400" />,
        <Users className="w-6 h-6 text-purple-400" />,
        <Headset className="w-6 h-6 text-blue-400" />
    ];

    return (
        <section ref={ref} className={`py-24 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <span className="px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 inline-block">
                        Advantages
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {t.whyUs.title}
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {t.whyUs.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`group p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 hover:-translate-y-2 ${isDark
                                    ? 'bg-neutral-900 border-neutral-800'
                                    : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'
                                }`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className="mb-6 bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-cyan-500/10">
                                {icons[idx]}
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-cyan-500 transition-colors">
                                {item.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
