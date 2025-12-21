import React, { useState, useEffect } from 'react';

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
            className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            {/* Logo */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
                <img
                    src="/team/logo.jpg"
                    alt="XyberClan"
                    className="w-24 h-24 rounded-3xl relative z-10 animate-pulse"
                />
            </div>

            {/* Brand Name */}
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight">
                Xyber<span className="text-cyan-500">Clan</span>
            </h1>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Percentage */}
            <p className="text-white/50 text-sm mt-4 font-mono">
                {progress}%
            </p>
        </div>
    );
};

export default Preloader;
