-- ============================================================================
-- Migration: alter_profiles
-- Couvre: AUDIT-supabase.md I-DB-3 (role en enum), I-DB-5 (school_name),
--         I-DB-7 (DROP first_name/last_name/niveau mort-nées),
--         M-DB-1 (trigger updated_at), M-DB-2 (commentaire profiles.id)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration aligne profiles sur le modèle Cap' v2 :
--
--   1. Migration data : UPDATE role = 'etudiant_sup' WHERE role = 'diplome'
--      (avant ALTER COLUMN, sinon le cast text → user_role plante).
--   2. ALTER role : passage TEXT → user_role enum strict, drop default,
--      conserve NULLABLE (rôle choisi à /onboarding, pas au signup).
--   3. ADD COLUMN school_name TEXT NULL — lycée d'origine d'un lyceen
--      (pilotage futur partenariats école, cf. I-DB-5).
--   4. DROP COLUMN first_name, last_name, niveau — colonnes mort-nées
--      (jamais écrites par le frontend, audit signup 2026-04-29).
--   5. Trigger set_profiles_updated_at via set_updated_at() (M-DB-1).
--   6. COMMENT ON COLUMN profiles.id qui documente que l'id vient du
--      trigger handle_new_user (M-DB-2).
--
-- Note sur la FK profiles.id REFERENCES auth.users : déjà déclarée par la
-- baseline (CREATE TABLE), avec ON DELETE CASCADE. Pas re-déclarée ici.
--
-- Dépendances :
--   - public.user_role enum     ← migration create_enums
--   - public.set_updated_at()   ← migration create_admin_helpers
-- ============================================================================


-- ============================================================================
-- 1. Migration data — diplome → etudiant_sup AVANT le cast enum
-- ============================================================================
-- Sans ce UPDATE préalable, le ALTER COLUMN ... TYPE user_role USING
-- role::user_role plante sur la valeur 'diplome' (inconnue de l'enum).
-- Cf. AUDIT-supabase.md I-DB-3.

UPDATE public.profiles SET role = 'etudiant_sup' WHERE role = 'diplome';


-- ============================================================================
-- 2. ALTER role — TEXT → user_role enum, drop default, garde NULLABLE
-- ============================================================================
-- Idempotence : drop default IF EXISTS et drop not null sont safe sur un
-- schéma déjà patché par migration_001_role_nullable.sql (legacy v0.1).

ALTER TABLE public.profiles
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.profiles
  ALTER COLUMN role DROP NOT NULL;

ALTER TABLE public.profiles
  ALTER COLUMN role TYPE public.user_role USING role::public.user_role;


-- ============================================================================
-- 3. ADD school_name — lycée d'origine du lyceen
-- ============================================================================
-- Cf. AUDIT-supabase.md I-DB-5. NULL par défaut (rempli plus tard via
-- formulaire onboarding enrichi ou import). Pas de FK schools : table dédiée
-- viendra plus tard si pertinent.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school_name TEXT;


-- ============================================================================
-- 4. DROP COLUMN first_name, last_name, niveau — colonnes mort-nées
-- ============================================================================
-- Cf. AUDIT-supabase.md I-DB-7. Audit code frontend (29 avril 2026) confirme
-- que ces 3 colonnes ne sont jamais écrites par le code app :
--   - signup (app/login/page.tsx) → email + password seuls, pas de options.data
--   - onboarding (app/onboarding/page.tsx) → upsert id + role + updated_at seuls
-- Donc 100% NULL en base. On drop pour clarifier le contrat profile.
-- Si onboarding enrichi devient un besoin, recréer proprement avec le code
-- frontend qui les écrit dès le départ.

ALTER TABLE public.profiles DROP COLUMN IF EXISTS first_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS niveau;


-- ============================================================================
-- 5. Trigger set_profiles_updated_at — auto-set updated_at sur UPDATE
-- ============================================================================
-- Cf. AUDIT-supabase.md M-DB-1. Avant ce trigger, profiles.updated_at
-- existait mais ne se mettait jamais à jour seul → la colonne mentait.
-- DROP IF EXISTS pour idempotence sur prod (où le trigger pourrait avoir
-- été ajouté via SQL Editor entre temps).

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================================
-- 6. COMMENT ON COLUMN profiles.id — documenter l'origine de l'id
-- ============================================================================
-- Cf. AUDIT-supabase.md M-DB-2. profiles.id n'a pas de DEFAULT volontairement :
-- l'id est copié depuis auth.users.id par le trigger handle_new_user au signup.
-- Ce commentaire documente l'invariant pour qu'un futur dev ne soit pas tenté
-- d'ajouter un DEFAULT gen_random_uuid() qui casserait le lien 1:1.

COMMENT ON COLUMN public.profiles.id IS
  'UUID copié depuis auth.users.id par le trigger handle_new_user au signup. '
  'Pas de DEFAULT volontairement : l''id DOIT venir de auth.users pour garantir '
  'la FK 1:1 et l''ON DELETE CASCADE quand le user supprime son compte. '
  'Cf. AUDIT-supabase.md M-DB-2.';

COMMENT ON COLUMN public.profiles.role IS
  'Rôle Cap'' du user : lyceen (cible 1) | etudiant_sup (cible 2) | cap_admin '
  '(équipe). NULLABLE car le rôle est choisi à /onboarding APRÈS le signup, '
  'pas pendant. Le frontend redirige vers /onboarding tant que role IS NULL. '
  'Le mapping UI (Lycéen, Étudiant sup'', Cap'' admin) est côté frontend via '
  'ROLE_LABELS, pas en base. Cf. AUDIT-supabase.md I-DB-3.';

COMMENT ON COLUMN public.profiles.school_name IS
  'Lycée d''origine du user (texte libre). NULL pour les non-lycéens et les '
  'lycéens qui n''ont pas renseigné. Pas de FK vers une table schools : table '
  'dédiée viendra plus tard si le pilotage des partenariats école justifie '
  'la dénormalisation. Cf. AUDIT-supabase.md I-DB-5.';
