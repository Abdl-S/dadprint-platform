import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** DELETE /api/admin/faq/[id] — supprime une question. */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_faq').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
