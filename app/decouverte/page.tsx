'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Cpu,
  Loader2,
  Megaphone,
  Rocket,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import { FAMILY_LIST } from '@/lib/families-database';
import type { Family } from '@/types/database';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Briefcase,
  TrendingUp,
  Cpu,
  Rocket,
  Sparkles,
};

export default function DecouvertePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Auth gate
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-snow/50" />
      </main>
    );
  }

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

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-[1300px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="mt-8 mb-16"
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
              // Univers Découverte
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              6 familles. <span className="text-snow/40">30 métiers.</span>
            </h1>
            <p className="mt-6 text-snow/60 text-lg max-w-xl">
              Pour chacune : des mini-jeux qui simulent le vrai monde pro, une fiche secteur, et des
              bénévoles qui y sont déjà.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAMILY_LIST.map((f, i) => (
              <FamilyCard
                key={f.id}
                family={f.id}
                name={f.name}
                tagline={f.tagline}
                color={f.color}
                iconName={f.icon}
                status={f.status}
                preview={f.metiersPreview ?? []}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FamilyCard({
  family,
  name,
  tagline,
  color,
  iconName,
  status,
  preview,
  index,
}: {
  family: Family;
  name: string;
  tagline: string;
  color: string;
  iconName: string;
  status: 'live' | 'soon';
  preview: string[];
  index: number;
}) {
  const Icon = ICONS[iconName] ?? Briefcase;
  const live = status === 'live';
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index,
        type: 'spring',
        stiffness: 90,
        damping: 16,
      }}
      whileHover={live ? { y: -4 } : undefined}
      className="relative p-7 rounded-3xl border-2 h-full transition-shadow group"
      style={{
        borderColor: color,
        background: `${color}14`,
        opacity: live ? 1 : 0.55,
        cursor: live ? 'pointer' : 'not-allowed',
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center"
          style={{ background: `${color}33`, color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border"
          style={{
            borderColor: live ? 'var(--mint)' : 'var(--night-200)',
            color: live ? 'var(--mint)' : 'var(--night-500)',
            background: live ? 'rgba(0,212,168,0.1)' : 'transparent',
          }}
        >
          {live ? 'Disponible' : 'Bientôt'}
        </span>
      </div>

      <h3 className="font-display font-extrabold text-2xl tracking-tight mb-2" style={{ color }}>
        {name}
      </h3>
      <p className="text-snow/70 text-base leading-snug mb-5">{tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {preview.map((p) => (
          <span
            key={p}
            className="font-mono text-[10px] uppercase tracking-wider text-snow/50 bg-night-200 px-2 py-1 rounded-full"
          >
            {p}
          </span>
        ))}
      </div>

      {live && (
        <div className="mt-6 flex items-center gap-2 font-bold text-sm" style={{ color }}>
          Explorer
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </motion.div>
  );

  return live ? <Link href={`/decouverte/${family}`}>{inner}</Link> : inner;
}
