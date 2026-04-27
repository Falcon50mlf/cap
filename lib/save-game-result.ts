import { createClient } from '@/lib/supabase/client';
import type { FamilyId, Skills } from '@/types/games';

export type SaveGameResultArgs = {
  gameId: string;
  family: FamilyId;
  skills: Skills;
  enjoyment: number; // 1..5
  score?: number; // 0..100
  durationMs?: number;
  payload?: unknown;
};

// Sauve le résultat d'un mini-jeu :
// - Si user loggé → insert dans Supabase (RLS OK car user_id = self)
// - Si invité (pas de session) → insert avec user_id null + duplicate
//   localStorage pour persistance locale.
export async function saveGameResult(args: SaveGameResultArgs) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row = {
    user_id: user?.id ?? null,
    game_id: args.gameId,
    family_id: args.family,
    skills: args.skills as Record<string, number>,
    enjoyment: args.enjoyment,
    score: args.score ?? null,
    duration_ms: args.durationMs ?? null,
    payload: (args.payload ?? null) as Record<string, unknown> | null,
  };

  const { error } = await supabase.from('game_results').insert(row);
  if (error) {
    console.error('[saveGameResult] supabase error', error);
  }

  // Backup localStorage pour le mode invité (et historique offline)
  try {
    const key = 'cap.game_results';
    const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as object[];
    prev.push({ ...row, completed_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
  } catch {
    // localStorage indispo (private mode, etc.) — silent fail
  }

  return { error };
}
