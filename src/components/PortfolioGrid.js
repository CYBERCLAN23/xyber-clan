import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const PortfolioGrid = () => {
    const { isDark } = useTheme();
    const [ref, isVisible] = useScrollAnimation();

    const projects = [
        {
            title: 'NB Dance Awards',
            category: 'Event Platform',
            image: '/portfolio/portfolio_nbdance_1766276075058.png',
            url: 'https://www.nbdanceawards.app/',
            size: 'col-span-1'
        },
        {
            title: 'Vanguard Elite',
            category: 'Corporate Identity',
            image: '/portfolio/portfolio_vanguard_1766276251484.png',
            url: 'https://vangaurd-elite.vercel.app/',
            size: 'col-span-2'
        },
        {
            title: 'African Marketplace',
            category: 'E-Commerce',
            image: '/portfolio/portfolio_marketplace_1766277433883.png',
            url: 'https://v0-africanmarketplace22.vercel.app/',
            size: 'col-span-1'
        },
        {
            title: 'Devil Pool',
            category: 'Creative Portfolio',
            image: '/portfolio/portfolio_devilpool_1766276804758.png',
            url: 'https://devil-po-ol.vercel.app/',
            size: 'col-span-1'
        },
        {
            title: 'Secure Login',
            category: 'Security UI',
            image: '/portfolio/portfolio_blur_login_1766277063816.png',
            url: 'https://v0-login-screen-blur.vercel.app/',
            size: 'col-span-full'
        }
    ];

    return (
        <section ref={ref} className={`py-24 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((project, idx) => (
                        <a
                            key={idx}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border-4 border-white dark:border-neutral-800 shadow-2xl transition-all duration-500 hover:scale-[1.02] ${project.size === 'col-span-2' ? 'md:col-span-2 h-[450px]' :
                                project.size === 'col-span-full' ? 'md:col-span-3 h-[450px]' :
                                    'md:col-span-1 h-[450px]'
                                }`}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>

                            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">{project.category}</span>
                                <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">{project.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortfolioGrid;
