/**
 * Configuration de navigation centralisée.
 * `labelKey` pointe vers messages/<locale>.json → nav.*
 * Ajouter un lien de nav = une ligne ici, jamais dupliqué dans Header/Footer.
 */
export const mainNav = [
  { href: '/', labelKey: 'accueil' as const },
  { href: '/produits', labelKey: 'produits' as const },
  { href: '/nos-services', labelKey: 'services' as const },
  { href: '/realisations', labelKey: 'realisations' as const },
  { href: '/packs', labelKey: 'packs' as const },
  { href: '/a-propos', labelKey: 'aPropos' as const },
  { href: '/contact', labelKey: 'contact' as const },
];
