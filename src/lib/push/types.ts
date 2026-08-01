/**
 * Fondations pour les notifications push — architecture prête, envoi non activé.
 * Cas d'usage prévus : devis prêt, commande en production, commande livrée,
 * demande d'avis. La logique d'envoi (VAPID + edge function Supabase) sera
 * un module indépendant branché ici plus tard, sans changer le reste du site.
 */
export interface PushSubscriptionRecord {
  id: string;
  clientId: string | null; // null tant qu'aucun compte client n'est connecté
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: string;
}

export type PushNotificationType =
  | 'devis_pret'
  | 'commande_en_production'
  | 'commande_livree'
  | 'demande_avis'
  | 'promotion';
