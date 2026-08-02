/**
 * Génère un numéro de référence pour une commande (format non séquentiel :
 * date + nombre aléatoire). Les devis et factures utilisent désormais un
 * vrai compteur séquentiel (voir `lib/orders/sequentialReference.ts`) —
 * cette fonction reste utilisée uniquement pour les commandes, non demandé
 * pour ce type de document.
 * Format : DP-CMD-AAAAMMJJ-XXXX.
 */
export function generateReferenceNumber(type: 'devis' | 'commande' | 'facture'): string {
  const prefix = type === 'devis' ? 'DEV' : type === 'commande' ? 'CMD' : 'FAC';
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DP-${prefix}-${y}${m}${d}-${rand}`;
}
