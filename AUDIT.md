# Audit Cap&rsquo; — 2026-04-28

> Audit produit après mise en place de l&rsquo;outillage auto-test (P1).
> Source : `npm run validate` clean, 39 tests unit / 14 tests E2E verts.

---

## 📊 Métriques générales

| Métrique                                               | Valeur                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| Lignes de code (`app/components/lib/types`, `*.ts(x)`) | ~9 200 lignes                                                           |
| Nombre de fichiers `.ts`/`.tsx`                        | 68                                                                      |
| Nombre de `any` explicite                              | **0** (✅)                                                              |
| Nombre de TODO/FIXME/HACK                              | **0** (✅)                                                              |
| Console.log / .error en code app                       | 1 (logger volontaire dans `lib/save-game-result.ts`)                    |
| Composants `"use client"`                              | 38 / 68 (≈ 56%)                                                         |
| Coverage tests vitest                                  | 39 tests sur 5 suites de helpers purs (pas de mesure formelle, voir 🟡) |
| Bundle First Load JS shared                            | 87.5 kB                                                                 |
| Plus grosse route                                      | `/programmes/ucl/gestion-entreprise/[moduleId]/jeu` 219 kB First Load   |
| Plus petite route auth-gated                           | `/_not-found` 88.4 kB (très bon)                                        |
| Build production                                       | ✅ clean, 24 routes générées                                            |

### Top 10 fichiers les plus longs

| Fichier                                                  | Lignes |
| -------------------------------------------------------- | ------ |
| `components/games/MarketRadar.tsx`                       | 638    |
| `app/programmes/ucl/gestion-entreprise/termine/page.tsx` | 583    |
| `app/page.tsx`                                           | 564    |
| `components/games/MappingConcurrentiel.tsx`              | 511    |
| `components/games/StatutQuiz.tsx`                        | 487    |
| `components/games/PestelMatch.tsx`                       | 487    |
| `components/games/MixMarketing4P.tsx`                    | 485    |
| `components/games/EntrepriseExplorer.tsx`                | 436    |
| `lib/schools-database.ts`                                | 373    |
| `app/decouverte/marketing/page.tsx`                      | 300    |

→ 9 fichiers > 300 lignes. CLAUDE.md interdit > 300. **À splitter** — sauf data files.

---

## 🔴 CRITIQUE (bloquant prod sérieuse)

### C1. `supabase/schema.sql` désynchronisé avec la prod

- **Fichier** : `supabase/schema.sql`
- **Problème** : le fichier référence encore `discovery_runs` et `program_leads`. La prod utilise `game_results` et `leads` (pivot de Session 3, joué via SQL inline dans le chat — jamais re-commité dans le fichier).
- **Impact** : si quelqu&rsquo;un re-joue ce SQL, ça **casse** la prod (drop de tables actives + create de tables fantômes). Pas de source-of-truth fiable pour le schéma DB.
- **Action recommandée** : remplacer le contenu de `supabase/schema.sql` par le SQL idempotent v1 (profiles + game_results + leads + RLS + trigger `handle_new_user`). Refactor sans risque visuel.

### C2. Aucune `error.tsx` (zéro error boundary)

- **Fichier** : aucun
- **Problème** : si un Server Component throw (RLS denied, fetch fails, parse error, etc.), Next.js affiche son écran d&rsquo;erreur générique → mauvaise UX et casse la confiance pendant un pitch.
- **Impact** : visible par l&rsquo;utilisateur dès qu&rsquo;une exception non-catchée remonte.
- **Action recommandée** : créer `app/error.tsx` (root) + au minimum `app/(auth)/error.tsx`, `app/programmes/error.tsx`. Look identique au site (logo, fond `--night`, message reassurant + bouton "réessayer"). **Risque visuel : 0** (n&rsquo;apparaît qu&rsquo;en cas d&rsquo;erreur).

### C3. Aucun `loading.tsx`

- **Fichier** : aucun (vérifié pour les 18 routes principales)
- **Problème** : pendant le chargement de Server Components (très peu sur Cap&rsquo; vu qu&rsquo;on est massivement Client) ou pendant l&rsquo;hydratation, certaines pages affichent un blanc.
- **Impact** : moindre vu la part de Client Components, mais pénalisant pour `/login` et `/hub` qui font auth check côté client (déjà mitigé par leurs `Loader2` internes).
- **Action recommandée** : ajouter `app/loading.tsx` (root) + `app/programmes/ucl/gestion-entreprise/loading.tsx`. Spinner Cap&rsquo; jaune sobre. **Risque visuel : 0**.

---

## 🟡 IMPORTANT (à fix dans les 2 semaines)

### I1. 9 fichiers > 300 lignes (limite CLAUDE.md)

- **Composants jeux** (`MarketRadar`, `MappingConcurrentiel`, `StatutQuiz`, `PestelMatch`, `MixMarketing4P`, `EntrepriseExplorer`) : tous entre 436 et 638 lignes. Pattern récurrent : `Component principal + Zone + Pool + DraggableX + ResultPanel + RoundsBadge` empilés.
- **`app/page.tsx`** (564 l) : landing avec 6 sections inline.
- **`app/programmes/.../termine/page.tsx`** (583 l) : hero + stats + UCL + LeadForm tout inline.
- **Action recommandée** : extraire les sub-components en fichiers frères (`components/games/MarketRadar/{index.tsx,PhaseA.tsx,PhaseB.tsx,PhaseC.tsx,Result.tsx}`). **Risque visuel : 0** si props et styles conservés. Tests unitaires existants protègent les helpers.

### I2. Dépendances installées mais inutilisées

`depcheck` signale (filtré des faux-positifs) :

- `shadcn` (^4.5.0) — installée en S1 puis composants supprimés. **À retirer**.
- `@base-ui/react` (^1.4.1) — venait avec shadcn-4. **À retirer**.
- `tw-animate-css` (^1.4.0) — idem. **À retirer**.
- `class-variance-authority` (^0.7.1) — idem, 0 import. **À retirer**.
- `@dnd-kit/utilities` (^3.2.2) — 0 import (seul `@dnd-kit/core` est utilisé). **À retirer**.
- `zustand` (^5.0.12) — listé dans le stack mais 0 import dans `app/components/lib`. **À retirer**.

→ Économie ~15-20 MB sur `node_modules`, signal plus clair sur le stack réel. **Risque visuel : 0**.

### I3. ~56% de composants client (`"use client"` sur 38/68 fichiers)

- **Constat** : la plupart des pages déclarent `"use client"` à cause d&rsquo;une seule animation `motion.div` ou d&rsquo;un `useState`.
- **Cas concrets convertibles en Server Component** :
  - `app/criteres/page.tsx` — purement présentationnel (stagger Framer accepté en bordure de Client Component).
  - `app/decouverte/marketing/metiers/page.tsx` — idem.
  - `app/decouverte/marketing/benevoles/page.tsx` — idem.
  - `app/programmes/ucl/gestion-entreprise/page.tsx` — pas d&rsquo;état utilisateur, juste lecture de `schools-database` synchronewise.
  - `app/programmes/ucl/gestion-entreprise/[moduleId]/page.tsx` — idem.
- **Action recommandée** : extraire les bouts interactifs (motion.div, theme toggle) en `<ClientOnlyXxx />` séparés ; transformer les pages en Server Components. Gain : First Load JS réduit, SSR pré-rendu, meilleure SEO. **Risque visuel : faible**, à valider via screenshot diff.

### I4. Couleurs hardcodées hors palette CSS variables

- `#3B82F6` (bleu) — utilisé dans **MarketRadar**, **PestelMatch**, **EntrepriseExplorer**, **Slide08/Slide10** pour la "4ème dimension". Devrait être promu en `--family-tech-alt` ou `--accent-blue` dans `globals.css`.
- `#E8732D` (orange) — dans **PestelMatch** pour la dimension Légal. Devrait être `--family-startup` (existe déjà : `#FF8A3D`) ou un nouveau `--accent-orange`.
- `#0E0E10` (dark) hardcodé dans `apple-icon.tsx`, `opengraph-image.tsx`, GameShell modal scrim, `::selection`. **OK ici** (export PNG / scrim toujours dark).
- `#FFDC32`, `#FF4D6D`, `#FF8A3D`, `#E5C7A0` etc. dans `lib/families-database.ts` et `volunteers-database.ts` — gradient avatars. **OK** (gradient inline n&rsquo;a pas accès aux CSS vars).
- **Action recommandée** : ajouter `--accent-blue: #3B82F6` et `--accent-orange: #E8732D` dans `globals.css` puis remplacer ; pour les light/dark différents si besoin.

### I5. Pages publiques (sans auth) qui devraient parfois l&rsquo;être

- `/decouverte/marketing` et sous-pages (`metiers`, `benevoles`, `jeux`, `jeux/[gameId]`) — pas auth-gated.
- `/programmes/ucl/gestion-entreprise` et sous-pages — pas auth-gated.
- **Décision produit** : explicite dans Session 3 (`STATUS.md` mentionne ce choix). On peut visiter en mode invité — c&rsquo;est voulu (mode démo / mode lurker).
- Mais : les `lead form` et `game_results` insertions reposent sur la RLS qui accepte `user_id is null`. Le risque est que des leads/résultats anonymes massifs polluent la DB.
- **Action recommandée** : ajouter rate-limiting côté Supabase (Edge Function) ou recaptcha sur `/programmes/ucl/.../termine` lead form si on garde le mode invité. Sinon, gater pour les leads.

### I6. `console.error` dans `lib/save-game-result.ts`

- Ligne 37 : `console.error('[saveGameResult] supabase error', error);`
- **Constat** : actuellement ça loggue dans la console navigateur — invisible en prod. Pas critique, mais perd de l&rsquo;info pour debugger.
- **Action recommandée** : centraliser via `lib/logger.ts` (no-op en prod ou hook Sentry). Sortie acceptable : laisser tel quel et noter dans `TODO_PHASE_4.md` car observability n&rsquo;est pas dans le scope MVP.

### I7. Lead form étudiant utilise la table `leads` (sémantiquement floue)

- **Fichier** : `app/programmes/ucl/gestion-entreprise/termine/page.tsx`
- **Constat** : `source = 'ucl-gestion-entreprise-student'`, `school_name = 'UCL Lille'`, `contact_*` = infos étudiant. Sémantiquement la table `leads` était pour candidatures **écoles → Cap&rsquo;**, pas étudiant → école.
- **Décision Session 3** : pragmatique, pas de migration nécessaire — discriminé via `source`.
- **Action recommandée** : à long terme, séparer `partnership_leads` et `student_leads` (migration SQL). À noter dans `TODO_PHASE_4.md` car ça touche au schéma DB.

### I8. Duplication de pattern entre les mini-jeux drag-sort (triade `Pool / Zone / DraggableX / Pill`)

- **Pattern révélé par les 4 audits GDD UCL** (commit `a202dbd`, voir `AUDIT-product.md`).
- **Triade dupliquée** : `Zone` + `Pool` + `DraggableX` + `XPill` (~145 lignes / jeu).
  - `EntrepriseExplorer` : `Zone` (244-289) + `Pool` (290-321) + `DraggableCompany` (323-345) + `CompanyPill` (347-389).
  - `PestelMatch` : `Zone` (304-358) + `Pool` (359-393) + `DraggableCard` (394-417) + `CardPill` (418-468).
  - `MixMarketing4P` : même triade avec naming `DraggableCard` / `CardPill` (à harmoniser).
- **Total dupliqué** : ~435 lignes (3 jeux × 145).
- **Jeux non concernés** : `StatutQuiz` (decision tree, pas de drag), `MarketRadar` (QCM phases, pas de drag), `MappingConcurrentiel` (pointer events natifs, drag 2D libre).
- **Bonus partagé par les 6 jeux** : `RoundsBadge`, `ResultPanel`/`ResultActions`, `validated state`, `scores: number[]`, color thresholds (mint > 75 > sun > 50 > coral).
- **Sortie cible** : `components/games/shared/{DragSortGame.tsx, Zone.tsx, Pool.tsx, DraggablePill.tsx}` + harmoniser le naming `Pill` (vs `Card`/`Company`). Plus `<RoundsBadge>` et `<ResultActions>`.
- **Action recommandée** : extraire la triade + les 2 composants partagés. **Risque visuel : 0** si props identiques.
- **Effort** : **L** (~4 h — refactor structurel touchant 3 fichiers > 400 lignes + 1 helper de drag context).

---

## 🟢 MINEUR (nice to have)

### M1. Aria-labels sur certains liens implicites

- Quelques `<Link>` non textuels (les cards UniverseCard sur `/hub`, FamilyCard sur `/decouverte`) pourraient bénéficier d&rsquo;un `aria-label` explicite. Le contenu textuel suffit pour les screen readers, mais une formulation explicite améliorerait l&rsquo;UX a11y.

### M2. Focus-visible

- Le toggle theme et certains boutons custom n&rsquo;ont pas de style `focus-visible` distinct. Tailwind `focus-visible:ring-*` à ajouter pour la nav clavier.

### M3. `apple-icon.tsx` utilise des shapes CSS au lieu d&rsquo;un path SVG

- L&rsquo;apostrophe est composée d&rsquo;une `div ellipse` + `triangle border-trick` — fonctionne mais pas pixel-perfect. `icon.svg` (déjà SVG path propre) est mieux.
- **Action recommandée** : générer le PNG directement depuis `icon.svg` (sharp), supprimer `apple-icon.tsx`. Effort 30 min.

### M4. `lib/scoring.ts` extrait du Mapping mais pas réutilisé

- Le Mapping continue d&rsquo;avoir ses propres helpers `dist/matchScore/colorForMatch` inline (j&rsquo;ai créé `lib/scoring.ts` pour les tests, mais sans refactor du jeu lui-même).
- **Action recommandée** : remplacer les versions inline par les imports — réduit la duplication et garantit les tests.

### M5. `tsconfig.json` pourrait activer `exactOptionalPropertyTypes`

- Plus strict encore : refuse `{ x: undefined }` quand le type est `{ x?: T }`. Marginalement utile, ferait surfer ~5-10 erreurs probables à fixer. **Reporter à plus tard**.

### M6. Pas de robots.txt ni sitemap.xml

- Si on veut indexer la landing et `/criteres`, ajouter `app/robots.ts` et `app/sitemap.ts` (Next.js conventions).

---

## 📝 PLAN DE REFACTOR (P3 ordonné)

Ordre suggéré pour la Phase 3, du plus safe au plus risqué visuellement.

1. **C1 — Sync `supabase/schema.sql`** (5 min, risque visuel 0)
2. **I2 — Drop unused deps** (10 min, risque visuel 0, gain bundle)
3. **C2 + C3 — Add `error.tsx` + `loading.tsx`** (30 min, risque visuel 0)
4. **M4 — Migrer Mapping vers `lib/scoring.ts`** (15 min, risque visuel 0)
5. **I8 — Extraire la triade `Pool/Zone/DraggablePill` + `<RoundsBadge>` + `<ResultActions>` partagés** (~4 h, risque visuel 0 — voir AUDIT-product.md)
6. **I1 — Splitter les fichiers jeux > 300 lignes** (2 h, risque visuel 0 si props/styles conservés)
7. **I1 — Splitter `app/page.tsx` et `termine/page.tsx`** (1 h, risque visuel 0)
8. **I4 — Promouvoir `#3B82F6` et `#E8732D` en CSS vars** (30 min, risque visuel 0 si valeurs identiques)
9. **I3 — Convertir 5 pages en Server Components** (1 h, risque visuel faible, **screenshot diff requis**)
10. **M2 — Focus-visible styles** (30 min, risque visuel ≈0)
11. **M1 — Aria-labels** (15 min, risque visuel 0)

Total estimé : **~9 h 45** de refactor pur (I8 ré-évalué M→L après audit GDD). À étaler sur 3 sessions de ~3 h.

---

## 🚫 NON-REFACTOR (à laisser tel quel pour cette phase)

- **Renommer la table `leads`** en `partnership_leads` + créer `student_leads` (I7) → migration SQL + risque casse production. **Reporter en Phase 4**.
- **Centraliser logger** (I6) → out of scope MVP. Note dans `TODO_PHASE_4.md`.
- **`exactOptionalPropertyTypes`** (M5) → effort vs gain. **Reporter**.
- **Robots.txt / sitemap.xml** (M6) → quand le SEO devient prio.
- **Mode invité rate-limiting** (I5) → en attendant des leads spam concrets, pas urgent.
- **GameShell `Modal` extracted** → la duplication entre quit-modal et rating-modal est minime, garder inline.

---

## ✅ Ce qui est en bon état

- TypeScript strict + `noUncheckedIndexedAccess` + 0 `any` réel
- 39 tests unit + 14 tests E2E verts
- 0 TODO/FIXME en suspens
- ESLint + Prettier strictement appliqués (lint clean)
- Husky pre-commit + GitHub Actions CI configurés
- RLS Supabase correctes (profiles ✓, game_results ✓, leads insert-only ✓)
- Auth gates côté client présents sur `/hub`, `/onboarding`, `/dashboard`
- Build production clean, 24 routes générées, ~87 kB shared bundle
- Favicon + OG image branded
- Light/dark mode persistant FOUC-free
