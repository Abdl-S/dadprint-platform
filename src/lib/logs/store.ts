'use client';

import { useSyncExternalStore } from 'react';

export interface ActivityLogEntry {
  id: string;
  actor: string;
  action: string;
  module: string;
  date: string;
}

let logs: ActivityLogEntry[] = [
  { id: 'l1', actor: 'Admin Démo', action: 'Statut changé → Impression', module: 'Commandes', date: new Date(Date.now() - 3600_000).toISOString() },
  { id: 'l2', actor: 'Admin Démo', action: 'Avis approuvé', module: 'Avis clients', date: new Date(Date.now() - 7200_000).toISOString() },
];

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function logActivity(action: string, module: string, actor = 'Admin Démo') {
  logs = [{ id: `log-${Date.now()}`, actor, action, module, date: new Date().toISOString() }, ...logs];
  emit();
}

function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }
function getSnapshot() { return logs; }

export function useActivityLogs() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
