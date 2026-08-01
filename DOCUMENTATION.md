# DadPrint — Documentation technique

Plateforme d'impression et de communication visuelle — Nouakchott, Mauritanie.
Next.js 14 (App Router) · TypeScript · Tailwind CSS · next-intl · Supabase (prévu) · PWA.

---

## 1. Architecture générale

```
src/
  app/
    [locale]/            → tout le site public + l'admin, préfixés par langue (/fr, /en, /ar)
      admin/              → back-office, layout séparé (aucun chrome public)
      produits/           → catalogue + fiche produit
      ...                 → une trentaine de pages publiques
    api/
      ai/generate-product/ → point d'entrée IA (génération par gabarit, prêt pour un vrai LLM)
    manifest.ts           → manifest PWA généré par Next.js
  components/
    ui/                   → primitives partagées (Button, Card, Reveal, RatingStars...)
    layout/                → Header, Footer, ChromeGate (masque le chrome public sur /admin)
    admin/                  → AdminShell, StatCard, AdminTable, FormFieldBuilder...
    order/                  → DynamicOrderForm, DesignChoiceStep, FileUpload
    product/, portfolio/, payment/, pwa/, brand/, home/
  lib/
    mock/                  → toutes les données d'exemple (à remplacer par Supabase)
    admin/auth-context.tsx → authentification admin (démo, sessionStorage)
    automation/workflow.ts → règles de notification par statut de commande
    notifications/store.ts → centre de notifications interne (store partagé)
    logs/store.ts          → journal d'activité
    recommendations/engine.ts → moteur de recommandations par catégorie
    favorites/context.tsx  → favoris client (localStorage)
    whatsapp.ts, orders/reference.ts, payment-providers.ts
  i18n/                   → configuration next-intl (locales, routing, RTL)
  types/index.ts          → tous les types partagés (Product, OrderFormField, TrackingStep...)
messages/{fr,en,ar}.json  → traductions — clés strictement identiques dans les 3 langues
```

Chaque page publique lit ses données depuis `lib/mock/*`. Remplacer un tableau en mémoire par une
requête Supabase ne change jamais les composants qui l'affichent — c'est le principe directeur
de tout le projet depuis la première étape.

## 2. Modules de l'administration (`/admin`)

| Module | Rôle |
|---|---|
| Tableau de bord | Stats + graphiques (recharts) |
| Catégories | Illimitées, avec sous-catégories |
| Produits | Fiche complète + **constructeur de formulaire dynamique** (11 types de champs) |
| Packs | Groupes de produits, prix, activation |
| Services graphiques | Liste de services annexes à l'impression |
| Devis / Commandes | Statuts personnalisables, conversion devis→commande |
| Paiements | Activation des moyens de paiement mauritaniens |
| CRM Clients | Fiche complète : historique, marques, fichiers |
| Avis | Modération (approuver/refuser/corriger) |
| Portfolio, Nos clients, Blog, Pages, Newsletter | Gestion de contenu |
| DadPrint Studio | Espace graphiste — versions, BAT |
| Paramètres | Coordonnées, réseaux, langues, monnaie |
| Utilisateurs & rôles | 6 rôles avec permissions dédiées |
| Statistiques | Vues, conversions, produits rentables |
| **Journal d'activité** | Historique de toutes les actions admin |
| **Sauvegardes** | Export JSON réel + prévisualisation d'import |
| Assistant IA | Génération par gabarit + emplacement pour un vrai LLM |

## 3. Automatisation & notifications

`lib/automation/workflow.ts` définit, pour chaque statut de commande, qui prévenir (quels rôles)
et sur quels canaux. Changer un statut dans `/admin/commandes` déclenche automatiquement :
1. Une notification interne (visible dans la cloche de l'admin, filtrée par rôle)
2. Une notification "client" si le statut le justifie (paiement reçu, BAT prêt, livraison...)
3. Une entrée dans le journal d'activité

Les canaux **Email, WhatsApp Business, Push, SMS** sont modélisés (champ `channels` sur chaque
notification) mais **non envoyés réellement** — aucune clé d'API n'est disponible dans cet
environnement. Le jour où ces intégrations seront branchées, elles consommeront le même événement
`applyOrderStatusChange`, sans toucher à l'admin.

## 4. Ce qui est réellement fonctionnel vs. démonstratif

**Réel, sans backend :**
- Génération/export de fichiers (newsletter CSV, sauvegarde JSON)
- Validation de fichiers (type + taille) avant envoi
- Recommandations produits (règles métier, pas de ML)
- Notifications et journal d'activité (en mémoire, temps réel dans la session)
- Données structurées SEO (Schema.org Product / LocalBusiness) + sitemap dynamique complet
- Permissions par rôle appliquées dans la sidebar admin
- Optimisation d'images via `next/image` sur le Hero et la fiche produit (LCP prioritaire) —
  le reste du site utilise encore `<img>` classique ; une passe complète est un chantier mécanique
  à part, sans risque, mais volontairement pas fait sur 100% du site à cette étape
- PWA installable, service worker, mise en cache

**Démonstratif — nécessite un vrai backend :**
- Authentification admin (actuellement : tout email/mot de passe fonctionne)
- Persistance des données (tout est réinitialisé au rechargement de page)
- Envoi réel des notifications (email/WhatsApp/SMS/push)
- Génération IA (gabarits actuellement, pas de LLM connecté)
- Paiements (aucune transaction réelle)

## 5. Installation

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
npm run test                  # tests unitaires (Vitest) — référence, recommandations, workflow
```

## 5bis. Tests

- **Unitaires (réels, exécutés)** : `npm run test` — génération de référence, moteur de
  recommandations, cohérence des règles de workflow (8 tests, tous verts)
- **Fonctionnels / responsive / parcours utilisateur / performance** : nécessitent un vrai
  navigateur (Playwright ou Cypress) — `vitest.config.ts` sert de socle, mais ces tests-là
  restent à écrire une fois l'environnement de test end-to-end mis en place

## 5ter. Permissions

Chaque rôle admin (`lib/admin/auth-context.tsx`) voit une sidebar filtrée selon
`ROLE_ACCESS` dans `components/admin/AdminShell.tsx` — un graphiste ne voit pas "Paiements",
un livreur ne voit pas "Devis", etc. `administrateur` voit toujours tout.

## 6. Architecture backend — base de données réelle (Supabase)

**Contrairement aux étapes précédentes, cette partie n'est pas simulée : le schéma complet a
été créé et vérifié dans un vrai projet Supabase** (`qoivvabtdsyzoofxgfjh`), préfixe `dp_` pour
ne jamais entrer en collision avec les tables existantes du même projet. Le fichier `.env.local`
livré pointe déjà dessus — le projet fonctionne dès `npm run dev`, une fois déployé sur un
hébergeur avec accès réseau normal (vérifié : le code exécute correctement la requête, seul
le bac à sable de développement bloque l'appel sortant vers `*.supabase.co`).

### 31 tables, organisées en modules indépendants

| Module | Tables |
|---|---|
| Identité & rôles | `dp_roles`, `dp_permissions`, `dp_role_permissions`, `dp_profiles` |
| Clients | `dp_companies`, `dp_brands`, `dp_addresses` |
| Catalogue | `dp_categories`, `dp_products`, `dp_product_specs`, `dp_product_tips`, `dp_product_variants`, `dp_form_fields`, `dp_related_products` |
| Packs | `dp_packs`, `dp_pack_products` |
| Devis | `dp_quotes`, `dp_quote_lines` |
| Commandes | `dp_orders`, `dp_order_lines`, `dp_order_statuses` |
| Paiements | `dp_payment_methods`, `dp_payments`, `dp_invoices` |
| Production | `dp_bat_versions`, `dp_files` |
| Contenu | `dp_portfolio_items`, `dp_articles` |
| Avis | `dp_reviews` |
| Système | `dp_notifications`, `dp_activity_log`, `dp_newsletter_subscribers` |

Toutes les données textuelles multilingues (`name`, `description`, `label`, `comment`...) sont
stockées en `jsonb` au format `{"fr": "...", "en": "...", "ar": "..."}` — ajouter une langue ne
demande aucune migration, juste une nouvelle clé dans ces objets.

### Relations clés

- `dp_categories.parent_id → dp_categories.id` (sous-catégories illimitées, auto-référence)
- `dp_products.category_id → dp_categories.id`
- `dp_form_fields.product_id → dp_products.id` (le constructeur de formulaire admin écrit ici)
- `dp_orders.quote_id → dp_quotes.id` (conversion devis → commande)
- `dp_order_lines.order_id / product_id` (une commande peut contenir plusieurs produits)
- `dp_payments.order_id`, `dp_invoices.order_id`, `dp_bat_versions.order_id`
- `dp_files.linked_order_id` (tous les fichiers — logo, PDF, AI, PSD, BAT, factures — rattachés à une commande)
- `dp_notifications.target_role_id` OU `target_client_id` (jamais les deux)

### Sécurité au niveau base (RLS)

Row Level Security activé sur les 31 tables. Une fonction `dp_is_staff()` détermine si
l'utilisateur connecté est un membre de l'équipe (tout rôle sauf "client"). Politiques :
- **Lecture publique** sans authentification : catégories, produits, packs, portfolio publié,
  avis approuvés, articles publiés, entreprises avec consentement, moyens de paiement actifs
- **Écriture publique volontaire** (formulaires visiteurs) : devis, commandes, avis (statut
  "en_attente" forcé), newsletter, fichiers — c'est le choix assumé pour permettre la commande
  sans compte ; l'audit de sécurité Supabase le signale comme "permissif", ce qui est correct
  ici et documenté comme tel, pas un oubli
- **Client connecté** : accès à ses propres devis, commandes, factures, BAT, adresses, marques
- **Staff uniquement** : tout le reste (catalogue en écriture, paiements, statuts, journal...)

### Stockage des fichiers

`dp_files` centralise les métadonnées (type, propriétaire, commande liée) pour tout fichier —
logos, mockups, vidéos, PDF, AI, PSD, SVG, ZIP, factures, BAT, documents internes — quel que
soit le bucket Supabase Storage réel qui les contient (buckets déjà existants dans ce projet :
`dadprint-portfolio`, `dadprint-orders`, réutilisables tels quels).

## 7. API REST

13 routes réelles sous `src/app/api/`, connectées au schéma ci-dessus via `lib/supabase/server.ts` :

| Route | Méthode | Rôle |
|---|---|---|
| `/api/categories` | GET | Liste des catégories |
| `/api/products` | GET | Catalogue (filtres catégorie/recherche, pagination) |
| `/api/products/[slug]` | GET | Fiche produit complète (specs, conseils, champs de formulaire) |
| `/api/packs` | GET | Packs actifs + produits inclus |
| `/api/portfolio` | GET | Réalisations publiées |
| `/api/blog` | GET | Articles publiés |
| `/api/reviews` | GET / POST | Avis approuvés / soumission (modération ensuite) |
| `/api/quotes` | POST | Création d'un devis (+ ligne) |
| `/api/quotes/[reference]` | GET | Suivi public par référence |
| `/api/orders` | POST | Création d'une commande (+ ligne) |
| `/api/orders/[reference]` | GET | Suivi public par référence |
| `/api/newsletter` | POST | Inscription (idempotente) |
| `/api/ai/generate-product` | POST | Génération de contenu (gabarit, voir section IA) |

**Non construites à cette étape** (même principe, à ajouter en suivant exactement ce pattern) :
authentification (Supabase Auth gère déjà connexion/déconnexion/mot de passe oublié nativement,
pas besoin de routes custom), clients/CRM, notifications, administration — chacune suivrait le
même modèle `createClient()` + requête filtrée par `dp_is_staff()`.

**GraphQL** : Supabase expose déjà un endpoint GraphQL auto-généré sur ce même schéma
(`/graphql/v1`) sans configuration supplémentaire — l'architecture REST ci-dessus et GraphQL
coexistent nativement sur les mêmes tables et politiques RLS.

## 8. Authentification (architecture)

Le vrai système repose sur **Supabase Auth**, qui fournit nativement : connexion, déconnexion,
mot de passe oublié, réinitialisation, gestion de session (cookies httpOnly via `@supabase/ssr`,
déjà en dépendance), et l'architecture pour la double authentification (Supabase Auth supporte
TOTP nativement — `supabase.auth.mfa.enroll()` — prêt à activer sans changer le schéma).
`dp_profiles.id` référence `auth.users.id` : chaque utilisateur Supabase Auth (staff ou client)
a une ligne de profil avec son rôle. L'admin actuel (`lib/admin/auth-context.tsx`) reste en
mode démonstration ; le remplacer par de vrais appels `supabase.auth.signInWithPassword()` est
un changement localisé à ce seul fichier.

## 9. Intégrations futures — points d'accroche déjà prévus

| Intégration | Où elle se branche sans rien casser |
|---|---|
| WhatsApp Business API | `lib/whatsapp.ts` (déjà le point d'entrée unique de tous les messages) |
| Email | Événement `applyOrderStatusChange` (`lib/automation/workflow.ts`) |
| SMS | Même point que l'email |
| Stockage Cloud | `dp_files.storage_path` déjà prévu pour Supabase Storage |
| IA réelle | `app/api/ai/generate-product/route.ts` — remplacer le corps de la fonction |
| Paiements électroniques | `dp_payments` + `dp_payment_methods` déjà structurés |
| Analytics | `dp_activity_log` + table de vues produits à ajouter (même schéma que `dashboardStats`) |

## 6. Déploiement

Projet Next.js standard — compatible Netlify (Next.js Runtime) ou Vercel. Le service worker et le
manifest PWA sont déjà configurés ; aucune étape supplémentaire n'est nécessaire pour l'installation
sur mobile/desktop une fois déployé sur un vrai domaine HTTPS.

## 7. Maintenance & évolutions futures

- **Base de données** : recréer le schéma Supabase en suivant exactement les types de `src/types/index.ts`
- **Auth** : remplacer `lib/admin/auth-context.tsx` par Supabase Auth + RLS par rôle
- **IA** : remplacer le corps de `app/api/ai/generate-product/route.ts` par un appel LLM réel
- **Notifications** : brancher un fournisseur email (Resend/SendGrid), WhatsApp Business API, et un service push (déjà préparé côté service worker)
- **Paiements** : intégrer les API réelles de Bankily/Masrivi/Sedad/Click/BIM Bank/Amanty quand disponibles
