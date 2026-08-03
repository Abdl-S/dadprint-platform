import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/quotes/files — enregistre la référence d'un fichier client déjà envoyé dans le stockage, rattaché à un devis. Ouvert au public. */
export async function POST(request: Request) {
  const { quoteId, name, storagePath, mimeType, sizeBytes } = await request.json();
  if (!quoteId || !storagePath) return NextResponse.json({ error: 'Devis et fichier requis' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_files').insert({
    type: 'fichier_client', storage_path: storagePath, name: name ?? storagePath,
    mime_type: mimeType ?? null, size_bytes: sizeBytes ?? null, linked_quote_id: quoteId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
