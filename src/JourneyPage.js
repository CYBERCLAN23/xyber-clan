import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SharedNavbar from './components/SharedNavbar';
import Meta from './components/Meta';
import EditableText from './components/cms/EditableText';
import EditableImage from './components/cms/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const JourneyPage = () => {
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const t = translations[language];
    const j = t.journey;
    const events = useMemo(() => j.events || [], [j.events]);

    const scrollSectionRef = useRef(null);
    const trackRef = useRef(null);
    const cardsRef = useRef([]);
    const nodesRef = useRef([]);
    const progressLineRef = useRef(null);
    const baseLineRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const bg = isDark ? '#0a0a0a' : '#f5f4f2';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!events.length || isMobile) return;

        const ctx = gsap.context(() => {
            const track = trackRef.current;
            const cards = cardsRef.current.filter(Boolean);
            const nodes = nodesRef.current.filter(Boolean);
            const baseLine = baseLineRef.current;
            const progressLine = progressLineRef.current;
            
            const N = cards.length;
            
            // Timeline pinning ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: scrollSectionRef.current,
                    start: 'top top',
                    end: `+=${N * 1800}px`,
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // Initial state layout
            // All cards are in their layout positions (y: -220 or y: 220), small, slightly faded, and blurred
            cards.forEach((card, idx) => {
                const initialY = idx % 2 === 0 ? -200 : 200;
                gsap.set(card, { 
                    y: initialY, 
                    scale: 0.8, 
                    opacity: 0.15, 
                    filter: 'blur(8px)',
                    zIndex: 10 
                });
            });
            gsap.set(nodes, { scale: 0.8, backgroundColor: isDark ? '#222' : '#ddd', borderColor: border });
            
            // Center the first card horizontally on start (align its center with 50vw center)
            gsap.set(track, { x: -350 });
            gsap.set(cards[0], { scale: 1.0, opacity: 0.8, filter: 'blur(0px)', zIndex: 20 });

            // Create step animations for all milestones
            events.forEach((_, idx) => {
                const card = cards[idx];
                const node = nodes[idx];
                const targetY = idx % 2 === 0 ? -200 : 200; // Original graph track offset
                const trackOffset = -(idx * 850 + 350); // Horizontal spacing offset to center card idx

                // ── STEP A: Slide the track to align the current milestone node in center ──
                if (idx > 0) {
                    tl.to(track, {
                        x: trackOffset,
                        duration: 1.2,
                        ease: 'power2.inOut',
                    }, `slide-${idx}`);

                    // Fade previous card back to graph state and shrink/blur it
                    const prevCard = cards[idx - 1];
                    const prevTargetY = (idx - 1) % 2 === 0 ? -200 : 200;
                    tl.to(prevCard, {
                        y: prevTargetY,
                        scale: 0.8,
                        opacity: 0.1,
                        filter: 'blur(6px)',
                        zIndex: 10,
                        duration: 0.8,
                        ease: 'power2.out',
                    }, `slide-${idx}`);

                    tl.to(nodes[idx - 1], {
                        scale: 0.8,
                        backgroundColor: isDark ? '#222' : '#ddd',
                        borderColor: border,
                        duration: 0.8,
                    }, `slide-${idx}`);

                    // Prepare current card as it moves into the screen
                    tl.to(card, {
                        opacity: 0.6,
                        scale: 0.9,
                        filter: 'blur(3px)',
                        duration: 0.8,
                        ease: 'power2.out',
                    }, `slide-${idx}`);

                    // Move axis progress fill line
                    const progressPercent = (idx / (N - 1)) * 100;
                    tl.to(progressLine, {
                        width: `${progressPercent}%`,
                        duration: 1.2,
                        ease: 'power2.inOut',
                    }, `slide-${idx}`);
                }

                // ── STEP B: Zoom INTO the card (Full View / Detail Panel take over) ──
                // We move the card to Y: 0 (center of line), scale it up to 1.45,
                // and hide the axis line, nodes, and dim everything else.
                tl.to(card, {
                    y: 0,
                    scale: 1.4,
                    opacity: 1,
                    filter: 'blur(0px)',
                    zIndex: 100,
                    duration: 1.5,
                    ease: 'power3.inOut',
                }, `zoom-${idx}`);

                tl.to(node, {
                    scale: 1.8,
                    backgroundColor: '#06b6d4',
                    borderColor: '#06b6d4',
                    duration: 1.0,
                    ease: 'power2.out',
                }, `zoom-${idx}`);

                // Hide graph axis lines and other nodes during the full screen card detail view
                tl.to([baseLine, progressLine], {
                    opacity: 0.05,
                    duration: 1.0,
                    ease: 'power2.out',
                }, `zoom-${idx}`);

                // Hide other nodes during zoom
                const otherNodes = nodes.filter((_, nIdx) => nIdx !== idx);
                if (otherNodes.length) {
                    tl.to(otherNodes, {
                        opacity: 0,
                        duration: 1.0,
                    }, `zoom-${idx}`);
                }

                // ── STEP C: Hold detail screen state so user can read ──
                tl.to({}, { duration: 2.0 });

                // ── STEP D: Zoom BACK OUT to the graph track ──
                // Restore card coordinates, bring back the axis, nodes, and progress line
                if (idx < N - 1) {
                    tl.to(card, {
                        y: targetY,
                        scale: 0.9,
                        opacity: 0.5,
                        filter: 'blur(3px)',
                        zIndex: 20,
                        duration: 1.5,
                        ease: 'power3.inOut',
                    }, `unzoom-${idx}`);

                    tl.to(node, {
                        scale: 1.0,
                        backgroundColor: '#06b6d4',
                        borderColor: '#06b6d4',
                        duration: 1.0,
                    }, `unzoom-${idx}`);

                    tl.to([baseLine, progressLine], {
                        opacity: 1.0,
                        duration: 1.0,
                        ease: 'power2.inOut',
                    }, `unzoom-${idx}`);

                    if (otherNodes.length) {
                        tl.to(otherNodes, {
                            opacity: 1.0,
                            duration: 1.0,
                        }, `unzoom-${idx}`);
                    }
                } else {
                    // For the last card, let it stay zoomed or scale down slightly at the very end of scroll
                    tl.to(card, {
                        scale: 1.35,
                        duration: 1.0,
                    });
                }
            });

        }, scrollSectionRef);

        return () => ctx.revert();
    }, [events, isDark, border, isMobile]);

    return (
        <div style={{ background: bg, color: text, fontFamily: FONT }} className="min-h-screen transition-colors duration-300">
            <Meta
                title="Our Journey | The XyberClan Story"
                description="Explore the evolution of XyberClan from a campus vision to a leading cybersecurity and tech innovation startup delivering robust digital solutions globally."
            />
            <SharedNavbar transparentHero={true} />

            {/* ─── Editorial Hero ─── */}
            <section className="relative pt-44 pb-20 md:pb-28" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20">
                    <div className="grid lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-7">
                            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-8" style={{ color: '#06b6d4' }}>
                                {j.heroTag || "The Story So Far"}
                            </p>
                            <h1 className="leading-[0.85] tracking-[-0.04em] mb-4" style={{ fontWeight: 900, fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}>
                                Our<br />Journey.
                            </h1>
                        </div>
                        <div className="lg:col-span-5 lg:pl-12 relative">
                            {/* Accent dot */}
                            <div className="absolute -left-6 top-2.5 w-2 h-2 rounded-full bg-red-600" />
                            <p className="text-base leading-relaxed mb-6 font-light" style={{ color: muted }}>
                                {j.subtitle}
                            </p>
                            <div className="flex gap-12 pt-4 border-t" style={{ borderColor: border }}>
                                <div>
                                    <span className="block text-2xl font-black text-cyan-500">2023</span>
                                    <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Inception</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-cyan-500">{events.length}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Milestones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── HORIZONTAL SCROLL TIMELINE GRAPH OR MOBILE VERTICAL TIMELINE ─── */}
            {isMobile ? (
                /* Mobile Vertical Timeline */
                <section className="relative px-6 py-16" style={{ background: bg }}>
                    {/* Dynamic Cyan Mesh Glow */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ background: `radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 60%)` }} />

                    <div className="relative max-w-[600px] mx-auto">
                        {/* Vertical Path Line */}
                        <div 
                            style={{ 
                                position: 'absolute',
                                left: 16,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                            }}
                        />

                        <div className="flex flex-col gap-12 relative">
                            {events.map((event, idx) => (
                                <div key={idx} className="relative pl-10 flex flex-col items-start">
                                    {/* Timeline Node dot */}
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            left: 12,
                                            top: 24,
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: '#06b6d4',
                                            border: `2px solid ${isDark ? '#000' : '#fff'}`,
                                            boxShadow: '0 0 8px rgba(6,182,212,0.6)',
                                            zIndex: 2,
                                        }}
                                    />

                                    {/* Card */}
                                    <div 
                                        className="rounded-2xl border overflow-hidden flex flex-col w-full"
                                        style={{
                                            borderColor: border,
                                            background: isDark ? '#111' : '#fff',
                                            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        {/* Top Image */}
                                        <div className="w-full h-48 relative overflow-hidden">
                                            <EditableImage
                                                contentKey={`${language}.journeyPage.event${idx}.image`}
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ background: '#06b6d4', color: '#fff' }}>
                                                    <EditableText contentKey={`${language}.journeyPage.event${idx}.tag`} fallback={event.tag} />
                                                </span>
                                                <div className="text-white/90 text-[10px] font-semibold">
                                                    <EditableText contentKey={`${language}.journeyPage.event${idx}.date`} fallback={event.date} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Details */}
                                        <div className="p-6">
                                            <span className="text-[9px] font-bold tracking-widest text-cyan-500 uppercase block mb-1">
                                                Milestone 0{idx + 1}
                                            </span>
                                            <h3 className="text-lg font-black leading-tight mb-2" style={{ color: text }}>
                                                <EditableText contentKey={`${language}.journeyPage.event${idx}.title`} fallback={event.title} />
                                            </h3>
                                            <p className="text-xs leading-relaxed font-light" style={{ color: muted }}>
                                                <EditableText contentKey={`${language}.journeyPage.event${idx}.description`} fallback={event.description} multiline />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                /* Desktop Horizontal Timeline */
                <section
                    ref={scrollSectionRef}
                    className="relative h-screen overflow-hidden flex flex-col justify-center"
                    style={{ background: bg }}
                >
                    {/* Dynamic Cyan Mesh Glow */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: `radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 60%)` }} />

                    {/* Subtitle / Scroll Prompt Instruction */}
                    <div className="absolute top-12 left-8 md:left-20 z-20 flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-500 animate-pulse">
                            Scroll down to travel
                        </span>
                        <ChevronRight size={14} className="text-cyan-500 animate-bounce horizontal" />
                    </div>

                    {/* Horizontal Rail track */}
                    <div className="relative w-full overflow-visible h-[600px] flex items-center">
                        
                        {/* The Background Timeline Axis Line */}
                        <div 
                            ref={baseLineRef}
                            style={{ 
                                position: 'absolute',
                                left: '50vw',
                                right: 0,
                                top: '50%',
                                height: 2,
                                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                willChange: 'opacity',
                            }}
                        />

                        {/* Cyan progress overlay line */}
                        <div 
                            ref={progressLineRef}
                            style={{ 
                                position: 'absolute',
                                left: '50vw',
                                top: '50%',
                                height: 2,
                                width: '0%',
                                background: '#06b6d4',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                boxShadow: '0 0 8px rgba(6,182,212,0.6)',
                                willChange: 'width, opacity',
                            }}
                        />

                        {/* Sliding Rail track containing all milestones */}
                        <div 
                            ref={trackRef}
                            className="flex items-center gap-[100px] px-[50vw] relative z-10"
                            style={{ willChange: 'transform' }}
                        >
                            {events.map((event, idx) => {
                                return (
                                    <div 
                                        key={idx}
                                        className="relative flex items-center justify-center shrink-0"
                                        style={{ width: 700, height: '100%' }}
                                    >
                                        {/* Timeline Node Point directly on the horizontal line */}
                                        <div 
                                            ref={el => nodesRef.current[idx] = el}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 14,
                                                height: 14,
                                                borderRadius: '50%',
                                                border: `2px solid ${isDark ? '#000' : '#fff'}`,
                                                backgroundColor: isDark ? '#222' : '#ddd',
                                                zIndex: 5,
                                                transition: 'background-color 0.3s, border-color 0.3s',
                                                willChange: 'transform, opacity',
                                            }}
                                        />

                                        {/* Event Card positioned above/below the axis alternatively */}
                                        <div
                                            ref={el => cardsRef.current[idx] = el}
                                            className="rounded-2xl border overflow-hidden flex absolute journey-card"
                                            style={{
                                                borderColor: border,
                                                background: isDark ? '#111' : '#fff',
                                                boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.06)',
                                                width: 'min(700px, 80vw)',
                                                height: 340,
                                                willChange: 'transform, opacity, filter',
                                            }}
                                        >
                                            {/* Left Side: Photo */}
                                            <div className="w-[45%] h-full relative shrink-0 overflow-hidden journey-card-image">
                                                <EditableImage
                                                    contentKey={`${language}.journeyPage.event${idx}.image`}
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover"
                                                    style={{ objectPosition: event.objectPosition || 'center center' }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                
                                                {/* Date / Tag Overlay */}
                                                <div className="absolute bottom-6 left-6">
                                                    <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ background: '#06b6d4', color: '#fff' }}>
                                                        <EditableText contentKey={`${language}.journeyPage.event${idx}.tag`} fallback={event.tag} />
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
                                                        <Calendar size={12} className="text-cyan-400" />
                                                        <EditableText contentKey={`${language}.journeyPage.event${idx}.date`} fallback={event.date} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Details */}
                                            <div className="flex-1 p-8 flex flex-col justify-center">
                                                <span className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase mb-2">
                                                    Milestone 0{idx + 1}
                                                </span>
                                                <h3 className="text-xl font-black leading-tight mb-4" style={{ color: text, tracking: '-0.02em' }}>
                                                    <EditableText contentKey={`${language}.journeyPage.event${idx}.title`} fallback={event.title} />
                                                </h3>
                                                <p className="text-xs leading-relaxed font-light" style={{ color: muted }}>
                                                    <EditableText contentKey={`${language}.journeyPage.event${idx}.description`} fallback={event.description} multiline />
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                    </div>
                            </section>
                        )}
            
                        <style>{`
                            @media (max-width: 900px) {
                                .journey-card { flex-direction: column !important; height: auto !important; }
                                .journey-card-image { width: 100% !important; height: 200px !important; }
                            }
                        `}</style>
            
                        {/* ─── CTA SECTION ─── */}
            <section className="relative overflow-hidden" style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36 text-center">
                    <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6" style={{ color: '#06b6d4' }}>
                        What's Next
                    </p>
                    <h2 className="leading-[0.9] tracking-[-0.03em] mb-6" style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}>
                        <EditableText contentKey={`${language}.journeyPage.ctaTitle`} fallback={j.ctaTitle} />
                    </h2>
                    <p className="text-sm max-w-xl mx-auto mb-10 leading-relaxed font-light" style={{ color: muted }}>
                        <EditableText contentKey={`${language}.journeyPage.ctaDesc`} fallback={j.ctaDesc} multiline />
                    </p>
                    <Link
                        to="/start-project"
                        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:gap-3"
                        style={{ background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff' }}
                    >
                        <EditableText contentKey={`${language}.journeyPage.ctaButton`} fallback={t.nav.getStarted} />
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <Footer translations={t} />
            <WhatsAppButton />
        </div>
    );
};

export default JourneyPage;
