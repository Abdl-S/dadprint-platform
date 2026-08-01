'use client';

import { useState } from 'react';
import { Send, ArrowRightCircle, Download, Printer } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { AdminQuoteRow } from '@/lib/data/admin';
type AdminQuote = AdminQuoteRow & { status: 'nouveau' | 'en_cours' | 'envoye' | 'accepte' | 'refuse' };

const statusColors: Record<AdminQuote['status'], string> = {
  nouveau: 'bg-ink-8 text-ink', en_cours: 'bg-brand-yellow/20 text-ink-70', envoye: 'bg-brand-cyan/15 text-brand-cyan',
  accepte: 'bg-success/10 text-success', refuse: 'bg-danger/10 text-danger',
};
const statusLabels: Record<AdminQuote['status'], string> = {
  nouveau: 'Nouveau', en_cours: 'En cours', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé',
};

export function AdminDevisClient({ initial }: { initial: AdminQuoteRow[] }) {
  const [quotes, setQuotes] = useState<AdminQuote[]>(initial as AdminQuote[]);

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

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{quotes.length} devis — répondre, convertir, suivre l'historique complet.</p>

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
                <button title="Envoyer" className="text-ink-40 hover:text-ink"><Send size={14} /></button>
                <button title="Télécharger" className="text-ink-40 hover:text-ink"><Download size={14} /></button>
                <button title="Imprimer" className="text-ink-40 hover:text-ink"><Printer size={14} /></button>
                <button title="Convertir en commande" onClick={() => convertToOrder(q.reference)} className="text-brand-magenta"><ArrowRightCircle size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
