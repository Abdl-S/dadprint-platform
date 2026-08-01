import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/reviews/[id] — approuve/refuse un avis et permet de corriger le texte (staff uniquement, via RLS). */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { moderation, comment } = await request.json();
  const supabase = createClient();

  const update: Record<string, unknown> = {};
  if (moderation) update.moderation_status = moderation;
  if (comment !== undefined) update.comment = { fr: comment, en: comment, ar: comment };

  const { error } = await supabase.from('dp_reviews').update(update).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
