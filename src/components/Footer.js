import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Facebook, Twitter, Linkedin, ArrowUpRight, Github as GithubIcon } from 'lucide-react';
import { getLogo } from '../utils/festive';

const Footer = ({ translations: t }) => {
    const { isDark } = useTheme();

    const socialLinks = [
        { name: 'Github', url: 'https://github.com/CYBERCLAN23', icon: <GithubIcon size={20} /> },
        { name: 'LinkedIn', url: 'https://linkedin.com/company/xyberclan', icon: <Linkedin size={20} /> },
        { name: 'Twitter', url: 'https://twitter.com/xyberclan', icon: <Twitter size={20} /> },
        { name: 'Facebook', url: 'https://facebook.com/xyberclan', icon: <Facebook size={20} /> },
    ];

    const footerSections = [
        {
            title: 'Navigation',
            links: [
                { label: 'About Us', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Our Team', href: '/team' },
                { label: 'Portfolio', href: '#portfolio' },
            ]
        },
        {
            title: 'Expertise',
            links: [
                { label: 'Cybersecurity', href: '#services' },
                { label: 'Software Dev', href: '#services' },
                { label: 'Hardware Solutions', href: '#services' },
                { label: 'Digital Strategy', href: '#services' },
            ]
        },
        {
            title: 'Support',
            links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Contact Us', href: '#contact' },
            ]
        }
    ];

    return (
        <footer className={`relative pt-32 pb-12 px-4 overflow-hidden border-t ${isDark ? 'bg-black border-neutral-900 text-white' : 'bg-white border-gray-100 text-black'}`}>

            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

                    {/* Brand Column */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-4 mb-8 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img
                                src={getLogo()}
                                alt="XyberClan"
                                loading="lazy"
                                decoding="async"
                                className="w-20 h-20 object-contain"
                            />
                            <div className="text-3xl font-black tracking-tighter">
                                Xyber<span className="text-cyan-500 transition-colors duration-500 group-hover:text-blue-500">Clan</span>
                            </div>
                        </div>
                        <p className={`text-xl leading-relaxed mb-10 max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t.footer.tagline || "Engineering the next generation of digital infrastructure. Secure, efficient, and built for performance."}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${isDark ? 'bg-neutral-950 border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-900' : 'bg-gray-50 border-gray-100 hover:border-cyan-200'}`}
                                >
                                    <div className="text-cyan-500">{social.icon}</div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-40">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className={`group flex items-center text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                                            >
                                                <span>{link.label}</span>
                                                <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 text-cyan-500" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className={`p-8 md:p-12 rounded-[2.5rem] border mb-24 flex flex-col md:flex-row items-center justify-between gap-8 ${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-gray-50 border-gray-100'}`}>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Ready to start a project?</h3>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Let's build something exceptional together.</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="mailto:contact@xyber-clan.com" className="group flex flex-col items-end">
                            <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Email Us</span>
                            <span className="font-bold border-b border-transparent group-hover:border-cyan-500 transition-colors">contact@xyber-clan.com</span>
                        </a>
                        <a href="tel:+237672446810" className="group flex flex-col items-end">
                            <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Call Us</span>
                            <span className="font-bold border-b border-transparent group-hover:border-cyan-500 transition-colors">+237 672 446 810</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-neutral-900/10 dark:border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        © {new Date().getFullYear()} XyberClan — Engineered in Cameroon.
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy</span>
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms</span>
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Cookies</span>
                    </div>
                </div>
            </div>

            {/* Decoration Elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        </footer>
    );
};

export default Footer;
