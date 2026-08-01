'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { Locale, Pack, Product } from '@/types';

export function PackDetailClient({ pack, packProducts, locale }: { pack: Pack; packProducts: Product[]; locale: Locale }) {
  const t = useTranslations('packsPage');
  const [selected, setSelected] = useState<string[]>(pack.productSlugs);

  function toggleProduct(s: string) {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  const chosenNames = packProducts.filter((p) => selected.includes(p.slug)).map((p) => p.name[locale]);

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <nav className="mb-6 text-xs text-ink-40">
          <Link href="/packs" className="hover:underline">{t('title')}</Link> / {pack.name[locale]}
        </nav>

        <div className="overflow-hidden rounded-lg">
          <img src={pack.coverImageUrl} alt={pack.name[locale]} className="aspect-[16/7] w-full object-cover" />
        </div>

        <h1 className="mt-6 text-3xl font-black">{pack.name[locale]}</h1>
        <p className="mt-3 text-ink-70">{pack.description[locale]}</p>

        <h2 className="mb-4 mt-8 text-lg font-bold">{t('customize')}</h2>
        <div className="space-y-2.5">
          {packProducts.map((p) => (
            <label
              key={p.slug}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${selected.includes(p.slug) ? 'border-ink' : 'border-ink-15'}`}
            >
              <input type="checkbox" checked={selected.includes(p.slug)} onChange={() => toggleProduct(p.slug)} className="sr-only" />
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${selected.includes(p.slug) ? 'border-ink bg-ink text-paper' : 'border-ink-15'}`}>
                {selected.includes(p.slug) && <Check size={13} />}
              </span>
              <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
              <span className="text-sm font-semibold">{p.name[locale]}</span>
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href={buildWhatsAppUrl({ intent: 'devis', productName: `${pack.name[locale]} (${chosenNames.join(', ')})` })}
            variant="magenta" size="lg"
          >
            {t('requestQuoteCta')}
          </Button>
          <Button
            href={buildWhatsAppUrl({ intent: 'commande', productName: `${pack.name[locale]} (${chosenNames.join(', ')})` })}
            variant="outline" size="lg"
          >
            {t('orderPackCta')}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
