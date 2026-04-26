"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  TrendingUp,
  Megaphone,
  Cpu,
  Rocket,
  Sparkles,
  Gamepad2,
  FileText,
  Users,
  GraduationCap,
  ContactRound,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";

const FAMILIES = [
  {
    key: "strategy",
    name: "Conseil & Stratégie",
    color: "var(--family-strategy)",
    Icon: Briefcase,
    preview: "Consultant MBB · Big 4 · Stratégiste interne",
  },
  {
    key: "finance",
    name: "Finance",
    color: "var(--family-finance)",
    Icon: TrendingUp,
    preview: "Analyste M&A · Private Equity · Asset Manager",
  },
  {
    key: "marketing",
    name: "Marketing & Brand",
    color: "var(--family-marketing)",
    Icon: Megaphone,
    preview: "Brand Manager · Growth · Chef de produit FMCG",
  },
  {
    key: "tech",
    name: "Tech & Produit",
    color: "var(--family-tech)",
    Icon: Cpu,
    preview: "Product Manager · Tech Sales · Customer Success",
  },
  {
    key: "startup",
    name: "Entrepreneuriat & Startups",
    color: "var(--family-startup)",
    Icon: Rocket,
    preview: "Founder · Chief of Staff · VC Analyst",
  },
  {
    key: "retail",
    name: "Luxe, Retail & FMCG",
    color: "var(--family-retail)",
    Icon: Sparkles,
    preview: "Buyer · Visual Merchandiser · Trade Marketing",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 90,
      damping: 16,
    },
  }),
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ───────── NAV ───────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
        <Logo size="nav" />
        <span className="hidden md:inline-block font-mono text-[11px] uppercase tracking-widest text-night-500">
          // 2 univers · 6 familles · 30 métiers
        </span>
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="relative px-6 md:px-10 pt-10 pb-32 md:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-[1400px] mx-auto">
          {/* Left col */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="font-mono text-[11px] uppercase tracking-widest text-night-500 mb-6"
            >
              // Plateforme d&apos;orientation par mini-jeux
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display font-extrabold tracking-[-0.05em] leading-[0.92]"
              style={{ fontSize: "clamp(64px, 9vw, 130px)" }}
            >
              <span className="block">Donne-toi</span>
              <span className="block">
                un <span className="strike-coral">quiz</span>{" "}
                <em className="text-sun" style={{ fontStyle: "italic" }}>
                  cap
                </em>
                .
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 text-[18px] leading-relaxed text-snow/70 max-w-[480px]"
            >
              Cap&rsquo; te fait découvrir les écoles de commerce et leurs
              débouchés à travers des mini-jeux qui simulent{" "}
              <strong className="text-snow">le vrai monde pro</strong>. Joue,
              comprends, échange avec ceux qui y sont déjà.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-4 font-mono text-[11px] uppercase tracking-widest text-night-500"
            >
              // Pour les lycéens · Pour les diplômés · Sans engagement
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-8 py-4 rounded-2xl shadow-glow-sun hover:scale-[1.02] active:scale-[0.99] transition-transform"
              >
                Lancer Cap&rsquo; <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/jeux-libres"
                className="inline-flex items-center justify-center gap-2 border border-night-200 text-snow font-semibold px-8 py-4 rounded-2xl hover:bg-night-100 transition-colors"
              >
                Tester un mini-jeu
              </Link>
            </motion.div>
          </div>

          {/* Right col — stack of 3 cards */}
          <div className="lg:col-span-5 relative h-[500px] md:h-[560px]">
            {/* Card 1 — DECOUVERTE (yellow) */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{
                delay: 0.45,
                type: "spring",
                stiffness: 70,
                damping: 14,
              }}
              className="absolute top-0 left-0 md:left-4 w-[280px] md:w-[320px] bg-sun text-night p-7 rounded-3xl shadow-card z-[1]"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-4">
                // Univers Découverte
              </div>
              <div className="font-display font-extrabold text-2xl leading-tight mb-3">
                Client Brief
              </div>
              <p className="text-sm leading-snug opacity-80">
                Une marque de chocolat veut rajeunir sa cible. Quelle est ton
                insight ?
              </p>
              <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider opacity-60">
                <span>Famille Conseil</span>
                <span>Manche 02 / 05</span>
              </div>
            </motion.div>

            {/* Card 2 — PROGRAMMES (purple) */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 70,
                damping: 14,
              }}
              className="absolute top-32 right-0 w-[290px] md:w-[330px] bg-pivot text-snow p-7 rounded-3xl shadow-card z-[2]"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-4">
                // Univers Programmes · ESCP
              </div>
              <div className="font-display font-extrabold text-2xl leading-tight mb-3">
                Business Canvas
              </div>
              <p className="text-sm leading-snug opacity-90">
                L&rsquo;ESCP te confie un projet. Construis ton Business Model
                Canvas.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-mono">
                  ★ Stratégie
                </span>
                <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-mono">
                  ★ Création
                </span>
              </div>
            </motion.div>

            {/* Card 3 — BENEVOLE (snow) */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{
                delay: 0.75,
                type: "spring",
                stiffness: 70,
                damping: 14,
              }}
              className="absolute bottom-0 left-2 md:left-12 w-[280px] md:w-[310px] bg-snow text-night p-6 rounded-3xl shadow-card z-[3]"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-4">
                // Bénévole
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full grid place-items-center font-display font-extrabold text-xl text-night"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--family-finance), var(--family-strategy))",
                  }}
                >
                  LM
                </div>
                <div>
                  <div className="font-display font-bold leading-none">
                    Léa M., 22 ans
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    ESCP M2 · 2 échanges/mois
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-night/10 px-2.5 py-1 rounded-full text-[11px] font-mono">
                  Stages M&amp;A
                </span>
                <span className="bg-night/10 px-2.5 py-1 rounded-full text-[11px] font-mono">
                  Vie en école
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── 2 UNIVERS, 1 CAP ───────── */}
      <section className="relative bg-night-soft px-6 md:px-10 py-24 md:py-32 border-y border-night-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <div className="font-mono text-[11px] uppercase tracking-widest text-night-500 mb-3">
              // Le coeur de Cap&rsquo;
            </div>
            <h2
              className="font-display font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
            >
              2 univers, 1{" "}
              <span className="text-sun" style={{ fontStyle: "italic" }}>
                cap
              </span>
              .
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 relative">
            {/* Vertical separator */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-sun/30 to-transparent" />

            {/* Découverte */}
            <div className="lg:pr-16">
              <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
                // Univers 01
              </div>
              <h3 className="font-display font-bold text-5xl md:text-6xl mb-5 tracking-tight">
                Découverte
              </h3>
              <p className="text-snow/70 text-[18px] leading-relaxed mb-10 max-w-[480px]">
                Explore les 6 familles de métiers post-école de commerce.
                Chaque mini-jeu te donne accès à : fiche secteur ONISEP, liste
                des métiers, et 3 bénévoles disponibles pour échanger.
              </p>

              <div className="space-y-4">
                <FeatureRow
                  Icon={Gamepad2}
                  color="var(--sun)"
                  title="Mini-jeux contextualisés"
                  body="Brief client, négo, pitch… des situations vraies"
                />
                <FeatureRow
                  Icon={FileText}
                  color="var(--sun)"
                  title="Fiches secteurs"
                  body="Quotidien, salaires, parcours, top entreprises"
                />
                <FeatureRow
                  Icon={Users}
                  color="var(--sun)"
                  title="Réseau bénévoles"
                  body="Étudiants en cours d'études + pros en poste"
                />
              </div>

              <Link
                href="/decouverte"
                className="mt-10 inline-flex items-center gap-2 border border-sun/40 text-sun font-semibold px-6 py-3 rounded-2xl hover:bg-sun/10 transition-colors"
              >
                Découvrir les 6 familles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Programmes */}
            <div className="lg:pl-16">
              <div className="font-mono text-[11px] uppercase tracking-widest text-pivot mb-3">
                // Univers 02
              </div>
              <h3 className="font-display font-bold text-5xl md:text-6xl mb-5 tracking-tight">
                Programmes
              </h3>
              <p className="text-snow/70 text-[18px] leading-relaxed mb-10 max-w-[480px]">
                Teste les modules de cours emblématiques des écoles
                partenaires. Tu joues avec leurs vraies notions, tu vois leur
                vision pédagogique, et tu peux entrer en contact directement.
              </p>

              <div className="space-y-4">
                <FeatureRow
                  Icon={GraduationCap}
                  color="var(--pivot)"
                  title="Modules transformés"
                  body="Business Plan, Change Management, Stratégie…"
                />
                <FeatureRow
                  Icon={FileText}
                  color="var(--pivot)"
                  title="Plaquette école"
                  body="Programme, parcours, témoignages alumnis"
                />
                <FeatureRow
                  Icon={ContactRound}
                  color="var(--pivot)"
                  title="Contact direct"
                  body="Transmets tes coordonnées en 1 clic"
                />
              </div>

              <Link
                href="/programmes"
                className="mt-10 inline-flex items-center gap-2 border border-pivot/40 text-pivot font-semibold px-6 py-3 rounded-2xl hover:bg-pivot/10 transition-colors"
              >
                Voir les écoles partenaires <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 6 FAMILLES ───────── */}
      <section className="relative px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
            // Univers Découverte
          </div>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] mb-12 md:mb-16"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            Les 6 familles de métiers.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAMILIES.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 90,
                  damping: 16,
                }}
                whileHover={{ scale: 1.02 }}
                className="relative p-6 rounded-3xl border transition-shadow"
                style={{
                  borderColor: f.color,
                  background: `${f.color}1a`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center mb-5"
                  style={{ background: `${f.color}33`, color: f.color }}
                >
                  <f.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2 tracking-tight">
                  {f.name}
                </h3>
                <p className="text-sm text-snow/60 leading-snug">{f.preview}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ECOLES PARTENAIRES ───────── */}
      <section className="relative bg-night-soft px-6 md:px-10 py-24 md:py-32 border-y border-night-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-[11px] uppercase tracking-widest text-pivot mb-3">
            // Univers Programmes
          </div>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] mb-3"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            Écoles partenaires.
          </h2>
          <p className="text-snow/60 text-[18px] mb-12 max-w-[560px]">
            On commence avec l&rsquo;ESCP. D&rsquo;autres écoles arrivent.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* ESCP — featured */}
            <div
              className="md:col-span-2 p-8 rounded-3xl border-2 relative overflow-hidden"
              style={{
                borderColor: "var(--school-escp)",
                background:
                  "linear-gradient(135deg, rgba(200,16,46,0.18), rgba(200,16,46,0.04))",
              }}
            >
              <div className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-widest bg-mint/15 text-mint px-2.5 py-1 rounded-full border border-mint/30">
                Disponible
              </div>
              <div
                className="font-display font-extrabold text-3xl tracking-tight mb-1"
                style={{ color: "var(--school-escp)" }}
              >
                ESCP
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-snow/50 mb-6">
                Business School · Paris
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-snow/50 mb-2">
                Module disponible
              </div>
              <div className="font-display font-bold text-xl leading-tight mb-6">
                Business Plan & Création d&rsquo;Entreprise
              </div>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-2 bg-snow text-night font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-[1.02] transition-transform"
              >
                Tester le module <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Coming soon */}
            {[
              { name: "HEC Paris" },
              { name: "EMLyon" },
              { name: "ESSEC" },
              { name: "NEOMA" },
            ].map((s) => (
              <div
                key={s.name}
                className="p-6 rounded-3xl border border-night-200 opacity-50 hover:opacity-70 transition-opacity"
              >
                <div className="font-display font-bold text-xl tracking-tight mb-3">
                  {s.name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-snow/40">
                  Bientôt
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="px-6 md:px-10 py-12 border-t border-night-200">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8 md:gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col gap-2">
            <Logo size="nav" />
            <span className="text-snow/50 text-sm">Donne-toi un cap.</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-snow/60">
            <Link className="hover:text-snow transition-colors" href="/onboarding">
              Pour les lycéens
            </Link>
            <Link className="hover:text-snow transition-colors" href="/onboarding">
              Pour les diplômés
            </Link>
            <Link className="hover:text-snow transition-colors" href="/onboarding">
              Devenir bénévole
            </Link>
          </nav>
          <div className="font-mono text-[11px] uppercase tracking-widest text-night-500">
            // Hackathon Genius ECAM 2026
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureRow({
  Icon,
  color,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-night-200 bg-night/40">
      <div
        className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
        style={{ background: `${color}1f`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-display font-bold text-base leading-tight">
          {title}
        </div>
        <div className="text-snow/60 text-sm mt-1">{body}</div>
      </div>
    </div>
  );
}
