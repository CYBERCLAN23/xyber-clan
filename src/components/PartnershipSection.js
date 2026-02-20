import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Plus } from 'lucide-react';
import { getLogo } from '../utils/festive';

const PartnershipSection = ({ translations }) => {
    const { isDark } = useTheme();
    const t = translations.partnership;

    return (
        <section className={`relative py-32 overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            {/* ─── EXTRA DESIGN ELEMENTS: Floating Orbs ─── */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className={`absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse-slow ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-200/20'}`} />
                <div className={`absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full blur-[150px] animate-pulse-slow delay-700 ${isDark ? 'bg-purple-500/10' : 'bg-purple-200/20'}`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] ${isDark ? 'bg-blue-500/5' : 'bg-blue-100/10'}`} />
            </div>

            {/* ─── BACKGROUND CODE SNIPPETS (Refined & Subtle) ─── */}
            <div className={`absolute top-20 left-10 opacity-[0.03] dark:opacity-[0.07] font-mono text-[10px] space-y-1 pointer-events-none select-none transition-opacity duration-1000 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <p>function initialize() &#123;</p>
                <p className="pl-4">const tech = "Innovation";</p>
                <p className="pl-4">let synergy = true;</p>
                <p className="pl-4">return synergy;</p>
                <p>&#125;</p>
            </div>

            <div className={`absolute bottom-20 right-10 opacity-[0.03] dark:opacity-[0.07] font-mono text-[10px] space-y-1 pointer-events-none select-none transition-opacity duration-1000 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                <p>import &#123; Excellence &#125; from './core';</p>
                <p>class Partnership extends Innovation &#123;</p>
                <p className="pl-4">constructor() &#123; super(); &#125;</p>
                <p>&#125;</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center">

                    {/* ─── THE GLASS CARD ─── */}
                    <div className={`w-full max-w-4xl p-10 md:p-20 rounded-[3rem] border backdrop-blur-3xl transition-all duration-700 hover:scale-[1.01] flex flex-col items-center text-center ${isDark
                        ? 'bg-white/[0.03] border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]'
                        : 'bg-white/60 border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]'
                        }`}>

                        {/* Partner Logos Composition */}
                        <div className="flex items-center justify-center gap-6 md:gap-12 mb-12">
                            {/* Hult Prize Side */}
                            <div className="flex flex-col items-center group">
                                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center p-6 transition-all duration-500 group-hover:scale-110 shadow-2xl ${isDark ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                                    {/* Using a stylized SVG text/shape for Hult Prize since assets aren't present */}
                                    <div className="text-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-pink-500 animate-spin-slow">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                            </svg>
                                        </div>
                                        <div className="text-[10px] md:text-xs font-black tracking-tighter text-pink-500 uppercase leading-none">Hultprize</div>
                                        <div className="text-[6px] md:text-[8px] font-bold text-gray-500 mt-0.5 whitespace-nowrap">University of Yaounde I</div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Plus */}
                            <div className="flex items-center justify-center">
                                <Plus className="text-pink-500 w-6 h-6 md:w-8 md:h-8 animate-pulse" strokeWidth={3} />
                            </div>

                            {/* XyberClan Side */}
                            <div className="flex flex-col items-center group">
                                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center p-6 transition-all duration-500 group-hover:scale-110 shadow-2xl ${isDark ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                                    <img src={getLogo()} alt="XyberClan Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-sm animate-fade-in">
                                <Sparkles size={14} />
                                {t.badge}
                            </span>

                            <h2 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t.title}
                            </h2>

                            <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 max-w-2xl mx-auto leading-tight italic">
                                "{t.subtitle}"
                            </p>

                            <div className={`w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 my-8`} />

                            <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t.desc}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
                                {t.features.map((feature, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/5 hover:border-pink-500/30' : 'bg-gray-50 border-gray-100 hover:border-pink-500/30 shadow-sm'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                            </div>
                                            <p className={`text-xs md:text-sm font-semibold leading-snug ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t.slogan} 🌐✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default PartnershipSection;
