'use client';

import { useState } from 'react';
import { Plus, Send, CheckCircle2, Download } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { DocumentPdfModal } from '@/components/admin/DocumentPdfModal';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { buildWhatsAppUrlToClient } from '@/lib/whatsapp';
import type { AdminInvoiceRow } from '@/lib/data/admin';
import type { AdminOrderRow } from '@/lib/data/admin';

export function AdminFacturesClient({ initial, orders }: { initial: AdminInvoiceRow[]; orders: AdminOrderRow[] }) {
  const [invoices, setInvoices] = useState<AdminInvoiceRow[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfTarget, setPdfTarget] = useState<AdminInvoiceRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ orderReference: '', amount: '' });

  async function markPaid(id: string, status: 'en_attente' | 'payee') {
    const previous = invoices;
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    if (!res.ok) { setInvoices(previous); alert('La mise à jour a échoué.'); }
  }

  function sendInvoice(invoice: AdminInvoiceRow) {
    const order = orders.find((o) => o.reference === invoice.orderReference);
    const phone = order?.clientPhone;
    if (!phone) { alert("Aucun numéro de téléphone associé à cette facture."); return; }
    const message = `Bonjour ${invoice.clientName},\n\nVoici votre facture DadPrint (réf. ${invoice.reference})${invoice.orderReference ? ` pour la commande ${invoice.orderReference}` : ''}.\n\nMontant : ${invoice.amount.toLocaleString('fr-FR')} MRU\n\nMerci de votre confiance.\nL'équipe DadPrint`;
    window.open(buildWhatsAppUrlToClient(phone, message), '_blank');
  }

  async function createInvoice() {
    if (!form.amount) { setSaveError('Le montant est requis.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderReference: form.orderReference || null, amount: Number(form.amount) }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { reference } = await res.json();
      const order = orders.find((o) => o.reference === form.orderReference);
      setInvoices((prev) => [{
        id: reference, reference, orderReference: form.orderReference || null,
        clientName: order?.clientName ?? '—', amount: Number(form.amount),
        status: 'en_attente', issuedAt: new Date().toISOString(),
      }, ...prev]);
      setModalOpen(false);
      setForm({ orderReference: '', amount: '' });
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
                <button title="Envoyer sur WhatsApp" onClick={() => sendInvoice(inv)} className="text-success hover:text-success/70"><Send size={14} /></button>
                <button title="Télécharger le PDF" onClick={() => setPdfTarget(inv)} className="text-ink-40 hover:text-ink"><Download size={14} /></button>
                {inv.status !== 'payee' && (
                  <button title="Marquer payée" onClick={() => markPaid(inv.id, 'payee')} className="text-ink-40 hover:text-ink"><CheckCircle2 size={16} /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle facture">
        <div className="space-y-3">
          <select aria-label="Commande liée" value={form.orderReference} onChange={(e) => setForm({ ...form, orderReference: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm">
            <option value="">— Commande (optionnel) —</option>
            {orders.map((o) => <option key={o.reference} value={o.reference}>{o.reference} — {o.clientName}</option>)}
          </select>
          <input type="number" placeholder="Montant (MRU)" aria-label="Montant" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          {saveError && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>}
          <button onClick={createInvoice} disabled={saving} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">{saving ? 'Création...' : 'Créer la facture'}</button>
        </div>
      </AdminModal>

      {pdfTarget && (
        <DocumentPdfModal
          open={!!pdfTarget}
          onClose={() => setPdfTarget(null)}
          title={`PDF — Facture ${pdfTarget.reference}`}
          onGenerate={async (lines) => {
            const res = await fetch(`/api/admin/invoices/${pdfTarget.id}/pdf`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lines }),
            });
            if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la génération');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${pdfTarget.reference}.pdf`; a.click();
            URL.revokeObjectURL(url);
          }}
        />
      )}
    </div>
  );
}
