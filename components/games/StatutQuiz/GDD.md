# GDD — StatutQuiz

> Famille **Programmes / UCL Lille · Module Gestion d&rsquo;entreprise**
> Sous-module 02 — _Choisir le bon statut_
> Statut : **a posteriori** (jeu déjà implémenté, GDD reconstitué pour audit). Source : `components/games/StatutQuiz.tsx` (487 l).

## 1. Player fantasy

Tu es **conseiller·e d&rsquo;entreprise** un mardi matin. 5 personnes vont s&rsquo;asseoir en face de toi avec leur projet (Léa céramiste, Marc dans la tech, Sophie consultante, la famille Dupont avec leur restau, Collectif Code à 8 développeurs). Pour chaque cas, tu navigues l&rsquo;arbre de décision juridique en posant les bonnes questions, jusqu&rsquo;à arriver au bon statut.

> Pas "élève qui répond à un quiz". Tu **conseilles** quelqu&rsquo;un sur sa boîte.

## 2. Core verb

**Choisir** (en navigant un arbre).

Spécifiquement : à chaque nœud, choisir parmi 2-3 branches sur la base d&rsquo;une question conceptuelle (combien d&rsquo;apporteurs, quel niveau de responsabilité, quel cadre de gouvernance), puis arriver à une feuille = un statut juridique.

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé que **choisir un statut juridique = répondre à 3 questions clés dans l&rsquo;ordre** :

1. **Combien d&rsquo;apporteurs ?** (1 → EI ou EURL ; plusieurs → la suite)
2. **Quelle responsabilité ?** (limitée aux apports → patrimoine séparé ; illimitée → SNC)
3. **Quel cadre de gouvernance ?** (rigide/familial → SARL ; libre/levée de fonds → SAS ; démocratique → SCOP)

Ce qui doit rester : **EI / EURL / SARL / SAS / SCOP / SNC sont des conséquences logiques de ces 3 questions**, pas 6 entités à mémoriser à plat.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Narrative** — chaque cas est un mini-récit personnifié (Léa, Marc, Sophie, Famille Dupont, Collectif Code). Le joueur ressent le drame de la décision pour chacun. Inhabituel pour un module juridique, et la principale arme contre le "ennuyeux par nature".
2. **Challenge** secondaire — la rigueur de l&rsquo;arbre permet une mastery réelle sur 5 cas.

Note de défense : pas de **Discovery** dominante car l&rsquo;arbre est explicite ; pas d&rsquo;**Expression** (les choix ne révèlent rien sur le joueur). C&rsquo;est OK : ce sous-module attaque un concept aride avec narrative pour l&rsquo;humaniser.

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M04 — Branching Decision** (catalogue § M04). Match exact : "Verbe = choisir · Contenu adapté = décisions stratégiques, dilemmes éthiques, parcours · Exemple Cap&rsquo; cité : **StatutQuiz**".

**Pas combiné avec** :

- M07 (Time pressure) : volontaire, l&rsquo;arbre demande de la réflexion.
- M09 (Hidden info) : l&rsquo;arbre est explicite, toutes les questions sont visibles.

**Spécificité originale** : _Breadcrumb des choix précédents_ (chips repliés en haut de l&rsquo;écran) — permet de visualiser le chemin pris sans avoir à tout naviguer en mémoire. Pas dans le catalogue, à ajouter.

## 6. Tension source

- **Irréversibilité partielle** : on peut "Revenir en arrière" via le bouton dédié, mais le joueur sent quand même le poids de chaque clic (arbre profondeur 3 → max 3 mauvais choix d&rsquo;affilée).
- **Narrative stake** : "si tu te trompes, Léa va perdre du temps en paperasse pour rien". Le cas a une identité — le joueur ne veut pas la dégoûter de son projet céramique.
- **Pas de timer** : tension purement décisionnelle.

## 7. Mastery curve

5 cas séquentiels, chacun mappé sur **un statut différent** (EI, SAS, EURL, SARL, SCOP) — couvre l&rsquo;arbre quasi-exhaustivement. Le joueur acquiert la mastery par :

- Reconnaissance de pattern : "ah, 1 apporteur + faible risque = EI" devient automatique au cas 3-4.
- Transfer : si on lui présentait un 6ème cas (une SCS, par ex.), il pourrait raisonner par analogie.

⚠️ Difficulté **plate** sur les 5 cas — pas de progression de complexité (Léa cas 1 n&rsquo;est pas plus simple que Marc cas 2). Décision questionnable, traitée en § Améliorations.

## 8. Failure design

- Au moment du `validate`, comparaison `result.statut === round.expected`.
- **Si correct** : pulse mint, message "Bonne réponse !", bouton "Cas suivant".
- **Si faux** : **shake** (`x: [0, -8, 8, -6, 6, 0]` via Framer) + coral background + bloc _"Bonne réponse attendue"_ qui révèle le statut correct + sa description en mint. **Excellent design — l&rsquo;erreur enseigne** (cf. § "Montrer POURQUOI la mauvaise réponse est mauvaise"). Ce jeu fait ça mieux que les 3 autres UCL.
- **Retry** : possible avant validation (`Recommencer le cas` en mode preview), pas après. Le joueur peut revenir en arrière dans l&rsquo;arbre tant qu&rsquo;il n&rsquo;a pas validé.

✅ Le seul jeu UCL où le failure design est aligné avec § "Les erreurs sont des opportunités d&rsquo;apprentissage".

## 9. Win condition + closure

- Validation par cas : score = bool (correct / incorrect). 5 booleans accumulés.
- Score final = `correct / 5 × 100`. Skills `analyse: count*25, rigueur: count*20`.
- Closure : modale rating shell, comme partout. Pas de "real reveal" éducatif après le 5ème cas.

⚠️ Faiblesse : pas de **synthèse de fin** qui ferait sens des 5 cas en série. Le joueur ferme la modale en sachant son score mais sans avoir consolidé "j&rsquo;ai vu les 5 statuts principaux français". Cf. § Améliorations.

## 10. Game feel notes

Présents dans le code :

- ✅ **Animations entre questions** : `motion.div` avec `key={currentNodeId}` + spring physics — chaque nouvelle question entre par le bas avec animation, chaque retour est animé. **Excellent**.
- ✅ **Shake sur faux** : explicite et bien dosé (pas trop violent).
- ✅ **Breadcrumb des chips** — feedback visuel du chemin pris.
- ✅ **Hover sur boutons-choix** : `hover:scale-[1.01]` + `hover:border-snow` — anticipation correcte.
- ✅ Icône statut affichée en énorme (clamp 48px-96px) en mint/coral selon résultat — reveal satisfaisant.
- ✅ Microcopy mono `// Cas {N} / 5 · {Name}`, `// Question`, `// Bonne réponse attendue`.
- ✅ Score badges en bas (5 chips Cas 1-5) — progression visible.

Manquants vs 7 invisibles :

- ❌ Pas de **tick audio** au clic.
- ❌ Pas de **drumroll/anticipation** entre le clic "Valider" et le reveal — instantané.
- ❌ **Easing curves** majoritairement spring ✓ mais quelques transitions Tailwind par défaut (`transition-colors`) en linear.

C&rsquo;est probablement le jeu UCL avec le **meilleur game feel global** des 4.

## 11. Replay value

**Faible**. 5 cas figés, 1 seul "bon" chemin par cas. L&rsquo;unique levier de relay = obtenir 5/5 si raté la 1ère fois. Pas de variantes, pas de mode expert, pas de cas générés.

⚠️ Cf. § Améliorations — le format arbre permettrait facilement d&rsquo;ajouter 5 cas plus complexes en mode débloqué.

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | Statut         | Justification                                                                                                                                     |
| --- | ----------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité       | Score = % de cas résolus, lisible.                                                                                                                |
| 2   | Badge spam                                | ✅ Évité       | 1 closure unique.                                                                                                                                 |
| 3   | Forced grinding                           | ✅ Évité       | 5 cas est borné.                                                                                                                                  |
| 4   | Punitive failure                          | ✅ Évité       | Skills floor garantis ; retry libre avant validation ; reveal pédagogique.                                                                        |
| 5   | Pay-to-win éducatif                       | — N/A          |                                                                                                                                                   |
| 6   | Gamification comme wrapper                | ✅ Évité       | L&rsquo;arbre **incarne** le concept éducatif (3 questions = 3 axes de décision réels). Le verbe choisir est la vraie tâche du conseil juridique. |
| 7   | Difficulté one-size-fits-all              | ⚠️ **Présent** | 5 cas figés de difficulté équivalente, aucun mode expert.                                                                                         |

---

## Méta — design checklist

| Item                            | Statut                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| Player fantasy clair en 5s      | ✅ Le profil de Léa est lisible immédiatement.                        |
| Core verb identifiable          | ✅ Choisir parmi 2-3 options.                                         |
| Première action dans les 10s    | ✅ Question Q1 affichée dès le mount.                                 |
| Feedback dans les 100ms         | ✅ Hover sur boutons-choix instantané, shake + reveal après validate. |
| Difficulté progressive ou modes | ❌                                                                    |
| L&rsquo;échec enseigne          | ✅ **Bloc "Bonne réponse attendue" avec description**.                |
| Progression visible             | ✅ Score badges Cas 1-5.                                              |
| Win condition satisfaisante     | ⚠️ Score brut ; pas de synthèse 5 cas.                                |
| Replay value                    | ❌                                                                    |
| ≥ 2 aesthetics                  | ✅ Narrative + Challenge.                                             |
| Aucun anti-pattern              | ⚠️ #7 présent.                                                        |
| Incarne le concept              | ✅                                                                    |

---

## Améliorations

### Mécaniques

1. **Problème** : 5 cas figés de difficulté équivalente. Le joueur expert s&rsquo;ennuie cas 4-5.
   **Proposition** : ajouter 3 cas "ambigus" en mode débloqué après 1 run réussi. Exemples : association loi 1901 qui veut commercialiser (asso ↔ SAS ?) ; freelance avec 1 client unique (EI ↔ SASU ?) ; couple qui hérite d&rsquo;une boîte familiale (indivision ↔ SCI ?). Ces cas n&rsquo;ont **pas de réponse unique** et le joueur doit reconnaître l&rsquo;ambiguïté.
   **Effort** : **M**.

2. **Problème** : L&rsquo;arbre est strictement séquentiel — le joueur ne peut pas "sauter" sur Q3 en se disant "vu le cas, je sais que c&rsquo;est SAS". Frustrant pour le joueur qui maîtrise déjà.
   **Proposition** : ajouter un mode "Réponse directe" optionnel (toggle en haut) qui propose les 6 statuts en boutons, et le joueur clique direct. Le score conserve l&rsquo;info de "mode utilisé" pour le profil.
   **Effort** : **M**.

3. **Problème** : Pas de capture du raisonnement. Le joueur peut deviner le bon statut sans comprendre l&rsquo;arbre.
   **Proposition** : sur 1-2 cas, demander **avant** la validation : "Pourquoi ce statut ?" — 3 phrases-réponses parmi lesquelles 1 est correcte. Encourage la verbalisation du raisonnement.
   **Effort** : **M**.

### UX

1. **Problème** : Le breadcrumb des chips est lisible, mais on ne peut pas cliquer dessus pour revenir à un nœud précis. Seul "Revenir en arrière" 1 cran.
   **Proposition** : rendre les chips cliquables pour saut direct.
   **Effort** : **S**.

2. **Problème** : À la fin du 5ème cas, on entre direct dans la modale shell. Pas de récap "tu as eu 4/5 — voici les 5 statuts français principaux dans l&rsquo;arbre, et tu as butté sur SARL".
   **Proposition** : intercaler un écran de **synthèse cartographique** entre le dernier cas et la modale. Affiche l&rsquo;arbre complet avec les 5 cas placés dessus, et marque ceux où le joueur s&rsquo;est trompé. Closure éducative au sens § "real reveal".
   **Effort** : **M**.

3. **Problème** : `setTimeout(1500)` n&rsquo;existe pas ici, mais l&rsquo;animation shake → reveal de la bonne réponse arrive instantanément. Manque de drumroll, donc pas de "weight" sur la validation.
   **Proposition** : 300-500ms de pause Framer entre clic Valider et reveal mint/coral.
   **Effort** : **S**.

4. **Problème** : `result.description` est statique pour les 5 statuts. Or pour le **mauvais** statut choisi, la description ne dit pas pourquoi c&rsquo;est mauvais POUR CE CAS PRÉCIS. Si le joueur choisit SARL pour Marc (startup tech), il lit "SARL = idéal pour PME et transmissions" — c&rsquo;est l&rsquo;explication générique, pas la contre-explication situationnelle.
   **Proposition** : ajouter une `mismatchExplanation: Record<NodeId, string>` côté `Case`, indiquant pourquoi ce statut est inapproprié pour ce cas-là. Affichage en plus de la description statique.
   **Effort** : **M**.

### Qualité code

1. **Type `NodeId`** mélange identifiants techniques (`q1`, `q2-solo`, `q2-multi`, `q3`) et identifiants de résultats (`EI`, `EURL`, etc.). Le couplage est implicite. Lisibilité moyenne. Lignes 11-21.
   **Proposition** : séparer en `type QuestionId` et `type StatutId`, avec un `NodeId = QuestionId | StatutId`.
   **Effort** : **S**.

2. **Cast `currentNode as Question` / `currentNode as Result`** lignes 218 et 199 — non idiomatique TS, fait sauter le typage. La fonction `isResult` existe pour ça mais n&rsquo;est utilisée qu&rsquo;une fois.
   **Proposition** : remplacer les casts par des branches `if (isResult(currentNode))` — TypeScript narrow correctement.
   **Effort** : **S**.

3. **Animation shake en littéral inline** ligne 305 (`animate={isWrong ? { x: [0, -8, 8, -6, 6, 0], ... } : ...}`). Réutilisable.
   **Proposition** : extraire `const shakeKeyframes = { x: [0, -8, 8, -6, 6, 0] }` ou un util `shakeAnimation()`.
   **Effort** : **S**.

4. **`scores.filter(Boolean).length`** ligne ~218 — fonctionne mais pas typé clairement. `scores: boolean[]` est OK mais le sémantique perdu (qu&rsquo;est-ce qu&rsquo;un "false" ? un mauvais choix ? un skip ?).
   **Proposition** : `type CaseOutcome = 'correct' | 'wrong' | 'skipped'` — extension future possible.
   **Effort** : **S**.

5. **`break` inutiles côté `switch` virtuel non utilisé** : la fonction `nextRound` a un early return (`if (isLast) { finish(); return; }`) — bon, mais finir avec `setRoundIdx; setPath; setValidated` pourrait être une fonction `resetRound()` réutilisable (déjà nommée `resetRound` dans MarketRadar).
   **Proposition** : aligner la nomenclature entre les 4 jeux.
   **Effort** : **S**.

### Cohérence avec le catalog mechanics

- Le verbe **choisir** est dans `docs/game-mechanics-catalog.md` § M04 ✅
- StatutQuiz est explicitement cité comme **exemple Cap&rsquo;** dans le catalog M04.
- Implémenté **conformément** au pattern, à 90% :
  - ✅ Pause avant chaque clic — partielle (les hover scale forment une anticipation)
  - ❌ "Glimpse des chemins non-pris à la fin" — non implémenté. Le joueur ne voit pas qu&rsquo;il aurait pu choisir SAS au lieu de SARL.
  - ❌ "Plusieurs good endings, pas une seule bonne réponse" — explicitement contredit (chaque cas a UNE réponse correcte). Cohérent avec un module académique strict, mais violation du pattern.
  - ✅ "Capacité à rejouer et essayer une autre branche" — `Recommencer le cas` permet ça avant validation.
- **Variante non documentée** : _Breadcrumb des choix_. Pourrait être ajouté au catalogue M04 comme bonne pratique.

### Anti-patterns présents

#### #7 — Difficulté one-size-fits-all (⚠️ présent)

- **Déclencheur** : 5 cas figés, mode unique, pas de débloquage.
- **Sortie minimale** : 3 cas ambigus en mode "Niveau confirmé" débloqué après le 1er passage à 5/5. Cf. § Mécaniques #1.
