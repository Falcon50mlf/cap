// 5 métiers de la famille Marketing, en détail.
// Les 25 autres métiers (5 par famille restante) sont en placeholder côté UI.

import type { Family } from '@/types/database';

export type Job = {
  id: string;
  family: Family;
  name: string;
  tagline: string;
  description: string;
  journeeType: { hour: string; activity: string }[];
  salaire: { junior: string; senior: string };
  skills: string[];
  parcours: string;
  iconName: string; // Lucide
};

export const JOBS: Job[] = [
  {
    id: 'brand-manager',
    family: 'marketing',
    name: 'Brand Manager',
    tagline: "Le pilote d'une marque sur 360°.",
    description:
      "Tu portes la vision, le positionnement et la P&L d'une marque (ou d'une gamme). Tu travailles avec la R&D, les ventes, la créa, la finance — t'es le chef d'orchestre. Tu dois faire grandir la marque sur le long terme tout en livrant les chiffres du trimestre.",
    journeeType: [
      { hour: '9h', activity: 'Stand-up avec ton équipe (assistant, stagiaire)' },
      { hour: '10h30', activity: 'Brief créatif avec ton agence sur le prochain spot' },
      { hour: '12h', activity: 'Déjeuner avec un commercial : retour terrain' },
      { hour: '14h', activity: 'Analyse Nielsen + benchmark concurrence' },
      { hour: '16h', activity: 'Préparation du business review trimestriel' },
      { hour: '18h', activity: "Tournage d'un contenu digital, validation des prises" },
    ],
    salaire: { junior: '38-45k€', senior: '70-100k€' },
    skills: ['Leadership', 'Créativité', 'Analyse data', 'Storytelling', 'Rigueur P&L'],
    parcours:
      'Bac+5 école de commerce → 1-2 stages chez un annonceur école → 2-3 ans Brand Assistant → Brand Manager.',
    iconName: 'Megaphone',
  },
  {
    id: 'product-marketing-manager',
    family: 'marketing',
    name: 'Product Marketing Manager',
    tagline: 'Le pont entre le produit et le marché.',
    description:
      "Très répandu en tech / SaaS. Tu définis le positionnement d'un produit, tu prépares les lancements, tu écris la doc qui aide les commerciaux à vendre. Tu passes ta journée entre la roadmap produit, les insights utilisateurs et les équipes Sales.",
    journeeType: [
      { hour: '9h30', activity: 'Sync avec le PM produit sur la roadmap Q3' },
      { hour: '11h', activity: 'Interview client : pourquoi tu nous as choisis ?' },
      { hour: '13h', activity: 'Déjeuner avec un Account Executive' },
      { hour: '14h30', activity: "Rédaction du launch plan d'une nouvelle feature" },
      { hour: '16h', activity: 'Atelier de positionnement avec marketing & design' },
      { hour: '17h30', activity: 'Préparation du sales enablement deck' },
    ],
    salaire: { junior: '42-55k€', senior: '75-110k€' },
    skills: ['Positionnement', 'Communication', 'Empathie produit', 'Synthèse', 'Sales sense'],
    parcours:
      'École de commerce ou ingé + master tech → 1-2 stages produit ou agence B2B → 2 ans PMM junior → Senior PMM dans une scale-up.',
    iconName: 'Layers',
  },
  {
    id: 'growth-marketer',
    family: 'marketing',
    name: 'Growth Marketer',
    tagline: "Faire scaler l'acquisition, vite et mesurable.",
    description:
      "Tu pilotes les leviers d'acquisition payante (SEA, paid social, affiliate) et organique (SEO, contenu, viralité). Tu vis dans Looker / Mixpanel, tu testes en continu, tu as horreur des décisions sans data. C'est le job le plus quanti du marketing.",
    journeeType: [
      { hour: '9h', activity: 'Check des dashboards perf de la nuit' },
      { hour: '10h', activity: "Setup d'un test A/B sur la landing principale" },
      { hour: '12h', activity: "Sync avec l'équipe data sur l'attribution" },
      { hour: '14h', activity: 'Brief de 5 nouvelles créa pour Meta Ads' },
      { hour: '16h', activity: 'Optim des keywords SEA avec un freelance' },
      { hour: '18h', activity: 'Reporting CAC/LTV au CEO' },
    ],
    salaire: { junior: '40-50k€', senior: '75-120k€' },
    skills: [
      'Data analysis',
      'Curiosité technique',
      'Test & learn',
      'ROI obsession',
      'Storytelling chiffres',
    ],
    parcours:
      'École de commerce / ingé / autodidacte avec preuves → stages en agence growth ou startup → 1-2 ans Junior Growth → Growth Lead.',
    iconName: 'TrendingUp',
  },
  {
    id: 'communication-manager',
    family: 'marketing',
    name: 'Communication Manager',
    tagline: "Construire la voix publique d'une marque.",
    description:
      "Tu pilotes la communication externe (RP, social media, contenu, relations influenceurs) et parfois interne (comm employé, change). C'est un mix entre stratégie de marque, gestion de crise, et création de récits. Tu travailles main dans la main avec la direction.",
    journeeType: [
      { hour: '8h30', activity: 'Revue de presse + monitoring social' },
      { hour: '10h', activity: "Brief créa avec l'agence RP sur le lancement RSE" },
      { hour: '12h', activity: 'Déjeuner avec une journaliste des Echos' },
      { hour: '14h', activity: 'Validation du calendrier éditorial du mois' },
      { hour: '16h', activity: 'Atelier crisis comm avec les équipes juridiques' },
      { hour: '18h', activity: 'Validation des prises de parole CEO sur LinkedIn' },
    ],
    salaire: { junior: '38-48k€', senior: '70-100k€' },
    skills: ['Storytelling', 'Relations presse', 'Réactivité', 'Diplomatie', 'Plume'],
    parcours:
      "École de commerce ou Sciences Po → stages agence RP + chez l'annonceur → 2-3 ans Comm Officer → Communication Manager.",
    iconName: 'MessageSquare',
  },
  {
    id: 'chef-produit-fmcg',
    family: 'marketing',
    name: 'Chef de Produit FMCG',
    tagline: "Le métier le plus complet du marketing 'à l'ancienne'.",
    description:
      "Spécifique aux biens de grande consommation (alimentaire, hygiène, beauté). Tu pilotes une catégorie / SKU de A à Z : R&D, packaging, prix, distribution, comm. C'est l'école par excellence du marketing : tu sors souvent ultra-formé après 4-5 ans en FMCG.",
    journeeType: [
      { hour: '9h', activity: 'Test produit en R&D : nouvelle recette yaourt' },
      { hour: '10h30', activity: 'Réunion packaging : choix du sticker éco-score' },
      { hour: '12h', activity: 'Déjeuner-terrain dans un Carrefour' },
      { hour: '14h', activity: 'Pricing review trimestrielle' },
      { hour: '16h', activity: "Sync avec l'équipe trade sur la promo Pâques" },
      { hour: '18h', activity: 'Préparation du category review annuel' },
    ],
    salaire: { junior: '40-46k€', senior: '75-105k€' },
    skills: ['Vision produit', 'Rigueur', 'Analyse de marché', 'Négo interne', 'Sens commercial'],
    parcours:
      'École de commerce reconnue → stage long en FMCG → Chef de Produit Junior 2 ans → Chef de Produit / Senior PM.',
    iconName: 'Package',
  },
];

export function getJobsByFamily(family: Family): Job[] {
  return JOBS.filter((j) => j.family === family);
}

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
