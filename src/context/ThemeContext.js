import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then fall back to system preference
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('xyberclan-theme-v2');
            if (stored) return stored;
            // Respect OS dark/light preference for first-time visitors
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return 'dark'; // Default to dark (pitch-black brand identity)
    });

    const isDark = theme === 'dark';

    // Update document class and localStorage when theme changes
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('xyberclan-theme-v2', theme);
    }, [isDark, theme]);

    const toggleTheme = useCallback((e) => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        // Check if View Transitions API is supported
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // Get click coordinates for circular reveal animation
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? 0;

        // Calculate distance to furthest corner
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Start the transition
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
        });

        // Animate the circle
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                { clipPath },
                {
                    duration: 500,
                    easing: 'ease-in',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
