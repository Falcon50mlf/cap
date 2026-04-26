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
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-10"
          style={{ fontSize: "clamp(56px, 8vw, 112px)" }}
        >
          Problématique.
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="bg-night-soft rounded-3xl p-8 md:p-10 mb-10 border-l-4"
          style={{ borderLeftColor: "var(--sun)" }}
        >
          <p
            className="text-snow/85 font-light leading-relaxed"
            style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {POINTS.map((p) => (
            <motion.div
              key={p.n}
              variants={fadeUp}
              className="rounded-3xl p-7 border bg-night-soft/40"
              style={{
                borderColor: `${p.color}50`,
                background: `${p.color}10`,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <NumCircle n={p.n} color={p.color} />
                <p.Icon className="w-6 h-6" style={{ color: p.color }} />
              </div>
              <p className="text-snow/85 leading-snug font-medium text-lg">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideContainer>
  );
}
