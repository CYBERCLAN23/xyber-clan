import React, { useState, useEffect } from 'react';
import { Shield, Code, ChevronRight, Linkedin, Github, Laptop, Briefcase, Palette, Sparkles, ChevronLeft, ArrowUpRight, Wifi } from 'lucide-react';
import { translations } from './translations';
import { useTheme } from './context/ThemeContext';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CTASection from './components/CTASection';
import SharedNavbar from './components/SharedNavbar';
import Meta from './components/Meta';

const TeamPage = () => {
    const { isDark } = useTheme();
    const [lang] = useState('en');
    const [activeIndex, setActiveIndex] = useState(0);
    const t = translations[lang];

    const teamMembers = [
        { image: '/team/ceo-member.jpg', name: 'Cedrik Darel Yepmo', role: 'CEO & Co-Founder' },
        { image: '/team/dev-member.jpg', name: 'YVANA EMILIA LALANE LARCIER', role: 'Frontend Developer' },
        { image: '/team/ange-demanou.png', name: 'Ange Demanou', role: 'Creative & Data Analyst' },
        { image: '/team/cto-redteamer.jpg', name: 'AKANA SIGNING JOSIAS AARON', role: 'CTO & Red Team Lead' },
        { image: '/team/communications-manager.jpg', name: 'ONANA GREGOIRE LEGRAND', role: 'Co-Founder & Strategist' },
        { image: '/team/william-chandler.png', name: 'William Chandler', role: 'Canva Designer' },
        { image: '/team/theresa-tcheme.png', name: 'Theresa Tcheme', role: 'Media & Communication', position: 'center 18%', scale: 2.8 },
        { image: '/team/frontend-designer.jpg', name: 'Zealda Junior', role: 'Frontend & Network' },
        { image: '/team/cybersecurity-chief.jpg', name: 'Lembou Pharel', role: 'Cybersecurity, AI & Systems' },
        { image: '/team/yann-felix-wandji.png', name: 'Wandji Tchaleu Yann Félix', role: 'Network, Python & Design', isWhiteBg: true, position: 'center 0%', scale: 4.2 }
    ];

    const detailedTeam = [
        {
            image: '/team/ceo-member.jpg',
            name: 'Cedrik Darel Yepmo',
            role: 'CEO & Co-Founder',
            icon: <Briefcase className="w-5 h-5" />,
            description: <span>Visionary leader driving <span className="notranslate" translate="no">XyberClan's</span> mission to deliver world-class digital solutions across Cameroon. Expert in strategic planning and business development.</span>,
            expertise: ['Strategic Leadership', 'Business Development', 'Vision & Planning'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/cedrik-darel-yepmo-b0544034a/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/cedarroyal21' }
            ],
            portfolio: 'https://www.linkedin.com/in/cedrik-darel-yepmo-b0544034a/'
        },
        {
            image: '/team/cto-redteamer.jpg',
            name: 'AKANA SIGNING JOSIAS AARON',
            role: 'CTO & AI Security Architect',
            icon: <Shield className="w-5 h-5" />,
            description: 'Strategic technology leader and elite Red Teamer specializing in the intersection of cybersecurity and AI. He is an expert in Web & Mobile development (Flutter), networking infrastructure, and computer maintenance, driving innovation through intelligent and secure engineering.',
            expertise: ['Red Teaming', 'LLM Architect', 'Mobile Dev (Flutter)', 'Network Engineering', 'Computer Maintenance'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/akana-signing-josias-aaron/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/Josiasange37' }
            ],
            portfolio: 'https://almightportfolio.vercel.app/'
        },
        {
            image: '/team/dev-member.jpg',
            name: 'YVANA EMILIA LALANE LARCIER',
            role: 'Frontend Developer',
            icon: <Laptop className="w-5 h-5" />,
            description: 'Expert in modern web technologies and creating seamless user experiences. Passionate about clean code and innovative solutions.',
            expertise: ['React & Next.js', 'UI/UX Implementation', 'Responsive Design'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/yvana-emilia-lalane-larcier-50761337b/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/lalanelarcier-ai' }
            ],
            portfolio: 'https://www.linkedin.com/in/yvana-emilia-lalane-larcier-50761337b/'
        },
        {
            image: '/team/ange-demanou.png',
            name: 'Ange Demanou',
            role: 'Digital Generalist & Data Analyst',
            icon: <Palette className="w-5 h-5" />,
            description: 'A versatile polymath bridging technology and business. Her multidisciplinary stack includes Web Development, Data & Business Analysis, Graphic Design, and Machine Learning research. She also manages social media strategy with a data-driven approach.',
            expertise: ['Web Development', 'Data Analysis', 'Machine Learning', 'Graphic Design', 'Social Media Management', 'Business Analysis'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/ange-demanou-367466340/' },
                { name: 'GitHub', icon: <Github size={18} />, url: '#' }
            ],
            portfolio: 'https://www.linkedin.com/in/ange-demanou-367466340/'
        },
        {
            image: '/team/communications-manager.jpg',
            name: 'ONANA GREGOIRE LEGRAND',
            role: 'Co-Founder & Business Strategist',
            icon: <Code className="w-5 h-5" />,
            description: <span>A strategic mastermind and technical architect, Onana Gregoire Legrand is the engine behind <span className="notranslate" translate="no">XyberClan's</span> operational precision. He combines advanced Python data analysis with high-level business strategy to optimize growth, identify market opportunities, and ensures every project scales towards global standards.</span>,
            expertise: ['Business Strategy', 'Python Data Science', 'Operational Precision', 'Market Analysis'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/onana-gregoire-legrand-a18529282/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/psycho237-prog' }
            ],
            portfolio: 'https://psycho.is-a.dev'
        },
        {
            image: '/team/william-chandler.png',
            name: 'William Chandler',
            role: 'Visual Content & Canva Designer',
            icon: <Palette className="w-5 h-5" />,
            description: 'A visual architect who masters the art of high-impact design through Canva. He brings ideas to life with stunning graphics, ensuring every piece of content tells a compelling story and maintains a pristine brand identity.',
            expertise: ['Canva Pro Design', 'Visual Storytelling', 'Social Media Branding'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/william-chandler-106147353/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/Evina-Darren' }
            ],
            portfolio: 'https://www.linkedin.com/in/william-chandler-106147353/'
        },
        {
            image: '/team/theresa-tcheme.png',
            name: 'Theresa Tcheme',
            role: 'Media & Communication Manager',
            icon: <Sparkles className="w-5 h-5" />,
            description: 'Expert in media relations and strategic communications. Theresa leads the narrative at XyberClan, ensuring a consistent and impactful brand voice across all digital channels and media platforms.',
            expertise: ['Media Relations', 'Strategic Communication', 'Digital Storytelling'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/theresa-tcheme-a5402a358/' },
                { name: 'GitHub', icon: <Github size={18} />, url: '#' }
            ],
            portfolio: 'https://www.linkedin.com/in/theresa-tcheme-a5402a358/',
            position: 'center 18%',
            scale: 2.8
        },
        {
            image: '/team/frontend-designer.jpg',
            name: 'Zealda Junior',
            role: 'Web Developer & Network Associate',
            icon: <Code className="w-5 h-5" />,
            description: 'A multidisciplinary technician blending the worlds of network engineering and modern web development. Zealda specializes in building responsive interfaces and designing intuitive user journeys in Figma, while maintaining a strong focus on the underlying network infrastructure.',
            expertise: ['Web Development', 'Figma Design', 'Network Engineering'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/zealda-junior-9352b1277/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/zealdajunior' }
            ],
            portfolio: 'https://www.linkedin.com/in/zealda-junior-9352b1277/'
        },
        {
            image: '/team/cybersecurity-chief.jpg',
            name: 'Lembou Pharel',
            role: 'Cybersecurity, AI & Systems Engineer',
            icon: <Shield className="w-5 h-5" />,
            description: 'Expert in cybersecurity, web development, and mobile applications using Flutter. He bridges systems engineering with applied AI to build resilient, intelligent, and secure software solutions.',
            expertise: ['Penetration Testing', 'Systems Engineering', 'Applied AI', 'Mobile Dev (Flutter)'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/lembou-pharel/' },
                { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/lemboupharel' }
            ],
            portfolio: 'https://www.pharel.dev'
        },
        {
            image: '/team/yann-felix-wandji.png',
            name: 'Wandji Tchaleu Yann Félix',
            role: 'Network Engineer, Python Dev & Designer',
            icon: <Wifi className="w-5 h-5" />,
            description: 'A versatile technician with a strong foundation in networking infrastructure (CCNA certified), Python development, and creative design. Yann Félix bridges the gap between robust network architecture and elegant visual communication, ensuring solutions are both technically sound and beautifully presented.',
            expertise: ['Réseau & CCNA', 'Python Development', 'Graphic Design', 'Network Infrastructure'],
            socials: [
                { name: 'LinkedIn', icon: <Linkedin size={18} />, url: '#' },
                { name: 'GitHub', icon: <Github size={18} />, url: '#' }
            ],
            portfolio: '#',
            isWhiteBg: true,
            position: 'center 0%',
            scale: 1.0
        }
    ];

    const [radius, setRadius] = useState(750);

    useEffect(() => {
        const handleResize = () => {
            setRadius(window.innerWidth < 768 ? 320 : 700);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextMember = () => setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    const prevMember = () => setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);

    useEffect(() => {
        const interval = setInterval(nextMember, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`min-h-screen w-full overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            <Meta
                title="Our Expert Team | Engineering the Future"
                description="Meet the visionaries, developers, and cybersecurity experts at XyberClan. Our team is dedicated to building innovative digital solutions for Cameroon and the world."
            />

            {/* ─── Shared Navigation ─── */}
            <SharedNavbar transparentHero={true} />

            {/* ─── Hero Section with Carousel ─── */}
            <section className={`relative pt-40 pb-64 md:pt-48 md:pb-72 overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
                {/* Gradient glow behind carousel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/8 to-blue-600/5 blur-[130px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 mb-6 animate-fade-in-up">
                        <Sparkles size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Our People</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-5 animate-fade-in-up delay-100" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Meet our{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Team</span>
                    </h1>
                    <p className={`text-base md:text-xl max-w-xl mx-auto mb-20 animate-fade-in-up delay-200 ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        Innovative minds working together to engineer Cameroon's digital future.
                    </p>

                    {/* Carousel Controls */}
                    <div className="absolute left-4 right-4 md:left-10 md:right-10 top-[55%] flex justify-between z-20 pointer-events-none">
                        <button onClick={prevMember} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all pointer-events-auto hover:scale-110 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-gray-900 hover:bg-black/10'}`}>
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextMember} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl backdrop-blur-xl border flex items-center justify-center transition-all pointer-events-auto hover:scale-110 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-gray-900 hover:bg-black/10'}`}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Arc Carousel */}
                    <div className="relative w-full max-w-5xl mx-auto h-[450px] md:h-[550px]">
                        <div className="absolute top-0 left-0 right-0 flex justify-center items-end">
                            {teamMembers.map((member, idx) => {
                                const total = teamMembers.length;
                                let diff = idx - activeIndex;
                                if (diff > total / 2) diff -= total;
                                if (diff < -total / 2) diff += total;

                                const angle = diff * 22;
                                const x = Math.sin(angle * (Math.PI / 180)) * radius;
                                const y = (1 - Math.cos(angle * (Math.PI / 180))) * radius + 200;
                                const isCenter = Math.abs(diff) < 0.1;
                                const isNear = Math.abs(diff) <= 2;

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCenter ? 'z-50' : 'z-10'} pointer-events-auto cursor-pointer`}
                                        onClick={() => setActiveIndex(idx)}
                                        style={{
                                            transform: `translate(${x}px, ${y}px) rotate(${angle * 0.5}deg) scale(${isCenter ? 1.15 : 0.8})`,
                                            width: window.innerWidth < 768 ? '160px' : '200px',
                                            opacity: isNear ? 1 : 0.3,
                                            filter: isCenter ? 'none' : 'grayscale(30%)'
                                        }}
                                    >
                                        <div className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 ${isCenter
                                            ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20'
                                            : (isDark ? 'border-white/10' : 'border-gray-200')
                                            }`}>
                                            <div className={`aspect-[3/4] overflow-hidden ${member.hasCustomBg ? 'xyber-card-bg' : ''} ${member.isWhiteBg ? 'bg-white' : ''}`}>
                                                <img
                                                    src={member.image}
                                                    alt={`XyberClan Team Member: ${member.name} - ${member.role}`}
                                                    className="w-full h-full object-cover"
                                                    style={{
                                                        imageRendering: '-webkit-optimize-contrast',
                                                        objectPosition: member.position || 'center',
                                                        transform: `scale(${member.scale || 1})`
                                                    }}
                                                />
                                            </div>

                                            {/* Glass overlay for center card */}
                                            {isCenter && (
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                    <h3 className="text-white font-bold text-sm tracking-tight leading-tight">{member.name}</h3>
                                                    <p className="text-cyan-400 text-xs font-medium">{member.role}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Glow behind active */}
                                        <div className={`absolute inset-0 -z-10 bg-cyan-500/15 blur-3xl transition-opacity duration-700 rounded-full ${isCenter ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {teamMembers.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-cyan-500' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-black/15'}`}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Team Detail Cards ─── */}
            <div className={`py-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section header */}
                    <div className="mb-16 max-w-2xl">
                        <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>The People</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Experts dedicated to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">your success</span>
                        </h2>
                        <p className={`text-base leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                            Every member brings unique skills and passion to deliver exceptional results.
                        </p>
                    </div>

                    {/* Cards grid */}
                    <div className="space-y-20">
                        {detailedTeam.map((member, idx) => (
                            <section key={idx} className="group">
                                <div className={`grid lg:grid-cols-5 gap-8 lg:gap-12 items-center`}>
                                    {/* Image — 2 cols */}
                                    <div className={`lg:col-span-2 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                                        <div className={`relative rounded-3xl overflow-hidden border ${isDark ? 'border-white/5' : 'border-gray-200'} ${member.hasCustomBg ? 'xyber-detail-card-bg' : ''} ${member.isWhiteBg ? 'bg-white' : ''}`}>
                                            <img
                                                src={member.image}
                                                alt={`XyberClan Specialist: ${member.name} — ${member.role}`}
                                                loading="lazy"
                                                decoding="async"
                                                className={`w-full h-[380px] md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105 ${member.hasCustomBg ? 'relative z-10' : ''}`}
                                                style={{
                                                    imageRendering: '-webkit-optimize-contrast',
                                                    objectPosition: member.position || 'center',
                                                    transform: member.scale ? `scale(${member.scale})` : undefined
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute bottom-5 left-5">
                                                <div className="w-10 h-10 bg-cyan-500/90 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                                                    {member.icon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info — 3 cols */}
                                    <div className={`lg:col-span-3 ${idx % 2 === 1 ? 'lg:order-1' : ''} space-y-5`}>
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-[0.15em] mb-2 ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>{member.role}</p>
                                            <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                {member.name}
                                            </h3>
                                        </div>

                                        <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 300 }}>
                                            {member.description}
                                        </p>

                                        <div className="space-y-3">
                                            <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Expertise</p>
                                            <div className="flex flex-wrap gap-2">
                                                {member.expertise.map((skill, i) => (
                                                    <span key={i} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-[1.03] ${isDark ? 'bg-white/3 border-white/8 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2.5 pt-2">
                                            {member.socials.map((social, i) => (
                                                <a key={i} href={social.url} className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-110 ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400' : 'bg-white border-gray-200 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-600'}`}>
                                                    {social.icon}
                                                </a>
                                            ))}
                                            <a
                                                href={member.portfolio || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-1.5 px-4 h-11 rounded-xl border text-sm font-medium transition-all hover:scale-[1.03] ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30' : 'bg-white border-gray-200 text-gray-500 hover:text-cyan-600 hover:border-cyan-500/30'}`}
                                            >
                                                View Profile <ArrowUpRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                {idx < detailedTeam.length - 1 && (
                                    <div className={`mt-20 h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            <CTASection />
            <Footer translations={t} />
            <WhatsAppButton />

            <style>{`
                .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* XyberClan themed card background for transparent-bg photos */
                .xyber-card-bg {
                    background: linear-gradient(135deg, #0a0e1a 0%, #0d1b2a 40%, #0f2847 70%, #0a0e1a 100%);
                    position: relative;
                }
                .xyber-card-bg::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 20% 30%, rgba(0, 210, 255, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.04) 0%, transparent 70%);
                    z-index: 0;
                }
                .xyber-card-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(0, 210, 255, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 210, 255, 0.06) 1px, transparent 1px),
                        radial-gradient(circle at 15% 85%, rgba(0, 210, 255, 0.15) 0px, rgba(0, 210, 255, 0.15) 2px, transparent 2px),
                        radial-gradient(circle at 85% 15%, rgba(59, 130, 246, 0.15) 0px, rgba(59, 130, 246, 0.15) 2px, transparent 2px),
                        radial-gradient(circle at 45% 25%, rgba(0, 210, 255, 0.1) 0px, rgba(0, 210, 255, 0.1) 1.5px, transparent 1.5px),
                        radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.12) 0px, rgba(59, 130, 246, 0.12) 1.5px, transparent 1.5px);
                    background-size:
                        40px 40px,
                        40px 40px,
                        100% 100%,
                        100% 100%,
                        100% 100%,
                        100% 100%;
                    z-index: 0;
                    opacity: 0.7;
                }
                .xyber-card-bg img {
                    position: relative;
                    z-index: 1;
                }

                /* Detailed card version */
                .xyber-detail-card-bg {
                    background: linear-gradient(145deg, #0a0e1a 0%, #0d1b2a 30%, #102a4a 60%, #0d1b2a 85%, #0a0e1a 100%);
                    position: relative;
                }
                .xyber-detail-card-bg::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 25% 20%, rgba(0, 210, 255, 0.15) 0%, transparent 55%),
                        radial-gradient(ellipse at 75% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 55%),
                        radial-gradient(circle at 50% 100%, rgba(0, 210, 255, 0.08) 0%, transparent 60%);
                    z-index: 0;
                }
                .xyber-detail-card-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(0, 210, 255, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 210, 255, 0.04) 1px, transparent 1px),
                        radial-gradient(circle at 10% 90%, rgba(0, 210, 255, 0.2) 0px, rgba(0, 210, 255, 0.2) 3px, transparent 3px),
                        radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.18) 0px, rgba(59, 130, 246, 0.18) 3px, transparent 3px),
                        radial-gradient(circle at 30% 40%, rgba(0, 210, 255, 0.08) 0px, rgba(0, 210, 255, 0.08) 2px, transparent 2px),
                        radial-gradient(circle at 65% 25%, rgba(59, 130, 246, 0.1) 0px, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
                        radial-gradient(circle at 80% 55%, rgba(0, 210, 255, 0.06) 0px, rgba(0, 210, 255, 0.06) 2px, transparent 2px);
                    background-size:
                        50px 50px,
                        50px 50px,
                        100% 100%,
                        100% 100%,
                        100% 100%,
                        100% 100%,
                        100% 100%;
                    z-index: 0;
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
};

export default TeamPage;
