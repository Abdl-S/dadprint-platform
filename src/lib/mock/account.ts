/**
 * ⚠️ Données d'exemple pour l'espace client — à remplacer par de vraies
 * requêtes Supabase une fois l'authentification et l'administration
 * connectées. Démontre la forme exacte que chaque section consommera.
 */
import type { Invoice, ClientFile, BrandKit, ClientNotification, DeliveryAddress } from '@/types';

export const invoices: Invoice[] = [
  { reference: 'FACT-2026-0142', orderReference: 'DP-CMD-20260728-1042', amount: '42 000 MRU', date: '2026-07-28', status: 'en_attente' },
  { reference: 'FACT-2026-0098', orderReference: 'DP-CMD-20260615-3390', amount: '5 000 MRU', date: '2026-06-15', status: 'payee' },
];

export const clientFiles: ClientFile[] = [
  { id: 'f1', name: 'logo-entreprise.png', type: 'logo', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80', uploadedAt: '2026-07-28', linkedOrderReference: 'DP-CMD-20260728-1042' },
  { id: 'f2', name: 'maquette-rollup-v1.pdf', type: 'creation', url: '#', uploadedAt: '2026-07-29', linkedOrderReference: 'DP-CMD-20260728-1042' },
  { id: 'f3', name: 'visuel-carte-visite.ai', type: 'fichier', url: '#', uploadedAt: '2026-06-15', linkedOrderReference: 'DP-CMD-20260615-3390' },
];

export const brandKits: BrandKit[] = [
  {
    id: 'bk1', name: 'Ma marque principale',
    logoUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80',
    colors: ['#221E1F', '#EA0E8A', '#15A1D6'],
    fonts: ['Inter', 'Space Mono'],
    contactEmail: 'contact@exemple.mr', contactPhone: '+222 34 76 34 21',
  },
];

export const clientNotifications: ClientNotification[] = [
  { id: 'n1', type: 'maquette_disponible', message: { fr: 'Votre maquette Roll-up est prête à valider', en: 'Your Roll-up proof is ready to approve', ar: 'نموذج اللوحة القابلة للطي جاهز للاعتماد' }, reference: 'DP-CMD-20260728-1042', date: '2026-07-30', read: false },
  { id: 'n2', type: 'paiement_recu', message: { fr: 'Paiement reçu pour votre commande', en: 'Payment received for your order', ar: 'تم استلام الدفع لطلبيتك' }, reference: 'DP-CMD-20260728-1042', date: '2026-07-29', read: true },
  { id: 'n3', type: 'devis_pret', message: { fr: 'Votre devis casquette est prêt', en: 'Your cap quote is ready', ar: 'عرض سعر القبعة جاهز' }, reference: 'DP-DEV-20260730-8821', date: '2026-07-30', read: false },
];

export const deliveryAddresses: DeliveryAddress[] = [
  { id: 'a1', label: 'Domicile', address: 'Tevragh-Zeina, Ilot 42', city: 'Nouakchott', isDefault: true },
  { id: 'a2', label: 'Bureau', address: 'Ksar, Avenue Kennedy', city: 'Nouakchott', isDefault: false },
];
