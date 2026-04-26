"use client";

import { motion } from "framer-motion";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

export default function Slide04() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full"
      >
        <Tag>// Marché</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-10"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Cible & Marché.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 border-2"
            style={{
              borderColor: "var(--sun)",
              background: "rgba(255,220,50,0.08)",
              boxShadow: "0 0 32px rgba(255,220,50,0.12)",
            }}
          >
            <div
              className="font-display font-extrabold text-2xl mb-2"
              style={{ color: "var(--sun)" }}
            >
              Cible Primaire
            </div>
            <p className="text-snow/85 text-lg leading-snug">
              Lycéens 15-18 ans, particulièrement{" "}
              <span className="font-bold">terminale</span>
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 border-2"
            style={{
              borderColor: "var(--pivot)",
              background: "rgba(140,110,255,0.08)",
              boxShadow: "0 0 32px rgba(140,110,255,0.12)",
            }}
          >
            <div
              className="font-display font-extrabold text-2xl mb-2"
              style={{ color: "var(--pivot)" }}
            >
              Cible Secondaire
            </div>
            <p className="text-snow/85 text-lg leading-snug">
              Écoles de commerce
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl p-8 md:p-10 border-2"
          style={{
            borderColor: "var(--sun)",
            background:
              "linear-gradient(135deg, rgba(255,220,50,0.08), rgba(255,220,50,0.02))",
          }}
        >
          <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
            // Potentiel marché
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="font-display font-bold text-2xl text-snow mb-1">
                  230 écoles · 115 000 places/an
                </div>
                <div className="text-snow/60 text-sm">
                  Marché total adressable
                </div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-snow mb-1">
                  500-2 000€ / étudiant
                </div>
                <div className="text-snow/60 text-sm">
                  Budget acquisition actuel des écoles
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-display font-bold text-xl text-snow mb-1">
                  1% du marché = 1 150 leads/an
                </div>
                <div
                  className="font-display font-bold mb-1"
                  style={{ color: "var(--sun)", fontSize: "clamp(20px, 2.5vw, 32px)" }}
                >
                  → 30€/lead = 34 500€
                </div>
              </div>
              <div className="pt-4 border-t border-night-200">
                <div className="font-mono text-[10px] uppercase tracking-widest text-snow/60 mb-1">
                  Objectif an 2 (5%)
                </div>
                <div
                  className="font-display font-extrabold tracking-tight leading-none"
                  style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--sun)" }}
                >
                  287 500€
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
