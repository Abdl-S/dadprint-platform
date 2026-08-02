'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import type { FaqItemRow } from '@/lib/data/content';

export function AdminFaqClient({ initial }: { initial: FaqItemRow[] }) {
  const [items, setItems] = useState<FaqItemRow[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ question: '', answer: '' });

  async function remove(id: string) {
    if (!confirm('Supprimer cette question ?')) return;
    const previous = items;
    setItems((prev) => prev.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    if (!res.ok) { setItems(previous); alert('La suppression a échoué.'); }
  }

  async function save() {
    if (!form.question.trim() || !form.answer.trim()) { setSaveError('Question et réponse requises.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { id } = await res.json();
      setItems((prev) => [...prev, { id, question: { fr: form.question, en: form.question, ar: form.question }, answer: { fr: form.answer, en: form.answer, ar: form.answer } }]);
      setModalOpen(false);
      setForm({ question: '', answer: '' });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{items.length} questions — affichées sur l'accueil et la page FAQ dédiée.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Ajouter une question
        </button>
      </div>

      <AdminTable headers={['Question', 'Réponse', '']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3 font-semibold">{item.question.fr}</td>
            <td className="px-4 py-3 text-ink-70">{item.answer.fr}</td>
            <td className="px-4 py-3"><button onClick={() => remove(item.id)}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle question">
        <div className="space-y-3">
          <input placeholder="Question (FR)" aria-label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <textarea placeholder="Réponse (FR)" aria-label="Réponse" rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={save} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
        </div>
      </AdminModal>
    </div>
  );
}
