# Workflow obligatoire pour toute feature de jeu / gamification dans Cap'

Quand on demande "crée un mini-jeu", "gamifie X", "ajoute de la gamification à Y", tu DOIS suivre ces étapes dans l'ordre. Sauter des étapes produit de la gamification générique de basse qualité.

## STEP 1 — Game Design Document (AVANT d'écrire du code)

Écris un fichier GDD.md dans le dossier de la feature concernée. Format :

```markdown
# GDD — [Nom du jeu]

## 1. Player fantasy

[1-2 phrases. Qui le joueur s'imagine être ?]

## 2. Core verb

[UN seul mot/phrase. Que FAIT le joueur ?]

## 3. Educational goal

[Quel concept le joueur doit-il intérioriser ? Sois précis.]

## 4. Aesthetic goals (choisis 1-2)

[Parmi les 8 aesthetics MDA dans game-design-knowledge.md]

## 5. Mechanic (depuis le catalogue ou combinaison)

[Référence des items du catalogue. Justifie la combinaison si applicable.]

## 6. Tension source

[Qu'est-ce qui crée l'incertitude / l'engagement ?]

## 7. Mastery curve

[Comment le joueur s'améliore-t-il sur plusieurs parties ?]

## 8. Failure design

[Que se passe-t-il quand le joueur a tort ? Doit enseigner.]

## 9. Win condition + closure

[Comment ça se termine ? Qu'est-ce qui signale la satisfaction ?]

## 10. Game feel notes

[Animations spécifiques, sons, micro-interactions à soigner]

## 11. Replay value

[Qu'est-ce qui change entre les parties ? Contenu différent, mode plus dur, objectifs cachés ?]

## 12. Anti-patterns check

[Confirmer qu'aucun des 7 anti-patterns n'est présent]
```

Soumets ce GDD pour review AVANT de coder. Si tu ne reçois pas de feedback dans le même message, procède.

## STEP 2 — Mechanics prototype

Code la version la plus simple possible de la mécanique, AUCUN STYLING, AUCUNE DATA. Juste le verbe qui marche.

Exemple : pour un jeu de tri, juste des `<div>` avec drag, drop dans des zones, console.log du résultat. Pas de design, pas d'animation, pas de vraie data encore.

C'est pour valider que la mécanique RESSENT bien avant d'investir dans le polish.

## STEP 3 — Self-evaluation contre la checklist

Avant d'ajouter visuels ou contenu, évalue le prototype contre la design checklist (dans game-design-knowledge.md) :

- [ ] Player fantasy clair en 5 secondes
- [ ] Core verb identifiable
- [ ] Première action dans les 10s
- [ ] Feedback dans les 100ms
- [ ] etc.

Note quelles cases ne passent pas encore et ce que tu vas faire pour les fixer.

## STEP 4 — Game feel pass

Applique les 7 invisibles (anticipation, snap, easing, particles, audio, camera, transitions).

Spécifiquement pour Cap' :

- Utilise Framer Motion spring physics, jamais linear duration
- Ajoute particle burst subtil au succès (use confetti library ou simple canvas)
- Ajoute tick sound au clic (lightweight Web Audio API)
- Subtle camera zoom au focus state

## STEP 5 — Content + theme integration

Maintenant et seulement maintenant, intègre le vrai contenu éducatif. Applique le branding Cap' (typo, couleurs, apostrophe --sun, etc.).

## STEP 6 — Difficulty curve + replay variants

Ajoute au moins 2 niveaux de difficulté OU 3 variants de contenu pour le replay. Les jeux one-shot sont faibles.

## STEP 7 — Final self-critique

Écris un CRITIQUE.md qui demande :

1. Qu'est-ce qui rendrait ce jeu 10% meilleur ?
2. Quelle est l'aesthetic la plus faible ? Comment l'élever ?
3. Si un joueur ragequit, à quel moment ce serait ?
4. Si un joueur devient accro, quelle loop l'accroche ?
5. Quel est le maillon faible du game feel ?

Ces critiques deviennent inputs pour l'itération.

## ⚠️ Quand briser ce workflow

Jamais. Si tu manques de temps, simplifie le JEU, pas le workflow. Un jeu simple mais bien designé bat un jeu complexe mais générique.

## 📌 Note pour Cap' spécifiquement

Sur Cap', un mini-jeu n'est pas "réussi" parce qu'il est terminable. Il est réussi quand :

- Le lycéen a envie d'en faire un autre dans une autre famille
- Il/elle peut décrire le mini-jeu à un·e ami·e en une phrase
- Il/elle a appris quelque chose sur lui-même/elle-même (ses affinités) en plus du concept éducatif
- L'expérience reflète l'identité de marque Cap' de bout en bout
