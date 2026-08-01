/**
 * ⚠️ Données d'exemple pour démontrer le suivi — à remplacer par de vraies
 * requêtes Supabase une fois l'administration connectée. Le numéro
 * DP-CMD-20260728-1042 est une démo volontairement accessible pour tester
 * l'écran de suivi sans avoir besoin d'un vrai compte.
 */
import type { TrackingRecord, BatMockup, PastOrder } from '@/types';

const t = (fr: string, en: string, ar: string) => ({ fr, en, ar });

export const ALL_STEPS: TrackingRecord['currentStep'][] = [
  'demande_recue', 'devis_envoye', 'paiement_valide', 'conception',
  'validation_bat', 'impression', 'controle_qualite', 'livraison', 'terminee',
];

export const trackingRecords: TrackingRecord[] = [
  {
    reference: 'DP-CMD-20260728-1042',
    type: 'commande',
    productName: t('Roll-up standard', 'Standard Roll-up', 'لوحة قابلة للطي قياسية'),
    currentStep: 'impression',
    completedSteps: ['demande_recue', 'devis_envoye', 'paiement_valide', 'conception', 'validation_bat'],
    createdAt: '2026-07-28',
  },
  {
    reference: 'DP-DEV-20260730-8821',
    type: 'devis',
    productName: t('Casquette personnalisée', 'Custom Cap', 'قبعة مخصصة'),
    currentStep: 'demande_recue',
    completedSteps: [],
    createdAt: '2026-07-30',
  },
];

export const batMockups: BatMockup[] = [
  {
    reference: 'DP-CMD-20260728-1042',
    productName: t('Roll-up standard', 'Standard Roll-up', 'لوحة قابلة للطي قياسية'),
    imageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=800&q=80',
    status: 'en_attente',
    version: 1,
  },
];

export const pastOrders: PastOrder[] = [
  {
    reference: 'DP-CMD-20260728-1042', type: 'commande', productSlug: 'roll-up-standard',
    productName: t('Roll-up standard', 'Standard Roll-up', 'لوحة قابلة للطي قياسية'),
    date: '2026-07-28', status: 'impression',
  },
  {
    reference: 'DP-CMD-20260615-3390', type: 'commande', productSlug: 'carte-de-visite-standard',
    productName: t('Carte de visite standard', 'Standard Business Card', 'بطاقة عمل قياسية'),
    date: '2026-06-15', status: 'terminee',
  },
];
