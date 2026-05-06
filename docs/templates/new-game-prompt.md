=== CAP' — TEMPLATE GÉNÉRATION DE GDD MINI-JEU v1 ===
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCTIONS À CLAUDE (ne pas modifier)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu vas générer un GDD (Game Design Document) complet pour un mini-jeu Cap', à partir
des seules informations fournies dans la section [A] ci-dessous. Toutes les autres
sections ([B], [C], [D]) sont du contexte fixe à respecter sans le réécrire.

Ton livrable est UN FICHIER MARKDOWN complet, structuré comme les GDD existants du
projet (cf. components/games/StatutQuiz/GDD.md ou MappingConcurrentiel/GDD.md pour
référence — ce sont les golden standards).

AVANT D'ÉCRIRE :

1. Lis CLAUDE.md, docs/game-design-knowledge.md, docs/game-design-workflow.md
2. Lis les 2 golden standards : StatutQuiz/GDD.md et MappingConcurrentiel/GDD.md
3. Vérifie que ta proposition NE TOMBE PAS dans un des 12 anti-patterns documentés
4. Si la mécanique que tu envisages ressemble à un anti-pattern, propose une
   alternative qui INCARNE le métier au lieu de l'illustrer

CONTRAINTES NON-NÉGOCIABLES :

- Le GDD doit décrire une mécanique INCARNÉE (le verbe joué = le verbe métier)
- Maximum 1 à 3 termes techniques dans tout le jeu, choisis comme étant les plus
  emblématiques du métier ciblé
- Pas de wrapper QCM déguisé (anti-pattern #6)
- Pas d'écran d'instructions long : règles comprises en moins de 2 minutes,
  idéalement par observation directe de l'UI
- Failure design riche : chaque erreur enseigne quelque chose, ne se contente pas
  de dire "raté"
- Le GDD doit pouvoir être implémenté en TypeScript/React sans nouvelle techno
- Durée de jeu cible : 3 à 5 minutes une fois la première run terminée
- Pas de dépendance à un personnage narratif imposé

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[A] IDENTIFICATION DU JEU — À REMPLIR PAR L'HUMAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module parent (grande matière) : [À REMPLIR — ex : Marketing]
Métier ciblé par ce jeu : [À REMPLIR — ex : Chef de produit]
Numéro du jeu dans le module : [À REMPLIR — ex : Jeu 2/4]
Position dans la progression : [À REMPLIR — Premier / Milieu / Dernier]
Slug technique souhaité : [À REMPLIR — ex : 'lancement-produit', kebab-case, en français]
Composant React souhaité : [À REMPLIR — ex : LancementProduit, PascalCase]

Ce que tu veux que le joueur RESSENTE après 3-5 minutes :
[À REMPLIR — 1 phrase, du type "le poids des arbitrages quand 3 contraintes
incompatibles tirent dans 3 directions"]

Le moment de bascule métier que tu veux faire vivre :
[À REMPLIR — 1 phrase, du type "celui où on comprend qu'aucune option n'est
parfaite et qu'il faut faire un choix tranché"]

Contraintes ou tabous éventuels (optionnel) :
[À REMPLIR ou laisser vide — ex : "ne pas reprendre la même mécanique que
StatutQuiz" / "doit pouvoir tourner sur mobile" / "pas plus de 8 cartes affichées"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[B] CONTEXTE PRODUIT CAP' — FIXE, NE PAS MODIFIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cap' est une plateforme web de mini-jeux immersifs pour 2 publics :

- Lycéens 15-18 ans hésitant à s'orienter vers une école de commerce
- Étudiants du supérieur (école de co en cours OU jeunes diplômés) cherchant
  leur orientation pro

Aucune connaissance préalable en commerce ou en business n'est requise.

Pacte avec le joueur :

> "Tu joues, et à la fin tu apprends quelque chose sur toi-même."

Aesthetic dominante : Discovery + Expression.
Le joueur ne révise pas un cours, il découvre une logique métier de l'intérieur,
et en sort avec une mini-révélation sur ses propres préférences ou aptitudes
(ex : "tu performes +18 pts en B2B vs B2C → profil analytique").

Origine des contenus : modules pédagogiques d'écoles partenaires (UCL,
Marketing, etc.) que Cap' transforme en mécaniques ludiques.
L'école n'a pas de dashboard ni d'admin actif : c'est un partenariat éditorial
pas opérationnel.

Règles fondamentales du brief :

- 1 à 3 termes techniques maximum dans tout le jeu
- Ces termes sont les plus représentatifs du métier ciblé
- Le joueur comprend les règles en moins de 2 minutes, sans tutoriel écrit
- La mécanique INCARNE la logique métier, elle ne l'illustre pas
- Pas de nom de jeu narratif (éviter "L'Aventure de…", "La Mission de…")
- Pas de personnage imposé, jeu abstrait ou avec contexte minimal
- Le jeu n'est pas jouable seul : il fait partie d'un module ordonné

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[C] DIRECTION ARTISTIQUE — FIXE, NE PAS MODIFIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Référence visuelle : https://cap-two-fawn.vercel.app/
Style général : Flat design, épuré, moderne, minimaliste
Typographie : Cohérente avec le site de référence
Icône / symbole plateforme : Ampoule (progression, XP, badges)
Couleur dominante du module: variation par domaine (le GDD doit proposer une
palette cohérente avec le module ciblé)
Stack technique : Next.js 15 App Router, TypeScript strict,
TailwindCSS, @dnd-kit (sauf si pointer events
natifs justifiés comme MappingConcurrentiel)
Accessibilité : Tout doit être jouable au clavier ET à la souris ;
contraste WCAG AA minimum

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[D] DOCTRINE GAME DESIGN — FIXE, NE PAS MODIFIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Référence canonique : docs/game-design-knowledge.md (12 anti-patterns numérotés)

Anti-patterns à éviter absolument :
#1 Tutoriel-écrit — "lis ces 6 paragraphes avant de jouer"
#2 Wrapper de cours — slides + QCM final
#3 Faux choix — toutes les options mènent au même résultat
#4 Lore-dump — narration imposée qui retarde le jeu
#5 Tâcheronnage — répétition mécanique sans courbe d'apprentissage
#6 Wrapper QCM déguisé — drag & drop qui n'est qu'un QCM avec animation
#7 One-size-fits-all — même mécanique pour tous les concepts métier
#8 Failure design pauvre — "raté" sans pédagogie
#9 Boucle ouverte — pas de fermeture émotionnelle à la fin
#10 Métrique vide — score affiché sans signification métier
#11 Verbe abstrait — l'action ne correspond à aucun verbe métier réel
#12 Surface cosmétique — habillage métier collé sur une mécanique générique

Golden standards à étudier avant de proposer une mécanique :

A. components/games/StatutQuiz (UCL, decision tree)

- Incarne le travail du conseil juridique
- Failure design riche : chaque mauvaise réponse explique POURQUOI ce
  statut juridique ne convient pas à ce profil d'entrepreneur
- 3 termes techniques exactement : SARL, SASU, micro-entreprise
- Joueur comprend en 60 secondes par observation directe

B. components/games/MappingConcurrentiel (Marketing, drag 2D continu)

- Incarne le positionnement concurrentiel
- Pointer events natifs (pas @dnd-kit) car le jeu exige un drag continu
  dans un plan 2D, pas un drop sur une zone discrète
- Failure design : les marques mal placées révèlent une tension de
  positionnement réelle observable

Règles de sélection de mécanique :

- Si le verbe métier est "trier / classer" → drag-sort triade Pool/Zone/Card
- Si le verbe métier est "décider entre options exclusives" → decision tree
  (cf. StatutQuiz)
- Si le verbe métier est "positionner dans un espace continu" → drag 2D
  pointer events (cf. MappingConcurrentiel)
- Si le verbe métier est "diagnostiquer / arbitrer" → mécanique à inventer,
  ne PAS retomber sur drag-sort par défaut (anti-pattern #7)
- Si tu hésites → propose 2 mécaniques distinctes et laisse le choix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[E] STRUCTURE DU GDD À PRODUIRE — FIXE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Le fichier GDD.md final doit contenir, dans cet ordre, ces sections :

1. INTENTION
   - Le ressenti cible (1 phrase, reprise et affinée depuis [A])
   - Le moment de bascule métier (1 phrase)
   - Le verbe métier incarné (1 mot ou expression courte)

2. MÉCANIQUE
   - Description en 5 lignes maximum
   - Justification : pourquoi cette mécanique INCARNE le verbe métier
     (et n'est pas une illustration)
   - Anti-patterns évités (cite les numéros et explique brièvement)

3. INTERFACE
   - Description écran par écran, en prose courte
   - Composants UI principaux (sans pseudo-code, juste les noms)
   - Interactions souris ET clavier
   - États visuels (hover, drag, drop, valid, invalid, success, fail)

4. CONTENU PÉDAGOGIQUE
   - Liste des 1 à 3 termes techniques retenus, avec définition courte
   - Liste des items de jeu (cartes, questions, profils, etc.) avec leurs
     attributs métier — propose 6 à 12 items minimum pour qu'il y ait
     du replay value

5. SCORING & FEEDBACK
   - Comment le score est calculé
   - Quelle métrique métier le score représente vraiment (anti-pattern #10)
   - Comment le feedback est rendu en cours de partie
   - Comment le résultat final est rendu (texte, ratio, badge, etc.)

6. FAILURE DESIGN
   - Qu'est-ce qu'une erreur dans ce jeu
   - Comment chaque type d'erreur enseigne quelque chose
   - Pas de "Mauvaise réponse" sec — toujours du POURQUOI

7. FERMETURE ÉMOTIONNELLE
   - Quel insight le joueur emporte (1 phrase, du type "tu as un profil X")
   - Comment la fin est mise en scène pour faire ressentir cet insight

8. IMPLÉMENTATION
   - Stack confirmée (Next.js / TS / Tailwind / dnd-kit OU pointer events)
   - Composants partagés à utiliser (depuis components/games/shared/ s'ils
     existent ; sinon proposer ce qui devrait y être ajouté)
   - Estimation effort (en heures de dev pour un proto jouable)
   - Tests à prévoir (Vitest + Playwright)

9. QUESTIONS OUVERTES
   - Toute zone d'ombre que TOI tu ne peux pas trancher seul
   - Toute hypothèse que tu as faite et qui mériterait validation humaine

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[F] LIVRABLE FINAL ATTENDU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

À la fin tu me retournes :

1. Le contenu COMPLET du GDD.md (en bloc markdown)
2. Le chemin où le sauvegarder : components/games/<ComposantPascalCase>/GDD.md
3. Une note de 3-5 lignes :
   - Mécanique choisie et pourquoi
   - Anti-patterns que tu as évité de justesse (et comment)
   - Risques que tu vois pour l'implémentation
4. Les questions ouvertes de la section 9 du GDD, listées séparément pour
   que je puisse les trancher en discussion avant le code

NE PAS écrire de code TypeScript. NE PAS créer le composant React.
NE PAS toucher à des fichiers autres que le GDD.md cible.

C'est parti.
