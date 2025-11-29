import React, { useState, useEffect, useRef } from 'react';
import { Shield, Eye, Zap, Cloud, FileCheck, Headphones, Lock, Target, ChevronRight, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { translations } from './translations';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return [elementRef, isVisible];
};

// Custom hook for typing animation
const useTypingAnimation = (words, typingSpeed = 150, deletingSpeed = 100, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const currentWord = words[wordIndex];
    const isLastWord = wordIndex === words.length - 1;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Finished typing current word
          if (isLastWord) {
            // Stop at last word (XyberClan)
            return;
          }
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, wordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
};

const XyberClanWebsite = () => {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  // Typing animation for hero title
  const typedText = useTypingAnimation(t.hero.typing);

  // Scroll animation refs for different sections
  const [heroRef, heroVisible] = useScrollAnimation();
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [servicesRef, servicesVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();
  const [techStackRef, techStackVisible] = useScrollAnimation();
  const [deliverRef, deliverVisible] = useScrollAnimation();
  const [insightsRef, insightsVisible] = useScrollAnimation();
  const [contactRef, contactVisible] = useScrollAnimation();

  const toggleTheme = (e) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Calculate distance to furthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Start the transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    // Animate the circle
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fr' : 'en');
  };

  const isDark = theme === 'dark';

  // Update body class for theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Navigation - Premium Glassmorphism Design */}
      <nav className={`fixed w-full z-50 ${isDark ? 'bg-gray-950/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'} shadow-lg ${isDark ? 'shadow-cyan-500/5' : 'shadow-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <span className="relative text-3xl font-black tracking-tight">
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>Xyber</span>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Clan</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: t.nav.home, href: '#home' },
                { name: t.nav.about, href: '#about' },
                { name: t.nav.services, href: '#services' },
                { name: t.nav.team, href: '/team' },
                { name: t.nav.contact, href: '#contact' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-5 py-2.5 text-[15px] font-semibold ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all duration-300 group`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute inset-0 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'} rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out`}></span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-3/4 transition-all duration-300"></span>
                </a>
              ))}

              {/* Language Toggle Button */}
              <button
                onClick={toggleLang}
                className={`ml-4 p-3 rounded-xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'} transition-all duration-300 hover:scale-110 shadow-lg ${isDark ? 'shadow-cyan-500/10' : 'shadow-gray-300/50'}`}
                aria-label="Toggle language"
              >
                <div className="flex items-center gap-1 font-bold text-sm">
                  <Globe className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{lang.toUpperCase()}</span>
                </div>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`ml-2 p-3 rounded-xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'} transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg ${isDark ? 'shadow-cyan-500/10' : 'shadow-gray-300/50'}`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </button>

              {/* CTA Button */}
              <a
                href="/start-project"
                className="ml-3 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-[15px] font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
              >
                {t.nav.getStarted}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-3 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide-in Animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className={`${isDark ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95' : 'bg-gradient-to-b from-white/95 to-gray-50/95'} backdrop-blur-xl border-t ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'} px-6 py-6 space-y-1`}>
            {[
              { name: t.nav.home, href: '#home' },
              { name: t.nav.about, href: '#about' },
              { name: t.nav.services, href: '#services' },
              { name: t.nav.team, href: '/team' },
              { name: t.nav.contact, href: '#contact' }
            ].map((item, idx) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300 transform hover:translate-x-2`}
                style={{
                  animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${idx * 0.1}s both` : 'none'
                }}
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLang}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300`}
              style={{
                animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.4s both' : 'none'
              }}
            >
              <span>Language: {lang === 'en' ? 'English' : 'Français'}</span>
              <Globe className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300`}
              style={{
                animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.4s both' : 'none'
              }}
            >
              <span>{t.nav.toggleTheme}</span>
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Mobile CTA */}
            <a
              href="/start-project"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-center text-[16px] font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20"
              style={{
                animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.5s both' : 'none'
              }}
            >
              {t.nav.getStarted}
            </a>
          </div>
        </div>
      </nav>

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

      {/* Hero Section */}
      <section id="home" className={`pt-40 pb-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in visible">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              {t.hero.titlePrefix} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block min-w-[200px] md:min-w-[350px]">{typedText}<span className="animate-pulse">|</span></span>
            </h1>
            <p className={`text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.hero.subtitle}
            </p>
          </div>
          <div className={`flex flex-wrap gap-8 justify-center mb-12 text-base md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            <div className="flex items-center gap-3 slide-up stagger-1 visible">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.hero.fastDelivery}</span>
            </div>
            <div className="flex items-center gap-3 slide-up stagger-2 visible">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.hero.localExpertise}</span>
            </div>
            <div className="flex items-center gap-3 slide-up stagger-3 visible">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.hero.fairPricing}</span>
            </div>
            <div className="flex items-center gap-3 slide-up stagger-4 visible">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.hero.provenResults}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 justify-center zoom-in visible">
            <a href="/start-project" className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1">
              <span className="flex items-center justify-center gap-3">
                {t.hero.startProject}
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a href="#services" className={`${isDark ? 'border-gray-700 hover:border-cyan-400 text-white bg-gray-900/50' : 'border-gray-300 hover:border-cyan-600 text-gray-900 bg-white'} border-2 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center`}>
              {t.hero.exploreServices}
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-28 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={aboutRef} className={`text-center mb-20 slide-up ${aboutVisible ? 'visible' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              {t.about.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">XyberClan</span>
            </h2>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.about.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Shield className="w-10 h-10" />,
                title: t.about.mission,
                desc: t.about.missionDesc
              },
              {
                icon: <Eye className="w-10 h-10" />,
                title: t.about.vision,
                desc: t.about.visionDesc
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: t.about.whyUs,
                desc: t.about.whyUsDesc
              }
            ].map((item, idx) => (
              <div key={idx} className={`group zoom-in stagger-${idx + 1} ${aboutVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} p-10 rounded-3xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2`}>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* The Clan */}
          <div className={`slide-in-left ${aboutVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20' : 'bg-gradient-to-r from-cyan-100 to-blue-100'} rounded-3xl p-10 md:p-14`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{t.about.clanTitle}</h3>
                <p className={`mb-8 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.about.clanDesc}
                </p>
                <ul className="space-y-4">
                  {t.about.roles.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <ChevronRight className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative rounded-2xl h-64 overflow-hidden ${isDark ? 'bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50'}`}>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img src="/team/logo.jpg" alt="XyberClan Logo" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className={`py-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={teamRef} className={`text-center mb-20 slide-up ${teamVisible ? 'visible' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              {t.team.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.team.subtitle}
            </p>
          </div>

          <div className={`text-center zoom-in ${teamVisible ? 'visible' : ''}`}>
            <div className={`${isDark ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-900/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100'} border rounded-3xl p-14 max-w-4xl mx-auto`}>
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">{t.team.expertTeam}</h3>
              <p className={`text-lg mb-8 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.team.expertTeamDesc}
              </p>
              <a
                href="/team"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1"
              >
                {t.team.viewFullTeam}
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className={`py-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 slide-up ${servicesVisible ? 'visible' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              {t.services.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t.nav.services}</span>
            </h2>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.services.items.map((service, idx) => (
              <div key={idx} className={`group slide-up stagger-${idx + 1} ${servicesVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800/50 border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-3xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2`}>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {/* Icons need to be mapped or passed differently if dynamic, using index for now */}
                  {[<Target />, <Zap />, <Shield />, <Cloud />, <FileCheck />, <Headphones />][idx]}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team in Action Section */}
      <section className={`py-28 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={teamRef} className={`text-center mb-20 slide-up ${teamVisible ? 'visible' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              {t.team.actionTitle} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t.team.actionSubtitle}</span>
            </h2>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.team.actionDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {t.team.actions.map((item, idx) => (
              <div key={idx} className={`group relative rounded-3xl overflow-hidden h-96 hover:shadow-2xl transition-all duration-500 ${idx % 2 === 0 ? 'slide-in-left' : 'slide-in-right'} stagger-${(idx % 4) + 1} ${teamVisible ? 'visible' : ''}`}>
                <div className="absolute inset-0">
                  <img
                    src={['/team/team-coding-1.jpg', '/team/team-python.jpg', '/team/team-coding-2.jpg', '/team/team-group.jpg'][idx]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-200 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={techStackRef} className={`text-center mb-16 slide-up ${techStackVisible ? 'visible' : ''}`}>
            <h2 className="text-4xl font-bold mb-4">
              {t.techStack.title} <span className="text-cyan-400">Tech Stack</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.techStack.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.techStack.items.map((tech, idx) => (
              <div key={idx} className={`group zoom-in stagger-${idx + 1} ${techStackVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-2xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10`}>
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
      </section >

      {/* Success Stories */}
      < section className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={deliverRef} className={`text-center mb-16 slide-up ${deliverVisible ? 'visible' : ''}`}>
            <h2 className="text-4xl font-bold mb-4">
              {t.deliver.title} <span className="text-cyan-400">Deliver</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.deliver.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.deliver.items.map((story, idx) => (
              <div key={idx} className={`group slide-up stagger-${idx + 1} ${deliverVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20' : 'bg-gradient-to-br from-cyan-50 to-blue-50'} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <Shield className="w-16 h-16 text-cyan-400/30" />
                </div>
                <div className="p-6">
                  <span className="text-cyan-400 text-sm font-semibold">{story.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{story.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{story.desc}</p>
                  <div className={`${isDark ? 'bg-cyan-900/20' : 'bg-cyan-50'} p-3 rounded-lg`}>
                    <p className="text-sm font-semibold text-cyan-400">{t.deliver.outcome}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{story.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center space-x-2">
              <span>{t.deliver.cta}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section >

      {/* Latest Insights */}
      < section className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div ref={insightsRef} className={`text-center mb-16 slide-up ${insightsVisible ? 'visible' : ''}`}>
            <h2 className="text-4xl font-bold mb-4">
              {t.insights.title} <span className="text-cyan-400">Insights</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.insights.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.insights.items.map((article, idx) => (
              <div key={idx} className={`group slide-up stagger-${idx + 1} ${insightsVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-purple-900/20' : 'bg-gradient-to-br from-cyan-50 to-purple-50'} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <Lock className="w-16 h-16 text-cyan-400/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-400 text-sm font-semibold">{article.category}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Nov 2024</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{article.desc}</p>
                  <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm inline-flex items-center space-x-1">
                    <span>{t.insights.learnMore}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className={`${isDark ? 'border-gray-700 hover:border-cyan-400' : 'border-gray-300 hover:border-cyan-600'} border-2 px-6 py-3 rounded-lg font-semibold transition-colors`}>
              {t.insights.exploreMore}
            </button>
          </div>
        </div>
      </section >

      {/* Contact Section */}
      <section id="contact" className={`py-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div ref={contactRef} className={`mb-16 slide-up ${contactVisible ? 'visible' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              {t.contact.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Start?</span>
            </h2>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
            {t.contact.items.map((item, idx) => (
              <div key={idx} className={`zoom-in stagger-${idx + 1} ${contactVisible ? 'visible' : ''} ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} p-8 rounded-2xl border flex items-start space-x-5`}>
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

          <div className={`zoom-in ${contactVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-900/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100'} border rounded-3xl p-14 max-w-5xl mx-auto`}>
            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">{t.contact.ctaTitle}</h3>
            <p className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.contact.ctaDesc}
            </p>
            <button
              onClick={() => window.location.href = '/start-project'}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                {t.contact.ctaButton}
                <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      < footer className={`${isDark ? 'bg-gray-950 border-gray-900' : 'bg-gray-900 text-white'} border-t py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Xyber</span>
                <span className="text-cyan-400">Clan</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{t.footer.tagline}</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Follow us on Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Follow us on Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Connect with us on LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="View our projects on GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default XyberClanWebsite;