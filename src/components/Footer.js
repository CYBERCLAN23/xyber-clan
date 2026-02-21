import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Facebook, Heart } from 'lucide-react';
import { getLogo } from '../utils/festive';
import { useTheme } from '../context/ThemeContext';

const Footer = ({ translations: t }) => {
    const { isDark } = useTheme();

    if (!t || !t.footer) return null;

    const { columns, cta, tagline, copyright, bottomLinks } = t.footer;

    const socialLinks = [
        { icon: <Github size={18} />, url: 'https://github.com/CYBERCLAN23', color: 'hover:text-black hover:bg-white' },
        { icon: <Linkedin size={18} />, url: '#', color: 'hover:text-[#0077B5] hover:bg-white' },
        { icon: <Twitter size={18} />, url: 'https://x.com/XyberC60820', color: 'hover:text-[#1DA1F2] hover:bg-white' },
        { icon: <Facebook size={18} />, url: '#', color: 'hover:text-[#1877F2] hover:bg-white' },
    ];

    return (
        <footer className={`relative pt-24 pb-12 overflow-hidden border-t transition-colors duration-500 ${isDark ? 'bg-black text-white border-white/10' : 'bg-white text-gray-900 border-gray-100'}`}>
            {/* CTA SECTION - Ready to start a project */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className={`relative overflow-hidden rounded-[3rem] border p-12 md:p-20 group transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 ${isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-gray-50 border-gray-100'}`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="text-center md:text-left">
                            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : 'text-gray-950'}`}>
                                {cta.title}
                            </h2>
                            <p className={`text-xl font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {cta.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                            <div className="text-center md:text-left">
                                <p className={`text-[10px] font-bold tracking-widest mb-2 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cta.emailLabel}</p>
                                <a href={`mailto:${cta.email}`} className={`text-lg md:text-xl font-black hover:text-cyan-500 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-950'}`}>
                                    {cta.email}
                                </a>
                            </div>
                            <div className="text-center md:text-left">
                                <p className={`text-[10px] font-bold tracking-widest mb-2 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cta.phoneLabel}</p>
                                <a href={`tel:${cta.phone.replace(/\s/g, '')}`} className={`text-lg md:text-xl font-black hover:text-cyan-500 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-950'}`}>
                                    {cta.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-8">
                            <img src={getLogo()} alt="XyberClan Logo" className="w-10 h-10 object-contain" />
                            <span className={`text-2xl font-black tracking-tighter notranslate ${isDark ? 'text-white' : 'text-gray-950'}`} translate="no">
                                Xyber<span className="text-cyan-500">Clan</span>
                            </span>
                        </div>
                        <p className={`text-xl font-light leading-relaxed mb-10 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tagline}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border hover:scale-110 ${link.color} ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:shadow-white/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:shadow-gray-200/50'}`}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {Object.entries(columns).map(([key, col]) => (
                            <div key={key}>
                                <h4 className={`text-[11px] font-bold tracking-[0.2em] mb-8 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {col.title}
                                </h4>
                                <ul className="space-y-6">
                                    {col.items.map((link, idx) => (
                                        <li key={idx}>
                                            <Link
                                                to={link.url}
                                                className={`text-[15px] font-medium hover:text-cyan-500 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`pt-12 border-t flex flex-col sm:flex-row justify-between items-center gap-8 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {copyright}
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className={`text-[11px] font-bold tracking-widest hover:text-cyan-500 transition-colors uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {bottomLinks.privacy}
                        </Link>
                        <Link to="/terms" className={`text-[11px] font-bold tracking-widest hover:text-cyan-500 transition-colors uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {bottomLinks.terms}
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`mt-12 text-center text-[10px] flex items-center justify-center gap-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by XyberClan
            </div>
        </footer>
    );
};

export default Footer;
