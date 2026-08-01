'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import type { Category, PortfolioItem } from '@/types';

type AdminPortfolioItem = PortfolioItem & { published: boolean };

export function AdminPortfolioClient({ initial, categories }: { initial: AdminPortfolioItem[]; categories: Category[] }) {
  const [items, setItems] = useState<AdminPortfolioItem[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ titleFr: '', categorySlug: categories[0]?.slug ?? '', imageUrl: '' });

  async function togglePublished(item: AdminPortfolioItem) {
    const next = !item.published;
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, published: next } : x)));
    await fetch(`/api/admin/portfolio/${item.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: next }),
    });
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette réalisation ?')) return;
    const previous = items;
    setItems((prev) => prev.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    if (!res.ok) { setItems(previous); alert('La suppression a échoué.'); }
  }

  async function save() {
    if (!form.titleFr || !form.imageUrl) { setSaveError('Titre et image requis.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorySlug: form.categorySlug, title: { fr: form.titleFr, en: form.titleFr, ar: form.titleFr }, imageUrl: form.imageUrl }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { id } = await res.json();
      setItems((prev) => [{ id, categorySlug: form.categorySlug, title: { fr: form.titleFr, en: form.titleFr, ar: form.titleFr }, imageUrl: form.imageUrl, published: true }, ...prev]);
      setModalOpen(false);
      setForm({ titleFr: '', categorySlug: categories[0]?.slug ?? '', imageUrl: '' });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{items.length} réalisations — photos, vidéos, avant/après.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Ajouter une réalisation
        </button>
      </div>

      <AdminTable headers={['Réalisation', 'Catégorie', 'Type', 'Publié', '']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
                <span className="font-semibold">{item.title.fr}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-ink-70">{categories.find((c) => c.slug === item.categorySlug)?.name.fr ?? '—'}</td>
            <td className="px-4 py-3 text-xs text-ink-40">{item.videoUrl ? 'Vidéo' : item.beforeImageUrl ? 'Avant / Après' : 'Photo'}</td>
            <td className="px-4 py-3">
              <button onClick={() => togglePublished(item)}>
                {item.published ? <Eye size={16} className="text-success" /> : <EyeOff size={16} className="text-ink-40" />}
              </button>
            </td>
            <td className="px-4 py-3"><button onClick={() => remove(item.id)}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle réalisation">
        <div className="space-y-3">
          <input placeholder="Titre (FR)" aria-label="Titre (FR)" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <select aria-label="Catégorie" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm">
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name.fr}</option>)}
          </select>
          <input placeholder="URL de l'image" aria-label="URL de l'image" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
        </div>
      </AdminModal>
    </div>
  );
}
