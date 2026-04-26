// Types partagés pour les mini-jeux.

import type { Family } from "@/types/database";

export type FamilyId = Family;

export type GameStatus = "available" | "coming-soon";

// Skills calculées en fin de mini-jeu — score 0..100 par dimension.
// Schéma libre côté DB (jsonb) ; on s'aligne juste sur ces 4 dims pour Cap'.
export type Skills = {
  analyse?: number;
  communication?: number;
  creativite?: number;
  strategie?: number;
};

export type GameMeta = {
  id: string;
  name: string;
  family: FamilyId;
  status: GameStatus;
  order: number;
  concept: string; // 1-liner pour la card
  totalRounds: number;
};
