// Community Manager application: the questions of the original careers form, unchanged
// (EN), with a French version. Every string is also a CMS key (careerForm.steps.<id>.…).

export const CAREER_STEPS = [
  {
    id: 'welcome',
    type: 'welcome',
    question: 'Community Manager',
    subtitle: "Join XyberClan and help shape our growing community. We're looking for a passionate person to connect, engage, and build meaningful relationships.",
    badge: "We're Hiring!",
  },
  { id: 'fullName', type: 'input', question: "What's your full name?", placeholder: 'Enter your full name' },
  { id: 'email', type: 'input', question: "What's your email address?", placeholder: 'you@example.com', inputType: 'email' },
  { id: 'phone', type: 'input', question: "What's your phone number?", placeholder: '+1 (555) 000-0000', inputType: 'tel' },
  {
    id: 'experience',
    type: 'choice',
    question: 'Years of community management experience?',
    options: [{ label: 'Less than 1 year' }, { label: '1–2 years' }, { label: '3–5 years' }, { label: '5+ years' }],
  },
  {
    id: 'status',
    type: 'choice',
    question: "What's your current status?",
    options: [{ label: 'Student' }, { label: 'Freelancer' }, { label: 'Employed' }, { label: 'Open to work' }],
  },
  { id: 'location', type: 'input', question: 'Where are you located?', placeholder: 'City, Country (or Remote)' },
  {
    id: 'interest',
    type: 'textarea',
    question: 'Why are you interested in community management?',
    placeholder: 'Tell us about your passion for building communities...',
  },
  {
    id: 'links',
    type: 'fields',
    question: 'Share your profiles',
    fields: [
      { label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
      { label: 'Portfolio / GitHub', placeholder: 'https://github.com/...' },
      { label: 'Community you manage / Social media', placeholder: 'https://facebook.com/... or https://t.me/...' },
    ],
  },
  {
    id: 'availability',
    type: 'choice',
    question: 'When can you start?',
    options: [{ label: 'Immediately' }, { label: 'In 2 weeks' }, { label: 'In 1 month' }, { label: 'Flexible' }],
  },
  {
    id: 'skills',
    type: 'multiselect',
    question: 'Which skills describe you best?',
    subtitle: 'Pick all that apply',
    options: [
      { label: 'Communication' },
      { label: 'Content Creation' },
      { label: 'Social Media Management' },
      { label: 'Empathy & Listening' },
      { label: 'Event Planning' },
      { label: 'Conflict Resolution' },
      { label: 'Data & Analytics' },
      { label: 'Public Speaking' },
    ],
  },
];

/** Interface strings of the original careers form (CMS keys careerForm.ui.* / careerForm.summary.*). */
export const CAREER_UI = {
  en: {
    startApplication: 'Start Application',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    summaryTitle: 'Application Summary',
    summarySubtitle: 'Review your answers before sending',
    send: 'Send Application',
    backToEdit: 'Back to Edit',
    returnHome: 'Return to Homepage',
  },
  fr: {
    startApplication: 'Commencer la candidature',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Valider',
    summaryTitle: 'Résumé de la candidature',
    summarySubtitle: 'Vérifiez vos réponses avant l’envoi',
    send: 'Envoyer la candidature',
    backToEdit: 'Retour pour modifier',
    returnHome: 'Retour à l’accueil',
  },
};

/** French version of CAREER_STEPS, same ids and order. */
export const CAREER_STEPS_FR = {
  welcome: {
    question: 'Community Manager',
    subtitle: 'Rejoignez XyberClan et aidez à faire grandir notre communauté. Nous cherchons une personne passionnée pour créer du lien, animer et bâtir des relations solides.',
    badge: 'Nous recrutons !',
  },
  fullName: { question: 'Quel est votre nom complet ?', placeholder: 'Entrez votre nom complet' },
  email: { question: 'Quelle est votre adresse email ?', placeholder: 'vous@exemple.com' },
  phone: { question: 'Quel est votre numéro de téléphone ?' },
  experience: {
    question: 'Combien d’années d’expérience en gestion de communauté ?',
    options: ['Moins d’un an', '1–2 ans', '3–5 ans', '5 ans et plus'],
  },
  status: { question: 'Quelle est votre situation actuelle ?', options: ['Étudiant(e)', 'Freelance', 'Salarié(e)', 'Disponible'] },
  location: { question: 'Où êtes-vous basé(e) ?', placeholder: 'Ville, pays (ou à distance)' },
  interest: {
    question: 'Pourquoi la gestion de communauté vous intéresse-t-elle ?',
    placeholder: 'Parlez-nous de votre passion pour les communautés...',
  },
  links: {
    question: 'Partagez vos profils',
    fields: ['URL LinkedIn', 'Portfolio / GitHub', 'Communauté que vous gérez / Réseaux sociaux'],
  },
  availability: { question: 'Quand pouvez-vous commencer ?', options: ['Immédiatement', 'Dans 2 semaines', 'Dans 1 mois', 'Flexible'] },
  skills: {
    question: 'Quelles compétences vous décrivent le mieux ?',
    subtitle: 'Choisissez tout ce qui s’applique',
    options: [
      'Communication',
      'Création de contenu',
      'Gestion des réseaux sociaux',
      'Empathie & écoute',
      'Organisation d’événements',
      'Résolution de conflits',
      'Données & analyse',
      'Prise de parole',
    ],
  },
};

export const WHATSAPP_PROJECT = '237654269488';
export const WHATSAPP_PARTNERS = '237696814391';
export const EMAIL = 'xyberclandev@gmail.com';
