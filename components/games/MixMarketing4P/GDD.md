# GDD — Mix Marketing 4P (audit a posteriori)

> Famille **Marketing** · concept : les 4P du mix marketing (Produit / Prix / Place / Promotion)
> Statut : **implémenté** — `components/games/MixMarketing4P.tsx` (~485 lignes). Ce GDD est un **audit rétroactif** du code existant, pas une proposition.
> Fichier audité au commit `db23659`.

## 1. Player fantasy

Tu es **brand manager qui doit auditer le mix marketing de 3 marques iconiques** (Apple, Decathlon, Lush) en plaçant chacune des 12 décisions stratégiques de la marque dans la bonne case du framework 4P (Produit / Prix / Place / Promotion).

> Lecture honnête : aujourd&rsquo;hui, la fantasy ressentie est plus proche d&rsquo;un "élève qui range des étiquettes dans 4 cases". L&rsquo;ambition initiale (sentir le mix d&rsquo;une grande marque) n&rsquo;est pas pleinement portée par la mécanique. Cf. § 12 anti-pattern #6.

## 2. Core verb

**Classifier** (12 décisions × 4 buckets, 3 marques)

Le code dit clairement `expected: ZoneId` pour chaque carte (cf. lignes 38-92). Il n&rsquo;y a pas d&rsquo;ambiguïté — chaque décision a UNE bonne case. Le verbe ressenti est donc **classifier**, pas "construire".

> Glissement vs ambition : le titre "Mix Marketing **4P**" et la promesse "tu pilotes le mix" évoquent **M02 Build & Compose** (catalog). Mais la mécanique réelle est **M01 Drag & Sort** dans 4 buckets fixes. Le mix n&rsquo;est pas composé, il est reconstitué.

## 3. Educational goal

À la fin du jeu, le joueur doit reconnaître les 4 catégories canoniques du mix marketing et associer une décision business à la catégorie correspondante.

- Une décision sur le matériau d&rsquo;un boîtier = **Produit**
- Le paiement échelonné = **Prix**
- Le configurateur en ligne = **Place** (canal de distribution)
- Le keynote annuel = **Promotion**

C&rsquo;est un objectif de **reconnaissance de pattern** (cf. § Spécificités gamification éducative dans `game-design-knowledge.md`). C&rsquo;est utile mais limité : le joueur n&rsquo;**arbitre** pas (rien à choisir entre 2 options légitimes), il **range**.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Découvrir que les 12 décisions visibles d&rsquo;une grande marque (les Apple Stores, le keynote, les capteurs photo conçus en interne) appartiennent toutes à un cadre structuré nommé "4P". Ce cadre est invisible au lycéen avant le jeu.
2. **Submission** (faiblement) — Le drag & drop est satisfaisant en lui-même (le geste est plaisant, le snap dans une zone est gratifiant), même quand le contenu est trivial.

Anti-Cap&rsquo; **partiellement présent** : Challenge (avoir 100% sur les 36 cartes) est plus saillant qu&rsquo;il ne devrait l&rsquo;être, parce qu&rsquo;il n&rsquo;y a aucune autre source de tension.

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M01 — Drag & Sort** (catalog § M01)

- 4 zones de drop fixes (Produit / Prix / Place / Promotion) avec icônes + sub-label
- 1 pool central avec 12 cartes par manche
- Drag via @dnd-kit/core (`useDraggable` / `useDroppable`)
- Validation en bloc à la fin de la manche (pas de feedback immédiat carte par carte)

**Modifier** : aucun (pas de timer, pas de combo, pas de hidden info, pas de live preview).

**Pourquoi pas M02 Build & Compose** (qui aurait correspondu à l&rsquo;ambition titre) : un vrai M02 aurait nécessité que les 4 décisions s&rsquo;**influencent mutuellement** (ex: choisir un prix premium implique exclure certains canaux), avec des dépendances visibles. Ici les 12 cartes sont indépendantes : déplacer "Apple Stores" en Place n&rsquo;a aucune conséquence sur la case Prix.

## 6. Tension source

**Faible**. Trois sources théoriques :

1. **Cas ambigus** : ex `"Programme de reprise pour réduire le ticket ressenti"` (Apple a5) — c&rsquo;est techniquement Place (canal de revente) ou Prix (effet sur le ticket). Le code tranche pour Prix sans expliquer pourquoi. **Cette ambiguïté est invisible au joueur**, elle ne crée pas de tension consciente.
2. **Volume** : 12 cartes par manche × 3 manches = 36 placements. Crée une certaine fatigue, pas de tension.
3. **Objectif de score** : ≥ 75% pour mint, ≥ 50% pour sun. Mais sans timer ni vie, l&rsquo;objectif est mou.

→ La tension principale ressentie est probablement **"vais-je avoir 100%"** — c&rsquo;est exactement l&rsquo;anti-Cap&rsquo;.

## 7. Mastery curve

**Plate**. 3 manches identiques en structure (12 cartes × 4 buckets), différentes uniquement en contenu (Apple → Decathlon → Lush). La 3e manche n&rsquo;est pas plus difficile que la 1re ; elle pose juste les mêmes questions sur une autre marque.

- Pas de mode novice/expert
- Pas de progression conceptuelle (les 4P ne se complexifient pas)
- Pas de méta-objectif (ex: après 3 marques, comparer leur stratégie)

Anti-pattern **#7 Difficulté one-size-fits-all** **présent** (cf. § 12 + AUDIT-product.md § P2).

## 8. Failure design

Mixte.

- **Bon** : à la validation, chaque carte affiche un bord vert (mint) + icône ✓ si correct, bord rouge (coral) + icône ✗ si incorrect. Le joueur **voit** ce qui est mal classé.
- **Manquant** : aucun **pourquoi**. La carte "Programme de reprise" devient rouge sans expliquer en quoi c&rsquo;est du Prix et pas du Place. Le joueur sort en sachant qu&rsquo;il s&rsquo;est trompé, pas en comprenant pourquoi.
- Pas de retry au sein de la manche. Une fois validé, on enchaîne.

→ Le feedback est **visible mais muet**. C&rsquo;est mieux que PestelMatch (où il n&rsquo;y a pas de breakdown par carte) et moins bon que StatutQuiz (où chaque branche explique le verrou). Anti-pattern **P3 failure design pauvre** **présent** (cf. AUDIT-product.md § P3).

## 9. Win condition + closure

À la fin de la 3e manche :

1. Score moyen des 3 manches → injecté dans `shell.complete(skills, finalScore, { roundScores })`
2. Skills calculés via `computeSkills` (lignes 478-485) :
   - `analyse` : 25 si score ≥ 80 par manche, 15 si ≥ 60, 5 sinon (cumulatif, max 100)
   - `creativite` : forfait 15 (5 par manche, indépendant du score)
   - `strategie` : moyenne / 2 + 30 (max 100)
3. Closure visuelle : le `RoundsBadge` final affiche les 3 scores colorés, redirigé vers GameShell pour la modal de fin.

→ La closure est **fonctionnelle** mais pas marquante. Pas de reveal de la "vraie" stratégie de la marque, pas de comparatif inter-marques. Le joueur sort sans avoir vu si **les 3 marques ont des mix radicalement différents** — alors que c&rsquo;était précisément l&rsquo;intérêt pédagogique.

## 10. Game feel notes

**Solide sur les fondamentaux**, manque sur les détails.

- ✅ Drag preview via `<DragOverlay>` avec `boxShadow: 0 20px 40px + 0 0 16px ${ACCENT}` — la carte flottante est nette.
- ✅ Zones changent de couleur au survol (`borderColor: isOver ? ACCENT : 'var(--night-200)'`).
- ✅ CTA "Valider" avec glow `box-shadow: 0 0 24px var(--sun)` quand `allPlaced`.
- ✅ ResultActions animée via Framer spring (`stiffness: 90, damping: 16`).
- ✅ Microcopy mono `// Cartes à classer · X restante(s)` — fidèle au branding Cap&rsquo;.
- ❌ Pas de tick audio au drag start.
- ❌ Pas de particle burst au bon drop (la carte arrive juste, sans célébration).
- ❌ Pas de shake / coral flash subtil sur mauvais drop pendant le placement (le rouge arrive seulement à la validation finale).
- ❌ Pas de drumroll typographique avant l&rsquo;affichage du score.

## 11. Replay value

**Faible**.

- 3 marques scriptées, contenu fixe. Aucune randomisation.
- Pas de hidden objective.
- Pas de mode sandbox (entrer une marque libre).
- Le profil marketing (analyse / créativité / stratégie) varie peu d&rsquo;un run à l&rsquo;autre vu la stabilité du contenu.

→ Une seule run suffit pour épuiser le contenu. C&rsquo;est cohérent avec un mini-jeu d&rsquo;onboarding, mais limite la rétention.

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | État ?                                                                                                                                                                                             |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité — le score 0-100 est le % de cartes correctement classées, parfaitement lisible.                                                                                                          |
| 2   | Badge spam                                | ✅ Évité — 1 badge par manche dans `RoundsBadge`, pas plus.                                                                                                                                        |
| 3   | Forced grinding                           | ✅ Évité — 3 manches choisies pour la diversité (luxe / sport / éthique), pas pour faire durer.                                                                                                    |
| 4   | Punitive failure                          | ✅ Évité — pas de reset, pas de hearts, retry libre.                                                                                                                                               |
| 5   | Pay-to-win éducatif                       | ✅ N/A.                                                                                                                                                                                            |
| 6   | **Gamification comme wrapper**            | ⚠️ **Présent** — le drag & drop est un quiz à 4 cases avec `expected` codé en dur. Aucun arbitrage stratégique. La mécanique décore le concept, ne l&rsquo;incarne pas. Cf. AUDIT-product.md § P1. |
| 7   | **Difficulté one-size-fits-all**          | ⚠️ **Présent** — 3 manches identiques en difficulté, pas de mode novice/expert, pas d&rsquo;objectif caché. Cf. AUDIT-product.md § P2.                                                             |

---

## Améliorations (depuis l&rsquo;audit)

### Mécaniques / Game design

1. **Problème principal** : la mécanique est M01 Drag & Sort déguisé en M02 Build & Compose. Il n&rsquo;y a pas d&rsquo;arbitrage stratégique entre les 4P, donc pas de "construction" de mix au sens du catalog.
   **Proposition A (légère)** : ajouter des **cartes ambivalentes** (ex: "Boutique propre" peut être Place OU Promo selon le rôle qu&rsquo;on lui donne) avec un score qui récompense la justification (passer en M04 Branching avec une mini-question de cadrage). **Effort** : M.
   **Proposition B (lourde)** : refonte vers un vrai M02 — supprimer le `expected` codé en dur, donner au joueur un budget réparti entre les 4P, et chaque carte coûte des points. Le joueur doit **choisir** quelles décisions activer dans chaque P pour rester sub budget. La validation note la **cohérence du mix**, pas la "bonne case". **Effort** : XL (refonte du modèle de données + scoring).

2. **Ajouter un reveal pédagogique en fin de manche** : afficher le mix réel de la marque en parallèle du mix du joueur, avec un encadré "voici comment Apple répartit réellement son budget marketing par P (estimations 2023)". Ça transforme la closure factuelle en moment de **Discovery** explicite. **Effort** : M (recherche données + UI).

### UX / Game feel

3. **Feedback diégétique pendant le placement** (pas seulement à la validation) : quand une carte est lâchée dans une zone manifestement incohérente (ex: "Spots TV" dans Prix), un **glow coral subtil de 200ms** + tooltip "Tu peux changer d&rsquo;avis avant de valider". Pas une pénalité, juste un signal. **Effort** : S.

4. **Pourquoi sur les erreurs** (cf. AUDIT-product.md § P3) : à la validation, sur chaque carte rouge, ajouter une phrase de 200-400 chars expliquant la bonne case et le critère qui tranche. Idéalement avec lien vers la fiche éducative "Les 4P expliqués". **Effort** : S.

5. **Particle burst** au bon drop pendant la phase de placement (3-5 particules `--family-marketing`, < 400ms) — récompense diégétique avant même la validation. **Effort** : S.

### Qualité code

6. **Triade `Zone / Pool / DraggableCard / CardPill`** dupliquée avec `EntrepriseExplorer` et `PestelMatch` (lignes 183-393 ici, ~145 lignes). Naming inconsistance avec EntrepriseExplorer (`DraggableCompany` / `CompanyPill`) — à harmoniser en `DraggablePill`.
   → **Confirme l&rsquo;extraction prévue à AUDIT.md § I8** vers `components/games/shared/{DragSortGame, Zone, Pool, DraggablePill}`. **Effort** : L (refactor structurel sur 3 fichiers).

7. **`computeSkills` magique** (lignes 478-485) : seuils `25 / 15 / 5` et `creativite: 15` forfaitaire ne sont pas traçables au gameplay. Le joueur qui aurait 100/100/100 voit `creativite = 15` quoi qu&rsquo;il fasse. À documenter ou rebrancher sur le profil joueur réel.

8. **`scores` calcul de moyenne** dupliqué entre `finish()` et `RoundsBadge` — déjà couvert par `lib/scoring.ts` mais non importé. Cf. AUDIT.md § M4.

### Cohérence avec le catalogue mechanics

9. Le mapping ambition → réalité doit être tranché côté docs : soit on **assume** que c&rsquo;est M01 Drag & Sort (et on retitre le jeu "Range les 4P" ou similaire), soit on **refait** la mécanique pour porter l&rsquo;ambition M02 (proposition B ci-dessus). En l&rsquo;état, le catalog `M02 — Build & Compose` ne devrait **pas** citer ce jeu en exemple Cap&rsquo;.

### Anti-patterns présents (rappel pour suivi)

- **#6 Wrapper** (P1 d&rsquo;AUDIT-product.md) — bloquant pour la promesse pédagogique.
- **#7 One-size-fits-all** (P2 d&rsquo;AUDIT-product.md) — bloquant pour le replay value.
- **Failure design pauvre** (P3 d&rsquo;AUDIT-product.md) — quick win disponible (proposition #4 ci-dessus).

---

## Méta — cohérence avec la design checklist

| Critère                      | État                                                                      |
| ---------------------------- | ------------------------------------------------------------------------- |
| Player fantasy clair en 5s   | ⚠️ ambition (brand manager) ≠ ressenti (élève qui range)                  |
| Core verb identifiable       | ✅ classifier — visible immédiatement                                     |
| Première action dans les 10s | ✅ drag dispo dès le mount                                                |
| Feedback dans les 100ms      | ⚠️ partiel — drag immédiat OK, mais correctness seulement à la validation |
| Difficulté progressive       | ❌ 3 manches identiques en difficulté                                     |
| L&rsquo;échec enseigne       | ⚠️ visible (rouge/vert) mais muet (pas de pourquoi)                       |
| Progression visible          | ✅ `RoundsBadge` + counter "Place encore X"                               |
| Win condition satisfaisante  | ⚠️ score injecté dans skills, mais pas de reveal narratif                 |
| Replay value                 | ❌ contenu fixe, pas de variantes                                         |
| ≥ 2 aesthetics               | ⚠️ Discovery présente, Submission faible — pas 2 fortes                   |
| Aucun anti-pattern           | ❌ #6 et #7 présents                                                      |
| Incarne le concept éducatif  | ❌ classifier ≠ composer un mix                                           |
