import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight } from 'lucide-react';

const CTASection = () => {
    const { isDark } = useTheme();

    return (
        <div className="py-10">
            <div className={`max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] ${isDark ? 'bg-[#0a0a0a] border border-white/5' : 'bg-gray-100 border border-gray-200'}`}>

                {/* Mesh / Dot Pattern Background */}
                <div className="absolute right-0 top-0 w-full h-full pointer-events-none opacity-40">
                    <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none">
                        <defs>
                            <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill={isDark ? "white" : "black"} opacity="0.2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dotPattern)" />

                        {/* Wavy Mesh Overlay Concept */}
                        <path
                            d="M 400,400 Q 550,200 800,400 T 1200,400"
                            stroke={isDark ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.05)"}
                            strokeWidth="80"
                            fill="none"
                            strokeLinecap="round"
                            className="translate-x-32"
                        />
                    </svg>

                    {/* Radial Glow */}
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 text-left">
                    <div className="max-w-2xl">
                        <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                            Get started today
                        </h2>
                        <p className={`text-xl md:text-2xl leading-relaxed mb-12 max-w-xl ${isDark ? 'text-gray-400 font-medium' : 'text-gray-600'}`}>
                            Create a free account. No demos or calls with our sales team are required. Upgrade only if you have to.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            {/* Primary Button - Brand Blue */}
                            <button className="group bg-[#00A3FF] hover:bg-[#0082CC] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-xl shadow-[#00A3FF]/20">
                                Get Started
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Secondary Button */}
                            <button className={`group px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                                Contact Us
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTASection;
