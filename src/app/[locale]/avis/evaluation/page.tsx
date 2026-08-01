'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { InteractiveRating } from '@/components/ui/InteractiveRating';
import { FileUpload } from '@/components/order/FileUpload';
import type { SatisfactionRatingCategories } from '@/types';

/**
 * Page ouverte automatiquement via le lien envoyé après une livraison
 * (ex: /avis?commande=XYZ — la logique d'envoi automatique sera un module
 * séparé, déclenché quand une commande passe au statut "livrée").
 * Le commentaire est stocké "en attente" et validé depuis l'administration
 * avant publication — jamais publié directement sans modération.
 */
export default function AvisPage() {
  const t = useTranslations('satisfaction');
  const [ratings, setRatings] = useState<SatisfactionRatingCategories>({
    qualite: 0, delais: 0, communication: 0, livraison: 0, design: 0,
  });
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-spam
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories: { key: keyof SatisfactionRatingCategories; label: string }[] = [
    { key: 'qualite', label: t('quality') },
    { key: 'delais', label: t('delay') },
    { key: 'communication', label: t('communication') },
    { key: 'livraison', label: t('delivery') },
    { key: 'design', label: t('design') },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot rempli → abandon silencieux

    setSubmitting(true);
    setSubmitError(null);

    const values = Object.values(ratings);
    const overallRating = Math.round(values.reduce((s, v) => s + v, 0) / values.length) || 1;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: 'Client vérifié',
          rating: overallRating,
          qualityRating: ratings.qualite,
          delayRating: ratings.delais,
          communicationRating: ratings.communication,
          deliveryRating: ratings.livraison,
          designRating: ratings.design,
          comment,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t('submitError'));
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('submitError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Section className="pt-20 text-center">
        <Container className="max-w-md">
          <h1 className="text-2xl font-black">{t('thanksTitle')}</h1>
          <p className="mt-3 text-ink-70">{t('thanksDesc')}</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-12">
      <Container className="max-w-lg">
        <h1 className="text-3xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle')}</p>

        <form
          className="mt-8 space-y-5 rounded-lg border border-ink-8 p-6"
          onSubmit={handleSubmit}
        >
          {/* Honeypot anti-spam : invisible et hors navigation clavier pour un humain */}
          <input
            type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {categories.map((c) => (
            <InteractiveRating
              key={c.key}
              label={c.label}
              value={ratings[c.key]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [c.key]: v }))}
            />
          ))}
          <textarea
            required rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder={t('commentPlaceholder')}
            className="w-full rounded-md border border-ink-15 p-3 text-sm"
          />
          <div>
            <p className="mb-1.5 text-sm font-semibold">{t('photosLabel')}</p>
            <FileUpload />
          </div>
          {submitError && (
            <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{submitError}</p>
          )}
          <Button type="submit" variant="magenta" className="w-full" loading={submitting} disabled={submitting}>{t('submit')}</Button>
          <p className="text-center text-xs text-ink-40">{t('moderationNote')}</p>
        </form>
      </Container>
    </Section>
  );
}
