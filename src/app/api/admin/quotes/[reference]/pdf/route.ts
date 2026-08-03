import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocumentPdf } from '@/lib/pdf/generateDocument';

/** Reformate "DP-DEV-2026-0001" en "0001/2026" pour l'affichage sur le document, comme dans le modèle fourni par le client. */
function formatRefForDisplay(reference: string, prefix: string): string {
  const [year, counter] = reference.replace(prefix, '').split('-');
  return counter ? `${counter}/${year}` : reference;
}

/** POST /api/admin/quotes/[reference]/pdf — génère le PDF à partir des lignes déjà enregistrées avec le devis (staff uniquement, via RLS). */
export async function POST(request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const { data: quote, error } = await supabase
    .from('dp_quotes').select('id, reference, client_name, address, created_at').eq('reference', params.reference).single();
  if (error || !quote) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });

  const { data: savedLines } = await supabase
    .from('dp_quote_lines').select('description, quantity, unit_price').eq('quote_id', quote.id);

  let lines = (savedLines ?? [])
    .filter((l) => l.description && l.unit_price != null)
    .map((l) => ({ description: l.description.fr as string, qty: l.quantity as number, unitPrice: l.unit_price as number }));

  if (lines.length === 0) {
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.lines) && body.lines.length > 0) lines = body.lines;
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: 'Ce devis ne contient aucune ligne détaillée.' }, { status: 400 });
  }

  const pdfBytes = await generateDocumentPdf({
    kind: 'devis',
    reference: formatRefForDisplay(quote.reference, 'DP-DEV-'),
    date: new Date(quote.created_at),
    clientName: quote.client_name ?? '—',
    clientAddress: quote.address ?? undefined,
    lines,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${quote.reference}.pdf"` },
  });
}
