import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { PenTool, Printer, Truck, HeartHandshake } from 'lucide-react';
import type { Locale } from '@/types';

export default async function AProposPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('aboutPage');
  const pillars = [
    { key: 'design', icon: PenTool },
    { key: 'print', icon: Printer },
    { key: 'delivery', icon: Truck },
    { key: 'support', icon: HeartHandshake },
  ] as const;

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-black sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 text-lg text-ink-70">{t('intro')}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {pillars.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-lg border border-ink-8 p-5">
              <Icon size={22} className="text-brand-magenta" />
              <h3 className="mt-3 font-bold">{t(`${key}Title`)}</h3>
              <p className="mt-1.5 text-sm text-ink-70">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-ink p-8 text-paper">
          <p className="text-xl font-bold">{t('mission')}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/produits" variant="magenta">{t('ctaCatalog')}</Button>
          <Button href="/contact" variant="outline">{t('ctaContact')}</Button>
        </div>
      </Container>
    </Section>
  );
}
