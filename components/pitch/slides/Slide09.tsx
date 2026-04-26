"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

const REVENUE = [
  "Affiliation par lead étudiant transmis à l'école (avec consentement)",
  { text: "Prix de lancement : ", highlight: "15 à 30€/lead", suffix: " (sous le marché)" },
  { text: "Prix cible : ", highlight: "50€/lead" },
];

const ACQUISITION = [
  "Partenariats directs avec les écoles",
  "Réseaux sociaux lycéens (TikTok, Instagram)",
  "Bouche à oreille entre lycéens",
  "Prescripteurs : profs, conseillers d'orientation",
];

export default function Slide09() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag color="var(--mint)">// Business model</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-12"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Modèle économique.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Comment on gagne */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 md:p-8 border-2"
            style={{
              borderColor: "var(--mint)",
              background: "rgba(0,212,168,0.08)",
              boxShadow: "0 0 32px rgba(0,212,168,0.15)",
            }}
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-2"
              style={{ color: "var(--mint)" }}
            >
              // Revenue
            </div>
            <h2
              className="font-display font-extrabold text-2xl md:text-3xl mb-6"
              style={{ color: "var(--mint)" }}
            >
              Comment on gagne de l&rsquo;argent
            </h2>
            <ul className="space-y-4">
              {REVENUE.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-snow/90">
                  <Check
                    className="w-5 h-5 shrink-0 mt-1"
                    style={{ color: "var(--mint)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-base md:text-lg leading-snug">
                    {typeof r === "string" ? (
                      r
                    ) : (
                      <>
                        {r.text}
                        <span
                          className="font-bold"
                          style={{ color: "var(--mint)" }}
                        >
                          {r.highlight}
                        </span>
                        {r.suffix ?? ""}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Comment on se fait connaître */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 md:p-8 border-2"
            style={{
              borderColor: "var(--sun)",
              background: "rgba(255,220,50,0.08)",
              boxShadow: "0 0 32px rgba(255,220,50,0.12)",
            }}
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-2">
              // Acquisition
            </div>
            <h2
              className="font-display font-extrabold text-2xl md:text-3xl mb-6"
              style={{ color: "var(--sun)" }}
            >
              Comment on se fait connaître
            </h2>
            <ul className="space-y-4">
              {ACQUISITION.map((a) => (
                <li key={a} className="flex items-start gap-3 text-snow/90">
                  <ArrowRight
                    className="w-5 h-5 shrink-0 mt-1"
                    style={{ color: "var(--sun)" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-base md:text-lg leading-snug">{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </SlideContainer>
  );
}
