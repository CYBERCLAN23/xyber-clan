import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FALLBACKS = {
    en: {
        title: "XyberClan — Build digital dreams | Websites, Apps, Design & Security",
        description: "We design, build and secure websites, apps and digital products for ambitious businesses, from Yaoundé to the world. Start your project with XyberClan.",
        keywords: "XyberClan, web development, mobile app development, UI UX design, cybersecurity, digital agency Cameroon, Yaoundé"
    },
    fr: {
        title: "XyberClan — Construire les rêves numériques | Sites, apps, design et sécurité",
        description: "Nous concevons, développons et sécurisons des sites, des applications et des produits numériques pour les entreprises ambitieuses, de Yaoundé au monde entier. Lancez votre projet avec XyberClan.",
        keywords: "XyberClan, développement web, applications mobiles, design UI UX, cybersécurité, agence digitale Cameroun, Yaoundé"
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
