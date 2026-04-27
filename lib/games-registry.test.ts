import { describe, expect, it } from 'vitest';
import { GAMES, getGame, getGamesByFamily } from './games-registry';

describe('games-registry', () => {
  describe('getGame', () => {
    it('returns the game when id is known', () => {
      const game = getGame('mapping-concurrentiel');
      expect(game).toBeDefined();
      expect(game?.name).toBe('Mapping Concurrentiel');
      expect(game?.family).toBe('marketing');
    });

    it('returns undefined for an unknown id', () => {
      expect(getGame('does-not-exist')).toBeUndefined();
    });
  });

  describe('getGamesByFamily', () => {
    it('returns all marketing games sorted by order', () => {
      const games = getGamesByFamily('marketing');
      expect(games).toHaveLength(7);
      // Sorted by order ascending
      const orders = games.map((g) => g.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      // First one is the one with order 1
      expect(games[0]?.id).toBe('mapping-concurrentiel');
    });

    it('returns the 4 UCL games', () => {
      const games = getGamesByFamily('programs-ucl');
      expect(games).toHaveLength(4);
      const ids = games.map((g) => g.id);
      expect(ids).toEqual([
        'ucl-entreprise-explorer',
        'ucl-statut-quiz',
        'ucl-pestel-match',
        'ucl-market-radar',
      ]);
    });

    it('returns an empty array for an unknown family', () => {
      expect(getGamesByFamily('inexistante')).toEqual([]);
    });
  });

  describe('GAMES integrity', () => {
    it('every available game has a positive totalRounds', () => {
      const available = GAMES.filter((g) => g.status === 'available');
      expect(available.length).toBeGreaterThan(0);
      for (const game of available) {
        expect(game.totalRounds).toBeGreaterThan(0);
      }
    });

    it('every game id is unique', () => {
      const ids = GAMES.map((g) => g.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
