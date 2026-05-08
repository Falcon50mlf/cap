-- ============================================================================
-- Migration: rewrite_auth_trigger
-- Couvre: AUDIT-supabase.md I-DB-6 (exception handling), I-DB-8 (default role),
--         M-DB-8 (commentaire filet de sécurité onboarding)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration réécrit handle_new_user pour le rendre robuste :
--
--   1. DROP TRIGGER + DROP FUNCTION : repart d'un état propre.
--   2. Recrée la fonction avec :
--      - SECURITY DEFINER + SET search_path = public (Supabase recommandé).
--      - INSERT minimal : seulement (id), role laissé NULL.
--      - BEGIN/EXCEPTION WHEN OTHERS : si l'INSERT plante (contrainte
--        violée, race condition, etc.), on RAISE WARNING dans les logs
--        Postgres MAIS on RETURN NEW quand même → le signup ne rollback PAS.
--        Le user a été créé en auth.users, c'est l'essentiel ; le profile
--        manquant sera détecté côté frontend (filet de sécurité onboarding).
--   3. Recrée le trigger AFTER INSERT.
--   4. COMMENT ON FUNCTION qui documente le filet de sécurité onboarding.
--
-- DÉCISION role NULL (vs COALESCE 'lyceen' suggéré dans AUDIT I-DB-8) :
--
-- Le spec d'enchaînement migration acte la version NULL. Rationale :
--   - Le frontend redirige vers /onboarding tant que role IS NULL.
--   - Mettre 'lyceen' par défaut masquerait un onboarding incomplet (le user
--     resterait coincé sur le hub avec un faux rôle).
--   - NULL est explicite : "ce user a signé mais n'a pas choisi de rôle".
--
-- FILET DE SÉCURITÉ ONBORADING (M-DB-8) :
--
-- Si le trigger plante silencieusement (RAISE WARNING), le user existe en
-- auth.users mais son profile n'existe pas. Le frontend (app/onboarding/page.tsx)
-- fait un upsert sur profiles avec son auth.uid() — donc le profile est créé
-- ou complété au premier passage par /onboarding. La page /hub redirige vers
-- /onboarding si profile est NULL ou si role IS NULL. Donc :
--   - profile manquant   → onboarding crée la ligne via upsert.
--   - profile sans role  → onboarding la complète via upsert.
-- Le trigger est un best-effort, pas un single point of failure.
--
-- Dépendances :
--   - public.profiles table avec role user_role NULLABLE   ← migration alter_profiles
-- ============================================================================


-- ============================================================================
-- 1. DROP état précédent (idempotent)
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();


-- ============================================================================
-- 2. Recréer handle_new_user — version durcie
-- ============================================================================

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Filet de sécurité : on log mais on ne fait pas planter le signup.
  -- Le frontend (/onboarding) rattrapera le profile manquant via upsert.
  -- Cf. AUDIT-supabase.md I-DB-6 + M-DB-8.
  RAISE WARNING 'handle_new_user: INSERT profile failed for user % (%): %',
    NEW.id, NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 3. Recréer trigger AFTER INSERT auth.users
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 4. COMMENT ON FUNCTION (M-DB-8)
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS
  'Trigger AFTER INSERT auth.users : crée une ligne minimale dans profiles '
  '(id seulement, role laissé NULL). Durci avec EXCEPTION WHEN OTHERS qui '
  'log un WARNING sans bloquer le signup — auth.users.INSERT est l''opération '
  'critique, profiles.INSERT est best-effort. '
  'FILET DE SÉCURITÉ ONBOARDING : si le trigger plante silencieusement, le '
  'frontend rattrape : (a) /hub redirige vers /onboarding si profile est NULL '
  'ou si role IS NULL ; (b) /onboarding fait un upsert sur profiles, donc le '
  'profile est créé ou complété au premier passage. Le rôle est choisi à '
  '/onboarding APRÈS le signup, jamais pendant — d''où role NULL ici (et pas '
  'COALESCE ''lyceen'' qui masquerait un onboarding incomplet). '
  'SECURITY DEFINER + SET search_path = public : pattern Supabase recommandé '
  'pour qu''un trigger sur auth.users ait les droits sur public.profiles. '
  'Cf. AUDIT-supabase.md I-DB-6, I-DB-8, M-DB-8.';
