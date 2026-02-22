import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { translations } from './translations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';

/* ─── Tag color palette ─── */
const typeColors = {
    Hackathon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Workshop: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Atelier: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Conference: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Conférence: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Default: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const ArticleCard = ({ article, isDark, readMoreText, index }) => {
    const colorClass = typeColors[article.type] || typeColors.Default;
    const delay = index * 100;

    return (
        <div
            className={`group relative flex flex-col h-full rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 ${isDark
                ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
                : 'bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50'
                }`}
            style={{ animation: `heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
        >
            {/* Image Banner */}
            <div className="relative h-56 md:h-64 overflow-hidden w-full flex-shrink-0">
                <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/80 via-black/20 to-transparent' : 'from-black/60 via-black/10 to-transparent'}`} />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${colorClass}`}>
                        <Tag size={12} />
                        {article.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-md border border-white/10">
                        <Calendar size={12} />
                        {article.date}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-4 transition-colors duration-300 ${isDark ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                    {article.title}
                </h3>

                <p className={`text-[14px] md:text-[15px] leading-relaxed mb-8 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 300 }}>
                    {article.description}
                </p>

                {/* Read More button (visual only for now) */}
                <button className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-auto self-start transition-all duration-300 ${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'}`}>
                    {readMoreText}
                    <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>

            {/* Hover subtle glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:from-cyan-500/[0.03] group-hover:to-blue-500/[0.03] transition-colors duration-500 pointer-events-none" />
        </div>
    );
};

const EventsPage = () => {
    const { isDark } = useTheme();
    const [lang] = useState('en');
    const t = translations[lang];
    const ep = t.eventsPage;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <SharedNavbar transparentHero={true} />

            <PageHero
                lang={lang}
                badgeText={ep.badge}
                title={ep.title}
                subtitle={ep.subtitle}
                imageSrc="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop" // Abstract event/conference light trails
                stats={[]}
                trustBadges={[]}
            />

            <section className={`py-20 md:py-32 px-5 md:px-8 relative ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                <div className="max-w-[1400px] mx-auto relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {ep.articles.map((article, idx) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                isDark={isDark}
                                readMoreText={ep.readMore}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer translations={t} />
            <WhatsAppButton />

            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default EventsPage;
