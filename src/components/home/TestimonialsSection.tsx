import { useLocale, useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Link } from '@/i18n/navigation';
import { testimonials } from '@/lib/mock/data';
import type { Locale } from '@/types';

export function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;

  return (
    <Section className="bg-ink-8/40">
      <Container>
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
          </div>
          <Link href="/avis" className="hidden text-sm font-bold underline sm:block">{t('seeAll')}</Link>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <ReviewCard review={r} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
