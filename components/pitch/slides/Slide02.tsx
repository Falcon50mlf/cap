"use client";

import { motion } from "framer-motion";
import { Eye, AlertCircle, DollarSign } from "lucide-react";
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
    Icon: Eye,
    color: "var(--sun)",
    text: "Manque de visibilité sur les métiers du commerce",
  },
  {
    n: 2,
    Icon: AlertCircle,
    color: "var(--pivot)",
    text: "Orientation subie plutôt que choisie",
  },
  {
    n: 3,
    Icon: DollarSign,
    color: "var(--sun)",
    text: "Coût financier et humain d'une mauvaise orientation",
  },
];

export default function Slide02() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full"
      >
        <Tag>// Diagnostic</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-6"
          style={{ fontSize: "clamp(56px, 8vw, 112px)" }}
        >
          Problématique
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-snow font-light italic mb-10 max-w-3xl"
          style={{
            fontSize: "clamp(24px, 2.8vw, 40px)",
            fontWeight: 600,
            fontStyle: "italic",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          Comment bien s&rsquo;orienter, quand la{" "}
          <span style={{ color: "var(--sun)" }}>transition</span> lycée — études
          sup n&rsquo;est que théorique ?
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="bg-night-soft rounded-3xl p-7 md:p-9 mb-6 border-l-4"
          style={{ borderLeftColor: "var(--sun)" }}
        >
          <p
            className="text-snow/85 font-light leading-relaxed"
            style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
          >
            Chaque année,{" "}
            <span style={{ color: "var(--sun)", fontWeight: 600 }}>
              des milliers de lycéens
            </span>{" "}
            s&rsquo;engagent dans des études à{" "}
            <span style={{ color: "var(--sun)", fontWeight: 600 }}>
              10 000€
            </span>{" "}
            sans jamais avoir réellement expérimenté les matières
            qu&rsquo;ils vont étudier ni les métiers qu&rsquo;ils vont
            exercer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {POINTS.map((p) => (
            <motion.div
              key={p.n}
              variants={fadeUp}
              className="rounded-3xl p-5 border bg-night-soft/40"
              style={{
                borderColor: `${p.color}50`,
                background: `${p.color}10`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <NumCircle n={p.n} color={p.color} />
                <p.Icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <p className="text-snow/85 leading-snug font-medium text-base">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl p-6 md:p-7 border-2"
          style={{
            borderColor: "var(--sun)",
            background:
              "linear-gradient(135deg, rgba(255,220,50,0.08), rgba(255,220,50,0.02))",
          }}
        >
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-3"
            style={{ color: "var(--sun)" }}
          >
            // Potentiel marché
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="font-display font-extrabold text-xl md:text-2xl text-snow mb-1">
                230 écoles · 115 000 places/an
              </div>
              <div className="text-snow/60 text-sm">
                Marché total adressable
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-xl md:text-2xl text-snow mb-1">
                500 — 2 000€ / étudiant
              </div>
              <div className="text-snow/60 text-sm">
                Budget acquisition actuel des écoles
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
