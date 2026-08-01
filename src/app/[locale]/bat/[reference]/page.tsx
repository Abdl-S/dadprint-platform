'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, MessageSquareWarning, ZoomIn, Download, X } from 'lucide-react';
import { batMockups } from '@/lib/mock/tracking';
import type { Locale } from '@/types';

/**
 * Validation du BAT (Bon À Tirer) — le client approuve ou demande une
 * modification avant lancement en production. Purement déclaratif pour
 * l'instant ; la décision sera transmise à l'admin une fois connectée.
 */
export default function BatPage({ params: { reference } }: { params: { reference: string; locale: Locale } }) {
  const t = useTranslations('batPage');
  const locale = useLocale() as Locale;
  const mockup = batMockups.find((m) => m.reference === reference);
  const [decision, setDecision] = useState<'approuve' | 'modification_demandee' | null>(null);
  const [comment, setComment] = useState('');
  const [zoomed, setZoomed] = useState(false);

  if (!mockup) return notFound();

  if (decision) {
    return (
      <Section className="pt-20 text-center">
        <Container className="max-w-md">
          {decision === 'approuve' ? (
            <CheckCircle2 size={40} className="mx-auto text-success" />
          ) : (
            <MessageSquareWarning size={40} className="mx-auto text-brand-magenta" />
          )}
          <h1 className="mt-5 text-2xl font-black">
            {decision === 'approuve' ? t('approvedTitle') : t('changesRequestedTitle')}
          </h1>
          <p className="mt-3 text-ink-70">
            {decision === 'approuve' ? t('approvedDesc') : t('changesRequestedDesc')}
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-12">
      <Container className="max-w-2xl">
        <p className="font-mono text-xs text-ink-40">{mockup.reference} — {t('versionLabel')} {mockup.version}</p>
        <h1 className="mt-2 text-3xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle', { product: mockup.productName[locale] })}</p>

        <div className="relative mt-8">
          <img src={mockup.imageUrl} alt={mockup.productName[locale]} className="w-full rounded-lg border border-ink-8" />
          <div className="absolute bottom-3 end-3 flex gap-2">
            <button onClick={() => setZoomed(true)} aria-label={t('zoomCta')} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper shadow-md">
              <ZoomIn size={17} />
            </button>
            <a href={mockup.imageUrl} download aria-label={t('downloadCta')} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper shadow-md">
              <Download size={17} />
            </a>
          </div>
        </div>

        {zoomed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6" onClick={() => setZoomed(false)}>
            <button className="absolute end-6 top-6 text-paper" aria-label="Fermer"><X size={28} /></button>
            <img src={mockup.imageUrl} alt={mockup.productName[locale]} className="max-h-full max-w-full object-contain" />
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button variant="magenta" size="lg" onClick={() => setDecision('approuve')}>
            {t('approveCta')}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setDecision('modification_demandee')}>
            {t('requestChangesCta')}
          </Button>
        </div>

        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block font-semibold">{t('commentLabel')}</span>
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
            placeholder={t('commentPlaceholder')}
            className="w-full rounded-md border border-ink-15 p-3"
          />
        </label>
      </Container>
    </Section>
  );
}
