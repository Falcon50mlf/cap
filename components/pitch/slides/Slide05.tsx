"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Tag, fadeUp, stagger } from "../slide-utils";

const GAME_PATH = "/decouverte/marketing/jeux/mapping-concurrentiel";

export default function Slide05() {
  return (
    <div className="min-h-screen w-full flex flex-col px-6 md:px-10 lg:px-12 pt-12 pb-24">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
          <div>
            <Tag>// Démo live · cap-two-fawn.vercel.app</Tag>
            <motion.h1
              variants={fadeUp}
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              Et concrètement ?
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-2 text-snow/70"
              style={{ fontSize: "clamp(16px, 1.5vw, 22px)" }}
            >
              On l&rsquo;a déjà construit. Joue avec.
            </motion.p>
          </div>

          <motion.a
            variants={fadeUp}
            href={GAME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sun text-night font-bold px-5 py-3 rounded-2xl text-sm transition-transform hover:scale-[1.02] self-start md:self-end"
            style={{ boxShadow: "0 0 16px var(--sun)" }}
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir en plein écran
          </motion.a>
        </div>

        <motion.div
          variants={fadeUp}
          className="relative flex-1 rounded-3xl overflow-hidden border border-night-200 bg-night-soft"
          style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.45)", minHeight: 480 }}
        >
          <iframe
            src={GAME_PATH}
            title="Démo Cap' — Mapping Concurrentiel"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            className="w-full h-full absolute inset-0"
            style={{ border: 0 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
