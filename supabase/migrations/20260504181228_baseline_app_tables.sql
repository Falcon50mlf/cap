-- ============================================================================
-- Migration: baseline_app_tables
-- Couvre: déblocage local — alignement schéma local sur état prod pré-correctif
-- Date: 2026-05-04 (timestamp 181228, AVANT 181229_create_admin_helpers)
-- ============================================================================
-- POURQUOI cette migration existe :
--
-- L'AUDIT-supabase.md et les migrations correctives #4-#7 (alter_profiles,
-- alter_game_results, rewrite_auth_trigger, rewrite_rls_policies) supposent
-- que les tables `profiles`, `game_results`, `leads` existent déjà. C'est le
-- cas en prod (créées historiquement via Supabase Dashboard > SQL Editor à
-- partir de supabase/.legacy/schema.sql, jamais convertis en migration
-- versionnée). Mais ce n'est PAS le cas en local : `supabase db reset` part
-- d'une DB vide et n'applique que les fichiers `supabase/migrations/*.sql`.
-- Sans cette baseline, les migrations #4-#7 plantent en local sur
-- "relation public.profiles does not exist".
--
-- IDEMPOTENCE :
--
-- Tout est `CREATE ... IF NOT EXISTS` ou `CREATE OR REPLACE`. Conséquences :
--   - LOCAL  → tables vides à reset, baseline les crée, suite du plan tourne.
--   - PROD   → tables existent déjà avec leur schéma actuel : tout est no-op
--              (les `CREATE TABLE IF NOT EXISTS` ne touchent pas un schéma
--              existant même s'il diverge légèrement de celui décrit ici).
--
-- AVERTISSEMENT divergence local/prod :
--
-- Le contenu décrit ici est synthétisé depuis `types/database.ts`,
-- `lib/save-game-result.ts`, l'AUDIT, et `supabase/.legacy/schema.sql`.
-- Si la prod a dérivé (colonnes ajoutées via SQL Editor non documentées,
-- types modifiés...), seul un `supabase db pull` capturerait l'état exact.
-- Tant que ça n'est pas fait, le local reproduit ce qui est documenté ;
-- pas plus.
--
-- POSITION DANS LE PLAN :
--
-- Cette migration tourne AVANT toutes les autres (timestamp 181228).
-- Migration #6 (rewrite_auth_trigger) DROP+recrée handle_new_user déclaré
-- ici. Migration #7 (rewrite_rls_policies) DROP+recrée toutes les policies
-- déclarées ici. Donc l'état final est piloté par les migrations correctives ;
-- la baseline ne fait qu'établir le point de départ.
-- ============================================================================


-- ============================================================================
-- 1. profiles — extends auth.users
-- ============================================================================
-- Schéma v0 (cf. supabase/.legacy/schema.sql + .legacy/migration_001_role_nullable.sql) :
-- role TEXT nullable, sans default, sans check. Migration #4 le passera
-- en user_role enum, ajoutera school_name, dropera first_name/last_name/niveau.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role        TEXT,
  first_name  TEXT,
  last_name   TEXT,
  niveau      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- v0 policies (sans scope TO explicite → équivalent TO public, ce que C-DB-2
-- corrige en #7). DROP IF EXISTS d'abord pour idempotence sur prod.
DROP POLICY IF EXISTS "profiles select own" ON public.profiles;
CREATE POLICY "profiles select own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles insert own" ON public.profiles;
CREATE POLICY "profiles insert own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles update own" ON public.profiles;
CREATE POLICY "profiles update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


-- ============================================================================
-- 2. game_results — résultats des mini-jeux
-- ============================================================================
-- Schéma v1 (cf. types/database.ts + lib/save-game-result.ts).
-- Renommé/restructuré depuis discovery_runs (v0). Migration #5 ajoutera FK
-- user_id → auth.users, FK game_slug → games, device_id, COMMENTS.

CREATE TABLE IF NOT EXISTS public.game_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID,
  game_id       TEXT NOT NULL,
  family_id     TEXT NOT NULL,
  skills        JSONB,
  enjoyment     INTEGER,
  score         INTEGER,
  duration_ms   INTEGER,
  payload       JSONB,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_results select own" ON public.game_results;
CREATE POLICY "game_results select own" ON public.game_results
  FOR SELECT USING (auth.uid() = user_id);

-- Permet le mode invité (user_id NULL) ET l'utilisateur loggé.
DROP POLICY IF EXISTS "game_results insert own or anon" ON public.game_results;
CREATE POLICY "game_results insert own or anon" ON public.game_results
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);


-- ============================================================================
-- 3. leads — formulaire de contact école (B2B)
-- ============================================================================
-- Schéma v1 (cf. types/database.ts). Renommé/restructuré depuis program_leads
-- (v0). Migration #7 réécrira les policies (admin-only SELECT, INSERT public).
-- Migration #8 ajoutera idx_leads_email.

CREATE TABLE IF NOT EXISTS public.leads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name         TEXT NOT NULL,
  contact_first_name  TEXT NOT NULL,
  contact_last_name   TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_role        TEXT,
  message             TEXT,
  source              TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- v0 policy : tout le monde peut INSERT (collecte de leads sans signup).
-- Migration #7 conserve ce principe en le scopant proprement (TO anon, authenticated).
DROP POLICY IF EXISTS "leads insert anyone" ON public.leads;
CREATE POLICY "leads insert anyone" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Pas de policy SELECT v0 en local (sur les noms attendus). En prod il y a
-- peut-être une policy "program_leads select own" sur l'ancien nom mais
-- migration #7 nettoie tout. Ici on laisse RLS active sans SELECT possible
-- → comportement par défaut sécurisé jusqu'à migration #7 admin-only.


-- ============================================================================
-- 4. handle_new_user v0 — trigger auto-création de profile au signup
-- ============================================================================
-- Cf. .legacy/schema.sql + .legacy/migration_001_role_nullable.sql.
-- Migration #6 le réécrira avec EXCEPTION handling, COALESCE default, etc.
-- Ici on installe la version v0 pour que les tests qui insèrent dans
-- auth.users entre baseline et migration #6 voient bien un profile créé.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'role');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS
  'Baseline v0 : INSERT minimal dans profiles à chaque signup. Sera remplacé '
  'par la version durcie (EXCEPTION handler, COALESCE default ''lyceen'', '
  'commentaire onboarding) en migration rewrite_auth_trigger. Cf. .legacy/'
  'schema.sql + .legacy/migration_001_role_nullable.sql pour l''origine.';
