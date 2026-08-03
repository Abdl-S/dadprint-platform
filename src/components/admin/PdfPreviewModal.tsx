'use client';

import { Download, Send, X } from 'lucide-react';

/**
 * Aperçu du PDF avant envoi — affiche le document généré directement dans
 * la page (le navigateur sait nativement afficher un PDF), avec le choix de
 * le télécharger ou de l'envoyer, plutôt que de le télécharger à l'aveugle.
 */
export function PdfPreviewModal({
  pdfUrl, fileName, onClose, onDownload, onSendWhatsApp,
}: {
  pdfUrl: string;
  fileName: string;
  onClose: () => void;
  onDownload: () => void;
  onSendWhatsApp: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-raised">
        <div className="flex items-center justify-between border-b border-ink-8 p-4">
          <p className="font-bold">{fileName}</p>
          <button onClick={onClose} aria-label="Fermer l'aperçu" className="text-ink-40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-ink-8">
          <iframe src={pdfUrl} title={fileName} className="h-[70vh] w-full" />
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-8 p-4 sm:flex-row">
          <button
            onClick={onDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink py-3 text-sm font-bold text-ink"
          >
            <Download size={15} /> Télécharger
          </button>
          <button
            onClick={onSendWhatsApp}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-success py-3 text-sm font-bold text-white"
          >
            <Send size={15} /> Envoyer sur WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
