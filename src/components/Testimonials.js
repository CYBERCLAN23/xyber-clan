import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const testimonials = [
    {
        quote: "The robust project management tools, integrated communication features, and customizable dashboards have made collaboration a breeze.",
        author: "Paul Smith",
        role: "Software Tester",
        company: "Monaco",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
        quote: "The feedback and analytics tools have also helped us gain valuable insights and continuously improve our services. It's like having our own virtual office!",
        author: "Tim Williams",
        role: "Business Owner",
        company: "Proline",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
        quote: "As a marketing professional, I rely heavily on data to drive my campaigns. They have been instrumental in helping me analyze and visualize data effectively.",
        author: "Katie Adams",
        role: "Entrepreneur",
        company: "Delaware",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
        quote: "With its powerful help desk features and automation capabilities, we have been able to provide faster and more personalized support to our clients.",
        author: "Alex Schiller",
        role: "Senior Engineer",
        company: "Luminous",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
    }
];

const Testimonials = () => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();

    // Double the testimonials for seamless infinite scroll
    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <section ref={ref} className={`py-32 px-4 relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className={`text-center mb-24 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <span className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block">Testimonials</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Don't just take our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-serif italic italic font-normal">word for it</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Take a moment to explore their stories and discover what sets us apart.
                    </p>
                </div>

                {/* Carousel Wrapper */}
                <div className="relative group">
                    {/* Fade Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 hidden md:block group-hover:opacity-50 transition-opacity"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 hidden md:block group-hover:opacity-50 transition-opacity"></div>

                    <div className="overflow-hidden whitespace-nowrap py-4">
                        <div className="inline-flex animate-marquee-slow hover:pause-marquee space-x-4">
                            {doubledTestimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className={`w-[380px] inline-block whitespace-normal p-6 rounded-[1.5rem] border transition-all duration-300 ${isDark ? 'bg-neutral-900/40 border-neutral-800/50' : 'bg-gray-50 border-gray-100'}`}
                                >
                                    <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        "{t.quote}"
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-700">
                                                <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs text-white">{t.author}</h4>
                                                <p className="text-[10px] text-gray-500">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                                {/* Placeholder for small logo icon if needed */}
                                                <div className="w-2 h-2 rounded-full bg-cyan-500/20"></div>
                                                {t.company}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes marquee-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 12px)); }
                }
                .animate-marquee-slow {
                    animation: marquee-slow 40s linear infinite;
                }
                .pause-marquee {
                    animation-play-state: paused !important;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
