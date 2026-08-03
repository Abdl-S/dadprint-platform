'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileCheck2, Palette, PenLine, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUpload } from './FileUpload';
import type { DesignChoice } from '@/types';

/**
 * Étape obligatoire présente sur CHAQUE formulaire de commande/devis :
 * "Possédez-vous déjà votre design ?"
 * — Oui           → téléversement du fichier
 * — Non            → brief de création (questions dédiées)
 * — Modification    → fichier existant + description des changements
 *
 * Un seul composant, réutilisé partout, pour ne jamais dupliquer cette logique.
 */
export function DesignChoiceStep({
  value, onChange, onFilesChange, onBriefChange,
}: {
  value: DesignChoice;
  onChange: (v: DesignChoice) => void;
  onFilesChange?: (files: File[]) => void;
  onBriefChange?: (text: string) => void;
}) {
  const t = useTranslations('designStep');
  const [brief, setBrief] = useState('');

  function handleBriefChange(text: string) {
    setBrief(text);
    onBriefChange?.(text);
  }

  const options: { key: DesignChoice; label: string; icon: typeof FileCheck2 }[] = [
    { key: 'has_design', label: t('hasDesign'), icon: FileCheck2 },
    { key: 'needs_design', label: t('needsDesign'), icon: Palette },
    { key: 'needs_edit', label: t('needsEdit'), icon: PenLine },
  ];

  return (
    <fieldset className="rounded-xl border border-ink-15 p-5 sm:p-6">
      <legend className="px-2 text-sm font-bold">{t('question')}</legend>

      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt.key}
            className={cn(
              'relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 px-4 py-5 text-center text-sm font-semibold transition-all duration-200 ease-premium focus-within:ring-2 focus-within:ring-brand-cyan focus-within:ring-offset-2',
              value === opt.key ? 'border-ink bg-ink text-paper shadow-card' : 'border-ink-15 hover:border-ink-40 hover:-translate-y-0.5'
            )}
          >
            <input
              type="radio"
              name="design-choice"
              value={opt.key}
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
              className="sr-only"
            />
            {value === opt.key && <CheckCircle2 size={14} className="absolute -top-1.5 -end-1.5 rounded-full bg-paper text-success" />}
            <opt.icon size={22} className={value === opt.key ? 'text-paper' : 'text-ink-40'} />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="mt-5">
        {value === 'has_design' && (
          <div>
            <p className="mb-2 text-sm text-ink-70">{t('uploadPrompt')}</p>
            <FileUpload onChange={onFilesChange} />
          </div>
        )}

        {value === 'needs_design' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-70">{t('briefPrompt')}</p>
            <textarea
              value={brief}
              onChange={(e) => handleBriefChange(e.target.value)}
              rows={4}
              placeholder={t('briefPlaceholder')}
              className="w-full rounded-lg border border-ink-15 p-3.5 text-sm transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
        )}

        {value === 'needs_edit' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-70">{t('editUploadPrompt')}</p>
            <FileUpload onChange={onFilesChange} />
            <textarea
              rows={3}
              placeholder={t('editDescriptionPlaceholder')}
              onChange={(e) => handleBriefChange(e.target.value)}
              className="w-full rounded-lg border border-ink-15 p-3.5 text-sm transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
        )}
      </div>
    </fieldset>
  );
}
