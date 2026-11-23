// Webinar speakers, moved unchanged from the old src/SpeakersPage.jsx.
// Social icons were react-icons elements; they are drawn from the name now.
export const speakers = [
  {
    id: 1,
    image: '/images/speakers/speaker-1.jpeg',
    name: 'Vanessa Manessong',
    role: 'Analyste de Données d\'Investigation & OSINT',
    description: 'Analyste de données spécialisée dans l\'analyse des écosystèmes informationnels, la désinformation en ligne et les enquêtes OSINT. Fondatrice de Gehmit, une organisation engagée dans l\'orientation et la formation des jeunes aux métiers du numérique. Passionnée par la data, l\'IA et l\'impact social des technologies.',
    enterprise: 'Gehmit',
    logo: '/images/speakers/logo-gehmit.svg',
    link: 'gehmit.org',
    socials: [
      { name: 'linkedin.com/in/vanessa-manessong', url: 'https://cm.linkedin.com/in/vanessa-manessong' },
    ],
  },
  {
    id: 2,
    image: '/images/speakers/speaker-2.jpeg',
    name: 'Cabrel Donfang',
    role: 'Serial Event Organiser & Tech Evangelist',
    description: 'Organisateur d\'événements en série, fournisseur de solutions et évangéliste technologique. Passionné par la construction de communautés, la connexion des innovateurs et l\'adoption de la technologie à travers l\'Afrique.',
    enterprise: 'Cabrel Donfang',
    logo: '/images/speakers/logo-cabrel.svg',
    socials: [
      { name: 'linkedin.com/in/cabrellesage', url: 'https://cm.linkedin.com/in/cabrellesage' },
    ],
  },
  {
    id: 3,
    image: '/images/speakers/speaker-3.jpeg',
    name: 'Tamkwa Kamga Brandon',
    role: 'Développeur Fullstack IA & DevOps',
    description: 'Fondateur et Mentor chez LesCrack. Développeur Fullstack AI et DevOps chez Gehmit. Passionné par la création de solutions alimentées par l\'IA évolutives et le mentorat de la prochaine génération de développeurs.',
    enterprise: 'LesCrack',
    logo: '/images/speakers/logo-lescrack.svg',
    socials: [
      { name: 'linkedin.com/in/brandon-duclerc-tamwa-kamga', url: 'https://cm.linkedin.com/in/brandon-duclerc-tamwa-kamga' },
    ],
  },
  {
    id: 4,
    image: '/images/speakers/speaker-4.jpeg',
    name: 'Ndjana Mengue Jerry',
    role: 'Community Builder & Tech Leader',
    description: 'Co-Fondateur & COO chez Hinkaku, Organisateur GDG Yaoundé, Leader AWS Student Builder Group. Dévoué à la construction de communautés tech florissantes et à l\'autonomisation des étudiants en cloud computing et leadership.',
    enterprise: 'Hinkaku',
    logo: '/images/speakers/logo-hinkaku.svg',
    link: 'hinkaku.tech',
    socials: [
      { name: 'linkedin.com/in/jerry-davis-ndjana-mengue-89229627a', url: 'https://cm.linkedin.com/in/jerry-davis-ndjana-mengue-89229627a' },
    ],
  },
  {
    id: 5,
    image: '/images/speakers/speaker-5.svg',
    name: 'Theresa Tcheme',
    role: 'Organisatrice d\'Événements & Médiatrice',
    description: '2ème année en Informatique à l\'Université de Yaoundé I. Co-Fondatrice & CEO de Greenfarmers. Volontaire GDG Yaoundé et Organisatrice du programme Hult Prize OnCampus à l\'Université de Yaoundé I.',
    enterprise: 'Greenfarmers',
    link: '',
    socials: [
      { name: 'LinkedIn', url: '#' },
    ],
  },
];

/**
 * Asset corrections applied on top of the data above:
 *  - Gehmit's logo exists as .jpg, not .svg (the .svg path is missing).
 *  - Theresa's portrait was an initials placeholder; her real photo is on the team page,
 *    and so is her LinkedIn profile.
 */
export const FIXES = {
  1: { logo: '/images/speakers/logo-gehmit.jpg' },
  5: {
    image: '/team/theresa-tcheme.jpg',
    socials: [{ name: 'linkedin.com/in/theresa-tcheme-a5402a358', url: 'https://www.linkedin.com/in/theresa-tcheme-a5402a358/' }],
  },
};

/** Logos that are only the name set in type: show the name instead of the placeholder box. */
export const TEXT_LOGOS = ['/images/speakers/logo-cabrel.svg', '/images/speakers/logo-lescrack.svg'];

/** Framing per photo (see team/data.js FRAMING). */
export const FRAMING = {
  1: { focus: [0.5, 0.34], zoom: 1 },
  2: { focus: [0.52, 0.38], zoom: 2.25 },
  3: { focus: [0.48, 0.3], zoom: 1 },
  4: { focus: [0.475, 0.5], zoom: 1.6 },
  5: { focus: [0.6, 0.4], zoom: 1.4 },
};

/** The event these speakers spoke at (from the events and journey pages). */
export const WEBINAR_IMAGE = '/images/events/webinair.jpeg';

export const withFixes = (s) => ({ ...s, ...(FIXES[s.id] || {}) });
