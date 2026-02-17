import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Menu, X, Sun, Moon, ArrowUpRight, Globe } from 'lucide-react';
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
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className={`text-lg font-bold tracking-tight hidden sm:block ${isScrolled
                  ? (isDark ? 'text-white' : 'text-gray-900')
                  : 'text-white'
                }`}>
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
            className={`absolute inset-0 backdrop-blur-2xl ${isDark ? 'bg-black/90' : 'bg-white/90'}`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-8 pt-24 pb-10">
            {/* Close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute top-6 right-6 p-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/5'}`}
            >
              <X size={24} />
            </button>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              {navLinks.map((item, idx) => (
                item === 'team' ? (
                  <Link
                    key={item}
                    to="/team"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-3xl font-bold py-3 transition-all duration-300 ${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'}`}
                    style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s ease-out ${idx * 0.08}s both` : 'none' }}
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
                      setMobileMenuOpen(false);
                    }}
                    className={`text-3xl font-bold py-3 transition-all duration-300 ${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'}`}
                    style={{ animation: mobileMenuOpen ? `heroFadeUp 0.5s ease-out ${idx * 0.08}s both` : 'none' }}
                  >
                    {t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                )
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-current/10">
              <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className={`p-3 rounded-xl ${isDark ? 'bg-white/5 text-yellow-400' : 'bg-black/5 text-blue-600'}`}>
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={toggleLang} className={`px-4 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 text-cyan-400' : 'bg-black/5 text-cyan-600'}`}>
                  {lang.toUpperCase()}
                </button>
              </div>
              <Link
                to="/start-project"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20"
              >
                {t.nav.getStarted}
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

      {/* Services Section - Bento Grid Style */}

      {/* Who We Are (Reference Design) */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <WhoWeAre />
      </ScrollReveal>

      {/* Meet Our Team Section - Redesigned */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <TeamMinimal />
      </ScrollReveal>

      {/* Features Section - Bento Style (Image 1) */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <FeaturesGrid />
      </ScrollReveal>

      {/* Stats Counter */}
      <ScrollReveal animation="scale" delay={0.1}>
        <StatsCounter />
      </ScrollReveal>

      {/* Trust Badges */}
      <ScrollReveal animation="blur" delay={0.1}>
        <TrustBadges />
      </ScrollReveal>

      {/* Pricing Section */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <Pricing />
      </ScrollReveal>

      {/* Technology Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-16`}>
              <h2 className="text-4xl font-bold mb-4">
                {t.techStack.title} <span className="text-cyan-400">Tech Stack</span>
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.techStack.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {t.techStack.items.map((tech, idx) => (
                <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-2xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10`}>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{tech.name}</h3>
                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tech.desc}</p>
                  <ul className="space-y-2">
                    {/* Hardcoding features for now as they are technical terms mostly */}
                    {[
                      ['React.js & Next.js', 'Tailwind CSS & Framer Motion', 'React Native for Mobile'],
                      ['Node.js & Express', 'Python & Django', 'Firebase & AWS'],
                      ['Adobe Creative Suite (Photoshop, Illustrator)', 'Figma for UI/UX design and prototyping', 'Canva and other modern design tools'],
                      ['Git and GitHub for version control', 'Agile project management methodologies', 'Continuous integration and deployment']
                    ][idx].map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section >

      {/* Testimonials Section - Image 3 Concept */}
      <ScrollReveal animation="scale" delay={0.1}>
        <Testimonials />
      </ScrollReveal>

      {/* Get Started Section - Image 2 Concept */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <GetStarted />
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <FAQSection />
      </ScrollReveal>

      {/* Newsletter */}
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <Newsletter />
      </ScrollReveal>

      {/* Contact Section */}
      {/* Contact Section */}
      <section id="contact" className={`py-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="max-w-7xl mx-auto text-center">
            <div className={`mb-16`}>
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                {t.contact.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Start?</span>
              </h2>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.contact.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              {t.contact.items.map((item, idx) => (
                <div key={idx} className={`${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} p-8 rounded-2xl border flex items-start space-x-5`}>
                  <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400 flex-shrink-0">
                    {[<Shield />, <Eye />, <Lock />][idx]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                  </div>
                </div>
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