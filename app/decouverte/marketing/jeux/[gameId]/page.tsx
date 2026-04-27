'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { GameShell } from '@/components/games/GameShell';
import { gameComponents } from '@/lib/game-components';
import { getGame } from '@/lib/games-registry';

const ACCENT = 'var(--family-marketing)';

export default function MarketingGamePage({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const meta = getGame(gameId);

  if (!meta) notFound();
  if (meta.family !== 'marketing') notFound();

  if (meta.status === 'coming-soon') {
    return <ComingSoon gameId={meta.id} name={meta.name} concept={meta.concept} />;
  }

  const Game = gameComponents[meta.id];
  if (!Game) {
    // Status 'available' mais pas mappé : config bug, on tombe en placeholder.
    return <ComingSoon gameId={meta.id} name={meta.name} concept={meta.concept} />;
  }

  return (
    <GameShell
      gameId={meta.id}
      family={meta.family}
      title={meta.name}
      totalRounds={meta.totalRounds}
      instructions={meta.concept}
      returnHref="/decouverte/marketing/jeux"
    >
      <Game />
    </GameShell>
  );
}

function ComingSoon({ gameId, name, concept }: { gameId: string; name: string; concept: string }) {
  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-3">
          <Link
            href="/decouverte/marketing/jeux"
            className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Mini-jeux Marketing
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="flex-1 grid place-items-center px-6 md:px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          className="text-center max-w-xl"
        >
          <div
            className="w-20 h-20 mx-auto mb-8 rounded-3xl grid place-items-center"
            style={{
              background: `${ACCENT}1f`,
              color: ACCENT,
            }}
          >
            <Lock className="w-9 h-9" />
          </div>

          <div
            className="font-mono text-[11px] uppercase tracking-widest mb-3"
            style={{ color: ACCENT }}
          >
            // #{gameId} · Bientôt
          </div>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            {name}.
          </h1>
          <p className="text-snow/70 text-lg leading-relaxed mb-10">{concept}</p>

          <div
            className="rounded-3xl border-2 p-6 mb-10 text-left"
            style={{ borderColor: ACCENT, background: `${ACCENT}08` }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              // Aperçu
            </div>
            <div className="space-y-3 font-mono text-sm text-snow/70">
              <div className="flex items-center gap-3">
                <span className="text-snow/40">▸</span>3 manches consécutives
              </div>
              <div className="flex items-center gap-3">
                <span className="text-snow/40">▸</span>
                Score de skills à la fin (analyse, créa, comm…)
              </div>
              <div className="flex items-center gap-3">
                <span className="text-snow/40">▸</span>
                Sauvegarde automatique de tes résultats
              </div>
            </div>
          </div>

          <Link
            href="/decouverte/marketing/jeux"
            className="inline-flex items-center gap-2 bg-sun text-night font-bold px-7 py-4 rounded-2xl transition-transform hover:scale-[1.02]"
          >
            Retour aux mini-jeux Marketing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
