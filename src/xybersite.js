import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Menu, X, Sun, Moon, ArrowUpRight, Globe, ChevronRight, Smartphone, Cloud, Palette, GitBranch, Repeat, Infinity, Sparkles, Server, Terminal, Layers } from 'lucide-react';
import { ReactIcon, NextIcon, TailwindIcon, NodeIcon, PythonIcon, FirebaseIcon, FigmaIcon, GitHubIcon, AdobeIcon } from './components/TechIcons';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { getLogo } from './utils/festive';
import WhatsAppButton from './components/WhatsAppButton';
import LiquidGlassHero from './components/LiquidGlassHero';
import FeaturesGrid from './components/FeaturesGrid';
import WhoWeAre from './components/WhoWeAre';
import TeamMinimal from './components/TeamMinimal';
import GetStarted from './components/GetStarted';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CTASection from './components/CTASection';
import StatsCounter from './components/StatsCounter';
import FAQSection from './components/FAQSection';
import TrustBadges from './components/TrustBadges';
import Newsletter from './components/Newsletter';
import Pricing from './components/Pricing';
import ExitPopup from './components/ExitPopup';
import ThemeSuggestionPopup from './components/ThemeSuggestionPopup';
import ScrollReveal, { ScrollToTop, ScrollIndicator } from './components/ScrollReveal';


const XyberClanWebsite = () => {
  const { isDark, toggleTheme } = useTheme();
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[lang];

  // Handle scroll effect for navigation
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on scroll
  React.useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [mobileMenuOpen]);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fr' : 'en');
  };

  const navLinks = ['home', 'about', 'services', 'team', 'contact'];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>

      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-[1400px] px-4 pt-4">
          <nav className={`flex items-center justify-between px-5 py-3 md:px-7 md:py-3.5 rounded-2xl transition-all duration-500 ${isScrolled
            ? `backdrop-blur-2xl shadow-lg border ${isDark ? 'bg-black/70 border-white/[0.08] shadow-black/30' : 'bg-white/70 border-black/[0.06] shadow-gray-200/60'}`
            : 'bg-transparent'
            }`}>

            {/* Left: Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src={getLogo()}
                alt="XyberClan"
                fetchpriority="high"
                decoding="async"
                className="w-14 h-14 object-contain"
              />
              <span className={`text-lg font-bold tracking-tight hidden sm:block ${isScrolled
                ? (isDark ? 'text-white' : 'text-gray-900')
                : 'text-white'
                } notranslate`} translate="no">
                XyberClan
              </span>
            </Link>

            {/* Center: Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                item === 'team' ? (
                  <Link
                    key={item}
                    to="/team"
                    className={`px-4 py-2 text-[13px] font-medium uppercase tracking-wider transition-all duration-200 rounded-lg ${isScrolled
                      ? (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                      : 'text-white/70 hover:text-white'
                      }`}
                  >
                    {t.nav[item]}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item);
                    }}
                    className={`px-4 py-2 text-[13px] font-medium uppercase tracking-wider transition-all duration-200 rounded-lg ${isScrolled
                      ? (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                      : 'text-white/70 hover:text-white'
                      }`}
                  >
                    {t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                )
              ))}
            </div>

            {/* Right: Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${isScrolled
                  ? (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5')
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={toggleLang}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isScrolled
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
              className={`lg:hidden p-2 rounded-lg transition-all ${isScrolled
                ? (isDark ? 'text-white' : 'text-gray-900')
                : 'text-white'
                }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* ─── Mobile Fullscreen Overlay ─── */}
        <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-3xl`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Decorative gradient orb */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-8 pt-28 pb-10">
            {/* Close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute top-7 right-7 w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-gray-900 hover:bg-black/10'}`}
            >
              <X size={22} />
            </button>

            {/* Logo top-left */}
            <div className="absolute top-7 left-8">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <img src={getLogo()} alt="XyberClan" className="w-14 h-14 object-contain" />
                <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'} notranslate`} translate="no">
                  Xyber<span className="text-cyan-500">Clan</span>
                </span>
              </Link>
            </div>

            {/* Links — large editorial style */}
            <div className="flex-1 flex flex-col justify-center gap-1">
              {navLinks.map((item, idx) => (
                item === 'team' ? (
                  <Link
                    key={item}
                    to="/team"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-baseline gap-4 py-4 transition-all duration-300 border-b ${isDark ? 'border-white/5 text-white hover:text-cyan-400' : 'border-black/5 text-gray-900 hover:text-cyan-600'}`}
                    style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.07}s both` : 'none' }}
                  >
                    <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>0{idx + 1}</span>
                    <span className="text-[2rem] font-black tracking-tight leading-none">{t.nav[item]}</span>
                    <ChevronRight size={18} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item}`}
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
                )
              ))}
            </div>

            {/* Bottom Actions — refined */}
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

      {/* Hero Section */}
      <div id="home">
        <LiquidGlassHero lang={lang} translations={t} />
      </div>

      {/* Scroll Progress Indicator */}
      <ScrollIndicator />

      {/* ─── PAGE SECTIONS — each with a unique scroll animation ─── */}

      {/* Who We Are */}
      <ScrollReveal animation="blurIn" delay={0.05} duration={1}>
        <WhoWeAre />
      </ScrollReveal>

      {/* Team */}
      <ScrollReveal animation="slideLeft" delay={0.08} duration={0.9}>
        <TeamMinimal />
      </ScrollReveal>

      {/* Features Grid */}
      <ScrollReveal animation="tiltIn" delay={0.06} duration={1}>
        <FeaturesGrid />
      </ScrollReveal>

      {/* Stats Counter */}
      <ScrollReveal animation="scaleReveal" delay={0.05} duration={0.85}>
        <StatsCounter />
      </ScrollReveal>

      {/* Trust Badges */}
      <ScrollReveal animation="subtleRise" delay={0.12} duration={1.1}>
        <TrustBadges />
      </ScrollReveal>

      {/* Pricing */}
      <ScrollReveal animation="zoomOut" delay={0.06} duration={0.95}>
        <Pricing />
      </ScrollReveal>

      {/* Technology Section */}
      <section className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <ScrollReveal animation="slideRight" delay={0.08} duration={0.95}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-14">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-cyan-400/70' : 'text-cyan-600/70'}`}>Technology</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-black tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.techStack.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tech Stack</span>
              </h2>
              <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                {t.techStack.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.techStack.items.map((tech, idx) => {
                // Define icons for each category index
                const categoryIcons = [
                  // Frontend
                  [
                    { Icon: ReactIcon, name: 'React' },
                    { Icon: NextIcon, name: 'Next.js' },
                    { Icon: TailwindIcon, name: 'Tailwind' },
                    { Icon: Sparkles, name: 'Framer' },
                    { Icon: Smartphone, name: 'Native' }
                  ],
                  // Backend
                  [
                    { Icon: NodeIcon, name: 'Node.js' },
                    { Icon: PythonIcon, name: 'Python' },
                    { Icon: FirebaseIcon, name: 'Firebase' },
                    { Icon: Cloud, name: 'AWS' },
                    { Icon: Server, name: 'Server' }
                  ],
                  // Design
                  [
                    { Icon: FigmaIcon, name: 'Figma' },
                    { Icon: AdobeIcon, name: 'Adobe' },
                    { Icon: Palette, name: 'Canva' },
                    { Icon: Layers, name: 'UI/UX' }
                  ],
                  // Collab
                  [
                    { Icon: GitBranch, name: 'Git' },
                    { Icon: GitHubIcon, name: 'GitHub' },
                    { Icon: Infinity, name: 'CI/CD' },
                    { Icon: Repeat, name: 'Agile' }
                  ]
                ][idx] || [];

                const MainIcon = [Layers, Server, Palette, Terminal][idx] || Layers;

                return (
                  <ScrollReveal key={idx} animation="fadeUp" delay={0.1 + idx * 0.12} duration={0.8}>
                    <div className={`group h-full ${isDark ? 'bg-gray-900/60 border-gray-800/60' : 'bg-gray-50 border-gray-200/80'} p-7 rounded-3xl border hover:border-cyan-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col`}>
                      <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/15 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-cyan-500/10">
                        <MainIcon className="w-6 h-6" />
                      </div>

                      <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{tech.name}</h3>
                      <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{tech.desc}</p>

                      <div className="mt-auto grid grid-cols-4 gap-2">
                        {categoryIcons.map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group/icon">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-black/40 text-gray-400 group-hover/icon:text-cyan-400 group-hover/icon:bg-cyan-500/10' : 'bg-white text-gray-500 group-hover/icon:text-cyan-600 group-hover/icon:bg-cyan-50'}`}>
                              <item.Icon className="w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 absolute -bottom-2 pointer-events-none translate-y-full bg-black text-white px-2 py-1 rounded">
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <ScrollReveal animation="blurIn" delay={0.06} duration={1.1}>
        <Testimonials />
      </ScrollReveal>

      {/* Get Started */}
      <ScrollReveal animation="clipUp" delay={0.08} duration={0.9}>
        <GetStarted />
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal animation="subtleRise" delay={0.1} duration={1}>
        <FAQSection />
      </ScrollReveal>

      {/* Newsletter */}
      <ScrollReveal animation="tiltIn" delay={0.06} duration={0.95}>
        <Newsletter />
      </ScrollReveal>

      {/* Contact Section */}
      {/* Contact Section */}
      <section id="contact" className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <ScrollReveal animation="scaleReveal" delay={0.06} duration={0.9}>
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-14">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-cyan-400/70' : 'text-cyan-600/70'}`}>
                {lang === 'en' ? 'Get in Touch' : 'Contactez-nous'}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.contact.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Start?</span>
              </h2>
              <p className={`text-base md:text-lg max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                {t.contact.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-14 text-left">
              {t.contact.items.map((item, idx) => (
                <ScrollReveal key={idx} animation="fadeUp" delay={0.08 + idx * 0.1} duration={0.8}>
                  <div className={`${isDark ? 'bg-gray-900/50 border-gray-800/60' : 'bg-gray-50/80 border-gray-200/80'} p-6 rounded-2xl border flex items-start space-x-4 hover:border-cyan-400/30 transition-all duration-500`}>
                    <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 flex-shrink-0">
                      {[<Shield size={20} />, <Eye size={20} />, <Lock size={20} />][idx]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{item.title}</h4>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </ScrollReveal>
        <CTASection />
      </section>

      {/* Footer */}
      <Footer translations={t} />
      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
      {/* Scroll To Top Button */}
      <ScrollToTop />
      {/* Exit Intent Popup */}
      <ExitPopup />
      {/* Theme Suggestion Popup */}
      <ThemeSuggestionPopup />
    </div>
  );
};

export default XyberClanWebsite;