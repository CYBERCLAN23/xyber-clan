import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Code, ChevronRight, Sun, Moon, Menu, X, Linkedin, Github, Twitter, Facebook, Globe, Laptop, Briefcase, Palette, Image as ImageIcon, Sparkles } from 'lucide-react';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import useScrollAnimation from './hooks/useScrollAnimation';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CTASection from './components/CTASection';

const TeamPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [lang, setLang] = useState('en');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const t = translations[lang];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLang = () => setLang(lang === 'en' ? 'fr' : 'en');

    const teamMembers = [
        { image: '/team/ceo-member.jpg', name: 'Chief Executive Officer', role: 'CEO & Co-Founder' },
        { image: '/team/dev-member.jpg', name: 'Lead Fullstack Developer', role: 'Senior Fullstack Engineer' },
        { image: '/team/web-designer.jpg', name: 'Lead Web Designer', role: 'UI/UX Specialist' },
        { image: '/team/cto-redteamer.jpg', name: 'Chief Technology Officer', role: 'Security Expert' },
        { image: '/team/communications-manager.jpg', name: 'Analyst Python', role: 'Co-Founder' },
        { image: '/team/frontend-designer.jpg', name: 'Frontend Developer', role: 'Web Designer' }
    ];

    const detailedTeam = [
        {
            image: '/team/ceo-member.jpg',
            name: 'Chief Executive Officer',
            role: 'CEO & Co-Founder',
            icon: <Briefcase className="w-6 h-6" />,
            description: 'Visionary leader driving XyberClan\'s mission to deliver world-class digital solutions across Cameroon.',
            expertise: ['Strategic Leadership', 'Business Development', 'Vision & Planning'],
            socials: [{ name: 'LinkedIn', icon: <Linkedin size={20} />, url: '#' }, { name: 'GitHub', icon: <Github size={20} />, url: '#' }]
        },
        {
            image: '/team/cto-redteamer.jpg',
            name: 'Chief Technology Officer',
            role: 'CTO & Security Expert',
            icon: <Shield className="w-6 h-6" />,
            description: 'Strategic technology leader and cybersecurity specialist driving technical innovation.',
            expertise: ['Penetration Testing', 'Security Audits', 'Infrastructure Architecture'],
            socials: [{ name: 'LinkedIn', icon: <Linkedin size={20} />, url: '#' }, { name: 'GitHub', icon: <Github size={20} />, url: '#' }]
        },
        {
            image: '/team/dev-member.jpg',
            name: 'Lead Fullstack Developer',
            role: 'Senior Fullstack Engineer',
            icon: <Laptop className="w-6 h-6" />,
            description: 'Expert in modern web technologies and creating seamless user experiences with clean code.',
            expertise: ['React & Next.js', 'Node.js & APIs', 'Database Design'],
            socials: [{ name: 'LinkedIn', icon: <Linkedin size={20} />, url: '#' }, { name: 'GitHub', icon: <Github size={20} />, url: '#' }]
        }
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>

            {/* Navigation - Same as Home */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <nav className={`pointer-events-auto max-w-5xl w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center transition-all duration-500 rounded-2xl ${isScrolled
                    ? (isDark ? 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-900/10' : 'bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl shadow-gray-200/50')
                    : 'bg-transparent'
                    }`}>
                    <a href="/" className="flex items-center gap-3 group cursor-pointer">
                        <img src="/team/logo.jpg" alt="XyberClan" className="w-14 h-14 object-contain rounded-xl" />
                        <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>XyberClan</span>
                    </a>

                    <div className="hidden lg:flex items-center space-x-1">
                        {['home', 'about', 'services', 'team', 'contact'].map((item) => (
                            <a key={item} href={item === 'team' ? '/team' : `/#${item}`} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                                {t.nav[item]}
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <button onClick={toggleTheme} className={`p-2.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={toggleLang} className={`p-2.5 rounded-lg font-bold text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                            {lang.toUpperCase()}
                        </button>
                        <a href="/start-project" className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-black/10 bg-black text-white hover:bg-gray-800">
                            {t.nav.getStarted}
                        </a>
                    </div>

                    <button className="lg:hidden p-2 rounded-lg text-inherit" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Team Hero Arc - Reference Image Design */}
            <section className={`relative pt-48 pb-60 overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 mb-8 animate-fade-in-up">
                        <Sparkles size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Our Talent</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 animate-fade-in-up delay-100">
                        Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Team</span>
                    </h1>
                    <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-24 opacity-60 animate-fade-in-up delay-200 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        A diverse team of passionate professionals with unique skills driving innovation and excellence in every project.
                    </p>

                    {/* The Arc Visual */}
                    <div className="relative w-full max-w-5xl mx-auto h-[400px]">
                        <div className="absolute top-0 left-0 right-0 flex justify-center items-end">
                            {teamMembers.map((member, idx) => {
                                const total = teamMembers.length;
                                const angle = ((idx - (total - 1) / 2) * 15); // Spread items
                                const radius = 500;
                                const x = Math.sin(angle * (Math.PI / 180)) * radius;
                                const y = (1 - Math.cos(angle * (Math.PI / 180))) * radius;

                                return (
                                    <div
                                        key={idx}
                                        className="absolute transition-all duration-1000 ease-out hover:z-50 group pointer-events-auto"
                                        style={{
                                            transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                                            width: '180px'
                                        }}
                                    >
                                        <div className="relative p-2 rounded-[2rem] bg-neutral-900 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-10 group-hover:rotate-0">
                                            {/* Member Image */}
                                            <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden">
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>

                                            {/* Glow Behind */}
                                            <div className="absolute inset-0 -z-10 bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Team Sections */}
            <div className="py-24 space-y-32">
                {detailedTeam.map((member, idx) => (
                    <section key={idx} className="px-4">
                        <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className={`${idx % 2 === 1 ? 'md:order-2' : ''} relative group`}>
                                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 ring-1 ring-white/5">
                                    <img src={member.image} alt={member.name} className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                        <div className="text-cyan-400 mb-2">{member.icon}</div>
                                        <div className="text-white font-black text-2xl uppercase tracking-tighter">{member.role}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${idx % 2 === 1 ? 'md:order-1' : ''} space-y-8`}>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tight">{member.name}</h2>
                                <p className={`text-xl leading-relaxed opacity-60 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{member.description}</p>

                                <div className="space-y-4">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Key Expertise</p>
                                    <div className="flex flex-wrap gap-3">
                                        {member.expertise.map((skill, i) => (
                                            <span key={i} className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black'}`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {member.socials.map((social, i) => (
                                        <a key={i} href={social.url} className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all hover:scale-110 ${isDark ? 'bg-neutral-900 border-neutral-800 text-white hover:border-cyan-500 hover:text-cyan-400' : 'bg-white border-gray-200 text-black hover:border-cyan-500 hover:text-cyan-600'}`}>
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <CTASection />
            <Footer translations={t} />
            <WhatsAppButton />

            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TeamPage;
