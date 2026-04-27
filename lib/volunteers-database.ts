// 2 bénévoles Marketing en dur — pour la démo. Plus tard : table Supabase.

import type { Family } from '@/types/database';

export type Volunteer = {
  id: string;
  family: Family;
  firstName: string;
  lastInitial: string;
  age: number;
  current: string; // école ou poste actuel
  trajectory: string; // 1-liner parcours
  bio: string; // pitch perso
  topics: string[]; // ce sur quoi tu peux échanger avec lui/elle
  availability: string; // ex: '2 échanges / mois'
  format: ('call' | 'cafe' | 'message')[];
  // Pour l'avatar : initiales + gradient stable basé sur l'id
  gradient: string;
};

export const VOLUNTEERS: Volunteer[] = [
  {
    id: 'lea-marketing-master',
    family: 'marketing',
    firstName: 'Léa',
    lastInitial: 'M.',
    age: 24,
    current: 'Master Marketing · Stage Brand chez Mondelēz',
    trajectory:
      "Prépa éco → école de commerce → stage chez TBWA puis L'Oréal Paris → en poste à Mondelēz sur Milka.",
    bio: "Je suis tombée dedans en stage en agence pendant une césure. J'aime tout ce qui touche au branding émotionnel et au luxe accessible. Je peux te parler vrai du quotidien Brand Assistant, des entretiens chez les FMCG, et de comment se faire repérer en stage.",
    topics: [
      'Brand Marketing en grande conso',
      "Entretiens chez L'Oréal / Mondelēz / LVMH",
      'Vie en école (M2 spé Marketing)',
      'Choisir entre agence et annonceur en stage',
    ],
    availability: '2 échanges / mois',
    format: ['call', 'message'],
    gradient: 'linear-gradient(135deg, #FF4D6D, #FFDC32)',
  },
  {
    id: 'tom-growth-startup',
    family: 'marketing',
    firstName: 'Tom',
    lastInitial: 'G.',
    age: 27,
    current: 'Growth Lead · Doctolib (depuis 2 ans)',
    trajectory:
      'EM Lyon → 1 an chez Vinted (junior growth) → 1 an freelance growth (Back Market, Captain Train) → Doctolib.',
    bio: "Le growth marketing c'est ma drogue. J'aime les chiffres qui bougent, les tests qui tombent, et les hypothèses qu'on tue tous les vendredis. Je peux te parler concrètement de ce que c'est de bosser en startup vs scale-up, de comment apprendre le growth sans école, et de comment se faire embaucher quand t'as 0 expérience.",
    topics: [
      'Growth Marketing en startup / scale-up',
      'Premier job sans bagage growth',
      'Choisir entre conso & B2B SaaS',
      "Vie post-école quand t'es jeune diplômé",
    ],
    availability: '1 échange / semaine',
    format: ['call', 'cafe'],
    gradient: 'linear-gradient(135deg, #00D4A8, #8C6EFF)',
  },
];

export function getVolunteersByFamily(family: Family): Volunteer[] {
  return VOLUNTEERS.filter((v) => v.family === family);
}

export function getVolunteer(id: string): Volunteer | undefined {
  return VOLUNTEERS.find((v) => v.id === id);
}
