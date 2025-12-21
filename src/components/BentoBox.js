import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BentoBox = ({
    children,
    className = "",
    title,
    icon: Icon,
    glow = false,
    delay = 0
}) => {
    const { isDark } = useTheme();

    return (
        <div
            className={`bento-card p-6 flex flex-col h-full ${className} ${glow ? 'border-cyan-500/20 shadow-lg shadow-cyan-500/5' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Optional Header */}
            {(title || Icon) && (
                <div className="flex items-center gap-3 mb-4">
                    {Icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-800 text-cyan-400' : 'bg-gray-100 text-cyan-600'}`}>
                            <Icon size={18} />
                        </div>
                    )}
                    {title && (
                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 relative z-10">
                {children}
            </div>

            {/* Decorative Gradient Blob for Dark Mode */}
            {isDark && glow && (
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
            )}
        </div>
    );
};

export default BentoBox;
