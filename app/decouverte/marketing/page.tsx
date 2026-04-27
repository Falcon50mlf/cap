'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, Gamepad2, Megaphone, Users } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { FAMILIES } from '@/lib/families-database';

const FAMILY = FAMILIES.marketing;
const ACCENT = 'var(--family-marketing)';

export default function MarketingFichePage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/decouverte"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Découverte
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-8 pb-20">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Famille 03 / 06 · Univers Découverte
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] mb-6"
              style={{ fontSize: 'clamp(56px, 9vw, 130px)', color: ACCENT }}
            >
              Marketing
              <br />& Brand.
            </h1>
            <p className="text-snow text-xl md:text-2xl leading-relaxed max-w-2xl mb-10 font-light">
              {FAMILY.tagline}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Stat label="Mini-jeux" value={FAMILY.nbJeux.toString()} />
              <Stat label="Métiers" value={FAMILY.nbMetiers.toString()} />
              <Stat label="Bénévoles" value={FAMILY.nbBenevoles.toString()} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/decouverte/marketing/jeux"
                className="inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-7 py-4 rounded-2xl transition-transform hover:scale-[1.02]"
                style={{ boxShadow: '0 0 24px var(--sun)' }}
              >
                <Gamepad2 className="w-5 h-5" />
                Tester avec 7 mini-jeux
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/decouverte/marketing/metiers"
                className="inline-flex items-center justify-center gap-2 border border-night-200 text-snow font-semibold px-7 py-4 rounded-2xl hover:bg-night-100 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Voir les 5 métiers
              </Link>
              <Link
                href="/decouverte/marketing/benevoles"
                className="inline-flex items-center justify-center gap-2 border border-night-200 text-snow font-semibold px-7 py-4 rounded-2xl hover:bg-night-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                Échanger avec bénévoles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO ──────────────────────────────────────────────────── */}
      <Section>
        <div className="max-w-[820px]">
          <Tag>// C&rsquo;est quoi ?</Tag>
          <p
            className="text-snow text-2xl md:text-3xl leading-relaxed font-light"
            style={{ letterSpacing: '-0.01em' }}
          >
            {FAMILY.intro}
          </p>
        </div>
      </Section>

      {/* ── QUOTIDIEN ──────────────────────────────────────────────── */}
      <Section bg="soft">
        <Tag>// Le quotidien</Tag>
        <H2>4 scènes de la vie pro.</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          {FAMILY.quotidien?.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 90, damping: 16 }}
              className="p-6 rounded-3xl border border-night-200 bg-night-200"
            >
              <div
                className="font-mono text-[10px] uppercase tracking-widest mb-3"
                style={{ color: ACCENT }}
              >
                Scène {(i + 1).toString().padStart(2, '0')}
              </div>
              <h3 className="font-display font-bold text-xl mb-3 tracking-tight">{q.title}</h3>
              <p className="text-snow/70 leading-relaxed">{q.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── SALAIRES ───────────────────────────────────────────────── */}
      <Section>
        <Tag>// Combien tu gagnes</Tag>
        <H2>Les salaires, sans flou.</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {FAMILY.salaires?.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 90, damping: 16 }}
              className="p-6 rounded-3xl border-2"
              style={{ borderColor: ACCENT, background: `${ACCENT}10` }}
            >
              <div
                className="font-mono text-[10px] uppercase tracking-widest mb-3"
                style={{ color: ACCENT }}
              >
                {s.label}
              </div>
              <div
                className="font-display font-extrabold mb-3 tracking-tight"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: ACCENT }}
              >
                {s.range}
              </div>
              <p className="text-snow/70 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-night-500">
          // Brut annuel France · variable + bonus inclus dans les ranges senior
        </p>
      </Section>

      {/* ── PARCOURS ───────────────────────────────────────────────── */}
      <Section bg="soft">
        <Tag>// Comment on y arrive</Tag>
        <H2>Le parcours type.</H2>
        <div className="mt-12 space-y-4">
          {FAMILY.parcours?.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 90, damping: 16 }}
              className="flex items-start gap-5"
            >
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center font-display font-extrabold text-xl shrink-0"
                style={{ background: `${ACCENT}33`, color: ACCENT }}
              >
                {p.step.toString().padStart(2, '0')}
              </div>
              <div className="flex-1 pt-1.5 pb-6 border-b border-night-200 last:border-0">
                <h3 className="font-display font-bold text-xl mb-1 tracking-tight">{p.title}</h3>
                <p className="text-snow/70 leading-relaxed">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── ENTREPRISES ────────────────────────────────────────────── */}
      <Section>
        <Tag>// Où tu peux atterrir</Tag>
        <H2>15 entreprises qui recrutent.</H2>
        <div className="mt-10 flex flex-wrap gap-2">
          {FAMILY.topEntreprises?.map((e) => (
            <span
              key={e}
              className="px-4 py-2 rounded-2xl border border-night-200 bg-night-soft text-snow/80 font-display font-semibold text-base hover:border-snow transition-colors"
            >
              {e}
            </span>
          ))}
        </div>
      </Section>

      {/* ── SOFT SKILLS ────────────────────────────────────────────── */}
      <Section bg="soft">
        <Tag>// Ce que ça demande</Tag>
        <H2>Les soft skills clés.</H2>
        <div className="mt-10 flex flex-wrap gap-3">
          {FAMILY.softSkills?.map((s) => (
            <div
              key={s}
              className="px-5 py-3 rounded-2xl border-2 font-display font-bold"
              style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}10` }}
            >
              {s}
            </div>
          ))}
        </div>
      </Section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[820px] mx-auto text-center">
          <Tag>// Prêt à tester ?</Tag>
          <h2
            className="font-display font-extrabold tracking-[-0.03em] leading-[0.95] mt-3 mb-8"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            7 mini-jeux pour comprendre le marketing par la main.
          </h2>
          <Link
            href="/decouverte/marketing/jeux"
            className="inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-8 py-5 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
            style={{ boxShadow: '0 0 24px var(--sun)' }}
          >
            <Megaphone className="w-5 h-5" />
            Tester maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Section({
  children,
  bg = 'default',
}: {
  children: React.ReactNode;
  bg?: 'default' | 'soft';
}) {
  return (
    <section
      className={`px-6 md:px-10 py-20 md:py-28 ${bg === 'soft' ? 'bg-night-soft border-y border-night-200' : ''}`}
    >
      <div className="max-w-[1100px] mx-auto">{children}</div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
      {children}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-extrabold tracking-[-0.03em] leading-[0.95]"
      style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}
    >
      {children}
    </h2>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-night-200 bg-night-soft">
      <span
        className="font-display font-extrabold text-2xl tracking-tight"
        style={{ color: ACCENT }}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-snow/60">{label}</span>
    </div>
  );
}
