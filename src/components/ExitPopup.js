import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ExitPopup = () => {
    const { isDark } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown this session
        if (sessionStorage.getItem('exitPopupShown')) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e) => {
            // Only trigger when mouse leaves from top of screen (attempting to close tab)
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        };

        // Add small delay before enabling exit detection
        const timeout = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000); // Wait 5 seconds before enabling

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-fadeIn"
                onClick={handleClose}
            />

            {/* Popup */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-scaleIn">
                <div className={`relative max - w - md w - full rounded - 3xl overflow - hidden shadow - 2xl ${isDark ? 'bg-neutral-900' : 'bg-white'} `}>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className={`absolute top - 4 right - 4 p - 2 rounded - full z - 10 transition - colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-600'} `}
                    >
                        <X size={20} />
                    </button>

                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                            Wait! Before You Go...
                        </h3>
                        <p className="text-white/80">
                            Get a special offer just for you
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-green-500">Limited Time Offer</span>
                        </div>

                        <h4 className={`text - xl font - bold mb - 4 ${isDark ? 'text-white' : 'text-gray-900'} `}>
                            Get 10% OFF Your First Project!
                        </h4>

                        <p className={`mb - 6 ${isDark ? 'text-gray-400' : 'text-gray-600'} `}>
                            Start your project with us today and get an exclusive 10% discount.
                            Just mention this offer when you contact us!
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/start-project"
                                onClick={handleClose}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/30"
                            >
                                <Gift className="w-5 h-5" />
                                Claim Your Discount
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={handleClose}
                                className={`w - full py - 3 px - 6 rounded - xl font - medium transition - colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} `}
                            >
                                No thanks, maybe later
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
@keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
}
@keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
}
                .animate - fadeIn { animation: fadeIn 0.3s ease - out; }
                .animate - scaleIn { animation: scaleIn 0.3s ease - out; }
`}</style>
        </>
    );
};

export default ExitPopup;
