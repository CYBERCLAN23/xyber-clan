import React, { useRef } from 'react';
import { ArrowUpRight, Code2, Shield, Palette, LineChart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ServicesMinimal = () => {
    const { isDark } = useTheme();
    const [headerRef, headerVisible] = useScrollAnimation();

    const services = [
        {
            id: '01',
            title: 'Web & App Development',
            desc: 'Scalable platforms built with React, Node, and Python. We engineer speed and reliability.',
            icon: <Code2 size={24} />,
            tags: ['React', 'Next.js', 'Mobile Native']
        },
        {
            id: '02',
            title: 'Cybersecurity & Audits',
            desc: 'Bank-grade security protocols. We break your system before hackers do.',
            icon: <Shield size={24} />,
            tags: ['Pen Testing', 'SecOps', 'Compliance']
        },
        {
            id: '03',
            title: 'Product Design (UI/UX)',
            desc: 'Interfaces that feel inevitable. User-centric design systems that scale.',
            icon: <Palette size={24} />,
            tags: ['Figma', 'Prototyping', 'Design Systems']
        },
        {
            id: '04',
            title: 'Digital Strategy',
            desc: 'Data-driven roadmaps for digital transformation and market dominance.',
            icon: <LineChart size={24} />,
            tags: ['Growth', 'Analytics', 'Consulting']
        }
    ];

    return (
        <section id="services" className={`py-32 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <div ref={headerRef} className={`mb-20 flex flex-col md:flex-row items-end justify-between gap-8 slide-up ${headerVisible ? 'visible' : ''}`}>
                    <div>
                        <span className="text-cyan-500 font-bold tracking-wider uppercase text-sm mb-4 block">Our Expertise</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                            What We Do
                        </h2>
                    </div>
                    <p className={`max-w-md text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        We don't just write code. We engineer digital assets that drive real business growth.
                    </p>
                </div>

                <div className="flex flex-col">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`group relative py-12 border-t ${isDark ? 'border-white/10' : 'border-black/5'} transition-colors duration-500 hover:bg-neutral-900/5 dark:hover:bg-white/5`}
                        >
                            <div className="grid md:grid-cols-12 gap-8 items-center">
                                <span className={`col-span-1 text-sm font-mono opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {service.id}
                                </span>

                                <div className="col-span-11 md:col-span-5">
                                    <h3 className="text-3xl md:text-4xl font-bold group-hover:text-cyan-500 transition-colors duration-300 flex items-center gap-4">
                                        {service.title}
                                    </h3>
                                </div>

                                <div className="col-span-11 md:col-span-5 md:col-start-8">
                                    <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {service.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.tags.map(tag => (
                                            <span key={tag} className={`text-xs px-2 py-1 rounded-full border ${isDark ? 'border-white/10 text-gray-400' : 'border-black/10 text-gray-600'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-cyan-500">
                                    <ArrowUpRight size={48} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={`border-t ${isDark ? 'border-white/10' : 'border-black/5'}`}></div>
                </div>
            </div>
        </section>
    );
};

export default ServicesMinimal;
