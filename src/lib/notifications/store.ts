'use client';

import { useSyncExternalStore } from 'react';
import type { AdminRole } from '@/lib/admin/auth-context';

/**
 * Centre de notifications interne — un store en mémoire partagé par toute
 * l'administration (pas de contexte React nécessaire, useSyncExternalStore
 * suffit pour un store global simple). Chaque notification cible un ou
 * plusieurs rôles ; l'admin ne voit que celles qui le concernent.
 *
 * Canaux prévus mais non branchés (aucune clé/API disponible ici) :
 * Email, WhatsApp Business, Push, SMS — chaque notification a un champ
 * `channels` qui liste ceux qui SERAIENT déclenchés en production, sans
 * réellement les envoyer.
 */
export type NotificationChannel = 'app' | 'email' | 'whatsapp' | 'push' | 'sms';

export interface StaffNotification {
  id: string;
  targetRoles: AdminRole[] | 'client';
  title: string;
  body: string;
  reference?: string;
  channels: NotificationChannel[];
  createdAt: string;
  read: boolean;
}

let notifications: StaffNotification[] = [
  { id: 'sn1', targetRoles: ['commercial', 'administrateur'], title: 'Nouvelle commande', body: 'DP-CMD-20260730-5521 — Sahara Events', channels: ['app', 'email'], createdAt: new Date().toISOString(), read: false },
  { id: 'sn2', targetRoles: ['graphiste'], title: 'Nouveau projet à concevoir', body: 'Casquette personnalisée — Salon Éclat', channels: ['app'], createdAt: new Date().toISOString(), read: false },
];

const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export function pushNotification(n: Omit<StaffNotification, 'id' | 'createdAt' | 'read'>) {
  notifications = [{ ...n, id: `sn-${Date.now()}`, createdAt: new Date().toISOString(), read: false }, ...notifications];
  emit();
}

export function markRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() { return notifications; }

export function useStaffNotifications(role?: AdminRole) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return role ? all.filter((n) => n.targetRoles !== 'client' && n.targetRoles.includes(role)) : all;
}
