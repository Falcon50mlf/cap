'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ArrowRight, BarChart3, CheckCircle, ExternalLink, X } from 'lucide-react';
import { SlideContainer, Tag, fadeUp, stagger } from '../slide-utils';

const TIERS = [
  { price: '20€/lead', desc: 'Programmes standard' },
  { price: '25€/lead', desc: 'Programmes avec module gamifié exclusif' },
  { price: '30€/lead', desc: 'Programmes premium / écoles top-tier' },
];

const ACQUISITION = [
  'Partenariats directs avec les écoles',
  'Réseaux sociaux lycéens (TikTok, Instagram)',
  'Bouche à oreille entre lycéens',
  "Prescripteurs : profs, conseillers d'orientation",
];

const CRITERIA = [
  'Titre RNCP enregistré',
  'Certification Qualiopi',
  'Crédits ECTS reconnus',
  'Accréditations internationales (AACSB, EQUIS, AMBA, ou équivalent)',
  "Taux d'insertion professionnelle publié et vérifiable",
  'Réseau alumnis actif et accessible',
];

export default function Slide07() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag color="var(--mint)">// Business model</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-8"
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
        >
          Modèle économique
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Revenue */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 border-2"
            style={{
              borderColor: 'var(--mint)',
              background: 'rgba(0,212,168,0.08)',
              boxShadow: '0 0 32px rgba(0,212,168,0.15)',
            }}
          >
            <div
              className="font-mono text-[11px] uppercase tracking-widest mb-2"
              style={{ color: 'var(--mint)' }}
            >
              // Revenue
            </div>
            <h2
              className="font-display font-extrabold text-2xl mb-5"
              style={{ color: 'var(--mint)' }}
            >
              Comment on gagne de l&rsquo;argent
            </h2>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-3 text-snow/90">
                <Check
                  className="w-5 h-5 shrink-0 mt-1"
                  style={{ color: 'var(--mint)' }}
                  strokeWidth={2.5}
                />
                <span className="text-base leading-snug">
                  Affiliation par lead étudiant transmis à l&rsquo;école (avec consentement)
                </span>
              </li>
              <li className="flex items-start gap-3 text-snow/90">
                <Check
                  className="w-5 h-5 shrink-0 mt-1"
                  style={{ color: 'var(--mint)' }}
                  strokeWidth={2.5}
                />
                <span className="text-base leading-snug">
                  3 paliers de prix selon le programme :
                </span>
              </li>
            </ul>
            <div className="space-y-2 ml-8">
              {TIERS.map((t) => (
                <div key={t.price} className="flex items-baseline gap-3 text-sm">
                  <span style={{ color: 'var(--mint)', fontSize: 18 }}>→</span>
                  <span
                    className="font-display font-bold"
                    style={{ color: 'var(--mint)', fontSize: 18 }}
                  >
                    {t.price}
                  </span>
                  <span className="text-snow/70">— {t.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Acquisition */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl p-7 border-2"
            style={{
              borderColor: 'var(--sun)',
              background: 'rgba(255,220,50,0.08)',
              boxShadow: '0 0 32px rgba(255,220,50,0.12)',
            }}
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-2">
              // Acquisition
            </div>
            <h2
              className="font-display font-extrabold text-2xl mb-5"
              style={{ color: 'var(--sun)' }}
            >
              Comment on se fait connaître
            </h2>
            <ul className="space-y-3">
              {ACQUISITION.map((a) => (
                <li key={a} className="flex items-start gap-3 text-snow/90">
                  <ArrowRight
                    className="w-5 h-5 shrink-0 mt-1"
                    style={{ color: 'var(--sun)' }}
                    strokeWidth={2.5}
                  />
                  <span className="text-base leading-snug">{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Indicateurs qualité */}
        <motion.div
          variants={fadeUp}
          className="rounded-3xl p-6 md:p-7 border-2 mb-4"
          style={{
            borderColor: 'var(--pivot)',
            background: 'rgba(140,110,255,0.08)',
            boxShadow: '0 0 32px rgba(140,110,255,0.15)',
          }}
        >
          <h3
            className="font-display font-extrabold text-xl md:text-2xl mb-4"
            style={{ color: 'var(--pivot)' }}
          >
            Nos indicateurs qualité & performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                style={{
                  background: 'rgba(140,110,255,0.18)',
                  color: 'var(--pivot)',
                }}
              >
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-snow text-base md:text-lg">
                  Enquête de réorientation à 1, 2 et 3 ans
                </div>
                <div className="text-snow/65 text-sm">
                  Auprès des étudiants ayant utilisé Cap&rsquo;
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                style={{
                  background: 'rgba(140,110,255,0.18)',
                  color: 'var(--pivot)',
                }}
              >
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-snow text-base md:text-lg">
                  Enquête qualité écoles
                </div>
                <div className="text-snow/65 text-sm">Sur la pertinence des leads transmis</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          variants={fadeUp}
          onClick={() => setOpenModal(true)}
          className="self-start inline-flex items-center gap-2 border border-sun/50 text-sun font-semibold px-5 py-3 rounded-2xl hover:bg-sun/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Voir nos critères de sélection des écoles partenaires →
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpenModal(false)}
            className="fixed inset-0 z-[200] grid place-items-center px-4 py-10 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.78)' }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-night-soft border border-night-200 rounded-3xl p-7 md:p-9 my-auto"
              style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-2">
                    // Standards Cap&rsquo;
                  </div>
                  <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight">
                    Critères de sélection
                    <br />
                    des écoles partenaires
                  </h2>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  aria-label="Fermer"
                  className="p-2 rounded-xl border border-night-200 hover:bg-night-100 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-snow/70 mb-6">
                Cap<span style={{ color: 'var(--sun)' }}>&rsquo;</span> ne référence que des écoles
                qui respectent des standards stricts.
              </p>

              <ul className="space-y-3 mb-6">
                {CRITERIA.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 shrink-0 mt-1"
                      style={{ color: 'var(--mint)' }}
                      strokeWidth={2.5}
                    />
                    <span className="text-snow/90 leading-snug">{c}</span>
                  </li>
                ))}
              </ul>

              <p className="text-snow/60 text-sm italic border-t border-night-200 pt-4">
                Ces critères garantissent que les leads que tu envoies vont à des étudiants qui
                choisiront en connaissance de cause.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideContainer>
  );
}
