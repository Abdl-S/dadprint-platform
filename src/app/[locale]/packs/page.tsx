import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';
import { getPacks } from '@/lib/data/content';
import type { Locale } from '@/types';
import type { Metadata } from 'next';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const titles = { fr: 'Nos Packs', en: 'Our Packs', ar: 'باقاتنا' };
  const descriptions = {
    fr: "Des packs prêts à l'emploi (restaurant, boutique, entreprise, mariage...) — produits combinés et personnalisables.",
    en: 'Ready-to-use packs (restaurant, retail, business, wedding...) — combined and customizable products.',
    ar: 'باقات جاهزة (مطعم، متجر، شركة، زفاف...) — منتجات مجمّعة وقابلة للتخصيص.',
  };
  return { title: titles[locale], description: descriptions[locale] };
}

export default async function PacksPage({ params: { locale } }: { params: { locale: Locale } }) {
  noStore();
  setRequestLocale(locale);
  const t = await getTranslations('packsPage');
  const packs = await getPacks();

  return (
    <Section className="pt-12">
      <Container>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
        <h1 className="mt-2 text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 max-w-lg text-ink-70">{t('subtitle')}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packs.map((pack) => (
            <Link key={pack.id} href={`/packs/${pack.slug}`} className="group overflow-hidden rounded-lg border border-ink-8 bg-white shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={pack.coverImageUrl} alt={pack.name[locale]} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 ease-premium group-hover:scale-110" />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{pack.name[locale]}</h3>
                <p className="mt-1 text-xs text-ink-40">{pack.productSlugs.length} {t('productsIncluded')}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
