# STATUS — Cap&rsquo;

> Dernière update : Session 1 · 2026-04-26

## ✅ Fait (Session 1)

- Scaffold Next.js 14 (App Router) + TypeScript strict + Tailwind v3
- Dépendances installées : `framer-motion`, `zustand`, `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- Identité visuelle complète : palette Cap&rsquo; (`--night`, `--sun`, `--pivot`, `--coral`, `--mint`, `--family-*`, `--school-*`, `--discovery`, `--programs`) câblée dans `app/globals.css` + exposée dans `tailwind.config.ts`
- Fonts via `next/font/google` : Bricolage Grotesque (display + body) + JetBrains Mono (mono)
- `<Logo />` (variants `nav` / `hero` / `default`) avec apostrophe jaune décalée + pulse au hover
- `<GrainOverlay />` SVG `feTurbulence` à `opacity: 0.4` injecté dans `app/layout.tsx`
- **Landing complète** (`app/page.tsx`) :
  - Nav + tagline mono "// 2 univers · 6 familles · 30 métiers"
  - Hero 2 colonnes : H1 "Donne-toi un ~~quiz~~ *cap*." + 3 cards inclinées (Découverte jaune, Programmes violet, Bénévole snow)
  - Section "2 univers, 1 cap" — coeur du positionnement, séparateur vertical jaune
  - Grid 6 familles (Conseil, Finance, Marketing, Tech, Startup, Retail) avec icônes Lucide cohérentes
  - Section écoles partenaires : ESCP en featured + 4 cards "Bientôt"
  - Footer sobre
- Animations Framer Motion stagger + spring sur tous les éléments
- Routes WIP stylées : `/onboarding`, `/hub`, `/decouverte`, `/programmes`, `/jeux-libres`, `/dashboard`
- Squelette dossiers : `components/{layout,games,discovery,programs,ui}`, `lib/supabase`, `types/`
- Configs : `.env.example` (Supabase), `.env.local` (gitignored), `README.md` minimal
- `npm run build` passe ✅

## 🟡 En cours

- (rien)

## 🔴 Reste pour Session 2

- Setup Supabase (client browser + server) + magic link auth
- Onboarding lycéen / diplômé (2 paths)
- Page hub à 2 univers (Découverte / Programmes) post-login
- Dashboard minimal (progression sur les 6 familles + contacts ESCP)
- `lib/families-database.ts` — 6 fiches secteurs ONISEP
- `lib/jobs-database.ts` — les 30 métiers
- 1er mini-jeu Découverte (Client Brief, famille Conseil)
- Mini-jeu ESCP `BusinessCanvas` + plaquette + formulaire de contact
- Mock bénévoles (3 par famille)

## 📦 Déploiement

- **Repo GitHub** : _à renseigner après push_
- **URL Vercel** : _à renseigner après deploy_

## 📝 Notes / décisions

- **shadcn 4.5** a été init mais ses composants reposent sur `@base-ui/react` + Tailwind v4 — incompatibles avec notre Tailwind v3. Composants UI supprimés ; on utilise du HTML+Tailwind direct pour la landing. À reconsidérer en Session 2 si on a besoin de Dialog/Toast (plus probable : forker proprement vers shadcn v3).
- ESLint : la règle `react/jsx-no-comment-textnodes` est désactivée car le pattern `// blabla` mono fait partie de l&rsquo;identité visuelle (tags partout dans la landing).
- Border-radius : on utilise 16px (`rounded-2xl` ≈ 16) et 24px (`rounded-3xl` ≈ 24) conformément à l&rsquo;identité, pas de `rounded-lg` par défaut.
- Mode dark uniquement : pas de toggle clair, conformément à la spec CLAUDE.md.
