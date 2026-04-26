"use client";

import { motion } from "framer-motion";
import {
  SlideContainer,
  Tag,
  fadeUp,
  stagger,
  NumCircle,
} from "../slide-utils";

const POINTS = [
  {
    n: 1,
    color: "var(--sun)",
    text: "Leads qualifiés et consentis (l'étudiant a déjà expérimenté)",
  },
  {
    n: 2,
    color: "var(--pivot)",
    text: "Contenu pédagogique valorisant leur expertise",
  },
  {
    n: 3,
    color: "var(--mint)",
    text: "Visibilité auprès d'une cible jeune et engagée",
  },
  {
    n: 4,
    color: "#3B82F6",
    text: "Coût d'acquisition bien en dessous du marché actuel",
  },
];

const HIGHLIGHT = {
  n: 5,
  color: "var(--coral)",
  text: "Contenu validé et co-construit avec l'école = image de marque",
};

export default function Slide08() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full"
      >
        <Tag color="var(--pivot)">// Pour les écoles</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-10"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Intérêt pour les écoles.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {POINTS.map((p) => (
            <motion.div
              key={p.n}
              variants={fadeUp}
              className="rounded-3xl p-6 border bg-night-soft/40 flex items-start gap-4"
              style={{
                borderColor: `${p.color}50`,
                background: `${p.color}0a`,
              }}
            >
              <NumCircle n={p.n} color={p.color} />
              <p className="text-snow/85 text-base md:text-lg leading-snug pt-1.5">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl p-7 border-2 flex items-start gap-4"
          style={{
            borderColor: HIGHLIGHT.color,
            background: `${HIGHLIGHT.color}10`,
          }}
        >
          <NumCircle n={HIGHLIGHT.n} color={HIGHLIGHT.color} />
          <p
            className="font-display font-bold leading-tight pt-1"
            style={{
              fontSize: "clamp(18px, 2vw, 26px)",
              color: HIGHLIGHT.color,
            }}
          >
            {HIGHLIGHT.text}
          </p>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
