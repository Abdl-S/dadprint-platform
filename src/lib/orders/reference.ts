/**
 * Génère un numéro de référence unique pour un devis, une commande ou une facture.
 * Format : DP-DEV-AAAAMMJJ-XXXX / DP-CMD-AAAAMMJJ-XXXX / DP-FAC-AAAAMMJJ-XXXX.
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
