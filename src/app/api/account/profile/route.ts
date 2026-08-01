import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/account/profile — met à jour le nom et le téléphone du client connecté (jamais l'email, qui suit son propre flux Supabase Auth). */
export async function PATCH(request: Request) {
  const { name, phone } = await request.json();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const { error } = await supabase.from('dp_profiles').update({ full_name: name, phone }).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
