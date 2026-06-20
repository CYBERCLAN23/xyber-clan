import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Premium page transition wrapper that animates the entire page content
 * on route mount with a high-end editorial fade, scale, and blur.
 */
const PageTransition = ({ children }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Premium cinematic entrance animation
        gsap.fromTo(containerRef.current,
            { 
                opacity: 0, 
                y: 40, 
                scale: 0.98, 
                filter: 'blur(12px)' 
            },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                filter: 'blur(0px)', 
                duration: 1.0, 
                ease: 'power3.out',
                clearProps: 'all' // cleans up the style attributes after completion
            }
        );
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', minHeight: '100vh', willChange: 'opacity, transform, filter' }}>
            {children}
        </div>
    );
};

export default PageTransition;
