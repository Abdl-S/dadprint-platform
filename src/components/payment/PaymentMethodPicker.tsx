'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { paymentProviders } from '@/lib/payment-providers';
import { FileUpload } from '@/components/order/FileUpload';
import type { PaymentProvider } from '@/types';

/**
 * Sélection du moyen de paiement + preuve de paiement.
 * Purement déclaratif pour l'instant : la validation réelle du paiement
 * se fera depuis l'administration (module suivant) — ici on collecte
 * juste l'information et on affiche une confirmation de réception.
 */
export function PaymentMethodPicker({
  onChange,
}: { onChange?: (provider: PaymentProvider | null, hasProof: boolean) => void }) {
  const t = useTranslations('payment');
  const [selected, setSelected] = useState<PaymentProvider | null>(null);
  const [proofUploaded, setProofUploaded] = useState(false);

  const enabled = paymentProviders.filter((p) => p.enabled);

  function select(id: PaymentProvider) {
    setSelected(id);
    onChange?.(id, proofUploaded);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold">{t('chooseMethod')}</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {enabled.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => select(p.id)}
            className={`relative rounded-md border-2 px-3 py-3 text-sm font-bold transition-colors ${
              selected === p.id ? 'border-ink bg-ink text-paper' : 'border-ink-15 hover:border-ink-40'
            }`}
          >
            {p.label}
            {selected === p.id && (
              <CheckCircle2 size={15} className="absolute -top-1.5 -end-1.5 rounded-full bg-paper text-success" />
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-ink-40">{t('proofHint', { method: enabled.find((p) => p.id === selected)?.label ?? '' })}</p>
          <FileUpload
            multiple={false}
            onChange={(files) => {
              const has = files.length > 0;
              setProofUploaded(has);
              onChange?.(selected, has);
            }}
          />
        </div>
      )}
    </div>
  );
}
