"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useGameShell } from "./game-shell-context";

const ACCENT = "var(--pivot)";

// ─── Types ────────────────────────────────────────────────────────────────
type SegmentationCat = "principal" | "support" | "environnant" | "aucun";
type ClientCat = "NCR" | "NCA" | "CA" | "CP";

type EpreuveA = {
  intro: string;
  items: { id: string; label: string; expected: SegmentationCat }[];
};

type EpreuveB = {
  intro: string;
  items: { id: string; profile: string; expected: ClientCat }[];
};

type EpreuveC = {
  question: string;
  options: { value: number; correct?: boolean }[];
  unit: string;
};

type Round = {
  brand: string;
  context: string;
  A: EpreuveA;
  B: EpreuveB;
  C: EpreuveC;
};

const SEG_LABELS: Record<SegmentationCat, string> = {
  principal: "Marché principal",
  support: "Marché support",
  environnant: "Marché environnant",
  aucun: "Hors marché",
};

const CLIENT_LABELS: Record<ClientCat, string> = {
  NCR: "NCR — Non-conso relatif",
  NCA: "NCA — Non-conso absolu",
  CA: "CA — Consommateur actuel",
  CP: "CP — Consommateur potentiel",
};

// ─── Données : 3 manches ──────────────────────────────────────────────────
const ROUNDS: Round[] = [
  {
    brand: "Peugeot",
    context:
      "Peugeot fabrique et vend des voitures particulières (308, 3008…). Réfléchis à son marché.",
    A: {
      intro: "Pour chaque produit, identifie le type de marché vis-à-vis de Peugeot.",
      items: [
        { id: "a1-1", label: "Voitures particulières neuves", expected: "principal" },
        { id: "a1-2", label: "Stations-service essence/diesel", expected: "support" },
        {
          id: "a1-3",
          label: "Garages et entretien automobile",
          expected: "support",
        },
        { id: "a1-4", label: "Train SNCF", expected: "environnant" },
        { id: "a1-5", label: "Vélo électrique", expected: "environnant" },
        { id: "a1-6", label: "Smartphone Samsung", expected: "aucun" },
      ],
    },
    B: {
      intro: "Classe ces 4 profils dans les bonnes catégories de consommateurs.",
      items: [
        {
          id: "b1-1",
          profile:
            "Étudiante 22 ans, vient d'avoir le permis, économise pour s'acheter sa première voiture",
          expected: "NCR",
        },
        {
          id: "b1-2",
          profile:
            "Habitant de Paris intra-muros, refuse de posséder une voiture pour des raisons écologiques",
          expected: "NCA",
        },
        {
          id: "b1-3",
          profile:
            "Famille de 4 personnes en banlieue, conduit une Peugeot 3008 depuis 4 ans",
          expected: "CA",
        },
        {
          id: "b1-4",
          profile:
            "Cadre commercial qui roule actuellement en Renault Mégane mais hésite à changer",
          expected: "CP",
        },
      ],
    },
    C: {
      question:
        "Peugeot a réalisé 45 M€ de CA en France. Le marché auto français pèse 300 M€. Quelle est sa part de marché ?",
      options: [
        { value: 6.7 },
        { value: 15, correct: true },
        { value: 20 },
        { value: 30 },
      ],
      unit: "%",
    },
  },
  {
    brand: "Decathlon",
    context:
      "Decathlon vend des articles de sport accessibles, en magasins et online.",
    A: {
      intro:
        "Pour chaque produit, identifie le type de marché vis-à-vis de Decathlon.",
      items: [
        { id: "a2-1", label: "Vêtements et matériel de sport", expected: "principal" },
        {
          id: "a2-2",
          label: "Coachs sportifs en ligne (apps fitness)",
          expected: "support",
        },
        { id: "a2-3", label: "Salles de sport partenaires", expected: "support" },
        { id: "a2-4", label: "Friperie / seconde main sport", expected: "environnant" },
        {
          id: "a2-5",
          label: "Activités outdoor gratuites (course, rando)",
          expected: "environnant",
        },
        { id: "a2-6", label: "Restaurant gastronomique", expected: "aucun" },
      ],
    },
    B: {
      intro: "Classe ces 4 profils.",
      items: [
        {
          id: "b2-1",
          profile:
            "Adolescent qui veut commencer le foot mais ses parents trouvent ça trop cher",
          expected: "NCR",
        },
        {
          id: "b2-2",
          profile:
            "Personne âgée à mobilité très réduite, ne fait aucun sport et ne le pourra plus jamais",
          expected: "NCA",
        },
        {
          id: "b2-3",
          profile:
            "Coureur amateur qui achète tous ses équipements chez Decathlon depuis des années",
          expected: "CA",
        },
        {
          id: "b2-4",
          profile:
            "Pratiquante de yoga qui achète actuellement chez Lululemon mais trouve ça cher",
          expected: "CP",
        },
      ],
    },
    C: {
      question:
        "Decathlon France pèse 4,5 Mrd€ de CA. Le marché du sport en France est estimé à 12 Mrd€. Sa part de marché ?",
      options: [
        { value: 25 },
        { value: 37.5, correct: true },
        { value: 50 },
        { value: 12 },
      ],
      unit: "%",
    },
  },
  {
    brand: "Netflix",
    context:
      "Netflix est un service de streaming vidéo par abonnement (séries, films, docus).",
    A: {
      intro: "Pour chaque produit, identifie le type de marché vis-à-vis de Netflix.",
      items: [
        {
          id: "a3-1",
          label: "Plateforme de streaming par abonnement",
          expected: "principal",
        },
        { id: "a3-2", label: "Box internet rapide", expected: "support" },
        { id: "a3-3", label: "Smart TV avec apps préinstallées", expected: "support" },
        { id: "a3-4", label: "Cinémas en salle (Pathé, UGC)", expected: "environnant" },
        { id: "a3-5", label: "Jeux vidéo (Steam, PS5)", expected: "environnant" },
        { id: "a3-6", label: "Eau minérale", expected: "aucun" },
      ],
    },
    B: {
      intro: "Classe ces 4 profils.",
      items: [
        {
          id: "b3-1",
          profile:
            "Lycéenne qui adore les séries mais ne paye rien, regarde sur le compte de sa cousine",
          expected: "NCR",
        },
        {
          id: "b3-2",
          profile:
            "Personne sans Internet ni TV connectée, ne consomme que la radio FM",
          expected: "NCA",
        },
        {
          id: "b3-3",
          profile:
            "Couple parisien abonné à Netflix Premium depuis 5 ans, regarde 10h/semaine",
          expected: "CA",
        },
        {
          id: "b3-4",
          profile:
            "Étudiant abonné uniquement à Disney+ pour Marvel, jamais essayé Netflix",
          expected: "CP",
        },
      ],
    },
    C: {
      question:
        "Netflix compte 10 M d'abonnés en France. La population française adulte est de 50 M. Quel est son taux de pénétration ?",
      options: [
        { value: 5 },
        { value: 20, correct: true },
        { value: 50 },
        { value: 10 },
      ],
      unit: "%",
    },
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
type Phase = "A" | "B" | "C" | "result";

export default function MarketRadar() {
  const shell = useGameShell();
  const [roundIdx, setRoundIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("A");
  const [aAns, setAAns] = useState<Record<string, SegmentationCat>>({});
  const [bAns, setBAns] = useState<Record<string, ClientCat>>({});
  const [cAns, setCAns] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const round = ROUNDS[roundIdx]!; // safe: roundIdx in [0, ROUNDS.length)
  const isLast = roundIdx === ROUNDS.length - 1;

  useEffect(() => {
    shell.setRound(roundIdx + 1);
  }, [roundIdx, shell]);

  function resetRound() {
    setPhase("A");
    setAAns({});
    setBAns({});
    setCAns(null);
    setValidated(false);
  }

  function validate() {
    if (validated) return;
    let aOk = 0,
      bOk = 0,
      cOk = 0;
    round.A.items.forEach((it) => {
      if (aAns[it.id] === it.expected) aOk++;
    });
    round.B.items.forEach((it) => {
      if (bAns[it.id] === it.expected) bOk++;
    });
    const cExpected = round.C.options.find((o) => o.correct)?.value;
    if (cAns === cExpected) cOk = 1;

    const total = round.A.items.length + round.B.items.length + 1;
    const correct = aOk + bOk + cOk;
    const score = Math.round((correct / total) * 100);
    setScores((s) => [...s, score]);
    setValidated(true);
    setPhase("result");
  }

  function nextRound() {
    setRoundIdx((i) => i + 1);
    resetRound();
  }

  function finish() {
    const final = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );
    shell.complete(
      {
        analyse: Math.min(100, Math.round(final / 2 + 30)),
        rigueur: Math.min(100, Math.round(final / 3 + 25)),
        communication: 30,
      },
      final,
      { roundScores: scores },
    );
  }

  // Compute completion per phase to enable "next" button
  const aDone = round.A.items.every((it) => aAns[it.id]);
  const bDone = round.B.items.every((it) => bAns[it.id]);
  const cDone = cAns !== null;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header round */}
      <div className="rounded-3xl p-5 md:p-6 border-l-4 mb-5 bg-night-soft" style={{ borderLeftColor: ACCENT }}>
        <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
          // Manche {roundIdx + 1} / {ROUNDS.length} · {round.brand}
        </div>
        <p className="text-snow/85 text-base md:text-lg leading-relaxed">
          {round.context}
        </p>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 mb-5">
        {(["A", "B", "C"] as Phase[]).map((p) => {
          const isActive = p === phase && !validated;
          const done = p === "A" ? aDone : p === "B" ? bDone : cDone;
          return (
            <button
              key={p}
              onClick={() => !validated && setPhase(p)}
              disabled={validated}
              className="px-4 py-2 rounded-2xl border-2 font-display font-semibold text-sm transition-colors"
              style={{
                borderColor: isActive ? ACCENT : done ? "var(--mint)" : "var(--night-200)",
                background: isActive ? `${ACCENT}1f` : done ? "rgba(0,212,168,0.1)" : "transparent",
                color: isActive ? ACCENT : done ? "var(--mint)" : "var(--snow)",
                opacity: validated ? 0.6 : 1,
              }}
            >
              Épreuve {p}{" "}
              {done && !isActive && <Check className="inline w-3.5 h-3.5 ml-1" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {phase === "A" && (
        <PhaseA
          data={round.A}
          ans={aAns}
          setAns={setAAns}
          onNext={() => setPhase("B")}
          done={aDone}
        />
      )}

      {phase === "B" && (
        <PhaseB
          data={round.B}
          ans={bAns}
          setAns={setBAns}
          onPrev={() => setPhase("A")}
          onNext={() => setPhase("C")}
          done={bDone}
        />
      )}

      {phase === "C" && (
        <PhaseC
          data={round.C}
          ans={cAns}
          setAns={setCAns}
          onPrev={() => setPhase("B")}
          onValidate={validate}
          done={cDone}
        />
      )}

      {phase === "result" && (
        <ResultPanel
          score={scores[scores.length - 1] ?? 0}
          isLast={isLast}
          onNext={nextRound}
          onFinish={finish}
        />
      )}

      <div className="mt-6 flex items-center gap-1.5 justify-center">
        {Array.from({ length: ROUNDS.length }).map((_, i) => {
          const s = scores[i];
          const done = s !== undefined;
          const active = i === roundIdx;
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
    </div>
  );
}

// ─── Phase A ──────────────────────────────────────────────────────────────
function PhaseA({
  data,
  ans,
  setAns,
  onNext,
  done,
}: {
  data: EpreuveA;
  ans: Record<string, SegmentationCat>;
  setAns: (a: Record<string, SegmentationCat>) => void;
  onNext: () => void;
  done: boolean;
}) {
  const cats: SegmentationCat[] = ["principal", "support", "environnant", "aucun"];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
        // Épreuve A · Segmentation par produit
      </div>
      <p className="text-snow/75 mb-4">{data.intro}</p>
      <div className="space-y-3 mb-5">
        {data.items.map((it) => (
          <div key={it.id} className="rounded-2xl p-4 border border-night-200 bg-night-soft">
            <div className="font-display font-bold text-base mb-3">{it.label}</div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setAns({ ...ans, [it.id]: c })}
                  className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border-2 transition-colors"
                  style={{
                    borderColor: ans[it.id] === c ? ACCENT : "var(--night-200)",
                    background: ans[it.id] === c ? `${ACCENT}1f` : "transparent",
                    color: ans[it.id] === c ? ACCENT : "var(--snow)",
                  }}
                >
                  {SEG_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!done}
        className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl disabled:opacity-50 transition-transform hover:scale-[1.01]"
      >
        Passer à l&rsquo;épreuve B
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Phase B ──────────────────────────────────────────────────────────────
function PhaseB({
  data,
  ans,
  setAns,
  onPrev,
  onNext,
  done,
}: {
  data: EpreuveB;
  ans: Record<string, ClientCat>;
  setAns: (a: Record<string, ClientCat>) => void;
  onPrev: () => void;
  onNext: () => void;
  done: boolean;
}) {
  const cats: ClientCat[] = ["NCR", "NCA", "CA", "CP"];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
        // Épreuve B · Segmentation par client
      </div>
      <p className="text-snow/75 mb-4">{data.intro}</p>
      <div className="space-y-3 mb-5">
        {data.items.map((it) => (
          <div key={it.id} className="rounded-2xl p-4 border border-night-200 bg-night-soft">
            <p className="text-snow/85 mb-3 leading-snug">{it.profile}</p>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setAns({ ...ans, [it.id]: c })}
                  className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border-2 transition-colors"
                  style={{
                    borderColor: ans[it.id] === c ? ACCENT : "var(--night-200)",
                    background: ans[it.id] === c ? `${ACCENT}1f` : "transparent",
                    color: ans[it.id] === c ? ACCENT : "var(--snow)",
                  }}
                >
                  {CLIENT_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 border border-night-200 text-snow/80 font-semibold px-5 py-3 rounded-2xl hover:bg-night-100 transition-colors"
        >
          ← A
        </button>
        <button
          onClick={onNext}
          disabled={!done}
          className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl disabled:opacity-50 transition-transform hover:scale-[1.01]"
        >
          Passer à l&rsquo;épreuve C
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Phase C ──────────────────────────────────────────────────────────────
function PhaseC({
  data,
  ans,
  setAns,
  onPrev,
  onValidate,
  done,
}: {
  data: EpreuveC;
  ans: number | null;
  setAns: (n: number) => void;
  onPrev: () => void;
  onValidate: () => void;
  done: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
        // Épreuve C · Calcul rapide
      </div>
      <div className="rounded-3xl p-6 md:p-7 border-2 mb-5" style={{ borderColor: ACCENT, background: `${ACCENT}08` }}>
        <p className="text-snow text-lg md:text-xl leading-relaxed mb-6">
          {data.question}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.options.map((o) => (
            <button
              key={o.value}
              onClick={() => setAns(o.value)}
              className="p-5 rounded-2xl border-2 font-display font-extrabold text-2xl transition-all hover:scale-[1.02]"
              style={{
                borderColor: ans === o.value ? ACCENT : "var(--night-200)",
                background: ans === o.value ? `${ACCENT}1f` : "var(--night-soft)",
                color: ans === o.value ? ACCENT : "var(--snow)",
              }}
            >
              {o.value}
              <span className="text-base ml-1 text-snow/50">{data.unit}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 border border-night-200 text-snow/80 font-semibold px-5 py-3 rounded-2xl hover:bg-night-100 transition-colors"
        >
          ← B
        </button>
        <button
          onClick={onValidate}
          disabled={!done}
          className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl disabled:opacity-50 transition-transform hover:scale-[1.01]"
          style={{ boxShadow: done ? "0 0 16px var(--pivot)" : "none" }}
        >
          Valider la manche
          <Check className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}

function ResultPanel({
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
      className="rounded-3xl p-7 border-2 text-center"
      style={{ borderColor: c, background: `${c}10` }}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: c }}>
        // Score de la manche
      </div>
      <div className="font-display font-extrabold leading-none mb-6" style={{ fontSize: "60px", color: c }}>
        {score}<span className="text-2xl text-snow/40">/100</span>
      </div>
      <button
        onClick={isLast ? onFinish : onNext}
        className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-7 py-4 rounded-2xl transition-transform hover:scale-[1.01]"
      >
        {isLast ? "Voir mes résultats finaux" : "Manche suivante"}
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
