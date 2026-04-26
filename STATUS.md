# STATUS — Cap&rsquo;

> Dernière update : Session 2 (full reprise) · 2026-04-26 · démo-ready

## ✅ Fait

### Foundation (S1)
- Next.js 14 (App Router) + TS strict + Tailwind v3 + Framer Motion + Zustand + Supabase SDK
- Identité Cap&rsquo; câblée (palette CSS variables + Bricolage Grotesque + JetBrains Mono + GrainOverlay)
- `<Logo />` avec apostrophe jaune iconique + pulse au hover
- **Landing complète** : hero 2 cols + 3 cards inclinées, section "2 univers, 1 cap", grid 6 familles, ESCP featured, **section partenariat école avec modal & insert direct dans `leads`**

### Auth (S2)
- Email + password (sans confirmation, signup direct → session immédiate)
- `/login` avec toggle login ↔ signup, validation password ≥ 6, errors friendly en FR
- `/onboarding` dépouillé : juste le choix du rôle, écrit `profiles.role`
- Auth-gated everywhere (redirect approprié si pas de session ou pas de rôle)
- Logout fonctionnel

### Schema Supabase v1
- 3 tables : `profiles` (id FK auth.users, role nullable), `game_results` (skills jsonb + enjoyment 1-5), `leads` (candidatures écoles)
- RLS partout : user voit/édite que son profil, anon peut insérer des leads (insert-only, pas de read)
- Trigger `handle_new_user` auto-crée le profil au signup avec `role = raw_user_meta_data->>'role'` (null par défaut → /onboarding)

### Hub & Découverte
- `/hub` à 2 univers (Découverte jaune / Programmes violet), header email + déconnexion
- `/decouverte` : grid 6 familles (Marketing live, 5 autres "Bientôt")
- **`/decouverte/marketing` — fiche secteur éditoriale complète** : intro, 4 scènes du quotidien, 3 ranges salaires, 5 étapes parcours, 15 entreprises, soft skills
- `/decouverte/marketing/metiers` : 5 métiers détaillés (Brand Manager, PMM, Growth Marketer, Communication Manager, Chef Produit FMCG) — journée type, salaires, parcours
- `/decouverte/marketing/benevoles` : 2 bénévoles en dur (Léa M., ESCP M2 / Mondelēz · Tom G., Doctolib / ex-Vinted) avec topics, formats, dispo

### Mini-jeux Marketing
- Architecture scalable : `lib/games-registry.ts` + `lib/game-components.ts` (lazy loading) + `<GameShell />` (header sticky + manche counter + instructions toggle + quit confirm + 5-stars rating + Supabase save)
- `/decouverte/marketing/jeux` — hub des 7 jeux (2 jouables / 5 placeholders éditoriaux)
- **`/decouverte/marketing/jeux/[gameId]`** — résolveur dynamique (Coming Soon page si non-mappé)
- **🎮 Mapping Concurrentiel JOUABLE** — 3 manches (Auto, Café, Smartphone), drag & drop pointer events, scoring euclidien, 5 marques par manche, feedback couleurs (mint > 70% / sun > 45% / coral)
- **🎮 Mix Marketing 4P JOUABLE** — 3 manches (Apple, Decathlon, Lush), drag & drop @dnd-kit dans 4 colonnes (Produit/Prix/Place/Promo), 12 cartes par manche, validation avec checkmarks/X
- Sauvegarde auto dans `game_results` à la fin (skills + enjoyment + score + duration), backup localStorage pour mode invité

## 🟡 Décisions produit prises sans confirmation

(L&rsquo;user a explicitement dit "fais confiance, lecture libre depuis CLAUDE.md".)

- **Section partenariat** placée juste avant le footer de la landing (cohérent avec le funnel : on parle aux étudiants, puis à la fin on parle aux écoles)
- **Tagline section partenariat** : "Tu diriges une école ?" (tutoiement même pour B2B, conforme à la copy Cap&rsquo;)
- **Card échantillon ESCP** dans la section partenariat (chiffrée : Time-to-Live 21j, format 8 min) pour montrer concrètement le rendu
- **Email contact partenariat** : `team@cap.app` (placeholder)
- **2 bénévoles Marketing** : Léa M. (étudiante ESCP M2 stagiaire annonceur) et Tom G. (jeune diplômé en poste growth) — couvrent les 2 audiences cibles (étudiant + post-école)
- **Résolveur `[gameId]`** affiche une page Coming Soon éditoriale stylée pour les 5 placeholders (concept, aperçu en 3 bullets, retour) — plus engageante qu&rsquo;une 404
- **Skills tracking** : 4 dimensions (analyse, communication, creativite, strategie) en jsonb pour rester souple. Calcul par jeu : Mapping privilégie analyse, Mix favorise stratégie

## 🔴 Reste pour Session 3

- Module **ESCP Business Plan** (mini-jeu BusinessCanvas + plaquette ESCP + formulaire de contact étudiant qui collecte les leads B2C)
- 5 autres mini-jeux Marketing (Persona Builder, Segmentation, Positionnement, Budget Pub, SWOT)
- Dashboard étudiant `/dashboard` (badges, jeux complétés, secteurs explorés, contacts à venir)
- Mode invité réel `/jeux-libres`
- 5 autres familles à remplir (Conseil, Finance, Tech, Startup, Retail)
- Resend SMTP custom dans Supabase si on revient sur magic link
- Polish responsive mobile sur les pages éditoriales et les jeux

## 📦 Déploiement

- **Repo GitHub** : https://github.com/Falcon50mlf/cap
- **URL Vercel (alias stable)** : https://cap-two-fawn.vercel.app
- **Vercel project** : `lekarma2s-projects/cap` (auto-deploy on push to `main`)

## 🧪 Test end-to-end pour la démo

1. **Logout** sur la landing
2. **/login** → "Première fois ?" → mode signup → `demo@cap.app` / `demo1234` → bouton créer
3. **Onboarding** : choisis "Lycéen·ne" → atterrit sur **/hub**
4. **/hub** → click card jaune "Découverte"
5. **/decouverte** → click card Marketing
6. **/decouverte/marketing** → scroll la fiche entière (intro, quotidien, salaires, parcours, entreprises, soft skills)
7. Click "Voir les 5 métiers" → check les cards
8. Retour, click "Échanger avec bénévoles" → check Léa & Tom
9. Retour, click "Tester avec 7 mini-jeux"
10. Click "Mapping Concurrentiel" (carte jaune en haut) → joue les 3 manches → notation 5 étoiles → submit → retour au hub jeux
11. Click "Mix Marketing (4P)" → joue les 3 manches → submit
12. Vérifie dans **Supabase Table Editor → `game_results`** : 2 lignes créées
13. Click un jeu "Bientôt" (Persona Builder) → vérifie la page Coming Soon
14. Logout, retour landing, scroll en bas, click "Devenir partenaire" → soumets une candidature → vérifie dans **Supabase Table Editor → `leads`**

## 📝 Notes techniques

- **Database type** hand-rolled avec structure complète (Tables/Views/Functions/Enums/CompositeTypes + Relationships par table) pour que l&rsquo;inférence stricte de `@supabase/supabase-js` fonctionne
- **shadcn 4.5** initialement installé puis virié (incompat Tailwind v4 ↔ v3) — on utilise du HTML+Tailwind direct partout
- **ESLint** : `react/jsx-no-comment-textnodes` désactivé (le `// ...` mono fait partie de l&rsquo;identité visuelle)
- **Border-radius** : 16px / 24px conformément à l&rsquo;identité
- **Mode dark only**, pas de toggle clair
- **Mini-jeux mode invité** : `saveGameResult` accepte user_id null (RLS le permet) + backup localStorage `cap.game_results`
- **Drag&drop** : pointer events natifs pour Mapping (positionnement libre), `@dnd-kit/core` pour Mix Marketing (drop zones discrètes)
