# 🗄️ AUDIT-supabase.md — Dette backend/data Cap'

**Date :** 28 avril 2026
**Source :** Audit complet de la base Supabase Cap' (projet `mezopkxhuvstizcczhvj`, branche `main` PRODUCTION)
**Méthode :** 6 requêtes d'inventaire (colonnes, RLS, triggers, FK, index, volumétrie) + analyse croisée avec le modèle business Cap'

Ce document liste la dette **backend & data** de Cap'. Pour la dette technique frontend voir `AUDIT.md`. Pour la dette gameplay voir `AUDIT-product.md`.

**Statut courant :** 4 critiques, 11 importants, 6 mineurs. Base saine en données (5 lignes total, pré-launch) mais structure fragile.

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
**Sortie :** énum Postgres strict (`CREATE TYPE user_role AS ENUM ('lyceen', 'etudiant', 'cap_admin')`) + ALTER COLUMN.
**Effort :** S (5 min, 2 lignes en base à vérifier)

### I-DB-4 — `profiles.niveau` en text libre

Niveau scolaire devrait être un set fini (2nde, 1ere, tale, bac+1, bac+2).
**Sortie :** énum Postgres strict (`CREATE TYPE niveau_scolaire AS ENUM (...)`) + ALTER COLUMN.
**Effort :** S

### I-DB-5 — Tables de référence `games` et `families` absentes

Le modèle business Cap' (jeux issus de modules de différentes écoles, attribution éditoriale) n'est pas matérialisé en base.
**Sortie :** créer les 2 tables avec colonnes `source_school` et `source_module` sur `games` pour matérialiser l'attribution école.
**Effort :** M (couvert par I-DB-1)

### I-DB-6 — `profiles.school_name` manquant

Aucun lien entre un lycéen et son lycée d'origine. Bloque le futur pilotage des partenariats école.
**Sortie :** ajouter colonne `profiles.school_name TEXT NULLABLE`. Plus tard, table `schools` séparée si pertinent.
**Effort :** S

### I-DB-7 — `handle_new_user` sans exception handling

Si la fonction plante (role manquant, contrainte violée), tout le signup rollback avec une erreur cryptique.
**Sortie :** wrap dans `BEGIN EXCEPTION WHEN OTHERS THEN ... RETURN NEW`.
**Effort :** S

### I-DB-8 — `handle_new_user` ne copie que `id` et `role`

Les champs `first_name`, `last_name`, `niveau` ne sont jamais copiés depuis `raw_user_meta_data`. Probablement complétés par UPDATE post-signup côté frontend.
**Préalable :** auditer le code frontend signup (`supabase.auth.signUp(...)`) pour voir le contrat actuel.
**Sortie :** étendre le trigger pour copier tous les champs disponibles dans metadata, avec defaults sûrs (`COALESCE`).
**Effort :** S (mais dépend d'une décision contrat frontend ↔ trigger)

### I-DB-9 — `handle_new_user` n'a pas de default sur `role`

Quand on aura passé `profiles.role` en NOT NULL + énum strict (cf. I-DB-3), un signup sans `role` dans metadata plantera.
**Sortie :** `COALESCE(new.raw_user_meta_data ->> 'role', 'lyceen')`.
**Effort :** S (à grouper avec I-DB-7)

### I-DB-10 — Pas de policy DELETE sur `profiles` et `leads`

Conformité RGPD : un user ne peut pas supprimer son compte/données via RLS standard. Force un script admin manuel pour chaque demande.
**Sortie :** policies DELETE scopées (`auth.uid() = id OR is_admin()` sur profiles, `is_admin()` sur leads).
**Effort :** S (à grouper avec C-DB-4)

### I-DB-11 — Pas de policy UPDATE/DELETE sur `game_results`

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

---

## 📋 Plan de résolution ordonné

Toute la résolution se fait en **une seule session** (~5h), parce que les modifications sont imbriquées et la base est vide. Pas d'avantage à découper.

### Étape 1 — Préalables (30 min)

- Auditer le code frontend signup pour clarifier le contrat metadata (cf. I-DB-8)
- Décider du contrat final : tous les champs au signup vs progressive

### Étape 2 — Migration corrective SQL (2h)

Ordre d'exécution important (dépendances) :

1. Créer fonction `is_admin()` (C-DB-4)
2. Créer trigger générique `set_updated_at()` (M-DB-1)
3. Créer énums `user_role`, `niveau_scolaire` (I-DB-3, I-DB-4)
4. Créer tables `families` puis `games` (I-DB-1, I-DB-2, I-DB-5)
5. ALTER `profiles` : énums + `school_name` + commentaires (I-DB-3, I-DB-4, I-DB-6, M-DB-2)
6. ALTER `game_results` : FK + `device_id` + commentaires (C-DB-1, M-DB-3, M-DB-6)
7. Ré-écrire `handle_new_user` (I-DB-7, I-DB-8, I-DB-9)
8. Réécrire toutes les policies RLS (C-DB-2, C-DB-3, I-DB-10, I-DB-11)
9. Ajouter index manquants (M-DB-4, M-DB-5)

### Étape 3 — Promotion admin (5 min)

- Run SQL manuel sur ton compte pour `app_metadata.role = 'cap_admin'`
- Logout/login pour rafraîchir le JWT
- Tester qu'`is_admin()` retourne `true`

### Étape 4 — Sync code repo (1h)

- Aligner `supabase/schema.sql` sur la nouvelle prod (résout AUDIT.md C1)
- Régénérer les types TS Supabase
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

| Décision                                                                      | Justification                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `game_results` immutable (pas d'UPDATE)                                       | Événements passés, audit trail naturel, analytics propres                                   |
| Admin via JWT claim `app_metadata.role`                                       | Pattern Supabase recommandé : non-récursif, performant, extensible                          |
| Modèle hybride anonymous/loggé en `game_results.user_id NULLABLE`             | Validé : libre-service ouvert, modules école nécessitent compte                             |
| Pas de notion de "programme école" en DB                                      | Modèle business : attribution éditoriale uniquement, pas pilotage tech                      |
| FK avec `ON DELETE CASCADE` sur profiles, `SET NULL` sur game_results.user_id | RGPD-friendly : suppression user = suppression profile, mais préserve analytics anonymisées |

---

## 🔗 Cross-références

- **AUDIT.md C1** (schema.sql désynchronisé) → résolu par Étape 4 du plan ci-dessus
- **AUDIT-product.md** → indépendant, peut avancer en parallèle
- **CLAUDE.md** → à mettre à jour après migration pour référencer le nouveau modèle de données

---

_Audit clos le 28 avril 2026. Prochaine action : valider ce document, puis enchaîner sur le préalable signup-frontend (Étape 1) avant la session migration corrective._
