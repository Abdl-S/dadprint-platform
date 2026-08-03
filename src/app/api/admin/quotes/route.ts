import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/**
 * POST /api/admin/quotes — crée un devis directement depuis l'admin (staff
 * uniquement, via RLS). `lines` détaille exactement ce que le client a
 * commandé (description, quantité, prix) — sauvegardé avec le devis, prêt
 * à être réutilisé pour générer le PDF sans ressaisie.
 */
export async function POST(request: Request) {
  const { name, phone, email, address, comments, status, lines } = await request.json();
  if (!name || !phone) return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 });

  const supabase = createClient();
  let reference: string;
  try {
    reference = await generateSequentialReference(supabase, 'devis');
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur de référence' }, { status: 500 });
  }

  const { data: quote, error } = await supabase.from('dp_quotes').insert({
    reference, client_name: name, client_phone: phone, client_email: email || null,
    address: address || null, comments: comments || null, status: status || 'nouveau',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(lines) && lines.length > 0) {
    await supabase.from('dp_quote_lines').insert(
      lines.map((l: { description: string; qty: number; unitPrice: number }) => ({
        quote_id: quote.id,
        description: { fr: l.description, en: l.description, ar: l.description },
        quantity: l.qty,
        unit_price: l.unitPrice,
        notes: null,
      }))
    );
  }

  return NextResponse.json({ reference }, { status: 201 });
}
