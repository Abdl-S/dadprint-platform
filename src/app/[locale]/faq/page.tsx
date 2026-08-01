'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { homeFaq } from '@/lib/mock/data';
import type { Locale } from '@/types';

/** FAQ dédiée — mêmes données que la section d'accueil, présentées en profondeur. */
export default function FaqPage() {
  const t = useTranslations('faq');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('pageSubtitle')}</p>

        <div className="mt-10 divide-y divide-ink-8">
          {homeFaq.map((item, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-start font-bold"
                aria-expanded={open === i}
              >
                {item.question[locale]}
                <Plus size={18} className={`shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`} />
              </button>
              {open === i && <p className="mt-3 max-w-xl text-sm text-ink-70">{item.answer[locale]}</p>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
