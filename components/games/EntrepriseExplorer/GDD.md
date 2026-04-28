# GDD — EntrepriseExplorer

> Famille **Programmes / UCL Lille · Module Gestion d&rsquo;entreprise**
> Sous-module 01 — _Reconnaître une entreprise_
> Statut : **a posteriori** (jeu déjà implémenté, GDD reconstitué pour audit). Source : `components/games/EntrepriseExplorer.tsx` (436 l).

## 1. Player fantasy

Tu es **classificateur·rice INSEE** : un grand panneau d&rsquo;entreprises devant toi, et une grille de 3 critères pour les ranger. À chaque switch d&rsquo;onglet, tu changes de loupe (forme juridique → secteur → taille) et tu redécouvres les mêmes 12 entreprises sous un autre angle.

> Pas "élève qui fait son cours d&rsquo;éco". Le triple regard sur la même boîte est l&rsquo;identité du jeu.

## 2. Core verb

**Classifier** (sur 3 axes orthogonaux, en parallèle).

La spécificité par rapport à un tri simple : la même entité doit être placée trois fois (forme juridique × secteur × taille), donc le joueur doit se construire une représentation **multi-dimensionnelle** d&rsquo;une entreprise.

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé que **"reconnaître une entreprise" n&rsquo;est pas binaire** — c&rsquo;est positionner une entité dans 3 systèmes simultanés :

- **Forme juridique** (EI / SAS / SA / EPIC / SCOP) : qui porte le risque, comment se structure la gouvernance
- **Secteur d&rsquo;activité** (primaire / secondaire / tertiaire) : où la valeur est créée
- **Taille** (Micro / PME / ETI / GE) : ressources et complexité organisationnelle

Le joueur doit aussi se rendre compte que **deux boîtes de la même taille peuvent être radicalement différentes** (Doctolib SAS tertiaire ETI vs Le Creuset SAS secondaire ETI).

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Le joueur découvre la diversité réelle du tissu entrepreneurial français (SNCF EPIC, plombier indép. EI, coopérative SCOP). Cap&rsquo; § Spécificités : _"je découvre un univers"_.
2. **Challenge** secondaire — Le multi-axes ajoute une exigence de rigueur. Mais on évite que Challenge devienne dominant (anti-Cap&rsquo;).

Note de défense : le jeu évite **Submission** (on n&rsquo;est pas en flow détendu, il y a 36 placements à faire) et **Expression** (aucun input personnel — tu tries du factuel). C&rsquo;est volontairement plus "scolaire" que les autres jeux UCL, ce qui est cohérent avec un sous-module de fondamentaux.

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M01 — Drag & Sort** (catalogue § M01). Match parfait : "Verbe = classifier · Contenu adapté = tout ce qui a des catégories". L&rsquo;implémentation utilise bien `@dnd-kit/core` comme prescrit.

**Spécificité originale** : _Onglets multi-axes_ (3 axes successifs sur le même set d&rsquo;items). Pas dans le catalogue. C&rsquo;est l&rsquo;élément le plus distinctif de ce jeu et il **mérite d&rsquo;être ajouté au catalogue** comme variante "M01-multi" (cf. § Améliorations).

**Pas combiné avec** :

- M07 (Time pressure) : choix volontaire, l&rsquo;auteur a privilégié la réflexion sur la rapidité.
- M08 (Streak) : pas pertinent quand le score est validé en 1 fois à la fin.

## 6. Tension source

- **Charge cognitive** : 36 placements à faire (12 × 3) avant de pouvoir valider. Le compteur "X / 36" en bas est le seul rappel de progression.
- **Cas frontaliers** : les classifications "évidentes" (SNCF EPIC, boulanger EI Micro) sont nombreuses, mais quelques cases brouillent — Le Creuset = SAS tertiaire ou secondaire ? Doctolib = ETI ou GE ? Coopérative agricole = SCOP ou SARL ?
- **Pas de timer** — la tension est purement quantitative (progresser jusqu&rsquo;à 36) et qualitative (ne pas se tromper).

## 7. Mastery curve

**Faible**, par design — c&rsquo;est un module d&rsquo;**introduction**. Pas de progression de difficulté dans le jeu (1 manche unique, 12 entreprises figées). La maîtrise vient :

- À l&rsquo;intérieur d&rsquo;une session : reconnaissance accélérée à mesure que le joueur s&rsquo;approprie les classifications.
- Entre sessions : un re-run permet de tenter un score parfait (36/36) sans avoir à apprendre quoi que ce soit de neuf.

⚠️ Pas de variantes de contenu, pas de modes de difficulté. Vu comme une faiblesse en § Améliorations.

## 8. Failure design

- Pendant le placement : aucune validation immédiate. L&rsquo;erreur n&rsquo;existe que post-validation.
- Au moment de "Valider mes classements" (1500 ms après le clic via `setTimeout`) : les pills passent en **mint** (correct) ou **coral** (faux), avec icône Check/X. Pas de "score = 0/36 tu as échoué" — juste un % et un détail.
- **Aucune possibilité de re-placer après validation** (`disabled: validated` dans `useDraggable`). Le joueur ne peut que **quitter** ou attendre la modale shell de fin.
- Skills computées indépendamment du score : `analyse: 30 + score/3, rigueur: 25 + score/3` — le joueur récupère un floor minimal (30 + 0/3 = 30 si score nul). Cohérent avec § "Pas d&rsquo;états d&rsquo;échec qui punissent sans enseigner".

⚠️ Mais : **pas d&rsquo;explication "pourquoi c&rsquo;est faux"** — juste rouge/vert. Le joueur sait qu&rsquo;il a confondu mais pas pourquoi (cf. § game-design-knowledge.md "Montrer POURQUOI la mauvaise réponse est mauvaise"). Faiblesse réelle, traitée en § Améliorations.

## 9. Win condition + closure

- Validation possible **uniquement** quand `totalAxesPlaced === 36`. Bouton désactivé sinon avec libellé dynamique "Place encore N (sur 3 axes)".
- Au validate : score % calculé sur 36, animation de coloration des pills (1500 ms), puis appel à `shell.complete(skills, score, payload)` qui déclenche la modale rating à 5 étoiles du `GameShell`.
- Closure cap&rsquo; : la modale est **commune à tous les jeux UCL** (pas spécifique à EntrepriseExplorer). Pas de "real reveal" éducatif après coup, juste un score brut et le rating.

⚠️ Faiblesse — le closure est moins satisfaisant que recommandé § "Win condition satisfaisante (pas juste tu as 100%)". Le score brut est exactement ce que la checklist déconseille.

## 10. Game feel notes

Présents dans le code :

- ✅ Pills draggables : `opacity 0.4` pendant le drag (subtil mais ok)
- ✅ Drop zones : background passe de `night-soft` à `${ACCENT}10` au survol (légère teinte violette)
- ✅ Validation : `setTimeout(1500)` avant l&rsquo;appel `shell.complete` → laisse le temps de voir les couleurs
- ✅ DragOverlay (`@dnd-kit`) avec `boxShadow: 0 20px 40px ... + 0 0 16px ${ACCENT}` au pickup — game feel "weight"
- ✅ Microcopy mono `// Total placés (3 axes) : N / 36` — identité Cap&rsquo; respectée
- ✅ Apostrophe Cap&rsquo; : transparente via le shell

Manquants par rapport aux 7 invisibles (§ game feel) :

- ❌ Pas de **anticipation** au drag (scale 1.05 au pickup recommandé § M01) — uniquement opacity
- ❌ Pas de **particle burst** au drop correct (recommandé § M01 "Right drop = pulse ✓ + petite particle burst")
- ❌ Pas de **shake** au drop incorrect en temps réel (la validation est différée, donc cas non applicable mais ça manque)
- ❌ Pas d&rsquo;**audio cue**

## 11. Replay value

**Faible**. Aucun changement entre 2 sessions :

- 12 entreprises figées dans `COMPANIES`
- Pas de difficulté variable
- Pas de "marque libre" / sandbox
- Pas de hidden achievement

L&rsquo;unique levier de relay = obtenir 36/36 si raté la 1ère fois. C&rsquo;est minimal au regard de la design checklist § "Replay value existe".

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | Statut         | Justification                                                                                                                                                                                                                                                                     |
| --- | ----------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Évité       | Le score = % de bonnes classifications, lisible et fondé.                                                                                                                                                                                                                         |
| 2   | Badge spam                                | ✅ Évité       | 1 closure unique par run.                                                                                                                                                                                                                                                         |
| 3   | Forced grinding                           | ✅ Évité       | 36 placements c&rsquo;est borné, pas répétitif.                                                                                                                                                                                                                                   |
| 4   | Punitive failure                          | ✅ Évité       | Skills floor (30/25) garantis même à 0%. Pas de retry obligatoire.                                                                                                                                                                                                                |
| 5   | Pay-to-win éducatif                       | — N/A          | Pas de monétisation.                                                                                                                                                                                                                                                              |
| 6   | Gamification comme wrapper                | ⚠️ **Risque**  | Le tri pur est très proche d&rsquo;un quiz QCM déguisé. La nature multi-axes (3 lectures de la même entité) sauve partiellement, mais le joueur n&rsquo;a aucun feedback formatif pendant le placement → la mécanique vaut surtout par la répétition forcée du regard catégoriel. |
| 7   | Difficulté one-size-fits-all              | ⚠️ **Présent** | 1 seule manche, 12 boîtes figées, aucun mode débutant/expert. Un lycéen avancé sera sous-stimulé, un débutant pourra être perdu sur les frontaliers.                                                                                                                              |

---

## Méta — design checklist

| Item                            | Statut                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Player fantasy clair en 5s      | ⚠️ Le joueur comprend "tri" mais pas tout de suite "3 axes parallèles" — l&rsquo;onglet est subtil les 30 premières s. |
| Core verb identifiable          | ✅                                                                                                                     |
| Première action dans les 10s    | ✅ Drag dispo dès le mount.                                                                                            |
| Feedback dans les 100ms         | ⚠️ Drop zones glow OK ; mais pas de feedback "correct/incorrect" temps réel — différé à la validation.                 |
| Difficulté progressive ou modes | ❌                                                                                                                     |
| L&rsquo;échec enseigne          | ⚠️ Couleurs mint/coral montrent où mais pas pourquoi.                                                                  |
| Progression visible             | ✅ Compteur "N / 36" + chips d&rsquo;onglet "X/12".                                                                    |
| Win condition satisfaisante     | ⚠️ Juste un %. Pas de "real reveal".                                                                                   |
| Replay value                    | ❌                                                                                                                     |
| ≥ 2 aesthetics                  | ⚠️ Discovery clair, Challenge timide, autres absents.                                                                  |
| Aucun anti-pattern              | ⚠️ #6 partiel et #7 présent.                                                                                           |
| Incarne le concept              | ✅ Le multi-axes incarne bien le "3 critères" du sous-module.                                                          |

---

## Améliorations

### Mécaniques

1. **Problème** : 1 seule manche figée → mastery curve plate.
   **Proposition** : ajouter 2 manches de difficulté croissante. M2 = 12 entreprises moins évidentes (B Corp, GIE, mutuelle, fondation reconnue d&rsquo;utilité publique). M3 = "Marque libre" — l&rsquo;utilisateur entre un nom de boîte qu&rsquo;il connaît, le jeu lui demande de la classifier sans correction (juste un échange avec le bénévole familial).
   **Effort** : **M** (data + UI tabs Manche 1/2/3).

2. **Problème** : Le multi-axes onglets force le mode "lazy switch" — un joueur peut placer toutes les entreprises sur l&rsquo;axe `legal`, valider, puis switcher. Mais il oublie facilement qu&rsquo;il doit faire les 3 axes (le bouton libellé "Place encore N sur 3 axes" est l&rsquo;unique signal).
   **Proposition** : forcer un onglet "tour de chauffe" qui présente d&rsquo;abord 1 entreprise classifiée à 100% sur les 3 axes, en exemple. Ou : passer en mode "même entreprise sur les 3 axes en succession" plutôt qu&rsquo;onglets indépendants.
   **Effort** : **M**.

3. **Problème** : Le score est binaire (correct/incorrect par axe-entreprise). Aucune nuance pour les frontaliers (Le Creuset SAS secondaire vs tertiaire).
   **Proposition** : sur 3-4 entreprises ambigües, accepter 2 réponses correctes avec feedback "Les 2 sont défendables — voici pourquoi la communément retenue est X." Récompense la nuance.
   **Effort** : **S** (modifier le typage pour permettre `expected: T | T[]`).

### UX

1. **Problème** : Aucun feedback formatif pendant le placement (correct/incorrect révélé qu&rsquo;à la validation finale).
   **Proposition** : ajouter un mode opt-in "Aide" (toggle) qui affiche un ✓ subtil dès qu&rsquo;une pièce est correctement placée. Pour les joueurs qui veulent l&rsquo;échec final pur, le mode reste désactivable.
   **Effort** : **S**.

2. **Problème** : Le bouton libellé "Place encore N (sur 3 axes)" est trop technique, et le joueur ne sait pas quel axe il a fini ou pas.
   **Proposition** : montrer 3 mini-progress bars à côté des onglets (`legal: 12/12 ✓`, `sector: 8/12`, `size: 0/12`) — une vue d&rsquo;ensemble qui rend le multi-axes visible.
   **Effort** : **S**.

3. **Problème** : Reveal de fin = juste rouge/vert sur 36 pills. Aucun storytelling, aucun "real reveal" éducatif.
   **Proposition** : à la validation, afficher 1-2 cas frontaliers en grand avec explication ("Le Creuset est SAS secondaire. Pourquoi pas tertiaire ? Parce que la fonderie en France représente 80% de l&rsquo;activité.") avant la closure shell.
   **Effort** : **M**.

4. **Problème** : Tri sans timer ni urgence. Risque de **Submission** non assumée (le joueur traîne).
   **Proposition** : pas de timer, mais un "sablier symbolique" qui se vide sans pénalité, juste pour marquer un rythme conseillé (3-4 min).
   **Effort** : **S**.

### Qualité code

1. **Duplication avec PestelMatch et MixMarketing4P** : la triade `Pool / Zone / DraggableX / Pill` est répliquée à l&rsquo;identique dans les 3 jeux, avec `useDroppable`, états `isOver`, validation logic, etc. Lignes 244-289 (Zone) + 290-321 (Pool) + 323-345 (DraggableCompany) + 347-389 (CompanyPill) = ~145 lignes recomposables.
   **Proposition** : extraire `components/games/shared/{DragSortGame.tsx, Zone.tsx, Pool.tsx, DraggablePill.tsx}`. Cf. AUDIT.md § I8.
   **Effort** : **L** (touche 3 jeux, screenshot diff requis).

2. **Magic number `setTimeout(1500)`** ligne ~178 — pourquoi 1.5s ? Pas de constante nommée, pas de commentaire.
   **Proposition** : extraire `const REVEAL_DURATION_MS = 1500` en haut de fichier.
   **Effort** : **S**.

3. **Type `string` au lieu de `LegalForm | Sector | Size`** dans `Placements`. La généralisation `Partial<Record<Axis, string>>` perd l&rsquo;info typing par axe — le compilateur ne pourrait pas attraper un placement `{legal: 'Micro'}`.
   **Proposition** : `type Placements = Record<string, { legal?: LegalForm; sector?: Sector; size?: Size }>;`
   **Effort** : **S**.

4. **`COMPANIES` mélange majuscules/minuscules dans `legal/sector`** : `legal: 'EI'` (UPPER) vs `sector: 'tertiaire'` (lower). Inconsistant. Forcer un casing uniforme — UPPER pour tous (les 4 sont des constantes/sigles).
   **Effort** : **S**.

### Cohérence avec le catalog mechanics

- Le verbe **classifier** est dans `docs/game-mechanics-catalog.md` § M01 ✅
- Implémenté **partiellement conformément** au pattern :
  - ✅ `@dnd-kit/core` utilisé
  - ✅ Snap zones avec coloration `isOver`
  - ❌ "Items se soulèvent légèrement au grab (scale 1.05, shadow)" — non implémenté (juste `opacity: 0.4`)
  - ❌ "Right drop = pulse ✓ + petite particle burst" — non implémenté
  - ❌ "Wrong drop = shake subtil" — N/A car validation différée, mais le pattern catalog suppose validation temps réel
- **Variante non documentée** : _Multi-axes par onglets sur le même set d&rsquo;items_. À ajouter au catalogue comme **M01-b — Multi-axis Sort** (variante de M01).

### Anti-patterns présents

#### #6 — Gamification comme wrapper (⚠️ partiel)

- **Déclencheur** : la mécanique est très proche d&rsquo;un QCM "à quelle catégorie cette boîte appartient ?" répliqué 36 fois. Le drag&drop décore mais ne change pas fondamentalement le verbe (cocher / glisser sur la bonne case → équivalent cognitif).
- **Sortie minimale** : ajouter un **levier qui ne peut pas exister en QCM**. Exemples défendables :
  1. Permettre de **placer plusieurs entreprises au même endroit en simultané pour comparer** (drag-multi-select) — la spatialité devient porteuse.
  2. Faire de l&rsquo;**axe `size` un slider continu** (small ↔ large) au lieu d&rsquo;un bucket fixe : le joueur place sur un continuum visuel, score = proximité de la cible.
  3. Ajouter **un bénévole virtuel** qui réagit aux placements ("Doctolib en ETI, c&rsquo;est limite, ils approchent les 5000 salariés…") — narrative aesthetic.

#### #7 — Difficulté one-size-fits-all (⚠️ présent)

- **Déclencheur** : 1 manche unique, 12 entreprises figées, aucun choix de mode.
- **Sortie minimale** : 2 manches optionnelles débloquées après le 1er run (frontaliers + sandbox marque libre). Cf. § Mécaniques #1.
