// Partners shown in the "Trusted by" marquee (same six, same order and URLs as
// the old components/TrustBadges.jsx). The old logo paths (/images/partners/*.png)
// never existed; `logo` now points to the real files we have, null where none exists yet.
export const partners = [
  { name: 'Hult Prize', logo: null, url: 'https://www.hultprize.org' },
  { name: 'GEHMIT', logo: '/images/speakers/logo-gehmit.jpg', url: 'https://gehmit.org' },
  { name: 'Divlab', logo: '/images/divlab.jpg', url: 'https://divlabs-tech.com' },
  { name: 'UY1', logo: null, url: 'https://www.univ-yaounde1.cm' },
  { name: 'AllBot', logo: null, url: 'https://www.allbot.xyberclan.dev' },
  { name: 'NB Company', logo: null, url: 'https://nb-dance-award.vercel.app/' },
];

// translations.js has no `trust` block: these are the fallbacks (EN from the old file).
export const trustCopy = {
  en: {
    title: 'Trusted by',
    stat1: { value: '100%', label: 'Client Satisfaction' },
    stat2: { value: '24/7', label: 'Support Available' },
    stat3: { value: 'Fast', label: 'Delivery Time' },
    network: 'Our Network',
    transitionText: 'Trusted by industry leaders and innovators worldwide',
    visit: 'Visit',
  },
  fr: {
    title: 'Ils nous font confiance',
    stat1: { value: '100%', label: 'Satisfaction client' },
    stat2: { value: '24/7', label: 'Support disponible' },
    stat3: { value: 'Rapide', label: 'Délai de livraison' },
    network: 'Notre réseau',
    transitionText: "Reconnu par les leaders de l'industrie et les innovateurs du monde entier",
    visit: 'Visiter',
  },
};
