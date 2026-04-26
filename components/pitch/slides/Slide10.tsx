"use client";

import { motion } from "framer-motion";
import { SlideContainer, Tag, fadeUp, stagger, NumCircle } from "../slide-utils";

const TEAM = [
  {
    n: 1,
    title: "INSEEC",
    sub: "École de commerce",
    note: "On connaît le marché",
    color: "var(--sun)",
  },
  {
    n: 2,
    title: "Gaming Campus",
    sub: "dont 1 IRIIG",
    note: "Game design + dev",
    color: "var(--pivot)",
  },
  {
    n: 3,
    title: "IAE",
    sub: "Gestion, stratégie",
    note: "Vision business",
    color: "var(--mint)",
  },
  {
    n: 4,
    title: "Cybersécurité",
    sub: "Expertise tech",
    note: "Fondations solides",
    color: "#3B82F6",
  },
];

export default function Slide10() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full gap-10"
      >
        <div>
          <Tag>// L&rsquo;équipe</Tag>
          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-6"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            Pourquoi nous ?
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 mb-5"
            style={{
              background: "linear-gradient(90deg, var(--sun), var(--pivot))",
              color: "#0E0E10",
            }}
          >
            <p
              className="font-display font-extrabold leading-tight"
              style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}
            >
              Équipe de 5 personnes complémentaires
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                className="rounded-3xl p-6 border-2"
                style={{ borderColor: t.color, background: `${t.color}10` }}
              >
                <NumCircle n={t.n} color={t.color} />
                <div
                  className="font-display font-extrabold text-2xl mt-4 mb-1"
                  style={{ color: t.color }}
                >
                  {t.title}
                </div>
                <div className="text-snow/80 text-sm font-medium mb-2">
                  {t.sub}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
                  {t.note}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 mt-5"
            style={{
              background: "linear-gradient(90deg, var(--sun), var(--pivot))",
              color: "#0E0E10",
            }}
          >
            <p
              className="font-display font-extrabold leading-tight"
              style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}
            >
              Business + Tech + Game Design ={" "}
              <em style={{ fontStyle: "italic" }}>le trio parfait</em>.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="border-t border-night-200 pt-10 text-center"
        >
          <h2
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-8"
            style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
          >
            Cap
            <span style={{ color: "var(--sun)" }}>&rsquo;</span> c&rsquo;est{" "}
            <span style={{ color: "var(--sun)", fontStyle: "italic" }}>
              simple
            </span>
            .
          </h2>

          <div className="rounded-3xl bg-night-soft p-8 md:p-10 max-w-3xl mx-auto mb-8">
            <p
              className="text-snow/90 font-light leading-relaxed"
              style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
            >
              On aide les{" "}
              <span style={{ color: "var(--sun)", fontWeight: 600 }}>
                lycéens
              </span>{" "}
              à choisir leur voie, et on aide les{" "}
              <span style={{ color: "var(--pivot)", fontWeight: 600 }}>
                écoles
              </span>{" "}
              à trouver leurs futurs étudiants.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.cap-orientation.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-sun text-night font-bold px-7 py-4 rounded-2xl text-base md:text-lg transition-transform hover:scale-[1.02]"
              style={{ boxShadow: "0 0 24px var(--sun)" }}
            >
              www.cap-orientation.fr
            </a>
            <a
              href="mailto:contact@cap-orientation.fr"
              className="inline-flex items-center justify-center bg-pivot text-snow font-bold px-7 py-4 rounded-2xl text-base md:text-lg transition-transform hover:scale-[1.02]"
              style={{ boxShadow: "0 0 24px var(--pivot)" }}
            >
              contact@cap-orientation.fr
            </a>
          </div>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
