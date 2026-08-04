import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import type { Locale } from '@/types';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


/**
 * ⚠️ Texte-cadre générique — à faire relire et valider avant mise en ligne
 * réelle. Ce n'est pas un avis juridique, seulement une base de départ
 * structurée pour un site e-commerce mauritanien.
 */
export default async function ConfidentialitePage({ params: { locale } }: { params: { locale: Locale } }) {
  noStore();
  setRequestLocale(locale);
  const t = await getTranslations('privacyPage');

  const sections = ['dataCollected', 'dataUse', 'dataSharing', 'dataStorage', 'rights', 'contact'] as const;

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
