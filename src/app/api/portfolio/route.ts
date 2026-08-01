import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/portfolio — réalisations publiées, filtrables par catégorie. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorie = searchParams.get('categorie');

  const supabase = createClient();
  let query = supabase.from('dp_portfolio_items').select('*').eq('published', true);
  if (categorie) {
    const { data: cat } = await supabase.from('dp_categories').select('id').eq('slug', categorie).single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
