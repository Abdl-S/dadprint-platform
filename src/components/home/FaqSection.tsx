'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { homeFaq } from '@/lib/mock/data';
import type { Locale } from '@/types';

export function FaqSection() {
  const t = useTranslations('faq');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
        </div>

        <div className="divide-y divide-ink-8">
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
