'use client';

import { useState } from 'react';
import { Send, ArrowRightCircle, Download, Printer, Plus } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { buildWhatsAppUrlToClient } from '@/lib/whatsapp';
import type { AdminQuoteRow } from '@/lib/data/admin';
import type { Product } from '@/types';

type AdminQuote = AdminQuoteRow & { status: 'nouveau' | 'en_cours' | 'envoye' | 'accepte' | 'refuse' };

const statusColors: Record<AdminQuote['status'], string> = {
  nouveau: 'bg-ink-8 text-ink', en_cours: 'bg-brand-yellow/20 text-ink-70', envoye: 'bg-brand-cyan/15 text-brand-cyan',
  accepte: 'bg-success/10 text-success', refuse: 'bg-danger/10 text-danger',
};
const statusLabels: Record<AdminQuote['status'], string> = {
  nouveau: 'Nouveau', en_cours: 'En cours', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé',
};

export function AdminDevisClient({ initial, products }: { initial: AdminQuoteRow[]; products: Product[] }) {
  const [quotes, setQuotes] = useState<AdminQuote[]>(initial as AdminQuote[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', productSlug: '', comments: '' });

  async function setStatus(ref: string, status: AdminQuote['status']) {
    const previous = quotes;
    setQuotes((prev) => prev.map((q) => (q.reference === ref ? { ...q, status } : q)));
    const res = await fetch(`/api/admin/quotes/${ref}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setQuotes(previous);
      alert('La mise à jour du statut a échoué. Réessayez.');
    }
  }

  function convertToOrder(ref: string) {
    alert(`Devis ${ref} converti en commande — une nouvelle commande sera créée avec les mêmes informations.`);
    setStatus(ref, 'accepte');
  }

  async function createQuote() {
    if (!form.name || !form.phone) { setSaveError('Nom et téléphone requis.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { reference } = await res.json();
      const product = products.find((p) => p.slug === form.productSlug);
      setQuotes((prev) => [{
        reference, clientName: form.name, clientPhone: form.phone,
        productName: product?.name.fr ?? '—', city: form.city || null,
        status: 'nouveau', date: new Date().toISOString(),
      }, ...prev]);
      setModalOpen(false);
      setForm({ name: '', phone: '', email: '', city: '', productSlug: '', comments: '' });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{quotes.length} devis — répondre, convertir, suivre l'historique complet.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Nouveau devis
        </button>
      </div>

      <AdminTable headers={['Référence', 'Client', 'Produit', 'Statut', 'Date', '']}>
        {quotes.map((q) => (
          <tr key={q.reference}>
            <td className="px-4 py-3 font-mono text-xs">{q.reference}</td>
            <td className="px-4 py-3">
              <p className="font-semibold">{q.clientName}</p>
              <p className="text-xs text-ink-40">{q.clientPhone}</p>
            </td>
            <td className="px-4 py-3">{q.productName}</td>
            <td className="px-4 py-3">
              <select aria-label="Statut du devis" value={q.status} onChange={(e) => setStatus(q.reference, e.target.value as AdminQuote['status'])} className="rounded-full border-0 bg-transparent text-xs font-bold">
                {Object.entries(statusLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(q.date).toLocaleDateString('fr-FR')}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2.5">
                <button
                  title="Envoyer sur WhatsApp"
                  onClick={() => {
                    const message = `Bonjour ${q.clientName},\n\nVoici votre devis DadPrint (réf. ${q.reference}) pour : ${q.productName}.\n\nNous revenons vers vous rapidement avec le détail et le prix. N'hésitez pas si vous avez des questions.\n\nL'équipe DadPrint`;
                    window.open(buildWhatsAppUrlToClient(q.clientPhone, message), '_blank');
                  }}
                  className="text-success hover:text-success/70"
                >
                  <Send size={14} />
                </button>
                <button title="Télécharger" className="text-ink-40 hover:text-ink"><Download size={14} /></button>
                <button title="Imprimer" className="text-ink-40 hover:text-ink"><Printer size={14} /></button>
                <button title="Convertir en commande" onClick={() => convertToOrder(q.reference)} className="text-brand-magenta"><ArrowRightCircle size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau devis">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Nom du client" aria-label="Nom du client" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Téléphone" aria-label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Email (optionnel)" aria-label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Ville" aria-label="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
          <select aria-label="Produit" value={form.productSlug} onChange={(e) => setForm({ ...form, productSlug: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm">
            <option value="">— Produit (optionnel) —</option>
            {products.map((p) => <option key={p.id} value={p.slug}>{p.name.fr}</option>)}
          </select>
          <textarea placeholder="Notes / détails de la demande" aria-label="Notes" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={3} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={createQuote} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Création...' : 'Créer le devis'}</button>
        </div>
      </AdminModal>
    </div>
  );
}
