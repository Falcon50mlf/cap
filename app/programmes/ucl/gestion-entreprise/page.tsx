"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileSignature,
  Globe2,
  TrendingUp,
  GraduationCap,
  Mail,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getModule, getSchool } from "@/lib/schools-database";
import type { Submodule } from "@/lib/schools-database";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  FileSignature,
  Globe2,
  TrendingUp,
};

const ACCENT = "var(--pivot)";

export default function UclGestionEntreprisePage() {
  const school = getSchool("ucl");
  const mod = getModule("ucl", "gestion-entreprise");
  if (!school || !mod) return null;

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Hub
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="px-6 md:px-10 pt-8 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Programmes · {school.name.toUpperCase()}
            </div>

            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-5"
              style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
            >
              Gestion<br />d&rsquo;entreprise
            </h1>

            <p className="text-snow/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Découvre les fondamentaux de la gestion d&rsquo;entreprise à
              travers 4 modules interactifs, basés sur le cours de Monica
              Scarano (UCL Lille).
            </p>

            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-pivot/40 bg-pivot/10">
              <div
                className="w-9 h-9 rounded-xl grid place-items-center"
                style={{ background: `${ACCENT}33`, color: ACCENT }}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-snow font-semibold text-sm">
                  Cours adapté de Monica Scarano
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-snow/60">
                  UCL Lille · Faculté de Gestion
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-5"
            style={{ color: ACCENT }}
          >
            // 4 sous-modules
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mod.submodules.map((s, i) => (
              <SubmoduleCard key={s.id} sub={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t border-night-200 bg-night-soft">
        <div className="max-w-[1100px] mx-auto">
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-3"
            style={{ color: ACCENT }}
          >
            // À la fin de ce parcours
          </div>
          <h2
            className="font-display font-bold tracking-[-0.03em] mb-8"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Tu auras accès à...
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Bonus
              Icon={GraduationCap}
              title="Plaquette UCL Lille"
              body="Présentation des programmes Gestion liés (Licence, Master, MBA)."
            />
            <Bonus
              Icon={Mail}
              title="Formulaire de contact"
              body="Envoie tes coordonnées à l'UCL pour échanger sur leur programme."
            />
            <Bonus
              Icon={CheckCircle2}
              title="Skills et progression"
              body="Tes scores sur l'analyse, la rigueur et la stratégie sauvegardés."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function SubmoduleCard({
  sub,
  index,
}: {
  sub: Submodule;
  index: number;
}) {
  const Icon = ICONS[sub.iconName] ?? Building2;

  return (
    <Link href={`/programmes/ucl/gestion-entreprise/${sub.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.05 * index,
          type: "spring",
          stiffness: 90,
          damping: 16,
        }}
        whileHover={{ y: -4 }}
        className="relative h-full p-7 rounded-3xl border-2 transition-shadow group flex flex-col cursor-pointer"
        style={{
          borderColor: ACCENT,
          background: "rgba(140,110,255,0.08)",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center"
            style={{ background: `${ACCENT}33`, color: ACCENT }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
            style={{
              borderColor: "var(--mint)",
              color: "var(--mint)",
              background: "rgba(0,212,168,0.1)",
            }}
          >
            Disponible
          </span>
        </div>

        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-2"
          style={{ color: ACCENT }}
        >
          // Module 0{sub.order}
        </div>
        <h3
          className="font-display font-extrabold text-2xl tracking-tight mb-2 leading-tight"
          style={{ color: ACCENT }}
        >
          {sub.title}
        </h3>
        <p className="text-snow/70 text-sm leading-relaxed mb-5 flex-1">
          {sub.intro}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-night-200">
          <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
            ⏱ {sub.duration}
          </span>
          <span
            className="inline-flex items-center gap-1 font-bold text-sm"
            style={{ color: ACCENT }}
          >
            Démarrer
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

function Bonus({
  Icon,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl p-5 border border-night-200 bg-night/40">
      <div
        className="w-10 h-10 rounded-xl grid place-items-center mb-4"
        style={{ background: `${ACCENT}1f`, color: ACCENT }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display font-bold text-base mb-1">{title}</div>
      <div className="text-snow/60 text-sm leading-snug">{body}</div>
    </div>
  );
}
