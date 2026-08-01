import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PUT /api/admin/packs/[id] — met à jour un pack et remplace ses produits inclus. */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { slug, name, description, coverImageUrl, priceLabel, productSlugs, active } = await request.json();
  const supabase = createClient();

  const { error } = await supabase.from('dp_packs').update({
    slug, name, description, cover_image_url: coverImageUrl ?? null, price_label: priceLabel ?? null, active: active !== false,
  }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('dp_pack_products').delete().eq('pack_id', params.id);
  if (Array.isArray(productSlugs) && productSlugs.length > 0) {
    const { data: prods } = await supabase.from('dp_products').select('id, slug').in('slug', productSlugs);
    if (prods?.length) {
      await supabase.from('dp_pack_products').insert(prods.map((p) => ({ pack_id: params.id, product_id: p.id })));
    }
  }

  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/packs/[id] — supprime un pack. */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_packs').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** PATCH /api/admin/packs/[id] — bascule rapide actif/inactif. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { active } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_packs').update({ active }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
