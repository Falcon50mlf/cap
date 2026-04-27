"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, RotateCcw, ChevronRight } from "lucide-react";
import { useGameShell } from "./game-shell-context";

const ACCENT = "var(--pivot)";

// ─── Arbre de décision commun aux 5 cas ───────────────────────────────────
type NodeId =
  | "q1"
  | "q2-solo"
  | "q2-multi"
  | "q3"
  | "EI"
  | "EURL"
  | "SARL"
  | "SAS"
  | "SCOP"
  | "SNC";

type Question = {
  question: string;
  choices: { label: string; goto: NodeId; sub?: string }[];
};

type Result = {
  statut: NodeId;
  description: string;
};

const NODES: Record<NodeId, Question | Result> = {
  q1: {
    question: "Combien d'apporteurs ?",
    choices: [
      { label: "1 seul·e", goto: "q2-solo" },
      { label: "Plusieurs", goto: "q2-multi" },
    ],
  },
  "q2-solo": {
    question: "Veut-il/elle séparer son patrimoine pro et perso ?",
    choices: [
      {
        label: "Non, patrimoines confondus",
        goto: "EI",
        sub: "Pas besoin de société",
      },
      {
        label: "Oui, patrimoine séparé",
        goto: "EURL",
        sub: "Une société à 1 associé",
      },
    ],
  },
  "q2-multi": {
    question: "Quel niveau de responsabilité ?",
    choices: [
      {
        label: "Limitée aux apports",
        goto: "q3",
        sub: "Patrimoine perso protégé",
      },
      {
        label: "Illimitée sur patrimoine perso",
        goto: "SNC",
        sub: "Plus risqué, rare aujourd'hui",
      },
    ],
  },
  q3: {
    question: "Quel cadre de gouvernance ?",
    choices: [
      {
        label: "Cadre rigide / familial",
        goto: "SARL",
        sub: "Bon pour PME, transmission",
      },
      {
        label: "Liberté statutaire / levée de fonds",
        goto: "SAS",
        sub: "Le standard startup",
      },
      {
        label: "Démocratique (salariés majoritaires)",
        goto: "SCOP",
        sub: "1 personne = 1 voix",
      },
    ],
  },
  EI: {
    statut: "EI",
    description:
      "Entreprise Individuelle. Pas de personne morale, fiscalité simple, mais patrimoines confondus.",
  },
  EURL: {
    statut: "EURL",
    description:
      "Société Unipersonnelle. 1 seul associé, patrimoine séparé, responsabilité limitée aux apports.",
  },
  SARL: {
    statut: "SARL",
    description:
      "Société à Responsabilité Limitée. Cadre rigide rassurant, idéal pour PME et transmissions familiales.",
  },
  SAS: {
    statut: "SAS",
    description:
      "Société par Actions Simplifiée. Statuts ultra-libres, le standard des startups et investisseurs.",
  },
  SCOP: {
    statut: "SCOP",
    description:
      "Société Coopérative et Participative. Salariés associés majoritaires, gouvernance démocratique.",
  },
  SNC: {
    statut: "SNC",
    description:
      "Société en Nom Collectif. Responsabilité illimitée et solidaire — peu recommandée aujourd'hui.",
  },
};

function isResult(node: Question | Result): node is Result {
  return "statut" in node;
}

// ─── 5 cas ────────────────────────────────────────────────────────────────
type Case = {
  name: string;
  profile: string;
  expected: NodeId;
  emoji?: string;
};

const CASES: Case[] = [
  {
    name: "Léa",
    profile:
      "Lance son atelier de céramique seule. Faible investissement, peu de risques. Veut commencer simple, sans paperasse.",
    expected: "EI",
  },
  {
    name: "Marc",
    profile:
      "Co-fondateur d'une startup tech avec 3 autres associés. Va lever des fonds dans 6 mois. Veut des statuts flexibles pour accueillir des investisseurs.",
    expected: "SAS",
  },
  {
    name: "Sophie",
    profile:
      "Consultante en stratégie, seule. Travaille avec de gros clients et veut absolument séparer son patrimoine pro de son patrimoine perso.",
    expected: "EURL",
  },
  {
    name: "Famille Dupont",
    profile:
      "Le restaurant familial est repris par les 4 enfants. Cadre stable, gestion classique, transmission progressive prévue.",
    expected: "SARL",
  },
  {
    name: "Collectif Code",
    profile:
      "8 développeur·ses montent une boîte ensemble. Veulent une gouvernance démocratique : 1 personne = 1 voix, salariés associés majoritaires.",
    expected: "SCOP",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function StatutQuiz() {
  const shell = useGameShell();
  const [roundIdx, setRoundIdx] = useState(0);
  const [path, setPath] = useState<NodeId[]>(["q1"]);
  const [validated, setValidated] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const round = CASES[roundIdx]!; // safe: roundIdx in [0, CASES.length)
  const currentNodeId = path[path.length - 1] ?? "q1";
  const currentNode = NODES[currentNodeId];
  const atResult = isResult(currentNode);
  const isLast = roundIdx === CASES.length - 1;

  useEffect(() => {
    shell.setRound(roundIdx + 1);
  }, [roundIdx, shell]);

  function choose(goto: NodeId) {
    if (validated) return;
    setPath((p) => [...p, goto]);
  }

  function back() {
    if (validated) return;
    if (path.length > 1) setPath((p) => p.slice(0, -1));
  }

  function validate() {
    if (!atResult || validated) return;
    const result = currentNode as Result;
    const correct = result.statut === round.expected;
    setScores((s) => [...s, correct]);
    setValidated(true);
  }

  function nextRound() {
    if (isLast) {
      finish();
      return;
    }
    setRoundIdx((i) => i + 1);
    setPath(["q1"]);
    setValidated(false);
  }

  function finish() {
    const correctCount = scores.filter(Boolean).length;
    const finalScore = Math.round((correctCount / CASES.length) * 100);
    shell.complete(
      {
        analyse: Math.min(100, correctCount * 25),
        rigueur: Math.min(100, correctCount * 20),
      },
      finalScore,
      { results: scores },
    );
  }

  const breadcrumb = path
    .slice(0, -1)
    .map((id, i) => {
      const node = NODES[id];
      if (isResult(node)) return null;
      const choiceLabel = path[i + 1];
      const choice = node.choices.find((c) => c.goto === choiceLabel);
      return choice?.label;
    })
    .filter(Boolean);

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Profile */}
      <div
        className="rounded-3xl p-6 md:p-7 border-l-4 mb-5 bg-night-soft"
        style={{ borderLeftColor: ACCENT }}
      >
        <div
          className="font-mono text-[11px] uppercase tracking-widest mb-2"
          style={{ color: ACCENT }}
        >
          // Cas {roundIdx + 1} / {CASES.length} · {round.name}
        </div>
        <p className="text-snow/85 text-base md:text-lg leading-relaxed">
          {round.profile}
        </p>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5 text-xs text-snow/60">
          {breadcrumb.map((label, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-night-soft border border-night-200">
                {label}
              </span>
              <ChevronRight className="w-3 h-3" />
            </span>
          ))}
        </div>
      )}

      {/* Current question or result */}
      {!atResult ? (
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="rounded-3xl p-6 md:p-7 border-2"
          style={{ borderColor: ACCENT, background: `${ACCENT}08` }}
        >
          <div
            className="font-mono text-[10px] uppercase tracking-widest mb-3"
            style={{ color: ACCENT }}
          >
            // Question
          </div>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl mb-6 leading-tight">
            {(currentNode as Question).question}
          </h3>
          <div className="space-y-2.5">
            {(currentNode as Question).choices.map((c) => (
              <button
                key={c.goto}
                onClick={() => choose(c.goto)}
                className="w-full text-left rounded-2xl p-4 border-2 transition-all hover:scale-[1.01] hover:border-snow"
                style={{
                  borderColor: "var(--night-200)",
                  background: "var(--night-soft)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl grid place-items-center font-display font-bold shrink-0"
                    style={{ background: `${ACCENT}1f`, color: ACCENT }}
                  >
                    →
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-snow text-base md:text-lg leading-tight">
                      {c.label}
                    </div>
                    {c.sub && (
                      <div className="text-snow/60 text-sm mt-0.5">{c.sub}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {path.length > 1 && (
            <button
              onClick={back}
              className="mt-5 inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Revenir en arrière
            </button>
          )}
        </motion.div>
      ) : (
        <ResultPanel
          result={currentNode as Result}
          expected={round.expected}
          validated={validated}
          isLast={isLast}
          onValidate={validate}
          onNext={nextRound}
          onRetry={() => {
            setPath(["q1"]);
          }}
        />
      )}

      {/* Score badges */}
      <div className="mt-6 flex items-center gap-1.5 justify-center">
        {Array.from({ length: CASES.length }).map((_, i) => {
          const result = scores[i];
          const active = i === roundIdx;
          const done = result !== undefined;
          const c = done
            ? result
              ? "var(--mint)"
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
              Cas {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultPanel({
  result,
  expected,
  validated,
  isLast,
  onValidate,
  onNext,
  onRetry,
}: {
  result: Result;
  expected: NodeId;
  validated: boolean;
  isLast: boolean;
  onValidate: () => void;
  onNext: () => void;
  onRetry: () => void;
}) {
  const isCorrect = validated && result.statut === expected;
  const isWrong = validated && result.statut !== expected;
  const expectedNode = NODES[expected] as Result;

  return (
    <motion.div
      key={validated ? "validated" : "preview"}
      initial={{ opacity: 0, y: 10 }}
      animate={
        isWrong
          ? { x: [0, -8, 8, -6, 6, 0], opacity: 1, y: 0 }
          : { opacity: 1, y: 0 }
      }
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      className="rounded-3xl p-7 border-2"
      style={{
        borderColor: validated
          ? isCorrect
            ? "var(--mint)"
            : "var(--coral)"
          : ACCENT,
        background: validated
          ? isCorrect
            ? "rgba(0,212,168,0.1)"
            : "rgba(230,52,98,0.1)"
          : `${ACCENT}10`,
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-2"
        style={{
          color: validated
            ? isCorrect
              ? "var(--mint)"
              : "var(--coral)"
            : ACCENT,
        }}
      >
        // Ta proposition
      </div>
      <div
        className="font-display font-extrabold leading-none mb-3"
        style={{
          fontSize: "clamp(48px, 8vw, 96px)",
          color: validated
            ? isCorrect
              ? "var(--mint)"
              : "var(--coral)"
            : ACCENT,
        }}
      >
        {result.statut}
      </div>
      <p className="text-snow/80 leading-relaxed mb-6">{result.description}</p>

      {validated && isWrong && (
        <div className="rounded-2xl p-4 border-2 border-mint/40 bg-mint/10 mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-mint mb-2">
            // Bonne réponse attendue
          </div>
          <div className="flex items-baseline gap-3">
            <div
              className="font-display font-extrabold text-3xl"
              style={{ color: "var(--mint)" }}
            >
              {expectedNode.statut}
            </div>
            <div className="text-snow/75 text-sm leading-snug">
              {expectedNode.description}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {!validated && (
          <>
            <button
              onClick={onValidate}
              className="inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl transition-transform hover:scale-[1.02]"
              style={{ boxShadow: "0 0 16px var(--pivot)" }}
            >
              Valider {result.statut}
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 border border-night-200 text-snow/80 font-semibold px-6 py-3 rounded-2xl hover:bg-night-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer le cas
            </button>
          </>
        )}
        {validated && (
          <button
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl transition-transform hover:scale-[1.02]"
          >
            {isLast ? "Voir mes résultats" : "Cas suivant"}
            {isLast ? (
              <Check className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {validated && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {isCorrect ? (
            <>
              <Check
                className="w-5 h-5"
                style={{ color: "var(--mint)" }}
                strokeWidth={2.5}
              />
              <span className="text-mint font-semibold">
                Bonne réponse !
              </span>
            </>
          ) : (
            <>
              <X
                className="w-5 h-5"
                style={{ color: "var(--coral)" }}
                strokeWidth={2.5}
              />
              <span className="text-coral font-semibold">Pas tout à fait.</span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
