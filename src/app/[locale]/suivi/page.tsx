'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { StatusTimeline } from '@/components/tracking/StatusTimeline';
import type { TrackingStep } from '@/types';

/**
 * Suivi public par numéro de référence — pas de compte requis, cherche
 * réellement dans dp_orders puis dp_quotes selon le préfixe de la référence
 * (DP-CMD-... / DP-DEV-...), avec repli sur l'autre table si le préfixe ne
 * suffit pas à trancher.
 */

// Les statuts réels de la base (dp_order_statuses) ne portent pas exactement
// les mêmes clés que le composant visuel de suivi (conçu avant le vrai
// schéma) — cette table fait la correspondance sans avoir à changer l'un ou l'autre.
const orderStatusToStep: Record<string, TrackingStep> = {
  nouveau: 'demande_recue',
  en_attente: 'devis_envoye',
  paiement_recu: 'paiement_valide',
  design: 'conception',
  bat: 'validation_bat',
  impression: 'impression',
  controle_qualite: 'controle_qualite',
  livraison: 'livraison',
  terminee: 'terminee',
  annulee: 'demande_recue',
};

const quoteStatusLabels: Record<string, string> = {
  nouveau: 'Nouveau — en cours d\'examen',
  en_cours: 'En cours de préparation',
  envoye: 'Devis envoyé, en attente de votre réponse',
  accepte: 'Accepté — conversion en commande en cours',
  refuse: 'Refusé',
};

type Result =
  | { kind: 'order'; reference: string; status: string; date: string }
  | { kind: 'quote'; reference: string; status: string; date: string }
  | null
  | undefined;

export default function SuiviPage() {
  const t = useTranslations('trackingPage');
  const tSteps = useTranslations('tracking');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Result>(undefined);
  const [searching, setSearching] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const ref = query.trim().toUpperCase();
    if (!ref) return;

    setSearching(true);
    setResult(undefined);

    // Cherche d'abord dans le type indiqué par le préfixe, puis dans l'autre par sécurité
    const tryOrder = async () => {
      const res = await fetch(`/api/orders/${encodeURIComponent(ref)}`);
      return res.ok ? { kind: 'order' as const, ...(await res.json()) } : null;
    };
    const tryQuote = async () => {
      const res = await fetch(`/api/quotes/${encodeURIComponent(ref)}`);
      return res.ok ? { kind: 'quote' as const, ...(await res.json()) } : null;
    };

    const [first, second] = ref.includes('-DEV-') ? [tryQuote, tryOrder] : [tryOrder, tryQuote];
    const found = (await first()) ?? (await second());
    setResult(found);
    setSearching(false);
  }

  return (
    <Section className="pt-12">
      <Container className="max-w-xl">
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle')}</p>

        <form onSubmit={search} className="mt-8 flex gap-2">
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            className="w-full rounded-md border border-ink-15 p-3 text-sm font-mono"
          />
          <Button type="submit" loading={searching} disabled={searching}><Search size={16} /></Button>
        </form>
        <p className="mt-2 text-xs text-ink-40">{t('demoHint')} <code className="font-mono">DP-CMD-20260728-1042</code></p>

        {result === null && (
          <p className="mt-8 rounded-md bg-ink-8 p-4 text-sm text-ink-70">{t('notFound')}</p>
        )}

        {result?.kind === 'order' && (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between rounded-lg border border-ink-8 shadow-soft bg-white p-4">
              <p className="font-mono text-xs text-ink-40">{result.reference}</p>
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">
                {tSteps(`steps.${orderStatusToStep[result.status] ?? 'demande_recue'}`)}
              </span>
            </div>
            <StatusTimeline currentStep={orderStatusToStep[result.status] ?? 'demande_recue'} completedSteps={[]} />
          </div>
        )}

        {result?.kind === 'quote' && (
          <div className="mt-10 rounded-lg border border-ink-8 shadow-soft bg-white p-5">
            <p className="font-mono text-xs text-ink-40">{result.reference}</p>
            <p className="mt-2 font-bold">{quoteStatusLabels[result.status] ?? result.status}</p>
            <p className="mt-3 text-xs text-ink-40">Envoyé le {new Date(result.date).toLocaleDateString('fr-FR')}</p>
          </div>
        )}
      </Container>
    </Section>
  );
}
