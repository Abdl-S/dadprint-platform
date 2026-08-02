import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocumentPdf } from '@/lib/pdf/generateDocument';

/** Reformate "DP-DEV-2026-0001" en "0001/2026" pour l'affichage sur le document, comme dans le modèle fourni par le client. */
function formatRefForDisplay(reference: string, prefix: string): string {
  const [year, counter] = reference.replace(prefix, '').split('-');
  return counter ? `${counter}/${year}` : reference;
}

/** POST /api/admin/quotes/[reference]/pdf — génère le PDF du devis dans le modèle DadPrint (staff uniquement, via RLS pour la lecture du devis). */
export async function POST(request: Request, { params }: { params: { reference: string } }) {
  const { lines } = await request.json();
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Au moins une ligne est requise' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: quote, error } = await supabase
    .from('dp_quotes').select('reference, client_name, city, created_at').eq('reference', params.reference).single();
  if (error || !quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  const pdfBytes = await generateDocumentPdf({
    kind: 'devis',
    reference: formatRefForDisplay(quote.reference, 'DP-DEV-'),
    date: new Date(quote.created_at),
    clientName: quote.client_name ?? '—',
    clientAddress: quote.city ?? undefined,
    lines,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${quote.reference}.pdf"` },
  });
}
