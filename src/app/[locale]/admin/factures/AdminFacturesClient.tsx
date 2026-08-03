'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Download, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PdfPreviewModal } from '@/components/admin/PdfPreviewModal';
import { buildWhatsAppUrlToClient } from '@/lib/whatsapp';
import type { AdminInvoiceRow, AdminOrderRow } from '@/lib/data/admin';

interface Line { qty: number; description: string; unitPrice: number }

export function AdminFacturesClient({ initial, orders }: { initial: AdminInvoiceRow[]; orders: AdminOrderRow[] }) {
  const [invoices, setInvoices] = useState<AdminInvoiceRow[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState('');
  const [lines, setLines] = useState<Line[]>([{ qty: 1, description: '', unitPrice: 0 }]);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ invoice: AdminInvoiceRow; url: string; fileName: string } | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  async function markPaid(id: string, status: 'en_attente' | 'payee') {
    const previous = invoices;
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    if (!res.ok) { setInvoices(previous); alert('La mise à jour a échoué.'); }
  }

  async function generateAndPreview(inv: AdminInvoiceRow) {
    setPdfLoadingId(inv.id);
    try {
      const res = await fetch(`/api/admin/invoices/${inv.id}/pdf`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Échec de la génération du PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreview({ invoice: inv, url, fileName: `${inv.reference}.pdf` });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setPdfLoadingId(null);
    }
  }

  async function createInvoice() {
    const validLines = lines.filter((l) => l.description.trim() && l.unitPrice > 0);
    if (validLines.length === 0) { setSaveError('Ajoutez au moins une ligne avec une description et un prix.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderReference: orderReference || null, lines: validLines }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { reference, amount } = await res.json();
      const order = orders.find((o) => o.reference === orderReference);
      setInvoices((prev) => [{
        id: reference, reference, orderReference: orderReference || null,
        clientName: order?.clientName ?? '—', amount,
        status: 'en_attente', issuedAt: new Date().toISOString(),
      }, ...prev]);
      setModalOpen(false);
      setOrderReference('');
      setLines([{ qty: 1, description: '', unitPrice: 0 }]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{invoices.length} factures.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow">
          <Plus size={16} /> Nouvelle facture
        </button>
      </div>

      <AdminTable headers={['Référence', 'Commande liée', 'Client', 'Montant', 'Statut', 'Date', '']}>
        {invoices.map((inv) => (
          <tr key={inv.id}>
            <td className="px-4 py-3 font-mono text-xs">{inv.reference}</td>
            <td className="px-4 py-3 font-mono text-xs text-ink-40">{inv.orderReference ?? '—'}</td>
            <td className="px-4 py-3">{inv.clientName}</td>
            <td className="px-4 py-3 font-semibold">{inv.amount.toLocaleString('fr-FR')} MRU</td>
            <td className="px-4 py-3"><StatusBadge label={inv.status === 'payee' ? 'Payée' : 'En attente'} className={inv.status === 'payee' ? 'bg-success/10 text-success' : 'bg-ink-8 text-ink'} /></td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(inv.issuedAt).toLocaleDateString('fr-FR')}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2.5">
                <button title="Aperçu du PDF" disabled={pdfLoadingId === inv.id} onClick={() => generateAndPreview(inv)} className="text-ink-40 hover:text-ink disabled:opacity-40">
                  {pdfLoadingId === inv.id ? '…' : <Download size={14} />}
                </button>
                {inv.status !== 'payee' && (
                  <button title="Marquer payée" onClick={() => markPaid(inv.id, 'payee')} className="text-ink-40 hover:text-ink"><CheckCircle2 size={16} /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle facture" wide>
        <div className="space-y-4">
          <select aria-label="Commande liée" value={orderReference} onChange={(e) => setOrderReference(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm">
            <option value="">— Commande (optionnel) —</option>
            {orders.map((o) => <option key={o.reference} value={o.reference}>{o.reference} — {o.clientName}</option>)}
          </select>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-40">Détail de la facture</p>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[60px_1fr_110px_110px_32px] items-center gap-2">
                  <input type="number" min={1} value={line.qty} aria-label="Quantité" onChange={(e) => updateLine(i, { qty: Number(e.target.value) })} className="rounded-md border border-ink-15 p-2 text-sm" />
                  <input placeholder="Description" aria-label="Description" value={line.description} onChange={(e) => updateLine(i, { description: e.target.value })} className="rounded-md border border-ink-15 p-2 text-sm" />
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

          <div className="flex items-center justify-between rounded-md bg-ink-8 p-3">
            <span className="text-sm font-bold">Total</span>
            <span className="text-sm font-bold">{lines.reduce((s, l) => s + l.qty * l.unitPrice, 0).toLocaleString('fr-FR')} MRU</span>
          </div>

          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={createInvoice} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Création...' : 'Créer la facture'}</button>
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
            const order = orders.find((o) => o.reference === preview.invoice.orderReference);
            const phone = order?.clientPhone;
            if (!phone) { alert("Aucun numéro de téléphone associé à cette facture."); return; }
            // WhatsApp ne permet pas de joindre un fichier depuis un lien — le PDF a déjà été
            // téléchargé ci-dessus, il ne reste qu'à le glisser dans la conversation qui s'ouvre ici.
            const message = `Bonjour ${preview.invoice.clientName},\n\nVoici votre facture DadPrint (réf. ${preview.invoice.reference}), en pièce jointe.\n\nMerci de votre confiance.\nL'équipe DadPrint`;
            window.open(buildWhatsAppUrlToClient(phone, message), '_blank');
          }}
        />
      )}
    </div>
  );
}
