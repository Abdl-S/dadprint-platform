import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/packs — packs actifs, avec les produits inclus. */
export async function GET() {
  const supabase = createClient();
  const { data: packs, error } = await supabase.from('dp_packs').select('*').eq('active', true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withProducts = await Promise.all(
    (packs ?? []).map(async (pack) => {
      const { data: links } = await supabase.from('dp_pack_products').select('product_id').eq('pack_id', pack.id);
      return { ...pack, productIds: (links ?? []).map((l) => l.product_id) };
    })
  );

  return NextResponse.json({ data: withProducts });
}
