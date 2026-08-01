import type { PaymentProvider } from '@/types';

/**
 * Moyens de paiement mauritaniens pris en charge par la plateforme.
 * Le champ `enabled` sera piloté depuis l'administration (activer/désactiver
 * un moyen de paiement sans toucher au code) — ici, tous actifs par défaut
 * en attendant ce module admin.
 */
export const paymentProviders: { id: PaymentProvider; label: string; enabled: boolean }[] = [
  { id: 'bankily', label: 'Bankily', enabled: true },
  { id: 'masrivi', label: 'Masrivi', enabled: true },
  { id: 'sedad', label: 'Sedad', enabled: true },
  { id: 'click', label: 'Click', enabled: true },
  { id: 'bim_bank', label: 'BIM Bank', enabled: true },
  { id: 'amanty', label: 'Amanty', enabled: true },
];
