# Guide administrateur — DadPrint

Ce guide explique comment utiliser l'espace d'administration au quotidien. Il suppose que ton
compte a déjà été promu administrateur (voir `DOCUMENTATION.md`, section Authentification).

## Accéder à l'administration

Deux chemins :
- Directement : `/admin`
- Discrètement depuis le site : icône cadenas 🔒 tout en bas du pied de page

Connecte-toi avec l'email et le mot de passe de ton compte.

---

## Créer une catégorie

1. `Admin → Catégories → Ajouter`
2. Renseigne le nom (au moins en français), la description, une image de couverture
3. Pour une sous-catégorie, choisis une catégorie parente dans la liste
4. Enregistrer

## Créer un produit

1. `Admin → Produits → Ajouter`
2. Onglet **Infos** : nom, description courte et longue, catégorie
   - Le bouton "Générer avec l'IA" propose un texte de départ à ajuster (ce n'est pas encore une
     vraie IA connectée — voir `DOCUMENTATION.md`)
3. **Images** : glisse ou clique pour envoyer directement tes photos (plus besoin d'URL). La
   première image envoyée devient automatiquement la photo principale (étiquette "Principale")
4. Onglet **Prix** : mode de tarification (prix fixe, "à partir de", ou "sur devis uniquement"),
   quantité minimum, délai
5. Onglet **Formulaire** : construis le formulaire que le client remplira pour ce produit —
   ajoute des champs (liste déroulante, cases à cocher, quantité, zone de texte...), ordonne-les
6. Onglet **Seo** : titre et description pour les moteurs de recherche (sinon, valeurs par défaut)
7. **Enregistrer le produit** — il apparaît immédiatement sur le site public

Pour **désactiver** un produit sans le supprimer (rupture de stock, saisonnier) : bascule le
commutateur dans la liste, sans ouvrir la fiche.

## Créer un formulaire de commande

Le formulaire n'est pas un module séparé : il fait partie de chaque produit (onglet
**Formulaire**, voir ci-dessus). Chaque produit a son propre formulaire, adapté à ce qu'il
vend réellement (tailles pour un t-shirt, dimensions pour un roll-up, finition pour une carte...).

## Gérer les commandes

1. `Admin → Commandes`
2. Chaque ligne montre le client, le produit, la quantité, le montant, le statut
3. Change le statut directement dans la liste déroulante de chaque commande — le client peut
   suivre cette évolution sur `/suivi` avec sa référence

## Répondre à un devis

1. `Admin → Devis`
2. Change le statut (Nouveau → En cours → Envoyé → Accepté/Refusé) au fur et à mesure de
   l'échange avec le client (par téléphone ou WhatsApp le plus souvent)
3. Le client voit ce statut en temps réel sur `/suivi`

## Publier une réalisation (portfolio)

1. `Admin → Portfolio → Ajouter une réalisation`
2. Titre, catégorie, image
3. Elle est publiée par défaut ; bascule l'icône œil pour la masquer sans la supprimer

## Gérer les avis

1. `Admin → Avis`
2. Chaque avis soumis par un client apparaît avec le statut "En attente" — il n'est **pas**
   visible publiquement tant qu'il n'est pas approuvé
3. Clique Approuver ou Refuser ; tu peux aussi corriger le texte directement dans la zone de
   commentaire (la modification est enregistrée en quittant le champ)

## Créer un pack

1. `Admin → Packs → Ajouter`
2. Nom, description, image, prix (généralement "sur devis")
3. Sélectionne les produits inclus dans le pack
4. Bascule actif/inactif pour le publier ou le retirer temporairement

## Gérer les utilisateurs (équipe)

1. `Admin → Utilisateurs & rôles`
2. Change le rôle d'un membre existant (Administrateur, Commercial, Graphiste, Production,
   Livreur, Support) directement dans la liste
3. **Ajouter un nouveau membre** ne se fait pas depuis cette page (sécurité volontaire) : la
   personne crée un compte normal via `/inscription`, puis un administrateur la promeut en
   base de données. Voir `DOCUMENTATION.md`, section Authentification, pour la commande exacte.

## Modifier les paramètres

`Admin → Paramètres` — informations générales de l'entreprise (nom, coordonnées, monnaie).

---

## Bon à savoir

- Toute modification (produit, catégorie, statut...) est **immédiatement visible sur le site
  public** — pas de délai, pas d'étape de publication séparée
- Les images envoyées sont stockées de façon permanente (Supabase Storage), pas seulement le
  temps de la session
- Si un module affiche encore des données qui ne semblent pas correspondre à ce que tu as saisi,
  vérifie `AUDIT.md` — certains modules restent volontairement sur des données d'exemple à ce
  stade (voir la liste précise dedans)
