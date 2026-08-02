import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/invoices/[id] — marque une facture payée/en attente. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_invoices').update({ status }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
