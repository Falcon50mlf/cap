"use client";

import { motion } from "framer-motion";
import {
  SlideContainer,
  Tag,
  fadeUp,
  stagger,
  NumCircle,
} from "../slide-utils";

type Card = {
  n: number;
  color: string;
  title: string;
  body: React.ReactNode;
};

const POINTS: Card[] = [
  {
    n: 1,
    color: "var(--sun)",
    title: "Leads qualifiés et consentis",
    body: (
      <>L&rsquo;étudiant a déjà expérimenté votre matière, son intérêt est validé.</>
    ),
  },
  {
    n: 2,
    color: "var(--pivot)",
    title: "Gamification > Communication classique",
    body: (
      <>
        Vos étudiants jouent avec votre pédagogie au lieu de scroller des
        plaquettes.
      </>
    ),
  },
  {
    n: 3,
    color: "var(--mint)",
    title: "Visibilité auprès d'une cible jeune et engagée",
    body: <>Lycéens 15-18 ans actifs, pas une audience passive.</>,
  },
  {
    n: 4,
    color: "#3B82F6",
    title: "Coût d'acquisition bien en dessous du marché",
    body: (
      <>
        <span style={{ color: "var(--sun)", fontWeight: 600 }}>
          20-30€/lead
        </span>{" "}
        vs{" "}
        <span style={{ color: "var(--sun)", fontWeight: 600 }}>
          500-2 000€/étudiant
        </span>{" "}
        en com classique.
      </>
    ),
  },
];

const HIGHLIGHT: Card = {
  n: 5,
  color: "var(--coral)",
  title: "Réactivité produit unique",
  body: (
    <>
      Manque sur une formation ? On produit un module de 30 min en 1 mois pour
      renforcer votre communication.
    </>
  ),
};

export default function Slide06() {
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
          Intérêt pour les écoles
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
              <div className="pt-1">
                <div
                  className="font-display font-bold mb-1.5"
                  style={{
                    color: p.color,
                    fontSize: "clamp(16px, 1.4vw, 19px)",
                  }}
                >
                  {p.title}
                </div>
                <p className="text-snow/80 text-sm md:text-base leading-snug">
                  {p.body}
                </p>
              </div>
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
          <div className="pt-1">
            <div
              className="font-display font-extrabold mb-2"
              style={{
                color: HIGHLIGHT.color,
                fontSize: "clamp(18px, 1.8vw, 26px)",
              }}
            >
              {HIGHLIGHT.title}
            </div>
            <p className="text-snow/85 text-base md:text-lg leading-snug">
              {HIGHLIGHT.body}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
