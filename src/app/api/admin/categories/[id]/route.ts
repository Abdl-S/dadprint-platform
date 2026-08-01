import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PUT /api/admin/categories/[id] — met à jour une catégorie. */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { slug, name, description, coverImageUrl } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_categories').update({
    slug, name, description, cover_image_url: coverImageUrl ?? null,
  }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/categories/[id] — supprime une catégorie (les produits liés passent category_id à NULL, jamais supprimés). */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_categories').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
