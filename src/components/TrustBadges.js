import React from 'react';
import { useTheme } from '../context/ThemeContext';

const TrustBadges = () => {
    const { isDark } = useTheme();

    // Partner/Client logos - using text placeholders that can be replaced with actual logos
    const partners = [
        { name: 'University of Yaoundé I', abbr: 'UY1' },
        { name: 'INF Department', abbr: 'INF' },
        { name: 'Tech Innovators', abbr: 'TI' },
        { name: 'StartUp Hub', abbr: 'SH' },
        { name: 'Digital Africa', abbr: 'DA' },
        { name: 'Code Academy', abbr: 'CA' },
    ];

    // Duplicate for seamless loop
    const allPartners = [...partners, ...partners];

    return (
        <section className={`py-16 overflow-hidden ${isDark ? 'bg-neutral-950' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Trusted By Leading Organizations
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative">
                    {/* Fade edges */}
                    <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r ${isDark ? 'from-neutral-950' : 'from-gray-50'} to-transparent`} />
                    <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l ${isDark ? 'from-neutral-950' : 'from-gray-50'} to-transparent`} />

                    {/* Scrolling logos */}
                    <div className="flex animate-marquee">
                        {allPartners.map((partner, index) => (
                            <div
                                key={index}
                                className={`flex-shrink-0 mx-8 px-8 py-4 rounded-2xl border flex items-center justify-center min-w-[180px] ${isDark
                                    ? 'bg-neutral-900/50 border-white/10'
                                    : 'bg-white border-gray-200 shadow-sm'}`}
                            >
                                <div className="text-center">
                                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                        {partner.abbr}
                                    </div>
                                    <div className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {partner.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats line */}
                <div className="flex flex-wrap justify-center gap-8 mt-12">
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>100%</div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Client Satisfaction</div>
                    </div>
                    <div className={`w-px h-12 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>24/7</div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Support Available</div>
                    </div>
                    <div className={`w-px h-12 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Fast</div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Delivery Time</div>
                    </div>
                </div>
            </div>

            {/* Marquee animation */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default TrustBadges;
