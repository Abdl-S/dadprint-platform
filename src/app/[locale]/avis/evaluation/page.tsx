'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PackageCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { InteractiveRating } from '@/components/ui/InteractiveRating';
import { FileUpload } from '@/components/order/FileUpload';
import type { SatisfactionRatingCategories } from '@/types';

/**
 * Page ouverte via le lien envoyé après une livraison (?commande=DP-CMD-...).
 * Si une référence est présente dans l'URL, la commande est retrouvée
 * automatiquement et l'avis lui est rattaché (visible ensuite pour l'équipe
 * en modération, avec le contexte de la commande). Sans référence, le
 * formulaire reste utilisable normalement (avis général, non lié).
 * Le commentaire est stocké "en attente" et validé depuis l'administration
 * avant publication — jamais publié directement sans modération.
 */
export default function AvisPage() {
  return (
    <Suspense fallback={null}>
      <AvisPageContent />
    </Suspense>
  );
}

function AvisPageContent() {
  const t = useTranslations('satisfaction');
  const searchParams = useSearchParams();
  const orderReference = searchParams.get('commande');

  const [orderContext, setOrderContext] = useState<{ id: string; productName: string | null } | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(!!orderReference);

  const [ratings, setRatings] = useState<SatisfactionRatingCategories>({
    qualite: 0, delais: 0, communication: 0, livraison: 0, design: 0,
  });
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-spam
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderReference) return;
    fetch(`/api/orders/${encodeURIComponent(orderReference)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOrderContext(data ? { id: data.id, productName: data.productName } : null))
      .finally(() => setLoadingOrder(false));
  }, [orderReference]);

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
          orderId: orderContext?.id ?? undefined,
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

        {orderReference && !loadingOrder && orderContext && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
            <PackageCheck size={20} className="shrink-0 text-success" />
            <div>
              <p className="text-sm font-bold">{t('orderContextTitle')}</p>
              <p className="font-mono text-xs text-ink-40">
                {orderReference}{orderContext.productName ? ` — ${orderContext.productName}` : ''}
              </p>
            </div>
          </div>
        )}
        {orderReference && !loadingOrder && !orderContext && (
          <p className="mt-5 rounded-md bg-ink-8 p-3 text-xs text-ink-70">{t('orderNotFound')}</p>
        )}

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
