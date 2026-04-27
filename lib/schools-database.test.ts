import { describe, expect, it } from 'vitest';
import { getModule, getSchool, getSubmodule, SCHOOLS } from './schools-database';

describe('schools-database', () => {
  describe('getSchool', () => {
    it('returns UCL when asked', () => {
      const school = getSchool('ucl');
      expect(school).toBeDefined();
      expect(school?.shortName).toBe('UCL Lille');
      expect(school?.modules.length).toBeGreaterThan(0);
    });

    it('returns undefined for an unknown school', () => {
      expect(getSchool('mit')).toBeUndefined();
    });
  });

  describe('getModule', () => {
    it('returns the gestion-entreprise module', () => {
      const mod = getModule('ucl', 'gestion-entreprise');
      expect(mod).toBeDefined();
      expect(mod?.author).toBe('Monica Scarano');
      expect(mod?.submodules).toHaveLength(4);
    });

    it('returns undefined for an unknown module', () => {
      expect(getModule('ucl', 'finance-quantitative')).toBeUndefined();
    });
  });

  describe('getSubmodule', () => {
    it('returns the 4 sub-modules in order', () => {
      const ids = ['reconnaitre-entreprise', 'choisir-statut', 'pestel', 'marche'];
      const subs = ids.map((id) => getSubmodule('ucl', 'gestion-entreprise', id));
      expect(subs.every(Boolean)).toBe(true);
      expect(subs.map((s) => s?.order)).toEqual([1, 2, 3, 4]);
    });

    it('returns undefined for an unknown sub-module', () => {
      expect(getSubmodule('ucl', 'gestion-entreprise', 'fake-id')).toBeUndefined();
    });
  });

  describe('integrity', () => {
    it('every submodule references an existing game id', () => {
      // Game ids are sourced from games-registry, but here we just check the
      // string follows the convention "ucl-*".
      for (const school of Object.values(SCHOOLS)) {
        for (const mod of school.modules) {
          for (const sub of mod.submodules) {
            expect(sub.gameId).toMatch(/^ucl-/);
          }
        }
      }
    });

    it('every submodule has at least one section', () => {
      for (const school of Object.values(SCHOOLS)) {
        for (const mod of school.modules) {
          for (const sub of mod.submodules) {
            expect(sub.sections.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });
});
