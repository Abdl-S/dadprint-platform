import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/** POST /api/quotes — crée un devis + sa ligne. Ouvert au public (formulaire visiteur). */
export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, email, city, country, address, deliveryAddress, productId, quantity, options, comments, desiredDate, designChoice, designBrief } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 });
  }

  const supabase = createClient();
  let reference: string;
  try {
    reference = await generateSequentialReference(supabase, 'devis');
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur de référence' }, { status: 500 });
  }
  const { data: { user } } = await supabase.auth.getUser();

  const { data: quote, error } = await supabase.from('dp_quotes').insert({
    reference, client_name: name, client_phone: phone, client_email: email,
    client_id: user?.id ?? null,
    city, country, address, delivery_address: deliveryAddress, desired_date: desiredDate || null,
    comments, status: 'nouveau', design_choice: designChoice ?? null, design_brief: designBrief ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (productId) {
    await supabase.from('dp_quote_lines').insert({ quote_id: quote.id, product_id: productId, quantity, options: options ?? {} });
  }

  const { data: commercialRole } = await supabase.from('dp_roles').select('id').eq('key', 'commercial').single();
  await supabase.from('dp_notifications').insert({
    title: 'Nouveau devis', body: `${reference} — ${name}`, reference, channels: ['app'], target_role_id: commercialRole?.id ?? null,
  });

  return NextResponse.json({ reference, id: quote.id }, { status: 201 });
}
