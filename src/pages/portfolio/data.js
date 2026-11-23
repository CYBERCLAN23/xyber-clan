// Portfolio data, carried over unchanged from the previous portfolio grid.
export const projects = [
  {
    id: 1,
    client: 'AllBot',
    logoText: 'AllBot',
    image: '/portfolio/logo.png',
    previewImage: '/portfolio/logo.png',
    url: 'https://www.allbot.xyberclan.dev',
    category: 'AI Chatbot',
    status: 'Live',
    geography: 'Cameroon',
    industry: 'Technology',
    description: 'AI-powered chatbot platform providing intelligent customer support and automation solutions.',
  },
  {
    id: 2,
    client: 'NB Dance Awards',
    logoText: 'NB Dance',
    image: '/portfolio/portfolio_nbdance_1766276075058.png',
    previewImage: '/portfolio/portfolio_nbdance_1766276075058.png',
    url: 'https://www.nbdanceawards.app/',
    category: 'Event Platform',
    status: 'Live',
    geography: 'Cameroon',
    industry: 'Entertainment',
    description: 'A comprehensive event voting and ticketing platform for dance competitions. Features real-time voting, mobile money payments, and live results broadcasting.',
  },
  {
    id: 3,
    client: 'Genesis',
    logoText: 'Genesis',
    image: '/portfolio/logo.png',
    previewImage: '/portfolio/logo.png',
    url: '#',
    category: 'Innovation Lab',
    status: 'In Portfolio',
    geography: 'Cameroon',
    industry: 'Technology',
    description: 'Innovation lab exploring cutting-edge technologies and building next-generation digital solutions.',
  },
  {
    id: 4,
    client: 'XyberShield App',
    logoText: 'XyberShield',
    image: '/portfolio/portfolio_xybershield_app_1766276389826.png',
    previewImage: '/portfolio/portfolio_xybershield_app_1766276389826.png',
    url: '#',
    category: 'Cybersecurity',
    status: 'In Portfolio',
    geography: 'Cameroon',
    industry: 'Technology',
    description: 'Mobile cybersecurity application providing real-time threat detection, VPN services, and security auditing for enterprise clients.',
  },
  {
    id: 5,
    client: 'XyberShield Web',
    logoText: 'XyberShield Web',
    image: '/portfolio/portfolio_xybershield_web_1766276548512.png',
    previewImage: '/portfolio/portfolio_xybershield_web_1766276548512.png',
    url: '#',
    category: 'Web Application',
    status: 'In Portfolio',
    geography: 'Africa',
    industry: 'Technology',
    description: 'Web dashboard for XyberShield security platform. Real-time threat monitoring, incident response, and network visualisation for enterprise clients.',
  },
];

export const CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

export const metaLabels = {
  Category: { en: 'Category', fr: 'Catégorie' },
  Status: { en: 'Status', fr: 'Statut' },
  Geography: { en: 'Geography', fr: 'Géographie' },
  Industry: { en: 'Industry', fr: 'Secteur' },
};

// How each project's picture sits on its plate. Logos are set on a field of
// colour; screenshots fill the plate. When a picture is missing, the plate shows
// the project's name as a title card in the same colour.
export const PLATES = {
  1: { tone: 'paper', fit: 'contain' },
  2: { tone: 'ink', fit: 'cover' },
  3: { tone: 'ink', fit: 'contain' },
  4: { tone: 'blue', fit: 'cover' },
  5: { tone: 'cyan', fit: 'cover' },
};
