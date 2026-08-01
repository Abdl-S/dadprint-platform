import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/portfolio/[id] — bascule la publication. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { published } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_portfolio_items').update({ published }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/portfolio/[id] — supprime une réalisation. */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_portfolio_items').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
