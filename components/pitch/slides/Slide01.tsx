'use client';

import { motion } from 'framer-motion';
import { SlideContainer, Tag, fadeUp, stagger } from '../slide-utils';

export default function Slide01() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1100px] mx-auto w-full"
      >
        <Tag>// Le problème</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] mb-6"
          style={{ fontSize: 'clamp(72px, 11vw, 160px)' }}
        >
          1 600 000 <span style={{ color: 'var(--sun)' }}>lycéens</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-snow/70 mb-12 max-w-3xl"
          style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', lineHeight: 1.4 }}
        >
          doivent choisir leur orientation chaque année.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="bg-sun text-night rounded-3xl p-8 md:p-10 mb-12 max-w-3xl"
          style={{ boxShadow: '0 20px 60px rgba(255,220,50,0.25)' }}
        >
          <div className="font-mono text-[11px] uppercase tracking-widest opacity-60 mb-3">
            // Et pourtant
          </div>
          <p
            className="font-display font-extrabold leading-tight"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
          >
            <span style={{ fontSize: '1.3em' }}>35%</span> abandonnent leur formation supérieure dès
            la première année.
          </p>
          <div className="mt-3 font-mono text-sm opacity-60">Mauvaise orientation.</div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-snow/80 italic font-light"
          style={{
            fontSize: 'clamp(20px, 2.5vw, 32px)',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          Et si découvrir ton futur métier prenait{' '}
          <span style={{ color: 'var(--sun)' }}>5 minutes</span> ?
        </motion.p>
      </motion.div>
    </SlideContainer>
  );
}
