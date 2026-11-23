// Team teaser data, carried over unchanged from the previous home team strip.

export const ROLES_EN = {
  cedrik: 'Co-Founder, CEO & Cybersecurity Analyst',
  josias: 'Co-Founder & CTO / AI Security Architect',
  onana: 'COO, IT & Cybersecurity Eng.',
  ange: 'Data Analyst & UI/UX Designer',
  william: 'Visual Content Designer',
  yann: 'Network Eng & Python',
  zealda: 'Fullstack Dev & Systems Eng.',
  lembou: 'Cybersecurity, DevOps & AI',
  theresa: 'CEO of Greenfarmers · GDG Yaoundé Volunteer · Hult Prize Organiser',
};

export const ROLES_FR = {
  cedrik: 'Co-Fondateur, CEO & Analyste Cybersécurité',
  josias: 'Co-Fondateur & CTO / Architecte IA Sécurité',
  onana: 'COO, Ing. IT & Cybersécurité',
  ange: 'Analyste Données & Designer UI/UX',
  william: 'Designer de Contenu Visuel',
  yann: 'Ing. Réseau & Python',
  zeal: 'Dév Fullstack & Ing. Systèmes',
  lembou: 'Cybersécurité, DevOps & IA',
  theresa: 'CEO de Greenfarmers · Bénévole GDG Yaoundé · Organisatrice Hult Prize',
};

export const teamMembers = [
  { key: 'cedrik', name: 'Cedrik Darel Yepmo', image: '/team/ceo-member.jpg' },
  { key: 'josias', name: 'Akana Signing Josias Aaron', image: '/team/cto-redteamer.jpg' },
  { key: 'onana', name: 'Onana Gregoire Legrand', image: '/team/communications-manager.jpeg?v=2' },
  { key: 'ange', name: 'Ange Demanou', image: '/team/ange-demanou.png' },
  { key: 'william', name: 'William Chandler', image: '/team/william-chandler.png' },
  { key: 'yann', name: 'Wandji Tchaleu Yann Félix', image: '/team/yann-felix-wandji.png' },
  { key: 'zealda', name: 'ADJIA MVOA NDJI GABRIEL MONFILS', image: '/team/frontend-designer.png' },
  { key: 'lembou', name: 'Lembou Pharel', image: '/team/cybersecurity-chief.jpg' },
  { key: 'theresa', name: 'Theresa Tcheme', image: '/team/theresa-tcheme.jpg' },
];

// The French role list keys this member as 'zeal'.
const FR_KEY = { zealda: 'zeal' };

export const roleOf = (key, lang) => (lang === 'fr' ? ROLES_FR[FR_KEY[key] || key] : ROLES_EN[key]);

// Where each face sits in its portrait: [x, y, face width] as fractions of the
// image, plus the image's natural width and height. Used to land the face in
// the figure's head.
export const FACES = {
  cedrik: [0.52, 0.36, 0.22, 880, 1112],
  josias: [0.82, 0.61, 0.114, 1440, 2560],
  onana: [0.58, 0.28, 0.12, 1080, 1080],
  ange: [0.47, 0.34, 0.12, 344, 255],
  william: [0.22, 0.53, 0.073, 343, 332],
  yann: [0.45, 0.37, 0.4, 500, 500],
  zealda: [0.45, 0.37, 0.4, 500, 500],
  lembou: [0.49, 0.21, 0.22, 783, 1024],
  theresa: [0.61, 0.42, 0.12, 1280, 853],
};
