import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import type { Locale } from '@/types';

/**
 * ⚠️ Texte-cadre générique — à faire relire et valider (idéalement par un
 * juriste) avant mise en ligne réelle, notamment les clauses de paiement,
 * livraison et rétractation propres au droit mauritanien.
 */
export default async function ConditionsGeneralesPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('termsPage');

  const sections = ['object', 'orders', 'pricing', 'payment', 'delivery', 'design', 'liability', 'contact'] as const;

  return (
    <Section className="pt-12">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-black">{t('title')}</h1>
        <p className="mt-3 text-xs font-mono text-ink-40">{t('lastUpdated')}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-70">
          {sections.map((key) => (
            <div key={key}>
              <h2 className="mb-2 text-base font-bold text-ink">{t(`${key}Title`)}</h2>
              <p>{t(`${key}Body`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
