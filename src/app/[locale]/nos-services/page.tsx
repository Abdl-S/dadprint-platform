import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { PenTool, Printer, Truck, HeartHandshake } from 'lucide-react';
import type { Locale } from '@/types';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function NosServicesPage({ params: { locale } }: { params: { locale: Locale } }) {
  noStore();
  setRequestLocale(locale);
  const t = await getTranslations('servicesOverview');
  const tPage = await getTranslations('servicesPage');

  const pillars = [
    { key: 'design', icon: PenTool },
    { key: 'print', icon: Printer },
    { key: 'delivery', icon: Truck },
    { key: 'support', icon: HeartHandshake },
  ] as const;

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-4xl font-black sm:text-5xl">{tPage('title')}</h1>
        <p className="mt-4 max-w-lg text-ink-70">{tPage('subtitle')}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-lg border border-ink-8 p-7">
              <Icon size={28} className="text-brand-magenta" />
              <h2 className="mt-4 text-xl font-bold">{t(`${key}Title`)}</h2>
              <p className="mt-2 text-sm text-ink-70">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/produits" variant="magenta" size="lg">{tPage('ctaCatalog')}</Button>
          <Button href="/devis" variant="outline" size="lg">{tPage('ctaQuote')}</Button>
        </div>
      </Container>
    </Section>
  );
}
