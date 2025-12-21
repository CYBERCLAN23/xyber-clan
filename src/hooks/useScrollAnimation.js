import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject, boolean]} - Ref to attach to element and visibility state
 */
const useScrollAnimation = (options = {}) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can optionally unobserve for performance
                    if (options.once !== false) {
                        observer.unobserve(entry.target);
                    }
                } else if (options.once === false) {
                    setIsVisible(false);
                }
            },
            {
                threshold: options.threshold ?? 0.1,
                rootMargin: options.rootMargin ?? '50px',
                ...options,
            }
        );

        const element = elementRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options.threshold, options.rootMargin, options.once]);

    return [elementRef, isVisible];
};

export default useScrollAnimation;
