'use client';

import { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { applyOrderStatusChange } from '@/lib/automation/workflow';
import { logActivity } from '@/lib/logs/store';
import type { AdminOrderRow, OrderStatus } from '@/lib/data/admin';

export function AdminCommandesClient({ initial, orderStatuses }: { initial: AdminOrderRow[]; orderStatuses: OrderStatus[] }) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initial);
  const [filter, setFilter] = useState<string | null>(null);

  async function setStatus(ref: string, status: string) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.reference === ref ? { ...o, status } : o)));
    const label = orderStatuses.find((s) => s.key === status)?.label ?? status;

    const res = await fetch(`/api/admin/orders/${ref}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setOrders(previous);
      alert('La mise à jour du statut a échoué. Réessayez.');
      return;
    }

    applyOrderStatusChange(ref, status, label);
    logActivity(`${ref} → ${label}`, 'Commandes');
  }

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{orders.length} commandes — statuts personnalisables, du premier contact à la livraison.</p>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter(null)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${!filter ? 'bg-ink text-paper' : 'bg-ink-8 text-ink-70'}`}>Toutes</button>
        {orderStatuses.map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${filter === s.key ? 'bg-ink text-paper' : s.color}`}>
            {s.label}
          </button>
        ))}
      </div>

      <AdminTable headers={['Référence', 'Client', 'Produit', 'Qté', 'Montant', 'Statut', 'Date']}>
        {filtered.map((o) => (
          <tr key={o.reference}>
            <td className="px-4 py-3 font-mono text-xs">{o.reference}</td>
            <td className="px-4 py-3">
              <p className="font-semibold">{o.clientName}</p>
              <p className="text-xs text-ink-40">{o.clientPhone}</p>
            </td>
            <td className="px-4 py-3">{o.productName}</td>
            <td className="px-4 py-3">{o.quantity}</td>
            <td className="px-4 py-3 font-semibold">{o.amount.toLocaleString('fr-FR')} MRU</td>
            <td className="px-4 py-3">
              <select aria-label="Statut de la commande" value={o.status} onChange={(e) => setStatus(o.reference, e.target.value)} className="rounded-full border-0 bg-transparent text-xs font-bold">
                {orderStatuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(o.date).toLocaleDateString('fr-FR')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
