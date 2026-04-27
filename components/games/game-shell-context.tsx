'use client';

import { createContext, useContext } from 'react';
import type { Skills } from '@/types/games';

export type GameShellAPI = {
  setRound: (current: number) => void;
  complete: (skills: Skills, score?: number, payload?: unknown) => void;
};

export const GameShellContext = createContext<GameShellAPI | null>(null);

export function useGameShell(): GameShellAPI {
  const ctx = useContext(GameShellContext);
  if (!ctx) throw new Error('useGameShell doit être utilisé dans <GameShell>');
  return ctx;
}
