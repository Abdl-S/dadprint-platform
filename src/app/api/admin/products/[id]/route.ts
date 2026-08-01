import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PUT /api/admin/products/[id] — met à jour un produit (staff uniquement, via RLS). */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { slug, categorySlug, name, shortDescription, description, images, pricingMode, priceLabel, priceNote, minQuantity, delay, available, orderForm } = body;

  const supabase = createClient();

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase.from('dp_categories').select('id').eq('slug', categorySlug).single();
    categoryId = cat?.id ?? null;
  }

  const { error } = await supabase.from('dp_products').update({
    slug, category_id: categoryId, name, short_description: shortDescription, description,
    images: images ?? [], pricing_mode: pricingMode ?? 'quote', price_label: priceLabel ?? null,
    price_note: priceNote ?? null, min_quantity: minQuantity ?? null, delay: delay ?? null,
    available: available !== false, updated_at: new Date().toISOString(),
  }).eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Remplace entièrement les champs de formulaire (plus simple et sûr que de les comparer un par un)
  if (Array.isArray(orderForm)) {
    await supabase.from('dp_form_fields').delete().eq('product_id', params.id);
    if (orderForm.length > 0) {
      await supabase.from('dp_form_fields').insert(
        orderForm.map((f: any, i: number) => ({
          product_id: params.id, type: f.type, field_key: f.key, label: f.label,
          options: f.options ?? [], required: f.required ?? false, default_value: f.defaultValue ?? null, sort_order: i,
        }))
      );
    }
  }

  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/products/[id] — supprime un produit (staff uniquement, via RLS). */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** PATCH /api/admin/products/[id] — bascule rapide de disponibilité (utilisé par le Toggle du tableau). */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { available } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_products').update({ available }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
