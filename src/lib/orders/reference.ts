/**
 * Génère un numéro de référence unique pour un devis ou une commande.
 * Format : DP-DEV-AAAAMMJJ-XXXX (devis) ou DP-CMD-AAAAMMJJ-XXXX (commande).
 * Généré côté client pour l'instant ; le futur backend (Supabase) reprendra
 * exactement ce format pour rester cohérent avec ce qui a déjà été montré au client.
 */
export function generateReferenceNumber(type: 'devis' | 'commande'): string {
  const prefix = type === 'devis' ? 'DEV' : 'CMD';
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DP-${prefix}-${y}${m}${d}-${rand}`;
}
