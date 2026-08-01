import { createClient } from '@/lib/supabase/public';
import type { Pack, PortfolioItem, ClientCompany, Testimonial } from '@/types';

/** Même principe que catalog.ts : lit Supabase, retourne la forme attendue par les composants existants. */

export async function getPacks(): Promise<Pack[]> {
  const supabase = createClient();
  const { data: packs, error } = await supabase.from('dp_packs').select('*').eq('active', true);
  if (error || !packs) return [];

  const { data: links } = await supabase.from('dp_pack_products').select('pack_id, dp_products(slug)');

  return packs.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? { fr: '', en: '', ar: '' },
    coverImageUrl: p.cover_image_url ?? '',
    productSlugs: (links ?? []).filter((l) => l.pack_id === p.id).map((l: any) => l.dp_products?.slug).filter(Boolean),
    pricingMode: p.pricing_mode,
    priceLabel: p.price_label ?? undefined,
  }));
}

export async function getPackBySlug(slug: string): Promise<Pack | null> {
  const packs = await getPacks();
  return packs.find((p) => p.slug === slug) ?? null;
}

export async function getPortfolioItems(categorySlug?: string): Promise<PortfolioItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_portfolio_items').select('*, dp_categories(slug)').eq('published', true);
  if (error || !data) return [];

  const filtered = categorySlug ? data.filter((i) => i.dp_categories?.slug === categorySlug) : data;

  return filtered.map((i) => ({
    id: i.id,
    categorySlug: i.dp_categories?.slug ?? '',
    title: i.title,
    imageUrl: i.image_url,
    beforeImageUrl: i.before_image_url ?? undefined,
    videoUrl: i.video_url ?? undefined,
  }));
}

export async function getClientCompanies(): Promise<ClientCompany[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_companies').select('*').eq('publish_consent', true);
  if (error || !data) return [];

  return data.map((c) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logo_url ?? '',
    websiteUrl: c.website_url ?? undefined,
    slug: c.slug,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_reviews')
    .select('*, dp_products(slug)')
    .eq('moderation_status', 'approuve')
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    authorName: r.author_name ?? 'Client vérifié',
    authorContext: { fr: r.company_name ?? '', en: r.company_name ?? '', ar: r.company_name ?? '' },
    photoUrl: (r.photo_urls ?? [])[0] ?? undefined,
    companyName: r.show_company ? r.company_name ?? undefined : undefined,
    date: r.created_at,
    rating: r.rating,
    comment: r.comment,
    verified: r.verified,
    productSlug: r.dp_products?.slug ?? undefined,
  }));
}

/**
 * Commandes réelles du client connecté (RLS restreint déjà l'accès à ses
 * propres lignes — voir policy "client reads own orders"). Utilise le
 * client basé sur les cookies de session, pas le client public.
 */
export interface MyOrder {
  reference: string;
  date: string;
  status: string;
  productName: string;
  productSlug: string | null;
}

export async function getMyOrders(): Promise<MyOrder[]> {
  const { createClient: createSessionClient } = await import('@/lib/supabase/server');
  const supabase = createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('dp_orders')
    .select('reference, created_at, status, dp_order_lines(dp_products(name, slug))')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((o: any) => ({
    reference: o.reference,
    date: o.created_at,
    status: o.status,
    productName: o.dp_order_lines?.[0]?.dp_products?.name?.fr ?? '—',
    productSlug: o.dp_order_lines?.[0]?.dp_products?.slug ?? null,
  }));
}
