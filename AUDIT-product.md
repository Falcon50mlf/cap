# 🎮 AUDIT-product.md — Dette gameplay Cap&rsquo;

> Audit **gameplay / game design** — distinct du `AUDIT.md` (qui couvre la dette tech : TS, perf, schéma DB, refactor structurel).
> Ce fichier consolide les findings issus des **6 GDD a posteriori** commités (4 UCL au commit `a202dbd` + 2 Marketing à venir : `MixMarketing4P` + `MappingConcurrentiel`).
> Statut : **3 patterns transverses ouverts** — couverture GDD **7/7** (6 jeux implémentés + 1 a priori `DualPitch`).
> Date : 2026-04-28 (mise à jour Marketing)

---

## 🔴 Patterns transverses

Trois patterns reviennent dans plusieurs des audits a posteriori. Ils ne sont pas des bugs : ce sont des **dettes de design** qui dégradent la promesse pédagogique Cap&rsquo;. Chaque pattern est documenté avec son scope, le jeu sain qui sert de référence, et la sortie minimale acceptable.

### 🌟 Golden standards — les 2 références à imiter

Les audits ont fait émerger **deux jeux** qui servent de référence design pour la suite Cap&rsquo; — un par grande catégorie de la plateforme :

- **`StatutQuiz` (univers Programmes / UCL)** — golden standard sur **P1 Wrapper** et **P3 Failure design**. La mécanique d&rsquo;arbre de décision **est** le raisonnement juridique : choisir un statut SARL/SAS/EI **est** le travail du conseil. Chaque branche affiche le **pourquoi** du verrou (capital min, responsabilité, fiscalité) — l&rsquo;échec enseigne par contraste, pas par punition.
- **`MappingConcurrentiel` (univers Découverte / Marketing)** — golden standard sur **P1 Wrapper**. Le drag 2D continu sur un plan prix × qualité (via pointer events natifs, hors @dnd-kit) **est** l&rsquo;acte de positionnement concurrentiel. Pas de "bonne case", un score gradient sur la distance à la cible. La mécanique = le concept.

→ Quand on attaquera la résolution des patterns, **chaque jeu déficient se compare au golden standard de sa catégorie** : un jeu Programmes regarde StatutQuiz, un jeu Découverte/Marketing regarde MappingConcurrentiel. Aucun des deux n&rsquo;évite **P2 one-size-fits-all** — ce pattern est universel et nécessitera un effort transverse sans référence interne.

---

### P1. Wrapper éducatif — anti-pattern #6

> _"Une tâche ennuyeuse avec des points par-dessus reste ennuyeuse."_ — `game-design-knowledge.md` § 7 anti-patterns

- **Sévérité** : 🔴 critique (sape la promesse pédagogique : la mécanique doit **incarner** le concept)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `MarketRadar`, `MixMarketing4P` (4/6 jeux implémentés)
- **Jeux sains (golden standards wrapper-free)** :
  - `StatutQuiz` (UCL) — l&rsquo;arbre de décision **est** le raisonnement juridique.
  - `MappingConcurrentiel` (Marketing) — le drag 2D continu sur axes prix × qualité **est** le positionnement concurrentiel. Mécanique = concept.
- **Référence** : `docs/game-design-knowledge.md` § "Spécificités gamification éducative" + § "Les 7 anti-patterns" #6

**Diagnostic** :

- `EntrepriseExplorer` : drag-and-drop ≠ "comprendre les axes de classification d&rsquo;une entreprise". Le joueur trie par mémoire, pas par compréhension.
- `PestelMatch` : le drag dans 6 buckets est un quiz à choix multiples déguisé. La mécanique pourrait être remplacée par un QCM sans rien perdre.
- `MarketRadar` : le plus problématique — 3 phases enchaînées (segmentation + profils + parts de marché) où la mécanique change mais reste un QCM. Le drag/clic décore la question, il ne la pose pas.
- `MixMarketing4P` : le titre et la promesse ("tu pilotes le mix marketing") évoquent **M02 Build & Compose**, mais la mécanique réelle est **M01 Drag & Sort** dans 4 buckets fixes (`expected: ZoneId` codé en dur ligne par carte). Pas d&rsquo;arbitrage stratégique entre les 4P. La mécanique décore la promesse.

**Sortie minimale** :

- Pour chaque jeu, ajouter **un moment d&rsquo;émergence** où le joueur **voit la conséquence** de son choix avant de valider (M10 Live Preview du catalogue) : preview live du résultat (ex: une carte PESTEL mal classée fait apparaître une faille visible dans l&rsquo;analyse stratégique). Ce n&rsquo;est pas un refactor mais un ajout de feedback diégétique.
- Effort : **M × 4 = ~12 h**
- Ref GDD source : `components/games/EntrepriseExplorer/GDD.md` § 12 + `components/games/PestelMatch/GDD.md` § 12 + `components/games/MarketRadar/GDD.md` § 12 + `components/games/MixMarketing4P/GDD.md` § 12

---

### P2. Difficulté one-size-fits-all — anti-pattern #7

> _"Même niveau pour le novice et l&rsquo;expert tue les deux."_ — `game-design-knowledge.md` § 7 anti-patterns

- **Sévérité** : 🟠 importante (casse la mastery curve, casse le replay value)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `StatutQuiz`, `MarketRadar`, `MixMarketing4P`, `MappingConcurrentiel` (6/6 jeux implémentés)
- **Jeu sain** : aucun. Le pattern est **universel** dans la suite Cap&rsquo;.
- **Référence** : `docs/game-design-knowledge.md` § "Théorie du flow" + § "Design checklist" ligne "Difficulté adapte ou modes sélectionnables"

**Diagnostic** :

- Aucun des 6 jeux n&rsquo;a de mode novice/expert, ni de difficulté qui s&rsquo;adapte à la performance.
- Le contenu est statique : un lycéen qui rejoue voit exactement les mêmes cartes/questions/items.
- La courbe de maîtrise s&rsquo;arrête à la 1re partie. Les manches existantes n&rsquo;augmentent que la quantité, pas la complexité.
- **Les 2 audits Marketing confirment l&rsquo;ubiquité du pattern** : `MixMarketing4P` (3 marques de difficulté identique) et `MappingConcurrentiel` (3 secteurs distincts mais pas explicitement plus durs) souffrent du même angle mort.

**Sortie minimale** :

- Ajouter **un objectif caché** par jeu (déblocable à >85% sur 2 manches consécutives) qui révèle un mode plus dur OU un sandbox (cf. `DualPitch` § 11 Replay value pour le pattern "hidden objective + sandbox").
- Effort : **M × 6 = ~18 h**
- Ref GDD source : tableau "Anti-patterns check" § 12 de chacun des 6 GDD a posteriori

---

### P3. Failure design pauvre

> _"Les erreurs sont des opportunités d&rsquo;apprentissage, jamais juste &lsquo;faux&rsquo;."_ — `game-design-knowledge.md` § "Spécificités gamification éducative"

- **Sévérité** : 🟠 importante (l&rsquo;échec est l&rsquo;endroit où on apprend le plus — et il est gâché)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `MarketRadar` (plein) + `MixMarketing4P`, `MappingConcurrentiel` (partiel — visuel OK, narratif manquant) — soit 5/6 jeux implémentés
- **Jeu sain** : `StatutQuiz` — chaque branche affiche le **pourquoi** du verrou (capital min, responsabilité, fiscalité) avant de fermer la porte. Le joueur sort de la branche en ayant compris.
- **Référence** : `docs/game-design-knowledge.md` § "Design checklist" ligne "L&rsquo;échec enseigne quelque chose"

**Diagnostic** :

- `EntrepriseExplorer` : un mauvais drag = la carte revient au pool, sans explication. Le joueur réessaie par tâtonnement, pas par compréhension.
- `PestelMatch` : score affiché en fin de manche, mais aucun breakdown par axe. "Tu as 4/6" sans dire **lesquels** étaient mal classés.
- `MarketRadar` : 3 phases d&rsquo;affilée sans feedback intermédiaire — l&rsquo;erreur de phase 1 contamine phase 2 sans que le joueur sache pourquoi.
- `MixMarketing4P` (partiel) : feedback visible (bord vert/rouge + ✓/✗ par carte) mais **muet** — aucun pourquoi par carte. Le joueur sait qu&rsquo;il s&rsquo;est trompé sur "Programme de reprise → Prix", pas pourquoi.
- `MappingConcurrentiel` (partiel) : feedback visuel **excellent** (vraies positions affichées en mint, score par marque) mais aucune explication narrative ("BMW est ici parce que…"). Reset brutal via `window.location.reload()`.

**Sortie minimale** :

- Sur chaque mauvaise réponse, afficher **une phrase de POURQUOI** (200-400 chars) + lien vers la fiche éducative correspondante. Pas de "FAUX" rouge clignotant : feedback doux, par contraste (cf. `DualPitch` § 8 Failure design pour le pattern de référence).
- Effort : **S × 3 (plein) + XS × 2 (compléter le partiel) = ~5 h**
- Ref GDD source : `components/games/EntrepriseExplorer/GDD.md` § 8 + `components/games/PestelMatch/GDD.md` § 8 + `components/games/MarketRadar/GDD.md` § 8 + `components/games/MixMarketing4P/GDD.md` § 8 + `components/games/MappingConcurrentiel/GDD.md` § 8

---

## 🔧 Bonus : duplication de pattern de code (cross-ref)

Les audits GDD ont mis au jour une duplication structurelle massive du pattern `Pool / Zone / DraggableX / Pill` (~145 lignes/jeu, **3 jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `MixMarketing4P` — confirmé par l&rsquo;audit `MixMarketing4P` § Qualité code #6 ≈ 435 lignes répliquées). C&rsquo;est de la dette **tech**, pas gameplay — voir `AUDIT.md` § I8 pour la sortie cible (`components/games/shared/`) et l&rsquo;effort (L, ~4 h).

`MappingConcurrentiel` reste **hors périmètre** de cette extraction (drag 2D continu via pointer events natifs, pattern singulier — voir `MappingConcurrentiel/GDD.md` § Qualité code #7 pour les 2 options et la recommandation par défaut "laisser à part").

---

## ✅ Couverture GDD : 7/7

- 6 jeux implémentés audités (4 UCL au commit `a202dbd` + 2 Marketing au commit suivant).
- 1 GDD a priori : `DualPitch` (proposition non implémentée, sert de référence design).
- Mise à jour : 2026-04-28.

---

## 🗓️ Plan de résolution

Ordre conseillé : **P3 → P1 → P2**. Le failure design est le moins coûteux, le plus pédagogique, et débloque le test des autres patterns.

| Ordre | Pattern | Effort | Jeux concernés                                                                                        | Pourquoi cet ordre ?                                                                         |
| ----- | ------- | ------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1     | **P3**  | ~5 h   | EntrepriseExplorer, PestelMatch, MarketRadar (plein) + MixMarketing4P, MappingConcurrentiel (partiel) | Quick win pédagogique, prérequis pour mesurer les effets de P1.                              |
| 2     | **P1**  | ~12 h  | EntrepriseExplorer, PestelMatch, MarketRadar, MixMarketing4P                                          | Le gros morceau : ajouter du feedback diégétique pour incarner le concept.                   |
| 3     | **P2**  | ~18 h  | Les 6 jeux implémentés                                                                                | Replay value + mastery curve. Touche tous les jeux, à faire en dernier (le plus structurel). |

**Total estimé** : **~35 h** de refactor gameplay, étalable sur 5-6 sessions.

---

## 🔗 Sources et références

- `components/games/EntrepriseExplorer/GDD.md` — audit a posteriori (commit `a202dbd`)
- `components/games/StatutQuiz/GDD.md` — audit a posteriori (commit `a202dbd`) — **golden standard P3 (failure design)**
- `components/games/PestelMatch/GDD.md` — audit a posteriori (commit `a202dbd`)
- `components/games/MarketRadar/GDD.md` — audit a posteriori (commit `a202dbd`) — **jeu le plus problématique**
- `components/games/MixMarketing4P/GDD.md` — audit a posteriori (Marketing) — confirme triade § I8 + P1 wrapper
- `components/games/MappingConcurrentiel/GDD.md` — audit a posteriori (Marketing) — **golden standard P1 (wrapper-free)** + pattern code singulier
- `components/games/DualPitch/GDD.md` — GDD a priori (référence pour les patterns de design propres)
- `AUDIT.md` § I8 — pattern de duplication code (Pool/Zone/DraggablePill triade — 3 jeux confirmés)
- `docs/game-design-knowledge.md` — référence canonique anti-patterns + checklist
- `docs/game-mechanics-catalog.md` — M01-M12 mécaniques + règles de combinaison

---

> **Golden standards à garder en tête** : `StatutQuiz` (Programmes/UCL — P1 + P3) et `MappingConcurrentiel` (Découverte/Marketing — P1). Toute résolution de pattern compare le jeu déficient à son golden de catégorie.
