"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileSignature,
  Globe2,
  TrendingUp,
  Lightbulb,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  getSubmodule,
  type ContentSection,
} from "@/lib/schools-database";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  FileSignature,
  Globe2,
  TrendingUp,
};

const ACCENT = "var(--pivot)";

const VALID_IDS = [
  "reconnaitre-entreprise",
  "choisir-statut",
  "pestel",
  "marche",
];

export default function SubmodulePage({
  params,
}: {
  params: { moduleId: string };
}) {
  const sub = getSubmodule("ucl", "gestion-entreprise", params.moduleId);
  if (!sub || !VALID_IDS.includes(params.moduleId)) notFound();

  const Icon = ICONS[sub.iconName] ?? Building2;

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/programmes/ucl/gestion-entreprise"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Module
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="px-6 md:px-10 pt-8 pb-12">
        <div className="max-w-[820px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Module 0{sub.order} · UCL Lille
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center shrink-0 mt-2"
                style={{ background: `${ACCENT}33`, color: ACCENT }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h1
                className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
                style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
              >
                {sub.title}
              </h1>
            </div>

            <p className="text-snow/75 text-lg md:text-xl leading-relaxed">
              {sub.intro}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-night-200 bg-night-soft">
              <span className="font-mono text-[10px] uppercase tracking-widest text-snow/60">
                ⏱ {sub.duration} · 1 mini-jeu à la fin
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-[820px] mx-auto space-y-8">
          {sub.sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t border-night-200 bg-night-soft">
        <div className="max-w-[820px] mx-auto text-center">
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-3"
            style={{ color: ACCENT }}
          >
            // Prêt·e à jouer ?
          </div>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Mets-le en pratique.
          </h2>
          <Link
            href={`/programmes/ucl/gestion-entreprise/${sub.id}/jeu`}
            className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-8 py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
            style={{ boxShadow: "0 0 24px var(--pivot)" }}
          >
            Lancer le mini-jeu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Section({ section }: { section: ContentSection }) {
  if (section.type === "definition") {
    return (
      <div className="rounded-3xl p-6 md:p-7 border-l-4 bg-night-soft" style={{ borderLeftColor: ACCENT }}>
        {section.title && (
          <div className="font-display font-bold text-xl md:text-2xl mb-3" style={{ color: ACCENT }}>
            {section.title}
          </div>
        )}
        <p className="text-snow/85 text-base md:text-lg leading-relaxed">
          {section.body}
        </p>
      </div>
    );
  }

  if (section.type === "callout") {
    const c = section.callout!;
    const Icon = c.kind === "tip" ? Lightbulb : c.kind === "warn" ? AlertTriangle : Info;
    const color =
      c.kind === "warn"
        ? "var(--coral)"
        : c.kind === "tip"
          ? "var(--sun)"
          : ACCENT;
    return (
      <div
        className="rounded-2xl p-5 border-2 flex items-start gap-3"
        style={{ borderColor: color, background: `${color}10` }}
      >
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
        <p className="text-snow/85 text-base leading-snug">{c.text}</p>
      </div>
    );
  }

  if (section.type === "list" || section.type === "examples") {
    return (
      <div>
        {section.title && (
          <h3 className="font-display font-bold text-xl md:text-2xl mb-4 tracking-tight">
            {section.title}
          </h3>
        )}
        <div className="space-y-3">
          {section.items?.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 border border-night-200 bg-night-soft/40"
            >
              <div className="font-display font-bold text-base mb-1" style={{ color: ACCENT }}>
                {item.label}
              </div>
              {item.value && (
                <div className="text-snow/75 text-sm leading-snug">
                  {item.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === "formula") {
    return (
      <div className="rounded-3xl p-6 md:p-7 border-2" style={{ borderColor: ACCENT, background: `${ACCENT}08` }}>
        {section.title && (
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
            // {section.title}
          </div>
        )}
        <div
          className="font-mono font-bold text-snow text-base md:text-lg leading-relaxed"
          style={{ letterSpacing: "0.02em" }}
        >
          {section.formula}
        </div>
      </div>
    );
  }

  if (section.type === "intro") {
    return (
      <p className="text-snow/85 text-lg md:text-xl leading-relaxed">
        {section.body}
      </p>
    );
  }

  return null;
}
