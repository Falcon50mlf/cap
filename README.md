# Cap&rsquo;

> Donne-toi un cap.

Plateforme de découverte des écoles de commerce et de leurs débouchés, à travers des mini-jeux qui simulent le vrai monde pro et les vrais cours.

🌐 **Production** : [cap-two-fawn.vercel.app](https://cap-two-fawn.vercel.app)

---

## 🛠 Stack

| Couche      | Tech                                     |
| ----------- | ---------------------------------------- |
| Framework   | Next.js 14 (App Router) · TypeScript     |
| Styling     | Tailwind CSS v3 + CSS variables          |
| Animations  | Framer Motion                            |
| Drag & drop | @dnd-kit/core                            |
| Auth + DB   | Supabase (email + password, RLS partout) |
| Hébergement | Vercel (auto-deploy on push to `main`)   |
| Tests       | Vitest (unit) + Playwright (E2E)         |
| Quality     | ESLint + Prettier + husky + lint-staged  |

## ⚙️ Variables d'environnement

Crée un fichier `.env.local` à partir de `.env.example` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Schéma SQL à appliquer une fois dans Supabase Dashboard > SQL Editor : voir `supabase/schema.sql` (idempotent — `drop + create`).

## 🚀 Setup local

```bash
npm install        # installe deps + active husky
cp .env.example .env.local && nano .env.local
npm run dev        # http://localhost:3000
```

Premier signup ? Ouvre `/login` → onglet "Crée ton compte" → email + password ≥ 6 chars.

## 📜 Scripts principaux

| Script                  | Effet                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm run dev`           | Dev server Next.js sur :3000                                             |
| `npm run build`         | Build production                                                         |
| `npm run start`         | Sert le build prod                                                       |
| `npm run type-check`    | `tsc --noEmit` (TypeScript strict + noUncheckedIndexedAccess)            |
| `npm run lint`          | ESLint                                                                   |
| `npm run lint:fix`      | ESLint + auto-fix                                                        |
| `npm run format`        | Prettier sur tout le repo                                                |
| `npm run format:check`  | Prettier en mode check (CI)                                              |
| `npm test`              | Vitest (suites unitaires)                                                |
| `npm run test:watch`    | Vitest en watch                                                          |
| `npm run test:ui`       | Vitest UI                                                                |
| `npm run e2e`           | Playwright (boots dev server auto)                                       |
| `npm run e2e:ui`        | Playwright UI mode                                                       |
| **`npm run validate`**  | **type-check + lint + test + build (≈30s, à lancer après chaque modif)** |
| `npm run validate:full` | `validate` + `e2e` (≈3 min, à lancer avant chaque push)                  |

Un hook **pre-commit** (husky + lint-staged) auto-lint et auto-format les fichiers staged. Impossible de commiter du code cassé.

GitHub Actions CI tourne sur chaque push : `validate` partout + `e2e` sur `main`.

## 📁 Structure

```
cap/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing
│   ├── login/                    # Auth
│   ├── onboarding/               # Choix rôle (lycéen / diplômé)
│   ├── hub/                      # Hub à 2 univers post-login
│   ├── decouverte/               # Univers Découverte
│   │   └── marketing/            # 1ère famille jouable
│   │       ├── page.tsx          # fiche secteur éditoriale
│   │       ├── metiers/          # 5 métiers détaillés
│   │       ├── benevoles/        # 2 bénévoles mockés
│   │       └── jeux/             # 7 mini-jeux Marketing
│   ├── programmes/ucl/           # Univers Programmes — pilote UCL
│   │   └── gestion-entreprise/   # 4 sous-modules + 4 mini-jeux + plaquette
│   ├── pitch/                    # Pitch deck 10 slides interactif
│   └── criteres/                 # 10 critères de sélection des écoles
├── components/
│   ├── games/                    # GameShell + 6 mini-jeux jouables
│   ├── pitch/                    # SlideShell + slides
│   ├── landing/                  # Sections landing
│   └── layout/                   # Logo, ThemeToggle, GrainOverlay
├── lib/
│   ├── supabase/                 # client, server, middleware
│   ├── games-registry.ts         # registre central des mini-jeux
│   ├── schools-database.ts       # UCL + module + sous-modules
│   ├── families-database.ts      # 6 familles Découverte
│   ├── jobs-database.ts          # 5 métiers Marketing
│   ├── volunteers-database.ts    # 2 bénévoles Marketing
│   └── scoring.ts                # Helpers de scoring partagés
├── types/
│   ├── database.ts               # Types Supabase (Profile, GameResult, Lead)
│   └── games.ts                  # FamilyId, Skills, GameMeta
├── supabase/
│   └── schema.sql                # SQL idempotent (à jouer 1× dans Dashboard)
├── e2e/                          # Playwright specs
└── .github/workflows/ci.yml      # CI
```

## 🧭 Identité visuelle

Voir [`CLAUDE.md`](./CLAUDE.md) pour la palette complète, les anti-patterns et les conventions de copy. En résumé :

- **Apostrophe Cap&rsquo;** : toujours en `--sun` (`#FFDC32`), iconique
- **Découverte** = `--sun` jaune · **Programmes** = `--pivot` violet
- Bricolage Grotesque (display) + JetBrains Mono (mono)
- Dark mode par défaut, light mode disponible (toggle persistant)
- Border-radius : 0, 16px ou 24px. Jamais `rounded-lg` par défaut
- Animations Framer Motion stagger + spring physics

## 📚 Docs

- [`CLAUDE.md`](./CLAUDE.md) — spec produit complète, contexte hackathon, identité
- [`STATUS.md`](./STATUS.md) — avancement par session, fichiers ajoutés/retirés, décisions techniques
- [`AUDIT.md`](./AUDIT.md) — dette technique identifiée + plan de refactor (généré par Phase 2)

## 🎮 Routes notables

| Route                                              | Ce que c'est              |
| -------------------------------------------------- | ------------------------- |
| `/`                                                | Landing                   |
| `/pitch` (`#1` — `#10`)                            | Pitch deck interactif     |
| `/criteres`                                        | 10 critères choix d'école |
| `/login`, `/onboarding`, `/hub`                    | Auth + onboarding + hub   |
| `/decouverte/marketing/jeux/mapping-concurrentiel` | Mini-jeu drag&drop        |
| `/decouverte/marketing/jeux/mix-marketing-4p`      | Mini-jeu tri 4P           |
| `/programmes/ucl/gestion-entreprise`               | Hub module UCL            |
| `/programmes/ucl/gestion-entreprise/{slug}/jeu`    | 1 des 4 mini-jeux UCL     |
| `/programmes/ucl/gestion-entreprise/termine`       | Plaquette UCL + lead form |
