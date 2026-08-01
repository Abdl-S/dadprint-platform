import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/portfolio — ajoute une réalisation (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { categorySlug, title, imageUrl, beforeImageUrl, videoUrl, published } = await request.json();
  if (!title?.fr || !imageUrl) return NextResponse.json({ error: 'Titre (FR) et image requis' }, { status: 400 });

  const supabase = createClient();
  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase.from('dp_categories').select('id').eq('slug', categorySlug).single();
    categoryId = cat?.id ?? null;
  }

  const { data, error } = await supabase.from('dp_portfolio_items').insert({
    category_id: categoryId, title, image_url: imageUrl, before_image_url: beforeImageUrl ?? null,
    video_url: videoUrl ?? null, published: published !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
