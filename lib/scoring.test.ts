import { describe, expect, it } from 'vitest';
import { colorForScore, dist2D, matchScore } from './scoring';

describe('scoring helpers', () => {
  describe('dist2D', () => {
    it('returns 0 for identical points', () => {
      expect(dist2D({ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.5 })).toBe(0);
    });

    it('returns √2 for opposite corners of unit square', () => {
      expect(dist2D({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(Math.SQRT2, 5);
    });
  });

  describe('matchScore', () => {
    it('gives 100 when distance is 0', () => {
      expect(matchScore(0)).toBe(100);
    });

    it('gives 0 when distance ≥ √2', () => {
      expect(matchScore(Math.SQRT2)).toBe(0);
      expect(matchScore(2)).toBe(0);
    });

    it('decreases monotonically with distance', () => {
      const a = matchScore(0.1);
      const b = matchScore(0.5);
      const c = matchScore(1.0);
      expect(a).toBeGreaterThan(b);
      expect(b).toBeGreaterThan(c);
    });
  });

  describe('colorForScore', () => {
    it.each([
      [100, 'mint'],
      [80, 'mint'],
      [70, 'mint'],
      [69, 'sun'],
      [50, 'sun'],
      [45, 'sun'],
      [44, 'coral'],
      [10, 'coral'],
      [0, 'coral'],
    ])('score %d → %s', (score, expected) => {
      expect(colorForScore(score)).toBe(expected);
    });
  });
});
