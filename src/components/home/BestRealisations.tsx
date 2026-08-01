import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { portfolioItems } from '@/lib/mock/data';
import type { Locale } from '@/types';

export function BestRealisations() {
  const t = useTranslations('realisations');
  const locale = useLocale() as Locale;

  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
          </div>
          <Link href="/realisations" className="hidden text-sm font-bold underline sm:block">{t('seeAll')}</Link>
        </div>

        <div className="columns-2 gap-4 sm:columns-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-md">
              <img src={item.imageUrl} alt={item.title[locale]} className="w-full" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
