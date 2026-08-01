import { createClient } from '@/lib/supabase/public';
import type { Category, Product, OrderFormField } from '@/types';

/**
 * Couche de données réelle — remplace `lib/mock/data.ts` pour le catalogue.
 * Chaque fonction interroge Supabase et retourne exactement la même forme
 * que les anciennes données d'exemple, pour que tous les composants
 * existants (ProductGallery, DynamicOrderForm, CategoriesGrid...)
 * fonctionnent sans modification.
 *
 * Toutes ces fonctions sont appelées depuis des Server Components ; en cas
 * d'erreur réseau ou de table vide, elles retournent un tableau vide plutôt
 * que de faire planter la page.
 */

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_categories').select('*').order('sort_order');
  if (error || !data) return [];

  const counts = await getProductCountsByCategory();

  return data.map((c) => ({
    id: c.id,
    slug: c.slug,
    parentSlug: c.parent_id ? data.find((p) => p.id === c.parent_id)?.slug : undefined,
    name: c.name,
    description: c.description ?? { fr: '', en: '', ar: '' },
    coverImageUrl: c.cover_image_url ?? '',
    productCount: counts[c.id] ?? 0,
  }));
}

async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data } = await supabase.from('dp_products').select('category_id').eq('available', true);
  const counts: Record<string, number> = {};
  (data ?? []).forEach((p) => {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
  });
  return counts;
}

/** Reconstruit `orderForm` (forme attendue par DynamicOrderForm) depuis dp_form_fields. */
function mapFormFields(rows: any[]): OrderFormField[] {
  return (rows ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((f) => ({
      type: f.type,
      key: f.field_key,
      label: f.label,
      options: f.options ?? undefined,
      required: f.required ?? false,
      defaultValue: f.default_value ?? undefined,
      min: f.type === 'quantity' ? 1 : undefined,
    })) as OrderFormField[];
}

export async function getProducts(categorySlug?: string, includeUnavailable = false): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from('dp_products').select('*, dp_categories(slug)');
  if (!includeUnavailable) query = query.eq('available', true);
  const { data, error } = await query;
  if (error || !data) return [];

  const filtered = categorySlug ? data.filter((p) => p.dp_categories?.slug === categorySlug) : data;

  // Charge specs, tips et form_fields pour tous les produits filtrés en une passe
  const ids = filtered.map((p) => p.id);
  const [{ data: specsRows }, { data: tipsRows }, { data: fieldsRows }] = await Promise.all([
    supabase.from('dp_product_specs').select('*').in('product_id', ids),
    supabase.from('dp_product_tips').select('*').in('product_id', ids),
    supabase.from('dp_form_fields').select('*').in('product_id', ids),
  ]);

  return filtered.map((p) => mapProduct(p, specsRows ?? [], tipsRows ?? [], fieldsRows ?? []));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data: p, error } = await supabase
    .from('dp_products')
    .select('*, dp_categories(slug)')
    .eq('slug', slug)
    .single();
  if (error || !p) return null;

  const [{ data: specsRows }, { data: tipsRows }, { data: fieldsRows }] = await Promise.all([
    supabase.from('dp_product_specs').select('*').eq('product_id', p.id),
    supabase.from('dp_product_tips').select('*').eq('product_id', p.id),
    supabase.from('dp_form_fields').select('*').eq('product_id', p.id),
  ]);

  return mapProduct(p, specsRows ?? [], tipsRows ?? [], fieldsRows ?? []);
}

function mapProduct(p: any, specsRows: any[], tipsRows: any[], fieldsRows: any[]): Product {
  return {
    id: p.id,
    slug: p.slug,
    categorySlug: p.dp_categories?.slug ?? '',
    name: p.name,
    shortDescription: p.short_description ?? { fr: '', en: '', ar: '' },
    description: p.description ?? { fr: '', en: '', ar: '' },
    images: p.images ?? [],
    videoUrl: p.video_url ?? undefined,
    specs: specsRows.filter((s) => s.product_id === p.id).sort((a, b) => a.sort_order - b.sort_order).map((s) => ({ label: s.label, value: s.value })),
    tips: tipsRows.filter((t) => t.product_id === p.id).sort((a, b) => a.sort_order - b.sort_order).map((t) => t.text),
    faq: [],
    pricingMode: p.pricing_mode,
    priceLabel: p.price_label ?? undefined,
    promoPriceLabel: p.promo_price_label ?? undefined,
    priceNote: p.price_note ?? undefined,
    minQuantity: p.min_quantity ?? undefined,
    delay: p.delay ?? undefined,
    available: p.available,
    seoTitle: p.seo_title ?? undefined,
    seoDescription: p.seo_description ?? undefined,
    orderForm: mapFormFields(fieldsRows.filter((f) => f.product_id === p.id)),
  };
}
