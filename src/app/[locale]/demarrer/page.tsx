'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { wizardProjects, packs } from '@/lib/mock/packs';
import { products } from '@/lib/mock/data';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { Locale } from '@/types';

/**
 * Assistant de démarrage — une question, une recommandation immédiate.
 * `wizardProjects` fait le lien entre un type de projet et des produits/packs
 * existants ; l'admin pourra enrichir ces recommandations sans toucher à l'UI.
 */
export default function DemarrerPage() {
  const t = useTranslations('wizardPage');
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<string | null>(null);

  const project = wizardProjects.find((w) => w.key === selected);
  const recommendedProducts = project ? products.filter((p) => project.recommendedProductSlugs.includes(p.slug)) : [];
  const recommendedPack = project?.recommendedPackSlug ? packs.find((p) => p.slug === project.recommendedPackSlug) : null;

  return (
    <Section className="pt-12">
      <Container className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
        <h1 className="mt-2 text-4xl font-black">{t('question')}</h1>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {wizardProjects.map((w) => (
            <button
              key={w.key}
              onClick={() => setSelected(w.key)}
              className={`rounded-md border-2 p-4 text-sm font-bold transition-colors ${
                selected === w.key ? 'border-ink bg-ink text-paper' : 'border-ink-15 hover:border-ink-40'
              }`}
            >
              {w.label[locale]}
            </button>
          ))}
        </div>

        {project && (
          <div className="mt-12 rounded-lg border border-ink-8 p-6">
            <h2 className="text-lg font-bold">{t('recommendationTitle', { project: project.label[locale] })}</h2>

            {recommendedPack && (
              <Link href={`/packs/${recommendedPack.slug}`} className="mt-4 flex items-center gap-3 rounded-md bg-ink-8 p-3">
                <img src={recommendedPack.coverImageUrl} alt="" className="h-14 w-14 rounded object-cover" />
                <div>
                  <p className="text-xs font-bold uppercase text-brand-magenta">{t('recommendedPack')}</p>
                  <p className="font-bold text-sm">{recommendedPack.name[locale]}</p>
                </div>
              </Link>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {recommendedProducts.map((p) => (
                <Link key={p.id} href={`/produits/${p.slug}`} className="overflow-hidden rounded-lg border border-ink-8 shadow-soft bg-white">
                  <img src={p.images[0]} alt={p.name[locale]} className="aspect-[4/3] w-full object-cover" />
                  <div className="p-2.5"><p className="text-xs font-bold">{p.name[locale]}</p></div>
                </Link>
              ))}
            </div>

            <Button
              href={buildWhatsAppUrl({
                intent: 'devis',
                productName: `${project.label[locale]} — ${[recommendedPack?.name[locale], ...recommendedProducts.map((p) => p.name[locale])].filter(Boolean).join(', ')}`,
              })}
              variant="magenta" size="lg" className="mt-6 w-full"
            >
              {t('generateQuoteCta')}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
