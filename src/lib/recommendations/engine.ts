import type { Product } from '@/types';

/**
 * Moteur de recommandations — règles métier simples (pas de machine
 * learning) : chaque catégorie liste ses catégories complémentaires
 * naturelles. C'est le même moteur qui alimente "Produits complémentaires"
 * sur la fiche produit ET les suggestions du Business Wizard (/demarrer).
 * Ajouter une règle = une ligne, sans toucher aux composants qui l'utilisent.
 *
 * `pool` est fourni par l'appelant (données réelles Supabase côté page) —
 * ce moteur ne connaît plus de données figées, uniquement les règles.
 */
const complementaryMap: Record<string, string[]> = {
  'cartes-de-visite': ['flyers', 'roll-up', 'tshirts', 'mugs'],
  'flyers': ['cartes-de-visite', 'affiches', 'roll-up'],
  'affiches': ['flyers', 'baches'],
  'roll-up': ['cartes-de-visite', 'baches', 'flyers'],
  'baches': ['roll-up', 'signaletique'],
  'tshirts': ['casquettes', 'mugs'],
  'casquettes': ['tshirts', 'mugs'],
  'mugs': ['cartes-de-visite', 'tshirts'],
  'packaging': ['cartes-de-visite', 'signaletique'],
  'signaletique': ['baches', 'packaging'],
};

export function getComplementaryProducts(pool: Product[], categorySlug: string, excludeSlug?: string, limit = 4): Product[] {
  const relatedCats = complementaryMap[categorySlug] ?? [];
  const filtered = pool.filter((p) => relatedCats.includes(p.categorySlug) && p.slug !== excludeSlug);
  return filtered.slice(0, limit);
}
