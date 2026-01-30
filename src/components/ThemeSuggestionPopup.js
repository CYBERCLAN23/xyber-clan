import React, { useState, useEffect } from 'react';
import { Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSuggestionPopup = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed this or accepted it
        const hasInteracted = localStorage.getItem('xyberclan-theme-suggestion-seen');

        // Show only if:
        // 1. Not currently dark mode (redundant check inside render but good for logic)
        // 2. Hasn't dismissed it
        // 3. Wait a few seconds before showing
        if (!isDark && !hasInteracted) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000); // Show after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isDark]);

    const handleSwitch = () => {
        toggleTheme();
        setIsVisible(false);
        localStorage.setItem('xyberclan-theme-suggestion-seen', 'true');
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('xyberclan-theme-suggestion-seen', 'true');
    };

    if (!isVisible || isDark) return null;

    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-24 z-50 animate-fade-in-up">
            <div className="relative bg-black/90 text-white backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl max-w-xs flex flex-col gap-3">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-3 pr-6">
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Moon size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Better in Dark Mode?</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Switch for the full neon liquid experience.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                        onClick={handleDismiss}
                        className="px-3 py-2 text-xs font-bold text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        No Thanks
                    </button>
                    <button
                        onClick={handleSwitch}
                        className="px-3 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Switch Now
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default ThemeSuggestionPopup;
