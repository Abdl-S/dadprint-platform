'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

/**
 * Assistant IA destiné aux visiteurs — emplacement fonctionnel (ouverture/
 * fermeture réelles), contenu non branché à un vrai modèle pour l'instant.
 * Desktop uniquement, comme `FloatingActions` — sur mobile, cette bulle en
 * plus de la barre du bas rendait la navigation encombrée. Elle réapparaîtra
 * sur mobile le jour où elle sera vraiment fonctionnelle, avec une vraie
 * place pensée pour elle plutôt qu'empilée sur les autres actions.
 */
export function VisitorAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden lg:block">
      {open && (
        <div className="fixed bottom-24 end-5 z-40 w-72 rounded-lg border border-ink-8 bg-white p-4 shadow-raised">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-brand-magenta" />
              <p className="text-sm font-bold">Assistant DadPrint</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer"><X size={16} /></button>
          </div>
          <p className="mt-3 text-xs text-ink-70">
            Bientôt disponible : posez vos questions sur nos produits, délais ou tarifs, et recevez une réponse immédiate.
          </p>
          <p className="mt-3 rounded-md bg-ink-8 p-2 text-[11px] text-ink-40">
            En attendant, utilisez le bouton WhatsApp — une vraie personne vous répond.
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Assistant DadPrint"
        className="fixed bottom-[152px] end-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-transform hover:scale-105"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
