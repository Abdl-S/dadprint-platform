'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import type { Locale, OrderFormField, Product, DesignChoice, DeliveryMode, PaymentProvider } from '@/types';
import { DesignChoiceStep } from './DesignChoiceStep';
import { PaymentMethodPicker } from '@/components/payment/PaymentMethodPicker';
import { LiveProductPreview } from '@/components/configurator/LiveProductPreview';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Rendu d'UN champ selon sa définition — c'est ce moteur générique qui permet
 * à "Casquette" et "Roll-up" d'avoir des formulaires totalement différents
 * sans dupliquer de composant de formulaire par produit.
 */
function FieldRenderer({
  field, locale, value, onChange,
}: { field: OrderFormField; locale: Locale; value: any; onChange: (v: any) => void }) {
  const label = field.label[locale];

  if (field.type === 'select') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <div className="relative">
          <select
            required={field.required}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-ink-15 bg-paper p-3.5 pe-10 transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          >
            <option value="" disabled>—</option>
            {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-ink-40" />
        </div>
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className="text-sm">
        <legend className="mb-2 font-semibold">{label}</legend>
        {/* Cartes interactives plutôt que de simples boutons radio */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {field.options.map((o) => (
            <label
              key={o}
              className={`relative cursor-pointer rounded-lg border-2 p-3.5 text-center text-sm font-semibold transition-all duration-200 ease-premium focus-within:ring-2 focus-within:ring-brand-cyan focus-within:ring-offset-2 ${
                value === o ? 'border-ink bg-ink text-paper shadow-card' : 'border-ink-15 hover:border-ink-40 hover:-translate-y-0.5'
              }`}
            >
              <input type="radio" name={field.key} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" required={field.required} />
              {value === o && <CheckCircle2 size={14} className="absolute -top-1.5 -end-1.5 rounded-full bg-paper text-success" />}
              {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'checkbox') {
    const selected: string[] = Array.isArray(value) ? value : [];
    function toggle(o: string) {
      onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
    }
    return (
      <fieldset className="text-sm">
        <legend className="mb-2 font-semibold">{label}</legend>
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => (
            <label
              key={o}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-4 py-2 font-semibold transition-all duration-200 ease-premium focus-within:ring-2 focus-within:ring-brand-cyan focus-within:ring-offset-2 ${
                selected.includes(o) ? 'border-ink bg-ink text-paper' : 'border-ink-15 hover:border-ink-40'
              }`}
            >
              <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} className="sr-only" />
              {selected.includes(o) && <CheckCircle2 size={13} />}
              {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'color') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => (
            <button
              type="button" key={o} onClick={() => onChange(o)}
              className={`h-9 w-9 rounded-full border-2 ${value === o ? 'border-brand-magenta' : 'border-ink-15'}`}
              style={{ background: o }} aria-label={o}
            />
          ))}
        </div>
      </label>
    );
  }

  if (field.type === 'number') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <input type="number" required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
      </label>
    );
  }

  if (field.type === 'address') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <textarea rows={2} required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
      </label>
    );
  }

  if (field.type === 'upload') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <input type="file" required={field.required} onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')} className="w-full rounded-md border border-ink-15 p-3 text-xs" />
      </label>
    );
  }

  if (field.type === 'quantity') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <input
          type="number" min={field.min ?? 1} required={field.required}
          value={value ?? ''} onChange={(e) => onChange(e.target.value)}
          placeholder={field.min ? String(field.min) : undefined}
          className="w-full rounded-md border border-ink-15 p-3"
        />
      </label>
    );
  }

  if (field.type === 'date') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <input type="date" required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-ink-15 p-3" />
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">{label}</span>
        <textarea
          rows={3} required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder?.[locale]}
          className="w-full rounded-md border border-ink-15 p-3"
        />
      </label>
    );
  }

  // text
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold">{label}</span>
      <input
        type="text" required={field.required} value={value ?? ''} onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder?.[locale]}
        className="w-full rounded-md border border-ink-15 p-3"
      />
    </label>
  );
}

export function DynamicOrderForm({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('orderForm');
  const [values, setValues] = useState<Record<string, any>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [designChoice, setDesignChoice] = useState<DesignChoice>('has_design');
  const [delivery, setDelivery] = useState<DeliveryMode>('delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider | null>(null);
  const [paymentPreference, setPaymentPreference] = useState<'now_full' | 'now_deposit' | 'after_validation' | ''>('');
  const [reference, setReference] = useState<string | null>(null);
  const [website, setWebsite] = useState(''); // honeypot anti-spam — un humain ne remplit jamais ce champ invisible
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setField(key: string, v: any) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot rempli → probablement un bot, on abandonne silencieusement

    setSubmitting(true);
    setSubmitError(null);

    const quantityField = product.orderForm.find((f) => f.type === 'quantity');
    const commentsField = product.orderForm.find((f) => f.type === 'textarea');
    const options = product.orderForm
      .filter((f) => f.type !== 'textarea' && values[f.key])
      .reduce((acc, f) => ({ ...acc, [f.key]: values[f.key] }), {} as Record<string, unknown>);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          productId: product.id,
          quantity: quantityField ? Number(values[quantityField.key]) || 1 : 1,
          options: { ...options, commentaires: commentsField ? values[commentsField.key] : undefined },
          deliveryMode: delivery,
          designChoice,
          paymentPreference: paymentPreference || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t('submitError'));
      }

      const { reference: ref } = await res.json();
      setReference(ref);

      // La commande est enregistrée ; WhatsApp reste un canal de confirmation immédiate en plus, pas le seul enregistrement.
      window.open(
        buildWhatsAppUrl({
          intent: 'commande',
          reference: ref,
          name, phone,
          productName: product.name[locale],
          quantity: quantityField ? values[quantityField.key] : undefined,
          options: Object.entries(options).map(([key, value]) => ({
            label: product.orderForm.find((f) => f.key === key)?.label[locale] ?? key,
            value: String(value),
          })),
          comments: commentsField ? values[commentsField.key] : undefined,
          delivery: { mode: delivery, address, city },
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
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 size={32} className="mx-auto text-success" />
        <h3 className="mt-3 text-lg font-bold">{t('confirmedTitle')}</h3>
        <p className="mt-2 font-mono text-sm">{reference}</p>
        <p className="mt-3 text-sm text-ink-70">{t('confirmedDesc')}</p>
        <Button href={`/suivi?ref=${reference}`} variant="outline" className="mt-4">{t('trackCta')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot anti-spam : invisible et hors navigation clavier pour un humain, souvent rempli par les bots */}
      <input
        type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <h3 className="text-lg font-bold">{t('title')}</h3>

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

      {product.orderForm.some((f) => ['couleur', 'finition', 'dimensions'].includes(f.key)) && (
        <LiveProductPreview
          image={product.images[0]}
          colorValue={values.couleur}
          finishValue={values.finition}
          dimensionValue={values.dimensions}
        />
      )}

      {product.orderForm.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          locale={locale}
          value={values[field.key]}
          onChange={(v) => setField(field.key, v)}
        />
      ))}

      <DesignChoiceStep value={designChoice} onChange={setDesignChoice} />

      <fieldset>
        <legend className="mb-2 text-sm font-bold">{t('deliveryQuestion')}</legend>
        <div className="flex gap-3">
          {(['delivery', 'pickup'] as DeliveryMode[]).map((d) => (
            <label key={d} className={`flex-1 cursor-pointer rounded-md border-2 p-3 text-center text-sm font-semibold focus-within:ring-2 focus-within:ring-brand-cyan focus-within:ring-offset-2 ${delivery === d ? 'border-ink bg-ink text-paper' : 'border-ink-15'}`}>
              <input type="radio" name="delivery" value={d} checked={delivery === d} onChange={() => setDelivery(d)} className="sr-only" />
              {t(d)}
            </label>
          ))}
        </div>
        {delivery === 'delivery' && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input required placeholder={t('address')} value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input required placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder={t('instructions')} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm sm:col-span-2" />
          </div>
        )}
      </fieldset>

      {!isQuoteOnlyMode(product.pricingMode) && (
        <fieldset className="rounded-xl border-2 border-ink p-5 sm:p-6">
          <legend className="px-2 text-sm font-bold">{t('paymentStepTitle')}</legend>
          <p className="mb-4 text-xs text-ink-70">{t('paymentStepSubtitle')}</p>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {(['now_full', 'now_deposit', 'after_validation'] as const).map((choice) => (
              <label
                key={choice}
                className={`relative cursor-pointer rounded-lg border-2 p-3.5 text-center text-sm font-semibold transition-all duration-200 ease-premium focus-within:ring-2 focus-within:ring-brand-cyan focus-within:ring-offset-2 ${
                  paymentPreference === choice ? 'border-ink bg-ink text-paper shadow-card' : 'border-ink-15 hover:border-ink-40'
                }`}
              >
                <input
                  type="radio" name="payment-preference" value={choice}
                  checked={paymentPreference === choice} onChange={() => setPaymentPreference(choice)}
                  className="sr-only" required
                />
                {paymentPreference === choice && <CheckCircle2 size={14} className="absolute -top-1.5 -end-1.5 rounded-full bg-paper text-success" />}
                {t(`paymentChoice.${choice}`)}
              </label>
            ))}
          </div>

          {(paymentPreference === 'now_full' || paymentPreference === 'now_deposit') && (
            <div className="mt-4">
              <PaymentMethodPicker onChange={(p) => setPaymentProvider(p)} />
            </div>
          )}
          {paymentPreference === 'after_validation' && (
            <p className="mt-4 rounded-md bg-ink-8 p-3 text-xs text-ink-70">{t('afterValidationNote')}</p>
          )}
        </fieldset>
      )}

      {submitError && (
        <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{submitError}</p>
      )}

      <Button type="submit" variant="magenta" size="lg" className="w-full" loading={submitting} disabled={submitting}>
        {t('submit')}
      </Button>
      <p className="text-center text-xs text-ink-40">{t('reassurance')}</p>
    </form>
  );
}

function isQuoteOnlyMode(mode: Product['pricingMode']) {
  return mode === 'quote' || mode === 'hidden';
}
