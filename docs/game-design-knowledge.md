# Game Design Knowledge Base — Cap'

Ce fichier est la référence canonique pour TOUT travail de gamification ou mini-jeu sur le projet Cap'. À lire avant de designer ou coder une feature gamifiée.

## 🎯 Les 5 questions à répondre AVANT de coder un jeu

1. **Player fantasy** — Qui le joueur s'imagine être ? (un stratège, un explorateur, un détective, un bâtisseur ?)
2. **Core verb** — Quelle est l'UNIQUE chose que le joueur FAIT ? (trier, matcher, prédire, négocier, construire, déduire ?) Le verbe définit le jeu plus que le thème.
3. **Tension source** — Qu'est-ce qui crée l'incertitude ? (temps, info cachée, adversaire, ressources rares, choix irréversibles ?)
4. **Mastery curve** — Comment le joueur s'améliore-t-il ? (reconnaissance de patterns, exécution rapide, stratégie profonde, compréhension système ?)
5. **Closure feedback** — Qu'est-ce qui signale "j'ai réussi" ? (un nombre, un reveal visuel, un résultat émergent, une cascade d'effets ?)

Si tu ne peux pas répondre aux 5, le design n'est pas prêt. Ne code pas encore.

## 🧱 Les 6 couches d'un jeu (Schell — The Art of Game Design)

Tout jeu est l'intersection de :

1. **Mechanics** — Règles, actions, conditions de victoire
2. **Dynamics** — Comment les joueurs jouent réellement étant donné les mécaniques
3. **Aesthetics** — La réponse émotionnelle (8 catégories)
4. **Story** — La séquence d'événements
5. **Technology** — Le médium et les outils
6. **Theme** — Le skin/setting

La plupart de la "gamification" se concentre uniquement sur les Mechanics (points + badges). Les pros designent en partant des Aesthetics (émotion cible) et reviennent aux Mechanics.

## 🎮 Les 8 objectifs esthétiques (framework MDA — Hunicke et al.)

Quand tu designs, choisis 1-2 émotions à évoquer. N'essaie pas d'évoquer toutes.

1. **Sensation** — Le jeu comme plaisir sensoriel (visuel, audio, tactile)
2. **Fantasy** — Le jeu comme make-believe (être quelqu'un d'autre, ailleurs)
3. **Narrative** — Le jeu comme drame (histoire qui se déroule)
4. **Challenge** — Le jeu comme parcours d'obstacles (maîtrise de skill)
5. **Fellowship** — Le jeu comme cadre social (multi-joueur, lien)
6. **Discovery** — Le jeu comme territoire inexploré (exploration)
7. **Expression** — Le jeu comme self-discovery (créativité, identité)
8. **Submission** — Le jeu comme passe-temps (relax, low-stakes flow)

La gamification éducative tombe par défaut sur Challenge. Les exemples les plus réussis combinent en réalité Discovery + Expression (les streaks de Duolingo, c'est de la submission, pas du challenge).

## 🌀 Théorie du flow (Csikszentmihalyi)

Un grand jeu maintient le joueur en flow :

- Difficulté juste au-dessus du skill actuel (ni trop facile, ni trop dur)
- Objectifs clairs à chaque instant
- Feedback immédiat et sans ambiguïté
- Sentiment de contrôle
- Distorsion temporelle (on ne voit pas le temps passer)

Implications pratiques :

- Difficulté adaptative (s'ajuste à la performance, pas niveaux fixes)
- Toujours montrer la progression et le prochain objectif
- Feedback dans les 100ms après toute action
- Pas d'états d'échec qui punissent sans enseigner

## 🧠 Self-determination theory — Les 3 besoins psychologiques

Les gens maintiennent leur motivation quand 3 besoins sont satisfaits :

1. **Autonomy** — Le joueur se sent en contrôle, fait des choix qui ont du sens
2. **Competence** — Le joueur se sent efficace, apprend et progresse
3. **Relatedness** — Le joueur se sent connecté (à d'autres ou à un monde)

Mauvaise gamification = récompenses extrinsèques (points, badges) qui sapent la motivation intrinsèque. Bonne gamification = soutient les 3 besoins, et les récompenses deviennent des marqueurs symboliques, pas le but.

## 🎲 Player types (Bartle taxonomy + extensions)

Différents joueurs veulent différentes choses :

- **Achievers** — Veulent optimiser, compléter, maîtriser
- **Explorers** — Veulent découvrir, dévoiler les mécaniques cachées
- **Socializers** — Veulent interagir, partager, comparer
- **Killers** — Veulent dominer (rare en éducatif)

Ajouts modernes :

- **Philanthropists** — Veulent aider les autres
- **Free Spirits** — Veulent autonomie, expression
- **Players** — Veulent juste s'amuser

Un grand jeu sert au moins 2 types de joueurs simultanément.

## ⚙️ Les 12 mécaniques de mini-jeu les plus puissantes

Voir le catalogue complet dans `game-mechanics-catalog.md`. Liste rapide :

1. Sorting / Categorization
2. Matching / Pairing
3. Sequencing / Ordering
4. Prediction / Estimation
5. Trade-off / Allocation
6. Pattern detection
7. Branching narrative / Decision tree
8. Negotiation / Dialog
9. Build / Compose
10. Investigate / Deduce
11. Optimize / Tune
12. Defend / React

## ✨ Game feel — les 7 invisibles qui font un BON jeu

La plupart de la gamification échoue non sur les mécaniques mais sur le game feel. Ce sont les détails :

1. **Anticipation** — Petite pause avant que l'action commit (50-100ms) crée du poids
2. **Snap & magnetism** — Les éléments UI sont attirés vers les positions valides
3. **Easing curves** — Jamais linéaire. Utiliser cubic-bezier(0.34, 1.56, 0.64, 1) pour "spring", cubic-bezier(0.25, 0.46, 0.45, 0.94) pour "satisfying"
4. **Particle feedback** — Petites explosions au succès (3-7 particules, < 500ms)
5. **Audio cue** — Même un tick de 50ms au clic améliore massivement la qualité perçue
6. **Camera movement** — Zoom subtil au focus, shake à l'impact (max 5px, 200ms)
7. **State transitions** — Jamais instantané. Toujours 200-400ms avec easing.

Sur Cap' avec Framer Motion : préférer spring physics à duration. `type: "spring", stiffness: 300, damping: 25`.

## ❌ Les 7 anti-patterns à ne jamais utiliser

1. **Points sans signification** — XP qui ne débloque rien et ne signifie rien
2. **Badge spam** — Récompenser chaque micro-action dilue la reconnaissance
3. **Forced grinding** — Répéter la même tâche pour la progression sans gain de skill
4. **Punitive failure** — Perdre la progression en cas d'échec (OK uniquement en roguelike)
5. **Pay-to-win en éducation** — Tout ce qui dit "obtiens la réponse plus vite avec X"
6. **Gamification comme wrapper** — Une tâche ennuyeuse avec des points par-dessus reste ennuyeuse
7. **Difficulté one-size-fits-all** — Même niveau pour le novice et l'expert tue les deux

## 🎓 Spécificités de la gamification éducative

Quand le but est l'apprentissage :

- La mécanique doit INCARNER le concept, pas le décorer
  - Mauvais : "Quiz sur PESTEL avec points" (les points décorent)
  - Bon : "Drag les facteurs dans les buckets PESTEL pendant que des événements de marché se déclenchent" (la mécanique incarne la catégorisation)
- Les erreurs sont des opportunités d'apprentissage, jamais juste "faux"
  - Montrer POURQUOI la mauvaise réponse est mauvaise
  - Permettre de retry sans pénalité
  - Tracker les patterns d'erreurs pour suggérer review
- La maîtrise se montre par le transfert, pas la répétition
  - "Applique le framework à un nouveau cas" > "Réponds à la même question encore"
- Connecter aux enjeux du monde réel
  - "Voici comment Decathlon a réellement décidé son pricing" > "Entreprise imaginaire X"

## 📐 Design checklist — chaque jeu doit répondre OUI à tout

Avant qu'un jeu ne ship :

- [ ] Player fantasy clair en 5 secondes de jeu
- [ ] Core verb identifiable
- [ ] Première action dans les 10s d'ouverture
- [ ] Feedback visible dans les 100ms après tout input
- [ ] Difficulté adapte ou modes sélectionnables
- [ ] L'échec enseigne quelque chose (pas juste retry)
- [ ] Progression visible à tout moment
- [ ] Win condition satisfaisante (pas juste "tu as 100%")
- [ ] Replay value existe (chemins différents, randomisation, mastery)
- [ ] Au moins 2 des 8 aesthetic goals sont évoqués
- [ ] Aucun des 7 anti-patterns n'est présent
- [ ] Incarne le concept éducatif (si éducatif)

## 🎨 Références game design pour s'inspirer

Quand bloqué, regarder COMMENT ces jeux résolvent leurs problèmes de design :

- **Threes / 2048** — Mastery par stratégie émergente sur règles simples
- **Monument Valley** — Discovery + sensation, pas d'état d'échec
- **Papers Please** — Tâche répétitive rendue tendue par info cachée et enjeux
- **Reigns** — Choix binaire avec conséquences profondes, simplicité gestuelle
- **Stardew Valley** — Progression long-terme avec multiples objectifs parallèles
- **Duolingo** — Loop de streaks (lire comment ça marche vraiment : forks, hearts, bonus)
- **Mini Metro** — Pression temps réel avec abstraction élégante
- **Hades** — L'échec comme progression (chaque mort compte)
- **TIS-100 / Shenzhen IO** — Programmation comme jeu (puzzle par contraintes)

Quand on design pour Cap', s'inspirer de ces jeux, pas des exemples de "SaaS gamifié".

## 🎯 Spécificités Cap'

Cap' fait de la gamification ÉDUCATIVE pour des LYCÉENS qui découvrent le monde pro. Implications :

- **Player fantasy** : "Je suis un·e jeune pro qui découvre son métier" — pas "je suis un étudiant qui fait un quiz"
- **Aesthetic dominante recherchée** : **Discovery** (découvrir un univers) + **Expression** (révéler ses propres affinités)
- **Tension primaire** : "Est-ce que ça me parle ?" (pas "Est-ce que je vais avoir 100% ?")
- **Stake** : Aider l'orientation, pas valider une connaissance
- **Anti-Cap'** : QCM scolaire, points qui s'accumulent sans signifier, feedback "Bonne réponse"

L'identité de marque (apostrophe jaune, dark mode, Bricolage Grotesque, microcopy "//") doit transparaître dans chaque mini-jeu — il doit être impossible de confondre un mini-jeu Cap' avec un mini-jeu Khan Academy ou Duolingo.
