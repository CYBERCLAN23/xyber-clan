import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './cms/EditableText';

const CareerPopup = () => {
    const { isDark } = useTheme();
    const { language: lang } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('careerPopupShown')) return;

        const timeout = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem('careerPopupShown', 'true');
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-fadeIn"
                onClick={handleClose}
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-scaleIn">
                <div className={`relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
                    <button
                        onClick={handleClose}
                        className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-600'}`}
                    >
                        <X size={20} />
                    </button>

                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                            <EditableText contentKey={`${lang}.careerPopup.heading`} fallback="We're Hiring!" />
                        </h3>
                        <p className="text-white/80">
                            <EditableText contentKey={`${lang}.careerPopup.badge`} fallback="Community Manager Position" />
                        </p>
                    </div>

                    <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm font-bold text-cyan-500"><EditableText contentKey={`${lang}.careerPopup.tag`} fallback="Join the XyberClan Team" /></span>
                        </div>

                        <h4 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <EditableText contentKey={`${lang}.careerPopup.title`} fallback="Shape Our Community" />
                        </h4>

                        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <EditableText contentKey={`${lang}.careerPopup.description`} fallback="We're looking for a passionate Community Manager to grow and nurture our digital community. Help us connect, engage, and build meaningful relationships with our audience." />
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/careers/community-manager"
                                onClick={handleClose}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/30"
                            >
                                <EditableText contentKey={`${lang}.careerPopup.cta`} fallback="Apply Now" />
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={handleClose}
                                className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <EditableText contentKey={`${lang}.careerPopup.dismiss`} fallback="Not right now" />
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
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default CareerPopup;
