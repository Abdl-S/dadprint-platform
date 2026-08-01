'use client';

import { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Toggle } from '@/components/admin/Toggle';
import { clientCompanies as initial } from '@/lib/mock/data';

export default function AdminNosClientsPage() {
  const [companies, setCompanies] = useState(initial.map((c) => ({ ...c, published: true })));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">Entreprises affichées dans "Ils nous font confiance" — logo, autorisation de publication.</p>
        <button className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Ajouter une entreprise
        </button>
      </div>

      <AdminTable headers={['Entreprise', 'Site', 'Publié (logo visible)', '']}>
        {companies.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={c.logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="font-semibold">{c.name}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              {c.websiteUrl ? <a href={c.websiteUrl} className="flex items-center gap-1 text-xs text-brand-cyan"><ExternalLink size={12} /> Lien</a> : <span className="text-xs text-ink-40">—</span>}
            </td>
            <td className="px-4 py-3"><Toggle checked={c.published} onChange={(v) => setCompanies((prev) => prev.map((x) => (x.id === c.id ? { ...x, published: v } : x)))} /></td>
            <td className="px-4 py-3"><button onClick={() => setCompanies((prev) => prev.filter((x) => x.id !== c.id))}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
