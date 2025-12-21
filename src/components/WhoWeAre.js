import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Terminal, BarChart3 } from 'lucide-react';

const WhoWeAre = () => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();

    const partners = [
        "React", "Next.js", "XyberShield", "Node.js", "Python", "AWS", "Vanguard", "Figma", "Tailwind", "Firebase"
    ];

    return (
        <section id="about" ref={ref} className={`py-20 px-4 overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: scroll 30s linear infinite;
                }
                .group:hover .animate-infinite-scroll {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto">

                {/* Logo Strip - Animated Carousel */}
                <div className="relative w-full mb-24 overflow-hidden group">
                    <div className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${isDark ? 'from-black' : 'from-white'} to-transparent z-10`}></div>
                    <div className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${isDark ? 'from-black' : 'from-white'} to-transparent z-10`}></div>

                    <div className="flex w-max animate-infinite-scroll">
                        {/* Quadruple the list for extremely smooth seamless loop on wide screens */}
                        {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
                            <div key={idx} className="mx-12 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                <span className="text-xl md:text-2xl font-bold font-serif italic whitespace-nowrap">{partner}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Header */}
                <div className={`text-center mb-16 ${visible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
                    <span className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                        Use Cases
                    </span>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                        A <span className="font-serif italic">24/7</span> Digital Partner
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/5'}`}>
                        <div className="mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="relative w-full h-32 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-xl overflow-hidden p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="w-full h-2 bg-white/50 dark:bg-white/10 rounded-full"></div>
                                <div className="w-2/3 h-2 bg-white/50 dark:bg-white/10 rounded-full"></div>
                                <div className="absolute right-4 bottom-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-bounce">
                                    <Terminal size={20} className="text-cyan-500" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition-colors">Rapid Innovation</h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Concept to prototype in days. We engineer speed.</p>
                    </div>

                    {/* Card 2 */}
                    <div className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/5'}`}>
                        <div className="mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="relative w-full h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-xl overflow-hidden p-4 flex items-center justify-center">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                <div className="flex gap-2 items-end">
                                    <div className="w-4 h-8 bg-blue-300 dark:bg-blue-600 rounded-t-sm"></div>
                                    <div className="w-4 h-12 bg-blue-400 dark:bg-blue-500 rounded-t-sm"></div>
                                    <div className="w-4 h-16 bg-blue-500 dark:bg-blue-400 rounded-t-sm"></div>
                                </div>
                                <div className="absolute top-2 left-4 text-xs font-mono text-blue-600 dark:text-blue-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded">CPU 99%</div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition-colors">Scalable Architecture</h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Systems designed to handle millions.</p>
                    </div>

                    {/* Card 3 */}
                    <div className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/5'}`}>
                        <div className="mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="relative w-full h-32 bg-purple-100/50 dark:bg-purple-900/20 rounded-xl overflow-hidden p-4 flex items-center">
                                <div className="w-3/4 h-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-black/5 dark:border-white/5 p-3 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold">$28K</span>
                                        <BarChart3 size={12} className="text-green-500" />
                                    </div>
                                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="w-2/3 h-full bg-green-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition-colors">Revenue Enablement</h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tools that actually convert.</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhoWeAre;
