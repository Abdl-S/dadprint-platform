import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/orders/files — enregistre la référence d'un fichier client déjà envoyé dans le stockage, rattaché à une commande. Ouvert au public (formulaire de commande, avec ou sans compte). */
export async function POST(request: Request) {
  const { orderId, name, storagePath, mimeType, sizeBytes } = await request.json();
  if (!orderId || !storagePath) return NextResponse.json({ error: 'Commande et fichier requis' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_files').insert({
    type: 'fichier_client', storage_path: storagePath, name: name ?? storagePath,
    mime_type: mimeType ?? null, size_bytes: sizeBytes ?? null, linked_order_id: orderId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
