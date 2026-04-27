'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { PartnershipDialog } from './partnership-dialog';

export function PartnershipSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 border-y border-night-200 overflow-hidden">
      {/* Lueur violette discrète */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,110,255,0.15), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,110,255,0.10), transparent 70%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-widest text-pivot mb-3">
              // Pour les écoles
            </div>
            <h2
              className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Tu diriges une <span style={{ color: 'var(--pivot)' }}>école</span> ?
            </h2>
            <p className="text-snow/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
              Cap&rsquo; transforme tes modules de cours en mini-jeux jouables en 5 minutes. Tu
              gagnes en visibilité et tu collectes des leads étudiants qualifiés.
            </p>

            <div className="space-y-3 mb-10">
              <Bullet Icon={Sparkles} text="On rebrande chaque mini-jeu à tes couleurs" />
              <Bullet Icon={TrendingUp} text="Tu accèdes aux profils des étudiants qui ont joué" />
              <Bullet Icon={Building2} text="On gère le contenu pédagogique avec tes profs" />
            </div>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 bg-pivot text-snow font-bold px-8 py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02] active:scale-[0.99]"
              style={{ boxShadow: '0 0 24px var(--pivot)' }}
            >
              Devenir partenaire
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Visuel à droite : devis-like card */}
          <div className="lg:col-span-5 relative h-[400px]">
            <motion.div
              initial={{ rotate: 0, scale: 0.95 }}
              whileInView={{ rotate: -3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 70 }}
              className="absolute inset-0 bg-night-soft border-2 border-pivot/40 rounded-3xl p-7 shadow-card"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-pivot mb-5">
                // Échantillon · UCL Lille
              </div>
              <div className="font-display font-extrabold text-2xl mb-3 leading-tight">
                Module
                <br />
                Gestion d&rsquo;entreprise
              </div>
              <div className="space-y-2 text-snow/70 text-sm mb-6">
                <Row label="Format" value="Mini-jeu interactif 8 min" />
                <Row label="Mécanique" value="Construction Canvas" />
                <Row label="Branding" value="Aux couleurs de l'école" />
                <Row label="Leads collectés" value="Coordonnées + niveau" />
              </div>
              <div className="border-t border-night-200 pt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
                  Time to Live
                </span>
                <span className="font-display font-bold" style={{ color: 'var(--pivot)' }}>
                  21 jours
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <PartnershipDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function Bullet({
  Icon,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-xl grid place-items-center shrink-0 mt-0.5"
        style={{
          background: 'rgba(140,110,255,0.15)',
          color: 'var(--pivot)',
        }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-snow/80 text-base leading-relaxed pt-1">{text}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50 shrink-0">
        {label}
      </span>
      <span className="text-right">{value}</span>
    </div>
  );
}
