'use client';

import { useState } from 'react';
import { FileEdit } from 'lucide-react';
import { AdminModal } from '@/components/admin/AdminModal';

const editablePages = [
  { key: 'accueil', label: 'Accueil', fields: ['Titre du Hero', 'Sous-titre', 'Texte "Palette du projet"'] },
  { key: 'a-propos', label: 'À propos', fields: ['Titre', 'Introduction', 'Mission'] },
  { key: 'contact', label: 'Contact', fields: ['Horaires', 'Adresse'] },
  { key: 'faq', label: 'FAQ', fields: ['Questions / réponses'] },
  { key: 'conditions', label: 'Conditions générales', fields: ['Contenu des sections'] },
  { key: 'confidentialite', label: 'Politique de confidentialité', fields: ['Contenu des sections'] },
];

/**
 * Constructeur de pages — édition simplifiée par blocs de texte plutôt qu'un
 * glisser-déposer complet (hors périmètre de cette étape). Chaque page lit
 * déjà son contenu depuis les fichiers de traduction ; brancher ceci à une
 * vraie table Supabase "page_content" ne changera pas le site public.
 */
export default function AdminPagesPage() {
  const [editing, setEditing] = useState<(typeof editablePages)[number] | null>(null);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-70">Modifiez le contenu des pages principales sans écrire de code.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {editablePages.map((p) => (
          <button
            key={p.key} onClick={() => setEditing(p)}
            className="flex items-center gap-3 rounded-lg border border-ink-8 bg-white p-5 text-start shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <FileEdit size={18} className="text-brand-magenta" />
            <div>
              <p className="font-bold">{p.label}</p>
              <p className="text-xs text-ink-40">{p.fields.length} blocs modifiables</p>
            </div>
          </button>
        ))}
      </div>

      <AdminModal open={!!editing} onClose={() => setEditing(null)} title={editing?.label ?? ''}>
        {editing && (
          <div className="space-y-3">
            {editing.fields.map((f) => (
              <label key={f} className="block text-sm">
                <span className="mb-1.5 block font-semibold">{f}</span>
                <textarea rows={2} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              </label>
            ))}
            <button onClick={() => setEditing(null)} className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper">Enregistrer</button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
