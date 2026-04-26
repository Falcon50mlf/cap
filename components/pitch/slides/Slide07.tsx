"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

const OTHERS = ["Informatif", "Passif", "Peu engageant"];
const CAPS = ["Expérientiel", "Ludique", "Validé par les écoles"];

export default function Slide07() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag>// Concurrence</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-12"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Ce qui nous différencie.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Les autres */}
          <motion.div variants={fadeUp}>
            <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-snow/40 mb-3">
              // Les autres
            </div>
            <div className="rounded-3xl border border-night-200 p-7 bg-night-soft mb-3">
              <p className="text-snow/70 text-lg">
                Onisep, Parcoursup, Studyrama, YouTube
              </p>
            </div>
            <ul className="space-y-2">
              {OTHERS.map((o) => (
                <li
                  key={o}
                  className="flex items-center gap-3 text-snow/55 text-base"
                >
                  <X className="w-4 h-4 text-night-500" strokeWidth={2.5} />
                  {o}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cap' */}
          <motion.div variants={fadeUp}>
            <div className="font-mono text-[12px] uppercase tracking-[0.2em] mb-3">
              <span style={{ color: "var(--sun)" }}>// Cap</span>
              <span style={{ color: "var(--sun)" }}>&rsquo;</span>
            </div>
            <div
              className="rounded-3xl p-7 mb-3 border-2"
              style={{
                borderColor: "var(--sun)",
                background:
                  "linear-gradient(135deg, rgba(255,220,50,0.12), rgba(140,110,255,0.12))",
              }}
            >
              <p className="text-snow text-lg font-semibold">
                Expérientiel · Ludique · Validé
              </p>
            </div>
            <ul className="space-y-2">
              {CAPS.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-3 text-snow text-base"
                >
                  <Check
                    className="w-4 h-4"
                    style={{ color: "var(--mint)" }}
                    strokeWidth={2.5}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "linear-gradient(90deg, var(--sun), var(--pivot))",
            color: "#0E0E10",
          }}
        >
          <p
            className="font-display font-extrabold leading-tight"
            style={{ fontSize: "clamp(22px, 2.6vw, 36px)" }}
          >
            Seule plateforme qui fait{" "}
            <em style={{ fontStyle: "italic" }}>VIVRE</em> les matières avant
            de choisir.
          </p>
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
