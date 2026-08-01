import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/newsletter — inscription à la newsletter (email unique, insertion idempotente). */
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Email invalide' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_newsletter_subscribers').insert({ email }).select().single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ success: true, alreadySubscribed: true }); // email déjà inscrit
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}
