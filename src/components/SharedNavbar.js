import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { getLogo } from '../utils/festive';
import EditableText from './cms/EditableText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SharedNavbar = ({ transparentHero = false }) => {
    const { isDark, toggleTheme } = useTheme();
    const { language: lang, toggleLanguage } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const t = translations[lang];

    // GSAP refs
    const navbarRef = useRef(null);
    const logoRef = useRef(null);
    const logoTextRef = useRef(null);
    const navCapsuleRef = useRef(null);
    // ctaButtonRef removed — button always stays visible
    const lastScrollY = useRef(0);
    const isHidden = useRef(false);
    const tl = useRef(null);

    const toggleLang = () => toggleLanguage();

    // ─── Basic scroll state (for background change) ───────────────────────────
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ─── GSAP hide/reveal on scroll ──────────────────────────────────────────
    useEffect(() => {
        let rafId;

        const getChars = () => logoTextRef.current?.querySelectorAll('[data-char]') || [];
        const getLinks = () => navCapsuleRef.current?.querySelectorAll('a, [href]') || [];

        const onScroll = () => {
            rafId = requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const diff = currentY - lastScrollY.current;

                // ── Scroll DOWN → hide ────────────────────────────────────────
                if (diff > 3 && currentY > 100 && !isHidden.current) {
                    isHidden.current = true;
                    if (tl.current) tl.current.kill();
                    tl.current = gsap.timeline();

                    // Logo image slides left + fades out
                    tl.current.to(logoRef.current, {
                        opacity: 0,
                        x: -12,
                        scale: 0.9,
                        duration: 0.25,
                        ease: 'power2.in',
                    }, 0);

                    // Logo chars blur out quickly with reverse stagger
                    tl.current.to(getChars(), {
                        opacity: 0,
                        filter: 'blur(6px)',
                        y: -6,
                        duration: 0.18,
                        ease: 'power1.in',
                        stagger: { each: 0.025, from: 'end' },
                    }, 0);

                    // Nav links slide up + fade out with stagger
                    tl.current.to(getLinks(), {
                        opacity: 0,
                        y: -10,
                        filter: 'blur(4px)',
                        duration: 0.2,
                        ease: 'power1.in',
                        stagger: { each: 0.03, from: 'end' },
                    }, 0);

                    // Capsule container fades last
                    tl.current.to(navCapsuleRef.current, {
                        opacity: 0,
                        scale: 0.97,
                        duration: 0.2,
                        ease: 'power2.in',
                    }, 0.15);
                }

                // ── Scroll UP → reveal with generation effect ─────────────────
                if (diff < -2 && isHidden.current) {
                    isHidden.current = false;
                    if (tl.current) tl.current.kill();

                    // Instantly restore parent containers
                    gsap.set(navCapsuleRef.current, { opacity: 1, scale: 1 });
                    gsap.set(logoTextRef.current, { opacity: 1, y: 0 });
                    gsap.set(logoRef.current, { opacity: 1, scale: 1 });

                    // Pre-set children to invisible
                    gsap.set(getChars(), { opacity: 0, filter: 'blur(8px)', y: 5 });
                    gsap.set(getLinks(), { opacity: 0, filter: 'blur(4px)', y: 8 });

                    tl.current = gsap.timeline();

                    // Logo image slides back in
                    tl.current.fromTo(logoRef.current,
                        { opacity: 0, x: -12, scale: 0.9 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'power3.out' },
                        0
                    );

                    // Nav links stagger in one-by-one (left → right)
                    tl.current.to(getLinks(), {
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        duration: 0.4,
                        ease: 'power3.out',
                        stagger: { each: 0.055, from: 'start' },
                    }, 0);

                    // Logo letters generate one-by-one (typewriter + blur-in)
                    tl.current.to(getChars(), {
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                        stagger: { each: 0.045, from: 'start' },
                    }, 0.12);
                }

                lastScrollY.current = currentY;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
            if (tl.current) tl.current.kill();
        };
    }, []);

    // ─── Close mobile menu on scroll ─────────────────────────────────────────
    useEffect(() => {
        if (mobileMenuOpen) {
            const close = () => setMobileMenuOpen(false);
            window.addEventListener('scroll', close, { passive: true });
            return () => window.removeEventListener('scroll', close);
        }
    }, [mobileMenuOpen]);

    const navLinks = ['home', 'about', 'team', 'partners', 'journey', 'events', 'portfolio', 'contact'];
    const routeLinks = { team: '/team', partners: '/partners', journey: '/journey', events: '/events', portfolio: '/portfolio' };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            window.location.href = `/#${id}`;
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isRouteLink = (item) => item in routeLinks;
    const isActiveRoute = (item) => {
        if (item === 'home') return location.pathname === '/';
        if (isRouteLink(item)) return location.pathname === routeLinks[item];
        return false;
    };

    const showTransparent = transparentHero && !isScrolled;

    // ─── Per-link class builder ───────────────────────────────────────────────
    const getLinkClass = (item) => {
        const active = isActiveRoute(item);
        const base = 'px-6 py-2.5 text-[14.5px] font-semibold tracking-wide transition-all duration-300 rounded-full select-none';

        if (item === 'home') {
            // Always cyan for "home"
            return `${base} text-cyan-500 hover:text-cyan-400 ${
                active
                    ? (isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/10')
                    : 'hover:bg-cyan-500/[0.07]'
            }`;
        }

        if (active) {
            return `${base} ${showTransparent 
                ? (isDark ? 'text-white' : 'text-gray-900') 
                : isDark
                    ? 'text-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.03)]'
                    : 'text-gray-900 bg-black/[0.04] shadow-sm'}`;
        }

        return `${base} ${showTransparent 
            ? (isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-gray-900')
            : isDark
                ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                : 'text-neutral-500 hover:text-gray-900 hover:bg-black/[0.03]'}`;
    };

    return (
        <>
            <header ref={navbarRef} className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto mx-auto max-w-[1400px] px-6 pt-5">
                    <nav className="flex items-center justify-between transition-all duration-500 bg-transparent">

                        {/* Left: Logo */}
                        <Link
                            ref={logoRef}
                            to="/"
                            className="flex items-center gap-3 group pointer-events-auto"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <img
                                src={getLogo()}
                                alt="XyberClan — Professional Digital Agency Logo"
                                fetchpriority="high"
                                decoding="async"
                                className="w-[50px] h-[50px] object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* GSAP animated logo text — split into chars */}
                            <span
                                ref={logoTextRef}
                                className={`text-[1.6rem] font-black tracking-tight notranslate inline-flex ${showTransparent ? 'text-white' : (isDark ? 'text-white' : 'text-gray-900')}`}
                                translate="no"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {'Xyber'.split('').map((char, i) => (
                                    <span key={`x${i}`} data-char style={{ display: 'inline-block' }}>{char}</span>
                                ))}
                                <span className="text-cyan-500 inline-flex">
                                    {'Clan'.split('').map((char, i) => (
                                        <span key={`c${i}`} data-char style={{ display: 'inline-block' }}>{char}</span>
                                    ))}
                                </span>
                            </span>
                        </Link>

                        {/* Right Group: Nav Links Capsule + CTA Button */}
                        <div className="hidden lg:flex items-center gap-2.5">

                            {/* Center: Nav Links Capsule — GSAP animated */}
                            <div
                                ref={navCapsuleRef}
                                className={`flex items-center p-1 rounded-l-xl rounded-r-full transition-colors duration-500 ${
                                    showTransparent
                                        ? 'bg-transparent border-transparent'
                                        : isDark
                                            ? 'bg-white/[0.03] border border-white/[0.08] shadow-lg shadow-black/40 backdrop-blur-xl'
                                            : 'bg-white/80 border border-black/[0.05] shadow-sm shadow-gray-200/50 backdrop-blur-xl'
                                }`}
                            >
                                {navLinks.map((item) => {
                                    const linkText = t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1);

                                    if (isRouteLink(item)) {
                                        return (
                                            <Link key={item} to={routeLinks[item]} className={getLinkClass(item)}>
                                                <EditableText contentKey={`${lang}.nav.${item}`} fallback={linkText} />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <a
                                            key={item}
                                            href={`/#${item}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection(item);
                                            }}
                                            className={getLinkClass(item)}
                                        >
                                            <EditableText contentKey={`${lang}.nav.${item}`} fallback={linkText} />
                                        </a>
                                    );
                                })}
                            </div>

                            {/* CTA Button — GSAP animated */}
                            <Link
                                to="/start-project"
                                className="px-8 py-3.5 rounded-l-full rounded-r-xl text-[14.5px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 select-none flex items-center justify-center border border-white/10"
                            >
                                <EditableText contentKey={`${lang}.nav.getStarted`} fallback={t.nav.getStarted} />
                            </Link>
                        </div>

                        {/* Mobile: Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-full transition-all pointer-events-auto ${
                                isScrolled ? (isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5') : 'bg-transparent'
                            } ${showTransparent ? 'text-white' : (isDark ? 'text-white' : 'text-gray-900')}`}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </nav>
                </div>

                {/* ─── Mobile Fullscreen Overlay ─── */}
                <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div
                        className={`absolute inset-0 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-3xl`}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full px-8 pt-28 pb-10">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className={`absolute top-7 right-7 w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-gray-900 hover:bg-black/10'}`}
                        >
                            <X size={22} />
                        </button>

                        <div className="absolute top-7 left-8">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                                <img src={getLogo()} alt="XyberClan" className="w-14 h-14 object-contain" />
                                <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'} notranslate`} translate="no">
                                    Xyber<span className="text-cyan-500">Clan</span>
                                </span>
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-1">
                            {navLinks.map((item, idx) => {
                                const active = isActiveRoute(item);
                                const isCyan = item === 'home' || active;
                                if (isRouteLink(item)) {
                                    return (
                                        <Link
                                            key={item}
                                            to={routeLinks[item]}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`group flex items-baseline gap-4 py-4 transition-all duration-300 border-b ${
                                                isCyan
                                                    ? (isDark ? 'border-white/5 text-cyan-400' : 'border-black/5 text-cyan-600')
                                                    : (isDark ? 'border-white/5 text-white hover:text-cyan-400' : 'border-black/5 text-gray-900 hover:text-cyan-600')
                                            }`}
                                            style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.07}s both` : 'none' }}
                                        >
                                            <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>0{idx + 1}</span>
                                            <span className="text-[2rem] font-black tracking-tight leading-none">
                                                <EditableText contentKey={`${lang}.nav.${item}`} fallback={t.nav[item]} />
                                            </span>
                                            <ChevronRight size={18} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                        </Link>
                                    );
                                }
                                return (
                                    <a
                                        key={item}
                                        href={`/#${item}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(item);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`group flex items-baseline gap-4 py-4 transition-all duration-300 border-b ${
                                            isCyan
                                                ? (isDark ? 'border-white/5 text-cyan-400' : 'border-black/5 text-cyan-600')
                                                : (isDark ? 'border-white/5 text-white hover:text-cyan-400' : 'border-black/5 text-gray-900 hover:text-cyan-600')
                                        }`}
                                        style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.07}s both` : 'none' }}
                                    >
                                        <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>0{idx + 1}</span>
                                        <span className="text-[2rem] font-black tracking-tight leading-none">
                                            <EditableText contentKey={`${lang}.nav.${item}`} fallback={t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)} />
                                        </span>
                                        <ChevronRight size={18} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                    </a>
                                );
                            })}
                        </div>

                        <div
                            className={`flex items-center justify-between pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}
                            style={{ animation: mobileMenuOpen ? 'heroFadeUp 0.6s ease-out 0.4s both' : 'none' }}
                        >
                            <div className="flex items-center gap-2">
                                <button onClick={toggleTheme} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-blue-600 hover:bg-black/10'}`}>
                                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                                <button onClick={toggleLang} className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${isDark ? 'bg-white/5 text-cyan-400 hover:bg-white/10' : 'bg-black/5 text-cyan-600 hover:bg-black/10'}`}>
                                    {lang.toUpperCase()}
                                </button>
                            </div>
                            <Link
                                to="/start-project"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.03]"
                            >
                                <EditableText contentKey={`${lang}.nav.getStarted`} fallback={t.nav.getStarted} /> →
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* heroFadeUp keyframes */}
            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default SharedNavbar;
