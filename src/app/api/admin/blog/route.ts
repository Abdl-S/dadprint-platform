import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/blog — crée un article (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { slug, title, excerpt, coverImageUrl, category, status } = await request.json();
  if (!slug || !title?.fr) return NextResponse.json({ error: 'Slug et titre (FR) requis' }, { status: 400 });

  const supabase = createClient();
  const { data, error } = await supabase.from('dp_articles').insert({
    slug, title, excerpt: excerpt ?? null, cover_image_url: coverImageUrl ?? null, category: category ?? null,
    status: status ?? 'brouillon', published_at: status === 'publie' ? new Date().toISOString() : null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
