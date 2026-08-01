import { describe, it, expect } from 'vitest';
import { generateReferenceNumber } from '../orders/reference';

describe('generateReferenceNumber', () => {
  it('produit une référence devis au bon format', () => {
    const ref = generateReferenceNumber('devis');
    expect(ref).toMatch(/^DP-DEV-\d{8}-\d{4}$/);
  });

  it('produit une référence commande au bon format', () => {
    const ref = generateReferenceNumber('commande');
    expect(ref).toMatch(/^DP-CMD-\d{8}-\d{4}$/);
  });

  it('génère des références différentes à chaque appel', () => {
    const a = generateReferenceNumber('commande');
    const b = generateReferenceNumber('commande');
    expect(a).not.toBe(b);
  });
});
