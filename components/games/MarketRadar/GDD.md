# GDD — MarketRadar

> Famille **Programmes / UCL Lille · Module Gestion d&rsquo;entreprise**
> Sous-module 04 — _Comprendre son marché_
> Statut : **a posteriori** (jeu déjà implémenté, GDD reconstitué pour audit). Source : `components/games/MarketRadar.tsx` (638 l — le plus gros des 4).

## 1. Player fantasy

Tu es **junior consultant·e** sur 3 missions terrain consécutives chez Peugeot, Decathlon, Netflix. Pour chaque marque, le DAF te file un brief en 3 parties : "identifie nos marchés", "classe les profils de nos clients", "calcule notre part de marché". Tu vis 3 cas en miroir, et tu sors avec un score consolidé.

> Pas "QCM marketing en 3 sections". Tu **fais la mission complète sur 3 marques différentes**.

## 2. Core verb

**Analyser** (en 3 sous-tâches : segmenter, qualifier, calculer).

C&rsquo;est le verbe le plus complexe des 4 jeux UCL — il combine 3 sous-mécaniques :

- **Segmentation produit** (épreuve A) : assigner 6 produits à `principal / support / environnant / aucun` — mini-QCM par item.
- **Segmentation client** (épreuve B) : assigner 4 profils à `NCR / NCA / CA / CP` — mini-QCM par profil.
- **Calcul** (épreuve C) : 1 QCM à 4 choix sur un calcul de part de marché ou taux de pénétration.

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé **3 dimensions distinctes du concept "marché"** :

- **Marché par produit** : ton produit principal vit dans un écosystème de produits supports (complémentaires) et de produits environnants (substituables).
- **Marché par client** : tu n&rsquo;as pas que des CA (consommateurs actuels) ; tu as aussi des NCR (à conquérir), des CP (chez le concurrent), des NCA (jamais).
- **Indicateurs chiffrés** : la part de marché et le taux de pénétration sont des fractions simples mais lourdes de sens (CA entreprise / CA marché ; demande actuelle / demande potentielle).

Et la mastery du transfert : sur 3 secteurs très différents (auto, sport, streaming), les **mêmes 3 questions** s&rsquo;appliquent. Le framework est universel.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Le joueur découvre que Peugeot et Decathlon et Netflix se posent les **mêmes 3 questions** stratégiques. Insight non trivial pour un lycéen.
2. **Challenge** — 3 sous-tâches × 3 manches = 9 mini-épreuves. La complexité est réelle, surtout l&rsquo;épreuve C (calcul).

Note de défense : pas de **Narrative** dominante (les marques sont juste citées en intro de manche, pas humanisées comme dans StatutQuiz). Pas d&rsquo;**Expression** non plus. Le jeu est honnête sur sa nature : entraîner le framework. Mais il manque ce qui pourrait le rendre exceptionnel (cf. § Améliorations).

## 5. Mechanic (depuis le catalogue ou combinaison)

C&rsquo;est le jeu UCL **le plus distant du catalogue**. Le verbe "analyser" en 3 phases successives n&rsquo;est pas dans `game-mechanics-catalog.md`. Tentons un mapping :

- **Épreuve A** : ressemble à **M01 Drag & Sort dégradé** (sans drag — c&rsquo;est un QCM avec boutons "principal / support / environnant / aucun" pour chaque item).
- **Épreuve B** : idem M01 dégradé.
- **Épreuve C** : pas dans le catalogue. C&rsquo;est un **QCM à 4 choix sur un calcul** — ressemble à un _Investigate & Deduce_ (M05) mais sans investigation, juste un calcul.

**Conclusion sur la mécanique** : ce n&rsquo;est pas une mécanique unifiée — c&rsquo;est un **enchaînement de 3 mini-mécaniques distinctes** (sort dégradé × 2, puis QCM calcul). Hybride non documenté.

**Verdict mapping** : "M01 répété en boutons radio + QCM calcul". Lecture la plus défendable : _meta-mécanique séquentielle_. Ce verbe **mérite d&rsquo;être nommé dans le catalogue** comme **M-extension : Multi-phase Quiz** ou de motiver un re-design pour utiliser une mécanique unique du catalog (cf. § Améliorations).

## 6. Tension source

- **Charge cognitive cumulative** : 3 phases × 3 manches = 9 sub-épreuves. Si une seule est ratée, le score moyen baisse.
- **Calcul mental** (épreuve C) : la seule tension réelle est sur la phase C — les autres sont des QCM avec 4 options.
- **Pas de timer** : volontaire mais regrettable (cf. § Améliorations — la phase C calcul **gagnerait** d&rsquo;un timer modéré qui force l&rsquo;intuition au lieu du calcul exact).

## 7. Mastery curve

3 manches successives :

- **M1 — Peugeot** : marché concret, profils consommateur évidents (étudiante NCR, parisien NCA, famille CA, cadre CP). PM = 15% (45/300).
- **M2 — Decathlon** : volumes plus gros, frontaliers timides. PM = 37,5% (4,5/12 Mrd€).
- **M3 — Netflix** : plus abstrait (streaming), profils digital-natives, calcul = taux de pénétration (pas part de marché). Switch de KPI dans le calcul.

Bonne diversité de cas. La mastery vient du transfert framework × secteur. Le switch PM→pénétration en M3 est un beau twist qui force à comprendre les 2 indicateurs (et pas à mémoriser une formule).

## 8. Failure design

- À chaque épreuve, le joueur peut ajuster sa réponse jusqu&rsquo;à passer à la suivante (pas de validation intermédiaire — il peut switcher entre A/B/C via les onglets tant qu&rsquo;il n&rsquo;a pas cliqué "Valider la manche").
- Au validate de la manche, scoring : `aOk + bOk + cOk` sur `total = A.items.length + B.items.length + 1`.
- **Pas de reveal détaillé** des bonnes réponses incorrectes — juste un score `X/100` et un bouton manche suivante.
- Skills floor garantis : `analyse: finalScore/2 + 30, rigueur: finalScore/3 + 25, communication: 30`.

⚠️ Faiblesse importante : **aucune indication de quelle question on a ratée**. Sur 11 sub-questions par manche (6 + 4 + 1), si tu sors avec 7/11 = 63%, tu ne sais pas où tu t&rsquo;es trompé. **Pire que les 3 autres jeux UCL** sur ce point.

## 9. Win condition + closure

- 3 manches, score moyen final.
- `shell.complete(skills, finalScore, { roundScores: scores })`.
- Skills computés avec un `communication: 30` flat — étrange pour un jeu purement analytique. Cohérence questionnable.

⚠️ Pas de "real reveal" éducatif (e.g. "Voici la vraie part de marché de Peugeot en 2024 et ce qu&rsquo;ils font de cette info.").

## 10. Game feel notes

Présents dans le code :

- ✅ **Tabs onglets pour les 3 phases** A/B/C avec état "done" en mint si toutes les questions répondues.
- ✅ Animation `motion.div` à l&rsquo;entrée de chaque phase (key change → re-anim).
- ✅ Boutons-options avec coloration ACCENT au sélect.
- ✅ Phase C affiche les 4 options en gros (clamp font-size 24px), bien lisible.
- ✅ Score panel mint/sun/coral selon seuils 75/50.

Manquants vs 7 invisibles :

- ❌ Pas de **drumroll** entre clic Valider et reveal du score (instantané).
- ❌ Pas de **particle burst** au mint result.
- ❌ Pas de **shake** ou feedback distinctif sur réponse erronée.
- ❌ Pas de **tick audio**.
- ❌ Le passage entre phases A→B→C est OK mais pas mémorable (juste un changement de tab).
- ⚠️ La feature `setPhase('result')` à la validation ne montre **pas** de pause — pas d&rsquo;anticipation "drumroll" avant l&rsquo;affichage du score.

## 11. Replay value

**Faible**. 3 manches scriptées, items et profils figés, pas de sandbox. Aucun secret/easter egg. Pas de mode "calcul rapide" (timer C). Juste re-jouer pour faire mieux.

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | Statut            | Justification                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité          | Score = % de bonnes réponses sur 11 sub-questions par manche.                                                                                                                                                                                                                                   |
| 2   | Badge spam                                | ✅ Évité          | 1 closure unique.                                                                                                                                                                                                                                                                               |
| 3   | Forced grinding                           | ⚠️ **Frontalier** | 33 sub-questions au total (3 manches × 11). Ressenti séquentiel pesant — ABCABCABC.                                                                                                                                                                                                             |
| 4   | Punitive failure                          | ✅ Évité          | Skills floor (30/25/30).                                                                                                                                                                                                                                                                        |
| 5   | Pay-to-win éducatif                       | — N/A             |                                                                                                                                                                                                                                                                                                 |
| 6   | Gamification comme wrapper                | ⚠️ **Présent**    | Les épreuves A et B sont des **QCM à 4 boutons** sans aucune mécanique distincte d&rsquo;un quiz scolaire. L&rsquo;épreuve C est un QCM calcul. La séquentialité ABC ajoute du volume mais pas du verbe nouveau. **C&rsquo;est le jeu UCL où l&rsquo;anti-pattern wrapper est le plus marqué.** |
| 7   | Difficulté one-size-fits-all              | ⚠️ **Présent**    | 3 manches figées, aucun mode.                                                                                                                                                                                                                                                                   |

---

## Méta — design checklist

| Item                            | Statut                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Player fantasy clair en 5s      | ⚠️ Le triple format A/B/C n&rsquo;est pas évident immédiatement.                                                                                              |
| Core verb identifiable          | ⚠️ "Analyser" est diffus — 3 verbes différents en série.                                                                                                      |
| Première action dans les 10s    | ✅ Phase A lance avec items dispo dès mount.                                                                                                                  |
| Feedback dans les 100ms         | ⚠️ Sélection bouton OK, mais pas de feedback "correct/incorrect" temps réel.                                                                                  |
| Difficulté progressive ou modes | ⚠️ Légère progression (M3 = pénétration au lieu de PM) mais pas de modes.                                                                                     |
| L&rsquo;échec enseigne          | ❌ Score brut, pas d&rsquo;indication des erreurs précises.                                                                                                   |
| Progression visible             | ✅ Tabs A/B/C avec état done + badges manches.                                                                                                                |
| Win condition satisfaisante     | ❌ Score brut sans synthèse.                                                                                                                                  |
| Replay value                    | ❌                                                                                                                                                            |
| ≥ 2 aesthetics                  | ⚠️ Discovery + Challenge mais aucun moment fort.                                                                                                              |
| Aucun anti-pattern              | ❌ #6 marqué + #7 présent + #3 frontalier.                                                                                                                    |
| Incarne le concept              | ⚠️ La séquence A/B/C reflète bien les 3 dimensions du marché conceptuellement. Mais la mécanique pure (radio buttons) ne s&rsquo;élève pas au-dessus du quiz. |

---

## Améliorations

### Mécaniques

1. **Problème** : 3 phases hétérogènes en QCM, pas de verbe unifié. Le jeu est plus proche d&rsquo;un quiz scolaire que d&rsquo;un mini-jeu Cap&rsquo;.
   **Proposition principale** : **re-designer la phase A en M01 Drag & Sort réel** (3 buckets visibles : `principal / support / environnant`, drag des produits depuis un pool). Re-designer phase B idem (4 buckets NCR/NCA/CA/CP). Garder phase C en QCM mais avec un input slider de prédiction (M03 Predict & Reveal) — le joueur déplace un slider vers son estimation de PM, voit la réponse révélée avec drumroll. **Cette refonte transforme MarketRadar en M01+M01+M03**, toutes documentées.
   **Effort** : **L** (refonte UI substantielle).

2. **Problème** : L&rsquo;épreuve C est un QCM 4 choix sur un calcul. Ça récompense la mémorisation du calcul, pas la compréhension.
   **Proposition** : passer à un slider de range avec **score basé sur la proximité** (cf. M03 Predict & Reveal). Le joueur déplace un curseur entre 0% et 100%, soumet, et voit la vraie valeur révélée. Score = (1 - |estimate - actual| / max_error) × 100.
   **Effort** : **M** (changement d&rsquo;UI phase C uniquement).

3. **Problème** : Pas de feedback formatif. Le joueur peut sortir avec 7/11 sans savoir où il s&rsquo;est trompé.
   **Proposition** : à la validation, montrer le breakdown par phase ("A: 5/6 ✓✓✓✓✓✗", "B: 2/4 ✓✓✗✗", "C: 1/1 ✓") avec couleur mint/coral par sub-question. Cliquer sur une coral révèle la bonne réponse + 1 phrase d&rsquo;explication.
   **Effort** : **M**.

### UX

1. **Problème** : Les onglets A/B/C ne suggèrent pas la nature de l&rsquo;épreuve. "Épreuve A" est opaque.
   **Proposition** : libellés explicites : "Épreuve 1 — Marché par produit", "Épreuve 2 — Profils clients", "Épreuve 3 — Calcul". Chaque tab montre une icône (📦 / 👤 / 📊).
   **Effort** : **S**.

2. **Problème** : Le joueur ne peut pas voir tous les résultats en une vue. Il doit naviguer onglets pour reconstituer.
   **Proposition** : à la validation, écran "Résumé manche" qui affiche les 3 épreuves côte-à-côte avec leurs sous-scores, avant le bouton "Manche suivante".
   **Effort** : **M**.

3. **Problème** : Pas de "real reveal" sur le contexte. Le joueur sort de la manche Peugeot sans savoir si 15% c&rsquo;est mieux que 2024 ou pire qu&rsquo;en 2010.
   **Proposition** : dans l&rsquo;écran résumé, ajouter 1-2 lignes contextuelles ("La vraie PM de Peugeot en 2024 était autour de 16% — secteur très concurrentiel").
   **Effort** : **M** (data work).

4. **Problème** : Phase C calcul sans support visuel. Le joueur doit poser le calcul mentalement (45 ÷ 300).
   **Proposition** : afficher la formule générale en haut ("Part de marché = CA entreprise / CA marché × 100") en mode aide subtil. Ne pas pré-remplir le calcul, juste rappeler la formule.
   **Effort** : **S**.

### Qualité code

1. **Fichier 638 lignes — le plus gros des 4 jeux**. Composant principal `MarketRadar` ~150 l, plus 4 sous-composants `PhaseA`, `PhaseB`, `PhaseC`, `ResultPanel` qui restent inline. Cf. AUDIT.md § I1.
   **Proposition** : split en `MarketRadar/{index.tsx, PhaseA.tsx, PhaseB.tsx, PhaseC.tsx, Result.tsx}`. **Risque visuel : 0** si props et styles conservés.
   **Effort** : **M**.

2. **`scores: number[]` accumulé sans typage de manche**. Une manche skippée n&rsquo;est pas distinguable d&rsquo;une manche à 0.
   **Proposition** : `type RoundResult = { score: number; aOk: number; bOk: number; cOk: boolean; }` — capture le breakdown pour le futur écran résumé.
   **Effort** : **S**.

3. **Magic number `communication: 30`** flat dans le payload de `shell.complete` — pas justifié par le gameplay (aucune dimension communication n&rsquo;est testée).
   **Proposition** : retirer cette skill ou justifier ("la verbalisation de profils clients est de la communication") — au choix produit.
   **Effort** : **S**.

4. **Switch entre phases via `setPhase` non bloqué quand sub-épreuve incomplète**. Le joueur peut sauter de A à C sans rien remplir, valider, et obtenir un score 0/11 sans warning.
   **Proposition** : ajouter une confirmation "Valider la manche avec X questions sans réponse ?" si `aDone && bDone && cDone === false`.
   **Effort** : **S**.

5. **Duplication scoring color thresholds** : `score >= 75 ? mint : score >= 50 ? sun : coral` — répliqué dans EntrepriseExplorer, PestelMatch, MixMarketing4P et ici. Pas dans `lib/scoring.ts`.
   **Proposition** : déplacer les thresholds en `lib/scoring.ts` et importer. (cf. AUDIT.md § M4 — `lib/scoring.ts` existe mais Mapping ne l&rsquo;utilise toujours pas).
   **Effort** : **S**.

### Cohérence avec le catalog mechanics

- **Le verbe utilisé n&rsquo;est PAS clairement dans le catalogue**. Le plus proche serait M01 (sort) pour A et B, mais l&rsquo;implémentation actuelle est **bouton radio**, pas drag&drop — ne respecte pas le pattern M01. Et l&rsquo;épreuve C n&rsquo;a aucun équivalent direct.
- **Décision recommandée** : **refondre** les épreuves A et B pour qu&rsquo;elles utilisent un vrai M01, et **adopter M03 Predict & Reveal** pour C (slider d&rsquo;estimation au lieu de QCM 4 choix). Le jeu deviendrait conforme au catalogue et plus engageant. Cf. § Mécaniques #1 et #2.
- **Alternative** : **ajouter au catalogue** une nouvelle entrée **M13 — Multi-phase Quiz Sequence** documentant le pattern "3 sub-questionnaires en série sur le même sujet" — moins recommandée car l&rsquo;antipattern wrapper est trop présent.

### Anti-patterns présents

#### #3 — Forced grinding (⚠️ frontalier)

- **Déclencheur** : 9 sub-épreuves identiques en pattern. Pas de variation mécanique d&rsquo;une manche à l&rsquo;autre, juste les contenus changent.
- **Sortie minimale** : la refonte M01+M01+M03 (Mécaniques #1) introduit 2 verbes différents (drag&drop + slider) — moins répétitif perçu.

#### #6 — Gamification comme wrapper (⚠️ marqué)

- **Déclencheur** : épreuves A et B sont strictement des QCM bouton-radio à 4 choix. C est un QCM à 4 choix. La séquentialité ABC est la seule "mécanique" qui ajoute quelque chose au quiz pur — et c&rsquo;est juste de la sérialisation.
- **Sortie minimale (recommandée)** : refondre A et B en M01 Drag & Sort (le drag est ce qui ne peut pas exister en QCM) et C en M03 slider de prédiction (l&rsquo;estimation continue est ce qui ne peut pas exister en QCM).
- **Sortie alternative (timide)** : garder le format mais ajouter une phase D obligatoire "Justifie ton classement de B" — la verbalisation est ce qui sort du quiz.

#### #7 — Difficulté one-size-fits-all (⚠️ présent)

- **Déclencheur** : 3 manches figées, aucun mode.
- **Sortie minimale** : 1 mode "secteur libre" en sandbox + 1 mode "calcul rapide" avec timer optionnel sur phase C.
