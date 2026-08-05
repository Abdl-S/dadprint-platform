'use client';

import { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { Toggle } from '@/components/admin/Toggle';
import type { AdminCompanyRow } from '@/lib/data/admin';

export function AdminNosClientsClient({ initial }: { initial: AdminCompanyRow[] }) {
  const [companies, setCompanies] = useState<AdminCompanyRow[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', websiteUrl: '', logos: [] as string[] });

  async function togglePublish(c: AdminCompanyRow) {
    const next = !c.publishConsent;
    setCompanies((prev) => prev.map((x) => (x.id === c.id ? { ...x, publishConsent: next } : x)));
    await fetch(`/api/admin/companies/${c.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publishConsent: next }),
    });
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette entreprise ?')) return;
    const previous = companies;
    setCompanies((prev) => prev.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
    if (!res.ok) { setCompanies(previous); alert('La suppression a échoué.'); }
  }

  async function save() {
    if (!form.name.trim()) { setSaveError('Le nom est requis.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, websiteUrl: form.websiteUrl || undefined, logoUrl: form.logos[0] }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { id } = await res.json();
      setCompanies((prev) => [{ id, name: form.name, logoUrl: form.logos[0] ?? null, websiteUrl: form.websiteUrl || null, publishConsent: true }, ...prev]);
      setModalOpen(false);
      setForm({ name: '', websiteUrl: '', logos: [] });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">Entreprises affichées dans "Ils nous font confiance" — logo, autorisation de publication.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Ajouter une entreprise
        </button>
      </div>

      <AdminTable headers={['Entreprise', 'Site', 'Publié (logo visible)', '']}>
        {companies.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {c.logoUrl ? <img src={c.logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-ink-8" />}
                <span className="font-semibold">{c.name}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              {c.websiteUrl ? <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-brand-cyan"><ExternalLink size={12} /> Lien</a> : <span className="text-xs text-ink-40">—</span>}
            </td>
            <td className="px-4 py-3"><Toggle checked={c.publishConsent} onChange={() => togglePublish(c)} /></td>
            <td className="px-4 py-3"><button onClick={() => remove(c.id)}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle entreprise cliente">
        <div className="space-y-3">
          <input placeholder="Nom de l'entreprise" aria-label="Nom de l'entreprise" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input placeholder="Site web (optionnel)" aria-label="Site web" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-40">Logo</p>
            <AdminImageUpload images={form.logos} onChange={(logos) => setForm({ ...form, logos })} />
          </div>
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
        </div>
      </AdminModal>
    </div>
  );
}
