'use client';

import { useState } from 'react';
import { Star, Paperclip, FileText, Download, X, MessageSquareText } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { applyOrderStatusChange } from '@/lib/automation/workflow';
import { logActivity } from '@/lib/logs/store';
import { buildWhatsAppUrlToClient } from '@/lib/whatsapp';
import { useRouter } from '@/i18n/navigation';
import type { AdminOrderRow, OrderStatus } from '@/lib/data/admin';

const paymentLabels: Record<string, string> = {
  now_full: 'Payé maintenant', now_deposit: 'Avance', after_validation: 'Après validation',
};
const paymentColors: Record<string, string> = {
  now_full: 'bg-success/10 text-success', now_deposit: 'bg-brand-yellow/20 text-ink-70', after_validation: 'bg-ink-8 text-ink-70',
};

interface OrderFile { id: string; name: string; mimeType: string | null; sizeBytes: number | null; uploadedAt: string; url: string | null }

export function AdminCommandesClient({ initial, orderStatuses }: { initial: AdminOrderRow[]; orderStatuses: OrderStatus[] }) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initial);
  const [filter, setFilter] = useState<string | null>(null);
  const [filesModal, setFilesModal] = useState<{ order: AdminOrderRow; files: OrderFile[]; loading: boolean } | null>(null);
  const [briefModal, setBriefModal] = useState<AdminOrderRow | null>(null);
  const router = useRouter();

  async function setStatus(ref: string, status: string) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.reference === ref ? { ...o, status } : o)));
    const label = orderStatuses.find((s) => s.key === status)?.label ?? status;

    const res = await fetch(`/api/admin/orders/${ref}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setOrders(previous);
      alert('La mise à jour du statut a échoué. Réessayez.');
      return;
    }

    applyOrderStatusChange(ref, status, label);
    logActivity(`${ref} → ${label}`, 'Commandes');
  }

  function sendReviewLink(order: AdminOrderRow) {
    const link = `${window.location.origin}/avis/evaluation?commande=${encodeURIComponent(order.reference)}`;
    const message = `Bonjour ${order.clientName},\n\nVotre commande DadPrint (réf. ${order.reference}) est arrivée à son terme — merci de votre confiance !\n\nSi vous avez une minute, votre avis nous aide beaucoup :\n${link}\n\nL'équipe DadPrint`;
    window.open(buildWhatsAppUrlToClient(order.clientPhone, message), '_blank');
  }

  async function openFiles(order: AdminOrderRow) {
    setFilesModal({ order, files: [], loading: true });
    const res = await fetch(`/api/admin/orders/${order.id}/files`);
    const { data } = await res.json();
    setFilesModal({ order, files: data ?? [], loading: false });
  }

  function createQuoteFromOrder(order: AdminOrderRow) {
    router.push(`/admin/devis?prefillName=${encodeURIComponent(order.clientName)}&prefillPhone=${encodeURIComponent(order.clientPhone)}&prefillDescription=${encodeURIComponent(order.productName)}`);
  }

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{orders.length} commandes — statuts personnalisables, du premier contact à la livraison.</p>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter(null)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${!filter ? 'bg-ink text-paper' : 'bg-ink-8 text-ink-70'}`}>Toutes</button>
        {orderStatuses.map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${filter === s.key ? 'bg-ink text-paper' : s.color}`}>
            {s.label}
          </button>
        ))}
      </div>

      <AdminTable headers={['Référence', 'Client', 'Produit', 'Qté', 'Montant', 'Paiement', 'Statut', 'Date', '']}>
        {filtered.map((o) => (
          <tr key={o.reference}>
            <td className="px-4 py-3 font-mono text-xs">{o.reference}</td>
            <td className="px-4 py-3">
              <p className="font-semibold">{o.clientName}</p>
              <p className="text-xs text-ink-40">{o.clientPhone}</p>
            </td>
            <td className="px-4 py-3">{o.productName}</td>
            <td className="px-4 py-3">{o.quantity}</td>
            <td className="px-4 py-3 font-semibold">{o.amount.toLocaleString('fr-FR')} MRU</td>
            <td className="px-4 py-3">
              {o.paymentPreference ? (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${paymentColors[o.paymentPreference]}`}>{paymentLabels[o.paymentPreference]}</span>
              ) : <span className="text-xs text-ink-40">—</span>}
            </td>
            <td className="px-4 py-3">
              <select aria-label="Statut de la commande" value={o.status} onChange={(e) => setStatus(o.reference, e.target.value)} className="rounded-full border-0 bg-transparent text-xs font-bold">
                {orderStatuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(o.date).toLocaleDateString('fr-FR')}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2.5">
                {o.fileCount > 0 && (
                  <button title={`${o.fileCount} fichier(s) envoyé(s) par le client`} onClick={() => openFiles(o)} className="relative text-ink-70 hover:text-ink">
                    <Paperclip size={15} />
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-magenta text-[9px] font-bold text-white">{o.fileCount}</span>
                  </button>
                )}
                {o.designBrief && (
                  <button title="Voir le brief du client" onClick={() => setBriefModal(o)} className="text-ink-70 hover:text-ink">
                    <MessageSquareText size={15} />
                  </button>
                )}
                <button title="Créer un devis pour ce client" onClick={() => createQuoteFromOrder(o)} className="text-ink-40 hover:text-ink">
                  <FileText size={15} />
                </button>
                <button title="Envoyer le lien d'avis sur WhatsApp" onClick={() => sendReviewLink(o)} className="text-brand-magenta hover:text-brand-magenta/70">
                  <Star size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {filesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-raised">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">Fichiers — {filesModal.order.reference}</p>
              <button onClick={() => setFilesModal(null)} aria-label="Fermer" className="text-ink-40 hover:text-ink"><X size={18} /></button>
            </div>
            {filesModal.loading && <p className="text-sm text-ink-40">Chargement...</p>}
            {!filesModal.loading && filesModal.files.length === 0 && <p className="text-sm text-ink-40">Aucun fichier.</p>}
            <div className="space-y-2">
              {filesModal.files.map((f) => (
                <a key={f.id} href={f.url ?? '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-md border border-ink-15 p-3 text-sm hover:border-ink-40">
                  <span className="truncate">{f.name}</span>
                  <Download size={14} className="shrink-0 text-ink-40" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-ink-40">Les liens de téléchargement expirent après quelques minutes, par sécurité.</p>
          </div>
        </div>
      )}

      {briefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-raised">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Brief client — {briefModal.reference}</p>
                <p className="text-xs text-ink-40">
                  {briefModal.designChoice === 'needs_design' ? 'A besoin de création' : briefModal.designChoice === 'needs_edit' ? 'Demande une modification' : ''}
                </p>
              </div>
              <button onClick={() => setBriefModal(null)} aria-label="Fermer" className="text-ink-40 hover:text-ink"><X size={18} /></button>
            </div>
            <p className="whitespace-pre-wrap rounded-md bg-ink-8 p-3 text-sm">{briefModal.designBrief}</p>
          </div>
        </div>
      )}
    </div>
  );
}
