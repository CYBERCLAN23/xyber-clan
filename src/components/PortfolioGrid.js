import React, { useState } from 'react';
import { X, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const PortfolioGrid = () => {
    const { isDark } = useTheme();
    const [ref, isVisible] = useScrollAnimation();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeProject, setActiveProject] = useState(null);

    const projects = [
        {
            title: 'NB Dance Awards',
            category: 'Event Platform',
            image: '/portfolio/portfolio_nbdance_1766276075058.png',
            url: 'https://www.nbdanceawards.app/',
            size: 'col-span-1',
            description: 'A comprehensive event voting and ticketing platform for dance competitions. Features real-time voting, mobile money payments, and live results.',
            tech: ['React', 'Next.js', 'Firebase', 'Mobile Money API']
        },
        {
            title: 'Vanguard Elite',
            category: 'Corporate Identity',
            image: '/portfolio/portfolio_vanguard_1766276251484.png',
            url: 'https://vangaurd-elite.vercel.app/',
            size: 'col-span-2',
            description: 'Premium corporate website for a security and executive protection firm. Features elegant design, service showcase, and contact systems.',
            tech: ['React', 'Tailwind CSS', 'Framer Motion']
        },
        {
            title: 'African Marketplace',
            category: 'E-Commerce',
            image: '/portfolio/portfolio_marketplace_1766277433883.png',
            url: 'https://v0-africanmarketplace22.vercel.app/',
            size: 'col-span-1',
            description: 'Multi-vendor e-commerce platform connecting African artisans with global buyers. Features product listings, secure checkout, and vendor dashboards.',
            tech: ['Next.js', 'MongoDB', 'Stripe']
        },
        {
            title: 'Devil Pool',
            category: 'Creative Portfolio',
            image: '/portfolio/portfolio_devilpool_1766276804758.png',
            url: 'https://devil-po-ol.vercel.app/',
            size: 'col-span-1',
            description: 'Stunning creative portfolio website with immersive animations and visual storytelling. Features smooth transitions and interactive elements.',
            tech: ['React', 'Three.js', 'GSAP']
        },
        {
            title: 'Secure Login',
            category: 'Security UI',
            image: '/portfolio/portfolio_blur_login_1766277063816.png',
            url: 'https://v0-login-screen-blur.vercel.app/',
            size: 'col-span-full',
            description: 'Modern authentication interface with glassmorphism design. Features secure input handling, animated backgrounds, and responsive layout.',
            tech: ['React', 'CSS Glass Effects', 'Auth Integration']
        }
    ];

    const openLightbox = (project) => {
        setActiveProject(project);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setActiveProject(null);
        document.body.style.overflow = 'auto';
    };

    const navigateProject = (direction) => {
        const currentIndex = projects.findIndex(p => p.title === activeProject.title);
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % projects.length;
        } else {
            newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
        }
        setActiveProject(projects[newIndex]);
    };

    return (
        <>
            <section ref={ref} className={`py-24 px-4 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Work</span>
                        </h2>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Click on any project to learn more
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project, idx) => (
                            <div
                                key={idx}
                                onClick={() => openLightbox(project)}
                                className={`group relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border-4 border-white dark:border-neutral-800 shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${project.size === 'col-span-2' ? 'md:col-span-2 h-[450px]' :
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

                                {/* Click indicator */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                                        View Details
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightboxOpen && activeProject && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={closeLightbox}
                    />

                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => navigateProject('prev')}
                        className="absolute left-4 md:left-8 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button
                        onClick={() => navigateProject('next')}
                        className="absolute right-4 md:right-8 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <ArrowRight size={24} />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-3xl shadow-2xl">
                        {/* Image */}
                        <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl">
                            <img
                                src={activeProject.image}
                                alt={activeProject.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                        </div>

                        {/* Details */}
                        <div className="p-8">
                            <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest">
                                {activeProject.category}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-4">
                                {activeProject.title}
                            </h2>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                {activeProject.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="mb-8">
                                <h4 className="text-white font-bold mb-3">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeProject.tech.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <a
                                href={activeProject.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                            >
                                Visit Live Site
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PortfolioGrid;
