'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { useGameShell } from './game-shell-context';

const ACCENT = 'var(--pivot)';

type ZoneId = 'P' | 'E' | 'S' | 'T' | 'Eco' | 'L';

const ZONES: {
  id: ZoneId;
  letter: string;
  label: string;
  color: string;
}[] = [
  { id: 'P', letter: 'P', label: 'Politique', color: 'var(--sun)' },
  { id: 'E', letter: 'E', label: 'Économique', color: 'var(--pivot)' },
  { id: 'S', letter: 'S', label: 'Socioculturel', color: 'var(--coral)' },
  { id: 'T', letter: 'T', label: 'Technologique', color: 'var(--mint)' },
  { id: 'Eco', letter: 'É', label: 'Écologique', color: '#3B82F6' },
  { id: 'L', letter: 'L', label: 'Légal', color: '#E8732D' },
];

type Card = { id: string; text: string; expected: ZoneId };

type Round = { name: string; brief: string; cards: Card[] };

const ROUNDS: Round[] = [
  {
    name: 'Industrie pétrolière',
    brief: 'Le cas du PDF de Monica Scarano. Classe les 18 facteurs dans les 6 dimensions PESTEL.',
    cards: [
      { id: 'p1-1', text: 'Soutien gouvernemental', expected: 'P' },
      { id: 'p1-2', text: 'Pacte PME', expected: 'P' },
      { id: 'p1-3', text: 'Stabilité politique', expected: 'P' },
      { id: 'p1-4', text: 'Taxes TIPP', expected: 'E' },
      { id: 'p1-5', text: 'Taux de croissance économique', expected: 'E' },
      { id: 'p1-6', text: "Pouvoir d'achat des ménages", expected: 'E' },
      { id: 'p1-7', text: 'Demande croissante en énergie', expected: 'S' },
      { id: 'p1-8', text: 'Contexte RSE', expected: 'S' },
      { id: 'p1-9', text: 'Évolution du mode de vie', expected: 'S' },
      { id: 'p1-10', text: 'Nouvelles technos de captage', expected: 'T' },
      { id: 'p1-11', text: 'Énergies complémentaires', expected: 'T' },
      { id: 'p1-12', text: 'Découverte de gisements', expected: 'T' },
      { id: 'p1-13', text: 'Contrôle des GES', expected: 'Eco' },
      { id: 'p1-14', text: 'Épuisement des ressources', expected: 'Eco' },
      { id: 'p1-15', text: 'Prix du baril', expected: 'Eco' },
      { id: 'p1-16', text: 'Réglementation gaz à effet de serre', expected: 'L' },
      { id: 'p1-17', text: 'Réglementation HSE', expected: 'L' },
      { id: 'p1-18', text: 'Norme REACH', expected: 'L' },
    ],
  },
  {
    name: 'Industrie de la mode',
    brief: 'Fast-fashion, seconde main, RSE textile : 18 facteurs à classer.',
    cards: [
      { id: 'p2-1', text: 'Tarifs douaniers UE-Asie', expected: 'P' },
      { id: 'p2-2', text: 'Politiques anti-fast-fashion', expected: 'P' },
      { id: 'p2-3', text: 'Stabilité des zones de production', expected: 'P' },
      { id: 'p2-4', text: "Pouvoir d'achat des 15-25 ans", expected: 'E' },
      {
        id: 'p2-5',
        text: 'Inflation des matières premières (coton)',
        expected: 'E',
      },
      { id: 'p2-6', text: 'Taux de change €/Yuan', expected: 'E' },
      { id: 'p2-7', text: 'Tendance seconde main', expected: 'S' },
      { id: 'p2-8', text: 'Préoccupation éthique des conso', expected: 'S' },
      { id: 'p2-9', text: 'Influence des créateurs de contenu', expected: 'S' },
      { id: 'p2-10', text: 'E-commerce et marketplaces', expected: 'T' },
      {
        id: 'p2-11',
        text: "Cabines d'essayage en réalité augmentée",
        expected: 'T',
      },
      { id: 'p2-12', text: 'IA générative pour le design', expected: 'T' },
      { id: 'p2-13', text: 'Empreinte carbone textile', expected: 'Eco' },
      { id: 'p2-14', text: 'Recyclabilité des matières', expected: 'Eco' },
      {
        id: 'p2-15',
        text: 'Pollution aux micro-plastiques',
        expected: 'Eco',
      },
      { id: 'p2-16', text: 'Loi anti-gaspillage (AGEC)', expected: 'L' },
      {
        id: 'p2-17',
        text: 'Devoir de vigilance sur les fournisseurs',
        expected: 'L',
      },
      { id: 'p2-18', text: 'RGPD données client', expected: 'L' },
    ],
  },
  {
    name: 'Automobile électrique',
    brief: 'Tesla, Renault Mégane E-tech, BYD : un secteur en pleine bascule. 18 facteurs.',
    cards: [
      {
        id: 'p3-1',
        text: 'Politique de transition écologique',
        expected: 'P',
      },
      { id: 'p3-2', text: 'Subventions véhicules électriques', expected: 'P' },
      { id: 'p3-3', text: 'Géopolitique des terres rares', expected: 'P' },
      { id: 'p3-4', text: 'Coût des batteries lithium-ion', expected: 'E' },
      { id: 'p3-5', text: "Pouvoir d'achat des ménages", expected: 'E' },
      { id: 'p3-6', text: 'Croissance du PIB', expected: 'E' },
      {
        id: 'p3-7',
        text: 'Sensibilité écologique des conducteurs',
        expected: 'S',
      },
      { id: 'p3-8', text: 'Image de marque verte', expected: 'S' },
      { id: 'p3-9', text: 'Adoption des nouvelles mobilités', expected: 'S' },
      { id: 'p3-10', text: 'Densité énergétique des batteries', expected: 'T' },
      { id: 'p3-11', text: 'Réseau de bornes de recharge', expected: 'T' },
      { id: 'p3-12', text: 'Progrès de la conduite autonome', expected: 'T' },
      { id: 'p3-13', text: 'Empreinte CO₂ de production', expected: 'Eco' },
      { id: 'p3-14', text: 'Filière de recyclage des batteries', expected: 'Eco' },
      { id: 'p3-15', text: "Origine carbonée de l'électricité", expected: 'Eco' },
      { id: 'p3-16', text: 'Norme CAFE sur les émissions', expected: 'L' },
      { id: 'p3-17', text: 'Bonus / malus écologique', expected: 'L' },
      { id: 'p3-18', text: 'Zones à faibles émissions (ZFE)', expected: 'L' },
    ],
  },
];

type Assignments = Record<string, ZoneId | 'pool'>;

// ─── Component ─────────────────────────────────────────────────────────────
export default function PestelMatch() {
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

  useEffect(() => {
    const init: Assignments = {};
    round.cards.forEach((c) => (init[c.id] = 'pool'));
    setAssignments(init);
    setValidated(false);
  }, [roundIdx, round.cards]);

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over || validated) return;
    const cardId = e.active.id as string;
    const zoneId = e.over.id as ZoneId | 'pool';
    setAssignments((p) => ({ ...p, [cardId]: zoneId }));
  }

  const allPlaced = useMemo(
    () => round.cards.every((c) => assignments[c.id] && assignments[c.id] !== 'pool'),
    [round.cards, assignments],
  );

  function validate() {
    if (!allPlaced || validated) return;
    const correct = round.cards.filter((c) => assignments[c.id] === c.expected).length;
    const score = Math.round((correct / round.cards.length) * 100);
    setScores((s) => [...s, score]);
    setValidated(true);
  }

  function nextRound() {
    setRoundIdx((i) => i + 1);
  }

  function finish() {
    const finalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    shell.complete(
      {
        analyse: Math.min(100, Math.round(finalScore / 2 + 30)),
        rigueur: Math.min(100, Math.round(finalScore / 3 + 20)),
      },
      finalScore,
      { roundScores: scores },
    );
  }

  const pool = round.cards.filter((c) => !assignments[c.id] || assignments[c.id] === 'pool');

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="mb-5">
        <div
          className="font-mono text-[11px] uppercase tracking-widest mb-1"
          style={{ color: ACCENT }}
        >
          Manche {roundIdx + 1} / {ROUNDS.length} · {round.name}
        </div>
        <p className="text-snow/70 text-sm md:text-base max-w-3xl">{round.brief}</p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
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

        <Pool cards={pool} validated={validated} />

        <DragOverlay>
          {activeId ? (
            <CardPill text={round.cards.find((c) => c.id === activeId)?.text ?? ''} floating />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <RoundsBadge scores={scores} total={ROUNDS.length} current={roundIdx} />

        {!validated ? (
          <button
            onClick={validate}
            disabled={!allPlaced}
            className="inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-7 py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
            style={{
              boxShadow: allPlaced ? '0 0 24px var(--pivot)' : 'none',
            }}
          >
            {allPlaced ? 'Valider mon classement' : `Place encore ${pool.length}`}
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

function Zone({
  zone,
  cards,
  validated,
  roundCards,
}: {
  zone: { id: ZoneId; letter: string; label: string; color: string };
  cards: Card[];
  validated: boolean;
  roundCards: Card[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });
  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl border-2 p-2.5 min-h-[180px] transition-colors"
      style={{
        borderColor: isOver ? zone.color : 'var(--night-200)',
        background: isOver ? `${zone.color}14` : 'var(--night-soft)',
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="w-7 h-7 rounded-lg grid place-items-center font-display font-extrabold text-sm"
          style={{ background: `${zone.color}33`, color: zone.color }}
        >
          {zone.letter}
        </div>
        <div className="font-display font-bold text-xs leading-none">{zone.label}</div>
      </div>
      <div className="space-y-1.5">
        {cards.map((c) => {
          const correct = validated && roundCards.find((x) => x.id === c.id)?.expected === zone.id;
          return <DraggableCard key={c.id} card={c} validated={validated} correct={correct} />;
        })}
      </div>
    </div>
  );
}

function Pool({ cards, validated }: { cards: Card[]; validated: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });
  return (
    <div
      ref={setNodeRef}
      className="rounded-3xl border-2 border-dashed p-4 transition-colors"
      style={{
        borderColor: isOver ? ACCENT : 'var(--night-200)',
        background: isOver ? `${ACCENT}08` : 'transparent',
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // Facteurs à classer · {cards.length} restants
      </div>
      <div className="flex flex-wrap gap-2">
        {cards.map((c) => (
          <DraggableCard key={c.id} card={c} validated={validated} />
        ))}
        {cards.length === 0 && (
          <p className="text-snow/50 text-sm w-full text-center py-2">
            Tous classés. Vérifie ou valide.
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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    disabled: validated,
  });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardPill text={card.text} validated={validated} correct={correct} />
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
  let borderColor = 'var(--night-200)';
  let textColor = 'var(--snow)';
  if (validated) {
    if (correct) {
      borderColor = 'var(--mint)';
      textColor = 'var(--mint)';
    } else if (correct === false) {
      borderColor = 'var(--coral)';
      textColor = 'var(--coral)';
    }
  }
  return (
    <div
      className="px-2.5 py-1.5 rounded-xl border-2 text-xs leading-snug bg-night/80 select-none flex items-start gap-1.5"
      style={{
        borderColor,
        color: textColor,
        cursor: validated ? 'default' : 'grab',
        boxShadow: floating ? `0 20px 40px rgba(0,0,0,0.5), 0 0 16px ${ACCENT}` : undefined,
      }}
    >
      {validated && correct === true && (
        <Check className="w-3 h-3 shrink-0 mt-0.5" strokeWidth={2.5} />
      )}
      {validated && correct === false && (
        <X className="w-3 h-3 shrink-0 mt-0.5" strokeWidth={2.5} />
      )}
      <span>{text}</span>
    </div>
  );
}

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
  const c = score >= 75 ? 'var(--mint)' : score >= 50 ? 'var(--sun)' : 'var(--coral)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      className="flex items-center gap-4"
    >
      <div className="text-right">
        <div className="font-mono text-[10px] uppercase tracking-widest text-snow/50">Score</div>
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
        className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-6 py-4 rounded-2xl transition-transform hover:scale-[1.01]"
      >
        {isLast ? 'Voir mes résultats' : 'Manche suivante'}
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
            ? 'var(--mint)'
            : s >= 50
              ? 'var(--sun)'
              : 'var(--coral)'
          : 'var(--night-200)';
        return (
          <div
            key={i}
            className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest border"
            style={{
              borderColor: active && !done ? 'var(--snow)' : c,
              color: done ? c : active ? 'var(--snow)' : 'var(--night-500)',
              background: done ? `${c}15` : 'transparent',
            }}
          >
            {done ? `${s}` : `M${i + 1}`}
          </div>
        );
      })}
    </div>
  );
}
