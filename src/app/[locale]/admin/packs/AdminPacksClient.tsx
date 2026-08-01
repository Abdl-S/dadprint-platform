'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { Toggle } from '@/components/admin/Toggle';
import type { Pack, Product } from '@/types';

export function AdminPacksClient({ initialPacks, products }: { initialPacks: (Pack & { active?: boolean })[]; products: Product[] }) {
  const [packs, setPacks] = useState<(Pack & { active?: boolean })[]>(initialPacks);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editing, setEditing] = useState<(Pack & { active?: boolean }) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openNew() {
    setEditing({ id: `new-${Date.now()}`, slug: '', name: { fr: '', en: '', ar: '' }, description: { fr: '', en: '', ar: '' }, coverImageUrl: '', productSlugs: [], pricingMode: 'quote', active: true });
    setModalOpen(true);
  }

  async function save() {
    if (!editing) return;
    const slug = editing.slug || editing.name.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const toSave = { ...editing, slug };
    const isNew = editing.id.startsWith('new-');

    setSaving(true);
    setSaveError(null);
    const payload = { slug: toSave.slug, name: toSave.name, description: toSave.description, coverImageUrl: toSave.coverImageUrl, priceLabel: toSave.priceLabel, productSlugs: toSave.productSlugs, active: toSave.active };

    try {
      if (isNew) {
        const res = await fetch('/api/admin/packs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
        const { id } = await res.json();
        setPacks((prev) => [...prev, { ...toSave, id }]);
      } else {
        const res = await fetch(`/api/admin/packs/${toSave.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la mise à jour');
        setPacks((prev) => prev.map((p) => (p.id === toSave.id ? toSave : p)));
      }
      setModalOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  function toggleProduct(slug: string) {
    if (!editing) return;
    const has = editing.productSlugs.includes(slug);
    setEditing({ ...editing, productSlugs: has ? editing.productSlugs.filter((s) => s !== slug) : [...editing.productSlugs, slug] });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{packs.length} packs — illimités, produits personnalisables.</p>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Nouveau pack
        </button>
      </div>

      <AdminTable headers={['Pack', 'Produits inclus', 'Actif', '']}>
        {packs.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />}
                <span className="font-semibold">{p.name.fr}</span>
              </div>
            </td>
            <td className="px-4 py-3">{p.productSlugs.length}</td>
            <td className="px-4 py-3"><Toggle checked={p.active !== false} onChange={async (v) => {
              setPacks((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: v } : x)));
              await fetch(`/api/admin/packs/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: v }) });
            }} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => { setEditing(p); setModalOpen(true); }}><Pencil size={14} className="text-ink-40" /></button>
                <button onClick={async () => {
                  if (!confirm('Supprimer ce pack ?')) return;
                  const previous = packs;
                  setPacks((prev) => prev.filter((x) => x.id !== p.id));
                  const res = await fetch(`/api/admin/packs/${p.id}`, { method: 'DELETE' });
                  if (!res.ok) { setPacks(previous); alert('La suppression a échoué.'); }
                }}><Trash2 size={14} className="text-danger" /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Pack" wide>
        {editing && (
          <div className="space-y-3">
            <input placeholder="Nom du pack" aria-label="Nom du pack" value={editing.name.fr} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, fr: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <textarea placeholder="Description" aria-label="Description" rows={3} value={editing.description.fr} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, fr: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="URL visuel" aria-label="URL visuel" value={editing.coverImageUrl} onChange={(e) => setEditing({ ...editing, coverImageUrl: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Prix (optionnel)" aria-label="Prix (optionnel)" value={editing.priceLabel ?? ''} onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <div>
              <p className="mb-2 text-sm font-semibold">Produits inclus</p>
              <div className="grid grid-cols-2 gap-2">
                {products.map((prod) => (
                  <label key={prod.slug} className="flex items-center gap-2 rounded-md border border-ink-15 p-2 text-xs">
                    <input type="checkbox" checked={editing.productSlugs.includes(prod.slug)} onChange={() => toggleProduct(prod.slug)} />
                    {prod.name.fr}
                  </label>
                ))}
              </div>
            </div>
            {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
            <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
