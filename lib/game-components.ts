import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Mapping id → composant React du mini-jeu, en lazy-loading.
// Seuls les jeux jouables sont mappés ici. Les "coming-soon" ne le sont pas
// (le resolver les redirige vers une page placeholder).

export const gameComponents: Record<string, ComponentType> = {
  "mapping-concurrentiel": dynamic(
    () => import("@/components/games/MappingConcurrentiel"),
    { ssr: false },
  ),
  "mix-marketing-4p": dynamic(
    () => import("@/components/games/MixMarketing4P"),
    { ssr: false },
  ),
  // UCL · Gestion d'entreprise
  "ucl-entreprise-explorer": dynamic(
    () => import("@/components/games/EntrepriseExplorer"),
    { ssr: false },
  ),
  "ucl-statut-quiz": dynamic(() => import("@/components/games/StatutQuiz"), {
    ssr: false,
  }),
  "ucl-pestel-match": dynamic(() => import("@/components/games/PestelMatch"), {
    ssr: false,
  }),
  "ucl-market-radar": dynamic(() => import("@/components/games/MarketRadar"), {
    ssr: false,
  }),
};
