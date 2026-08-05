import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifyRole } from '@/lib/notifications/notify';

/** POST /api/contact — enregistre un message du formulaire de contact et notifie l'équipe. Ouvert au public. */
export async function POST(request: Request) {
  const { name, phone, email, message } = await request.json();
  if (!name || !message) return NextResponse.json({ error: 'Nom et message requis' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_contact_messages').insert({ name, phone: phone || null, email: email || null, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyRole(supabase, 'support', 'Nouveau message de contact', `${name} — ${message.slice(0, 80)}`);

  return NextResponse.json({ success: true }, { status: 201 });
}
