import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Terminal, Shield, Lock, Cpu, Fingerprint, Share2 } from 'lucide-react';

const FeaturesGrid = () => {
    const { isDark } = useTheme();
    const [ref, visible] = useScrollAnimation();

    return (
        <section ref={ref} className={`py-28 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className={`text-center mb-20 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <span className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block">Features</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Experience our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">features</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dive into our features and experience the difference we can make in your work and daily life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">

                    {/* Box 1: Optimized Code (Large) */}
                    <div className={`md:col-span-6 lg:col-span-8 p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}>
                        <div className="relative w-full h-64 bg-black/80 rounded-2xl p-6 mb-8 font-mono text-sm overflow-hidden group">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-cyan-500/50"></div>
                            </div>
                            <pre className="text-cyan-400 group-hover:translate-x-1 transition-transform duration-700">
                                <code>{`import React from 'react';\nclass component extends React.Component {\n  render() {\n    return (\n      <div>\n        <h1>XyberClan</h1>\n        <p>Optimized for Speed</p>\n      </div>\n    );\n  }\n}\nexport default XyberClan;`}</code>
                            </pre>
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                            <Terminal size={24} className="text-cyan-500" />
                            Optimized Code
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Naming conventions and design principles to enhance readability and reduce complexity. It is well-organized and modular.
                        </p>
                    </div>

                    {/* Box 2: Scan for Threats (Small) */}
                    <div className={`md:col-span-6 lg:col-span-4 p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 flex flex-col justify-between ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}>
                        <div className="relative w-full h-48 flex items-center justify-center mb-8">
                            {/* Radar Visual */}
                            <div className="absolute w-40 h-40 border border-cyan-500/20 rounded-full"></div>
                            <div className="absolute w-28 h-28 border border-cyan-500/30 rounded-full"></div>
                            <div className="absolute w-16 h-16 border border-cyan-500/40 rounded-full"></div>
                            <div className="absolute w-[2px] h-20 bg-gradient-to-t from-cyan-500 to-transparent origin-bottom animate-radar-sweep shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                                <Cpu size={24} className="text-cyan-500" />
                                Scan for Threats
                            </h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Identify and mitigate potential security risks and vulnerabilities in real-time.
                            </p>
                        </div>
                    </div>

                    {/* Box 3: Advanced Encryption */}
                    <div className={`md:col-span-3 lg:col-span-4 p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <div className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl font-mono text-cyan-500 animate-pulse">
                                r9H4DmOjj6LVw2C
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Advanced Encryption</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Be sure that sensitive information remains confidential and secure.</p>
                    </div>

                    {/* Box 4: Seamless Integration */}
                    <div className={`md:col-span-3 lg:col-span-4 p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}>
                        <div className="h-32 grid grid-cols-3 gap-2 place-items-center mb-6 opacity-50 group">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-500 hover:bg-cyan-500/20 transition-colors">
                                    <Share2 size={16} />
                                </div>
                            ))}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Smoothly connect and operate with other compatible platforms.</p>
                    </div>

                    {/* Box 5: Security Access */}
                    <div className={`md:col-span-6 lg:col-span-4 p-8 rounded-[2rem] border transition-all duration-500 hover:border-cyan-500/50 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50 border-gray-100 shadow-xl shadow-cyan-500/5'}`}>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <div className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl relative group">
                                <Fingerprint size={48} className="text-cyan-500 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay animate-scan transition-opacity"></div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Security Access</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verify the identity of users before granting them access.</p>
                    </div>

                </div>

            </div>

            <style>{`
                @keyframes radar-sweep {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-radar-sweep {
                    animation: radar-sweep 4s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0; opacity: 0.5; }
                    50% { top: 80%; opacity: 0.8; }
                    100% { top: 0; opacity: 0.5; }
                }
                .animate-scan {
                    animation: scan 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default FeaturesGrid;
