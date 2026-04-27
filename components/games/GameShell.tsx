"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { saveGameResult } from "@/lib/save-game-result";
import {
  GameShellContext,
  type GameShellAPI,
} from "./game-shell-context";
import type { FamilyId, Skills } from "@/types/games";

type Props = {
  gameId: string;
  family: FamilyId;
  title: string;
  totalRounds: number;
  instructions: string;
  /** Couleur d'accent du jeu (par défaut : famille). */
  accent?: string;
  /** Route de retour à la fin (default: /decouverte/[family]/jeux). */
  returnHref?: string;
  children: React.ReactNode;
};

const FAMILY_COLOR: Record<FamilyId, string> = {
  strategy: "var(--family-strategy)",
  finance: "var(--family-finance)",
  marketing: "var(--family-marketing)",
  tech: "var(--family-tech)",
  startup: "var(--family-startup)",
  retail: "var(--family-retail)",
  "programs-ucl": "var(--pivot)",
};

export function GameShell({
  gameId,
  family,
  title,
  totalRounds,
  instructions,
  accent,
  returnHref,
  children,
}: Props) {
  const router = useRouter();
  const accentColor = accent ?? FAMILY_COLOR[family];
  const back = returnHref ?? `/decouverte/${family}/jeux`;

  const [currentRound, setCurrentRound] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [endState, setEndState] = useState<{
    skills: Skills;
    score?: number;
    payload?: unknown;
  } | null>(null);
  const [enjoyment, setEnjoyment] = useState<number>(0);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const startedAtRef = useRef<number>(Date.now());

  const api = useMemo<GameShellAPI>(
    () => ({
      setRound: (n) => setCurrentRound(n),
      complete: (skills, score, payload) => {
        setEndState({ skills, score, payload });
      },
    }),
    []
  );

  const handleQuit = useCallback(() => {
    if (endState) {
      router.push(back);
    } else {
      setConfirmQuit(true);
    }
  }, [endState, router, back]);

  async function submitRating() {
    if (!endState || enjoyment < 1) return;
    setSubmitting(true);
    await saveGameResult({
      gameId,
      family,
      skills: endState.skills,
      enjoyment,
      score: endState.score,
      durationMs: Date.now() - startedAtRef.current,
      payload: endState.payload,
    });
    router.push(back);
  }

  return (
    <GameShellContext.Provider value={api}>
      <main className="relative min-h-screen flex flex-col">
        {/* Header sticky */}
        <header
          className="sticky top-0 z-30 backdrop-blur-md border-b border-night-200"
          style={{ background: "var(--night)" }}
        >
          <div className="px-6 md:px-10 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Logo size="nav" />
              <span className="hidden sm:inline-block w-px h-6 bg-night-200" />
              <h1 className="font-display font-bold text-lg md:text-xl truncate">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-xs uppercase tracking-widest hidden sm:inline-block"
                style={{ color: accentColor }}
              >
                Manche {currentRound.toString().padStart(2, "0")} /{" "}
                {totalRounds.toString().padStart(2, "0")}
              </span>
              <ThemeToggle />
              <button
                onClick={handleQuit}
                aria-label="Quitter"
                className="p-2 rounded-xl border border-night-200 hover:border-night-500 hover:bg-night-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Instructions repliables */}
        <div className="px-6 md:px-10 pt-6">
          <button
            onClick={() => setShowInstructions((s) => !s)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-snow/60 hover:text-snow transition-colors"
          >
            // Comment jouer ?
            {showInstructions ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p
                  className="mt-3 text-snow/80 text-base md:text-lg leading-relaxed max-w-2xl border-l-2 pl-4"
                  style={{ borderColor: accentColor }}
                >
                  {instructions}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game area */}
        <section className="flex-1 px-6 md:px-10 py-8">{children}</section>

        {/* Quit confirm modal */}
        <AnimatePresence>
          {confirmQuit && (
            <Modal onClose={() => setConfirmQuit(false)}>
              <h2 className="font-display font-bold text-2xl mb-3">
                Quitter le mini-jeu ?
              </h2>
              <p className="text-snow/70 mb-6">
                Tu perdras ta progression sur cette session. Tu pourras
                recommencer à tout moment.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmQuit(false)}
                  className="px-5 py-3 rounded-2xl border border-night-200 text-snow/80 hover:bg-night-100 transition-colors"
                >
                  Continuer à jouer
                </button>
                <button
                  onClick={() => router.push(back)}
                  className="px-5 py-3 rounded-2xl bg-coral text-white font-bold transition-transform hover:scale-[1.02]"
                >
                  Quitter
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* End-of-game rating modal */}
        <AnimatePresence>
          {endState && (
            <Modal>
              <div className="text-center">
                <div
                  className="font-mono text-[11px] uppercase tracking-widest mb-2"
                  style={{ color: accentColor }}
                >
                  // Bravo
                </div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
                  C&rsquo;était comment ?
                </h2>
                <p className="text-snow/60 mb-8">
                  Ton avis nous aide à choisir les prochains mini-jeux.
                </p>

                <div
                  className="flex justify-center gap-2 mb-8"
                  onMouseLeave={() => setHoverStar(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => {
                    const filled = (hoverStar || enjoyment) >= n;
                    return (
                      <motion.button
                        key={n}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setHoverStar(n)}
                        onClick={() => setEnjoyment(n)}
                        className="p-1"
                        aria-label={`Note ${n}/5`}
                      >
                        <Star
                          className="w-12 h-12 transition-colors"
                          style={{
                            color: filled ? "var(--sun)" : "var(--night-200)",
                            fill: filled ? "var(--sun)" : "transparent",
                          }}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={submitRating}
                  disabled={enjoyment < 1 || submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-8 py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    boxShadow:
                      enjoyment > 0 && !submitting
                        ? "0 0 24px var(--sun)"
                        : undefined,
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      Continuer
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </GameShellContext.Provider>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 grid place-items-center px-6"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-night-soft border border-night-200 rounded-3xl p-8"
        style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
