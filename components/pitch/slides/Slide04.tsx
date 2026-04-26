"use client";

import { motion } from "framer-motion";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

const CHIPS = [
  "Marketing",
  "Finance",
  "Entrepreneuriat",
  "Conseil",
  "International",
];

const KPIS = [
  { big: "3-5 min", color: "var(--sun)", label: "Durée par jeu" },
  { big: "Fiche métier", color: "var(--pivot)", label: "À la fin du jeu" },
  { big: "Validé", color: "var(--mint)", label: "Par les écoles" },
];

export default function Slide04() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full"
      >
        <Tag color="var(--pivot)">// La réponse Cap&rsquo;</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-10"
          style={{ fontSize: "clamp(56px, 8vw, 112px)" }}
        >
          La solution
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="bg-night-soft rounded-3xl p-8 md:p-10 mb-8 border-l-4"
          style={{ borderLeftColor: "var(--pivot)" }}
        >
          <p
            className="text-snow/85 font-light leading-relaxed"
            style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}
          >
            <span className="font-display font-bold text-snow">Cap&rsquo;</span>
            , une plateforme web de{" "}
            <span style={{ color: "var(--sun)", fontWeight: 600 }}>
              mini-jeux immersifs
            </span>{" "}
            pour étudiants, qui simulent les matières des écoles de commerce.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap gap-2.5 mb-12"
        >
          {CHIPS.map((c) => (
            <motion.span
              key={c}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-5 py-2.5 rounded-full border-2 border-pivot/40 bg-pivot/10 text-snow font-display font-semibold cursor-default transition-colors"
            >
              {c}
            </motion.span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {KPIS.map((k) => (
            <motion.div
              key={k.big}
              variants={fadeUp}
              className="rounded-3xl p-7 border-2 text-center bg-night-soft/40"
              style={{ borderColor: k.color, background: `${k.color}0d` }}
            >
              <div
                className="font-display font-extrabold tracking-tight leading-none mb-3"
                style={{ fontSize: "clamp(36px, 4vw, 64px)", color: k.color }}
              >
                {k.big}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-snow/60">
                {k.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideContainer>
  );
}
