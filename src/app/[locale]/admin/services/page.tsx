'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Toggle } from '@/components/admin/Toggle';
import { servicesGraphiques as initial } from '@/lib/mock/admin';

export default function AdminServicesPage() {
  const [services, setServices] = useState(initial);
  const [name, setName] = useState('');

  function add() {
    if (!name.trim()) return;
    setServices((prev) => [...prev, { id: `s-${Date.now()}`, name, description: '', active: true }]);
    setName('');
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">Services graphiques proposés à côté de l'impression — autant que nécessaire.</p>

      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Vectorisation" aria-label="Ex : Vectorisation" className="w-full max-w-xs rounded-md border border-ink-15 p-3 text-sm" />
        <button onClick={add} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow"><Plus size={16} /> Ajouter</button>
      </div>

      <AdminTable headers={['Service', 'Description', 'Actif', '']}>
        {services.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-semibold">{s.name}</td>
            <td className="px-4 py-3 text-ink-70">{s.description || '—'}</td>
            <td className="px-4 py-3"><Toggle checked={s.active} onChange={(v) => setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: v } : x)))} /></td>
            <td className="px-4 py-3"><button onClick={() => setServices((prev) => prev.filter((x) => x.id !== s.id))}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
