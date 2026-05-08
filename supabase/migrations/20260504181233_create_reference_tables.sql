-- ============================================================================
-- Migration: create_reference_tables
-- Couvre: AUDIT-supabase.md I-DB-1 (table games), I-DB-2 (table families),
--         I-DB-4 (matérialisation du modèle business Cap')
-- Date: 2026-05-04
-- ============================================================================
-- Cette migration crée les 2 tables de référence éditoriales (families, games)
-- qui matérialisent le catalogue des mini-jeux Cap'. Elle attache le trigger
-- updated_at, active la RLS, et seed les 2 familles + les 11 jeux actuels du
-- registre frontend (lib/games-registry.ts).
--
-- Ordre d'exécution interne :
--   1. Table families (CREATE + comments)
--   2. Table games   (CREATE + comments, FK → families)
--   3. Triggers updated_at sur les 2 tables
--   4. RLS : enable + policies (SELECT public, write admin only)
--   5. Seed families (2 lignes)
--   6. Seed games    (11 lignes : 7 marketing + 4 programs-ucl)
--
-- Dépendances :
--   - public.set_updated_at()  ← migration create_admin_helpers
--   - public.is_admin()        ← migration create_admin_helpers
-- ============================================================================


-- ============================================================================
-- 1. Table families — Référentiel des familles thématiques de mini-jeux
-- ============================================================================

CREATE TABLE public.families (
  slug          TEXT PRIMARY KEY,
  label         TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.families IS
  'Référentiel des familles thématiques de mini-jeux Cap''. Cible la FK '
  'game_results.family_id (cf. migration alter_game_results) pour empêcher '
  'la fragmentation analytics ("Marketing"/"marketing"/"mkt" comptés comme '
  '3 familles différentes). Chaque ligne = un regroupement éditorial de '
  'mini-jeux côté frontend (cf. lib/games-registry.ts, type FamilyId). '
  'Couvre AUDIT-supabase.md I-DB-2 et I-DB-4.';

COMMENT ON COLUMN public.families.slug IS
  'Identifiant stable kebab-case (ex: "marketing", "programs-ucl"). PK et '
  'cible des FK. Doit matcher exactement les valeurs du type FamilyId du '
  'frontend (types/games.ts).';

COMMENT ON COLUMN public.families.label IS
  'Libellé lisible affiché dans l''UI (ex: "Marketing & Brand", "UCL Lille"). '
  'Source de vérité pour les titres de section dans le hub.';

COMMENT ON COLUMN public.families.display_order IS
  'Ordre d''affichage dans le hub (ascendant). Convention : univers Découverte '
  'd''abord, univers Programmes ensuite. Permet de réordonner sans toucher au code.';


-- ============================================================================
-- 2. Table games — Catalogue des mini-jeux disponibles
-- ============================================================================

CREATE TABLE public.games (
  slug          TEXT PRIMARY KEY,
  family_slug   TEXT NOT NULL REFERENCES public.families(slug) ON DELETE RESTRICT,
  title         TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.games IS
  'Catalogue des mini-jeux Cap''. Cible la FK game_results.game_id (cf. '
  'migration alter_game_results) pour empêcher la fragmentation des slugs '
  '("EntrepriseExplorer"/"entreprise_explorer"/"entreprise-explorer" '
  'comptés comme 3 jeux). Source de vérité côté DB ; le frontend conserve '
  'lib/games-registry.ts pour les métadonnées éditoriales (concept, '
  'totalRounds, status coming-soon, etc.) qui ne concernent pas la BDD. '
  'Couvre AUDIT-supabase.md I-DB-1 et I-DB-4.';

COMMENT ON COLUMN public.games.slug IS
  'Identifiant stable kebab-case (ex: "mapping-concurrentiel", '
  '"ucl-statut-quiz"). PK et cible de game_results.game_id. Doit matcher '
  'exactement les ids du registre frontend (lib/games-registry.ts).';

COMMENT ON COLUMN public.games.family_slug IS
  'FK → families.slug, ON DELETE RESTRICT : on refuse la suppression d''une '
  'famille tant qu''elle a encore des jeux (donnée éditoriale stable, pas '
  'de cascade silencieuse).';

COMMENT ON COLUMN public.games.is_active IS
  'true = jeu jouable. false = jeu listé mais pas encore disponible (status '
  '"coming-soon" du registre frontend) ou retiré. Permet de désactiver un '
  'jeu sans casser les FK historiques de game_results.';

COMMENT ON COLUMN public.games.display_order IS
  'Ordre d''affichage dans la section de la famille (ascendant). Mirror du '
  'champ "order" du registre frontend.';


-- ============================================================================
-- 3. Triggers updated_at — Auto-set sur UPDATE
-- ============================================================================

CREATE TRIGGER set_families_updated_at
  BEFORE UPDATE ON public.families
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================================
-- 4. RLS — Lecture publique, écriture admin uniquement
-- ============================================================================
-- Pattern : ces 2 tables sont éditoriales (catalogue de produit). Tout le
-- monde doit pouvoir les lire (anon + authenticated, pour rendre le hub).
-- Seul l''admin Cap' peut INSERT/UPDATE/DELETE.

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games    ENABLE ROW LEVEL SECURITY;

-- families : lecture publique
CREATE POLICY "families_select_public" ON public.families
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- families : write admin only (couvre INSERT, UPDATE, DELETE via FOR ALL)
CREATE POLICY "families_write_admin" ON public.families
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- games : lecture publique
CREATE POLICY "games_select_public" ON public.games
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- games : write admin only
CREATE POLICY "games_write_admin" ON public.games
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================================
-- 5. Seed families — 2 lignes (synchronisé avec lib/games-registry.ts)
-- ============================================================================
-- Convention display_order : Découverte d''abord, Programmes ensuite.

INSERT INTO public.families (slug, label, display_order) VALUES
  ('marketing',    'Marketing & Brand', 1),
  ('programs-ucl', 'UCL Lille',         2);


-- ============================================================================
-- 6. Seed games — 11 lignes (synchronisé avec lib/games-registry.ts)
-- ============================================================================
-- is_active reflète le champ "status" du registre frontend :
--   - status="available"   → is_active = true  (jouable maintenant)
--   - status="coming-soon" → is_active = false (listé mais pas encore prêt)
-- display_order mirror du champ "order" du registre frontend.

-- ─── Famille marketing (univers Découverte, 7 jeux) ──────────────────────
INSERT INTO public.games (slug, family_slug, title, display_order, is_active) VALUES
  ('mapping-concurrentiel', 'marketing', 'Mapping Concurrentiel',  1, true),
  ('mix-marketing-4p',      'marketing', 'Mix Marketing (4P)',     2, true),
  ('persona-builder',       'marketing', 'Persona Builder',        3, false),
  ('segmentation-client',   'marketing', 'Segmentation Client',    4, false),
  ('test-positionnement',   'marketing', 'Test de Positionnement', 5, false),
  ('budget-pub',            'marketing', 'Budget Pub',             6, false),
  ('analyse-swot',          'marketing', 'Analyse SWOT',           7, false);

-- ─── Famille programs-ucl (univers Programmes, 4 jeux UCL Lille) ─────────
INSERT INTO public.games (slug, family_slug, title, display_order, is_active) VALUES
  ('ucl-entreprise-explorer', 'programs-ucl', 'Entreprise Explorer', 1, true),
  ('ucl-statut-quiz',         'programs-ucl', 'Statut Quiz',         2, true),
  ('ucl-pestel-match',        'programs-ucl', 'PESTEL Match',        3, true),
  ('ucl-market-radar',        'programs-ucl', 'Market Radar',        4, true);
