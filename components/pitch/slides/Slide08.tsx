"use client";

import { motion } from "framer-motion";
import { Building2, Landmark, School, GraduationCap } from "lucide-react";
import { SlideContainer, Tag, fadeUp, stagger } from "../slide-utils";

type Slice = { value: number; color: string; label: string };

const SLICES: Slice[] = [
  { value: 40, color: "var(--sun)", label: "Communication & marketing" },
  { value: 25, color: "var(--pivot)", label: "Entretiens & user research" },
  {
    value: 20,
    color: "var(--mint)",
    label: "Partenariats écoles & certifications",
  },
  { value: 15, color: "#3B82F6", label: "Développement produit" },
];

const PARTNERS = [
  {
    Icon: Building2,
    name: "ONISEP",
    note: "Référence orientation",
    color: "var(--sun)",
  },
  {
    Icon: Landmark,
    name: "Ministère de l'Éducation et de la Jeunesse",
    note: "Légitimité institutionnelle",
    color: "var(--pivot)",
  },
  {
    Icon: School,
    name: "Lycées",
    note: "Accès direct à la cible",
    color: "var(--mint)",
  },
  {
    Icon: GraduationCap,
    name: "Écoles de commerce",
    note: "Partenaires de contenu",
    color: "#3B82F6",
  },
];

// Helper : convertit pourcentages en slice paths SVG.
function getPiePaths(slices: Slice[], radius: number) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  let startAngle = -90; // commence en haut (12h)
  return slices.map((s) => {
    const sweep = (s.value / total) * 360;
    const endAngle = startAngle + sweep;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    const largeArc = sweep > 180 ? 1 : 0;
    const d = `M 0 0 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    startAngle = endAngle;
    return { d, color: s.color, label: s.label, value: s.value };
  });
}

export default function Slide08() {
  const paths = getPiePaths(SLICES, 90);

  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag>// Levée</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-3"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Nos besoins
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-snow/70 mb-10"
          style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
        >
          Pour passer du proto à 5 écoles partenaires en 12 mois.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie chart */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 md:p-8 border border-night-200 bg-night-soft"
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-4">
              // Répartition de l&rsquo;investissement
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
              <div className="grid place-items-center">
                <svg
                  viewBox="-110 -110 220 220"
                  width="200"
                  height="200"
                  aria-label="Répartition de l'investissement Cap'"
                  role="img"
                >
                  {paths.map((p, i) => (
                    <motion.path
                      key={i}
                      d={p.d}
                      fill={p.color}
                      stroke="var(--night-soft)"
                      strokeWidth="2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    />
                  ))}
                </svg>
              </div>

              <ul className="space-y-2.5">
                {SLICES.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center gap-3 text-sm md:text-base"
                  >
                    <span
                      className="w-4 h-4 rounded-sm shrink-0"
                      style={{ background: s.color }}
                    />
                    <span
                      className="font-display font-bold tabular-nums shrink-0"
                      style={{ color: s.color }}
                    >
                      {s.value}%
                    </span>
                    <span className="text-snow/85 leading-snug">
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Partenaires */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-2">
              Partenaires & soutiens visés
            </h3>
            <p className="text-snow/65 text-sm md:text-base mb-5">
              Pour crédibiliser et démultiplier l&rsquo;impact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PARTNERS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl p-4 border-2 flex items-start gap-3"
                  style={{ borderColor: p.color, background: `${p.color}10` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{
                      background: `${p.color}33`,
                      color: p.color,
                    }}
                  >
                    <p.Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-display font-extrabold text-sm md:text-base leading-tight mb-1"
                      style={{ color: p.color }}
                    >
                      {p.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-snow/60">
                      {p.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SlideContainer>
  );
}
