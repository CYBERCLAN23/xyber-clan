import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Terminal, Shield, Smartphone, Globe, Zap } from 'lucide-react';
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
        <section ref={ref} className={`py-28 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className={`text-center mb-20 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <span className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block">Features</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Experience our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">features</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dive into our features and experience the difference we can make in your work and daily life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 hover:-translate-y-2 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}
                        >
                            <div className="mb-6 bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                                {feature.icon || <Zap className="w-6 h-6 text-cyan-500" />}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
