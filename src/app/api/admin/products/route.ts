import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/products — crée un produit. Réservé à l'équipe : la
 * politique RLS "staff manage products" rejette l'écriture si la session
 * (lue via les cookies) n'appartient pas à un profil non-client.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { slug, categorySlug, name, shortDescription, description, images, pricingMode, priceLabel, priceNote, minQuantity, delay, available, orderForm } = body;

  if (!slug || !name?.fr) {
    return NextResponse.json({ error: 'Slug et nom (FR) requis' }, { status: 400 });
  }

  const supabase = createClient();

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase.from('dp_categories').select('id').eq('slug', categorySlug).single();
    categoryId = cat?.id ?? null;
  }

  const { data: product, error } = await supabase.from('dp_products').insert({
    slug, category_id: categoryId, name, short_description: shortDescription, description,
    images: images ?? [], pricing_mode: pricingMode ?? 'quote', price_label: priceLabel ?? null,
    price_note: priceNote ?? null, min_quantity: minQuantity ?? null, delay: delay ?? null,
    available: available !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(orderForm) && orderForm.length > 0) {
    await supabase.from('dp_form_fields').insert(
      orderForm.map((f: any, i: number) => ({
        product_id: product.id, type: f.type, field_key: f.key, label: f.label,
        options: f.options ?? [], required: f.required ?? false, default_value: f.defaultValue ?? null, sort_order: i,
      }))
    );
  }

  return NextResponse.json({ id: product.id, slug: product.slug }, { status: 201 });
}
