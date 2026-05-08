-- ============================================================================
-- Migration: add_indexes
-- Couvre: AUDIT-supabase.md M-DB-4 (index sur leads.contact_email pour
--         lookup rapide), M-DB-5 (index sur game_results pour analytics)
-- Date: 2026-05-04
-- ============================================================================
-- Dernière migration du plan correctif. Ajoute 3 index sur les tables
-- profiles / leads / game_results pour les requêtes que l'app et l'admin
-- font le plus souvent. Aucun ALTER de schéma, aucune RLS, aucun seed.
--
-- 1. idx_leads_contact_email
--    Lookup admin par email d'un lead (rappel d'un contact, dédup, etc.).
--    L'AUDIT M-DB-4 mentionne "idx_leads_email" — la vraie colonne est
--    contact_email (cf. types/database.ts), donc on indexe la bonne colonne
--    et on nomme l'index en miroir pour clarté.
--
-- 2. idx_profiles_role (partial WHERE role IS NOT NULL)
--    Filtrer les users qui ont fini l'onboarding (role IS NOT NULL) — admin
--    dashboard, segmentation. Index PARTIEL : on n'indexe pas les NULLs
--    (typiquement nombreux dans une phase de démarrage où les users signent
--    mais ne complètent pas /onboarding) → index plus petit, plus rapide.
--
-- 3. idx_game_results_slug_completed_at (game_slug, completed_at DESC)
--    Liste des runs d'un jeu donné par ordre chronologique inverse :
--    - Admin dashboard "X dernières runs sur ce jeu"
--    - Stats agrégées par jeu (scoring moyen, completion rate)
--    - L'AUDIT M-DB-5 mentionne "idx_game_results_slug_created" — la vraie
--      colonne est completed_at (game_results n'a pas de created_at, juste
--      completed_at qui marque la fin de la run). Index nommé en miroir.
--    Order DESC sur completed_at car les requêtes "dernières runs" sont
--    les plus fréquentes.
--
-- Tous les index sont CREATE INDEX IF NOT EXISTS pour idempotence sur prod
-- (où certains pourraient avoir été créés manuellement entre temps).
-- ============================================================================


-- ============================================================================
-- 1. idx_leads_contact_email — lookup admin par email
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_leads_contact_email
  ON public.leads (contact_email);


-- ============================================================================
-- 2. idx_profiles_role — partial sur role IS NOT NULL
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles (role)
  WHERE role IS NOT NULL;


-- ============================================================================
-- 3. idx_game_results_slug_completed_at — analytics par jeu
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_game_results_slug_completed_at
  ON public.game_results (game_slug, completed_at DESC);
