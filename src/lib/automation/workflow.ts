import { pushNotification, type NotificationChannel } from '@/lib/notifications/store';
import type { AdminRole } from '@/lib/admin/auth-context';

/**
 * Moteur d'automatisation — associe chaque statut de commande aux rôles à
 * prévenir et aux canaux à déclencher. `applyOrderStatusChange` est appelé
 * une seule fois, depuis /admin/commandes, à chaque changement de statut :
 * c'est le point d'entrée unique de toute la chaîne "Devis → ... → Terminée"
 * décrite dans le brief. Ajouter une étape = une ligne dans cette table,
 * jamais de logique dupliquée ailleurs.
 */
interface StatusRule {
  notifyRoles: AdminRole[];
  notifyClient: boolean;
  channels: NotificationChannel[];
  clientMessage: string;
}

export const workflowRules: Record<string, StatusRule> = {
  nouveau: { notifyRoles: ['commercial', 'administrateur'], notifyClient: false, channels: ['app'], clientMessage: '' },
  en_attente: { notifyRoles: ['commercial'], notifyClient: false, channels: ['app'], clientMessage: '' },
  paiement_recu: { notifyRoles: ['commercial', 'graphiste'], notifyClient: true, channels: ['app', 'email', 'whatsapp'], clientMessage: 'Paiement reçu — votre commande passe en conception.' },
  design: { notifyRoles: ['graphiste'], notifyClient: false, channels: ['app'], clientMessage: '' },
  bat: { notifyRoles: ['graphiste'], notifyClient: true, channels: ['app', 'whatsapp', 'push'], clientMessage: 'Votre maquette est prête à valider.' },
  impression: { notifyRoles: ['production'], notifyClient: true, channels: ['app', 'whatsapp'], clientMessage: 'Votre commande est en cours d\'impression.' },
  controle_qualite: { notifyRoles: ['production'], notifyClient: false, channels: ['app'], clientMessage: '' },
  livraison: { notifyRoles: ['livreur'], notifyClient: true, channels: ['app', 'whatsapp', 'sms'], clientMessage: 'Votre commande est en cours de livraison.' },
  terminee: { notifyRoles: ['commercial'], notifyClient: true, channels: ['app', 'email'], clientMessage: 'Commande livrée — merci ! Un lien d\'avis vous sera envoyé.' },
  annulee: { notifyRoles: ['commercial', 'administrateur'], notifyClient: true, channels: ['app', 'email'], clientMessage: 'Votre commande a été annulée.' },
};

export function applyOrderStatusChange(reference: string, statusKey: string, statusLabel: string) {
  const rule = workflowRules[statusKey];
  if (!rule) return;

  if (rule.notifyRoles.length > 0) {
    pushNotification({
      targetRoles: rule.notifyRoles,
      title: `Commande ${reference}`,
      body: `Statut mis à jour : ${statusLabel}`,
      reference,
      channels: rule.channels,
    });
  }
  if (rule.notifyClient && rule.clientMessage) {
    pushNotification({
      targetRoles: 'client',
      title: 'DadPrint',
      body: rule.clientMessage,
      reference,
      channels: rule.channels,
    });
  }
}
