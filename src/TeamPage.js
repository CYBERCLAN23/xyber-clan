import React, { useState, useEffect, useRef } from 'react';
import { Shield, Code, MessageSquare, Palette, Image as ImageIcon, ChevronRight, Sun, Moon, Menu, X, Linkedin, Github, Twitter, Facebook, Send, MessageCircle, Briefcase, Laptop, Globe } from 'lucide-react';
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

const TeamPage = () => {
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState('en');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [heroRef, heroVisible] = useScrollAnimation();
    const [teamRef, teamVisible] = useScrollAnimation();
    const t = translations[lang];

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

    const teamMembers = [
        {
            image: '/team/ceo-member.jpg',
            name: 'Chief Executive Officer',
            role: 'CEO & Co-Founder',
            icon: <Briefcase className="w-6 h-6" />,
            description: 'Visionary leader driving XyberClan\'s mission to deliver world-class digital solutions across Cameroon. Expert in strategic planning, business development, and building a culture of innovation and excellence.',
            expertise: ['Strategic Leadership', 'Business Development', 'Vision & Planning', 'Team Building'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/dev-member.jpg',
            name: 'Lead Fullstack Developer',
            role: 'Senior Fullstack Engineer',
            icon: <Laptop className="w-6 h-6" />,
            description: 'Talented fullstack developer specializing in modern web technologies and creating seamless user experiences. Expert in both frontend and backend development, passionate about clean code and innovative solutions.',
            expertise: ['React & Next.js', 'Node.js & APIs', 'Database Design', 'Full-Stack Architecture'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/web-designer.jpg',
            name: 'Lead Web Designer',
            role: 'Web Design & UI Specialist',
            icon: <Code className="w-6 h-6" />,
            description: 'Expert in creating stunning, user-friendly web interfaces. Specializes in modern web design principles, responsive layouts, and creating seamless user experiences that drive engagement and conversions.',
            expertise: ['Responsive Web Design', 'UI/UX Best Practices', 'Modern CSS & Animations', 'User-Centered Design'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/cto-redteamer.jpg',
            name: 'Chief Technology Officer',
            role: 'CTO & Red Team Security Expert',
            icon: <Shield className="w-6 h-6" />,
            description: 'Strategic technology leader and cybersecurity specialist. Drives technical innovation while ensuring robust security through penetration testing, vulnerability assessments, and advanced threat protection.',
            expertise: ['Technical Leadership', 'Penetration Testing', 'Security Audits', 'Infrastructure Architecture'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/communications-manager.jpg',
            name: 'Communications Manager',
            role: 'Brand Communication & Strategy',
            icon: <MessageSquare className="w-6 h-6" />,
            description: 'Crafts compelling brand narratives and manages all communication channels. Expert in content strategy, social media management, and building strong relationships with clients and stakeholders.',
            expertise: ['Content Strategy', 'Brand Messaging', 'Social Media Management', 'Stakeholder Relations'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/figma-canva-designer.jpg',
            name: 'UI/UX Designer',
            role: 'Figma & Canva Design Specialist',
            icon: <Palette className="w-6 h-6" />,
            description: 'Creates beautiful, functional designs using industry-leading tools. Specializes in rapid prototyping, collaborative design workflows, and transforming ideas into polished visual experiences.',
            expertise: ['Figma Prototyping', 'Canva Design', 'Design Systems', 'Collaborative Workflows'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        },
        {
            image: '/team/adobe-designer.jpg',
            name: 'Creative Designer',
            role: 'Photoshop & Adobe Suite Expert',
            icon: <ImageIcon className="w-6 h-6" />,
            description: 'Master of visual storytelling through Adobe Creative Suite. Delivers high-quality graphics, photo manipulation, branding materials, and creative assets that elevate brand presence.',
            expertise: ['Adobe Photoshop', 'Illustrator & InDesign', 'Photo Editing', 'Brand Identity Design'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
                { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:text-sky-500' },
                { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
                { name: 'TikTok', icon: <Send className="w-5 h-5" />, url: '#', color: 'hover:text-pink-600' },
                { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-green-500' }
            ]
        }
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            {/* Navigation */}
            <nav className={`fixed w-full z-50 ${isDark ? 'bg-gray-950/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'} shadow-lg ${isDark ? 'shadow-cyan-500/5' : 'shadow-gray-200/50'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <a href="/" className="flex items-center group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <span className="relative text-3xl font-black tracking-tight">
                                    <span className={`${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>Xyber</span>
                                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Clan</span>
                                </span>
                            </div>
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {[
                                { name: t.nav.home, href: '/' },
                                { name: t.nav.about, href: '/#about' },
                                { name: t.nav.services, href: '/#services' },
                                { name: t.nav.team, href: '/team' },
                                { name: t.nav.contact, href: '/#contact' }
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

                            {/* Theme Toggle */}
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

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className={`${isDark ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95' : 'bg-gradient-to-b from-white/95 to-gray-50/95'} backdrop-blur-xl border-t ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'} px-6 py-6 space-y-1`}>
                        {[
                            { name: t.nav.home, href: '/' },
                            { name: t.nav.about, href: '/#about' },
                            { name: t.nav.services, href: '/#services' },
                            { name: t.nav.team, href: '/team' },
                            { name: t.nav.contact, href: '/#contact' }
                        ].map((item, idx) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300`}
                            >
                                {item.name}
                            </a>
                        ))}

                        {/* Mobile Language Toggle */}
                        <button
                            onClick={toggleLang}
                            className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300`}
                        >
                            <span>Language: {lang === 'en' ? 'English' : 'Français'}</span>
                            <Globe className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        </button>

                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10' : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'} rounded-xl transition-all duration-300`}
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
                        >
                            {t.nav.getStarted}
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={`pt-40 pb-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto text-center">
                    <div ref={heroRef} className={`slide-up ${heroVisible ? 'visible' : ''}`}>
                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
                            {t.team.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Team</span>
                        </h1>
                        <p className={`text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {t.team.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Members Sections */}
            <div className="space-y-0">
                {teamMembers.map((member, idx) => (
                    <section
                        key={idx}
                        className={`py-20 px-4 ${idx % 2 === 0 ? (isDark ? 'bg-black' : 'bg-white') : (isDark ? 'bg-gray-950' : 'bg-gray-100')}`}
                    >
                        <div className="max-w-7xl mx-auto">
                            <div
                                ref={idx === 0 ? teamRef : null}
                                className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Image Side */}
                                <div className={`${idx % 2 === 1 ? 'md:order-2' : ''} relative group`}>
                                    <div className="relative rounded-3xl overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40' : 'from-white via-white/40'} to-transparent opacity-40`}></div>

                                        {/* Icon Badge */}
                                        <div className="absolute top-6 right-6 bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-2xl shadow-2xl shadow-cyan-500/40 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            {member.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className={`${idx % 2 === 1 ? 'md:order-1' : ''} space-y-6`}>
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
                                            {member.name}
                                        </h2>
                                        <p className="text-cyan-400 font-bold text-xl md:text-2xl mb-6">
                                            {member.role}
                                        </p>
                                        <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {member.description}
                                        </p>
                                    </div>

                                    {/* Expertise Tags */}
                                    <div>
                                        <p className={`text-sm font-bold mb-3 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Key Expertise
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {member.expertise.map((skill, skillIdx) => (
                                                <span
                                                    key={skillIdx}
                                                    className={`px-4 py-2 text-sm font-semibold rounded-xl ${isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'} hover:scale-105 transition-transform duration-200`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Social Media Links */}
                                    <div className={`pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                                        <p className={`text-sm font-bold mb-4 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Connect
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {member.socials.map((social, socialIdx) => (
                                                <a
                                                    key={socialIdx}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={social.name}
                                                    className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} ${social.color} p-3.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                                                >
                                                    {social.icon}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <section className={`py-28 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto text-center">
                    <div className={`zoom-in ${teamVisible ? 'visible' : ''} ${isDark ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-900/30' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100'} border rounded-3xl p-14 max-w-5xl mx-auto`}>
                        <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">{t.contact.ctaTitle}</h3>
                        <p className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.contact.ctaDesc}
                        </p>
                        <a
                            href="/start-project"
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1"
                        >
                            {t.contact.ctaButton}
                            <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`${isDark ? 'bg-gray-950 border-gray-900' : 'bg-gray-900 text-white'} border-t py-12 px-4`}>
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-2xl font-bold mb-4">
                        <span className="text-white">Xyber</span>
                        <span className="text-cyan-400">Clan</span>
                    </div>
                    <p className="text-gray-400 text-sm">{t.footer.tagline}</p>
                    <p className="text-gray-500 text-xs mt-4">© 2024 XyberClan. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TeamPage;
