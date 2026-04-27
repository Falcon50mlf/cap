'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  Layers,
  Megaphone,
  MessageSquare,
  Package,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { getJobsByFamily, type Job } from '@/lib/jobs-database';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Layers,
  TrendingUp,
  MessageSquare,
  Package,
  Briefcase,
};

const ACCENT = 'var(--family-marketing)';

export default function MarketingMetiersPage() {
  const jobs = getJobsByFamily('marketing');

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
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
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
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              5 métiers,
              <br />
              <span className="text-snow/40">5 quotidiens.</span>
            </h1>
          </motion.div>

          <div className="space-y-5">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>

          <div className="mt-16 p-6 rounded-3xl border border-night-200 bg-night-soft text-center">
            <p className="text-snow/60 mb-4">
              Tu veux échanger avec quelqu&rsquo;un qui fait l&rsquo;un de ces métiers ?
            </p>
            <Link
              href="/decouverte/marketing/benevoles"
              className="inline-flex items-center gap-2 text-snow font-semibold underline decoration-sun underline-offset-4"
            >
              Voir les 2 bénévoles Marketing →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const Icon = ICONS[job.iconName] ?? Briefcase;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 90, damping: 16 }}
      className="relative p-6 md:p-8 rounded-3xl border-2 grid grid-cols-1 lg:grid-cols-12 gap-8"
      style={{ borderColor: ACCENT, background: `${ACCENT}10` }}
    >
      <div className="lg:col-span-5">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center mb-5"
          style={{ background: `${ACCENT}33`, color: ACCENT }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h2
          className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2"
          style={{ color: ACCENT }}
        >
          {job.name}
        </h2>
        <p className="text-snow/80 italic mb-5" style={{ fontStyle: 'italic' }}>
          {job.tagline}
        </p>
        <p className="text-snow/70 leading-relaxed mb-6">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <SmallStat label="Junior" value={job.salaire.junior} />
          <SmallStat label="Senior" value={job.salaire.senior} />
        </div>

        <div className="flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] uppercase tracking-wider text-snow/60 bg-night-200 px-2.5 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 lg:border-l lg:border-night-200 lg:pl-8">
        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-3"
          style={{ color: ACCENT }}
        >
          // Une journée type
        </div>
        <ol className="space-y-2 mb-6">
          {job.journeeType.map((j, i) => (
            <li key={i} className="flex items-start gap-3 text-snow/80 text-sm">
              <span className="font-mono font-bold w-12 shrink-0" style={{ color: ACCENT }}>
                {j.hour}
              </span>
              <span className="leading-relaxed">{j.activity}</span>
            </li>
          ))}
        </ol>

        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-2"
          style={{ color: ACCENT }}
        >
          // Parcours type
        </div>
        <p className="text-snow/70 text-sm leading-relaxed">{job.parcours}</p>
      </div>
    </motion.article>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-night-200">
      <div className="font-mono text-[9px] uppercase tracking-widest text-snow/50 mb-1">
        {label}
      </div>
      <div className="font-display font-bold text-lg tracking-tight" style={{ color: ACCENT }}>
        {value}
      </div>
    </div>
  );
}
