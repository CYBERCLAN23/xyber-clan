import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Zap, Cloud, FileCheck, Headphones, Lock, Target, ChevronRight, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import useTypingAnimation from './hooks/useTypingAnimation';
import WhatsAppButton from './components/WhatsAppButton';
import HeroArc from './components/HeroArc';
import ServicesMinimal from './components/ServicesMinimal';
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
import Preloader from './components/Preloader';
import ExitPopup from './components/ExitPopup';
import ScrollReveal, { ScrollToTop, ScrollIndicator } from './components/ScrollReveal';


const XyberClanWebsite = () => {
  const { isDark, toggleTheme } = useTheme();
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const t = translations[lang];

  // Handle scroll effect for navigation
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation for hero title

  // Typing animation for hero title
  const typedText = useTypingAnimation(t.hero.typing);

  // Scroll animation refs for different sections - REPLACED BY ScrollReveal
  // Kept useScrollAnimation import removed but hooks were here. Cleaned up.

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fr' : 'en');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Scroll Progress Indicator - Handled by ScrollReveal later */}

      {/* Navigation - Ultra Island Design */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className={`pointer-events-auto max-w-5xl w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center transition-all duration-500 rounded-2xl ${isScrolled
          ? `nav-island ${isDark ? 'shadow-cyan-900/10' : 'shadow-gray-200/50'}`
          : 'bg-transparent'
          }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/team/logo.jpg" alt="XyberClan" className="w-14 h-14 object-contain rounded-xl" />
            <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>XyberClan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {['home', 'about', 'services', 'team', 'contact'].map((item) => (
              item === 'team' ? (
                <Link
                  key={item}
                  to="/team"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-black hover:bg-black/5'
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
                    document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-black hover:bg-black/5'
                    }`}
                >
                  {t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              )
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'
                }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleLang}
              className={`p-2.5 rounded-lg font-bold text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'
                }`}
            >
              {lang.toUpperCase()}
            </button>

            <Link
              to="/start-project"
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-black/10 bg-black text-white hover:bg-gray-800"
            >
              {t.nav.getStarted}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isDark ? 'text-white' : 'text-black'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer - Smooth Slide-in */}
        <div className={`absolute top-24 left-4 right-4 lg:hidden transition-all duration-500 pointer-events-auto ${mobileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
          <div className={`rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl ${isDark ? 'bg-black/90 border-white/10 shadow-cyan-500/10' : 'bg-white/90 border-gray-200 shadow-gray-200/50'}`}>
            <div className="flex flex-col gap-2">
              {['home', 'about', 'services', 'team', 'contact'].map((item, idx) => (
                item === 'team' ? (
                  <Link
                    key={item}
                    to="/team"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}
                    style={{ animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${idx * 0.05}s both` : 'none' }}
                  >
                    {t.nav[item]}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}
                    style={{ animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${idx * 0.05}s both` : 'none' }}
                  >
                    {t.nav[item] || item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                )
              ))}

              <div className="h-px bg-current opacity-10 my-4" />

              {/* Mobile Actions */}
              <div className="flex items-center justify-between px-6 py-2">
                <span className="font-bold opacity-60">{lang === 'en' ? 'Appearance' : 'Apparence'}</span>
                <button onClick={toggleTheme} className={`p-4 rounded-2xl transition-all ${isDark ? 'bg-white/5 text-yellow-400' : 'bg-black/5 text-blue-600'}`}>
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>

              <div className="flex items-center justify-between px-6 py-2">
                <span className="font-bold opacity-60">{lang === 'en' ? 'Language' : 'Langue'}</span>
                <button onClick={toggleLang} className={`px-6 py-4 rounded-2xl font-black transition-all ${isDark ? 'bg-white/5 text-cyan-400' : 'bg-black/5 text-cyan-600'}`}>
                  {lang.toUpperCase()}
                </button>
              </div>

              <Link to="/start-project" onClick={() => setMobileMenuOpen(false)} className="mt-6 w-full py-5 rounded-2xl bg-black text-white font-black text-center text-xl shadow-xl shadow-black/20">
                {t.nav.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animation for mobile menu */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Hero Section - Osmo/Arc Style */}
      <div id="home">
        <HeroArc />
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
    </div>
  );
};

export default XyberClanWebsite;