# GDD — Mapping Concurrentiel (audit a posteriori)

> Famille **Marketing** · concept : positionnement concurrentiel sur axes prix × qualité perçue
> Statut : **implémenté** — `components/games/MappingConcurrentiel.tsx` (~511 lignes). Ce GDD est un **audit rétroactif** du code existant, pas une proposition.
> Fichier audité au commit `db23659`.

## 1. Player fantasy

Tu es **brand strategist qui cartographie un secteur** : tu places 5 marques concurrentes sur un plan 2D continu (axes prix bas → haut, qualité basse → haute) en t&rsquo;appuyant sur ta perception. Trois secteurs successifs : auto, café, smartphone.

> Cette fantasy **fonctionne**. Le geste de placer un point sur un plan est intuitif, et la perception de marque (Dacia bas-de-gamme vs Lamborghini ultra-premium) est culturellement chargée. Le joueur **fait** quelque chose qui ressemble vraiment à du brand strategy.

## 2. Core verb

**Positionner** (5 marques × 3 secteurs sur un plan 2D continu)

Le verbe est **continu**, pas discret : aucune des coordonnées cibles `(0.15, 0.2)` ou `(0.95, 0.92)` n&rsquo;est révélée au joueur ; le scoring est basé sur la **distance euclidienne** à la cible (cf. `dist()` + `matchScore()` lignes 53-61). Plus tu es proche, mieux c&rsquo;est. Pas de bonne / mauvaise case.

→ Mapping vers le catalog : c&rsquo;est un **hybride M03 Predict & Reveal × pattern original** (drag continu au lieu de slider). Le pattern n&rsquo;est pas listé comme tel dans `docs/game-mechanics-catalog.md`.

> **Choix d&rsquo;implémentation singulier** : ce jeu utilise des **pointer events natifs** (`onPointerDown` / `onPointerMove` / `setPointerCapture`) au lieu de @dnd-kit. C&rsquo;est cohérent avec le besoin d&rsquo;un drag 2D continu sur un plan (pas de zones discrètes à matcher), mais ça l&rsquo;exclut de tout shared/ basé sur @dnd-kit. Voir § Améliorations.

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé **deux concepts** :

1. **Le mapping concurrentiel comme outil** : on positionne des marques sur des axes pour visualiser un marché et identifier les "trous" (positionnements vacants).
2. **La distinction prix / qualité perçue** : ce ne sont pas la même chose (un café Maxwell House est cher au kg mais perçu bas de gamme ; un Hayb est cher ET haut de gamme).

C&rsquo;est un objectif **plus profond** que MixMarketing4P (qui est de la classification) — ici le joueur doit **construire un jugement** sur chaque marque, pas mémoriser une étiquette.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Découvrir que des marques qu&rsquo;on perçoit comme "rivales" (Toyota / BMW, Nespresso / Starbucks) occupent en réalité des positions distinctes sur un plan 2D, et que cette distinction est l&rsquo;outil principal d&rsquo;un brand manager.
2. **Expression** — Le profil "perception de marque" du joueur émerge silencieusement : tu places systématiquement Tesla très haut en qualité (joueur tech-enthousiaste) ou plus bas (joueur sceptique). Le scoring révèle ton calibrage par rapport au benchmark.

Ces deux aesthetics sont **alignées avec l&rsquo;identité Cap&rsquo;** (cf. § Spécificités Cap&rsquo; dans `game-design-knowledge.md`).

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M03 — Predict & Reveal** (catalog § M03), version 2D continue.

- 5 marques par manche
- Chaque marque a une coordonnée cible `(x, y)` invisible au joueur
- Le joueur place chaque marque (clic dans le pool → apparition au centre, puis drag)
- À la validation, les coordonnées cibles s&rsquo;affichent (`vraie pos.`) + score par marque
- Score = `(1 - distance / sqrt(2)) × 100` (sqrt(2) = distance max possible sur le plan unitaire)

**Modifier** : aucun timer, aucun multiplayer, aucun hidden info supplémentaire (la position cible est l&rsquo;hidden info).

**Pourquoi pas M01 Drag & Sort** : il n&rsquo;y a pas de zones discrètes. Le plan 2D est continu, le score est gradient. C&rsquo;est intrinsèquement différent de "trier dans des cases".

## 6. Tension source

**Forte et bien construite**. Trois tensions qui se renforcent :

1. **Information cachée** : les positions cibles sont invisibles. Le joueur doit **estimer**, pas se rappeler.
2. **Continu, pas binaire** : il n&rsquo;y a pas de "bonne case", il y a un score gradient. Tu peux être à 87% ou à 64% — la nuance crée de l&rsquo;engagement.
3. **Auto-vérification cognitive** : pour placer Toyota, tu dois te demander "où je la mets vs Dacia et BMW ?". La position est **relative**, pas absolue. Le joueur réfléchit en termes de marché, pas en termes d&rsquo;étiquette.

→ Pas de timer (cohérent Cap&rsquo;). La tension vient de **l&rsquo;auto-doute**, pas du chrono.

## 7. Mastery curve

**Modérée**. 3 manches scriptées (auto → café → smartphone) qui ne sont pas explicitement plus difficiles, mais qui exercent des **muscles différents** :

- Auto : marques très lisibles culturellement (Dacia / BMW / Lamborghini → consensus social fort)
- Café : marques plus subtiles (Carte Noire vs Starbucks vs Hayb — Hayb est niche)
- Smartphone : positionnements **mouvants** (Pixel monte en gamme, Samsung A descend, Huawei est politisé)

Le joueur progresse en transférant le pattern d&rsquo;une catégorie à une autre — c&rsquo;est de la **transfer learning** au sens du knowledge base (§ Spécificités gamification éducative).

⚠️ Mais : pas de mode novice/expert, pas d&rsquo;objectif caché, pas de progression vers des plans à plus de 2 axes. Anti-pattern **#7 one-size-fits-all** **présent** (cf. AUDIT-product.md § P2).

## 8. Failure design

**Le meilleur de la suite Marketing actuelle**, mais perfectible.

- ✅ À la validation, les **vraies positions** s&rsquo;affichent en mint sur le plan (lignes 245-263) — le joueur **voit** physiquement l&rsquo;écart entre sa perception et le benchmark.
- ✅ Score par marque visible dans le `ResultPanel` (lignes 380-394) — granularité fine.
- ✅ Couleur par marque selon proximité (`colorForMatch`) — feedback visuel coherent.
- ✅ Le bouton `RotateCcw` permet de reset (mais via `window.location.reload()` — voir § Qualité code).
- ❌ Pas de **pourquoi** narratif : "BMW est en haut à droite parce que…" n&rsquo;est jamais expliqué. Le joueur voit l&rsquo;écart sans toujours comprendre la logique.
- ❌ Pas de retry intra-manche : une fois validé, on enchaîne. Le joueur qui voudrait re-tenter avec sa nouvelle compréhension doit reload toute la page.

→ Anti-pattern **P3 failure design pauvre** **partiellement présent** : le visible est excellent, le narratif manque.

## 9. Win condition + closure

À la fin de la 3e manche :

1. Score moyen des 3 manches → injecté dans `shell.complete(skills, finalScore, { roundScores })`
2. Skills calculés via `computeSkills` (lignes 415-426) :
   - `analyse` : 30 si score ≥ 70 par manche, 20 si ≥ 50, 10 sinon (cumulatif, max 100)
   - `communication` : forfait 30 (10 par manche)
   - `creativite` : forfait 15 (5 par manche)
3. Pas de reveal final spécifique au jeu — la closure est gérée par GameShell.

→ Idem MixMarketing4P : closure fonctionnelle mais pas marquante. Pas de reveal "voici la carte concurrentielle réelle de l&rsquo;industrie", pas de comparaison inter-secteurs ("tu places Tesla pareil que la majorité des joueurs ?").

## 10. Game feel notes

**Le plus soigné des 6 jeux Cap&rsquo;** sur ce critère.

- ✅ `motion.div` + `layout` sur les pastilles de marque — la transition entre placements est animée en spring (`stiffness: 300, damping: 28`).
- ✅ `boxShadow: 0 0 12px ${c}` sur chaque pastille placée — glow coloré qui change au validate (mint / sun / coral selon proximité).
- ✅ Plan avec gradient radial + grain implicite via `radial-gradient(... rgba(255,77,109,0.04) ...)` — fidèle au branding marketing-coral.
- ✅ Axes labels en mono uppercase tracking-widest — typo Cap&rsquo;.
- ✅ Drag 2D natif sans saccade grâce à `setPointerCapture` + `touch-none`.
- ✅ Cibles "vraie pos." en mint au validate — moment reveal explicit.
- ❌ Pas de tick audio au drag start.
- ❌ Pas de drumroll typographique sur le score final (60px direct, sans animation de comptage).
- ❌ Pas de particle burst quand on atteint > 90% sur une marque.
- ⚠️ Pas de feedback live pendant le drag (le joueur ne sait pas qu&rsquo;il est "près du but" avant de valider — ce qui est **volontaire** pour M03 Predict & Reveal, donc OK).

## 11. Replay value

**Modéré-faible**.

- 3 secteurs scriptés, contenu fixe.
- Pas de hidden objective.
- Pas de mode sandbox (entrer un secteur libre).
- ⚠️ Le `RotateCcw` reload toute la page — efficace mais brutal, perd le contexte GameShell.

→ Une seule run épuise le contenu. Mais la **rejouabilité naturelle** est un peu meilleure que MixMarketing4P parce que la position 2D continue invite à "essayer de faire mieux" (chaque marque a un score visible — incentive d&rsquo;optimisation que MixMarketing4P n&rsquo;a pas).

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | État ?                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité — score = % de proximité aux cibles, parfaitement signifiant.                                                                                                                                                                                        |
| 2   | Badge spam                                | ✅ Évité — 1 badge par manche dans `RoundsBadge`, granularité par marque dans le `ResultPanel`.                                                                                                                                                               |
| 3   | Forced grinding                           | ✅ Évité — 3 secteurs choisis pour leur diversité conceptuelle (volume / niche / mouvement).                                                                                                                                                                  |
| 4   | Punitive failure                          | ✅ Évité — `RotateCcw` permet retry libre (méthode brutale mais fonctionnelle).                                                                                                                                                                               |
| 5   | Pay-to-win éducatif                       | ✅ N/A.                                                                                                                                                                                                                                                       |
| 6   | **Gamification comme wrapper**            | ✅ **Évité** — la mécanique (drag 2D continu sur plan prix × qualité) **incarne** le concept (positionnement concurrentiel sur axes). C&rsquo;est le seul jeu Marketing où la mécanique = le concept. **Contre-exemple précieux pour AUDIT-product.md § P1**. |
| 7   | **Difficulté one-size-fits-all**          | ⚠️ **Présent** — pas de mode adaptatif, pas d&rsquo;objectif caché, pas de plan 3+ axes débloquable. Cf. AUDIT-product.md § P2.                                                                                                                               |

---

## Améliorations (depuis l&rsquo;audit)

### Mécaniques / Game design

1. **Manque le pourquoi narratif** (cf. AUDIT-product.md § P3, partiel) : à la validation, ajouter une phrase courte (200-400 chars) sous chaque marque expliquant **pourquoi sa position cible est ce qu&rsquo;elle est**. Ex: "Tesla : prix élevé (segment premium) + qualité perçue très haute (innovation, statut social, écosystème). Ne pas confondre qualité technique et perçue : le score Consumer Reports n&rsquo;est pas le top du marché." **Effort** : M (rédaction des 15 micro-explications × 5 marques × 3 manches).

2. **Mode "ton positionnement vs majorité des joueurs"** (M12 Multiplayer Compare en lecture, pas leaderboard) : agréger les positions des autres joueurs et afficher un nuage de points. Le score garde la cible "experte" comme référence mais on **voit** la dispersion sociale. **Effort** : L (Supabase agrégation + viz). Très fort pour Discovery + Expression.

3. **Hidden objective** : si tu fais > 85% sur 2 manches consécutives, déblocage d&rsquo;un mode "axes libres" où le joueur **choisit ses 2 axes** (durabilité, jeunesse de la cible, internationalisation…) avant de placer les marques. Sandbox d&rsquo;expression. **Effort** : L (mais transfère beaucoup de valeur au profil joueur).

### UX / Game feel

4. **Drumroll typographique** sur le score final (chiffres qui montent en mono pendant 600ms, spring) — aligne ce jeu sur le pattern catalog § M03 Predict & Reveal. **Effort** : S.

5. **Particle burst** quand une marque atteint > 90% au validate (3-5 particules mint, < 400ms). Récompense de précision rare. **Effort** : S.

6. **Remplacer `window.location.reload()` du `RotateCcw`** par un reset d&rsquo;état local — préserve le contexte GameShell, plus rapide, plus propre. **Effort** : XS.

### Qualité code

7. **Pattern singulier** : ce jeu n&rsquo;utilise PAS la triade `Zone / Pool / DraggablePill` — il a son propre `Plane` (drag 2D natif) et un `BrandsPool` qui est un pool de **boutons** (pas de drag, juste un onClick `onPlace(b.id, { x: 0.5, y: 0.5 })` qui crée la marque au centre du plan, puis le drag se fait sur le plan).
   → **Question architecturale clé** : faut-il harmoniser ce jeu avec @dnd-kit pour qu&rsquo;il consomme le futur `components/games/shared/` (extraction prévue à AUDIT.md § I8) ?
   - **Option A — Migrer vers @dnd-kit** : impose de réécrire le drag 2D continu (pas trivial avec @dnd-kit qui est conçu pour des zones discrètes). Bénéfice : un seul système de drag dans Cap&rsquo;. Coût : risque de perdre la fluidité du drag pointer events natifs (qui est précisément ce qui rend ce jeu agréable au game feel). **Effort** : XL, **risque** : élevé.
   - **Option B — Laisser le pattern à part** : `MappingConcurrentiel` reste hors `shared/`. Documenter dans le shared/ que les jeux à plan continu sortent du périmètre. Bénéfice : aucun risque sur le game feel actuel. Coût : duplication conceptuelle légère (deux logiques de drag dans Cap&rsquo;). **Effort** : 0.
     → **Recommandation par défaut** : **Option B**. Le game feel actuel est le meilleur de Cap&rsquo;, et @dnd-kit n&rsquo;est pas une bonne fit pour le drag 2D continu. Le shared/ couvre les 3 jeux drag-sort (Entreprise / Pestel / MixMarketing4P), `MappingConcurrentiel` reste légitimement à part. À reconfirmer si Cap&rsquo; ajoute un futur jeu en plan 2D libre — auquel cas extraire `shared/Plane.tsx` séparé.

8. **`BrandsPool` partage des conventions visuelles avec les autres `Pool`** (microcopy `// Marques à placer`, `font-mono text-[10px] uppercase tracking-widest`, `${ACCENT}` accent color) **mais pas la structure** (boutons + onClick au lieu de pills + drag). Donc pas un candidat direct au shared/. À noter dans le shared/ qu&rsquo;il existe ce variant.

9. **`computeSkills` magique** (lignes 415-426) : `communication: 30` forfaitaire, `creativite: 15` forfaitaire — non traçables au gameplay. Cf. même remarque sur MixMarketing4P. À documenter ou rebrancher.

10. **Duplication scoring color thresholds** : `colorForMatch` (lignes 64-68) — répliqué dans EntrepriseExplorer, PestelMatch, MixMarketing4P, MarketRadar. Déplacer en `lib/scoring.ts`. Cf. AUDIT.md § M4 + M2 (`lib/scoring.ts` existe déjà mais ce jeu ne l&rsquo;utilise pas).

11. **Coordonnées cibles "expertes"** (lignes 18-50) sont des estimations subjectives non sourcées. Pour la rigueur pédagogique, soit citer une source (étude consumer perception), soit assumer "perception culturelle moyenne 2024" comme référence. Sinon le joueur peut légitimement contester `(0.15, 0.2)` pour Dacia.

### Cohérence avec le catalogue mechanics

12. Ce jeu est un **hybride non listé** dans `docs/game-mechanics-catalog.md` : M03 Predict & Reveal en 2D continu. Si le pattern est jugé reproductible (futur "ton portefeuille d&rsquo;actions" en finance, "ton plan d&rsquo;orientation" en RH…), envisager d&rsquo;ajouter une mécanique **M13 — Plot & Reveal (continu 2D)** au catalog. **Effort** : S (entrée doc).

### Anti-patterns présents (rappel pour suivi)

- **#6 Wrapper** : ✅ **évité**. Ce jeu est le **golden standard wrapper-free** des jeux Marketing (au même titre que `StatutQuiz` côté UCL pour le failure design).
- **#7 One-size-fits-all** (P2 d&rsquo;AUDIT-product.md) — présent comme partout.
- **Failure design pauvre** (P3 d&rsquo;AUDIT-product.md) — partiel : visuel excellent, narratif manquant.

---

## Méta — cohérence avec la design checklist

| Critère                      | État                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Player fantasy clair en 5s   | ✅ "place 5 marques sur un plan" — lisible immédiatement                        |
| Core verb identifiable       | ✅ positionner — visible immédiatement                                          |
| Première action dans les 10s | ✅ clic sur "+ Marque" dans le pool dispo dès le mount                          |
| Feedback dans les 100ms      | ✅ pastille suit le pointer en spring physics                                   |
| Difficulté progressive       | ⚠️ 3 secteurs distincts mais pas explicitement plus durs                        |
| L&rsquo;échec enseigne       | ⚠️ visible (vraie pos. en mint) mais sans explication narrative                 |
| Progression visible          | ✅ `RoundsBadge` + scoring par marque                                           |
| Win condition satisfaisante  | ⚠️ score injecté dans skills, mais pas de reveal narratif final                 |
| Replay value                 | ⚠️ contenu fixe, pas de variantes — mais incentive d&rsquo;optimisation présent |
| ≥ 2 aesthetics               | ✅ Discovery + Expression toutes deux portées                                   |
| Aucun anti-pattern           | ⚠️ #7 présent uniquement — meilleur score de la suite Marketing                 |
| Incarne le concept éducatif  | ✅ **oui** — la mécanique = le concept. Golden standard côté wrapper.           |
