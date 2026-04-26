# STATUS — Cap&rsquo;

> Dernière update : Session 2 · 2026-04-26 · auth pivotée vers email+password

## ✅ Fait (Session 1 + Session 2 partielle)

### Foundation (S1)
- Scaffold Next.js 14 (App Router) + TS strict + Tailwind v3 + Framer Motion + Zustand + Supabase SDK
- Identité visuelle Cap&rsquo; cablée (palette CSS variables + Bricolage Grotesque + JetBrains Mono + GrainOverlay)
- `<Logo />` avec apostrophe jaune iconique
- **Landing complète** : hero 2 cols + 3 cards inclinées, section "2 univers, 1 cap", grid 6 familles, ESCP featured + 4 écoles "Bientôt", footer
- Routes WIP stylées
- `npm run build` passe ✅, déploiement Vercel auto sur push

### Auth (S2 — pivot)
- **Stratégie d&rsquo;auth : email + password** (au lieu de magic link / OTP)
- Raison : la limite Supabase email built-in (3/h project-wide) bloquait la démo. Pas de Resend/SMTP custom à configurer pour l&rsquo;instant.
- `/login` : email + password + toggle login/signup, validation client, gestion erreurs friendly en français, redirect post-auth role-aware
- `/onboarding` : strip-down — juste le choix du rôle après auth, écrit `profiles.role`
- `/hub` minimum-viable : auth-gated, affiche email + rôle + 2 univers cards (Découverte / Programmes) + bouton logout
- Landing → CTA pointe sur `/login`
- `lib/supabase/{client,server,middleware}.ts` typés via `Database`
- `middleware.ts` refresh la session sur toutes les routes
- `app/auth/callback/route.ts` (backup pour magic link, encore utilisable si besoin)

### Schema Supabase
- `supabase/schema.sql` v0 : profiles (id FK auth.users, role nullable, first/last name, niveau) + discovery_runs + program_leads, RLS partout, trigger auto-profile au signup
- `supabase/migration_001_role_nullable.sql` : drop NOT NULL + default sur `profiles.role`, trigger ne pré-remplit plus

## 🟡 En cours

- (rien)

## 🔴 Reste

### Avant pitch (priorités)
- [ ] **1 mini-jeu Découverte** jouable (ex: Client Brief, famille Conseil & Stratégie) — fort effet pitch
- [ ] **Mini-jeu ESCP `BusinessCanvas`** + plaquette mockée + formulaire de contact (coeur business B2B, démo de la dualité Découverte/Programmes)
- [ ] `lib/families-database.ts` — 6 fiches secteurs ONISEP-style
- [ ] `lib/jobs-database.ts` — les 30 métiers
- [ ] Mock bénévoles (3 par famille)
- [ ] Page `/decouverte` qui liste les 6 familles (cliquable)
- [ ] Page `/programmes` qui liste ESCP (cliquable, mène au mini-jeu)

### Plus tard
- [ ] Resend SMTP custom dans Supabase (si on veut revenir au magic link / OTP en prod)
- [ ] Dashboard `/dashboard` (progression sur les 6 familles + mes contacts ESCP)
- [ ] Mode invité réel sur `/jeux-libres`
- [ ] `supabase gen types typescript` quand on aura la CLI (remplacera `types/database.ts` hand-rolled)

## ⚠️ Actions manuelles à faire dans Supabase Dashboard

1. **SQL Editor** → joue `supabase/migration_001_role_nullable.sql`
2. **Authentication > Providers > Email** :
   - Toggle **"Confirm email"** sur **OFF**
   - Save
3. (Optionnel mais recommandé) **Authentication > Users** → supprime tes users de test des essais magic link / OTP, sinon ils ont déjà un profil avec role potentiellement set

## 📦 Déploiement

- **Repo GitHub** : https://github.com/Falcon50mlf/cap
- **URL Vercel (alias stable)** : https://cap-two-fawn.vercel.app
- **Vercel project** : `lekarma2s-projects/cap` (auto-deploy on push to `main`)

## 📝 Notes / décisions

- **Auth pivotée magic link → OTP code → email+password** en cours de Session 2 à cause de rate limits Supabase. Email+password est la stratégie la plus robuste pour la démo de demain. Pas de Resend/SMTP à configurer, pas d&rsquo;email envoyé tout court.
- **shadcn 4.5** (installé en S1) reposait sur `@base-ui/react` + Tailwind v4 — incompatibles avec notre Tailwind v3. Composants UI supprimés ; on utilise du HTML+Tailwind direct partout. À reconsidérer si besoin de Dialog/Toast plus tard.
- ESLint : `react/jsx-no-comment-textnodes` désactivé car `// blabla` mono fait partie de l&rsquo;identité visuelle (utilisé partout).
- Border-radius : 16px / 24px conformément à l&rsquo;identité, pas de `rounded-lg` par défaut.
- Mode dark uniquement, pas de toggle clair (conforme spec CLAUDE.md).
- Schéma DB : `Database` type hand-rolled avec structure complète (Relationships/Views/Functions/Enums/CompositeTypes) pour que l&rsquo;inférence stricte de `@supabase/supabase-js` fonctionne.
