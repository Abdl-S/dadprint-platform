'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/order/FileUpload';
import { DesignChoiceStep } from '@/components/order/DesignChoiceStep';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/client';
import type { DesignChoice, Locale, Product } from '@/types';

/**
 * Devis — le formulaire le plus complet du site : toutes les informations
 * nécessaires pour qu'un devis soit exploitable sans aller-retour supplémentaire.
 * Écrit réellement en base (dp_quotes) via /api/quotes ; reçoit la référence
 * générée côté serveur, jamais une référence inventée dans le navigateur.
 */
export function DevisPageClient({ products, locale }: { products: Product[]; locale: Locale }) {
  const t = useTranslations('quotePage');
  const [designChoice, setDesignChoice] = useState<DesignChoice>('has_design');
  const [designBrief, setDesignBrief] = useState('');
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const [productSlug, setProductSlug] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Mauritanie');
  const [address, setAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [options, setOptions] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [comments, setComments] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-spam — invisible pour un humain
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot rempli → abandon silencieux

    setSubmitting(true);
    setSubmitError(null);

    const product = products.find((p) => p.slug === productSlug);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email: email || undefined,
          city, country, address, deliveryAddress: deliveryAddress || undefined,
          productId: product?.id,
          options: options ? { notes: options } : undefined,
          comments,
          desiredDate: desiredDate || undefined,
          designChoice,
          designBrief: designBrief || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t('submitError'));
      }

      const { reference: ref, id: quoteId } = await res.json();
      setReference(ref);

      // Envoie réellement les fichiers vers le stockage, rattachés à ce devis, et prépare
      // un lien direct pour chacun — WhatsApp ne joint jamais de fichier automatiquement,
      // mais un lien cliquable dans le message revient au même en un tap.
      const fileLinks: string[] = [];
      const allFiles = [...designFiles, ...otherFiles];
      if (allFiles.length > 0) {
        const supabase = createClient();
        for (const file of allFiles) {
          const path = `${quoteId}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('dp-client-files').upload(path, file);
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('dp-client-files').getPublicUrl(path);
            fileLinks.push(publicUrlData.publicUrl);
            await fetch('/api/quotes/files', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quoteId, name: file.name, storagePath: path, mimeType: file.type, sizeBytes: file.size }),
            });
          }
        }
      }

      window.open(
        buildWhatsAppUrl({
          intent: 'devis',
          reference: ref,
          name, phone,
          productName: product?.name[locale] ?? t('otherProduct'),
          options: options ? [{ label: t('options'), value: options }] : undefined,
          comments,
          delivery: { mode: 'delivery', address: deliveryAddress || address, city },
          fileLinks,
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
      <Container className="max-w-2xl">
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {/* Honeypot anti-spam : invisible et hors navigation clavier pour un humain */}
          <input
            type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder={t('name')} aria-label={t('name')} value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input required type="tel" placeholder={t('phone')} aria-label={t('phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input type="email" placeholder={t('email')} aria-label={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder={t('city')} aria-label={t('city')} value={city} onChange={(e) => setCity(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder={t('country')} aria-label={t('country')} value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
          </div>
          <input placeholder={t('address')} aria-label={t('address')} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('product')}</span>
            <select
              required value={productSlug} onChange={(e) => setProductSlug(e.target.value)}
              className="w-full rounded-md border border-ink-15 p-3"
            >
              <option value="" disabled>—</option>
              {products.map((p) => <option key={p.id} value={p.slug}>{p.name[locale]}</option>)}
              <option value="autre">{t('otherProduct')}</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('options')}</span>
            <textarea rows={3} value={options} onChange={(e) => setOptions(e.target.value)} placeholder={t('optionsPlaceholder')} aria-label={t('options')} className="w-full rounded-md border border-ink-15 p-3" />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('desiredDate')}</span>
            <input type="date" aria-label={t('desiredDate')} value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('deliveryAddress')}</span>
            <input placeholder={t('deliveryAddressPlaceholder')} aria-label={t('deliveryAddress')} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
          </label>

          <DesignChoiceStep value={designChoice} onChange={setDesignChoice} onFilesChange={setDesignFiles} onBriefChange={setDesignBrief} />

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('files')}</span>
            <FileUpload onChange={setOtherFiles} />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{t('comments')}</span>
            <textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
          </label>

          {submitError && (
            <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{submitError}</p>
          )}

          <Button type="submit" variant="magenta" size="lg" className="w-full" loading={submitting} disabled={submitting}>{t('submit')}</Button>
          <p className="text-center text-xs text-ink-40">{t('reassurance')}</p>
        </form>
      </Container>
    </Section>
  );
}
