# Cap' Game Mechanics Catalog

Mécaniques de jeu réutilisables, validées et prêtes à combiner. Quand tu designes un nouveau mini-jeu, COMMENCE ici. Choisis une mécanique primaire, optionnellement combine avec une secondaire.

## Comment utiliser ce catalogue

1. Lis la spec de la mécanique
2. Identifie quel contenu/concept correspond au verbe
3. Vérifie la section "Combine bien avec" pour ajouter de la profondeur
4. Référence l'implémentation existante si applicable

---

## M01 — Drag & Sort

**Verbe** : classifier
**Contenu adapté** : tout ce qui a des catégories (PESTEL, segments de marché, taxonomies)
**Source de tension** : cas ambigus aux frontières
**Implémentation** : @dnd-kit/core, snap zones avec magnétisme
**Game feel obligatoire** :

- Items se soulèvent légèrement au grab (scale 1.05, shadow)
- Drop zones glow quand item est au-dessus
- Wrong drop = shake subtil, item retourne smoothly
- Right drop = pulse ✓ + petite particle burst
  **Combine bien avec** : Time pressure (M07), Hidden info (M09)
  **Exemples Cap'** : PestelMatch, MappingConcurrentiel
  **Anti-pattern à éviter** : pas de pénalité de points sur mauvais drops ; juste pas de récompense

---

## M02 — Build & Compose

**Verbe** : construire
**Contenu adapté** : frameworks (4P marketing, business canvas, value prop)
**Source de tension** : dépendances entre les parties
**Implémentation** : slots structurés avec validation de type
**Game feel obligatoire** :

- Slots ont une "shape" visible suggérant ce qui s'y insère
- Components s'animent à leur place
- Indicateur live de validité (border rouge si combinaison invalide)
- Composition finale devient "playable" (le résultat agit/anime)
  **Combine bien avec** : Iteration (M11), Live preview
  **Exemples Cap'** : MixMarketing4P
  **Anti-pattern** : que ce soit juste un form-filling avec réorganisation

---

## M03 — Predict & Reveal

**Verbe** : estimer
**Contenu adapté** : data marché, outcomes financiers, prédictions sociales
**Source de tension** : vérité cachée, ta confiance vs réalité
**Implémentation** : slider/input → submit → reveal animé
**Game feel obligatoire** :

- Slider de range de confiance (pas point estimate)
- Moment de drumroll avant le reveal
- Score basé sur la proximité, pas exact (encourage le raisonnement)
- Montrer la distribution des guesses des autres joueurs (preuve sociale)
  **Combine bien avec** : Multiple rounds (improving), Reasoning prompt
  **Exemples Cap'** : (aucun encore — opportunité pour modules finance, market research)
  **Anti-pattern** : binary right/wrong sur prédiction est dur et non-instructif

---

## M04 — Branching Decision

**Verbe** : choisir
**Contenu adapté** : décisions stratégiques, dilemmes éthiques, parcours
**Source de tension** : irréversibilité, coût d'opportunité
**Implémentation** : structure d'arbre, navigation node par node
**Game feel obligatoire** :

- Pause avant chaque clic (poids)
- Glimpse des chemins non-pris à la fin (regret/curiosité)
- Plusieurs "good endings", pas une seule bonne réponse
- Capacité à rejouer et essayer une autre branche
  **Combine bien avec** : Wrapper narratif, Stakes
  **Exemples Cap'** : StatutQuiz (module UCL)
  **Anti-pattern** : questionnaire linéaire déguisé en arbre de décision

---

## M05 — Investigate & Deduce

**Verbe** : comprendre
**Contenu adapté** : market research, root cause analysis, customer pain
**Source de tension** : information incomplète, temps
**Implémentation** : tableau de clues, hypothesis input, mécanisme de vérification
**Game feel obligatoire** :

- UI de carnet pour collecter findings
- Chaque clue révélée avec mini-animation
- Moment "Eureka" sur hypothèse correcte
- Mauvaise hypothèse = feedback doux, pas "FAUX"
  **Combine bien avec** : Time pressure, Multiple cases
  **Exemples Cap'** : (aucun encore — opportunité pour marketing research, audit finance)

---

## M06 — Pattern Match

**Verbe** : reconnaître
**Contenu adapté** : identité de marque, signaux de marché, anomalies financières
**Source de tension** : similarité vs différence, vitesse de reconnaissance
**Implémentation** : grid d'items, sélection paires/intrus
**Game feel obligatoire** :

- Items highlight subtilement au hover (anticipation)
- Feedback "near miss" subtil pour presque-correct
- Speed bonus sur streak
- Reveal visuel de la règle après chaque round
  **Combine bien avec** : Time pressure, Streaks
  **Exemples Cap'** : (aucun encore — opportunité pour brand identity, design)

---

## M07 — Time Pressure (modifier)

**Modifier de verbe** : plus vite
**Combine avec** : toute autre mécanique
**Implémentation** : timer visible, musique de tension optionnelle
**Game feel obligatoire** :

- Timer visible mais pas stressant (pas rouge avant les derniers 20%)
- Pulse s'intensifie quand temps s'écoule
- Bonus pour la rapidité, mais jamais "fail" si lent (score dégradé, pas zéro)
  **Anti-pattern** : timer qui termine le jeu sans warning

---

## M08 — Streak / Combo (modifier)

**Modifier de verbe** : consécutif
**Combine avec** : M01, M02, M06
**Implémentation** : compteur visible, multiplicateur sur score
**Game feel obligatoire** :

- Escalation visuelle (couleur, scale, particles) à 3, 5, 10
- Audio cue à chaque seuil
- Reset doux sur miss (pas à 0, juste divisé par 2)
  **Anti-pattern** : reset punitif sur premier miss

---

## M09 — Hidden Information (modifier)

**Modifier de verbe** : avec incertitude
**Combine avec** : M03, M04, M05
**Implémentation** : info partielle révélée, capacité à payer/attendre pour plus
**Game feel obligatoire** :

- Trade-off entre rapidité et certitude
- Information s'accumule visiblement
- Joueur décide quand "assez d'info"

---

## M10 — Live Preview (modifier)

**Modifier de verbe** : voir la conséquence avant de commit
**Combine avec** : M02, M11
**Implémentation** : ghost result qui update live
**Game feel obligatoire** :

- Preview clairement différenciée du final (transparence, ligne pointillée)
- Updates dans les 100ms du changement d'input
- Commit final a du poids (animation, son)

---

## M11 — Iterate / Tune (modifier)

**Modifier de verbe** : raffiner
**Combine avec** : M02, M10
**Implémentation** : paramètres ajustables, peut re-run
**Game feel obligatoire** :

- Chaque itération montre delta clair vs précédent
- Best score mémorisé et visible
- Comportement asymptotique (rendements décroissants) fait que le joueur s'arrête
  **Anti-pattern** : tuning infini sans raison de s'arrêter

---

## M12 — Multiplayer Compare (modifier)

**Modifier de verbe** : vs autres
**Combine avec** : tout
**Implémentation** : leaderboard, ghost replay, async
**Game feel obligatoire** :

- Voir les approches des autres, pas juste les scores
- Multiples leaderboards (today, all-time, friends)
- Moments de validation sociale (ta stratégie était rare/populaire)
  **Anti-pattern** : leaderboard pur sans info qualitative

---

## Comment combiner

Choisis UNE mécanique primaire + 1-2 modifiers MAX. Plus que ça = bruit.

Exemples de combinaisons fortes :

- M01 (drag-sort) + M07 (time pressure) + M08 (streak) = arcade sort classique
- M02 (build) + M10 (live preview) + M11 (iterate) = sandbox stratégie
- M04 (branching) + M09 (hidden info) = noir détective
- M03 (predict) + M12 (multiplayer) = estimation sociale

## Comment évaluer l'originalité

Un mini-jeu est ORIGINAL si il :

- Combine des mécaniques d'une façon qui n'a pas été vue dans les apps gamifiées mainstream
- Incarne le concept éducatif (pas juste décore)
- A une image/moment unique mémorable qui résume le jeu
- Pourrait être décrit en une phrase à un·e inconnu·e qui voudrait essayer

Si ça sonne comme "Duolingo pour X" ou "Quiz avec points", c'est pas original.

## 📌 Catalogue spécifique Cap' — mécaniques à développer prioritairement

Pour Cap', les mécaniques avec le plus haut potentiel pédagogique × engagement lycéen :

**Priorité 1** (à développer pour les prochaines familles métiers) :

- M03 Predict & Reveal — pour finance, marketing analytics, ventes
- M05 Investigate & Deduce — pour conseil, marketing research, RH
- M04 Branching Decision — pour entrepreneuriat, conseil, management

**Priorité 2** (à explorer une fois le coeur solide) :

- M06 Pattern Match — pour design, brand identity, communication visuelle
- M11 Iterate / Tune — pour pricing, advertising, UX

**À éviter sur Cap'** :

- M12 Multiplayer Compare en pur leaderboard — trop "scolaire", crée de la pression au lieu de la découverte
- Toute combinaison avec >2 modifiers — perd le lycéen
