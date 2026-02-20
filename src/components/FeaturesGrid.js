import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Terminal, Shield, Smartphone, Globe } from 'lucide-react';
import { translations } from '../translations';

const FeaturesGrid = () => {
    const { isDark } = useTheme();
    const [lang] = React.useState('en');
    const t = translations[lang];
    const [ref, visible] = useScrollAnimation();

    // Default features with SEO titles
    const defaultFeatures = [
        {
            icon: <Terminal className="w-6 h-6 text-yellow-400" />,
            title: t.seo.h3_web,
            description: "Built for speed and performance with clean architecture."
        },
        {
            icon: <Shield className="w-6 h-6 text-cyan-400" />,
            title: t.seo.h3_cyber,
            description: "Enterprise-grade security protections built-in."
        },
        {
            icon: <Smartphone className="w-6 h-6 text-purple-400" />,
            title: t.seo.h3_mobile,
            description: "Responsive design that works perfectly on all devices."
        },
        {
            icon: <Globe className="w-6 h-6 text-blue-400" />,
            title: t.seo.h3_design,
            description: "Deploy anywhere and reach users globally."
        }
    ];

    const displayFeatures = defaultFeatures;

    return (
        <section ref={ref} className={`py-32 px-4 relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {/* Background elements for depth */}
            <div className={`absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none ${visible ? 'animate-pulse' : ''}`} />
            <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none ${visible ? 'animate-pulse' : ''}`} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className={`text-center mb-24 transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-6 focus-visible:outline-none">
                        Features
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
                        Experience our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">features</span>
                    </h2>
                    <p className={`text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Dive into our features and experience the difference we can make in your work and daily life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-10 rounded-[2.5rem] border transition-all duration-700 hover:-translate-y-3 ${isDark
                                ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/30'
                                : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/10'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                                    {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-cyan-500 transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className={`text-[15px] leading-relaxed font-medium transition-colors duration-300 ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                {feature.description}
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-[11px] font-bold tracking-widest text-cyan-500 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500 uppercase">
                                Learn More
                                <span className="w-6 h-px bg-cyan-500/30"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
