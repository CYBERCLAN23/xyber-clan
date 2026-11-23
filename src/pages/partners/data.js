// Partners page data, carried over from the previous page.

// Hult Prize figures (values) and their labels per language.
export const HULT_STATS = [
  { icon: 'Zap', value: '100%' },
  { icon: 'Users', value: '24/7' },
  { icon: 'Globe', value: 'Global' },
];

export const HULT_LABELS = {
  en: ['Technical Mentorship', 'Innovation Boost', 'Social Impact'],
  fr: ['Mentorat Technique', "Boost d'Innovation", 'Impact Social'],
};

// External links of the partners.
export const LINKS = {
  gehmit: 'https://gehmit.org/',
  divlabs: 'https://divlabs-tech.com/',
};

// Pictures of each partnership (real photographs and the partners' own logos).
export const IMAGES = {
  hultGroup: '/images/journey/hult-prize.jpg',
  hultTeam: '/images/events/hult-prize-sponsor.jpeg',
  gehmitLogo: '/images/speakers/logo-gehmit.jpg',
  divlabsLogo: '/images/divlab.jpg',
  divlabsWebinar: '/images/events/webinair.jpeg',
};

// The partnership paths. `type` is the value the application form reads from ?type=.
export const PARTNERSHIP_TYPES = ['partner', 'sponsor'];
export const applyHref = (type) => `/partners/apply?type=${type}`;
