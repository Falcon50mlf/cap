"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useGameShell } from "./game-shell-context";

// ─── Données : 3 manches ──────────────────────────────────────────────────
type Brand = {
  id: string;
  name: string;
  target: { x: number; y: number }; // 0..1 dans le plan
};
type Round = { name: string; description: string; brands: Brand[] };

const ROUNDS: Round[] = [
  {
    name: "Automobile",
    description:
      "Place 5 marques auto sur les axes prix (← bas / haut →) et qualité perçue (↓ basse / haute ↑).",
    brands: [
      { id: "dacia", name: "Dacia", target: { x: 0.15, y: 0.2 } },
      { id: "toyota", name: "Toyota", target: { x: 0.45, y: 0.55 } },
      { id: "bmw", name: "BMW", target: { x: 0.75, y: 0.78 } },
      { id: "tesla", name: "Tesla", target: { x: 0.8, y: 0.88 } },
      { id: "lambo", name: "Lamborghini", target: { x: 0.95, y: 0.92 } },
    ],
  },
  {
    name: "Café",
    description:
      "Mêmes axes, marché du café. Pense à ce que les gens paient et à la qualité ressentie.",
    brands: [
      { id: "maxwell", name: "Maxwell House", target: { x: 0.18, y: 0.22 } },
      { id: "carte-noire", name: "Carte Noire", target: { x: 0.42, y: 0.5 } },
      { id: "starbucks", name: "Starbucks", target: { x: 0.55, y: 0.6 } },
      { id: "nespresso", name: "Nespresso", target: { x: 0.7, y: 0.75 } },
      { id: "hayb", name: "Hayb", target: { x: 0.88, y: 0.9 } },
    ],
  },
  {
    name: "Smartphone",
    description:
      "Place 5 marques de smartphones. Garde en tête la perception qualité, pas juste les specs.",
    brands: [
      { id: "wiko", name: "Wiko", target: { x: 0.18, y: 0.2 } },
      { id: "samsung-a", name: "Samsung A", target: { x: 0.4, y: 0.45 } },
      { id: "huawei", name: "Huawei P", target: { x: 0.55, y: 0.65 } },
      { id: "pixel", name: "Pixel", target: { x: 0.7, y: 0.82 } },
      { id: "iphone", name: "iPhone", target: { x: 0.85, y: 0.9 } },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
type Placement = { x: number; y: number };
const ACCENT = "var(--family-marketing)";

function dist(a: Placement, b: Placement) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// match 0..100 (1.0 = identique, 0.0 = aux antipodes)
function matchScore(d: number) {
  return Math.max(0, Math.round((1 - d / 1.4142) * 100));
}

function colorForMatch(m: number) {
  if (m >= 70) return "var(--mint)";
  if (m >= 45) return "var(--sun)";
  return "var(--coral)";
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function MappingConcurrentiel() {
  const shell = useGameShell();
  const [roundIdx, setRoundIdx] = useState(0);
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [validated, setValidated] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const round = ROUNDS[roundIdx]!; // safe: roundIdx in [0, ROUNDS.length)
  const isLast = roundIdx === ROUNDS.length - 1;
  const allPlaced = round.brands.every((b) => placements[b.id]);

  useEffect(() => {
    shell.setRound(roundIdx + 1);
  }, [roundIdx, shell]);

  function place(id: string, p: Placement) {
    setPlacements((prev) => ({ ...prev, [id]: p }));
  }

  function validate() {
    if (!allPlaced || validated) return;
    let sum = 0;
    round.brands.forEach((b) => {
      const p = placements[b.id]!;
      const d = dist(p, b.target);
      sum += matchScore(d);
    });
    const roundScore = Math.round(sum / round.brands.length);
    setScores((prev) => [...prev, roundScore]);
    setValidated(true);
  }

  function nextRound() {
    setRoundIdx((i) => i + 1);
    setPlacements({});
    setValidated(false);
  }

  function finish() {
    const finalScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );
    const skills = computeSkills(scores);
    shell.complete(skills, finalScore, { roundScores: scores });
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-1"
            style={{ color: ACCENT }}
          >
            Manche {roundIdx + 1} / {ROUNDS.length} · {round.name}
          </div>
          <p className="text-snow/70 text-sm md:text-base max-w-2xl">
            {round.description}
          </p>
        </div>
        <RoundsBadge scores={scores} total={ROUNDS.length} current={roundIdx} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Plane
            brands={round.brands}
            placements={placements}
            validated={validated}
            onPlace={place}
          />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <BrandsPool
            brands={round.brands}
            placements={placements}
            onPlace={place}
          />

          {!validated && (
            <button
              onClick={validate}
              disabled={!allPlaced}
              className="w-full inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-6 py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ boxShadow: allPlaced ? "0 0 24px var(--sun)" : "none" }}
            >
              {allPlaced
                ? "Valider mes positions"
                : `Place encore ${round.brands.length - Object.keys(placements).length}`}
              {allPlaced && <ArrowRight className="w-5 h-5" />}
            </button>
          )}

          {validated && (
            <ResultPanel
              brands={round.brands}
              placements={placements}
              score={scores[scores.length - 1] ?? 0}
              isLast={isLast}
              onNext={nextRound}
              onFinish={finish}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Plane ────────────────────────────────────────────────────────────────
function Plane({
  brands,
  placements,
  validated,
  onPlace,
}: {
  brands: Brand[];
  placements: Record<string, Placement>;
  validated: boolean;
  onPlace: (id: string, p: Placement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!validated) return {};
    const m: Record<string, number> = {};
    brands.forEach((b) => {
      const p = placements[b.id];
      if (p) m[b.id] = matchScore(dist(p, b.target));
    });
    return m;
  }, [validated, brands, placements]);

  function pointToFraction(clientX: number, clientY: number): Placement {
    const rect = ref.current!.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1 - (clientY - rect.top) / rect.height; // axe Y inversé (haut = 1)
    return {
      x: Math.max(0.04, Math.min(0.96, x)),
      y: Math.max(0.04, Math.min(0.96, y)),
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || validated) return;
    onPlace(dragging, pointToFraction(e.clientX, e.clientY));
  }

  function startDrag(e: React.PointerEvent, id: string) {
    if (validated) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(id);
  }

  function onPointerUp() {
    setDragging(null);
  }

  return (
    <div className="relative">
      {/* Axes labels */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-snow/60">
        Qualité haute ↑
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-snow/60">
        ↓ Qualité basse
      </div>
      <div
        className="absolute top-1/2 -left-2 -translate-y-1/2 -rotate-90 origin-top-left font-mono text-[10px] uppercase tracking-widest text-snow/60 whitespace-nowrap"
        style={{ transform: "rotate(-90deg) translateX(-50%)" }}
      >
        ← Prix bas
      </div>
      <div
        className="absolute top-1/2 -right-2 -translate-y-1/2 rotate-90 origin-top-right font-mono text-[10px] uppercase tracking-widest text-snow/60 whitespace-nowrap"
        style={{ transform: "rotate(90deg) translateX(50%)" }}
      >
        Prix haut →
      </div>

      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative w-full aspect-square rounded-3xl border-2 select-none touch-none"
        style={{
          borderColor: ACCENT,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,77,109,0.04) 0%, transparent 60%), var(--night-soft)",
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-night-200/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-night-200/50" />
        </div>

        {/* Targets quand validé */}
        {validated &&
          brands.map((b) => (
            <div
              key={`t-${b.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${b.target.x * 100}%`,
                bottom: `${b.target.y * 100}%`,
                transform: "translate(-50%, 50%)",
              }}
            >
              <div className="w-3 h-3 rounded-full border-2 border-mint bg-night-200" />
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-wider text-mint whitespace-nowrap"
                style={{ color: "var(--mint)" }}
              >
                vraie pos.
              </div>
            </div>
          ))}

        {/* Brands placés */}
        {brands.map((b) => {
          const p = placements[b.id];
          if (!p) return null;
          const m = matches[b.id] ?? 0;
          const c = validated ? colorForMatch(m) : ACCENT;
          return (
            <motion.div
              key={b.id}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.y * 100}%`,
                transform: "translate(-50%, 50%)",
                cursor: validated ? "default" : "grab",
                touchAction: "none",
              }}
              onPointerDown={(e) => startDrag(e, b.id)}
            >
              <div
                className="px-3 py-1.5 rounded-full font-display font-bold text-sm border-2 whitespace-nowrap shadow-lg"
                style={{
                  borderColor: c,
                  color: c,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
                  boxShadow: `0 0 12px ${c}`,
                }}
              >
                {b.name}
                {validated && (
                  <span className="ml-2 font-mono text-[10px]">{m}%</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pool ─────────────────────────────────────────────────────────────────
function BrandsPool({
  brands,
  placements,
  onPlace,
}: {
  brands: Brand[];
  placements: Record<string, Placement>;
  onPlace: (id: string, p: Placement) => void;
}) {
  const unplaced = brands.filter((b) => !placements[b.id]);

  return (
    <div className="p-5 rounded-3xl border border-night-200 bg-night-soft">
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // Marques à placer
      </div>
      {unplaced.length === 0 ? (
        <p className="text-snow/60 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-mint" />
          Toutes placées. Tu peux ajuster.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {unplaced.map((b) => (
            <button
              key={b.id}
              onClick={() => onPlace(b.id, { x: 0.5, y: 0.5 })}
              className="px-3 py-1.5 rounded-full font-display font-bold text-sm border-2 transition-transform hover:scale-105"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                background: `${ACCENT}10`,
              }}
            >
              + {b.name}
            </button>
          ))}
        </div>
      )}
      <p className="mt-4 text-snow/50 text-xs">
        Clique pour placer au centre, puis drag dans le plan pour ajuster.
      </p>
    </div>
  );
}

// ─── Result panel ─────────────────────────────────────────────────────────
function ResultPanel({
  brands,
  placements,
  score,
  isLast,
  onNext,
  onFinish,
}: {
  brands: Brand[];
  placements: Record<string, Placement>;
  score: number;
  isLast: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className="p-5 rounded-3xl border-2 space-y-4"
      style={{ borderColor: ACCENT, background: `${ACCENT}10` }}
    >
      <div className="text-center">
        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-1"
          style={{ color: ACCENT }}
        >
          // Score de la manche
        </div>
        <div
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: "60px", color: colorForMatch(score) }}
        >
          {score}
          <span className="text-2xl text-snow/40">/100</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {brands.map((b) => {
          const p = placements[b.id];
          const m = p ? matchScore(dist(p, b.target)) : 0;
          return (
            <div
              key={b.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-snow/80">{b.name}</span>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: colorForMatch(m) }}
              >
                {m}%
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={isLast ? onFinish : onNext}
        className="w-full inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-6 py-3 rounded-2xl transition-transform hover:scale-[1.01]"
      >
        {isLast ? (
          <>
            Voir mes résultats
            <CheckCircle2 className="w-5 h-5" />
          </>
        ) : (
          <>
            Manche suivante
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
function computeSkills(scores: number[]) {
  let analyse = 0;
  scores.forEach((s) => {
    if (s >= 70) analyse += 30;
    else if (s >= 50) analyse += 20;
    else analyse += 10;
  });
  return {
    analyse: Math.min(100, analyse),
    communication: 30, // 10 par manche
    creativite: 15,    // 5 par manche
  };
}

// ─── Score badges en haut ─────────────────────────────────────────────────
function RoundsBadge({
  scores,
  total,
  current,
}: {
  scores: number[];
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const s = scores[i];
        const done = s !== undefined;
        const active = i === current;
        const c = done ? colorForMatch(s) : "var(--night-200)";
        return (
          <div
            key={i}
            className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest border"
            style={{
              borderColor: active && !done ? "var(--snow)" : c,
              color: done ? c : active ? "var(--snow)" : "var(--night-500)",
              background: done ? `${c}15` : "transparent",
            }}
          >
            {done ? `${s}` : `M${i + 1}`}
          </div>
        );
      })}
      {scores.length > 0 && (
        <button
          aria-label="Reset"
          className="ml-2 p-1.5 rounded-full border border-night-200 text-snow/40 hover:text-snow hover:border-snow transition-colors"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
