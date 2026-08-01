import { describe, it, expect } from 'vitest';
import { getComplementaryProducts } from '../recommendations/engine';
import { products } from '../mock/data';

describe('getComplementaryProducts', () => {
  it('retourne des produits différents du produit consulté', () => {
    const product = products[0];
    const results = getComplementaryProducts(products, product.categorySlug, product.slug);
    expect(results.every((p) => p.slug !== product.slug)).toBe(true);
  });

  it('ne dépasse jamais la limite demandée', () => {
    const results = getComplementaryProducts(products, 'cartes-de-visite', undefined, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('retourne un tableau vide pour une catégorie inconnue', () => {
    expect(getComplementaryProducts(products, 'categorie-inexistante')).toEqual([]);
  });
});
