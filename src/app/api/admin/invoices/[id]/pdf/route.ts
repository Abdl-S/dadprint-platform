import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocumentPdf } from '@/lib/pdf/generateDocument';

/** Reformate "DP-FAC-2026-0001" en "0001/2026" pour l'affichage, comme dans le modèle fourni par le client. */
function formatRefForDisplay(reference: string, prefix: string): string {
  const [year, counter] = reference.replace(prefix, '').split('-');
  return counter ? `${counter}/${year}` : reference;
}

/** POST /api/admin/invoices/[id]/pdf — génère le PDF à partir des lignes déjà enregistrées avec la facture (staff uniquement, via RLS). */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: invoice, error } = await supabase
    .from('dp_invoices').select('reference, issued_at, dp_orders(client_name, address_id)').eq('id', params.id).single();
  if (error || !invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });

  const { data: savedLines } = await supabase
    .from('dp_invoice_lines').select('description, quantity, unit_price').eq('invoice_id', params.id).order('sort_order');

  const lines = (savedLines ?? []).map((l) => ({ description: l.description.fr as string, qty: l.quantity as number, unitPrice: l.unit_price as number }));

  if (lines.length === 0) {
    return NextResponse.json({ error: 'Cette facture ne contient aucune ligne détaillée.' }, { status: 400 });
  }

  const pdfBytes = await generateDocumentPdf({
    kind: 'facture',
    reference: formatRefForDisplay(invoice.reference, 'DP-FAC-'),
    date: new Date(invoice.issued_at),
    clientName: (invoice as any).dp_orders?.client_name ?? '—',
    lines,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${invoice.reference}.pdf"` },
  });
}
