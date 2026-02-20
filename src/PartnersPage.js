import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { translations } from './translations';
import { Link } from 'react-router-dom';
import {
    ChevronLeft, Plus,
    Heart, ArrowRight,
    Users, Code2, Zap
} from 'lucide-react';
import { getLogo } from './utils/festive';
import Footer from './components/Footer';

const PartnersPage = () => {
    const { isDark } = useTheme();
    const [lang, setLang] = useState('en');
    const t = translations[lang];
    const p = t.partnersPage;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* ─── NAVIGATION ─── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <img src={getLogo()} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold tracking-tight">XyberClan</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
                        >
                            {lang}
                        </button>
                        <Link to="/start-project" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.03] transition-all">
                            {t.nav.getStarted}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section className="relative pt-48 pb-24 overflow-hidden">
                {/* Background Orbs */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-200/20'}`} />
                    <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[150px] ${isDark ? 'bg-purple-500/10' : 'bg-purple-200/20'}`} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-sm">
                        <Users size={14} />
                        {t.nav.partners}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                        {p.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed italic">
                        "{p.subtitle}"
                    </p>
                </div>
            </section>

            {/* ─── HULT PRIZE FEATURE SECTION ─── */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className={`rounded-[3.5rem] p-10 md:p-24 border backdrop-blur-3xl relative overflow-hidden ${isDark
                        ? 'bg-white/[0.02] border-white/5 shadow-2xl'
                        : 'bg-white border-black/5 shadow-xl'
                        }`}>

                        {/* Interactive Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 group">
                            <div className="absolute top-10 left-10 text-[10px] font-mono whitespace-pre text-cyan-500 leading-tight">
                                {`function synergy() {\n  return "innovation" + "passion";\n}`}
                            </div>
                            <div className="absolute bottom-10 right-10 text-[10px] font-mono whitespace-pre text-pink-500 leading-tight">
                                {`class Partnership extends \nFuture {\n  constructor() { ... }\n}`}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-20 items-center">

                            {/* Visual Side */}
                            <div className="relative flex justify-center items-center py-10">
                                {/* Glowing halo */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-cyan-500/10 to-blue-500/20 blur-[100px] rounded-full animate-pulse-slow" />

                                {/* Logo Composition */}
                                <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                    <div className={`w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] flex items-center justify-center p-8 transition-all duration-700 hover:rotate-3 hover:scale-105 shadow-2xl ${isDark ? 'bg-white/5 border-white/10 shadow-black/50' : 'bg-white border-gray-100 shadow-gray-200/50'
                                        }`}>
                                        <div className="text-center">
                                            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 text-pink-500 animate-spin-slow">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                </svg>
                                            </div>
                                            <div className="text-xs md:text-sm font-black tracking-tighter text-pink-500 uppercase leading-none">Hultprize</div>
                                            <div className="text-[7px] md:text-[9px] font-bold text-gray-500 mt-1 whitespace-nowrap uppercase tracking-widest leading-none">UY1 Chapter</div>
                                        </div>
                                    </div>

                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center text-white shadow-xl rotate-12 shrink-0">
                                        <Plus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
                                    </div>

                                    <div className={`w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] flex items-center justify-center p-8 transition-all duration-700 hover:-rotate-3 hover:scale-105 shadow-2xl ${isDark ? 'bg-white/5 border-white/10 shadow-black/50' : 'bg-white border-gray-100 shadow-gray-200/50'
                                        }`}>
                                        <img src={getLogo()} alt="XyberClan" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                                        {p.hultStory.title}
                                    </h2>
                                    <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500" />
                                </div>

                                <div className="space-y-6 text-lg leading-relaxed font-light">
                                    {p.hultStory.narrative.map((paragraph, idx) => (
                                        <p key={idx} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                                    {p.hultStory.stats.map((stat, idx) => (
                                        <div key={idx} className={`p-4 rounded-2xl border transition-all duration-300 hover:bg-cyan-500/5 ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
                                            <div className="text-2xl font-black text-cyan-500 leading-none mb-1">{stat.value}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── NARRATIVE FEATURES ─── */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap />, color: 'from-orange-500 to-red-500', title: t.partnership.features[0] },
                        { icon: <Code2 />, color: 'from-cyan-500 to-blue-500', title: t.partnership.features[1] },
                        { icon: <Heart />, color: 'from-pink-500 to-rose-500', title: t.partnership.features[2] },
                    ].map((item, idx) => (
                        <div key={idx} className={`group p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-black/5 shadow-sm hover:shadow-xl'
                            }`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform duration-500`}>
                                {React.cloneElement(item.icon, { size: 28 })}
                            </div>
                            <h3 className="text-xl font-bold mb-4 tracking-tight leading-tight">{item.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── FINAL CALL TO ACTION ─── */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
                        {t.partnership.slogan}
                    </h2>
                    <Link to="/start-project" className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-cyan-500/20 hover:scale-[1.03] transition-all">
                        {t.nav.getStarted}
                        <ArrowRight />
                    </Link>
                </div>
            </section>

            <Footer translations={t} />

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 6s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default PartnersPage;
