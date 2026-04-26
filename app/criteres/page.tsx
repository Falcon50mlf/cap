"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Globe,
  Heart,
  Rocket,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type Criterion = {
  num: string;
  title: string;
  body: string;
  redFlag: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const CRITERIA: Criterion[] = [
  {
    num: "01",
    title: "Les accréditations internationales",
    body: "L'AACSB, l'EQUIS et l'AMBA sont les 3 labels qualité reconnus mondialement. Les écoles qui ont les 3 (la «Triple Crown») sont une garantie de qualité d'enseignement et de reconnaissance internationale. Sans aucune accréditation, méfie-toi.",
    redFlag:
      "L'école ne mentionne aucune accréditation sur son site ou parle de labels obscurs.",
    Icon: Award,
  },
  {
    num: "02",
    title: "Le placement post-diplôme — vrais chiffres",
    body: "Demande le pourcentage de diplômés en CDI dans les 6 mois, le salaire médian (pas moyen — la médiane est plus honnête), et la liste des entreprises qui recrutent. Une bonne école publie ces chiffres de façon transparente.",
    redFlag:
      "L'école parle uniquement de «taux d'insertion» sans préciser CDI vs stage prolongé.",
    Icon: Briefcase,
  },
  {
    num: "03",
    title: "Le réseau alumnis actif",
    body: "Combien d'alumnis ? Dans quelles boîtes ? Y a-t-il une plateforme alumni dynamique avec des événements, du mentorat ? Un réseau de 5 000 alumnis actifs vaut mieux qu'un réseau de 50 000 fantômes.",
    redFlag:
      "L'annuaire alumni est inaccessible aux étudiants ou pas mis à jour.",
    Icon: Users,
  },
  {
    num: "04",
    title: "Les classements — mais lesquels ?",
    body: "Le classement Financial Times Masters in Management est le plus rigoureux internationalement. Les Échos, Le Figaro, Le Point en font en France. Regarde les critères de chaque classement et compare la position de l'école sur 5 ans (la stabilité compte plus qu'un coup d'éclat).",
    redFlag:
      "L'école met en avant un classement obscur où elle est dans le top 5.",
    Icon: TrendingUp,
  },
  {
    num: "05",
    title: "L'offre internationale",
    body: "Combien de partenariats universitaires ? Combien d'étudiants partent en échange ? Y a-t-il des doubles diplômes prestigieux (LSE, Bocconi, NUS…) ? Le pourcentage d'étudiants étrangers sur le campus ?",
    redFlag:
      "L'école promet l'international mais 80% des partenariats sont inactifs.",
    Icon: Globe,
  },
  {
    num: "06",
    title: "Les frais de scolarité — vrai coût",
    body: "Frais annuels x nb d'années + frais de dossier + cotisation alumni + livres. Et regarde les vraies bourses dispo (mérite, social, banques partenaires). Une école à 18k€/an qui propose 30% de bourses est moins chère qu'une école à 14k€/an sans bourse.",
    redFlag:
      "L'école communique uniquement sur le «tarif sans bourse» et reste vague sur l'aide financière.",
    Icon: Wallet,
  },
  {
    num: "07",
    title: "La spécialisation et les électifs",
    body: "En M2, quelles spécialisations sont vraiment distinctives ? Quels électifs en M1 ? Une école doit te permettre de te différencier, pas juste de cocher les cases du tronc commun.",
    redFlag:
      "Toutes les majeures se ressemblent et les électifs sont les mêmes qu'il y a 10 ans.",
    Icon: BookOpen,
  },
  {
    num: "08",
    title: "L'apprentissage et les stages",
    body: "Combien de mois de stage obligatoires ? L'école aide-t-elle au placement (CV, mock interviews, base de données stages) ? Y a-t-il un programme alternance reconnu ?",
    redFlag:
      "L'école compte sur tes propres efforts pour trouver tes stages — pas d'accompagnement.",
    Icon: Wrench,
  },
  {
    num: "09",
    title: "L'écosystème entrepreneurial",
    body: "Y a-t-il un incubateur étudiant ? Combien de startups en ont émergé ? Des programmes type «année de césure entrepreneur» ? Si tu veux entreprendre, c'est crucial.",
    redFlag:
      "L'école parle d'entrepreneuriat sans citer une seule startup créée par ses alumnis.",
    Icon: Rocket,
  },
  {
    num: "10",
    title: "L'expérience étudiante (BDE, assos, vie de campus)",
    body: "Le nombre d'associations actives, leur diversité, le campus (vs cours déportés). 3 ans dans une école, c'est aussi une expérience humaine. Les soirées BDE, les voyages, les sports… ça pèse autant que les cours.",
    redFlag:
      "Le BDE de l'école n'a pas de présence en ligne ou ne fait que 2 événements par an.",
    Icon: Heart,
  },
];

export default function CriteresPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Accueil
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-8 pb-16 md:pb-24">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
              // Guide décision
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.05em] leading-[0.92] mb-8"
              style={{ fontSize: "clamp(56px, 8vw, 112px)" }}
            >
              Comment choisir{" "}
              <span className="text-sun" style={{ fontStyle: "italic" }}>
                ton école
              </span>{" "}
              sans te faire avoir.
            </h1>
            <p className="text-snow/70 text-lg md:text-xl leading-relaxed max-w-2xl">
              Les classements, la com, les open days… C&rsquo;est joli mais ça
              ne suffit pas. Voici les 10 critères qui comptent vraiment quand
              tu choisis une école de commerce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO STATEMENT ────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-20 border-y border-night-200 bg-night-soft">
        <div className="max-w-[820px] mx-auto py-16">
          <p className="text-snow text-2xl md:text-3xl leading-relaxed font-light">
            Choisir une école de commerce, c&rsquo;est un investissement de{" "}
            <strong className="font-semibold text-sun">30 à 60k€</strong> et 3
            à 5 ans de ta vie. Ne te laisse pas séduire uniquement par les
            plaquettes glacées. Voici les critères qu&rsquo;on devrait
            t&rsquo;apprendre à regarder avant de signer.
          </p>
        </div>
      </section>

      {/* ── 10 CRITERIA ────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CRITERIA.map((c, i) => (
              <CriterionCard key={c.num} criterion={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-y border-night-200 bg-night-soft">
        <div className="max-w-[820px] mx-auto text-center">
          <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
            // Tu hésites encore ?
          </div>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] mb-8"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Tu veux échanger avec un étudiant qui a fait ce choix avant toi ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/decouverte/marketing/benevoles"
              className="inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-8 py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
              style={{ boxShadow: "0 0 24px var(--sun)" }}
            >
              Voir les bénévoles disponibles
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/decouverte/marketing/jeux"
              className="inline-flex items-center justify-center gap-2 border border-night-200 text-snow font-semibold px-8 py-4 rounded-2xl hover:bg-night-100 transition-colors"
            >
              Tester un mini-jeu Marketing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-12 border-t border-night-200">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size="nav" />
            <span className="text-snow/50 text-sm">Donne-toi un cap.</span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-night-500 max-w-md">
            // Cap&rsquo; n&rsquo;est sponsorisé par aucune école. Cette
            liste reflète notre vision indépendante de l&rsquo;orientation.
          </p>
        </div>
      </footer>
    </main>
  );
}

function CriterionCard({
  criterion,
  index,
}: {
  criterion: Criterion;
  index: number;
}) {
  // Alterne sun et pivot pour la variété visuelle
  const accent = index % 2 === 0 ? "var(--sun)" : "var(--pivot)";
  const Icon = criterion.Icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: (index % 2) * 0.05,
        type: "spring",
        stiffness: 90,
        damping: 16,
      }}
      whileHover={{ y: -3 }}
      className="relative p-7 md:p-8 rounded-3xl border-2 transition-shadow hover:shadow-card flex flex-col"
      style={{
        borderColor: accent,
        background: `${accent === "var(--sun)" ? "rgba(255,220,50,0.08)" : "rgba(140,110,255,0.08)"}`,
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center"
          style={{
            background:
              accent === "var(--sun)"
                ? "rgba(255,220,50,0.18)"
                : "rgba(140,110,255,0.18)",
            color: accent,
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: accent }}
        >
          // {criterion.num}
        </span>
      </div>

      <h3 className="font-display font-bold text-2xl tracking-tight mb-4 leading-tight">
        {criterion.title}
      </h3>

      <p className="text-snow/75 leading-relaxed mb-5 flex-1">
        {criterion.body}
      </p>

      <div
        className="flex items-start gap-3 mt-auto pt-5 border-t border-night-200"
        style={{ borderColor: "var(--coral)40" }}
      >
        <AlertTriangle
          className="w-4 h-4 shrink-0 mt-0.5"
          style={{ color: "var(--coral)" }}
        />
        <p
          className="text-sm leading-snug italic"
          style={{ color: "var(--coral)", fontStyle: "italic" }}
        >
          {criterion.redFlag}
        </p>
      </div>
    </motion.article>
  );
}
