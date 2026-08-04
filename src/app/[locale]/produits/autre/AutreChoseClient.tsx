'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/order/FileUpload';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/client';

/**
 * "Autre chose" — pour tout ce qui n'est pas déjà un produit du catalogue.
 * Pas de champs spécifiques à deviner à l'avance (contrairement à une fiche
 * produit) : juste assez d'informations pour que l'équipe puisse qualifier
 * la demande et revenir vers le client avec un vrai devis chiffré. Crée une
 * commande (pas un devis) — c'est depuis l'admin que le devis est ensuite
 * construit une fois le besoin précisé avec le client.
 */
export function AutreChoseClient() {
  const t = useTranslations('customRequest');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [website, setWebsite] = useState(''); // honeypot anti-spam
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot rempli → abandon silencieux

    setSubmitting(true);
    setSubmitError(null);

    const brief = [description, quantity ? `Quantité approximative : ${quantity}` : null].filter(Boolean).join('\n\n');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, designBrief: brief }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t('submitError'));
      }

      const { reference: ref, id: orderId } = await res.json();
      setReference(ref);

      if (files.length > 0) {
        const supabase = createClient();
        for (const file of files) {
          const path = `${orderId}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('dp-client-files').upload(path, file);
          if (!uploadError) {
            await fetch('/api/orders/files', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId, name: file.name, storagePath: path, mimeType: file.type, sizeBytes: file.size }),
            });
          }
        }
      }

      window.open(
        buildWhatsAppUrl({
          intent: 'commande',
          reference: ref,
          name, phone,
          productName: t('whatsappProductLabel'),
          comments: brief,
          delivery: { mode: 'delivery' },
        }),
        '_blank'
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('submitError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <Section className="pt-20 text-center">
        <Container className="max-w-md">
          <CheckCircle2 size={36} className="mx-auto text-success" />
          <h1 className="mt-4 text-2xl font-black">{t('confirmedTitle')}</h1>
          <p className="mt-2 font-mono text-sm">{reference}</p>
          <p className="mt-3 text-ink-70">{t('confirmedDesc')}</p>
          <Button href={`/suivi?ref=${reference}`} variant="outline" className="mt-6">{t('trackCta')}</Button>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-12">
      <Container className="max-w-xl">
        <div className="flex items-center gap-2 text-brand-magenta">
          <Sparkles size={18} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest">{t('eyebrow')}</span>
        </div>
        <h1 className="mt-3 text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-ink-8 bg-white p-6 shadow-soft sm:p-8">
          {/* Honeypot anti-spam : invisible et hors navigation clavier pour un humain */}
          <input
            type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold">{t('name')}</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold">{t('phone')}</span>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('description')}</span>
            <textarea
              required rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full rounded-md border border-ink-15 p-3"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('quantity')} <span className="font-normal text-ink-40">({t('optional')})</span></span>
            <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={t('quantityPlaceholder')} className="w-full rounded-md border border-ink-15 p-3" />
          </label>

          <div>
            <p className="mb-1.5 text-sm font-semibold">{t('photo')} <span className="font-normal text-ink-40">({t('optional')})</span></p>
            <FileUpload onChange={setFiles} />
          </div>

          {submitError && (
            <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{submitError}</p>
          )}

          <Button type="submit" variant="magenta" size="lg" className="w-full" loading={submitting} disabled={submitting}>
            {t('submit')}
          </Button>
          <p className="text-center text-xs text-ink-40">{t('reassurance')}</p>
        </form>
      </Container>
    </Section>
  );
}
