import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Try to get stored language from local storage, default to 'en'
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('xyber_lang');
        return saved || 'en';
    });

    // Update local storage and document lang attribute when language changes
    useEffect(() => {
        localStorage.setItem('xyber_lang', language);
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
