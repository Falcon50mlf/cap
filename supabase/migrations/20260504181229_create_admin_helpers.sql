-- ============================================================================
-- Migration: create_admin_helpers
-- Couvre: AUDIT-supabase.md C-DB-4 (is_admin), M-DB-1 (set_updated_at)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration crée 2 fonctions utilitaires utilisées par les migrations
-- suivantes. Aucune dépendance, peut être rejouée seule.
-- ============================================================================


-- ============================================================================
-- 1. set_updated_at() — Trigger générique pour updated_at automatique
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Trigger BEFORE UPDATE générique : force NEW.updated_at = NOW() à chaque update. '
  'À attacher sur toute table possédant une colonne updated_at TIMESTAMPTZ. '
  'Couvre AUDIT-supabase.md M-DB-1 (la colonne updated_at existait mais ne se mettait pas à jour seule, donc mentait).';


-- ============================================================================
-- 2. is_admin() — Vérification rôle admin via JWT claim
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'cap_admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_admin() IS
  'Retourne true si le user authentifié a le claim app_metadata.role = cap_admin dans son JWT. '
  'Pattern Supabase recommandé : non-récursif (lit le JWT, pas une table profiles), STABLE (résultat constant '
  'pendant une même requête → Postgres peut cacher), SECURITY DEFINER (s''exécute avec les droits du créateur, '
  'évite les soucis de scope sur auth.jwt()). '
  'Promotion admin manuelle : '
  'UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || ''{"role": "cap_admin"}''::jsonb WHERE email = ...; '
  'Le user doit logout/login pour rafraîchir le JWT après promotion. '
  'Couvre AUDIT-supabase.md C-DB-4. Utilisée par les policies RLS admin (cf. migration rewrite_rls_policies).';
