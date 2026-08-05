import { createClient } from '@/lib/supabase/server';

/**
 * Données réservées à l'administration — utilisent le client basé sur les
 * cookies de session (pas le client public) car les politiques RLS
 * réservent la lecture de ces tables à un profil staff (`dp_is_staff()`).
 */

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

/** Membres de l'équipe uniquement (jamais les comptes clients, même si techniquement dans la même table). */
export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_profiles')
    .select('id, full_name, email, active, dp_roles!inner(key)')
    .neq('dp_roles.key', 'client')
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((u: any) => ({
    id: u.id,
    name: u.full_name ?? u.email,
    email: u.email,
    role: u.dp_roles.key,
    active: u.active,
  }));
}

export interface AdminInvoiceRow {
  id: string;
  reference: string;
  orderReference: string | null;
  clientName: string;
  clientPhone: string | null;
  amount: number;
  status: 'en_attente' | 'payee';
  issuedAt: string;
}

export async function getAdminInvoices(): Promise<AdminInvoiceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_invoices')
    .select('id, reference, amount, status, issued_at, client_name, client_phone, dp_orders(reference, client_name, client_phone)')
    .order('issued_at', { ascending: false });
  if (error || !data) return [];

  return data.map((i: any) => ({
    id: i.id,
    reference: i.reference,
    orderReference: i.dp_orders?.reference ?? null,
    clientName: i.client_name ?? i.dp_orders?.client_name ?? '—',
    clientPhone: i.client_phone ?? i.dp_orders?.client_phone ?? null,
    amount: i.amount,
    status: i.status,
    issuedAt: i.issued_at,
  }));
}

export interface AdminCompanyRow {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  publishConsent: boolean;
}

export async function getAdminCompanies(): Promise<AdminCompanyRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_companies').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((c) => ({ id: c.id, name: c.name, logoUrl: c.logo_url, websiteUrl: c.website_url, publishConsent: c.publish_consent }));
}

export interface AdminOrderRow {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  productName: string;
  quantity: number;
  amount: number;
  status: string;
  date: string;
  paymentPreference: 'now_full' | 'now_deposit' | 'after_validation' | null;
  fileCount: number;
  designChoice: string | null;
  designBrief: string | null;
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_orders')
    .select('id, reference, client_name, client_phone, status, created_at, total_amount, payment_preference, design_choice, design_brief, dp_order_lines(quantity, dp_products(name)), dp_files(id)')
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((o: any) => ({
    id: o.id,
    reference: o.reference,
    clientName: o.client_name ?? '—',
    clientPhone: o.client_phone ?? '—',
    productName: o.dp_order_lines?.[0]?.dp_products?.name?.fr ?? '—',
    quantity: o.dp_order_lines?.[0]?.quantity ?? 1,
    amount: o.total_amount ?? 0,
    status: o.status,
    date: o.created_at,
    paymentPreference: o.payment_preference ?? null,
    fileCount: o.dp_files?.length ?? 0,
    designChoice: o.design_choice ?? null,
    designBrief: o.design_brief ?? null,
  }));
}

export interface OrderStatus { key: string; label: string; color: string; }

export async function getOrderStatuses(): Promise<OrderStatus[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_order_statuses').select('*').order('sort_order');
  if (error || !data) return [];
  return data.map((s) => ({ key: s.key, label: s.label, color: s.color ?? 'bg-ink-8 text-ink-70' }));
}

export interface AdminReviewRow {
  id: string;
  comment: string;
  rating: number;
  authorContext: string;
  moderation: 'en_attente' | 'approuve' | 'refuse';
}

export async function getAdminReviews(): Promise<AdminReviewRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_reviews').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    comment: r.comment?.fr ?? '',
    rating: r.rating,
    authorContext: r.company_name ?? r.author_name ?? '—',
    moderation: r.moderation_status,
  }));
}
export interface AdminArticleRow {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  status: 'publie' | 'brouillon';
}

export async function getAdminArticles(): Promise<AdminArticleRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_articles').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title?.fr ?? '',
    coverImageUrl: a.cover_image_url,
    category: a.category,
    publishedAt: a.published_at ?? a.created_at,
    status: a.status,
  }));
}

export interface AdminQuoteRow {
  reference: string;
  clientName: string;
  clientPhone: string;
  productName: string;
  address: string | null;
  status: string;
  date: string;
}

export async function getAdminQuotes(): Promise<AdminQuoteRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_quotes')
    .select('reference, client_name, client_phone, address, status, created_at, dp_quote_lines(description, dp_products(name))')
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((q: any) => ({
    reference: q.reference,
    clientName: q.client_name ?? '—',
    clientPhone: q.client_phone ?? '—',
    productName: q.dp_quote_lines?.[0]?.dp_products?.name?.fr ?? q.dp_quote_lines?.[0]?.description?.fr ?? '—',
    address: q.address,
    status: q.status,
    date: q.created_at,
  }));
}
