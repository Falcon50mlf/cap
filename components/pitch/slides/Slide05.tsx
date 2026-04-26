"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  SlideContainer,
  Tag,
  fadeUp,
  stagger,
  NumCircle,
} from "../slide-utils";

const STEPS = [
  {
    n: 1,
    title: "Choix de thématique",
    body: "Le lycéen choisit un univers (ex : Marketing).",
    color: "var(--sun)",
  },
  {
    n: 2,
    title: "Mini-jeu immersif",
    body: "5 minutes d'expérience interactive.",
    color: "var(--pivot)",
  },
  {
    n: 3,
    title: "Résultat & Contact",
    body: "Fiche métier + école partenaire.",
    color: "var(--mint)",
  },
];

export default function Slide05() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag>// Le flow</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-12"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Parcours utilisateur.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4 md:gap-3">
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              <motion.div
                variants={fadeUp}
                className="rounded-3xl p-7 border-2 flex flex-col"
                style={{
                  borderColor: s.color,
                  background: `${s.color}10`,
                }}
              >
                <NumCircle n={s.n} color={s.color} />
                <div
                  className="font-display font-extrabold text-2xl tracking-tight mt-5 mb-3"
                  style={{ color: s.color }}
                >
                  {s.title}
                </div>
                <p className="text-snow/75 leading-snug">{s.body}</p>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  variants={fadeUp}
                  className="grid place-items-center text-sun"
                >
                  <ArrowRight
                    className="w-8 h-8 hidden md:block"
                    strokeWidth={2.5}
                  />
                  <ArrowRight
                    className="w-6 h-6 md:hidden rotate-90"
                    strokeWidth={2.5}
                  />
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>
      </motion.div>
    </SlideContainer>
  );
}
