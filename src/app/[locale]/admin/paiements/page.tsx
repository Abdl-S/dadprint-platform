'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Toggle } from '@/components/admin/Toggle';
import { paymentProviders as initial } from '@/lib/payment-providers';

export default function AdminPaiementsPage() {
  const [providers, setProviders] = useState(initial.map((p) => ({ ...p })));

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">Active ou désactive les moyens de paiement affichés au client — sans toucher au code.</p>

      <AdminTable headers={['Moyen de paiement', 'Statut', '']}>
        {providers.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3 font-semibold">{p.label}</td>
            <td className="px-4 py-3 text-xs text-ink-40">{p.enabled ? 'Actif' : 'Désactivé'}</td>
            <td className="px-4 py-3">
              <Toggle checked={p.enabled} onChange={(v) => setProviders((prev) => prev.map((x) => (x.id === p.id ? { ...x, enabled: v } : x)))} />
            </td>
          </tr>
        ))}
      </AdminTable>

      <button className="flex items-center gap-2 rounded-lg border-2 border-dashed border-ink-15 px-4 py-2.5 text-sm font-bold text-ink-70 hover:border-brand-cyan hover:text-brand-cyan">
        <Plus size={16} /> Ajouter un moyen de paiement
      </button>
    </div>
  );
}
