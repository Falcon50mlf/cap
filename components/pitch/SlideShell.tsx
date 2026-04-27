"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import Slide01 from "./slides/Slide01";
import Slide02 from "./slides/Slide02";
import Slide03 from "./slides/Slide03";
import Slide04 from "./slides/Slide04";
import Slide05 from "./slides/Slide05";
import Slide06 from "./slides/Slide06";
import Slide07 from "./slides/Slide07";
import Slide08 from "./slides/Slide08";
import Slide09 from "./slides/Slide09";
import Slide10 from "./slides/Slide10";

// L'ordre de présentation ne suit PAS l'ordre des noms de fichiers — les fichiers
// gardent leur nom d'origine pour ne pas casser les imports / les commits passés.
// Slot 1 → 10  =  fichier source.
const SLIDES = [
  Slide01, // 01 — Hook (1 600 000 lycéens)
  Slide09, // 02 — Pourquoi nous ? (équipe)
  Slide02, // 03 — Problématique
  Slide03, // 04 — Benchmark
  Slide04, // 05 — La solution
  Slide05, // 06 — Démo live
  Slide06, // 07 — Intérêt pour les écoles
  Slide07, // 08 — Modèle économique
  Slide08, // 09 — Nos besoins
  Slide10, // 10 — Cap' c'est simple (closing)
];
const TOTAL = SLIDES.length;

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 80 }),
};

export function SlideShell() {
  const [current, setCurrent] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.max(1, Math.min(TOTAL, n));
      setDirection(clamped > current ? 1 : -1);
      setCurrent(clamped);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${clamped}`);
      }
    },
    [current],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Hash → slide au mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const num = parseInt(hash, 10);
    if (Number.isFinite(num) && num >= 1 && num <= TOTAL) {
      setCurrent(num);
    }
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Évite de capter les touches dans un input (iframe slide 6)
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();
          prev();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Sync fullscreen state with browser
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  const Slide = SLIDES[current - 1]!; // safe: current ∈ [1, TOTAL]

  return (
    <div className="fixed inset-0 bg-night text-snow overflow-hidden">
      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="absolute inset-0 overflow-y-auto"
        >
          <Slide />
        </motion.div>
      </AnimatePresence>

      {/* Top-right exit button */}
      <Link
        href="/"
        aria-label="Quitter le pitch"
        className="absolute top-6 right-6 z-50 p-2 rounded-xl border border-night-200 bg-night-soft/80 backdrop-blur hover:bg-night-100 hover:border-night-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </Link>

      {/* Bottom nav */}
      <div
        className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-50 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <Logo size="nav" href="/" />
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-snow/50 hidden sm:inline-block">
            {current.toString().padStart(2, "0")} /{" "}
            {TOTAL.toString().padStart(2, "0")}
          </span>

          <button
            onClick={toggleFullscreen}
            aria-label={
              isFullscreen ? "Quitter le plein écran" : "Plein écran (F)"
            }
            title={isFullscreen ? "Quitter (Esc)" : "Plein écran (F)"}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-xl border border-night-200 bg-night-soft/80 backdrop-blur hover:bg-night-100 hover:border-night-500 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={prev}
            disabled={current === 1}
            aria-label="Slide précédente"
            className="w-10 h-10 rounded-full bg-sun text-night flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
            style={{
              boxShadow: current === 1 ? "none" : "0 0 16px var(--sun)",
            }}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <button
            onClick={next}
            disabled={current === TOTAL}
            aria-label="Slide suivante"
            className="w-10 h-10 rounded-full bg-sun text-night flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
            style={{
              boxShadow: current === TOTAL ? "none" : "0 0 16px var(--sun)",
            }}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Hint clavier (visible 1ère slide uniquement) */}
      {current === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-50 font-mono text-[10px] uppercase tracking-widest text-snow/40 hidden md:block"
        >
          // Espace ou → pour avancer · F pour plein écran
        </motion.div>
      )}
    </div>
  );
}
