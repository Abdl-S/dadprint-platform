'use client';

import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { newsletterSubscribers as initial } from '@/lib/mock/admin';

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState(initial);

  function exportCsv() {
    const csv = 'email,date_inscription\n' + subs.map((s) => `${s.email},${s.subscribedAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-dadprint.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{subs.length} abonnés — prêt pour un futur envoi (Mailchimp, Brevo...).</p>
        <button onClick={exportCsv} className="flex items-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 text-sm font-bold">
          <Download size={16} /> Exporter en CSV
        </button>
      </div>

      <AdminTable headers={['Email', 'Inscrit le', '']}>
        {subs.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-semibold">{s.email}</td>
            <td className="px-4 py-3 text-xs text-ink-40">{new Date(s.subscribedAt).toLocaleDateString('fr-FR')}</td>
            <td className="px-4 py-3"><button onClick={() => setSubs((prev) => prev.filter((x) => x.id !== s.id))}><Trash2 size={14} className="text-danger" /></button></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
