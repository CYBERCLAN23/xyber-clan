import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';
const Footer = () => {
    // Default Data
    const defaultFooter = {
        tagline: "Empowering the digital future.",
        copyright: `© ${new Date().getFullYear()} XyberClan. All rights reserved.`,
        links: [
            { label: 'Twitter', url: '#' },
            { label: 'LinkedIn', url: '#' },
            { label: 'GitHub', url: '#' }
        ]
    };

    const footerData = defaultFooter;

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-3xl font-black tracking-tight mb-6 block notranslate" translate="no">
                            Xyber<span className="text-cyan-500">Clan</span>
                        </Link>
                        <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                            {footerData.tagline}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</Link></li>
                            <li><Link to="/team" className="text-gray-400 hover:text-cyan-400 transition-colors">Team</Link></li>
                            <li><Link to="/projects" className="text-gray-400 hover:text-cyan-400 transition-colors">Projects</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Connect</h4>
                        <div className="flex gap-4">
                            {footerData.links && footerData.links.map((link, idx) => (
                                <a key={idx} href={link.url} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all duration-300">
                                    <Github className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>{footerData.copyright}</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by XyberClan
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
