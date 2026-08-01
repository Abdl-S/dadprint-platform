import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/blog/[id] — change le statut publié/brouillon. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_articles').update({
    status, published_at: status === 'publie' ? new Date().toISOString() : null,
  }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/blog/[id] — supprime un article. */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_articles').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
