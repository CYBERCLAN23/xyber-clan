// Home figures, carried over from the previous stats counter.
// `label` is the original English fallback (line breaks kept); `labelFr` is
// the French fallback, used when no CMS value exists for the French key.

const yearsExp = new Date().getFullYear() - 2022;

export const stats = [
  { value: 50, suffix: '+', label: 'Projects\nCompleted', labelFr: 'Projets\nRéalisés', key: 'projects' },
  { value: 30, suffix: '+', label: 'Happy\nClients', labelFr: 'Clients\nSatisfaits', key: 'clients' },
  { value: 9, suffix: '', label: 'Team\nExperts', labelFr: 'Experts\nde l’équipe', key: 'experts' },
  { value: yearsExp, suffix: '+', label: 'Years\nExperience', labelFr: "Années\nd'expérience", key: 'years' },
];
