'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import type { AdminArticleRow } from '@/lib/data/admin';

export function AdminBlogClient({ initial }: { initial: AdminArticleRow[] }) {
  const [articles, setArticles] = useState<AdminArticleRow[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ titleFr: '', category: '', coverImageUrl: '' });

  async function setStatus(id: string, status: 'publie' | 'brouillon') {
    const previous = articles;
    setArticles((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    if (!res.ok) { setArticles(previous); alert('La mise à jour a échoué.'); }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    const previous = articles;
    setArticles((prev) => prev.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (!res.ok) { setArticles(previous); alert('La suppression a échoué.'); }
  }

  async function save() {
    if (!form.titleFr) { setSaveError('Le titre est requis.'); return; }
    setSaving(true);
    setSaveError(null);
    const slug = form.titleFr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: { fr: form.titleFr, en: form.titleFr, ar: form.titleFr }, category: form.category, coverImageUrl: form.coverImageUrl, status: 'brouillon' }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { id } = await res.json();
      setArticles((prev) => [{ id, slug, title: form.titleFr, category: form.category, coverImageUrl: form.coverImageUrl, publishedAt: null, status: 'brouillon' }, ...prev]);
      setModalOpen(false);
      setForm({ titleFr: '', category: '', coverImageUrl: '' });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{articles.length} articles — SEO, catégories, brouillons.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      <AdminTable headers={['Article', 'Catégorie', 'Date', 'Statut', '']}>
        {articles.map((a) => (
          <tr key={a.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {a.coverImageUrl && <img src={a.coverImageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />}
                <span className="font-semibold">{a.title}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-xs text-ink-40">{a.category ?? '—'}</td>
            <td className="px-4 py-3 text-xs text-ink-40">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('fr-FR') : '—'}</td>
            <td className="px-4 py-3">
              <select
                aria-label="Statut de l'article"
                value={a.status}
                onChange={(e) => setStatus(a.id, e.target.value as 'publie' | 'brouillon')}
                className="rounded-full border-0 bg-transparent text-xs font-bold"
              >
                <option value="publie">Publié</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </td>
            <td className="px-4 py-3"><button onClick={() => remove(a.id)}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel article">
        <div className="space-y-3">
          <input placeholder="Titre (FR)" aria-label="Titre (FR)" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input placeholder="Catégorie" aria-label="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input placeholder="URL image de couverture" aria-label="URL image de couverture" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Enregistrement...' : 'Créer en brouillon'}</button>
        </div>
      </AdminModal>
    </div>
  );
}
