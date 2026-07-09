import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FALLBACKS = {
    en: {
        title: "XyberClan — Digital Agency | Web, Design & Cybersecurity",
        description: "XyberClan, African digital agency serving clients worldwide. Web development, design, cybersecurity.",
        keywords: "XyberClan, web development, digital agency Africa, cybersecurity"
    },
    fr: {
        title: "XyberClan — Agence Digitale | Web, Design & Cybersécurité",
        description: "XyberClan, agence digitale africaine au service des clients du monde entier. Développement web, design, cybersécurité.",
        keywords: "XyberClan, développement web, agence digitale Afrique, cybersécurité"
    }
};

const Meta = ({ title, description, keywords, ogImage }) => {
    const { language } = useLanguage();
    const fb = FALLBACKS[language] || FALLBACKS.en;

    useEffect(() => {
        document.title = title ? `${title} | XyberClan` : fb.title;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || fb.description);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || fb.keywords);
        }

        const metaOgImage = document.querySelector('meta[property="og:image"]');
        if (metaOgImage) {
            metaOgImage.setAttribute('content', ogImage || "https://www.xyberclan.dev/og-image.png");
        }
    }, [title, description, keywords, ogImage, language, fb.title, fb.description, fb.keywords]);

    return null;
};

export default Meta;
