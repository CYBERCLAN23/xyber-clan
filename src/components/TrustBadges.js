import React from 'react';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';

const TrustBadges = () => {
    const { isDark } = useTheme();

    // Partner/Client logos - using text placeholders that can be replaced with actual logos
    const partners = [
        { name: 'University of Yaoundé I', abbr: 'UY1' },
        { name: 'Hult Prize', abbr: 'HULT' },
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
                        <EditableText contentKey="en.trust.title" tag="span" fallback="Trusted By Leading Organizations" />
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative">
                    {/* Fade edges */}
                    <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r ${isDark ? 'from-neutral-950' : 'from-gray-50'} to-transparent`} />
                    <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l ${isDark ? 'from-neutral-950' : 'from-gray-50'} to-transparent`} />

                    {/* Scrolling logos */}
                    <div className="flex animate-marquee">
                        {allPartners.map((partner, index) => {
                            const originalIdx = index % partners.length;
                            return (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 mx-8 px-8 py-4 rounded-2xl border flex items-center justify-center min-w-[180px] ${isDark
                                        ? 'bg-neutral-900/50 border-white/10'
                                        : 'bg-white border-gray-200 shadow-sm'}`}
                                >
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            <EditableText contentKey={`en.trust.partners.${originalIdx}.abbr`} fallback={partner.abbr} />
                                        </div>
                                        <div className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            <EditableText contentKey={`en.trust.partners.${originalIdx}.name`} fallback={partner.name} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats line */}
                <div className="flex flex-wrap justify-center gap-8 mt-12">
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <EditableText contentKey="en.trust.stat1.value" tag="span" fallback="100%" />
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <EditableText contentKey="en.trust.stat1.label" tag="span" fallback="Client Satisfaction" />
                        </div>
                    </div>
                    <div className={`w-px h-12 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <EditableText contentKey="en.trust.stat2.value" tag="span" fallback="24/7" />
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <EditableText contentKey="en.trust.stat2.label" tag="span" fallback="Support Available" />
                        </div>
                    </div>
                    <div className={`w-px h-12 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="text-center">
                        <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <EditableText contentKey="en.trust.stat3.value" tag="span" fallback="Fast" />
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <EditableText contentKey="en.trust.stat3.label" tag="span" fallback="Delivery Time" />
                        </div>
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
