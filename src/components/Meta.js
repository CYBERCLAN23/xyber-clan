import { useEffect } from 'react';

const Meta = ({ title, description, keywords, ogImage }) => {
    useEffect(() => {
        // Update Title
        const defaultTitle = "XyberClan — Digital Agency | Web, Design & Cybersecurity";
        document.title = title ? `${title} | XyberClan` : defaultTitle;

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || "XyberClan, African digital agency serving clients worldwide. Web development, design, cybersecurity.");
        }

        // Update Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || "XyberClan, web development, digital agency Africa, cybersecurity");
        }

        // Update OG Image
        const metaOgImage = document.querySelector('meta[property="og:image"]');
        if (metaOgImage) {
            metaOgImage.setAttribute('content', ogImage || "https://www.xyberclan.dev/og-image.png");
        }
    }, [title, description, keywords, ogImage]);

    return null;
};

export default Meta;
