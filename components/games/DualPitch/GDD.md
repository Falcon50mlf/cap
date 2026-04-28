# GDD — Dual Pitch

> Famille **Marketing** · concept : différencier marketing B2B vs B2C
> Statut : proposition GDD, non implémenté.

## 1. Player fantasy

Tu es **brand strategist d&rsquo;une marque hybride** qui doit livrer deux campagnes en parallèle pour le même produit : une pour des **acheteurs pro** (entreprises clientes) et une pour des **consommateurs finaux**. Le DAF te file un budget unique, charge à toi de le diviser intelligemment.

> Pas "élève qui fait un quiz B2B/B2C". L&rsquo;asymétrie des deux campagnes est le drame du jeu.

## 2. Core verb

**Équilibrer** (deux campagnes miroir à partir d&rsquo;un pool partagé)

Pas "trier" : si c&rsquo;était juste "drag chaque item dans le bon bucket", on tomberait dans un quiz déguisé. **Équilibrer** implique un trade-off (canaux/messages partagés, budget commun, certains items fonctionnent pour les 2, certains sont exclusifs).

## 3. Educational goal

À la fin du jeu, le joueur doit avoir intériorisé que B2B et B2C ne sont pas deux étiquettes mais **deux logiques différentes** :

- **Cycle de décision** : long & multi-stakeholder (B2B) vs court & individuel (B2C)
- **Levier dominant** : ROI / cas client / démo (B2B) vs émotion / aspiration / preuve sociale (B2C)
- **KPI clés** : pipeline / coût d&rsquo;acquisition / LTV (B2B) vs reach / brand awareness / conversion taux (B2C)
- **Canaux** : LinkedIn / salons pro / content long-form (B2B) vs TikTok / Insta / TV / retail (B2C)
- **Ton & créa** : sobre, factuel, chiffré (B2B) vs émotionnel, lifestyle, percutant (B2C)
- **Allocation budget typique** : few hauts coûts (B2B) vs many petits coûts (B2C)

Le joueur ne doit pas mémoriser ces points : il doit les **éprouver** par les conséquences de ses choix.

## 4. Aesthetic goals (1-2 parmi MDA)

1. **Discovery** — Découvrir comment une vraie marque (Slack, Microsoft, HP) parle à deux mondes en parallèle. Ce n&rsquo;est pas évident pour un lycéen.
2. **Expression** — Le profil "personnalité marketing" du joueur se construit silencieusement en multi-runs : tu performes mieux côté B2B (analytique) ou côté B2C (émotionnel) ? Cap&rsquo; te le dit à la fin → reflète au lycéen son propre câblage cognitif.

Anti-Cap&rsquo; explicitement écarté : Challenge pur ("avoir 100%"). Si on tombe là-dedans, on a perdu.

## 5. Mechanic (depuis le catalogue ou combinaison)

**Primaire** : **M02 — Build & Compose** (catalogue § M02, p.2)

- 2 emplacements de composition côte à côte (campagne B2B / campagne B2C)
- 4 slots par campagne : `Canal × Message × Visuel × KPI ciblé`
- Pool central de ~16 éléments (mix de purement-B2B, purement-B2C, et bivalents)

**Modifier 1** : **M10 — Live Preview** (catalogue § M10)

- À droite, deux **ad mockups** vivants qui se reconfigurent à chaque drag : copy + visuel + canal mockup (post LinkedIn vs reel TikTok). Le joueur voit le "ressenti" avant de commit.

**Modifier 2** : implicite **dualité miroir** (pas dans le catalogue — création originale)

- Les 2 compositions partagent un budget commun (slider entre les 2). Allouer trop à un côté affame l&rsquo;autre.
- Quelques items sont **exclusifs** (un visuel "ROI dashboard" ne passe pas en B2C, un visuel "lifestyle plage" ne passe pas en B2B). D&rsquo;autres sont **bivalents mais pas équivalents** (LinkedIn marche un peu en B2C jeune, Instagram marche un peu en B2B créatif).

**Pourquoi cette combinaison plutôt que M01 Drag & Sort** : le tri pur en 2 buckets (B2B/B2C) serait un quiz déguisé (anti-pattern § Anti-Cap&rsquo;). M02 + dualité miroir incarne le concept : _gérer deux audiences en parallèle, c&rsquo;est exactement ce qu&rsquo;est le marketing pour une marque hybride_. La mécanique ≡ le concept.

**Pourquoi pas M03 Predict & Reveal** : c&rsquo;est tentant ("prédis le CTR de ta campagne B2B") mais ça met l&rsquo;accent sur le _résultat chiffré_, pas sur la _compréhension de logique_. À garder pour un futur jeu Marketing Analytics.

## 6. Tension source

Trois tensions qui se renforcent :

1. **Ressource rare** : un budget unique à partager entre les 2 campagnes. Pas de "fais 100% des deux".
2. **Items exclusifs** : tu ne peux pas réutiliser le même visuel ou message dans les deux. Choisir B2B ici = renoncer à l&rsquo;option côté B2C.
3. **Cohérence de marque** : les 2 campagnes doivent quand même venir de la même marque. Si le ton est totalement opposé (sobre VS criard), un score bonus de "brand consistency" sanctionne.

→ Pas de timer. La tension vient des **trade-offs**, pas du chrono. Cohérent avec Cap&rsquo; (lycéen qui découvre, pas adulte qui performe).

## 7. Mastery curve

**3 manches** de difficulté croissante :

1. **Oasis** (B2C pur) — la "campagne B2B" est volontairement triviale (ex: HoReCa, vente aux distributeurs). Le joueur découvre l&rsquo;asymétrie. Difficulté : low.
2. **Salesforce** (B2B pur) — la campagne B2C est un programme de recommandation employé. Le joueur sent l&rsquo;envers de l&rsquo;asymétrie. Difficulté : low.
3. **Slack** (B2B + B2C hybride réel) — le **vrai** dilemme. Slack vend aux DSI ET séduit les individuels via free tier. Les deux campagnes ont des stakes égaux. Difficulté : high.

La courbe va de "lecture du modèle" → "exécution du modèle" → "navigation du modèle dans une vraie ambiguïté". Reconnaissance de patterns + transfert (cf. § Spécificités gamification éducative dans `game-design-knowledge.md`).

## 8. Failure design

**Aucun écran "tu as perdu"**. Quand un choix est sub-optimal :

- L&rsquo;ad mockup live affiche un effet visuel d&rsquo;**inadéquation** : un texte "ROI 3.2x" sur un visuel beach-lifestyle TikTok = mismatch visible (texte qui sort de la bulle, désaccord visuel).
- Au scoring de fin de manche, breakdown par axe : "Canal : ✓ pertinent / Message : ✗ trop technique pour la cible — un consommateur ne lit pas un whitepaper" + lien vers le catalogue.
- Le joueur peut **rejouer la manche** sans pénalité — Cap&rsquo; n&rsquo;a pas d&rsquo;hearts Duolingo.
- Le mismatch enseigne par contraste, pas par punition (cf. checklist § "L&rsquo;échec enseigne quelque chose").

## 9. Win condition + closure

À la fin de la manche 3 (Slack), affichage :

1. **Score par campagne** : Efficacité B2B X/100, Efficacité B2C Y/100, Brand consistency Z/100 (3 jauges, pas un score unique)
2. **Real reveal** : "Voici ce que Slack a réellement fait en 2014" → 1 visuel d&rsquo;archive de leur campagne LinkedIn DSI ET 1 visuel de leur free-tier viral. Cap&rsquo; leur dit "regarde, ça ressemble à tes choix" ou "regarde, voici ce qui leur a différencié". (cf. § "Connecter aux enjeux du monde réel")
3. **Profil marketing** révélé pour la première fois : "Sur 3 manches, tu as performé +18 pts en B2B vs B2C. Profil émergent : _analytique_. À tester : Mix Marketing 4P, Mapping Concurrentiel."
4. Closure visuelle : les 2 ad mockups jouent leurs animations finales en parallèle. Cohérent avec la dualité (closure feedback § game-design-knowledge.md).

## 10. Game feel notes

- **Drag d&rsquo;un item bivalent** : il est neutre (couleur snow). En survol d&rsquo;un slot B2B il glisse vers `--pivot`, en survol B2C vers `--sun`. Couleur transitoire = signal d&rsquo;hésitation visible (anticipation, § game feel 7 invisibles).
- **Drop sur slot exclusif incompatible** : shake subtil + l&rsquo;item retourne dans le pool avec une petite tooltip "Whitepaper ROI ne parle pas à un consommateur final" (200ms easeOut, pas frustrant). Coral très bref.
- **Drop sur slot compatible** : pulse + petite particle burst couleur du slot (3-5 particules, < 400ms).
- **Slider budget** : déplacement = les 2 ad mockups changent de "scale visuel" (la campagne sous-budget devient plus petite, ghostée). Conséquence rendue physique.
- **Reveal de fin** : drumroll typographique (chiffres qui montent en mono) avant l&rsquo;affichage de la "vraie" campagne Slack. Spring physics, pas linéaire (§ game feel : `type: "spring", stiffness: 300, damping: 25`).
- **Tick audio** au drag start (50ms) — soutient la qualité perçue (§ game feel #5).
- **Microcopy Cap&rsquo;** partout : `// Campagne B2B`, `// Budget restant 1.2k€`, etc.

## 11. Replay value

Trois axes de relance :

1. **Manches** : 3 marques scriptées, mais chaque manche a 2 variantes du pool d&rsquo;éléments (16 items dont 8 changent → 50% de surface différente au relay).
2. **Hidden objective** : si tu fais ≥ 90 sur les 3 jauges de la manche 3 (Slack), debloquage d&rsquo;un mode "Marque libre" où le joueur entre lui-même un nom de marque (auto-entrepreneur, école, ONG…) et reconfigure ses 2 campagnes. Sandbox.
3. **Profil marketing évolutif** : à chaque relay, le delta B2B/B2C s&rsquo;affine. Récompense Discovery + Expression cumulative (§ aesthetic goals). Connecte le mini-jeu au reste de Cap&rsquo; (le profil pourrait servir de seed à d&rsquo;autres jeux Marketing dans le futur).

## 12. Anti-patterns check

| #   | Anti-pattern (§ game-design-knowledge.md) | Évité ?                                                                                                                 |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Points sans signification                 | ✅ Les 3 jauges sont des KPI marketing réels (efficacité, cohérence). Pas de XP gratuit.                                |
| 2   | Badge spam                                | ✅ 1 closure par run, pas de "✓ tu as drag !". Le profil marketing s&rsquo;affiche après 1 run complet.                 |
| 3   | Forced grinding                           | ✅ 3 manches choisies pour leur progression conceptuelle, pas pour faire durer.                                         |
| 4   | Punitive failure                          | ✅ Aucun reset de score. Rejouer une manche est gratuit.                                                                |
| 5   | Pay-to-win éducatif                       | ✅ N/A (pas de monétisation in-game).                                                                                   |
| 6   | Gamification comme wrapper                | ✅ La dualité miroir = la dualité B2B/B2C. La mécanique incarne le concept (cf. § Spécificités gamification éducative). |
| 7   | Difficulté one-size-fits-all              | ✅ 3 manches de difficulté croissante. Hidden Sandbox mode pour les achievers.                                          |

---

## Méta

**Cohérence avec la design checklist** (§ game-design-knowledge.md) — pré-validation :

- [x] Player fantasy clair en 5s : 2 campagnes côte à côte, c&rsquo;est lisible
- [x] Core verb identifiable : équilibrer / drag-build (visible immédiatement)
- [x] Première action dans les 10s : oui, drag dispo dès le mount
- [x] Feedback dans les 100ms : drag preview live (M10)
- [x] Difficulté progressive : 3 manches scriptées + Sandbox unlock
- [x] L&rsquo;échec enseigne : breakdown par axe, mismatches visibles
- [x] Progression visible : 3 jauges + budget restant à tout moment
- [x] Win condition satisfaisante : real reveal Slack + profil marketing
- [x] Replay value : 2 variantes par manche + Sandbox + profil cumulatif
- [x] ≥ 2 aesthetics : Discovery + Expression
- [x] Aucun anti-pattern : tableau ci-dessus
- [x] Incarne le concept : dualité miroir = dualité B2B/B2C
