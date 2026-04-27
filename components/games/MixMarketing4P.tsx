"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Box,
  Tag,
  MapPin,
  Megaphone,
} from "lucide-react";
import { useGameShell } from "./game-shell-context";

// ─── Données ──────────────────────────────────────────────────────────────
type ZoneId = "produit" | "prix" | "place" | "promo";

const ZONES: { id: ZoneId; label: string; sub: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "produit", label: "Produit", sub: "Ce que tu vends", Icon: Box },
  { id: "prix", label: "Prix", sub: "Combien et comment", Icon: Tag },
  { id: "place", label: "Place", sub: "Où on l'achète", Icon: MapPin },
  { id: "promo", label: "Promotion", sub: "Comment on en parle", Icon: Megaphone },
];

type Card = { id: string; text: string; expected: ZoneId };

type Round = {
  brand: string;
  brief: string;
  cards: Card[];
};

const ROUNDS: Round[] = [
  {
    brand: "Apple iPhone",
    brief:
      "Tu pilotes le mix marketing du prochain iPhone. Place les 12 décisions stratégiques dans la bonne case des 4P.",
    cards: [
      { id: "a1", text: "Boîtier en aluminium recyclé", expected: "produit" },
      { id: "a2", text: "OS propriétaire iOS développé en interne", expected: "produit" },
      { id: "a3", text: "Capteurs photo conçus par Apple", expected: "produit" },
      { id: "a4", text: "Prix premium aligné sur le haut de gamme", expected: "prix" },
      { id: "a5", text: "Programme de reprise pour réduire le ticket ressenti", expected: "prix" },
      { id: "a6", text: "Paiement échelonné sans frais sur 24 mois", expected: "prix" },
      { id: "a7", text: "Apple Stores premium avec démos", expected: "place" },
      { id: "a8", text: "Distribution sélective chez les opérateurs", expected: "place" },
      { id: "a9", text: "Configurateur en ligne sur apple.com", expected: "place" },
      { id: "a10", text: "Keynote annuel diffusé en streaming", expected: "promo" },
      { id: "a11", text: "Spots TV centrés sur la photo / vidéo", expected: "promo" },
      { id: "a12", text: "Partenariats avec créateurs de contenu", expected: "promo" },
    ],
  },
  {
    brand: "Decathlon",
    brief:
      "Decathlon fête ses 50 ans. Place les 12 décisions du mix dans la bonne case.",
    cards: [
      { id: "d1", text: "Marques propres (Quechua, B'Twin, Domyos)", expected: "produit" },
      { id: "d2", text: "Conception durable, garantie longue durée", expected: "produit" },
      { id: "d3", text: "Tests sur le terrain par des sportifs amateurs", expected: "produit" },
      { id: "d4", text: "Prix d'appel agressifs sur les essentiels", expected: "prix" },
      { id: "d5", text: "Affichage du coût de revient sur certains produits", expected: "prix" },
      { id: "d6", text: "Promos réservées aux membres fidélité", expected: "prix" },
      { id: "d7", text: "Magasins XL en périphérie de ville", expected: "place" },
      { id: "d8", text: "Click & collect avec retrait en magasin", expected: "place" },
      { id: "d9", text: "Marketplace decathlon.fr", expected: "place" },
      { id: "d10", text: "Sponsoring de clubs sportifs locaux", expected: "promo" },
      { id: "d11", text: "Catalogue saisonnier mis en avant en rayon", expected: "promo" },
      { id: "d12", text: "Campagnes social calées sur les saisons sportives", expected: "promo" },
    ],
  },
  {
    brand: "Lush",
    brief:
      "Lush, cosmétiques éthiques. Place les 12 décisions du mix dans la bonne case.",
    cards: [
      { id: "l1", text: "Ingrédients naturels, lutte contre les emballages plastique", expected: "produit" },
      { id: "l2", text: "Gamme 'naked' sans aucun emballage", expected: "produit" },
      { id: "l3", text: "Certifications végan et cruelty-free", expected: "produit" },
      { id: "l4", text: "Prix moyen-haut justifié par les valeurs", expected: "prix" },
      { id: "l5", text: "Pas de promotion permanente (anti-bradage)", expected: "prix" },
      { id: "l6", text: "Programme fidélité = produits offerts", expected: "prix" },
      { id: "l7", text: "Boutiques propres avec mise en scène olfactive", expected: "place" },
      { id: "l8", text: "Vente directe sur lush.com (pas de revendeur)", expected: "place" },
      { id: "l9", text: "Pop-up stores éphémères en périodes de fête", expected: "place" },
      { id: "l10", text: "Communication centrée sur les causes et l'activisme", expected: "promo" },
      { id: "l11", text: "Vidéos virales 'comment c'est fait'", expected: "promo" },
      { id: "l12", text: "Pas de pub TV, bouche à oreille uniquement", expected: "promo" },
    ],
  },
];

const ACCENT = "var(--family-marketing)";
type Assignments = Record<string, ZoneId | "pool">;

// ─── Component ─────────────────────────────────────────────────────────────
export default function MixMarketing4P() {
  const shell = useGameShell();
  const [roundIdx, setRoundIdx] = useState(0);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [validated, setValidated] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const round = ROUNDS[roundIdx]!; // safe: roundIdx in [0, ROUNDS.length)
  const isLast = roundIdx === ROUNDS.length - 1;

  useEffect(() => {
    shell.setRound(roundIdx + 1);
  }, [roundIdx, shell]);

  // Initialize: all cards in pool
  useEffect(() => {
    const init: Assignments = {};
    round.cards.forEach((c) => (init[c.id] = "pool"));
    setAssignments(init);
    setValidated(false);
  }, [roundIdx, round.cards]);

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over || validated) return;
    const cardId = e.active.id as string;
    const zoneId = e.over.id as ZoneId | "pool";
    setAssignments((prev) => ({ ...prev, [cardId]: zoneId }));
  }

  const allPlaced = useMemo(
    () =>
      round.cards.every(
        (c) => assignments[c.id] && assignments[c.id] !== "pool",
      ),
    [round.cards, assignments],
  );

  function validate() {
    if (!allPlaced || validated) return;
    const correct = round.cards.filter(
      (c) => assignments[c.id] === c.expected,
    ).length;
    const score = Math.round((correct / round.cards.length) * 100);
    setScores((prev) => [...prev, score]);
    setValidated(true);
  }

  function nextRound() {
    setRoundIdx((i) => i + 1);
  }

  function finish() {
    const finalScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );
    const skills = computeSkills(scores);
    shell.complete(skills, finalScore, { roundScores: scores });
  }

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="mb-5">
        <div
          className="font-mono text-[11px] uppercase tracking-widest mb-1"
          style={{ color: ACCENT }}
        >
          Manche {roundIdx + 1} / {ROUNDS.length} · {round.brand}
        </div>
        <p className="text-snow/70 text-sm md:text-base max-w-3xl">
          {round.brief}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {/* 4 zones */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {ZONES.map((z) => (
            <Zone
              key={z.id}
              zone={z}
              cards={round.cards.filter((c) => assignments[c.id] === z.id)}
              validated={validated}
              roundCards={round.cards}
            />
          ))}
        </div>

        {/* Pool */}
        <Pool
          cards={round.cards.filter((c) => !assignments[c.id] || assignments[c.id] === "pool")}
          validated={validated}
        />

        <DragOverlay>
          {activeId ? (
            <CardPill
              text={round.cards.find((c) => c.id === activeId)?.text ?? ""}
              floating
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <RoundsBadge scores={scores} total={ROUNDS.length} current={roundIdx} />

        {!validated ? (
          <button
            onClick={validate}
            disabled={!allPlaced}
            className="inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-7 py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
            style={{ boxShadow: allPlaced ? "0 0 24px var(--sun)" : "none" }}
          >
            {allPlaced
              ? "Valider mon classement"
              : `Place encore ${round.cards.length - round.cards.filter((c) => assignments[c.id] && assignments[c.id] !== "pool").length}`}
            {allPlaced && <ArrowRight className="w-5 h-5" />}
          </button>
        ) : (
          <ResultActions
            score={scores[scores.length - 1] ?? 0}
            isLast={isLast}
            onNext={nextRound}
            onFinish={finish}
          />
        )}
      </div>
    </div>
  );
}

// ─── Zones / Pool / Cards ─────────────────────────────────────────────────
function Zone({
  zone,
  cards,
  validated,
  roundCards,
}: {
  zone: { id: ZoneId; label: string; sub: string; Icon: React.ComponentType<{ className?: string }> };
  cards: Card[];
  validated: boolean;
  roundCards: Card[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });
  const Icon = zone.Icon;

  return (
    <div
      ref={setNodeRef}
      className="rounded-3xl border-2 p-3 min-h-[200px] transition-colors"
      style={{
        borderColor: isOver ? ACCENT : "var(--night-200)",
        background: isOver ? `${ACCENT}10` : "var(--night-soft)",
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className="w-8 h-8 rounded-xl grid place-items-center"
          style={{ background: `${ACCENT}1f`, color: ACCENT }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-base leading-none">
            {zone.label}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-snow/50 mt-1">
            {zone.sub}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {cards.map((c) => {
          const correct = validated && roundCards.find((x) => x.id === c.id)?.expected === zone.id;
          return (
            <DraggableCard
              key={c.id}
              card={c}
              validated={validated}
              correct={correct}
            />
          );
        })}
        {cards.length === 0 && (
          <div className="font-mono text-[10px] uppercase tracking-widest text-night-500 text-center py-6">
            Glisse ici
          </div>
        )}
      </div>
    </div>
  );
}

function Pool({ cards, validated }: { cards: Card[]; validated: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });

  return (
    <div
      ref={setNodeRef}
      className="rounded-3xl border-2 border-dashed p-4 transition-colors"
      style={{
        borderColor: isOver ? ACCENT : "var(--night-200)",
        background: isOver ? `${ACCENT}08` : "transparent",
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // Cartes à classer · {cards.length} restante{cards.length !== 1 ? "s" : ""}
      </div>
      <div className="flex flex-wrap gap-2">
        {cards.map((c) => (
          <DraggableCard key={c.id} card={c} validated={validated} />
        ))}
        {cards.length === 0 && (
          <p className="text-snow/50 text-sm w-full text-center py-3">
            Toutes les cartes sont placées. Vérifie ou valide.
          </p>
        )}
      </div>
    </div>
  );
}

function DraggableCard({
  card,
  validated,
  correct,
}: {
  card: Card;
  validated: boolean;
  correct?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id, disabled: validated });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardPill
        text={card.text}
        validated={validated}
        correct={correct}
      />
    </div>
  );
}

function CardPill({
  text,
  validated,
  correct,
  floating,
}: {
  text: string;
  validated?: boolean;
  correct?: boolean;
  floating?: boolean;
}) {
  let borderColor = "var(--night-200)";
  let textColor = "var(--snow)";
  if (validated) {
    if (correct === true) {
      borderColor = "var(--mint)";
      textColor = "var(--mint)";
    } else if (correct === false) {
      borderColor = "var(--coral)";
      textColor = "var(--coral)";
    }
  }

  return (
    <div
      className="px-3 py-2 rounded-2xl border-2 text-sm leading-snug bg-night-soft cursor-grab active:cursor-grabbing select-none flex items-start gap-2"
      style={{
        borderColor,
        color: textColor,
        boxShadow: floating
          ? `0 20px 40px rgba(0,0,0,0.5), 0 0 16px ${ACCENT}`
          : undefined,
        cursor: validated ? "default" : "grab",
      }}
    >
      {validated && correct === true && (
        <Check className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      {validated && correct === false && (
        <X className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <span>{text}</span>
    </div>
  );
}

// ─── Result actions ───────────────────────────────────────────────────────
function ResultActions({
  score,
  isLast,
  onNext,
  onFinish,
}: {
  score: number;
  isLast: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  const c = score >= 75 ? "var(--mint)" : score >= 50 ? "var(--sun)" : "var(--coral)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className="flex items-center gap-4"
    >
      <div className="text-right">
        <div className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
          Score
        </div>
        <div
          className="font-display font-extrabold text-3xl tracking-tight leading-none"
          style={{ color: c }}
        >
          {score}
          <span className="text-base text-snow/40">/100</span>
        </div>
      </div>
      <button
        onClick={isLast ? onFinish : onNext}
        className="inline-flex items-center gap-2 bg-sun text-night font-bold px-6 py-4 rounded-2xl transition-transform hover:scale-[1.01]"
      >
        {isLast ? "Voir mes résultats" : "Manche suivante"}
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

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
        const c = done
          ? s >= 75
            ? "var(--mint)"
            : s >= 50
              ? "var(--sun)"
              : "var(--coral)"
          : "var(--night-200)";
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
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
function computeSkills(scores: number[]) {
  let analyse = 0;
  scores.forEach((s) => {
    if (s >= 80) analyse += 25;
    else if (s >= 60) analyse += 15;
    else analyse += 5;
  });
  return {
    analyse: Math.min(100, analyse),
    creativite: 15, // 5 par manche
    strategie: Math.min(100, scores.reduce((a, b) => a + b, 0) / scores.length / 2 + 30),
  };
}
