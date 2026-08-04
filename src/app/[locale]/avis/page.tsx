import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RatingStars } from '@/components/ui/RatingStars';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Link } from '@/i18n/navigation';
import { getTestimonials } from '@/lib/data/content';
import type { Locale } from '@/types';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AvisPage({ params: { locale } }: { params: { locale: Locale } }) {
  noStore();
  setRequestLocale(locale);
  const t = await getTranslations('reviewsPage');
  const testimonials = await getTestimonials();

  const average = testimonials.length > 0 ? testimonials.reduce((s, r) => s + r.rating, 0) / testimonials.length : 0;

  return (
    <Section className="pt-12">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black">{t('title')}</h1>
          <p className="mt-3 text-ink-70">{t('subtitle')}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-ink-8 p-5">
          <span className="text-3xl font-black">{average.toFixed(1)}</span>
          <div>
            <RatingStars rating={Math.round(average)} size={18} />
            <p className="mt-1 text-xs text-ink-40">{t('basedOn', { count: testimonials.length })}</p>
          </div>
          <Link href="/avis/evaluation" className="ms-auto text-sm font-bold underline">
            {t('leaveReview')}
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((r) => (
            <ReviewCard key={r.id} review={r} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
