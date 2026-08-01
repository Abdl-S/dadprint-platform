'use client';

import { useState } from 'react';
import { CALL_NUMBER } from '@/lib/whatsapp';

export default function AdminParametresPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-ink-70">Coordonnées, identité et règles globales de la plateforme.</p>

      <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="space-y-6">
        <section className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Coordonnées</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input defaultValue={CALL_NUMBER} placeholder="Téléphone" aria-label="Téléphone" className="rounded-md border border-ink-15 p-3 text-sm" />
            <input defaultValue={CALL_NUMBER} placeholder="WhatsApp" aria-label="WhatsApp" className="rounded-md border border-ink-15 p-3 text-sm" />
            <input defaultValue="contact@dadprint.mr" placeholder="Email" aria-label="Email" className="rounded-md border border-ink-15 p-3 text-sm" />
            <input defaultValue="Nouakchott, Mauritanie" placeholder="Adresse" aria-label="Adresse" className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Lien Google Maps" aria-label="Lien Google Maps" className="rounded-md border border-ink-15 p-3 text-sm sm:col-span-2" />
          </div>
        </section>

        <section className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Réseaux sociaux</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Instagram" aria-label="Instagram" className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder="Facebook" aria-label="Facebook" className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
        </section>

        <section className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Identité visuelle</h3>
          <p className="mb-3 text-xs text-ink-40">Le logo officiel et les couleurs de la charte restent protégés — non modifiables ici.</p>
          <div className="flex items-center gap-4">
            <img src="/brand/dadprint-logo.jpg" alt="Logo" className="h-12 rounded-md border border-ink-8" />
            <div className="flex gap-2">
              <span className="h-8 w-8 rounded-md" style={{ background: '#221E1F' }} title="Ink" />
              <span className="h-8 w-8 rounded-md" style={{ background: '#EA0E8A' }} title="Magenta" />
              <span className="h-8 w-8 rounded-md" style={{ background: '#15A1D6' }} title="Cyan" />
              <span className="h-8 w-8 rounded-md border border-ink-8" style={{ background: '#EFEB41' }} title="Jaune" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-bold">Langues, monnaie & commerce</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1.5 block font-semibold">Langues actives</span>
              <div className="flex gap-2 text-xs font-bold">
                <span className="rounded-full bg-ink px-3 py-1.5 text-paper">FR</span>
                <span className="rounded-full bg-ink px-3 py-1.5 text-paper">EN</span>
                <span className="rounded-full bg-ink px-3 py-1.5 text-paper">AR</span>
              </div>
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block font-semibold">Monnaie</span>
              <select aria-label="Monnaie" className="w-full rounded-md border border-ink-15 p-3 text-sm"><option>MRU — Ouguiya</option></select>
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block font-semibold">Taxes</span>
              <input placeholder="0%" aria-label="0%" className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-lg bg-brand-magenta px-6 py-3 text-sm font-bold text-white shadow-glow">
          {saved ? '✓ Enregistré' : 'Enregistrer les paramètres'}
        </button>
      </form>
    </div>
  );
}
