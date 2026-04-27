import type { GameMeta } from '@/types/games';

// Registre central des mini-jeux Cap'.
// Pour ajouter un jeu : (1) ajoute la meta ici, (2) crée le composant dans
// components/games/, (3) ajoute le mapping dans `gameComponents.ts`.

export const GAMES: GameMeta[] = [
  {
    id: 'mapping-concurrentiel',
    name: 'Mapping Concurrentiel',
    family: 'marketing',
    status: 'available',
    order: 1,
    totalRounds: 3,
    concept: 'Drag & drop : place les marques sur les axes prix / qualité.',
  },
  {
    id: 'mix-marketing-4p',
    name: 'Mix Marketing (4P)',
    family: 'marketing',
    status: 'available',
    order: 2,
    totalRounds: 3,
    concept: 'Puzzle : associe les bonnes décisions Produit / Prix / Place / Promo à une marque.',
  },
  {
    id: 'persona-builder',
    name: 'Persona Builder',
    family: 'marketing',
    status: 'coming-soon',
    order: 3,
    totalRounds: 3,
    concept: 'QCM narratif : construis un persona en répondant à des questions sur une cible.',
  },
  {
    id: 'segmentation-client',
    name: 'Segmentation Client',
    family: 'marketing',
    status: 'coming-soon',
    order: 4,
    totalRounds: 3,
    concept: 'Tri de cartes : classe des profils clients dans les bons segments.',
  },
  {
    id: 'test-positionnement',
    name: 'Test de Positionnement',
    family: 'marketing',
    status: 'coming-soon',
    order: 5,
    totalRounds: 5,
    concept: 'Blind test : devine la marque juste avec son positionnement décrit.',
  },
  {
    id: 'budget-pub',
    name: 'Budget Pub',
    family: 'marketing',
    status: 'coming-soon',
    order: 6,
    totalRounds: 3,
    concept: 'Allocation : répartis un budget limité sur différents canaux marketing.',
  },
  {
    id: 'analyse-swot',
    name: 'Analyse SWOT',
    family: 'marketing',
    status: 'coming-soon',
    order: 7,
    totalRounds: 3,
    concept: "Drag & drop : place des infos dans la bonne case SWOT d'une vraie entreprise.",
  },

  // ─── Programmes · UCL Lille · Module Gestion d'entreprise ─────────────
  {
    id: 'ucl-entreprise-explorer',
    name: 'Entreprise Explorer',
    family: 'programs-ucl',
    status: 'available',
    order: 1,
    totalRounds: 1,
    concept:
      'Tri multi-critères : classe 12 entreprises réelles sur 3 axes (forme juridique / secteur / taille).',
  },
  {
    id: 'ucl-statut-quiz',
    name: 'Statut Quiz',
    family: 'programs-ucl',
    status: 'available',
    order: 2,
    totalRounds: 5,
    concept:
      "Arbre de décision : 5 cas d'entrepreneurs à résoudre en naviguant dans les questions clés.",
  },
  {
    id: 'ucl-pestel-match',
    name: 'PESTEL Match',
    family: 'programs-ucl',
    status: 'available',
    order: 3,
    totalRounds: 3,
    concept: 'Drag & drop : classe 18 facteurs dans les 6 dimensions PESTEL pour 3 secteurs.',
  },
  {
    id: 'ucl-market-radar',
    name: 'Market Radar',
    family: 'programs-ucl',
    status: 'available',
    order: 4,
    totalRounds: 3,
    concept: 'Mixte QCM + calculs : segmente des marchés et calcule des parts de marché sur 3 cas.',
  },
];

export function getGame(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}

export function getGamesByFamily(family: string): GameMeta[] {
  return GAMES.filter((g) => g.family === family).sort((a, b) => a.order - b.order);
}
