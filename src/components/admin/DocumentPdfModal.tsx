'use client';

import { useState } from 'react';
import { Trash2, Plus, Download } from 'lucide-react';
import { AdminModal } from './AdminModal';

interface Line { qty: number; description: string; unitPrice: number }

/**
 * Modale partagée entre Devis et Factures — le montant n'existe pas encore
 * sur la fiche devis/commande (aucun champ prix n'y a été construit), donc
 * l'équipe saisit les lignes ici au moment de générer le document, plutôt
 * que de deviner un prix à l'avance. Génère et télécharge un vrai PDF dans
 * le modèle DadPrint existant (fourni en exemple).
 */
export function DocumentPdfModal({
  open, onClose, onGenerate, title,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (lines: Line[]) => Promise<void>;
  title: string;
}) {
  const [lines, setLines] = useState<Line[]>([{ qty: 1, description: '', unitPrice: 0 }]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  const total = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

  async function handleGenerate() {
    const valid = lines.filter((l) => l.description.trim() && l.unitPrice > 0);
    if (valid.length === 0) { setError('Ajoutez au moins une ligne avec une description et un prix.'); return; }
    setGenerating(true);
    setError(null);
    try {
      await onGenerate(valid);
      setLines([{ qty: 1, description: '', unitPrice: 0 }]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la génération du PDF.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={title} wide>
      <div className="space-y-3">
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_110px_110px_32px] items-center gap-2">
            <input
              type="number" min={1} value={line.qty} aria-label="Quantité"
              onChange={(e) => updateLine(i, { qty: Number(e.target.value) })}
              className="rounded-md border border-ink-15 p-2 text-sm"
            />
            <input
              placeholder="Description" aria-label="Description" value={line.description}
              onChange={(e) => updateLine(i, { description: e.target.value })}
              className="rounded-md border border-ink-15 p-2 text-sm"
            />
            <input
              type="number" placeholder="P.U (MRU)" aria-label="Prix unitaire" value={line.unitPrice || ''}
              onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })}
              className="rounded-md border border-ink-15 p-2 text-sm"
            />
            <p className="text-sm text-ink-40">{(line.qty * line.unitPrice).toLocaleString('fr-FR')} MRU</p>
            <button
              type="button" onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={lines.length === 1}
              className="text-danger disabled:opacity-30"
              aria-label="Retirer cette ligne"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, { qty: 1, description: '', unitPrice: 0 }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-magenta"
        >
          <Plus size={14} /> Ajouter une ligne
        </button>

        <div className="flex items-center justify-between rounded-md bg-ink-8 p-3">
          <span className="text-sm font-bold">Total</span>
          <span className="text-sm font-bold">{total.toLocaleString('fr-FR')} MRU</span>
        </div>

        {error && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

        <button
          onClick={handleGenerate} disabled={generating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60"
        >
          <Download size={15} /> {generating ? 'Génération...' : 'Générer et télécharger le PDF'}
        </button>
      </div>
    </AdminModal>
  );
}
