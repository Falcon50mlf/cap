"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  PlayCircle,
  Users,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { getGamesByFamily } from "@/lib/games-registry";
import type { GameMeta } from "@/types/games";

const ACCENT = "var(--family-marketing)";

export default function MarketingGamesHubPage() {
  const games = getGamesByFamily("marketing");

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <Link
          href="/decouverte/marketing"
          className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Marketing
        </Link>
      </header>

      <section className="px-6 md:px-10 pt-8 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
            className="mb-16"
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Marketing & Brand · Mini-jeux
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
            >
              7 mini-jeux<br />
              <span className="text-snow/40">pour tester le marketing.</span>
            </h1>
            <p className="mt-6 text-snow/60 text-lg max-w-xl">
              Chaque mini-jeu simule une vraie situation pro. Joue à ton
              rythme, à la fin tu verras tes points forts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((g, i) => (
              <GameCard key={g.id} g={g} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
            className="mt-16 p-8 rounded-3xl border-2"
            style={{ borderColor: ACCENT, background: `${ACCENT}10` }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center shrink-0"
                style={{ background: `${ACCENT}33`, color: ACCENT }}
              >
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl tracking-tight mb-1">
                  Tu as joué ? Échange avec 2 bénévoles Marketing.
                </h3>
                <p className="text-snow/70">
                  Léa (ESCP M2, Mondelēz) et Tom (Doctolib, ex-Vinted) sont
                  dispo pour 1-2 échanges par mois.
                </p>
              </div>
              <Link
                href="/decouverte/marketing/benevoles"
                className="inline-flex items-center gap-2 bg-sun text-night font-bold px-6 py-3 rounded-2xl shrink-0 transition-transform hover:scale-[1.02]"
              >
                Voir les bénévoles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function GameCard({ g, index }: { g: GameMeta; index: number }) {
  const live = g.status === "available";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 90,
        damping: 16,
      }}
      whileHover={live ? { y: -4 } : undefined}
      className="relative h-full p-6 rounded-3xl border-2 transition-shadow group flex flex-col"
      style={{
        borderColor: live ? ACCENT : "var(--night-200)",
        background: live ? `${ACCENT}12` : "var(--night-soft)",
        opacity: live ? 1 : 0.5,
        cursor: live ? "pointer" : "not-allowed",
        boxShadow: live ? `0 0 0 0 ${ACCENT}` : "none",
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-11 h-11 rounded-2xl grid place-items-center"
          style={{
            background: live ? `${ACCENT}33` : "var(--night-100)",
            color: live ? ACCENT : "var(--night-500)",
          }}
        >
          {live ? <PlayCircle className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
            #{g.order.toString().padStart(2, "0")}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
            style={{
              borderColor: live ? "var(--mint)" : "var(--night-200)",
              color: live ? "var(--mint)" : "var(--night-500)",
              background: live ? "rgba(0,212,168,0.1)" : "transparent",
            }}
          >
            {live ? "Jouable" : "Bientôt"}
          </span>
        </div>
      </div>

      <h3 className="font-display font-bold text-xl tracking-tight mb-2 leading-tight">
        {g.name}
      </h3>
      <p className="text-snow/60 text-sm leading-relaxed mb-5 flex-1">
        {g.concept}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-night-200">
        <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
          {g.totalRounds} manche{g.totalRounds > 1 ? "s" : ""}
        </span>
        {live && (
          <span
            className="inline-flex items-center gap-1 font-bold text-sm"
            style={{ color: ACCENT }}
          >
            Jouer
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </motion.div>
  );

  return live ? (
    <Link href={`/decouverte/marketing/jeux/${g.id}`}>{inner}</Link>
  ) : (
    <Link
      href={`/decouverte/marketing/jeux/${g.id}`}
      className="pointer-events-auto"
    >
      {inner}
    </Link>
  );
}
