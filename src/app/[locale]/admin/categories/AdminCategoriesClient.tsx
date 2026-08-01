'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronsUpDown } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import type { Category } from '@/types';

export function AdminCategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const roots = categories.filter((c) => !c.parentSlug);

  function openNew(parentSlug?: string) {
    setEditing({
      id: `new-${Date.now()}`, slug: '', parentSlug, name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' }, coverImageUrl: '', productCount: 0,
    });
    setModalOpen(true);
  }

  async function save() {
    if (!editing) return;
    const slug = editing.slug || editing.name.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const toSave = { ...editing, slug };
    const isNew = editing.id.startsWith('new-');

    setSaving(true);
    setSaveError(null);
    const payload = { slug: toSave.slug, parentSlug: toSave.parentSlug, name: toSave.name, description: toSave.description, coverImageUrl: toSave.coverImageUrl };

    try {
      if (isNew) {
        const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
        const { id } = await res.json();
        setCategories((prev) => [...prev, { ...toSave, id }]);
      } else {
        const res = await fetch(`/api/admin/categories/${toSave.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la mise à jour');
        setCategories((prev) => prev.map((c) => (c.id === toSave.id ? toSave : c)));
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    const previous = categories;
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentSlug !== prev.find((x) => x.id === id)?.slug));
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setCategories(previous);
      alert('La suppression a échoué. Réessayez.');
    }
  }

  function move(id: string, dir: -1 | 1) {
    setCategories((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((c) => c.id === id);
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{categories.length} catégories — illimité, avec sous-catégories.</p>
        <button onClick={() => openNew()} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      <AdminTable headers={['Catégorie', 'Slug', 'Produits', '', '']}>
        {roots.map((cat) => (
          <>
            <tr key={cat.id}>
              <td className="px-4 py-3 font-semibold">{cat.name.fr}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink-40">{cat.slug}</td>
              <td className="px-4 py-3">{cat.productCount}</td>
              <td className="px-4 py-3">
                <button onClick={() => openNew(cat.slug)} className="text-xs font-bold text-brand-cyan">+ Sous-catégorie</button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => move(cat.id, -1)} title="Réordonner"><ChevronsUpDown size={14} className="text-ink-40" /></button>
                  <button onClick={() => { setEditing(cat); setModalOpen(true); }}><Pencil size={14} className="text-ink-40" /></button>
                  <button onClick={() => remove(cat.id)}><Trash2 size={14} className="text-danger" /></button>
                </div>
              </td>
            </tr>
            {categories.filter((c) => c.parentSlug === cat.slug).map((sub) => (
              <tr key={sub.id} className="bg-ink-8/30">
                <td className="px-4 py-3 ps-10 text-sm">↳ {sub.name.fr}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-40">{sub.slug}</td>
                <td className="px-4 py-3">{sub.productCount}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditing(sub); setModalOpen(true); }}><Pencil size={14} className="text-ink-40" /></button>
                    <button onClick={() => remove(sub.id)}><Trash2 size={14} className="text-danger" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.parentSlug ? 'Sous-catégorie' : 'Catégorie'}>
        {editing && (
          <div className="space-y-3">
            <input
              placeholder="Nom (FR)" aria-label="Nom (FR)" value={editing.name.fr}
              onChange={(e) => setEditing({ ...editing, name: { ...editing.name, fr: e.target.value } })}
              className="w-full rounded-md border border-ink-15 p-3 text-sm"
            />
            <input
              placeholder="Description (FR)" aria-label="Description (FR)" value={editing.description.fr}
              onChange={(e) => setEditing({ ...editing, description: { ...editing.description, fr: e.target.value } })}
              className="w-full rounded-md border border-ink-15 p-3 text-sm"
            />
            <input
              placeholder="URL image de couverture" aria-label="URL image de couverture" value={editing.coverImageUrl}
              onChange={(e) => setEditing({ ...editing, coverImageUrl: e.target.value })}
              className="w-full rounded-md border border-ink-15 p-3 text-sm"
            />
            {saveError && (
              <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>
            )}
            <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
