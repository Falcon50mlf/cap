-- ============================================================================
-- Migration: create_enums
-- Couvre: AUDIT-supabase.md I-DB-3 (user_role enum)
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration crée les types ENUM Postgres utilisés par les ALTER COLUMN
-- des migrations suivantes. Pas de données touchées ici, juste les types.
-- ============================================================================


-- ============================================================================
-- 1. user_role — Énum strict pour profiles.role
-- ============================================================================

CREATE TYPE public.user_role AS ENUM ('lyceen', 'etudiant_sup', 'cap_admin');

COMMENT ON TYPE public.user_role IS
  'Énum strict des rôles utilisateur Cap''. Remplace l''ancien profiles.role TEXT libre. '
  'Pourquoi : un rôle écrit "Lyceen" ou "lycéen" au lieu de "lyceen" faisait échouer silencieusement '
  'les RLS et fragmentait les valeurs en base. L''énum garantit l''intégrité au niveau Postgres. '
  'Valeurs (ordre figé) : '
  '  - lyceen        : public cible 1, lycéen·ne hésitant à s''orienter vers une école de commerce. '
  '  - etudiant_sup  : public cible 2, étudiant·e du supérieur (école de co en cours OU jeune diplômé·e) '
  '                    cherchant son orientation pro. Remplace l''ancienne valeur "diplome" mort-née. '
  '  - cap_admin     : équipe Cap'', accès admin via JWT app_metadata.role (cf. is_admin()). '
  'Mapping UI : le frontend mappe ces valeurs SQL via un dictionnaire ROLE_LABELS '
  '("Lycéen", "Étudiant sup''", "Cap'' admin"). Apostrophes/accents restent côté UI, valeurs SQL propres. '
  'IMPORTANT : la migration alter_profiles fera UPDATE profiles SET role = ''etudiant_sup'' WHERE role = ''diplome'' '
  'AVANT l''ALTER COLUMN ... TYPE user_role USING role::user_role, sinon la conversion plante sur la valeur "diplome" inconnue. '
  'Couvre AUDIT-supabase.md I-DB-3.';
