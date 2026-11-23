// Portfolio copy that is not in translations.js. Project data stays in English
// (as before); category, status and place names get a French reading here.
const copy = {
  en: {
    metaTitle: 'Our Portfolio | Innovative Digital Solutions & Tech',
    metaDescription:
      "Explore XyberClan's portfolio. See how our cybersecurity and tech innovation startup delivers high-performance web development, mobile apps, and secure digital solutions.",
    view: 'View',
    open: 'Open project',
    close: 'Close',
    next: 'Next project',
    live: 'Live',
    projects: (n) => `${n} ${n === 1 ? 'project' : 'projects'}`,
    values: {},
  },
  fr: {
    metaTitle: 'Notre portfolio | Solutions numériques et tech innovantes',
    metaDescription:
      "Découvrez le portfolio de XyberClan : développement web haute performance, applications mobiles et solutions numériques sécurisées, par une startup en cybersécurité et innovation tech.",
    view: 'Voir',
    open: 'Ouvrir le projet',
    close: 'Fermer',
    next: 'Projet suivant',
    live: 'En ligne',
    projects: (n) => `${n} ${n === 1 ? 'projet' : 'projets'}`,
    values: {
      'AI Chatbot': 'Chatbot IA',
      'Event Platform': 'Plateforme événementielle',
      'Innovation Lab': "Laboratoire d'innovation",
      Cybersecurity: 'Cybersécurité',
      'Web Application': 'Application web',
      Live: 'En ligne',
      'In Portfolio': 'Au portfolio',
      Cameroon: 'Cameroun',
      Africa: 'Afrique',
      Technology: 'Technologie',
      Entertainment: 'Divertissement',
    },
  },
};

/** French reading of a data value (category, status, place, industry); English stays as is. */
export const say = (c, value) => c.values[value] || value;

export default copy;
