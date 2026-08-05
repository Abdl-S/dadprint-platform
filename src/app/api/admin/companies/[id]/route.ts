import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/companies/[id] — bascule l'autorisation de publication. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { publishConsent } = await request.json();
  const supabase = createClient();
  const { error } = await supabase.from('dp_companies').update({ publish_consent: publishConsent }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/companies/[id] — supprime une entreprise cliente. */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dp_companies').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
