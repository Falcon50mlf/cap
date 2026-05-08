-- ============================================================================
-- Migration: alter_game_results
-- Couvre: AUDIT-supabase.md C-DB-1 (FK manquantes), M-DB-3 (commentaires
--         colonnes nullable), M-DB-6 (device_id pour mode invité)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration durcit le contrat de game_results :
--
--   1. ADD FK user_id REFERENCES auth.users(id) ON DELETE SET NULL
--      → conformité RGPD : si un user supprime son compte, ses runs sont
--      anonymisées (user_id devient NULL) plutôt que cascade-deleted.
--      Permet de garder la valeur analytics globale (volume de runs, scores
--      moyens par jeu) sans garder l'identité.
--
--   2. RENAME game_id → game_slug + ADD FK → public.games(slug) ON DELETE RESTRICT
--      → empêche d'insérer un slug fantôme et empêche de supprimer un jeu
--      qui a des runs en historique. Le RENAME aligne sur la convention
--      "slug" déjà utilisée par games.slug et families.slug (cohérence).
--      Le frontend devra mettre à jour son INSERT (game_id → game_slug),
--      tracké pour Étape 4 du plan.
--
--   3. ADD COLUMN device_id TEXT NULL (M-DB-6)
--      → identifie un device anonyme (lyceen sans compte joue à plusieurs
--      mini-jeux d'affilée → on aimerait pouvoir corréler ses runs sans
--      lui demander de signup. Stocke un UUID généré côté client et
--      persisté en localStorage. NULL pour les runs loggées (user_id suffit).
--
--   4. COMMENTS sur user_id, game_slug, score, payload, device_id (M-DB-3)
--      → documente pourquoi chaque colonne est NULLABLE et ce qu'elle
--      capture côté métier.
--
-- PAS de trigger updated_at : game_results est immutable (cf. I-DB-10,
-- décision actée — pas d'UPDATE jamais, seulement DELETE pour RGPD/admin
-- via policy en migration #7).
--
-- Dépendances :
--   - public.games table         ← migration create_reference_tables
-- ============================================================================


-- ============================================================================
-- 1. ADD FK user_id → auth.users(id) ON DELETE SET NULL
-- ============================================================================
-- Idempotence : DROP IF EXISTS du FK avant CREATE (sur prod il pourrait
-- avoir été ajouté manuellement entre temps avec un autre nom).

ALTER TABLE public.game_results
  DROP CONSTRAINT IF EXISTS game_results_user_id_fkey;

ALTER TABLE public.game_results
  ADD CONSTRAINT game_results_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users (id)
  ON DELETE SET NULL;


-- ============================================================================
-- 2. RENAME game_id → game_slug + FK → public.games(slug) ON DELETE RESTRICT
-- ============================================================================
-- Étape 2.a : RENAME (idempotent en checkant l'existence avant).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='game_results' AND column_name='game_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='game_results' AND column_name='game_slug'
  ) THEN
    EXECUTE 'ALTER TABLE public.game_results RENAME COLUMN game_id TO game_slug';
  END IF;
END $$;

-- Étape 2.b : ADD FK. Si des runs orphelines existent (game_slug pas dans
-- games.slug), la FK plantera ici — c'est intentionnel. La migration s'arrête
-- proprement, l'humain investigue (UPDATE de remap ou DELETE manuel décidé
-- par l'humain, pas par cette migration).
ALTER TABLE public.game_results
  DROP CONSTRAINT IF EXISTS game_results_game_slug_fkey;

ALTER TABLE public.game_results
  ADD CONSTRAINT game_results_game_slug_fkey
  FOREIGN KEY (game_slug) REFERENCES public.games (slug)
  ON DELETE RESTRICT;


-- ============================================================================
-- 3. ADD COLUMN device_id TEXT NULL (M-DB-6)
-- ============================================================================
-- Identifie un device anonyme côté client (UUID localStorage). Permet de
-- corréler les runs d'un même lyceen non-loggé sans lui imposer un signup.
-- NULL pour runs loggées (user_id sert d'identifiant). NULL aussi pour
-- runs anonymes pré-device_id (rétrocompat).

ALTER TABLE public.game_results
  ADD COLUMN IF NOT EXISTS device_id TEXT;


-- ============================================================================
-- 4. COMMENTS sur colonnes nullable (M-DB-3)
-- ============================================================================

COMMENT ON COLUMN public.game_results.user_id IS
  'NULLABLE : un run peut être anonyme (mode invité, /jeux-libres avant signup) '
  'ou orphelin (user a supprimé son compte → ON DELETE SET NULL préserve la run '
  'pour analytics agrégées). FK vers auth.users(id). Cf. AUDIT-supabase.md C-DB-1.';

COMMENT ON COLUMN public.game_results.game_slug IS
  'Slug du mini-jeu (ex: "ucl-statut-quiz", "mapping-concurrentiel"). FK vers '
  'public.games(slug) ON DELETE RESTRICT : on ne peut pas supprimer un jeu qui '
  'a des runs historiques. Renommé depuis game_id pour aligner sur la convention '
  '"slug" du modèle (cohérent avec games.slug et families.slug). Cf. AUDIT-supabase.md C-DB-1.';

COMMENT ON COLUMN public.game_results.score IS
  'NULLABLE : tous les jeux ne calculent pas un score (ex: jeu narratif sans '
  'évaluation, ou jeu en cours d''abandon). Quand renseigné, attendu dans [0..100] '
  '(pas de CHECK car certains jeux pourraient avoir des barèmes différents — à '
  'durcir si besoin). Cf. AUDIT-supabase.md M-DB-3.';

COMMENT ON COLUMN public.game_results.payload IS
  'NULLABLE jsonb : données détaillées spécifiques au jeu (réponses, ordre des '
  'cartes, etc.) pour rejouer/auditer. Schéma libre côté DB, validé côté frontend '
  'par jeu. NULL si le jeu n''a rien d''utile à logger. Cf. AUDIT-supabase.md M-DB-3.';

COMMENT ON COLUMN public.game_results.device_id IS
  'UUID du device anonyme (généré côté client, persisté en localStorage). Permet '
  'de corréler les runs successifs d''un user non-loggé sans le forcer à signup. '
  'NULL pour runs loggées (user_id suffit) et runs anonymes anciennes '
  '(rétrocompat). Cf. AUDIT-supabase.md M-DB-6.';
