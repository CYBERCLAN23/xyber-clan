import React, { useState, useEffect, useMemo } from 'react';
import { ArrowDown, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';
import EditableImage from './components/cms/EditableImage';

/* ─── Tag color palette ─── */
const typeColors = {
    Hackathon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Workshop: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Atelier: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Conference: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Conférence: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Default: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const EventSection = ({ article, isDark, readMoreText, index, language }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = useMemo(() => article.images || [article.image], [article.images, article.image]);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images]);

    const displayImage = images[currentImageIndex];
    const colorClass = typeColors[article.type] || typeColors.Default;
    const isEven = index % 2 === 0;

    return (
        <section className={`relative min-h-[90vh] flex items-center overflow-hidden py-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>

            {/* Background Image with Parallax & Overlays */}
            <div className="absolute inset-0 z-0">
                <EditableImage
                    contentKey={`${language}.eventsPage.article${index}.bgImage`}
                    src={displayImage}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-30 md:opacity-40 scale-105 transition-all duration-1000"
                    style={{
                        transform: 'translateZ(-10px) scale(1.1)',
                        objectPosition: article.objectPosition || 'center center'
                    }}
                />

                {/* Advanced Gradients for Text Legibility & Aesthetics */}
                <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/90 via-black/80 to-black/95' : 'from-white/90 via-white/80 to-white/95'}`} />
                <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} ${isDark ? 'from-black/90 to-transparent' : 'from-gray-50/90 to-transparent'}`} />
            </div>

            {/* Content Container */}
            <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-20`}>

                {/* Text Content */}
                <div className="flex-1 space-y-8" style={{ animation: `heroFadeUp 1s ease-out ${index * 0.2}s both` }}>
                    <div className="flex flex-wrap items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold backdrop-blur-md border ${colorClass}`}>
                            <Tag size={14} />
                            <EditableText contentKey={`${language}.eventsPage.article${index}.type`} fallback={article.type} />
                        </span>
                        <span className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Calendar size={14} />
                            <EditableText contentKey={`${language}.eventsPage.article${index}.date`} fallback={article.date} />
                        </span>
                    </div>

                    <h2 className={`text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                        <EditableText contentKey={`${language}.eventsPage.article${index}.title`} fallback={article.title} />
                    </h2>

                    <p className={`text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 300 }}>
                        <EditableText contentKey={`${language}.eventsPage.article${index}.description`} fallback={article.description} multiline />
                    </p>

                    <a
                        href={article.url || '#'}
                        target={article.url ? "_blank" : "_self"}
                        rel={article.url ? "noopener noreferrer" : ""}
                        className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${isDark
                            ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/10'
                            : 'bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-xl'
                            }`}
                    >
                        <EditableText contentKey={`${language}.eventsPage.readMore`} fallback={readMoreText} />
                        <ExternalLink size={18} className="transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Animated Visual/GIF Element */}
                <div className="flex-1 w-full max-w-lg relative" style={{ animation: `heroFadeUp 1.2s ease-out ${index * 0.2 + 0.3}s both` }}>
                    {/* Decorative glow behind the image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 rounded-[3rem] blur-3xl" />

                    <div className={`relative aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[3rem] overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl transition-transform duration-700 hover:scale-[1.02]`}>
                        <EditableImage
                            contentKey={`${language}.eventsPage.article${index}.image`}
                            src={displayImage}
                            alt={`${article.title} visual`}
                            className="w-full h-full object-cover transition-all duration-1000"
                            style={{
                                objectPosition: article.objectPosition || 'center center'
                            }}
                        />
                        {/* Overlay to blend the image slightly */}
                        <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-white/10'} mix-blend-overlay pointer-events-none`} />

                        {/* Small floating "animated" badge or gif representation overlay */}
                        <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator (except for last item) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <span className={`text-xs uppercase tracking-[0.3em] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Scroll</span>
                <ArrowDown size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            </div>
        </section>
    );
};

const EventsPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];
    const ep = t.eventsPage;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Meta
                title="Events & Blog | Stay Connected"
                description="Follow XyberClan's latest news, event participations, and technical insights. Stay updated with the African tech ecosystem."
            />
            <SharedNavbar transparentHero={true} />

            <PageHero
                lang={language}
                contentKeyPrefix={`${language}.eventsPage.hero`}
                badgeText={ep.badge}
                title={ep.title}
                subtitle={ep.subtitle}
                imageSrc="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop"
                stats={[]}
                trustBadges={[]}
            />

            <div className="w-full flex flex-col">
                {ep.articles.map((article, idx) => (
                    <EventSection
                        key={article.id}
                        article={article}
                        isDark={isDark}
                        readMoreText={ep.readMore}
                        index={idx}
                        language={language}
                    />
                ))}
            </div>

            <Footer translations={t} />
            <WhatsAppButton />

            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(50px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
            `}</style>
        </div>
    );
};

export default EventsPage;
