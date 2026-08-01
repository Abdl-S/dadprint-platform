'use client';

import { useState } from 'react';
import { Building2, User } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { crmClients } from '@/lib/mock/admin';
import { pastOrders } from '@/lib/mock/tracking';
import { brandKits } from '@/lib/mock/account';
import type { CrmClient } from '@/lib/mock/admin';

export default function AdminClientsPage() {
  const [selected, setSelected] = useState<CrmClient | null>(null);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{crmClients.length} clients — fiche complète : commandes, devis, paiements, avis, fichiers, marques.</p>

      <AdminTable headers={['Client', 'Contact', 'Ville', 'Commandes', 'Total dépensé', '']}>
        {crmClients.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                {c.isCompany ? <Building2 size={14} className="text-ink-40" /> : <User size={14} className="text-ink-40" />}
                {c.name}
              </div>
            </td>
            <td className="px-4 py-3 text-ink-70">
              <p>{c.phone}</p>
              <p className="text-xs text-ink-40">{c.email}</p>
            </td>
            <td className="px-4 py-3">{c.city}</td>
            <td className="px-4 py-3">{c.ordersCount}</td>
            <td className="px-4 py-3 font-semibold">{c.totalSpent.toLocaleString('fr-FR')} MRU</td>
            <td className="px-4 py-3">
              <button onClick={() => setSelected(c)} className="text-xs font-bold text-brand-cyan">Voir la fiche →</button>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} wide>
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3 text-xs text-ink-70">
              <p><b className="text-ink">Téléphone :</b> {selected.phone}</p>
              <p><b className="text-ink">Email :</b> {selected.email}</p>
              <p><b className="text-ink">Ville :</b> {selected.city}</p>
              <p><b className="text-ink">Total dépensé :</b> {selected.totalSpent.toLocaleString('fr-FR')} MRU</p>
            </div>

            <div>
              <h4 className="mb-2 font-bold">Historique commandes / devis</h4>
              <div className="space-y-1.5">
                {pastOrders.map((o) => (
                  <div key={o.reference} className="flex justify-between rounded-md bg-ink-8/40 px-3 py-2 text-xs">
                    <span>{o.productName.fr}</span>
                    <span className="font-mono text-ink-40">{o.reference}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-bold">Marques enregistrées</h4>
              {brandKits.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-md bg-ink-8/40 px-3 py-2 text-xs">
                  <img src={b.logoUrl} alt="" className="h-8 w-8 rounded object-cover" />
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
