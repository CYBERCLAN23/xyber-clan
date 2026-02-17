import React, { useState, useEffect } from 'react';
import { getLogo } from '../utils/festive';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Check if already visited
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (hasVisited) {
            onComplete?.();
            return;
        }

        // Animate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsComplete(true);
                        sessionStorage.setItem('hasVisited', 'true');
                        setTimeout(() => onComplete?.(), 500);
                    }, 300);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Don't render if already visited this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            {/* Logo */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
                <img
                    src={getLogo()}
                    alt="XyberClan"
                    fetchpriority="high"
                    decoding="async"
                    className="w-32 h-32 object-contain relative z-10 animate-pulse notranslate"
                />
            </div>

            {/* Brand Name */}
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">
                <span className="notranslate" translate="no">Xyber<span className="text-cyan-500">Clan</span></span>
            </h1>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Percentage */}
            <p className="text-gray-400 text-sm mt-4 font-mono">
                {progress}%
            </p>
        </div>
    );
};

export default Preloader;
