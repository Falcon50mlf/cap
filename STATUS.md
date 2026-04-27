# STATUS — Cap&rsquo;

> Dernière update : Session 3 · 2026-04-27 · pivot UCL Lille + nettoyage

## ✅ Fait

### Foundation (S1)
- Next.js 14 (App Router) + TS strict + Tailwind v3 + Framer Motion + Zustand + Supabase SDK
- Identité Cap&rsquo; complète (palette CSS variables, Bricolage Grotesque + JetBrains Mono, GrainOverlay, favicon SVG apostrophe iconique, OG image 1200×630)
- `<Logo />` cliquable partout + apostrophe jaune iconique avec pulse hover
- **Landing complète** : hero 2 cols + 3 cards inclinées (Découverte / UCL Programmes / bénévole), section "2 univers, 1 cap", grid 6 familles, section écoles partenaires (UCL featured), section partenariat école (modal, insert direct dans `leads`), pitch deck CTA
- Page `/criteres` (10 critères de sélection des écoles + footer mention indépendance)
- Light/dark mode toggle persistant + FOUC-free

### Auth (S2)
- Email + password (sans confirmation, signup direct → session immédiate)
- `/login` toggle login/signup, errors friendly FR
- `/onboarding` choix rôle (lycéen / diplômé), upsert robuste
- Auth-gated everywhere

### Schema Supabase v1
- `profiles` (id FK auth.users, role nullable) + trigger `handle_new_user`
- `game_results` (skills jsonb, enjoyment, score, family_id, payload)
- `leads` (school_name, contact_*, message, source) — sert pour partnership ET student-to-school

### Hub & Découverte (S2)
- `/hub` à 2 univers (Découverte jaune / Programmes violet) + footer
- `/decouverte` 6 familles (Marketing live, 5 autres "Bientôt")
- Famille **Marketing** complète : `/decouverte/marketing` (fiche éditoriale) + `/metiers` (5 métiers détaillés) + `/benevoles` (Léa + Tom)
- Hub jeux Marketing : 7 jeux (2 jouables / 5 placeholders éditoriaux)
- 🎮 **Mapping Concurrentiel** + 🎮 **Mix Marketing 4P** jouables (drag & drop, scoring)

### Pitch deck (S2/S3)
- `/pitch` interactif 10 slides, navigation clavier (← → espace + ↑↓ + F + Esc), URL hash sync, fullscreen
- Slides : Hook / Pourquoi nous (équipe) / Problématique / Benchmark / Solution / Démo live (iframe) / Intérêt écoles / Modèle éco / Nos besoins / Cap&rsquo; c&rsquo;est simple
- Modal Critères de sélection des écoles partenaires (RNCP, Qualiopi, ECTS, AACSB)

### 🆕 Programmes · UCL Lille — Module Gestion d&rsquo;entreprise (S3)
- **École partenaire pilote** : Université Catholique de Lille (cours de Monica Scarano)
- `/programmes/ucl/gestion-entreprise` (hub module) — 4 cards sous-modules + bonus
- 4 sous-modules avec page contenu éditoriale + mini-jeu jouable :
  1. **Reconnaître une entreprise** (`/reconnaitre-entreprise`) → 🎮 **EntrepriseExplorer** : tri 12 entreprises × 3 axes (forme juridique / secteur / taille), score sur 36
  2. **Choisir le bon statut** (`/choisir-statut`) → 🎮 **StatutQuiz** : arbre de décision interactif sur 5 cas (Léa / Marc / Sophie / Famille Dupont / Collectif Code) menant à EI / EURL / SARL / SAS / SCOP
  3. **Analyser l&rsquo;environnement** (`/pestel`) → 🎮 **PestelMatch** : drag&drop 18 facteurs × 6 dimensions (P/E/S/T/É/L) sur 3 manches (pétrolière / mode / auto électrique)
  4. **Comprendre son marché** (`/marche`) → 🎮 **MarketRadar** : 3 manches × 3 épreuves (segmentation produits / segmentation clients NCR-NCA-CA-CP / calcul PM ou pénétration) sur Peugeot / Decathlon / Netflix
- `/programmes/ucl/gestion-entreprise/termine` — page finale avec hero célébration, stats personnelles (skills + score), présentation UCL, programmes liés, témoignage, **lead form** qui insère dans `leads` avec `source='ucl-gestion-entreprise-student'`

### Cleanup écoles fictives (S3 ÉTAPE 1)
- Supprimé toutes mentions ESCP / HEC / EMLyon / ESSEC / NEOMA / SKEMA dans le code
- Palette `--school-*` retirée de `globals.css` + `tailwind.config.ts`
- Section écoles partenaires de la landing reconstruite (UCL featured + 2 placeholders génériques)
- Bénévole Léa rendue générique ("Master Marketing" au lieu d&rsquo;"ESCP M2")
- Seules **écoles réelles de l&rsquo;équipe** mentionnées (slide pitch "Pourquoi nous") : INSEEC, Gaming Campus, IRIIG, IAE, Cybersécurité

## 🔴 Pour Session 4

- Module ESCP / HEC / autres écoles partenaires (à réactiver QUAND on signe)
- Dashboard étudiant `/dashboard` (badges, jeux complétés, secteurs explorés, contacts à venir)
- Mode invité réel `/jeux-libres`
- 5 autres familles Découverte à remplir (Conseil, Finance, Tech, Startup, Retail)
- 5 autres mini-jeux Marketing (Persona Builder, Segmentation, Positionnement, Budget Pub, SWOT)
- Resend SMTP custom dans Supabase (pour réactiver magic link / OTP en prod)

## 📦 Déploiement

- **Repo GitHub** : https://github.com/Falcon50mlf/cap
- **URL Vercel (alias stable)** : https://cap-two-fawn.vercel.app
- **Vercel project** : `lekarma2s-projects/cap` (auto-deploy on push to `main`)

## 🎮 Liens directs vers les 4 mini-jeux UCL

| # | Sous-module | Mini-jeu | URL |
|---|---|---|---|
| 01 | Reconnaître une entreprise | EntrepriseExplorer | `/programmes/ucl/gestion-entreprise/reconnaitre-entreprise/jeu` |
| 02 | Choisir le bon statut | StatutQuiz | `/programmes/ucl/gestion-entreprise/choisir-statut/jeu` |
| 03 | Analyser l&rsquo;environnement | PestelMatch | `/programmes/ucl/gestion-entreprise/pestel/jeu` |
| 04 | Comprendre son marché | MarketRadar | `/programmes/ucl/gestion-entreprise/marche/jeu` |

Page finale : `/programmes/ucl/gestion-entreprise/termine`

## 📂 Fichiers ajoutés (S3)

- `lib/schools-database.ts` — école UCL + module + 4 sous-modules avec contenu pédagogique
- `app/programmes/ucl/gestion-entreprise/page.tsx` — hub module
- `app/programmes/ucl/gestion-entreprise/[moduleId]/page.tsx` — page contenu dynamique
- `app/programmes/ucl/gestion-entreprise/[moduleId]/jeu/page.tsx` — résolveur de mini-jeu
- `app/programmes/ucl/gestion-entreprise/termine/page.tsx` — plaquette finale + lead form
- `components/games/EntrepriseExplorer.tsx` — tri multi-critères 12 entreprises × 3 axes
- `components/games/StatutQuiz.tsx` — arbre de décision 5 cas
- `components/games/PestelMatch.tsx` — drag&drop 18 facteurs × 6 dimensions × 3 secteurs
- `components/games/MarketRadar.tsx` — 3 manches × 3 épreuves (segmentation + calcul)

## 🗑️ Fichiers retirés / nettoyés (S3 ÉTAPE 1)

- `globals.css` — palette `--school-escp/-hec/-emlyon/-essec` retirée (root + light mode)
- `tailwind.config.ts` — `colors.school` retiré
- Mentions textes ESCP/HEC/EMLyon/ESSEC/NEOMA/SKEMA dans : `app/page.tsx`, `app/hub/page.tsx`, `app/programmes/page.tsx`, `app/dashboard/page.tsx`, `app/decouverte/marketing/jeux/page.tsx`, `components/landing/partnership-section.tsx`, `lib/jobs-database.ts`, `lib/volunteers-database.ts`, `CLAUDE.md`, `STATUS.md`
- Aucun fichier supprimé physiquement (les routes/composants n&rsquo;existaient pas comme fichiers indépendants — c&rsquo;était uniquement des références textuelles)

## 📝 Décisions techniques (S3)

- **`FamilyId` étendu** avec `"programs-ucl"` (au lieu de famille séparée par école — plus simple pour 1 école pilote, on extraira si besoin pour scale)
- **Skills** : ajout de `rigueur` aux 4 dims existantes (analyse / communication / créativité / stratégie / rigueur)
- **Routes dynamiques `[moduleId]`** : 1 page contenu + 1 page jeu pour les 4 sous-modules → DRY, contenu vit dans `schools-database.ts`
- **Page `/termine`** : route statique placée à côté de `[moduleId]` — Next.js privilégie les routes statiques sur les dynamiques, donc pas de conflit
- **Lead form étudiant → école** : insère dans la table `leads` existante avec `source='ucl-gestion-entreprise-student'` (pas de table dédiée ; le `school_name` indique vers qui le lead doit être routé)
- **Stats sur `/termine`** : lues depuis localStorage `cap.game_results` (filtré par `family_id='programs-ucl'`) — pas de query Supabase pour éviter le délai et fonctionner en mode invité
