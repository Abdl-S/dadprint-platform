import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/categories — crée une catégorie ou sous-catégorie (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { slug, parentSlug, name, description, coverImageUrl } = await request.json();
  if (!slug || !name?.fr) return NextResponse.json({ error: 'Slug et nom (FR) requis' }, { status: 400 });

  const supabase = createClient();
  let parentId: string | null = null;
  if (parentSlug) {
    const { data: parent } = await supabase.from('dp_categories').select('id').eq('slug', parentSlug).single();
    parentId = parent?.id ?? null;
  }

  const { data, error } = await supabase.from('dp_categories').insert({
    slug, parent_id: parentId, name, description, cover_image_url: coverImageUrl ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
