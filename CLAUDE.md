# CLAUDE.md — Cap'

> Ce fichier est lu automatiquement par Claude Code à chaque session. Il contient TOUT ce qu'il faut savoir sur le projet. Ne pas le supprimer, ne pas le déplacer.

---

## 🎯 Projet

**Cap'** — Plateforme de découverte des écoles de commerce et de leurs débouchés, à travers des mini-jeux qui simulent le vrai monde pro et les vrais cours.

**Promesse produit** : "Donne-toi un cap." Cap' propose deux univers de mini-jeux complémentaires :

1. **Découverte** : explore les 6 familles de métiers post-école de commerce à travers des mini-jeux qui simulent des situations pro réelles. Après chaque mini-jeu, accès à une fiche secteur (style ONISEP), aux métiers de cette famille, et à un réseau de bénévoles (étudiants en cours d'études + professionnels en poste) pour échanger.
2. **Programmes** : teste les modules de cours emblématiques des écoles partenaires (Business Plan, Change Management, Stratégie…) directement transformés en mini-jeux. Après chaque mini-jeu, accès à la plaquette de l'école et possibilité de transmettre ses coordonnées.

**Public cible** :

1. **Lycéen·ne** qui hésite à s'orienter vers une école de commerce
2. **Jeune diplômé·e** d'école de commerce (ou en cours d'études) qui cherche son orientation pro

**Modèle business** :

- **B2B2C** côté Découverte : freemium pour les étudiants, écoles partenaires recrutent des étudiants ambassadeurs / bénévoles pour leur réseau (effet vertueux : plus de bénévoles = plus de valeur = plus d'étudiants)
- **B2B** côté Programmes : licence par école partenaire (l'école transmet ses modules de cours, on les transforme en mini-jeux, l'école paie pour la visibilité + collecte les leads d'étudiants intéressés)
- Données qualifiées sur les centres d'intérêt des étudiants → valeur pour les écoles dans leur stratégie de recrutement

---

## 🏆 Contexte hackathon

- **Hackathon** : Genius ECAM La Salle — 24h
- **Thème imposé** : La transition
- **Deadline pitch** : demain 11h00
- **Temps de dev restant** : ~10h
- **Critères de jugement** :
  1. **Innovation** : caractère innovant, originalité, valeur ajoutée
  2. **Durabilité** : alignement enjeux du développement durable
  3. **Business** : viabilité, business plan

**Angle "transition"** : Les deux transitions les plus stressantes pour un jeune sont (1) lycée → études supérieures et (2) études → premier métier. Cap' couvre les deux, en remplaçant le stress par de la découverte ludique et concrète.

**Angle "durabilité"** : Bien orienter dès le lycée = moins de réorientations coûteuses, moins d'abandons. Le réseau de bénévoles + la transparence sur les programmes = démocratisation de l'information (un lycéen de banlieue a aujourd'hui beaucoup moins d'accès qu'un lycéen parisien aux retours d'expérience d'étudiants en école de co).

---

## 🏢 Les 6 familles de métiers (univers Découverte)

Chaque famille a sa fiche secteur (style ONISEP) et ses ~5 métiers associés (≈30 métiers au total).

### 1. **Conseil & Stratégie** (`strategy`)

Métiers : Consultant en stratégie (MBB), Consultant transformation (Big 4), Consultant spécialisé (CRM, Data, Digital), Stratégiste interne, Auditeur conseil.

### 2. **Finance** (`finance`)

Métiers : Analyste M&A, Analyste Private Equity, Asset Manager, Auditeur financier, Sales en banque d'investissement.

### 3. **Marketing & Brand** (`marketing`)

Métiers : Brand Manager, Product Marketing Manager, Growth Marketer, Communication Manager, Chef de produit FMCG.

### 4. **Tech & Produit** (`tech`)

Métiers : Product Manager, Product Owner, Tech Sales / SDR, Business Operations en startup, Customer Success Manager.

### 5. **Entrepreneuriat & Startups** (`startup`)

Métiers : Founder / Co-founder, Chief of Staff, Venture Capitalist analyste, Business Developer en startup, Programme Manager incubateur.

### 6. **Luxe, Retail & FMCG** (`retail`)

Métiers : Buyer / Acheteur, Visual Merchandiser, Retail Manager, Brand Ambassador (luxe), Trade Marketing Manager.

⚠️ La base complète des 30 métiers + les fiches secteurs sont dans `lib/families-database.ts` et `lib/jobs-database.ts` — voir specs plus bas.

---

## 🏫 Les écoles partenaires (univers Programmes)

Pour le hackathon, on **simule UN partenariat école** avec UN module transformé en mini-jeu.

### École partenaire pilote : **Université Catholique de Lille (UCL Lille)**

- **Module disponible** : "Introduction à la gestion d'entreprise" (cours de Monica Scarano)
- **4 sous-modules** + 4 mini-jeux :
  1. Reconnaître une entreprise → `EntrepriseExplorer` (tri multi-critères)
  2. Choisir le bon statut → `StatutQuiz` (arbre de décision)
  3. Analyser l'environnement → `PestelMatch` (drag & drop PESTEL)
  4. Comprendre son marché → `MarketRadar` (mixte QCM + calculs)
- **Plaquette UCL** : page de fin avec présentation de l'école + programmes liés
- **Formulaire de contact** : capture des coordonnées étudiant → "L'UCL te recontactera sous 7 jours"

### Roadmap futurs partenariats

- À renseigner au fil des partenariats signés.

---

## 🎨 Identité visuelle — Direction "Cap'" (Tech ludique)

### Logo / wordmark

- **"Cap'"** avec apostrophe stylisée. Apostrophe en jaune `--sun`, légèrement plus grosse (1.2x), légèrement décalée vers le haut (translateY -2px).
- Au hover : apostrophe pulse subtilement (scale 1 → 1.15 → 1, animation 0.6s).
- Variantes `<Logo size="hero" />` et `<Logo size="nav" />`.

### Palette de couleurs (CSS variables, à utiliser strictement)

```css
:root {
  /* Backgrounds */
  --night: #0e0e10;
  --night-soft: #1a1a20;
  --snow: #f0f0f0;

  /* Accents */
  --sun: #ffdc32; /* jaune signature - apostrophe, CTA principal */
  --pivot: #8c6eff; /* violet - éléments interactifs secondaires */
  --coral: #ff4d6d; /* rouge - erreurs, urgence, timer bas */
  --mint: #00d4a8; /* vert - succès, validation */

  /* Family colors (univers Découverte) */
  --family-strategy: #8c6eff;
  --family-finance: #00d4a8;
  --family-marketing: #ff4d6d;
  --family-tech: #ffdc32;
  --family-startup: #ff8a3d;
  --family-retail: #e5c7a0;

  /* School colors (univers Programmes) */
  /* Univers (couleur dominante de chaque univers) */
  --discovery: #ffdc32; /* univers Découverte = jaune sun */
  --programs: #8c6eff; /* univers Programmes = violet pivot */

  /* Neutrals */
  --night-700: rgba(255, 255, 255, 0.7);
  --night-500: rgba(255, 255, 255, 0.5);
  --night-200: rgba(255, 255, 255, 0.15);
  --night-100: rgba(255, 255, 255, 0.08);
}
```

**Mode par défaut** : DARK MODE.

### Typographie

- **Display / titres** : **Bricolage Grotesque** (Google Fonts) — weights 400, 600, 800
- **Body / UI** : **Bricolage Grotesque** weight 400-500
- **Mono / scores / timers / méta** : **JetBrains Mono** weight 400, 600

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,400;10..48,600;10..48,800&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

### Style guidelines

- **Animations** : Framer Motion. Stagger sur les éléments. Spring physics.
- **Cards inclinées** : `rotate(-3deg)` à `rotate(6deg)` sur les cards décoratives uniquement.
- **Grain / noise** : overlay SVG `feTurbulence` à `opacity: 0.4` sur les fonds dark.
- **Glow / box-shadow colorés** : pour les CTA (`box-shadow: 0 0 24px var(--sun)`).
- **Apostrophe iconique** : toujours jaune.
- **Border-radius** : 0, 16px, ou 24px. Jamais 8px par défaut.
- **Ton de copy** : tutoiement, direct, frais, jamais infantilisant.

### Anti-patterns à NE JAMAIS faire

- ❌ Inter, Roboto, Arial en font display
- ❌ Gradient violet → rose générique
- ❌ Tout en `rounded-lg`
- ❌ shadcn brut sans customisation
- ❌ Émojis en mascotte
- ❌ Mode clair gris/bleu corporate
- ❌ Confettis génériques
- ❌ Ton "conseiller d'orientation" niais

---

## 🛠️ Stack technique (figée)

| Couche      | Tech                      | Notes                     |
| ----------- | ------------------------- | ------------------------- |
| Framework   | **Next.js 14** App Router | TypeScript strict         |
| Styling     | **Tailwind CSS**          | + CSS variables ci-dessus |
| Composants  | **shadcn/ui**             | Customisés                |
| Animations  | **Framer Motion**         |                           |
| État        | **Zustand**               | Store global léger        |
| Auth + DB   | **Supabase**              | Auth magic link           |
| Hébergement | **Vercel**                | Push GitHub → deploy auto |

### Variables d'environnement (`.env.local`)
