import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';
import { blogArticles } from '@/lib/mock/blog';
import type { Locale } from '@/types';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: locale === 'fr' ? 'Conseils & Inspirations' : locale === 'en' ? 'Tips & Inspiration' : 'نصائح وإلهام' };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('blogPage');

  return (
    <Section className="pt-12">
      <Container>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
        <h1 className="mt-2 text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 max-w-lg text-ink-70">{t('subtitle')}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group overflow-hidden rounded-lg border border-ink-8 bg-white shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={a.coverImageUrl} alt={a.title[locale]} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 ease-premium group-hover:scale-110" />
              </div>
              <div className="p-4">
                <span className="font-mono text-[10px] font-bold uppercase text-brand-magenta">{t(`categories.${a.category}`)}</span>
                <h3 className="mt-1.5 font-bold leading-snug">{a.title[locale]}</h3>
                <p className="mt-2 text-xs text-ink-40">{a.excerpt[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
