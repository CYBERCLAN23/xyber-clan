import React, { useState } from 'react';
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

  // Track when the preloader finishes (used to trigger post-load effects if needed)
  const [, setPreloaderDone] = useState(
    () => !!sessionStorage.getItem('xc_visited')
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* ─── First-visit loading animation ─── */}
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <Meta
        title="Digital Agency | Web, Design & Cybersecurity"
        description="XyberClan is a premium digital agency specializing in web development, cybersecurity, and UI/UX design. Serving global clients from Africa."
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