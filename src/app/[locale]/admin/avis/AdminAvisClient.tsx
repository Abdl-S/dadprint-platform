'use client';

import { useState } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import type { AdminReviewRow } from '@/lib/data/admin';

export function AdminAvisClient({ initial }: { initial: AdminReviewRow[] }) {
  const [reviews, setReviews] = useState<AdminReviewRow[]>(initial);

  async function setModeration(id: string, moderation: AdminReviewRow['moderation']) {
    const previous = reviews;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, moderation } : r)));
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moderation }),
    });
    if (!res.ok) { setReviews(previous); alert('La mise à jour a échoué.'); }
  }

  async function saveComment(id: string, comment: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, comment } : r)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment }),
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">{reviews.length} avis — approuver, refuser, corriger l'orthographe, répondre.</p>

      <AdminTable headers={['Avis', 'Note', 'Contexte', 'Statut', '']}>
        {reviews.map((r) => (
          <tr key={r.id}>
            <td className="max-w-xs px-4 py-3">
              <textarea
                defaultValue={r.comment}
                onBlur={(e) => saveComment(r.id, e.target.value)}
                rows={2}
                className="w-full rounded-md border border-transparent bg-transparent p-1 text-xs hover:border-ink-15 focus:border-ink-15"
              />
            </td>
            <td className="px-4 py-3"><RatingStars rating={r.rating} size={13} /></td>
            <td className="px-4 py-3 text-xs text-ink-40">{r.authorContext}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={r.moderation === 'approuve' ? 'Publié' : r.moderation === 'refuse' ? 'Refusé' : 'En attente'}
                className={r.moderation === 'approuve' ? 'bg-success/10 text-success' : r.moderation === 'refuse' ? 'bg-danger/10 text-danger' : 'bg-brand-yellow/20 text-ink-70'}
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2.5">
                <button title="Approuver" onClick={() => setModeration(r.id, 'approuve')} className="text-success"><Check size={16} /></button>
                <button title="Refuser" onClick={() => setModeration(r.id, 'refuse')} className="text-danger"><X size={16} /></button>
                <button title="Répondre"><MessageSquare size={14} className="text-ink-40" /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
