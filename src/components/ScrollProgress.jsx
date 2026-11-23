import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Scroll Progress Indicator Component
 * Shows reading progress at the top of the page
 */
const ScrollProgress = () => {
    const [progress, setProgress] = React.useState(0);
    const { isDark } = useTheme();

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 right-0 h-1 z-[100] ${isDark ? 'bg-gray-900/50' : 'bg-gray-200/50'}`}
        >
            <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 transition-all duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    boxShadow: progress > 0 ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
                }}
            />
        </div>
    );
};

export default ScrollProgress;
