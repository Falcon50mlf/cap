"use client";

import { motion } from "framer-motion";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

export default function Slide10() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1100px] mx-auto w-full text-center"
      >
        <Tag>// Closing</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-12"
          style={{ fontSize: "clamp(56px, 9vw, 128px)" }}
        >
          Cap
          <span style={{ color: "var(--sun)" }}>&rsquo;</span> c&rsquo;est{" "}
          <span style={{ color: "var(--sun)", fontStyle: "italic" }}>
            simple
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl bg-night-soft p-8 md:p-10 max-w-3xl mx-auto mb-12"
        >
          <p
            className="text-snow/90 font-light leading-relaxed"
            style={{ fontSize: "clamp(20px, 2.2vw, 30px)" }}
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
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
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
        </motion.div>
      </motion.div>
    </SlideContainer>
  );
}
