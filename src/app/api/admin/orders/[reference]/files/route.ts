import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/admin/orders/[reference]/files — liste les fichiers envoyés par le client pour cette commande (le paramètre transporte en réalité l'identifiant interne de la commande, pas sa référence affichée — même dossier dynamique que la route de statut, contrainte de routage Next.js). Staff uniquement, via RLS. */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const orderId = params.reference;
  const supabase = createClient();
  const { data: files, error } = await supabase
    .from('dp_files').select('id, name, storage_path, mime_type, size_bytes, uploaded_at')
    .eq('linked_order_id', orderId).order('uploaded_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withUrls = await Promise.all(
    (files ?? []).map(async (f) => {
      const { data: signed } = await supabase.storage.from('dp-client-files').createSignedUrl(f.storage_path, 300); // 5 minutes
      return { id: f.id, name: f.name, mimeType: f.mime_type, sizeBytes: f.size_bytes, uploadedAt: f.uploaded_at, url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ data: withUrls });
}
