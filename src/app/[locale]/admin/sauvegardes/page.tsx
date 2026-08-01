'use client';

import { useState, useRef } from 'react';
import { Download, Upload, CheckCircle2 } from 'lucide-react';
import { categories, products } from '@/lib/mock/data';
import { packs } from '@/lib/mock/packs';
import { adminOrders, adminQuotes, crmClients } from '@/lib/mock/admin';

/**
 * Sauvegarde / Export / Import — export réel de toutes les données de
 * démonstration en JSON téléchargeable. L'import lit un fichier JSON et
 * affiche un résumé de ce qui serait restauré ; la restauration réelle en
 * base viendra avec Supabase (même format de fichier, donc compatible).
 */
export default function AdminSauvegardesPage() {
  const [imported, setImported] = useState<Record<string, number> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportBackup() {
    const payload = {
      exportedAt: new Date().toISOString(),
      categories, products, packs, orders: adminOrders, quotes: adminQuotes, clients: crmClients,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dadprint-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        setImported({
          Catégories: data.categories?.length ?? 0, Produits: data.products?.length ?? 0,
          Packs: data.packs?.length ?? 0, Commandes: data.orders?.length ?? 0,
          Devis: data.quotes?.length ?? 0, Clients: data.clients?.length ?? 0,
        });
      } catch {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-lg border border-ink-8 bg-white p-6 shadow-soft">
        <h3 className="font-bold">Sauvegarde complète</h3>
        <p className="mt-1.5 text-sm text-ink-70">Télécharge un fichier JSON avec l'ensemble des données actuelles (catégories, produits, packs, commandes, devis, clients).</p>
        <button onClick={exportBackup} className="mt-4 flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-paper">
          <Download size={16} /> Télécharger la sauvegarde
        </button>
      </div>

      <div className="rounded-lg border border-ink-8 bg-white p-6 shadow-soft">
        <h3 className="font-bold">Restauration / Import</h3>
        <p className="mt-1.5 text-sm text-ink-70">Sélectionne un fichier de sauvegarde pour prévisualiser son contenu.</p>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="mt-4 flex items-center gap-2 rounded-lg border-2 border-ink px-5 py-3 text-sm font-bold">
          <Upload size={16} /> Choisir un fichier
        </button>

        {imported && (
          <div className="mt-4 rounded-md bg-success/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-success"><CheckCircle2 size={15} /> Fichier lu avec succès</p>
            <ul className="space-y-1 text-xs text-ink-70">
              {Object.entries(imported).map(([k, v]) => <li key={k}>• {k} : {v} enregistrements</li>)}
            </ul>
            <p className="mt-3 text-[11px] text-ink-40">La restauration réelle en base sera activée avec la connexion Supabase — ce fichier est déjà au bon format.</p>
          </div>
        )}
      </div>
    </div>
  );
}
