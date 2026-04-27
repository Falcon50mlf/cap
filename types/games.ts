// Types partagés pour les mini-jeux.

import type { Family } from "@/types/database";

// Découverte families + Programmes (école/module-specific id).
// Programmes ids look like "programs-<school>" (ex: "programs-ucl").
export type FamilyId = Family | "programs-ucl";

export type GameStatus = "available" | "coming-soon";

// Skills calculées en fin de mini-jeu — score 0..100 par dimension.
// Schéma libre côté DB (jsonb) ; on s'aligne juste sur ces 5 dims pour Cap'.
export type Skills = {
  analyse?: number;
  communication?: number;
  creativite?: number;
  strategie?: number;
  rigueur?: number;
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
