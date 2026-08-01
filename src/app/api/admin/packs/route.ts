import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/packs — crée un pack + ses liens produits (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { slug, name, description, coverImageUrl, priceLabel, productSlugs, active } = await request.json();
  if (!slug || !name?.fr) return NextResponse.json({ error: 'Slug et nom (FR) requis' }, { status: 400 });

  const supabase = createClient();
  const { data: pack, error } = await supabase.from('dp_packs').insert({
    slug, name, description, cover_image_url: coverImageUrl ?? null, price_label: priceLabel ?? null, active: active !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(productSlugs) && productSlugs.length > 0) {
    const { data: prods } = await supabase.from('dp_products').select('id, slug').in('slug', productSlugs);
    if (prods?.length) {
      await supabase.from('dp_pack_products').insert(prods.map((p) => ({ pack_id: pack.id, product_id: p.id })));
    }
  }

  return NextResponse.json({ id: pack.id }, { status: 201 });
}
