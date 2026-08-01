'use client';

import { AdminTable } from '@/components/admin/AdminTable';
import { useActivityLogs } from '@/lib/logs/store';

/**
 * Journal d'activité — chaque action significative de l'admin est
 * enregistrée. Naviguez vers "Commandes" et changez un statut pour voir
 * une nouvelle ligne apparaître ici en temps réel.
 */
export default function AdminJournalPage() {
  const logs = useActivityLogs();

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{logs.length} actions enregistrées — traçabilité complète de l'administration.</p>

      <AdminTable headers={['Action', 'Module', 'Auteur', 'Date']}>
        {logs.map((l) => (
          <tr key={l.id}>
            <td className="px-4 py-3 font-semibold">{l.action}</td>
            <td className="px-4 py-3 text-ink-70">{l.module}</td>
            <td className="px-4 py-3 text-ink-70">{l.actor}</td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(l.date).toLocaleString('fr-FR')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
