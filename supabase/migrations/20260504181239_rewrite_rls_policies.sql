-- ============================================================================
-- Migration: rewrite_rls_policies
-- Couvre: AUDIT-supabase.md C-DB-2 (scope TO authenticated/anon, jamais public),
--         C-DB-3 (leads SELECT admin only),
--         I-DB-9 (DELETE policies sur profiles + leads),
--         I-DB-10 (game_results immutable, DELETE admin only)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration réécrit toutes les policies RLS sur profiles, game_results,
-- leads avec un scope explicite TO authenticated/anon (jamais TO public).
--
-- PRINCIPE C-DB-2 :
-- Une policy sans TO appliquée à `public` cible TOUS les rôles, y compris
-- des rôles internes Postgres (postgres, supabase_admin, etc.). Risque de
-- contourner la RLS via un rôle dont on ignore l'existence. On scope donc
-- explicitement à anon (utilisateur non loggé via PostgREST) ou
-- authenticated (utilisateur loggé via PostgREST).
--
-- PATTERN admin override :
-- L'admin Cap' est identifié via JWT app_metadata.role = 'cap_admin' (cf.
-- public.is_admin() en migration create_admin_helpers). On l'inclut dans
-- les policies via "OR public.is_admin()" plutôt qu'avec une policy
-- dédiée — plus simple à raisonner, même résultat (Postgres OR les CHECK
-- des policies multiples de toute façon).
--
-- Décisions actées :
--   - profiles  : SELECT/UPDATE/DELETE own + admin, INSERT own only
--   - game_results : INSERT anon (user_id NULL only) ou auth (own ou NULL),
--                    SELECT own + admin, DELETE admin only, NO UPDATE.
--   - leads     : INSERT anon+auth (formulaire public), SELECT/DELETE admin only.
--
-- Décision NO DELETE user sur game_results :
-- Spec d'enchaînement actée. RGPD géré côté admin manuel (cleanup sur demande)
-- plutôt que self-service. Trade-off : friction RGPD vs. simplicité du contrat
-- "game_results immutable". Si self-delete devient un besoin user, ajouter
-- une policy game_results_delete_own dans une migration future.
--
-- Dépendances :
--   - public.is_admin()  ← migration create_admin_helpers
-- ============================================================================


-- ============================================================================
-- 1. profiles — DROP anciennes policies (legacy v0 + variantes potentielles)
-- ============================================================================

DROP POLICY IF EXISTS "profiles select own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles insert own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles update own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;


-- ============================================================================
-- 2. profiles — CREATE policies durcies
-- ============================================================================

-- SELECT : son propre profile, ou admin Cap' voit tout.
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- INSERT : on ne peut INSERT que son propre profile (id = auth.uid()).
-- En pratique, le trigger handle_new_user fait l'INSERT pour le user au
-- signup. Cette policy couvre les cas où le frontend upsert (cf. /onboarding).
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE : son propre profile (auth.uid()=id), ou admin override.
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- DELETE : son propre profile (RGPD self-service), ou admin override.
-- Cf. AUDIT-supabase.md I-DB-9.
CREATE POLICY "profiles_delete_own_or_admin" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());


-- ============================================================================
-- 3. game_results — DROP anciennes policies
-- ============================================================================

DROP POLICY IF EXISTS "game_results select own"         ON public.game_results;
DROP POLICY IF EXISTS "game_results insert own or anon" ON public.game_results;
DROP POLICY IF EXISTS "game_results_select_own"         ON public.game_results;
DROP POLICY IF EXISTS "game_results_insert_own"         ON public.game_results;
DROP POLICY IF EXISTS "game_results_insert_anon"        ON public.game_results;
DROP POLICY IF EXISTS "game_results_delete_admin"       ON public.game_results;


-- ============================================================================
-- 4. game_results — CREATE policies durcies
-- ============================================================================

-- INSERT (anon) : un visiteur non-loggé peut logger une run, MAIS user_id
-- doit être NULL (mode invité). Empêche un anon d'usurper l'id d'un user loggé.
CREATE POLICY "game_results_insert_anon" ON public.game_results
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- INSERT (authenticated) : user_id = soi-même OU user_id NULL (mode invité
-- même quand loggé, ex: jeu accessible avant onboarding).
CREATE POLICY "game_results_insert_auth" ON public.game_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- SELECT : ses propres runs, ou admin voit tout.
-- Note : un user non-loggé ne peut pas SELECT — ses runs anon n'ont pas
-- d'identité côté DB, on les retrouve via localStorage côté client.
CREATE POLICY "game_results_select_own_or_admin" ON public.game_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- DELETE : admin only (cleanup, RGPD géré manuellement par l'équipe Cap').
-- Cf. AUDIT-supabase.md I-DB-10 et décision actée NO DELETE user.
CREATE POLICY "game_results_delete_admin" ON public.game_results
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- PAS de policy UPDATE : game_results est immutable.


-- ============================================================================
-- 5. leads — DROP anciennes policies
-- ============================================================================

DROP POLICY IF EXISTS "leads insert anyone"  ON public.leads;
DROP POLICY IF EXISTS "leads select own"     ON public.leads;
DROP POLICY IF EXISTS "leads_insert_public"  ON public.leads;
DROP POLICY IF EXISTS "leads_select_admin"   ON public.leads;
DROP POLICY IF EXISTS "leads_delete_admin"   ON public.leads;


-- ============================================================================
-- 6. leads — CREATE policies durcies
-- ============================================================================

-- INSERT : tout le monde peut soumettre un lead (formulaire public, pas
-- besoin d'être loggé pour donner ses coordonnées à une école partenaire).
CREATE POLICY "leads_insert_public" ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- SELECT : admin only. Les leads sont la valeur business B2B de Cap',
-- aucun user normal n'a à les voir. Cf. AUDIT-supabase.md C-DB-3.
CREATE POLICY "leads_select_admin" ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- DELETE : admin only (cleanup, RGPD). Cf. AUDIT-supabase.md I-DB-9.
CREATE POLICY "leads_delete_admin" ON public.leads
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- PAS de policy UPDATE : un lead est figé (snapshot d'une intention de
-- contact à un moment donné). Si correction nécessaire, admin via SQL Editor.
