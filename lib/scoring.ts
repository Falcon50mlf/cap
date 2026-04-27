// Helpers de scoring partagés entre mini-jeux.
// Extrait pour permettre le test unitaire et la réutilisation.

/** Distance euclidienne entre 2 points 2D. */
export function dist2D(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Convertit une distance dans le plan 0..1 en score 0..100.
 * Distance 0 (identique) = 100. Distance √2 ≈ 1.4142 (aux antipodes) = 0.
 */
export function matchScore(distance: number): number {
  return Math.max(0, Math.round((1 - distance / 1.4142) * 100));
}

/** Couleur conventionnelle Cap' selon un score 0..100. */
export function colorForScore(score: number): 'mint' | 'sun' | 'coral' {
  if (score >= 70) return 'mint';
  if (score >= 45) return 'sun';
  return 'coral';
}
