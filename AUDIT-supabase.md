# 🗄️ AUDIT-supabase.md — Dette backend/data Cap'

**Date :** 28 avril 2026
**Source :** Audit complet de la base Supabase Cap' (projet `mezopkxhuvstizcczhvj`, branche `main` PRODUCTION)
**Méthode :** 6 requêtes d'inventaire (colonnes, RLS, triggers, FK, index, volumétrie) + analyse croisée avec le modèle business Cap'

Ce document liste la dette **backend & data** de Cap'. Pour la dette technique frontend voir `AUDIT.md`. Pour la dette gameplay voir `AUDIT-product.md`.

**Statut courant :** 4 critiques, **10** importants (était 11), **8** mineurs (était 6). Base saine en données (5 lignes total, pré-launch) mais structure fragile.

---

## 📊 Volumétrie actuelle

| Table        | Lignes             |
| ------------ | ------------------ |
| profiles     | 2                  |
| game_results | 2 (dont 1 anonyme) |
| leads        | 1                  |

**Conséquence :** fenêtre idéale pour refondre le schema sans contrainte de migration data.

---

## 🔴 Critiques

### C-DB-1 — Aucune foreign key dans la base

**Tables concernées :** toutes
**Diagnostic :** la requête d'inventaire FK retourne 0 ligne. Aucune contrainte référentielle n'existe entre `profiles`, `game_results`, `leads` et `auth.users`.
**Risque concret :**

- Profils orphelins possibles si user supprimé
- game_results pointant vers des user_id inexistants (silencieux)
- Inserts arbitraires non détectés
  **Sortie :** `ALTER TABLE` pour ajouter :
- `profiles.id` → `auth.users(id) ON DELETE CASCADE`
- `game_results.user_id` → `auth.users(id) ON DELETE SET NULL`
- (à venir) FK vers nouvelles tables `games` et `families`
  **Effort :** S (5 min, données saines vérifiées : 0 orphelin)

### C-DB-2 — RLS policies scopées sur `{public}` au lieu de `{authenticated}`

**Tables concernées :** profiles (3 policies), game_results (2 policies)
**Diagnostic :** toutes les policies utilisent `roles = {public}` qui inclut anon ET authenticated. Fonctionnellement OK aujourd'hui (les conditions `auth.uid() = ...` filtrent), mais sémantiquement faux et fragile.
**Risque concret :** un refactor des conditions peut ouvrir un trou de sécurité accidentel.
**Sortie :** scoper chaque policy au rôle qui doit vraiment y avoir accès (`authenticated`, ou mix `{anon, authenticated}` pour `game_results insert`).
**Effort :** S (10 min, ré-écriture mécanique des CREATE POLICY)

### C-DB-3 — Aucune policy SELECT sur `leads`

**Diagnostic :** RLS activée + 0 policy SELECT = personne ne peut lire les leads via les clés `anon` ou `authenticated`. La lecture passe forcément par `service_role` (bypass RLS).
**Risque concret :** angle mort business confirmé en audit — Cap' ne lit pas ses leads aujourd'hui. Toute opportunité de partenariat école potentiellement ratée.
**Sortie :** créer policy SELECT scopée admin (cf. C-DB-4 pour la fonction `is_admin()`).
**Effort :** S (5 min, dépend de C-DB-4)

### C-DB-4 — Pas de logique d'admin en base

**Diagnostic :** aucun moyen d'avoir un dashboard admin Cap' fonctionnel en restant côté frontend. Tout passe par `service_role` côté serveur, manuel.
**Sortie :** créer la fonction `public.is_admin()` qui lit le claim JWT `app_metadata.role = 'cap_admin'`. Pattern Supabase recommandé (non-récursif, performant, extensible).
**Promotion admin manuelle :**

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "cap_admin"}'::jsonb
WHERE email = 'email-admin@cap.app';
```

**Effort :** M (30 min : fonction + policies admin sur 3 tables + tests)

---

## 🟠 Importants

### I-DB-1 — `game_results.game_id` en text libre

Risque de fragmentation des données ("EntrepriseExplorer" / "entreprise_explorer" / "entreprise-explorer" comptés comme 3 jeux différents en analytics).
**Sortie :** créer table de référence `games` (id text PK, title, family_id FK, source_school, source_module, access_mode, is_active, display_order, created_at) + FK `game_results.game_id → games.id`.
**Effort :** M

### I-DB-2 — `game_results.family_id` en text libre

Même problème de fragmentation. Pas d'énum ni de table de référence.
**Sortie :** créer table de référence `families` (id text PK, title, description) + FK `game_results.family_id → families.id`.
**Effort :** S (à grouper avec I-DB-1)

### I-DB-3 — `profiles.role` en text libre

Risque sécurité : un rôle écrit "Lyceen" au lieu de "lyceen" peut faire échouer silencieusement les RLS futures.
**Sortie :** énum Postgres strict (`CREATE TYPE user_role AS ENUM ('lyceen', 'etudiant_sup', 'cap_admin')`) + ALTER COLUMN.
**Migration data :** avant ALTER COLUMN, `UPDATE profiles SET role = 'etudiant_sup' WHERE role = 'diplome'` (1-2 lignes en base).
**UI mapping :** le frontend mappera vers "Lycéen", "Étudiant sup'", "Cap' admin" via un dictionnaire `ROLE_LABELS` (apostrophes / accents restent côté UI, valeurs SQL propres).
**Effort :** S (5 min, 2 lignes en base à vérifier)

### I-DB-4 — Tables de référence `games` et `families` absentes

Le modèle business Cap' (jeux issus de modules de différentes écoles, attribution éditoriale) n'est pas matérialisé en base.
**Sortie :** créer les 2 tables avec colonnes `source_school` et `source_module` sur `games` pour matérialiser l'attribution école.
**Effort :** M (couvert par I-DB-1)

### I-DB-5 — `profiles.school_name` manquant

Aucun lien entre un lycéen et son lycée d'origine. Bloque le futur pilotage des partenariats école.
**Sortie :** ajouter colonne `profiles.school_name TEXT NULLABLE`. Plus tard, table `schools` séparée si pertinent.
**Effort :** S

### I-DB-6 — `handle_new_user` sans exception handling

Si la fonction plante (role manquant, contrainte violée), tout le signup rollback avec une erreur cryptique.
**Sortie :** wrap dans `BEGIN EXCEPTION WHEN OTHERS THEN ... RETURN NEW`.
**Effort :** S

### I-DB-7 — Colonnes `profiles` mort-nées : `first_name`, `last_name`, `niveau`

**Diagnostic :** l'audit code frontend (29 avril 2026) confirme que ces 3 colonnes ne sont **jamais écrites** par le code app. Le formulaire signup (`app/login/page.tsx`) demande email + password uniquement, sans `options.data`. L'onboarding upsert (`app/onboarding/page.tsx`) ne touche que `id` + `role` + `updated_at`. Conséquence : ces 3 colonnes sont **mortes** en base — toujours `NULL` à vie pour chaque user.
**Sortie :** **DROP** les 3 colonnes (`ALTER TABLE profiles DROP COLUMN first_name, DROP COLUMN last_name, DROP COLUMN niveau`). Si onboarding enrichi devient un besoin futur, recréer les colonnes proprement avec le code frontend qui les écrit dès le départ.
**Effort :** S (3 ALTER TABLE DROP COLUMN, données 0 ligne à migrer)

### I-DB-8 — `handle_new_user` n'a pas de default sur `role`

Quand on aura passé `profiles.role` en NOT NULL + énum strict (cf. I-DB-3), un signup sans `role` dans metadata plantera.
**Sortie :** `COALESCE(new.raw_user_meta_data ->> 'role', 'lyceen')`.
**Note :** le frontend ne passe rien dans `options.data` au signup, donc le `COALESCE` tombera **systématiquement** sur `'lyceen'`. C'est OK : l'onboarding mettra à jour le rôle ensuite. Le default sert juste à ne pas planter si NOT NULL est appliqué à `role`.
**Effort :** S (à grouper avec I-DB-6)

### I-DB-9 — Pas de policy DELETE sur `profiles` et `leads`

Conformité RGPD : un user ne peut pas supprimer son compte/données via RLS standard. Force un script admin manuel pour chaque demande.
**Sortie :** policies DELETE scopées (`auth.uid() = id OR is_admin()` sur profiles, `is_admin()` sur leads).
**Effort :** S (à grouper avec C-DB-4)

### I-DB-10 — Pas de policy UPDATE/DELETE sur `game_results`

Décision actée : `game_results` est immutable (pas d'UPDATE jamais). DELETE pour user (RGPD) et admin (cleanup).
**Sortie :** policy DELETE uniquement (`auth.uid() = user_id OR is_admin()`).
**Effort :** S (à grouper avec C-DB-4)

---

## 🟡 Mineurs

### M-DB-1 — Pas de trigger `BEFORE UPDATE` sur `profiles` pour `updated_at`

La colonne existe mais ne sera jamais mise à jour automatiquement → elle ment.
**Sortie :** créer trigger générique `set_updated_at()` réutilisable sur toutes les tables avec une colonne `updated_at`.
**Effort :** S

### M-DB-2 — `profiles.id` sans default expliqué

Volontaire (id vient du trigger qui copie `auth.users.id`), mais à documenter par un commentaire SQL `COMMENT ON COLUMN`.
**Effort :** S

### M-DB-3 — `game_results.enjoyment / score / duration_ms` nullable sans documentation

Probablement parce que tous les jeux ne calculent pas tous les champs. À documenter.
**Sortie :** `COMMENT ON COLUMN` pour chaque champ nullable.
**Effort :** S

### M-DB-4 — Index manquant `leads.contact_email`

Pour futur dashboard admin "rechercher un lead par email".
**Sortie :** `CREATE INDEX leads_email_idx ON leads (contact_email)`.
**Effort :** S

### M-DB-5 — Index manquant `profiles.role`

Pour analytics par segment (combien de lycéens, étudiants…).
**Sortie :** `CREATE INDEX profiles_role_idx ON profiles (role)`.
**Effort :** S

### M-DB-6 — `device_id` pour sessions anonymes manquant

Permettrait de relier plusieurs sessions du même joueur anonyme.
**Sortie :** ajouter colonne `game_results.device_id TEXT NULLABLE`. Logique de génération côté frontend (UUID local persistant).
**Effort :** S (priorité basse, "si possible mais pas critique" actée)

### M-DB-7 — Reads `profiles` sans gestion d'erreur côté frontend

**Diagnostic :** 3 lectures silencieuses dans le code frontend, identifiées par l'audit code du 29 avril 2026 :

- `app/login/page.tsx:62` — `.select('role')` post-auth
- `app/hub/page.tsx:36` — `.select('*')`
- `app/onboarding/page.tsx:34` — `.select('role')` gate check

L'erreur est destructurée mais ignorée (`const { data } = await ...`, pas de `, error`). Si la query plante (RLS, latence, row inexistante), `data = null` et le user est redirigé silencieusement vers `/onboarding` ou bloqué.
**Sortie :** ajouter `, error` à chaque destructuration, gérer explicitement (afficher message coral + log console + retour state error). Pattern existe déjà dans onboarding upsert et login signUp.
**À inclure dans :** la session migration corrective (Étape 4 sync code repo).
**Effort :** S (~1 h, ~30 lignes touchées sur 3 fichiers)

### M-DB-8 — Filet de sécurité implicite via upsert onboarding

**Diagnostic :** l'upsert dans `/onboarding` (l. 70) fait INSERT si la row `profiles` n'existe pas, UPDATE sinon. Conséquence : même si le trigger `handle_new_user` plante (cas du finding I-DB-6), l'upsert d'onboarding crée la row à la volée. **Sécurité accidentelle, pas par design.**
**Sortie :** documenter explicitement ce filet via un commentaire SQL sur le trigger `handle_new_user` ET un commentaire TS dans `app/onboarding/page.tsx`. Pas de changement de code, juste rendre l'intention explicite.
**Effort :** S (10 min)

---

## 📋 Plan de résolution ordonné

Toute la résolution se fait en **une seule session** (~5h), parce que les modifications sont imbriquées et la base est vide. Pas d'avantage à découper.

### Étape 1 — Préalables ✅ FAIT — audit frontend signup réalisé le 29 avril 2026

**Findings de l'audit frontend** (3 décisions actées) :

- **DROP les colonnes mort-nées** `first_name`, `last_name`, `niveau` — le frontend ne les écrit jamais (cf. I-DB-7).
- **Énum role = `('lyceen', 'etudiant_sup', 'cap_admin')`** — naming aligné sur la cible Cap' réelle (lycéens + étudiants supérieur). UI mappera via dictionnaire `ROLE_LABELS` (cf. I-DB-3).
- **Inclure le refactor des 3 reads silencieux** (`profiles.select` sans gestion d'erreur dans login/hub/onboarding) dans la session migration corrective (cf. M-DB-7).

### Étape 2 — Migration corrective SQL (2h)

Ordre d'exécution important (dépendances) :

0. **Migration data** : `UPDATE profiles SET role = 'etudiant_sup' WHERE role = 'diplome'` (cf. I-DB-3, à faire AVANT l'ALTER COLUMN énum)
1. Créer fonction `is_admin()` (C-DB-4)
2. Créer trigger générique `set_updated_at()` (M-DB-1)
3. Créer énum `user_role` (I-DB-3)
4. Créer tables `families` puis `games` (I-DB-1, I-DB-2, I-DB-4)
5. ALTER `profiles` : énum role + `school_name` + commentaires (I-DB-3, I-DB-5, M-DB-2)
6. **5.bis** — DROP COLUMN `first_name`, `last_name`, `niveau` (résout I-DB-7 reformulé)
7. ALTER `game_results` : FK + `device_id` + commentaires (C-DB-1, M-DB-3, M-DB-6)
8. Ré-écrire `handle_new_user` avec exception handling + COALESCE default (I-DB-6, I-DB-8) + commentaire SQL documentant le filet de sécurité onboarding (M-DB-8)
9. Réécrire toutes les policies RLS (C-DB-2, C-DB-3, I-DB-9, I-DB-10)
10. Ajouter index manquants (M-DB-4, M-DB-5)

### Étape 3 — Promotion admin (5 min)

- Run SQL manuel sur ton compte pour `app_metadata.role = 'cap_admin'`
- Logout/login pour rafraîchir le JWT
- Tester qu'`is_admin()` retourne `true`

### Étape 4 — Sync code repo (1h)

- Aligner `supabase/schema.sql` sur la nouvelle prod (résout AUDIT.md C1)
- Régénérer les types TS Supabase
- **Refactor des 3 reads `profiles` avec gestion d'erreur** dans login/hub/onboarding (résout M-DB-7)
- **Ajouter `ROLE_LABELS` dictionnaire** dans `types/database.ts` ou un fichier dédié pour mapper les valeurs SQL (`'lyceen'`, `'etudiant_sup'`, `'cap_admin'`) vers UI ("Lycéen", "Étudiant sup'", "Cap' admin")
- **Mettre à jour `app/onboarding/page.tsx`** pour utiliser `'etudiant_sup'` au lieu de `'diplome'` + ajouter commentaire TS sur l'upsert documentant le filet de sécurité (M-DB-8)
- Adapter le code frontend si le contrat signup a changé

### Étape 5 — Tests de non-régression (30 min)

- Signup d'un user test → vérifier création du profile complet
- Insertion `game_result` anonyme + loggé → vérifier policies
- Suppression user test → vérifier ON DELETE CASCADE/SET NULL
- Ajout d'un lead via form public → vérifier insert OK
- Lecture leads en tant qu'admin → vérifier `is_admin()` fonctionne

**Total estimé :** ~4h30 (5h avec marge)

---

## 🎯 Décisions architecturales actées

Pour traçabilité dans le temps :

| Décision                                                                      | Justification                                                                                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `game_results` immutable (pas d'UPDATE)                                       | Événements passés, audit trail naturel, analytics propres                                                                           |
| Admin via JWT claim `app_metadata.role`                                       | Pattern Supabase recommandé : non-récursif, performant, extensible                                                                  |
| Modèle hybride anonymous/loggé en `game_results.user_id NULLABLE`             | Validé : libre-service ouvert, modules école nécessitent compte                                                                     |
| Pas de notion de "programme école" en DB                                      | Modèle business : attribution éditoriale uniquement, pas pilotage tech                                                              |
| FK avec `ON DELETE CASCADE` sur profiles, `SET NULL` sur game_results.user_id | RGPD-friendly : suppression user = suppression profile, mais préserve analytics anonymisées                                         |
| Colonnes `profiles` mort-nées DROPées (`first_name`, `last_name`, `niveau`)   | Schema doit refléter ce que le frontend fait réellement, pas une intention abandonnée                                               |
| Énum role = `('lyceen', 'etudiant_sup', 'cap_admin')`                         | Aligne sur cible Cap' réelle (lycéens + étudiants sup) plutôt que `diplome` trop restrictif                                         |
| UI mapping via dictionnaire `ROLE_LABELS`                                     | Permet d'afficher "Lycéen", "Étudiant sup'", "Cap' admin" tout en gardant des valeurs SQL propres (pas d'apostrophe, pas d'accents) |

---

## 🔗 Cross-références

- **AUDIT.md C1** (schema.sql désynchronisé) → résolu par Étape 4 du plan ci-dessus
- **Audit frontend signup** : effectué le 29 avril 2026, résultats intégrés dans les findings I-DB-3, I-DB-7, I-DB-8, M-DB-7, M-DB-8
- **AUDIT-product.md** → indépendant, peut avancer en parallèle
- **CLAUDE.md** → à mettre à jour après migration pour référencer le nouveau modèle de données

---

_Audit clos le 28 avril 2026. Prochaine action : valider ce document, puis enchaîner sur le préalable signup-frontend (Étape 1) avant la session migration corrective._
