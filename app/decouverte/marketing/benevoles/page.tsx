"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  getVolunteersByFamily,
  type Volunteer,
} from "@/lib/volunteers-database";

const ACCENT = "var(--family-marketing)";

const FORMAT_ICONS = {
  call: Phone,
  cafe: Coffee,
  message: MessageSquare,
};

const FORMAT_LABELS = {
  call: "Call 30 min",
  cafe: "Café IRL",
  message: "Messages",
};

export default function MarketingBenevolesPage() {
  const volunteers = getVolunteersByFamily("marketing");

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/decouverte/marketing"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Marketing
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="px-6 md:px-10 pt-8 pb-20">
        <div className="max-w-[1100px] mx-auto">
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
              // Marketing & Brand
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
            >
              2 bénévoles<br />
              <span className="text-snow/40">qui y sont déjà.</span>
            </h1>
            <p className="mt-6 text-snow/60 text-lg max-w-xl">
              Des étudiants en cours d&rsquo;études et des pros en poste.
              Chacun a choisi de partager son retour d&rsquo;expérience pour
              t&rsquo;éviter les angles morts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {volunteers.map((v, i) => (
              <VolunteerCard key={v.id} v={v} index={i} />
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl border border-pivot/40 bg-pivot/5 text-center">
            <div className="font-mono text-[11px] uppercase tracking-widest text-pivot mb-3">
              // Tu veux devenir bénévole ?
            </div>
            <h3 className="font-display font-bold text-2xl mb-3 tracking-tight">
              Tu es étudiant·e ou pro en poste ?
            </h3>
            <p className="text-snow/60 mb-6 max-w-md mx-auto">
              Cap&rsquo; recrute des bénévoles pour partager 1-2 fois par mois.
              C&rsquo;est ton tour d&rsquo;aider la suite.
            </p>
            <a
              href="mailto:team@cap.app?subject=Devenir%20b%C3%A9n%C3%A9vole%20Cap%27"
              className="inline-flex items-center gap-2 border border-pivot/50 text-pivot font-semibold px-6 py-3 rounded-2xl hover:bg-pivot/10 transition-colors"
            >
              Écris-nous
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function VolunteerCard({ v, index }: { v: Volunteer; index: number }) {
  const initials = `${v.firstName[0]}${v.lastInitial[0]}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 90, damping: 16 }}
      className="p-6 md:p-8 rounded-3xl border-2 flex flex-col"
      style={{ borderColor: ACCENT, background: `${ACCENT}0a` }}
    >
      <div className="flex items-start gap-5 mb-6">
        <div
          className="w-20 h-20 rounded-3xl grid place-items-center font-display font-extrabold text-2xl text-night shrink-0"
          style={{ background: v.gradient }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-2xl tracking-tight mb-1">
            {v.firstName} {v.lastInitial}
            <span className="text-snow/50 font-normal text-lg ml-2">
              · {v.age} ans
            </span>
          </div>
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-2"
            style={{ color: ACCENT }}
          >
            {v.current}
          </div>
        </div>
      </div>

      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-2"
        style={{ color: ACCENT }}
      >
        // Parcours
      </div>
      <p className="text-snow/80 text-sm mb-5 leading-relaxed">
        {v.trajectory}
      </p>

      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-2"
        style={{ color: ACCENT }}
      >
        // Pitch
      </div>
      <p className="text-snow/80 leading-relaxed mb-6 italic">
        &ldquo;{v.bio}&rdquo;
      </p>

      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // Tu peux lui demander
      </div>
      <ul className="space-y-1.5 mb-6">
        {v.topics.map((t) => (
          <li
            key={t}
            className="text-snow/70 text-sm flex items-start gap-2"
          >
            <span style={{ color: ACCENT }}>·</span>
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-night-200">
        <div className="flex gap-2">
          {v.format.map((f) => {
            const Icon = FORMAT_ICONS[f];
            return (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-snow/60 bg-night-200 px-2.5 py-1 rounded-full"
              >
                <Icon className="w-3 h-3" />
                {FORMAT_LABELS[f]}
              </span>
            );
          })}
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          {v.availability}
        </span>
      </div>

      <button
        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-6 py-3 rounded-2xl text-sm transition-transform hover:scale-[1.01]"
      >
        Demander un échange
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.article>
  );
}
