import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Globe, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../translations';
import { getLogo } from '../utils/festive';

const SharedNavbar = ({ transparentHero = false }) => {
    const { isDark, toggleTheme } = useTheme();
    const [lang, setLang] = useState('en');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const t = translations[lang];

    const toggleLang = () => setLang(lang === 'en' ? 'fr' : 'en');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            const close = () => setMobileMenuOpen(false);
            window.addEventListener('scroll', close, { passive: true });
            return () => window.removeEventListener('scroll', close);
        }
    }, [mobileMenuOpen]);

    const navLinks = ['home', 'about', 'services', 'team', 'partners', 'journey', 'contact'];
    const routeLinks = { team: '/team', partners: '/partners', journey: '/journey' };

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

    // Determine if nav should be transparent initially (hero pages)
    const showTransparent = transparentHero && !isScrolled;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto mx-auto max-w-[1400px] px-4 pt-4">
                    <nav className={`flex items-center justify-between px-5 py-3 md:px-7 md:py-3.5 rounded-2xl transition-all duration-500 ${isScrolled
                        ? `backdrop-blur-2xl shadow-lg border ${isDark ? 'bg-black/70 border-white/[0.08] shadow-black/30' : 'bg-white/70 border-black/[0.06] shadow-gray-200/60'}`
                        : showTransparent ? 'bg-transparent' : `backdrop-blur-2xl border ${isDark ? 'bg-black/60 border-white/[0.06]' : 'bg-white/60 border-black/[0.04]'}`
                        }`}>

                        {/* Left: Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <img
                                src={getLogo()}
                                alt="XyberClan — Professional Digital Agency Logo"
                                fetchpriority="high"
                                decoding="async"
                                className="w-14 h-14 object-contain"
                            />
                            <span className={`text-lg font-bold tracking-tight hidden sm:block ${showTransparent ? 'text-white' : (isDark ? 'text-white' : 'text-gray-900')
                                } notranslate`} translate="no">
                                XyberClan
                            </span>
                        </Link>

                        {/* Center: Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((item) => {
                                const active = isActiveRoute(item);
                                if (isRouteLink(item)) {
                                    return (
                                        <Link
                                            key={item}
                                            to={routeLinks[item]}
                                            className={`px-4 py-2 text-[13px] font-medium uppercase tracking-wider transition-all duration-200 rounded-lg ${active ? 'text-cyan-500' :
                                                    (isScrolled || !showTransparent)
                                                        ? (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                                                        : 'text-white/70 hover:text-white'
                                                }`}
                                        >
                                            {t.nav[item]}
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
                                        className={`px-4 py-2 text-[13px] font-medium uppercase tracking-wider transition-all duration-200 rounded-lg ${(isScrolled || !showTransparent)
                                                ? (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                                                : 'text-white/70 hover:text-white'
                                            }`}
                                    >
                                        {t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right: Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all duration-200 ${(isScrolled || !showTransparent)
                                        ? (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5')
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                onClick={toggleLang}
                                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${(isScrolled || !showTransparent)
                                        ? (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5')
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Globe size={14} />
                                {lang}
                            </button>

                            <Link
                                to="/start-project"
                                className="ml-1 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                            >
                                {t.nav.getStarted}
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        {/* Mobile: Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-all ${showTransparent ? 'text-white' : (isDark ? 'text-white' : 'text-gray-900')
                                }`}
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
                                if (isRouteLink(item)) {
                                    return (
                                        <Link
                                            key={item}
                                            to={routeLinks[item]}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`group flex items-baseline gap-4 py-4 transition-all duration-300 border-b ${active
                                                    ? (isDark ? 'border-white/5 text-cyan-400' : 'border-black/5 text-cyan-600')
                                                    : (isDark ? 'border-white/5 text-white hover:text-cyan-400' : 'border-black/5 text-gray-900 hover:text-cyan-600')
                                                }`}
                                            style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.07}s both` : 'none' }}
                                        >
                                            <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>0{idx + 1}</span>
                                            <span className="text-[2rem] font-black tracking-tight leading-none">{t.nav[item]}</span>
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
                                        className={`group flex items-baseline gap-4 py-4 transition-all duration-300 border-b ${isDark ? 'border-white/5 text-white hover:text-cyan-400' : 'border-black/5 text-gray-900 hover:text-cyan-600'}`}
                                        style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.07}s both` : 'none' }}
                                    >
                                        <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>0{idx + 1}</span>
                                        <span className="text-[2rem] font-black tracking-tight leading-none">{t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}</span>
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
                                {t.nav.getStarted} →
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* heroFadeUp keyframes (needed if not globally defined) */}
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
