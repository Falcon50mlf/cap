'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SlideContainer, Tag, fadeUp, stagger } from '../slide-utils';

type Competitor = {
  name: string;
  isCap?: boolean;
};

const COMPETITORS: Competitor[] = [
  { name: 'Open Classroom' },
  { name: "Conseillers d'orientation" },
  { name: 'Hello Charly' },
  { name: 'Direct Diplomeo' },
  { name: "Cap'", isCap: true },
];

const ROWS: { label: string; checks: boolean[] }[] = [
  // Order : Open Classroom, Conseillers, Hello Charly, Direct Diplomeo, Cap'
  {
    label: 'Renseignements sur les formations',
    checks: [false, true, true, true, true],
  },
  {
    label: 'Liste des métiers liés',
    checks: [false, true, true, true, true],
  },
  {
    label: 'Contact direct avec les écoles',
    checks: [false, false, true, true, true],
  },
  {
    label: 'Test des cours',
    checks: [true, false, false, false, true],
  },
  {
    label: 'Ludique',
    checks: [false, false, false, false, true],
  },
];

export default function Slide03() {
  return (
    <SlideContainer>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center max-w-[1300px] mx-auto w-full"
      >
        <Tag color="var(--pivot)">// Concurrence</Tag>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-10"
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
        >
          Benchmark
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="overflow-x-auto rounded-3xl border-2"
          style={{ borderColor: 'var(--sun)' }}
        >
          <table className="w-full border-collapse" style={{ minWidth: 760 }}>
            {/* Header row */}
            <thead>
              <tr>
                <th
                  className="text-left p-4 font-display font-bold text-snow"
                  style={{
                    background: 'var(--pivot)',
                    borderRight: '1px solid rgba(255,220,50,0.3)',
                  }}
                >
                  Critère
                </th>
                {COMPETITORS.map((c, i) => (
                  <th
                    key={c.name}
                    className="text-center p-4 font-display font-bold whitespace-nowrap"
                    style={{
                      background: c.isCap ? 'var(--sun)' : 'var(--pivot)',
                      color: c.isCap ? '#0E0E10' : 'var(--snow)',
                      borderRight:
                        i < COMPETITORS.length - 1 ? '1px solid rgba(255,220,50,0.3)' : undefined,
                      boxShadow: c.isCap ? '0 0 24px rgba(255,220,50,0.4)' : undefined,
                    }}
                  >
                    {c.isCap ? (
                      <>
                        Cap
                        <span style={{ color: '#0E0E10', fontWeight: 900 }}>’</span>
                      </>
                    ) : (
                      c.name
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td
                    className="p-4 font-display font-bold text-snow text-sm md:text-base"
                    style={{
                      background: 'var(--pivot)',
                      borderTop: '1px solid rgba(255,220,50,0.2)',
                      borderRight: '1px solid rgba(255,220,50,0.3)',
                    }}
                  >
                    {row.label}
                  </td>
                  {row.checks.map((checked, ci) => {
                    const isCapColumn = ci === COMPETITORS.length - 1;
                    return (
                      <td
                        key={ci}
                        className="p-4 text-center"
                        style={{
                          background: isCapColumn ? 'rgba(255,220,50,0.06)' : 'var(--night)',
                          borderTop: '1px solid rgba(255,220,50,0.2)',
                          borderRight:
                            ci < row.checks.length - 1
                              ? '1px solid rgba(255,220,50,0.15)'
                              : undefined,
                        }}
                      >
                        {checked && (
                          <Check
                            className="w-7 h-7 md:w-8 md:h-8 mx-auto"
                            strokeWidth={3}
                            style={{
                              color: isCapColumn ? 'var(--sun)' : 'var(--snow)',
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-snow/85 font-semibold italic mt-8 max-w-3xl"
          style={{
            fontSize: 'clamp(18px, 1.8vw, 24px)',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          Cap
          <span style={{ color: 'var(--sun)' }}>&rsquo;</span> est la SEULE plateforme qui combine{' '}
          <span style={{ color: 'var(--sun)' }}>ludique</span> +{' '}
          <span style={{ color: 'var(--sun)' }}>test des cours</span> +{' '}
          <span style={{ color: 'var(--sun)' }}>contact écoles</span>.
        </motion.p>
      </motion.div>
    </SlideContainer>
  );
}
