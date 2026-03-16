import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import { ArrowRight, Handshake, Trophy, Zap, Users, Globe } from 'lucide-react';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';
import PartnershipForm from './PartnershipForm';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';

const PartnersPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const [mounted, setMounted] = useState(false);

    // Form / Interaction State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState('partner'); // 'partner' or 'sponsor'

    const t = translations[language];
    const p = t.partnersPage;

    useEffect(() => {
        window.scrollTo(0, 0);
        setMounted(true);
    }, []);

    const openForm = (type) => {
        setFormType(type);
        setIsFormOpen(true);
    };

    const handleFormComplete = (summary) => {
        console.log("Form completed:", summary);
        // Form now handles its own internal success state
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Meta
                title="Our Strategic Partners | Collaborative Innovation"
                description="Discover XyberClan's strategic alliances, including our technical sponsorship of Hult Prize UY1. We collaborate to drive social and technological impact."
            />

            {/* ─── SHARED NAVIGATION ─── */}
            <SharedNavbar transparentHero={true} />

            {/* ─── HERO SECTION ─── */}
            <PageHero
                lang={language}
                badgeText={<EditableText contentKey={`${language}.nav.partners`} fallback={t.nav.partners} />}
                title={<EditableText contentKey={`${language}.partnersPage.title`} fallback={p.title} />}
                subtitle={<EditableText contentKey={`${language}.partnersPage.subtitle`} tag="span" fallback={`"${p.subtitle}"`} />}
                imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                stats={[
                    { value: 'Global', label: 'Reach' },
                    { value: '100%', label: 'Commitment' }
                ]}
                trustBadges={[
                    { icon: <Handshake size={14} />, label: 'Strategic Alliance' },
                    { icon: <Globe size={14} />, label: 'Worldwide Network' }
                ]}
            />

            {/* ─── PARTNERSHIP: HULT PRIZE SECTION ─── */}
            <section className="py-24 px-6 relative mt-12">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className={`relative group transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
                            <div className={`relative aspect-[4/5] sm:aspect-square rounded-[2.5rem] overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                                    alt="Abstract Technology Collaboration"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg text-white">
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-xl tracking-tight">Hult Prize Collaboration</p>
                                            <p className="text-white/70 font-medium text-sm">Empowering Social Innovation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`space-y-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-500 text-xs font-black uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                Strategic Partnership
                            </span>
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <EditableText contentKey={`${language}.partnersPage.hultStory.title`} fallback={p.hultStory.title} />
                                </h2>
                                <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                            </div>
                            <div className="space-y-6 text-lg leading-relaxed font-light">
                                {p.hultStory.narrative.map((paragraph, idx) => (
                                    <p key={idx} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        <EditableText contentKey={`${language}.partnersPage.hultStory.narrative${idx}`} fallback={paragraph} multiline />
                                    </p>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                                {p.hultStory.stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className={`group p-6 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-cyan-500/30'}`}
                                    >
                                        <div className="w-10 h-10 mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                            {idx === 0 ? <Zap size={20} /> : idx === 1 ? <Users size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 mb-1">{stat.value}</div>
                                        <div className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA: INTERACTIVE BUTTONS SECTION ─── */}
            <section className={`py-32 px-6 relative overflow-hidden ${isDark ? 'bg-white/[0.02]' : 'bg-gray-100/50'}`}>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-cyan-500/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className={`space-y-6 mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">XyberClan Network</span>
                        </h2>
                        <p className={`text-xl font-light max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <EditableText contentKey={`${language}.partnersPage.joinSubtitle`} fallback="Whether you want to build the next big thing or support our tech movement, we have a place for you." />
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <button
                            onClick={() => openForm('partner')}
                            className={`group relative p-12 rounded-[2.5rem] border transition-all duration-500 active:scale-95 overflow-hidden text-left ${isDark ? 'bg-white/[0.03] border-white/10 hover:border-cyan-500/50 shadow-2xl' : 'bg-white border-gray-200 hover:border-cyan-500/50 shadow-xl shadow-gray-200/50'}`}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Handshake size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-3 tracking-tight">{p.ctaPartner}</h3>
                                <div className="flex items-center gap-2 text-cyan-500 font-bold group-hover:translate-x-2 transition-transform">
                                    <span>Get Started</span>
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                        </button>

                        <button
                            onClick={() => openForm('sponsor')}
                            className={`group relative p-12 rounded-[2.5rem] border transition-all duration-500 active:scale-95 overflow-hidden text-left ${isDark ? 'bg-white/[0.03] border-white/10 hover:border-purple-500/50 shadow-2xl' : 'bg-white border-gray-200 hover:border-purple-500/50 shadow-xl shadow-gray-200/50'}`}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Trophy size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-3 tracking-tight">{p.ctaSponsor}</h3>
                                <div className="flex items-center gap-2 text-purple-500 font-bold group-hover:translate-x-2 transition-transform">
                                    <span>Support Us</span>
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
                        </button>
                    </div>
                </div>
            </section>

            {/* MODAL FORM OVERLAY */}
            <PartnershipForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                type={formType}
                lang={language}
                t={t}
                onComplete={handleFormComplete}
            />

            <Footer translations={t} />

        </div>
    );
};

export default PartnersPage;
