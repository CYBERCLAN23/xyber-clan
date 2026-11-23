import React, { useEffect, useRef, useState } from 'react';

/**
 * Advanced scroll animation wrapper with diverse, unique animation types.
 * Each animation has a distinct character to avoid the "everything slides up" AI look.
 */
const ScrollReveal = ({
    children,
    animation = 'fadeUp',
    delay = 0,
    duration = 0.9,
    threshold = 0.15,
    once = true,
    className = '',
    stagger = 0,
    distance = 40, // configurable distance — different per section for variety
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(entry.target);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -60px 0px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, once]);

    const getStyles = () => {
        const d = delay + stagger;

        // Each animation uses a DIFFERENT easing for personality
        const animations = {
            // Classic fade up — gentle, default
            fadeUp: {
                transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${d}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${d}s`,
                initial: { opacity: 0, transform: `translateY(${distance}px)` },
                visible: { opacity: 1, transform: 'translateY(0)' },
            },
            // Slide from left with overshoot bounce
            slideLeft: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration * 1.1}s cubic-bezier(0.34, 1.56, 0.64, 1) ${d}s`,
                initial: { opacity: 0, transform: `translateX(-${distance * 1.5}px)` },
                visible: { opacity: 1, transform: 'translateX(0)' },
            },
            // Slide from right with overshoot
            slideRight: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration * 1.1}s cubic-bezier(0.34, 1.56, 0.64, 1) ${d}s`,
                initial: { opacity: 0, transform: `translateX(${distance * 1.5}px)` },
                visible: { opacity: 1, transform: 'translateX(0)' },
            },
            // Scale up from center — dramatic
            scaleReveal: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${d}s`,
                initial: { opacity: 0, transform: 'scale(0.85)' },
                visible: { opacity: 1, transform: 'scale(1)' },
            },
            // Blur in — cinematic
            blurIn: {
                transition: `opacity ${duration * 1.2}s ease-out ${d}s, filter ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, filter: 'blur(16px)', transform: `translateY(${distance * 0.5}px)` },
                visible: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
            },
            // Rotate in from slight tilt — editorial feel
            tiltIn: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration * 1.2}s cubic-bezier(0.22, 1, 0.36, 1) ${d}s`,
                initial: { opacity: 0, transform: `perspective(800px) rotateX(8deg) translateY(${distance}px)` },
                visible: { opacity: 1, transform: 'perspective(800px) rotateX(0deg) translateY(0)' },
            },
            // Clip reveal — mask effect simulation
            clipUp: {
                transition: `opacity ${duration * 0.6}s ease-out ${d}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${d}s`,
                initial: { opacity: 0, transform: `translateY(${distance * 2}px)` },
                visible: { opacity: 1, transform: 'translateY(0)' },
            },
            // Subtle rise — barely moves, just fades (for text-heavy sections)
            subtleRise: {
                transition: `opacity ${duration * 1.3}s ease-out ${d}s, transform ${duration * 1.3}s ease-out ${d}s`,
                initial: { opacity: 0, transform: 'translateY(16px)' },
                visible: { opacity: 1, transform: 'translateY(0)' },
            },
            // Zoom out — starts large, settles to normal
            zoomOut: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration * 1.1}s cubic-bezier(0.22, 1, 0.36, 1) ${d}s`,
                initial: { opacity: 0, transform: 'scale(1.08)' },
                visible: { opacity: 1, transform: 'scale(1)' },
            },
            // Legacy compat
            fadeDown: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, transform: `translateY(-${distance}px)` },
                visible: { opacity: 1, transform: 'translateY(0)' },
            },
            fadeLeft: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, transform: `translateX(-${distance}px)` },
                visible: { opacity: 1, transform: 'translateX(0)' },
            },
            fadeRight: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, transform: `translateX(${distance}px)` },
                visible: { opacity: 1, transform: 'translateX(0)' },
            },
            scale: {
                transition: `opacity ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, transform: 'scale(0.85)' },
                visible: { opacity: 1, transform: 'scale(1)' },
            },
            blur: {
                transition: `opacity ${duration}s ease-out ${d}s, filter ${duration}s ease-out ${d}s, transform ${duration}s ease-out ${d}s`,
                initial: { opacity: 0, filter: 'blur(20px)', transform: 'translateY(30px)' },
                visible: { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
            },
        };

        const anim = animations[animation] || animations.fadeUp;
        return {
            transition: anim.transition,
            ...(isVisible ? anim.visible : anim.initial),
        };
    };

    return (
        <div ref={ref} style={getStyles()} className={className}>
            {children}
        </div>
    );
};

/**
 * Scroll progress indicator — only visible after scrolling past the hero
 */
export const ScrollIndicator = ({ className = '' }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [pastHero, setPastHero] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            setPastHero(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 h-[2px] z-[100] transition-opacity duration-500 ${pastHero ? 'opacity-100' : 'opacity-0'} ${className}`}>
            <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
};

/**
 * Scroll to top button
 */
export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-24 left-6 z-50 w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            aria-label="Scroll to top"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
};

export default ScrollReveal;
