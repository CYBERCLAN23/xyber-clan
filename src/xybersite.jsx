import React from 'react';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
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
import ExitPopup from './components/ExitPopup';
import ThemeSuggestionPopup from './components/ThemeSuggestionPopup';
import { ScrollToTop, ScrollIndicator } from './components/ScrollReveal';
import Meta from './components/Meta';
import SharedNavbar from './components/SharedNavbar';
import Preloader from './components/Preloader';


const XyberClanWebsite = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-[#f5f4f2] text-gray-900'} transition-colors duration-300`}>
      {/* ─── First-visit loading animation ─── */}
      <Preloader />
      <Meta
        title="XyberClan | Cybersecurity & Tech Innovation Startup"
        description="XyberClan is a cybersecurity and tech innovation startup that also provides premium digital solutions including web development and UI/UX design. We engineer secure, scalable, and intelligent software."
      />

      <SharedNavbar transparentHero={true} />

      {/* Hero Section */}
      <div id="home">
        <LiquidGlassHero lang={language} translations={t} />
      </div>

      {/* Scroll Progress Indicator */}
      <ScrollIndicator />

      {/* ── Sections ── */}

      <div className="relative z-10" style={{ backgroundColor: isDark ? '#0a0a0a' : '#f5f4f2' }}>
        <WhoWeAre />
        <FeaturesGrid />
        <TeamMinimal />
        <StatsCounter />
        <Testimonials />
        <TrustBadges />
      </div>

      <div className="relative z-10" style={{ backgroundColor: isDark ? '#0a0a0a' : '#f5f4f2' }}>
        <GetStarted />
        <FAQSection />
        <Newsletter />
      </div>

      <div className="relative z-10 bg-transparent">
        <div id="contact"><CTASection /></div>

        {/* SEO hidden */}
        <div className="sr-only" aria-hidden="true">
          <p>{t?.seo?.paragraph}</p>
        </div>

        <Footer translations={t} />
      </div>

      <WhatsAppButton />
      <ScrollToTop />
      <ExitPopup />
      <ThemeSuggestionPopup />
    </div>
  );
};

export default XyberClanWebsite;