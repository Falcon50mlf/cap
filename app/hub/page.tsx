'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, LogOut, Compass, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export default function HubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

      setEmail(user.email ?? '');

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (!p?.role) {
        router.replace('/onboarding');
        return;
      }

      setProfile(p);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading || !profile) {
    return (
      <main className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-snow/50" />
      </main>
    );
  }

  const roleLabel = profile.role === 'lyceen' ? 'Lycéen·ne' : 'Jeune diplômé·e';
  const roleAccent = profile.role === 'lyceen' ? 'var(--sun)' : 'var(--pivot)';

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-widest text-night-500">
            // {email}
          </span>
          <ThemeToggle />
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm text-snow/60 hover:text-snow border border-night-200 rounded-2xl px-4 py-2 transition-colors hover:border-night-500"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-10 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="mt-8 mb-16"
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-3"
              style={{ color: roleAccent }}
            >
              // {roleLabel}
            </div>
            <h1
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              Salut. <span className="text-snow/40">Choisis ton</span>{' '}
              <span className="text-sun" style={{ fontStyle: 'italic' }}>
                cap
              </span>
              .
            </h1>
            <p className="mt-6 text-snow/60 text-lg max-w-xl">
              Deux univers t&rsquo;attendent. Tu peux passer de l&rsquo;un à l&rsquo;autre quand tu
              veux.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15,
                type: 'spring',
                stiffness: 90,
                damping: 16,
              }}
            >
              <UniverseCard
                href="/decouverte"
                color="var(--sun)"
                Icon={Compass}
                tag="// UNIVERS 01"
                title="Découverte"
                body="Explore les 6 familles de métiers post-école de commerce. Des mini-jeux, des fiches secteurs, et un réseau de bénévoles."
                cta="Lancer"
                stats="6 familles · 30 métiers"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.25,
                type: 'spring',
                stiffness: 90,
                damping: 16,
              }}
            >
              <UniverseCard
                href="/programmes/ucl/gestion-entreprise"
                color="var(--pivot)"
                Icon={GraduationCap}
                tag="// UNIVERS 02"
                title="Programmes"
                body="Teste les modules de cours emblématiques des écoles partenaires. UCL Lille est dispo. D'autres arrivent."
                cta="Découvrir"
                stats="1 école · 1 module dispo"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-8 border-t border-night-200 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-night-500">
            // Donne-toi un cap.
          </span>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link href="/criteres" className="text-snow/60 hover:text-snow transition-colors">
              Critères de sélection des écoles
            </Link>
            <a
              href="mailto:team@cap.app?subject=Devenir%20b%C3%A9n%C3%A9vole"
              className="text-snow/60 hover:text-snow transition-colors"
            >
              Devenir bénévole
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function UniverseCard({
  href,
  color,
  Icon,
  tag,
  title,
  body,
  cta,
  stats,
}: {
  href: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  body: string;
  cta: string;
  stats: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block p-8 md:p-10 rounded-3xl border-2 overflow-hidden transition-shadow hover:shadow-card h-full"
      style={{
        borderColor: color,
        background: `linear-gradient(135deg, ${color}1f, ${color}06)`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl grid place-items-center mb-8"
        style={{ background: `${color}33`, color }}
      >
        <Icon className="w-7 h-7" />
      </div>

      <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color }}>
        {tag}
      </div>
      <h2
        className="font-display font-extrabold tracking-tight mb-4"
        style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color }}
      >
        {title}
      </h2>
      <p className="text-snow/70 text-base md:text-lg leading-relaxed mb-10 max-w-md">{body}</p>

      <div className="flex items-center justify-between border-t border-night-200 pt-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
          {stats}
        </span>
        <span className="inline-flex items-center gap-2 font-bold text-sm" style={{ color }}>
          {cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
