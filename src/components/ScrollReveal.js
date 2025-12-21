import React, { useEffect, useRef, useState } from 'react';

/**
 * Professional scroll animation wrapper component
 * Implements Figma-style reveal animations for sections
 */
const ScrollReveal = ({
    children,
    animation = 'fadeUp', // fadeUp, fadeDown, fadeLeft, fadeRight, scale, blur
    delay = 0,
    duration = 0.8,
    threshold = 0.1,
    once = true,
    className = '',
    stagger = 0 // Use for child elements in a list
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, once]);

    const getAnimationStyles = () => {
        const baseTransition = `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + stagger}s`;

        const animations = {
            fadeUp: {
                initial: { opacity: 0, transform: 'translateY(60px)' },
                visible: { opacity: 1, transform: 'translateY(0)' }
            },
            fadeDown: {
                initial: { opacity: 0, transform: 'translateY(-60px)' },
                visible: { opacity: 1, transform: 'translateY(0)' }
            },
            fadeLeft: {
                initial: { opacity: 0, transform: 'translateX(-60px)' },
                visible: { opacity: 1, transform: 'translateX(0)' }
            },
            fadeRight: {
                initial: { opacity: 0, transform: 'translateX(60px)' },
                visible: { opacity: 1, transform: 'translateX(0)' }
            },
            scale: {
                initial: { opacity: 0, transform: 'scale(0.8)' },
                visible: { opacity: 1, transform: 'scale(1)' }
            },
            blur: {
                initial: { opacity: 0, filter: 'blur(20px)', transform: 'translateY(30px)' },
                visible: { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' }
            },
            rotateIn: {
                initial: { opacity: 0, transform: 'rotate(-10deg) translateY(40px)' },
                visible: { opacity: 1, transform: 'rotate(0) translateY(0)' }
            }
        };

        const anim = animations[animation] || animations.fadeUp;
        return {
            transition: baseTransition,
            ...(isVisible ? anim.visible : anim.initial)
        };
    };

    return (
        <div ref={ref} style={getAnimationStyles()} className={className}>
            {children}
        </div>
    );
};

/**
 * Scroll-triggered parallax effect
 */
export const ScrollParallax = ({ children, speed = 0.5, className = '' }) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrolled = window.innerHeight - rect.top;
                setOffset(scrolled * speed * 0.1);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div
            ref={ref}
            style={{ transform: `translateY(${offset}px)` }}
            className={className}
        >
            {children}
        </div>
    );
};

/**
 * Scroll progress indicator for sections
 */
export const ScrollIndicator = ({ className = '' }) => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 h-1 z-[100] ${className}`}>
            <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-100"
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
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-24 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            aria-label="Scroll to top"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
};

export default ScrollReveal;
