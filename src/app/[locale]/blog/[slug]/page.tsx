import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';
import { blogArticles } from '@/lib/mock/blog';
import type { Locale } from '@/types';
import type { Metadata } from 'next';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};
  return { title: article.title[locale], description: article.excerpt[locale], openGraph: { images: [article.coverImageUrl] } };
}

export default async function BlogArticlePage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  noStore();
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('blogPage');
  const related = blogArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <Section className="pt-12">
      <Container className="max-w-2xl">
        <nav className="mb-6 text-xs text-ink-40">
          <Link href="/blog" className="hover:underline">{t('title')}</Link> / {article.title[locale]}
        </nav>

        <span className="font-mono text-xs font-bold uppercase text-brand-magenta">{t(`categories.${article.category}`)}</span>
        <h1 className="mt-2 text-3xl font-black">{article.title[locale]}</h1>
        <p className="mt-2 font-mono text-xs text-ink-40">{new Date(article.publishedAt).toLocaleDateString(locale)}</p>

        <img src={article.coverImageUrl} alt={article.title[locale]} className="mt-6 aspect-video w-full rounded-lg object-cover" />

        <p className="mt-8 text-sm leading-relaxed text-ink-70">{article.content[locale]}</p>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-4 text-lg font-bold">{t('relatedTitle')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="overflow-hidden rounded-lg border border-ink-8 shadow-soft bg-white">
                  <img src={a.coverImageUrl} alt={a.title[locale]} className="aspect-video w-full object-cover" />
                  <div className="p-3"><p className="text-sm font-bold">{a.title[locale]}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
