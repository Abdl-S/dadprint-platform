import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/products — liste paginée, filtrable par catégorie, avec recherche.
 * Query params : ?categorie=<slug> &q=<recherche> &page=1 &limit=20
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorie = searchParams.get('categorie');
  const q = searchParams.get('q');
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);
  const from = (page - 1) * limit;

  const supabase = createClient();
  let query = supabase
    .from('dp_products')
    .select('id, slug, name, short_description, images, pricing_mode, price_label, available, category_id', { count: 'exact' })
    .eq('available', true)
    .range(from, from + limit - 1);

  if (categorie) {
    const { data: cat } = await supabase.from('dp_categories').select('id').eq('slug', categorie).single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (q) query = query.ilike('name->>fr', `%${q}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, page, limit, total: count });
}
