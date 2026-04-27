'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Quote,
  Sparkles,
  X,
} from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { getSchool } from '@/lib/schools-database';
import { createClient } from '@/lib/supabase/client';

const ACCENT = 'var(--pivot)';
const SUBMODULE_GAME_IDS = [
  'ucl-entreprise-explorer',
  'ucl-statut-quiz',
  'ucl-pestel-match',
  'ucl-market-radar',
];

type SkillsAccum = {
  analyse: number;
  rigueur: number;
  strategie: number;
  communication: number;
};

type LocalGameResult = {
  game_id: string;
  family_id: string;
  skills?: Record<string, number>;
  score?: number | null;
  duration_ms?: number | null;
  completed_at?: string;
};

export default function UclTerminePage() {
  const school = getSchool('ucl');
  const [stats, setStats] = useState<{
    skills: SkillsAccum;
    avgScore: number;
    completed: number;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cap.game_results');
      const all = (JSON.parse(raw ?? '[]') as LocalGameResult[]).filter(
        (r) => r.family_id === 'programs-ucl',
      );
      const last4 = SUBMODULE_GAME_IDS.map(
        (id) => [...all].reverse().find((r) => r.game_id === id) ?? null,
      ).filter(Boolean) as LocalGameResult[];

      const skills: SkillsAccum = { analyse: 0, rigueur: 0, strategie: 0, communication: 0 };
      let scoreSum = 0;
      last4.forEach((r) => {
        const s = r.skills ?? {};
        skills.analyse += Number(s.analyse ?? 0);
        skills.rigueur += Number(s.rigueur ?? 0);
        skills.strategie += Number(s.strategie ?? 0);
        skills.communication += Number(s.communication ?? 0);
        scoreSum += Number(r.score ?? 0);
      });
      const completed = last4.length;
      // Cap each skill at 100
      (Object.keys(skills) as (keyof SkillsAccum)[]).forEach((k) => {
        skills[k] = Math.min(100, Math.round(skills[k] / Math.max(1, completed)));
      });
      setStats({
        skills,
        avgScore: completed > 0 ? Math.round(scoreSum / completed) : 0,
        completed,
      });
    } catch {
      setStats({
        skills: { analyse: 0, rigueur: 0, strategie: 0, communication: 0 },
        avgScore: 0,
        completed: 0,
      });
    }
  }, []);

  if (!school) return null;

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

      {/* Hero célébration */}
      <section className="px-6 md:px-10 pt-8 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 140,
                damping: 12,
                delay: 0.15,
              }}
              className="w-20 h-20 rounded-3xl grid place-items-center mb-6"
              style={{ background: 'var(--mint)', color: 'var(--night)' }}
            >
              <Sparkles className="w-10 h-10" strokeWidth={2.5} />
            </motion.div>

            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Module terminé · UCL Lille
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] mb-6"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              Bravo. Tu as terminé le module.
            </h1>
            <p className="text-snow/70 text-lg md:text-xl max-w-2xl leading-relaxed">
              Tu as maintenant les fondamentaux pour reconnaître une entreprise, choisir le bon
              statut, analyser un environnement et comprendre un marché. Voici ce que tu as
              accumulé.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="px-6 md:px-10 pb-16 border-y border-night-200 bg-night-soft">
          <div className="max-w-[1100px] mx-auto pt-12">
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-4"
              style={{ color: ACCENT }}
            >
              // Tes résultats
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatBox
                label="Score moyen"
                value={`${stats.avgScore}`}
                unit="/100"
                color="var(--sun)"
              />
              <StatBox
                label="Sous-modules"
                value={`${stats.completed}`}
                unit="/4"
                color="var(--mint)"
              />
              <StatBox
                label="Niveau analyse"
                value={`${stats.skills.analyse}`}
                unit="/100"
                color={ACCENT}
              />
              <StatBox
                label="Niveau rigueur"
                value={`${stats.skills.rigueur}`}
                unit="/100"
                color="#3B82F6"
              />
            </div>
          </div>
        </section>
      )}

      {/* Présentation UCL */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-[1100px] mx-auto">
          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-3"
            style={{ color: ACCENT }}
          >
            // Pour aller plus loin
          </div>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Avec l&rsquo;UCL Lille.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div
              className="rounded-3xl p-7 border-2"
              style={{ borderColor: ACCENT, background: `${ACCENT}0a` }}
            >
              <div
                className="font-display font-extrabold text-2xl tracking-tight mb-3"
                style={{ color: ACCENT }}
              >
                {school.name}
              </div>
              <p className="text-snow/80 leading-relaxed mb-5">{school.description}</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Fondée en" value={school.founded} />
                <Chip label="Étudiants" value={school.studentsCount} />
              </div>
            </div>

            <div className="rounded-3xl p-7 border border-night-200 bg-night-soft">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5" style={{ color: ACCENT }} />
                <div
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: ACCENT }}
                >
                  // Programmes liés
                </div>
              </div>
              <ul className="space-y-2.5">
                {school.programs.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-snow/85">
                    <span className="font-display font-semibold">{p.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
                      {p.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Témoignage */}
          <div
            className="rounded-3xl p-7 border-l-4 bg-night-soft"
            style={{ borderLeftColor: ACCENT }}
          >
            <Quote className="w-6 h-6 mb-3" style={{ color: ACCENT }} />
            <p className="text-snow/85 italic text-lg leading-relaxed mb-4 font-light">
              &ldquo;{school.testimonial.quote}&rdquo;
            </p>
            <div className="font-display font-bold text-snow">
              {school.testimonial.name}
              <span className="font-normal text-snow/60 ml-2 text-base">
                · {school.testimonial.year}
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-snow/50 mt-1">
              {school.testimonial.current}
            </div>
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section className="px-6 md:px-10 py-16 border-t border-night-200 bg-night-soft">
        <div className="max-w-[760px] mx-auto">
          <LeadForm />
        </div>
      </section>
    </main>
  );
}

function StatBox({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div
      className="rounded-3xl p-5 border-2 text-center"
      style={{ borderColor: color, background: `${color}10` }}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-snow/60 mb-2">
        {label}
      </div>
      <div
        className="font-display font-extrabold tracking-tight leading-none"
        style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color }}
      >
        {value}
        <span className="text-base text-snow/40">{unit}</span>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-1.5 rounded-full border border-night-200 bg-night/40 text-sm">
      <span className="font-mono text-[10px] uppercase tracking-wider text-snow/50 mr-2">
        {label}
      </span>
      <span className="font-display font-bold text-snow">{value}</span>
    </div>
  );
}

// ─── LeadForm ─────────────────────────────────────────────────────────────
function LeadForm() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    niveau: '',
    interest: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from('leads').insert({
      school_name: 'UCL Lille',
      contact_first_name: form.first_name,
      contact_last_name: form.last_name,
      contact_email: form.email,
      contact_role: form.niveau || null,
      message:
        `[Étudiant·e intéressé·e après le module Gestion d'entreprise] ` +
        `Niveau : ${form.niveau || 'non précisé'}. ` +
        `Centre d'intérêt : ${form.interest || 'non précisé'}.`,
      source: 'ucl-gestion-entreprise-student',
    });

    setLoading(false);
    if (insertError) {
      setError("Impossible d'envoyer ta demande. Réessaie ou écris à team@cap.app.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-3xl grid place-items-center"
          style={{ background: 'var(--mint)', color: 'var(--night)' }}
        >
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
          C&rsquo;est envoyé.
        </h2>
        <p className="text-snow/75 mb-2">L&rsquo;UCL te recontactera sous 7 jours.</p>
        <p className="font-mono text-snow text-sm mb-8 break-all">{form.email}</p>
        <Link
          href="/hub"
          className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-6 py-3 rounded-2xl transition-transform hover:scale-[1.02]"
        >
          Retour au hub
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div>
      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // Te faire recontacter par l&rsquo;UCL
      </div>
      <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
        Envie d&rsquo;en savoir plus ?
      </h2>
      <p className="text-snow/70 mb-8 max-w-lg">
        Laisse tes coordonnées, l&rsquo;équipe orientation de l&rsquo;UCL te répondra sous 7 jours.
        Aucun spam, aucune donnée vendue.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            placeholder="Prénom *"
            required
            value={form.first_name}
            onChange={(v) => set('first_name', v)}
            disabled={loading}
          />
          <Field
            placeholder="Nom *"
            required
            value={form.last_name}
            onChange={(v) => set('last_name', v)}
            disabled={loading}
          />
        </div>
        <Field
          type="email"
          placeholder="Email *"
          required
          value={form.email}
          onChange={(v) => set('email', v)}
          disabled={loading}
          Icon={Mail}
        />
        <Select
          value={form.niveau}
          onChange={(v) => set('niveau', v)}
          disabled={loading}
          placeholder="Niveau d'études actuel *"
          required
          options={[
            'Seconde / Première / Terminale',
            'Bac obtenu / en attente',
            'L1 / L2 / L3 en cours',
            'M1 / M2 en cours',
            'Diplômé·e cherchant à se réorienter',
          ]}
          Icon={GraduationCap}
        />
        <Select
          value={form.interest}
          onChange={(v) => set('interest', v)}
          disabled={loading}
          placeholder="Centre d'intérêt principal *"
          required
          options={[
            'Gestion / management',
            'Entrepreneuriat',
            "Finance d'entreprise",
            'Marketing / communication',
            'Je ne sais pas encore',
          ]}
          Icon={Award}
        />

        {error && (
          <div className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-coral text-sm flex items-start gap-2">
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            !form.first_name ||
            !form.last_name ||
            !form.email ||
            !form.niveau ||
            !form.interest
          }
          className="w-full inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-7 py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
          style={{ boxShadow: loading ? 'none' : '0 0 24px var(--pivot)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              Être recontacté·e par l&rsquo;UCL
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="font-mono text-[10px] uppercase tracking-widest text-night-500 text-center pt-2">
          // RGPD compliant. Tes données ne sont transmises qu&rsquo;à l&rsquo;UCL Lille.
        </p>
      </form>
    </div>
  );
}

function Field({
  Icon,
  ...props
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-snow/40 pointer-events-none" />
      )}
      <input
        type={props.type ?? 'text'}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={`w-full bg-night border border-night-200 rounded-2xl ${Icon ? 'pl-12' : 'pl-5'} pr-5 py-4 text-base font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50`}
      />
    </div>
  );
}

function Select({
  Icon,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  disabled: boolean;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-snow/40 pointer-events-none" />
      )}
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-night border border-night-200 rounded-2xl ${Icon ? 'pl-12' : 'pl-5'} pr-5 py-4 text-base font-sans focus:outline-none focus:border-snow transition-colors disabled:opacity-50 appearance-none ${value ? 'text-snow' : 'text-snow/40'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-snow bg-night-soft">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
