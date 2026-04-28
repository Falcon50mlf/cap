# 🎮 AUDIT-product.md — Dette gameplay Cap&rsquo;

> Audit **gameplay / game design** — distinct du `AUDIT.md` (qui couvre la dette tech : TS, perf, schéma DB, refactor structurel).
> Ce fichier consolide les findings issus des 4 GDD a posteriori commités sur les jeux UCL (commit `a202dbd`).
> Statut : **3 patterns transverses ouverts** — 4 jeux audités sur 4 UCL.
> Date : 2026-04-28

---

## 🔴 Patterns transverses

Trois patterns reviennent dans plusieurs des 4 audits a posteriori. Ils ne sont pas des bugs : ce sont des **dettes de design** qui dégradent la promesse pédagogique Cap&rsquo;. Chaque pattern est documenté avec son scope, le jeu sain qui sert de référence, et la sortie minimale acceptable.

---

### P1. Wrapper éducatif — anti-pattern #6

> _"Une tâche ennuyeuse avec des points par-dessus reste ennuyeuse."_ — `game-design-knowledge.md` § 7 anti-patterns

- **Sévérité** : 🔴 critique (sape la promesse pédagogique : la mécanique doit **incarner** le concept)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `MarketRadar` (3/4)
- **Jeu sain (golden standard)** : `StatutQuiz` — l&rsquo;arbre de décision **est** le raisonnement juridique. La mécanique = le concept.
- **Référence** : `docs/game-design-knowledge.md` § "Spécificités gamification éducative" + § "Les 7 anti-patterns" #6

**Diagnostic** :

- `EntrepriseExplorer` : drag-and-drop ≠ "comprendre les axes de classification d&rsquo;une entreprise". Le joueur trie par mémoire, pas par compréhension.
- `PestelMatch` : le drag dans 6 buckets est un quiz à choix multiples déguisé. La mécanique pourrait être remplacée par un QCM sans rien perdre.
- `MarketRadar` : le plus problématique — 3 phases enchaînées (segmentation + profils + parts de marché) où la mécanique change mais reste un QCM. Le drag/clic décore la question, il ne la pose pas.

**Sortie minimale** :

- Pour chaque jeu, ajouter **un moment d&rsquo;émergence** où le joueur **voit la conséquence** de son choix avant de valider (M10 Live Preview du catalogue) : preview live du résultat (ex: une carte PESTEL mal classée fait apparaître une faille visible dans l&rsquo;analyse stratégique). Ce n&rsquo;est pas un refactor mais un ajout de feedback diégétique.
- Effort : **M × 3 = ~9 h**
- Ref GDD source : `components/games/EntrepriseExplorer/GDD.md` § 12 + `components/games/PestelMatch/GDD.md` § 12 + `components/games/MarketRadar/GDD.md` § 12

---

### P2. Difficulté one-size-fits-all — anti-pattern #7

> _"Même niveau pour le novice et l&rsquo;expert tue les deux."_ — `game-design-knowledge.md` § 7 anti-patterns

- **Sévérité** : 🟠 importante (casse la mastery curve, casse le replay value)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `StatutQuiz`, `MarketRadar` (4/4)
- **Jeu sain** : aucun.
- **Référence** : `docs/game-design-knowledge.md` § "Théorie du flow" + § "Design checklist" ligne "Difficulté adapte ou modes sélectionnables"

**Diagnostic** :

- Aucun des 4 jeux n&rsquo;a de mode novice/expert, ni de difficulté qui s&rsquo;adapte à la performance.
- Le contenu est statique : un lycéen qui rejoue voit exactement les mêmes cartes/questions/items.
- La courbe de maîtrise s&rsquo;arrête à la 1re partie. Les 2 manches existantes n&rsquo;augmentent que la quantité, pas la complexité.

**Sortie minimale** :

- Ajouter **un objectif caché** par jeu (déblocable à >85% sur 2 manches consécutives) qui révèle un mode plus dur OU un sandbox (cf. `DualPitch` § 11 Replay value pour le pattern "hidden objective + sandbox").
- Effort : **M × 4 = ~12 h**
- Ref GDD source : tableau "Anti-patterns check" § 12 de chacun des 4 GDD UCL

---

### P3. Failure design pauvre

> _"Les erreurs sont des opportunités d&rsquo;apprentissage, jamais juste &lsquo;faux&rsquo;."_ — `game-design-knowledge.md` § "Spécificités gamification éducative"

- **Sévérité** : 🟠 importante (l&rsquo;échec est l&rsquo;endroit où on apprend le plus — et il est gâché)
- **Jeux concernés** : `EntrepriseExplorer`, `PestelMatch`, `MarketRadar` (3/4)
- **Jeu sain** : `StatutQuiz` — chaque branche affiche le **pourquoi** du verrou (capital min, responsabilité, fiscalité) avant de fermer la porte. Le joueur sort de la branche en ayant compris.
- **Référence** : `docs/game-design-knowledge.md` § "Design checklist" ligne "L&rsquo;échec enseigne quelque chose"

**Diagnostic** :

- `EntrepriseExplorer` : un mauvais drag = la carte revient au pool, sans explication. Le joueur réessaie par tâtonnement, pas par compréhension.
- `PestelMatch` : score affiché en fin de manche, mais aucun breakdown par axe. "Tu as 4/6" sans dire **lesquels** étaient mal classés.
- `MarketRadar` : 3 phases d&rsquo;affilée sans feedback intermédiaire — l&rsquo;erreur de phase 1 contamine phase 2 sans que le joueur sache pourquoi.

**Sortie minimale** :

- Sur chaque mauvaise réponse, afficher **une phrase de POURQUOI** (200-400 chars) + lien vers la fiche éducative correspondante. Pas de "FAUX" rouge clignotant : feedback doux, par contraste (cf. `DualPitch` § 8 Failure design pour le pattern de référence).
- Effort : **S × 3 = ~3 h**
- Ref GDD source : `components/games/EntrepriseExplorer/GDD.md` § 8 + `components/games/PestelMatch/GDD.md` § 8 + `components/games/MarketRadar/GDD.md` § 8

---

## 🔧 Bonus : duplication de pattern de code (cross-ref)

Les audits GDD ont aussi mis au jour une duplication structurelle massive du pattern `Pool / Zone / DraggableX / Pill` (~145 lignes/jeu, 3 jeux × 145 ≈ 435 lignes répliquées). C&rsquo;est de la dette **tech**, pas gameplay — voir `AUDIT.md` § I8 pour la sortie cible (`components/games/shared/`) et l&rsquo;effort.

---

## 📋 Mini-jeux sans GDD (à compléter)

- **`MappingConcurrentiel`** : pas de GDD. Le seul jeu UCL+ qui utilise les pointer events natifs (drag 2D libre, pas @dnd-kit) — mécanique singulière qui mériterait sa documentation.
- **`MixMarketing4P`** : pas de GDD. Réutilise la triade `Pool/Zone/DraggableCard/CardPill` (cf. AUDIT.md § I8). Le concept "construire un mix marketing" est le plus proche de l&rsquo;ambition GDD `DualPitch` (M02 Build & Compose) → un GDD a posteriori clarifierait la frontière des deux jeux.

Effort estimé pour ces 2 GDD a posteriori : **~2 h** (template `DualPitch` est réutilisable).

---

## 🗓️ Plan de résolution

Ordre conseillé : **P3 → P1 → P2**. Le failure design est le moins coûteux, le plus pédagogique, et débloque le test des autres patterns.

| Ordre | Pattern | Effort | Jeux concernés                                           | Pourquoi cet ordre ?                                                                      |
| ----- | ------- | ------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1     | **P3**  | ~3 h   | EntrepriseExplorer, PestelMatch, MarketRadar             | Quick win pédagogique, prérequis pour mesurer les effets de P1.                           |
| 2     | **P1**  | ~9 h   | EntrepriseExplorer, PestelMatch, MarketRadar             | Le gros morceau : ajouter du feedback diégétique pour incarner le concept.                |
| 3     | **P2**  | ~12 h  | EntrepriseExplorer, PestelMatch, StatutQuiz, MarketRadar | Replay value + mastery curve. Touche les 4 jeux, à faire en dernier (le plus structurel). |

**Total estimé** : **~24 h** de refactor gameplay, étalable sur 3-4 sessions.

---

## 🔗 Sources et références

- `components/games/EntrepriseExplorer/GDD.md` — audit a posteriori (commit `a202dbd`)
- `components/games/StatutQuiz/GDD.md` — audit a posteriori (commit `a202dbd`) — **golden standard**
- `components/games/PestelMatch/GDD.md` — audit a posteriori (commit `a202dbd`)
- `components/games/MarketRadar/GDD.md` — audit a posteriori (commit `a202dbd`) — **jeu le plus problématique**
- `components/games/DualPitch/GDD.md` — GDD a priori (référence pour les patterns de design propres)
- `AUDIT.md` § I8 — pattern de duplication code (Pool/Zone/DraggablePill triade)
- `docs/game-design-knowledge.md` — référence canonique anti-patterns + checklist
- `docs/game-mechanics-catalog.md` — M01-M12 mécaniques + règles de combinaison
