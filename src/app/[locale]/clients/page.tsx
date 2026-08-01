import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';
import { RatingStars } from '@/components/ui/RatingStars';
import { getClientCompanies, getPortfolioItems, getTestimonials } from '@/lib/data/content';
import { ExternalLink } from 'lucide-react';
import type { Locale } from '@/types';

export default async function ClientsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('clientsPage');
  const [clientCompanies, portfolioItems, testimonials] = await Promise.all([
    getClientCompanies(),
    getPortfolioItems(),
    getTestimonials(),
  ]);
  const track = [...clientCompanies, ...clientCompanies];

  return (
    <Section className="pt-12">
      <Container>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
        <h1 className="mt-2 text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 max-w-lg text-ink-70">{t('subtitle')}</p>
      </Container>

      {/* Carrousel de logos en défilement continu */}
      <div className="mt-10 overflow-hidden border-y border-ink-8 py-8">
        <div className="flex w-max animate-marquee gap-12">
          {track.map((c, i) => (
            <Link key={`${c.id}-${i}`} href={`/clients/${c.slug}`} className="flex shrink-0 items-center gap-2.5">
              <Image src={c.logoUrl} alt={c.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <span className="whitespace-nowrap text-sm font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clientCompanies.map((c) => (
            <Link key={c.id} href={`/clients/${c.slug}`} className="flex items-center gap-4 rounded-lg border border-ink-8 shadow-soft bg-white p-5">
              <Image src={c.logoUrl} alt={c.name} width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
              <div>
                <h3 className="font-bold">{c.name}</h3>
                {c.websiteUrl && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-ink-40">
                    <ExternalLink size={12} /> {t('visitSite')}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mb-5 mt-16 text-2xl font-black">{t('realisationsTitle')}</h2>
        <div className="columns-2 gap-4 sm:columns-3">
          {portfolioItems.map((item) => (
            <img key={item.id} src={item.imageUrl} alt={item.title[locale]} className="mb-4 w-full break-inside-avoid rounded-md" />
          ))}
        </div>

        <h2 className="mb-5 mt-16 text-2xl font-black">{t('testimonialsTitle')}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((r) => (
            <div key={r.id} className="rounded-lg border border-ink-8 p-5">
              <RatingStars rating={r.rating} />
              <p className="mt-3 text-sm text-ink-70">&ldquo;{r.comment[locale]}&rdquo;</p>
              <p className="mt-4 text-xs font-bold">{r.authorContext[locale]}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
