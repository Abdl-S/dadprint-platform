# DadPrint — Plateforme

Fondations de la plateforme d'impression et de communication visuelle DadPrint.
Cette étape ne contient **aucune fonctionnalité métier** : uniquement l'architecture,
les composants réutilisables, le système multilingue et les conventions de projet
sur lesquels toutes les prochaines fonctionnalités seront construites.

## Stack

- **Next.js 14** (App Router) — rendu serveur pour SEO réel + multilingue natif
- **TypeScript strict**
- **Tailwind CSS** — tokens de marque centralisés
- **next-intl** — FR / EN / AR, RTL automatique pour l'arabe
- **Supabase** — base de données, auth, storage

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

## Structure du projet

```
src/
  app/[locale]/         → toutes les pages, préfixées par la langue (/fr, /en, /ar)
  components/
    ui/                  → primitives génériques (Button, Container, Section...)
    layout/              → Header, Footer, LanguageSwitcher
    brand/               → Logo (protégé, voir plus bas)
  i18n/                  → configuration des langues, routing, RTL
  lib/
    supabase/            → clients Supabase (browser + server, isolés)
    constants.ts         → navigation centralisée
    utils.ts             → helpers partagés
  types/                 → types partagés du futur modèle de données
messages/
  fr.json, en.json, ar.json  → toutes les traductions, une clé = un sens dans les 3 langues
public/brand/
  dadprint-logo.png      → fichier logo officiel, ne jamais modifier
```

## Règle sur le logo

Le composant `src/components/brand/Logo.tsx` est le SEUL endroit du projet qui affiche
le logo. Il ne permet de changer que la taille d'affichage — jamais la couleur, les
proportions ou le contenu du fichier. N'importer le fichier logo nulle part ailleurs.

## Multilingue

- Toutes les URLs sont préfixées : `/fr/...`, `/en/...`, `/ar/...`
- Ajouter une langue = l'ajouter dans `src/i18n/config.ts` + créer `messages/<locale>.json`
- `dir="rtl"` est appliqué automatiquement sur `<html>` pour l'arabe — les composants
  utilisent les classes logiques Tailwind (`ps-`, `pe-`, `text-start`...) plutôt que
  `left`/`right` pour s'inverser automatiquement sans code dupliqué
- Le logo ne s'inverse jamais en RTL (règle explicite dans le composant)

## Design system

Toutes les couleurs de marque sont définies une seule fois dans `tailwind.config.ts`
(`ink`, `paper`, `brand.magenta`, `brand.cyan`, `brand.yellow`). Aucune couleur ne doit
être codée en dur ailleurs — toujours passer par les classes Tailwind ou les variables
CSS de `globals.css`.

## Ce qui n'est PAS encore fait (volontairement)

- Aucune page publique n'a de contenu réel (placeholders uniquement)
- Aucune administration
- Aucune connexion réelle aux données (schéma Supabase à recréer proprement)
- Aucun moyen de paiement connecté (Bankily, Masrivi, Sedad, Click, BIM Bank, Amanty —
  prévus dans `PaymentProvider` côté types, à implémenter en module dédié et
  administrable plus tard)
- Aucune authentification / gestion de rôles admin

Chaque point ci-dessus sera développé comme un module indépendant sur ces fondations,
sans nécessiter de refonte de l'architecture.
