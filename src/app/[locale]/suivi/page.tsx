'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { StatusTimeline } from '@/components/tracking/StatusTimeline';
import { trackingRecords } from '@/lib/mock/tracking';
import type { Locale } from '@/types';

/**
 * Suivi public par numéro de référence — pas encore de compte requis.
 * Fonctionne dès aujourd'hui avec les données d'exemple ; le futur module
 * admin alimentera `trackingRecords` depuis de vraies commandes Supabase
 * sans changer cette page.
 */
export default function SuiviPage() {
  const t = useTranslations('trackingPage');
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof trackingRecords[number] | null | undefined>(undefined);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const found = trackingRecords.find((r) => r.reference.toLowerCase() === query.trim().toLowerCase());
    setResult(found ?? null);
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
            className="w-full rounded-md border border-ink-15 p-3 text-sm font-mono"
          />
          <Button type="submit"><Search size={16} /></Button>
        </form>
        <p className="mt-2 text-xs text-ink-40">{t('demoHint')} <code className="font-mono">DP-CMD-20260728-1042</code></p>

        {result === null && (
          <p className="mt-8 rounded-md bg-ink-8 p-4 text-sm text-ink-70">{t('notFound')}</p>
        )}

        {result && (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between rounded-lg border border-ink-8 shadow-soft bg-white p-4">
              <div>
                <p className="font-mono text-xs text-ink-40">{result.reference}</p>
                <p className="font-bold">{result.productName[locale]}</p>
              </div>
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">
                {t(`steps.${result.currentStep}`)}
              </span>
            </div>
            <StatusTimeline currentStep={result.currentStep} completedSteps={result.completedSteps} />
          </div>
        )}
      </Container>
    </Section>
  );
}
