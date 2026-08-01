import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { getCategories } from '@/lib/data/catalog';
import { getPortfolioItems } from '@/lib/data/content';
import { RealisationsPageClient } from './RealisationsPageClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const titles = { fr: 'Nos réalisations', en: 'Our work', ar: 'أعمالنا' };
  const descriptions = {
    fr: 'Portfolio des projets réalisés par DadPrint — cartes, textile, grand format, packaging et plus.',
    en: "Portfolio of DadPrint's completed projects — cards, apparel, large format, packaging and more.",
    ar: 'معرض أعمال DadPrint المنجزة — بطاقات، ملابس، طباعة كبيرة، تغليف والمزيد.',
  };
  return { title: titles[locale], description: descriptions[locale] };
}

export default async function RealisationsPage() {
  const [categories, portfolioItems] = await Promise.all([getCategories(), getPortfolioItems()]);
  return <RealisationsPageClient categories={categories} portfolioItems={portfolioItems} />;
}
