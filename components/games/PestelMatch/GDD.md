# GDD — PestelMatch

> Famille **Programmes / UCL Lille · Module Gestion d&rsquo;entreprise**
> Sous-module 03 — _Analyser l&rsquo;environnement (PESTEL)_
> Statut : **a posteriori** (jeu déjà implémenté, GDD reconstitué pour audit). Source : `components/games/PestelMatch.tsx` (487 l).

## 1. Player fantasy

Tu es **analyste stratégique junior**. On te file un secteur (le pétrole, la mode fast-fashion, l&rsquo;automobile électrique) et 18 facteurs en vrac. Tu dois les ranger dans les 6 cases du modèle PESTEL pour faire émerger une lecture macro. À la fin de la manche, tu vois ce que tu as compris du secteur.

> Pas "élève qui mémorise un acronyme". Tu **fais l&rsquo;analyse PESTEL d&rsquo;un secteur réel**.

## 2. Core verb

**Classifier** (en 6 buckets, sur 3 secteurs successifs).

C&rsquo;est exactement le verbe de M01 — Drag & Sort, sans variante structurelle. La spécificité tient au **contenu** (PESTEL = framework explicite, pas une taxonomie ouverte) et à la **répétition de manches** sur des secteurs différents (3 contextes de classification).

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé que **le modèle PESTEL est un cadre d&rsquo;analyse, pas une taxonomie figée** :

- **6 dimensions** : Politique, Économique, Socioculturel, Technologique, Écologique, Légal.
- Chaque facteur peut sembler tomber dans 2-3 dimensions selon l&rsquo;angle de lecture (le "Prix du baril" est-il économique ou écologique ? les "Tarifs douaniers UE-Asie" sont-ils Politique ou Légal ?).
- Le secteur change le poids relatif des dimensions (Tech domine en auto électrique, Écologique en pétrole, S&L en mode).
- À la fin de 3 manches sur 3 secteurs, le joueur doit savoir **construire un PESTEL ad hoc** sur un secteur qu&rsquo;il ne connaît pas.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Le joueur découvre les enjeux de 3 secteurs réels (pétrole, mode, auto électrique) à travers leurs facteurs PESTEL. Il apprend des choses sur la matérialité de ces industries (norme REACH, RGPD, ZFE, Pacte PME).
2. **Challenge** — Volume (18 cards × 3 manches = 54 placements) avec quelques cas frontaliers volontaires.

Note de défense : **Discovery dominante** — les 3 secteurs scriptés sont choisis pour leur portée éducative (le pétrole c&rsquo;est le cas du PDF source ; mode et auto électrique sont les deux secteurs les plus tendus actuellement côté transition). Le joueur apprend par contenu, pas que par mécanique.

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M01 — Drag & Sort** (catalogue § M01). Match exact, exemples Cap&rsquo; cités dans le catalog : **PestelMatch** lui-même.

**Pas combiné avec** :

- M07 (Time pressure) : volontaire, on veut la réflexion.
- M08 (Streak) : pas pertinent — la validation est par manche, pas par item.

**Spécificité** : _Multi-rounds sur secteurs différents avec items propres à chaque manche_ (pas le même set d&rsquo;items à classer 3 fois — chaque manche a ses propres 18 facteurs). Cohérent avec § "Connecter aux enjeux du monde réel".

## 6. Tension source

- **Charge cognitive** : 18 cards à placer dans 6 cases (visuellement chargé).
- **Cas frontaliers** : ~3-4 facteurs par manche ont 2 dimensions PESTEL défendables. Le code force une réponse unique, ce qui crée une frustration légère (cf. § Anti-patterns #6 partiel).
- **Pas de timer** : volontaire.
- **Cumul de manches** : si tu te plantes en M1, tu portes la frustration en M2.

## 7. Mastery curve

3 manches successives qui covarient en complexité (et en familiarité du sujet pour un lycéen) :

- **M1 — Pétrole** : facteurs assez canoniques (norme REACH, GES). Le lycéen découvre.
- **M2 — Mode** : sujet plus relatable (TikTok, fast-fashion, RSE textile). Mastery du framework.
- **M3 — Auto électrique** : croisements technologique × écologique × politique très denses. Mastery du transfert.

Bonne courbe — le joueur progresse dans l&rsquo;abstraction du framework. **Meilleure courbe des 4 jeux UCL**.

## 8. Failure design

- À la validation par manche : score `% bons placements` calculé, validé en 1 fois.
- Pills passent en **mint** (correct) ou **coral** (faux) avec icône Check/X.
- **Pas de bloc "voici la bonne réponse"** comme dans StatutQuiz — juste les couleurs. Le joueur doit deviner où la card aurait dû aller.
- Skills floor : `analyse: finalScore/2 + 30, rigueur: finalScore/3 + 20` — joueur récupère 30/20 même à 0%.

⚠️ Faiblesse — comme EntrepriseExplorer, le rouge/vert montre où mais pas pourquoi. Pour PESTEL c&rsquo;est particulièrement frustrant car les frontaliers existent et le joueur n&rsquo;a aucune voie pour comprendre la convention retenue ("Pourquoi 'Prix du baril' est en Écologique et pas Économique ?").

## 9. Win condition + closure

- 3 manches → 3 scores → moyenne en score final.
- `shell.complete(skills, finalScore, { roundScores: scores })`. Modale rating shell.
- Pas de "real reveal" éducatif (qu&rsquo;est-ce qui rend l&rsquo;industrie pétrolière unique au-delà de PESTEL ? — non abordé).

⚠️ Comme EntrepriseExplorer, closure faible côté pédagogique. Score brut + rating.

## 10. Game feel notes

Présents dans le code :

- ✅ **6 zones colorées distinctes** (`var(--sun)`, `var(--pivot)`, `var(--coral)`, `var(--mint)`, `#3B82F6`, `#E8732D`) — la dimension PESTEL est lisible visuellement.
- ✅ Pills draggables avec `opacity 0.4` au pickup.
- ✅ Drop zones avec `isOver` glow vers la couleur de la zone.
- ✅ DragOverlay avec shadow.
- ✅ Score badges Manches M1-M3 en bas.
- ✅ Microcopy mono `// Manche {N} / 3 · {sujet}`, `// Facteurs à classer · N restants`.

Manquants vs 7 invisibles :

- ❌ Pas de **scale 1.05** au grab.
- ❌ Pas de **particle burst** au drop correct.
- ❌ Pas de **shake** au drop incorrect (validation différée par manche).
- ❌ Pas de **tick audio** au clic.
- ❌ Pas de **drumroll** entre clic Valider et reveal mint/coral.

⚠️ Couleurs hardcodées (`#3B82F6`, `#E8732D`) en violation de la palette CSS variables — déjà signalé dans AUDIT.md § I4.

## 11. Replay value

**Faible**. 3 manches scriptées, items figés. Le seul levier = améliorer ses scores M1/M2/M3 sur un re-run. Pas de mode expert, pas de secteurs sandbox.

⚠️ Énorme potentiel de replay raté : un mode "secteur libre" où le joueur entre un nom de secteur (mode locale, ONG, plateforme SaaS) et reçoit 18 facteurs générés serait une killer feature. Cf. § Améliorations.

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | Statut               | Justification                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité             | Score = % bonnes classifications.                                                                                                                                                                                                                                         |
| 2   | Badge spam                                | ✅ Évité             | 1 closure unique.                                                                                                                                                                                                                                                         |
| 3   | Forced grinding                           | ⚠️ **Frontalier**    | 18 × 3 = 54 placements. C&rsquo;est borné, mais le joueur peut le ressentir comme grinding sur les 5 dernières cards de la M3 (fatigue).                                                                                                                                  |
| 4   | Punitive failure                          | ✅ Évité             | Skills floor garantis.                                                                                                                                                                                                                                                    |
| 5   | Pay-to-win éducatif                       | — N/A                |                                                                                                                                                                                                                                                                           |
| 6   | Gamification comme wrapper                | ⚠️ **Risque modéré** | Le tri pur est très proche d&rsquo;un QCM "à quelle catégorie ?". Sauvé partiellement par le volume (18 items en parallèle force une vue d&rsquo;ensemble) et par les cas frontaliers (oblige à raisonner). Pas autant que StatutQuiz qui incarne franchement le concept. |
| 7   | Difficulté one-size-fits-all              | ⚠️ **Présent**       | 3 manches mais figées. Aucun mode débutant/expert, aucun secteur libre.                                                                                                                                                                                                   |

---

## Méta — design checklist

| Item                            | Statut                                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Player fantasy clair en 5s      | ✅ "Classer 18 facteurs dans 6 buckets PESTEL" lisible.                                                                                                                                                               |
| Core verb identifiable          | ✅                                                                                                                                                                                                                    |
| Première action dans les 10s    | ✅ Drag dispo.                                                                                                                                                                                                        |
| Feedback dans les 100ms         | ⚠️ Drop zone glow OK, mais pas de feedback "correct/incorrect" temps réel.                                                                                                                                            |
| Difficulté progressive ou modes | ⚠️ Légère progression M1→M3 mais pas de modes.                                                                                                                                                                        |
| L&rsquo;échec enseigne          | ❌ Couleurs mais pas d&rsquo;explication sur les frontaliers.                                                                                                                                                         |
| Progression visible             | ✅ Compteur "N restants" + badges manches.                                                                                                                                                                            |
| Win condition satisfaisante     | ⚠️ Score brut.                                                                                                                                                                                                        |
| Replay value                    | ❌                                                                                                                                                                                                                    |
| ≥ 2 aesthetics                  | ✅ Discovery + Challenge.                                                                                                                                                                                             |
| Aucun anti-pattern              | ⚠️ #3 frontalier, #6 modéré, #7 présent.                                                                                                                                                                              |
| Incarne le concept              | ⚠️ Le framework PESTEL est explicite, mais la mécanique de tri pur n&rsquo;**incarne** pas le travail d&rsquo;analyste (qui est de **raisonner** pourquoi un facteur est dans une dimension, pas juste de le placer). |

---

## Améliorations

### Mécaniques

1. **Problème** : Tri pur sans raisonnement explicité. Un joueur peut placer un facteur correctement par chance ou par mémorisation.
   **Proposition** : ajouter une **phase B optionnelle** par manche : sur 2-3 cards frontalières, demander "Pourquoi tu l&rsquo;as mis là ?" avec 3 propositions de raisonnement (1 correcte). Force la verbalisation. Score bonus si le raisonnement est juste.
   **Effort** : **M**.

2. **Problème** : Pas de gestion des frontaliers ambigus. Le code force `expected: ZoneId` strict.
   **Proposition** : passer `expected: ZoneId | ZoneId[]` pour les cards où plusieurs réponses sont défendables. Au reveal, indiquer "2 réponses étaient correctes — voici pourquoi la communément retenue est X."
   **Effort** : **S** (modifier le typage + 4-5 cards par manche).

3. **Problème** : 3 secteurs figés. Le joueur curieux ne peut pas tester sur ses propres centres d&rsquo;intérêt.
   **Proposition** : un 4ème mode "Secteur libre" débloqué après 3 manches complètes. Le joueur entre un nom (e.g. "industrie du jeu vidéo"), Cap&rsquo; lui présente 18 facteurs pré-écrits par dimension PESTEL pour ce secteur. Pas de validation de score — c&rsquo;est juste un mode exploration narrative.
   **Effort** : **L** (data work + UI sandbox).

### UX

1. **Problème** : Pendant la manche, le joueur ne peut pas voir les définitions des 6 dimensions PESTEL — il doit deviner que "Politique" inclut la stabilité gouvernementale, ou se référer à la page contenu avant.
   **Proposition** : tooltip / sidebar repliable "Aide PESTEL" accessible pendant le jeu, avec rappel des 6 dimensions et 1-2 exemples par dimension. Cap&rsquo; ne laisse jamais le joueur "deviner ce qui est dans la case".
   **Effort** : **S**.

2. **Problème** : Au reveal mint/coral, aucune action possible pour comprendre. Le joueur ferme la manche en se disant "j&rsquo;ai eu 14/18, j&rsquo;ai pas compris où les 4 que j&rsquo;ai ratés auraient dû aller".
   **Proposition** : permettre de cliquer sur une pill coral pour voir "Aurait dû aller dans : {X}. Pourquoi : {phrase}." Mini-Bottom-sheet ou tooltip détaillée.
   **Effort** : **M** (data work : 1 phrase de mismatch par card).

3. **Problème** : Le joueur peut switcher d&rsquo;une manche à l&rsquo;autre sans synthèse intermédiaire. Aucun moment de "pause réflexive".
   **Proposition** : entre chaque manche, écran "Synthèse {secteur}" : top 3 dimensions dominantes par volume de cards (visualisation barre horizontale) + 1 phrase d&rsquo;analyse ("Le secteur pétrole est dominé par le Légal et l&rsquo;Écologique — ça reflète la pression réglementaire que ces entreprises subissent.").
   **Effort** : **M**.

4. **Problème** : Couleurs hardcodées (`#3B82F6` bleu, `#E8732D` orange) — viole la convention CSS variables. Le toggle dark/light ne les affecte pas.
   **Proposition** : promouvoir en `--accent-blue` et `--accent-orange` dans `globals.css`. Cf. AUDIT.md § I4.
   **Effort** : **S**.

### Qualité code

1. **Duplication structurelle massive avec EntrepriseExplorer et MixMarketing4P** : la triade `Zone / Pool / DraggableX / Pill` est répliquée à l&rsquo;identique. Lignes 304-358 (Zone), 359-393 (Pool), 394-417 (DraggableCard), 418-468 (CardPill).
   **Proposition** : extraire en `components/games/shared/` (cf. AUDIT.md § I8).
   **Effort** : **L** (3 jeux touchés).

2. **`ZONES` array a son propre typage inline** ligne 21-32 — `{ id: ZoneId; letter: string; label: string; color: string }[]`. Pas de type nommé, donc pas réutilisable.
   **Proposition** : `type ZoneMeta = { id: ZoneId; letter: string; label: string; color: string }` exporté.
   **Effort** : **S**.

3. **`useEffect` re-init des assignments à chaque changement de `roundIdx`** ligne 156-163. La dépendance `[roundIdx, round.cards]` inclut `round.cards` qui est dérivé de `roundIdx`. Redondant.
   **Proposition** : ne dépendre que de `[roundIdx]`. Ou renommer la fonction d&rsquo;initialisation pour clarifier l&rsquo;intent.
   **Effort** : **S**.

4. **Magic number `validate()` calcule `score = (correct / round.cards.length) * 100`** mais `round.cards.length` est toujours 18 dans la data. Pas un bug, juste pas robuste si on ajoute une manche à 12 cards.
   **Proposition** : OK tel quel, mais ajouter un commentaire ou assert dev "// Card count per round is conventionally 18 (3 per dimension × 6 dimensions)".
   **Effort** : **S**.

5. **`ResultActions` réimporté/réimplémenté** dans MixMarketing4P et MarketRadar avec léger drift (placements différents, props subtilement différentes).
   **Proposition** : extraire en `components/games/shared/ResultActions.tsx` avec props communs `{score, isLast, onNext, onFinish}`.
   **Effort** : **M**.

### Cohérence avec le catalog mechanics

- Le verbe **classifier** est dans `docs/game-mechanics-catalog.md` § M01 ✅
- PestelMatch est explicitement cité comme **exemple Cap&rsquo;** dans le catalog M01.
- Implémenté **partiellement conformément** au pattern :
  - ✅ `@dnd-kit/core`, snap zones, magnétisme partiel.
  - ❌ "Items se soulèvent légèrement au grab (scale 1.05, shadow)" — pas de scale.
  - ❌ "Right drop = pulse ✓ + petite particle burst" — pas implémenté (validation différée).
  - ❌ "Wrong drop = shake subtil, item retourne smoothly" — pas implémenté.
- Le pattern catalogue **suppose une validation temps réel** au drop, alors que PestelMatch valide à la fin de manche. Conventionnellement défendable (volume), mais on perd le feel "satisfaction immédiate".

### Anti-patterns présents

#### #3 — Forced grinding (⚠️ frontalier)

- **Déclencheur** : 54 placements en 3 manches sans variation mécanique. À M3, le joueur peut ressentir "encore la même chose, dans un autre secteur".
- **Sortie minimale** : raccourcir M2 et M3 à 12 cards (au lieu de 18) ou injecter une mini-mécanique différente en M3 (la "phase B raisonnement" proposée plus haut).

#### #6 — Gamification comme wrapper (⚠️ modéré)

- **Déclencheur** : tri pur en 6 buckets = équivalent cognitif d&rsquo;un QCM "Dans quelle dimension PESTEL ce facteur appartient ?". Le drag&drop n&rsquo;ajoute pas de levier que le QCM ne pourrait pas avoir.
- **Sortie minimale** : la "phase B raisonnement" proposée transforme le verbe de "trier" à "trier puis justifier" — le justify est ce qui ne peut pas être un QCM.

#### #7 — Difficulté one-size-fits-all (⚠️ présent)

- **Déclencheur** : 3 manches figées de difficulté équivalente, aucun mode.
- **Sortie minimale** : "Secteur libre" en mode débloqué après 3 manches (Mécaniques #3).
