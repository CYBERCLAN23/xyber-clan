import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { translations } from './translations';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Trophy } from 'lucide-react';
import { getLogo } from './utils/festive';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';

const PartnersPage = () => {
    const { isDark } = useTheme();
    const [lang] = useState('en');
    const t = translations[lang];
    const p = t.partnersPage;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* ─── SHARED NAVIGATION ─── */}
            <SharedNavbar transparentHero={true} />

            {/* ─── HERO SECTION ─── */}
            <section className="relative pt-48 pb-16 overflow-hidden">
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
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {p.title}
                    </h1>
                    <p className={`text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{p.subtitle}"
                    </p>
                </div>
            </section>

            {/* ─── PARTNERSHIP: HULT PRIZE ─── */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Small Badge / Logo Combo above content (Mobile) or inside (Desktop) */}

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Visual Side (Image) */}
                        <div className="relative group">
                            {/* Glow behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className={`relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
                                {/* Replace src with actual relevant partnership image later */}
                                <img
                                    src="https://images.unsplash.com/photo-1542868727-8940bfcefc24?q=80&w=1600&auto=format&fit=crop"
                                    alt="Hult Prize Collaboration"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Bottom gradient for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="space-y-8">

                            {/* Hult Prize x XyberClan Small Logo Badge */}
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    {/* Hult Prize Icon Placeholder */}
                                    <div className="text-pink-500 flex items-center justify-center shrink-0">
                                        <Trophy size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="h-4 w-px bg-gray-400/30" />
                                    {/* XyberClan Icon */}
                                    <img src={getLogo()} alt="XyberClan Logo" className="w-5 h-5 object-contain shrink-0" />
                                    <div className="h-4 w-px bg-gray-400/30" />
                                    <span className={`text-[11px] font-black tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Hult Prize <span className="text-cyan-500 mx-1">×</span> XyberClan
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {p.hultStory.title}
                                </h2>
                                <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500" />
                            </div>

                            <div className="space-y-6 text-lg xl:text-xl leading-relaxed font-light">
                                {p.hultStory.narrative.map((paragraph, idx) => (
                                    <p key={idx} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                {p.hultStory.stats.map((stat, idx) => (
                                    <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30' : 'border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-cyan-500/30'}`}>
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 mb-1">{stat.value}</div>
                                        <div className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── Divider between potential future partner sections ─── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className={`w-full h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/10 to-transparent'}`} />
            </div>

            {/* ─── FINAL CALL TO ACTION ─── */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Ready to partner with us?
                    </h2>
                    <Link to="/start-project" className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-cyan-500/20 hover:scale-[1.03] transition-all">
                        {t.nav.getStarted}
                        <ArrowRight />
                    </Link>
                </div>
            </section>

            <Footer translations={t} />

            <style>{`
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PartnersPage;
