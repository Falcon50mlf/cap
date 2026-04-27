"use client";

import { notFound } from "next/navigation";
import { GameShell } from "@/components/games/GameShell";
import { gameComponents } from "@/lib/game-components";
import { getSubmodule } from "@/lib/schools-database";
import { getGame } from "@/lib/games-registry";

const VALID_IDS = [
  "reconnaitre-entreprise",
  "choisir-statut",
  "pestel",
  "marche",
];

export default function UclGamePage({
  params,
}: {
  params: { moduleId: string };
}) {
  if (!VALID_IDS.includes(params.moduleId)) notFound();

  const sub = getSubmodule("ucl", "gestion-entreprise", params.moduleId);
  if (!sub) notFound();

  const meta = getGame(sub.gameId);
  if (!meta) notFound();

  const Game = gameComponents[meta.id];
  if (!Game) notFound();

  return (
    <GameShell
      gameId={meta.id}
      family="programs-ucl"
      title={`${sub.title} · ${meta.name}`}
      totalRounds={meta.totalRounds}
      instructions={meta.concept}
      accent="var(--pivot)"
      returnHref={`/programmes/ucl/gestion-entreprise/${params.moduleId}`}
    >
      <Game />
    </GameShell>
  );
}
