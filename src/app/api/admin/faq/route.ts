import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/faq — ajoute une question (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { question, answer } = await request.json();
  if (!question || !answer) return NextResponse.json({ error: 'Question et réponse requises' }, { status: 400 });

  const supabase = createClient();
  const { count } = await supabase.from('dp_faq').select('*', { count: 'exact', head: true });
  const { data, error } = await supabase.from('dp_faq').insert({
    question: { fr: question, en: question, ar: question },
    answer: { fr: answer, en: answer, ar: answer },
    sort_order: count ?? 0,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
