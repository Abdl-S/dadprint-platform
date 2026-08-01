import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getClientCompanies, getPortfolioItems } from '@/lib/data/content';
import type { Locale } from '@/types';

export async function generateStaticParams() {
  const clientCompanies = await getClientCompanies();
  return clientCompanies.map((c) => ({ slug: c.slug }));
}

export default async function ClientDetailPage({
  params: { slug, locale },
}: { params: { slug: string; locale: Locale } }) {
  const [clientCompanies, portfolioItems] = await Promise.all([getClientCompanies(), getPortfolioItems()]);
  const client = clientCompanies.find((c) => c.slug === slug);
  if (!client) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('clientsPage');
  const work = portfolioItems.slice(0, 3); // TODO: lier les réalisations par entreprise réelle (dp_portfolio_items.company_id existe déjà en base, non exploité ici)

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-4">
          <img src={client.logoUrl} alt={client.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <h1 className="text-3xl font-black">{client.name}</h1>
            {client.websiteUrl && (
              <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-cyan underline">
                {client.websiteUrl}
              </a>
            )}
          </div>
        </div>

        <h2 className="mb-4 mt-10 text-lg font-bold">{t('workDoneTitle')}</h2>
        <div className="grid grid-cols-3 gap-4">
          {work.map((w) => (
            <img key={w.id} src={w.imageUrl} alt={w.title[locale]} className="aspect-square w-full rounded-md object-cover" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
