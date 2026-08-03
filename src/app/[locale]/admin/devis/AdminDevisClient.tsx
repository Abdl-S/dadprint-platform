'use client';

import { useState } from 'react';
import { ArrowRightCircle, Download, Plus, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { PdfPreviewModal } from '@/components/admin/PdfPreviewModal';
import { buildWhatsAppUrlToClient } from '@/lib/whatsapp';
import type { AdminQuoteRow } from '@/lib/data/admin';

type AdminQuote = AdminQuoteRow & { status: 'nouveau' | 'en_cours' | 'envoye' | 'accepte' | 'refuse' };
interface Line { qty: number; description: string; unitPrice: number }

const statusLabels: Record<AdminQuote['status'], string> = {
  nouveau: 'Nouveau', en_cours: 'En cours', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé',
};

export function AdminDevisClient({ initial }: { initial: AdminQuoteRow[] }) {
  const [quotes, setQuotes] = useState<AdminQuote[]>(initial as AdminQuote[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', comments: '' });
  const [lines, setLines] = useState<Line[]>([{ qty: 1, description: '', unitPrice: 0 }]);
  const [pdfLoadingRef, setPdfLoadingRef] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ quote: AdminQuote; url: string; fileName: string } | null>(null);

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

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  async function createQuote() {
    if (!form.name || !form.phone) { setSaveError('Nom et téléphone requis.'); return; }
    const validLines = lines.filter((l) => l.description.trim());
    if (validLines.length === 0) { setSaveError('Ajoutez au moins une ligne décrivant la commande.'); return; }

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lines: validLines }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { reference } = await res.json();
      setQuotes((prev) => [{
        reference, clientName: form.name, clientPhone: form.phone,
        productName: validLines[0].description, address: form.address || null,
        status: 'nouveau', date: new Date().toISOString(),
      }, ...prev]);
      setModalOpen(false);
      setForm({ name: '', phone: '', email: '', address: '', comments: '' });
      setLines([{ qty: 1, description: '', unitPrice: 0 }]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  async function generateAndPreview(q: AdminQuote) {
    setPdfLoadingRef(q.reference);
    try {
      const res = await fetch(`/api/admin/quotes/${q.reference}/pdf`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Échec de la génération du PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreview({ quote: q, url, fileName: `${q.reference}.pdf` });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setPdfLoadingRef(null);
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
                  title="Aperçu du PDF" disabled={pdfLoadingRef === q.reference}
                  onClick={() => generateAndPreview(q)} className="text-ink-40 hover:text-ink disabled:opacity-40"
                >
                  {pdfLoadingRef === q.reference ? '…' : <Download size={14} />}
                </button>
                <button title="Convertir en commande" onClick={() => convertToOrder(q.reference)} className="text-brand-magenta"><ArrowRightCircle size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau devis" wide>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Nom du client" aria-label="Nom du client" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Téléphone" aria-label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Email (optionnel)" aria-label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Adresse" aria-label="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-40">Détail de la commande</p>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[60px_1fr_110px_110px_32px] items-center gap-2">
                  <input type="number" min={1} value={line.qty} aria-label="Quantité" onChange={(e) => updateLine(i, { qty: Number(e.target.value) })} className="rounded-md border border-ink-15 p-2 text-sm" />
                  <input placeholder="Description (ex : Impression banderole 200x120)" aria-label="Description" value={line.description} onChange={(e) => updateLine(i, { description: e.target.value })} className="rounded-md border border-ink-15 p-2 text-sm" />
                  <input type="number" placeholder="P.U (MRU)" aria-label="Prix unitaire" value={line.unitPrice || ''} onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })} className="rounded-md border border-ink-15 p-2 text-sm" />
                  <p className="text-sm text-ink-40">{(line.qty * line.unitPrice).toLocaleString('fr-FR')} MRU</p>
                  <button type="button" onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} disabled={lines.length === 1} className="text-danger disabled:opacity-30" aria-label="Retirer cette ligne">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setLines((prev) => [...prev, { qty: 1, description: '', unitPrice: 0 }])} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-brand-magenta">
              <Plus size={14} /> Ajouter une ligne
            </button>
          </div>

          <textarea placeholder="Notes internes (optionnel)" aria-label="Notes" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={2} className="w-full rounded-md border border-ink-15 p-3 text-sm" />

          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={createQuote} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">
            {saving ? 'Création...' : 'Créer le devis'}
          </button>
        </div>
      </AdminModal>

      {preview && (
        <PdfPreviewModal
          pdfUrl={preview.url}
          fileName={preview.fileName}
          onClose={() => { URL.revokeObjectURL(preview.url); setPreview(null); }}
          onDownload={() => {
            const a = document.createElement('a');
            a.href = preview.url; a.download = preview.fileName; a.click();
          }}
          onSendWhatsApp={() => {
            // WhatsApp ne permet pas de joindre un fichier depuis un lien — le PDF a déjà été
            // téléchargé ci-dessus, il ne reste qu'à le glisser dans la conversation qui s'ouvre ici.
            const message = `Bonjour ${preview.quote.clientName},\n\nVoici votre devis DadPrint (réf. ${preview.quote.reference}), en pièce jointe.\n\nL'équipe DadPrint`;
            window.open(buildWhatsAppUrlToClient(preview.quote.clientPhone, message), '_blank');
          }}
        />
      )}
    </div>
  );
}
