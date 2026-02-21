import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { translations } from './translations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';

/* ─── Event Images — Unsplash keywords per milestone ─── */
const eventImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop&q=80', // students collaborating
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80', // first website launch
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&q=80', // team growth
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&q=80', // partnership handshake
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop&q=80', // design tools
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop&q=80', // cybersecurity
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop&q=80', // workshop/education
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&h=500&fit=crop&q=80', // global reach
];

/* ─── Tag color palette ─── */
const tagColors = {
    Genesis: 'from-violet-500 to-purple-600',
    Genèse: 'from-violet-500 to-purple-600',
    Milestone: 'from-cyan-500 to-blue-600',
    Jalon: 'from-cyan-500 to-blue-600',
    Growth: 'from-emerald-500 to-teal-600',
    Croissance: 'from-emerald-500 to-teal-600',
    Partnership: 'from-pink-500 to-rose-600',
    Partenariat: 'from-pink-500 to-rose-600',
    Expansion: 'from-orange-500 to-amber-600',
    Security: 'from-red-500 to-rose-600',
    Sécurité: 'from-red-500 to-rose-600',
    Community: 'from-blue-500 to-indigo-600',
    Communauté: 'from-blue-500 to-indigo-600',
    Global: 'from-cyan-400 to-blue-500',
};

/* ─── TIMELINE EVENT CARD ─── */
const EventCard = ({ event, imageUrl, isDark, isVisible, index }) => {
    const isLeft = index % 2 === 0;
    const gradient = tagColors[event.tag] || 'from-cyan-500 to-blue-600';

    return (
        <div
            className={`relative w-full transition-all duration-[900ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_80px_1fr] items-start">
                {/* Left column */}
                <div className={isLeft ? '' : 'order-3'}>
                    {isLeft && (
                        <div className={`ml-auto mr-0 max-w-[560px] ${isLeft ? 'text-right' : ''}`}>
                            <CardContent event={event} imageUrl={imageUrl} isDark={isDark} gradient={gradient} align="right" />
                        </div>
                    )}
                    {!isLeft && (
                        <div className="ml-0 mr-auto max-w-[560px]">
                            <CardContent event={event} imageUrl={imageUrl} isDark={isDark} gradient={gradient} align="left" />
                        </div>
                    )}
                </div>

                {/* Center: timeline dot & line */}
                <div className="flex flex-col items-center order-2 relative">
                    <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} shadow-lg ring-4 ${isDark ? 'ring-black' : 'ring-gray-50'
                            } transition-all duration-700 ${isVisible ? 'scale-100' : 'scale-0'}`}
                        style={{ transitionDelay: `${index * 100 + 300}ms` }}
                    />
                    {/* Pulsing glow */}
                    <div className={`absolute top-0 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} opacity-40 blur-md animate-pulse`} />
                </div>

                {/* Right column */}
                <div className={!isLeft ? '' : 'order-3'}>
                    {/* spacer — content is on the other side */}
                </div>
            </div>

            {/* Mobile: single column with left line */}
            <div className="lg:hidden flex gap-6">
                {/* Left dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-2">
                    <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient} shadow-md ring-[3px] ${isDark ? 'ring-black' : 'ring-gray-50'
                            } transition-all duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}
                    />
                </div>
                {/* Card */}
                <div className="flex-1 pb-4">
                    <CardContent event={event} imageUrl={imageUrl} isDark={isDark} gradient={gradient} align="left" />
                </div>
            </div>
        </div>
    );
};

/* ─── CARD CONTENT (image banner + text) ─── */
const CardContent = ({ event, imageUrl, isDark, gradient, align }) => (
    <div className={`group relative rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 ${isDark
        ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
        : 'bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50'
        }`}>
        {/* Image Banner */}
        <div className="relative h-48 md:h-56 overflow-hidden">
            <img
                src={imageUrl}
                alt={event.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/70 via-black/20 to-transparent' : 'from-black/50 via-black/10 to-transparent'
                }`} />
            {/* Date badge on image */}
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                    {event.tag}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-white/80">
                    <Calendar size={11} />
                    {event.date}
                </span>
            </div>
        </div>

        {/* Text content */}
        <div className="p-7 md:p-8">
            <h3
                className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-3 ${align === 'right' ? 'lg:text-right' : ''}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {event.title}
            </h3>
            <p
                className={`text-[14px] md:text-[15px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'} ${align === 'right' ? 'lg:text-right' : ''}`}
                style={{ fontWeight: 300 }}
            >
                {event.description}
            </p>
        </div>

        {/* Hover glow accent */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
    </div>
);


/* ═══════════════════════════════════════════════
   JOURNEY PAGE
   ═══════════════════════════════════════════════ */
const JourneyPage = () => {
    const { isDark } = useTheme();
    const [lang] = useState('en');
    const t = translations[lang];
    const j = t.journey;
    const [visibleEvents, setVisibleEvents] = useState(new Set());
    const eventRefs = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // IntersectionObserver for scroll-triggered card reveals
    useEffect(() => {
        const observers = [];
        eventRefs.current.forEach((ref, idx) => {
            if (!ref) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisibleEvents(prev => new Set([...prev, idx]));
                        observer.unobserve(ref);
                    }
                },
                { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
            );
            observer.observe(ref);
            observers.push(observer);
        });
        return () => observers.forEach(obs => obs.disconnect());
    }, [lang]);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* Shared Navbar (same as home page) */}
            <SharedNavbar />

            {/* ─── HERO SECTION ─── */}
            <PageHero
                lang={lang}
                badgeText={t.nav.journey}
                title={j.title}
                subtitle={`"${j.subtitle}"`}
                imageSrc="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" // Nature horizon / young people looking out context
                stats={[]}
                trustBadges={[]}
            />

            {/* ─── TIMELINE SECTION ─── */}
            <section className={`py-16 md:py-24 px-6 relative ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                {/* Desktop vertical center line */}
                <div className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px]">
                    <div className={`w-full h-full ${isDark
                        ? 'bg-gradient-to-b from-transparent via-white/[0.06] to-transparent'
                        : 'bg-gradient-to-b from-transparent via-gray-200/80 to-transparent'
                        }`} />
                </div>

                {/* Mobile vertical left line */}
                <div className="lg:hidden absolute left-[1.85rem] top-0 bottom-0 w-[2px]">
                    <div className={`w-full h-full ${isDark
                        ? 'bg-gradient-to-b from-transparent via-white/[0.06] to-transparent'
                        : 'bg-gradient-to-b from-transparent via-gray-200/80 to-transparent'
                        }`} />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="space-y-12 lg:space-y-20">
                        {j.events.map((event, idx) => (
                            <div key={idx} ref={el => eventRefs.current[idx] = el}>
                                <EventCard
                                    event={event}
                                    imageUrl={eventImages[idx] || eventImages[0]}
                                    index={idx}
                                    isDark={isDark}
                                    isVisible={visibleEvents.has(idx)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ─── CTA SECTION ─── */}
            <section className={`py-32 px-6 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none ${isDark ? 'bg-cyan-500/8' : 'bg-cyan-100/40'
                    }`} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="flex justify-center mb-10">
                        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                    </div>

                    <h2
                        className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {j.ctaTitle}
                    </h2>

                    <p
                        className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                        style={{ fontWeight: 300 }}
                    >
                        {j.ctaDesc}
                    </p>

                    <Link
                        to="/start-project"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.03] transition-all duration-300"
                    >
                        {t.nav.getStarted}
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <Footer translations={t} />
            <WhatsAppButton />

            <style>{`
                .journey-fade-in {
                    animation: journeyFadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
                }
                @keyframes journeyFadeUp {
                    from { opacity: 0; transform: translateY(25px); }
                    to { opacity: 1; transform: translateY(0); }
                }

            `}</style>
        </div>
    );
};

export default JourneyPage;
