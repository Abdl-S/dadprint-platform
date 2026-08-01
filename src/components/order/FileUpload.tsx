'use client';

import { useRef, useState } from 'react';
import { UploadCloud, X, FileText, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ACCEPTED_FILE_TYPES } from '@/types';
import { cn } from '@/lib/utils';

const MAX_SIZE_MB = 25;

/**
 * Zone de téléversement générique — accepte tous les formats utiles à l'impression.
 * Validation réelle côté client (extension + taille max) : un fichier rejeté
 * n'entre jamais dans la liste, avec un message d'erreur explicite. La
 * validation serveur (obligatoire en production, jamais confiance au seul
 * client) viendra avec le Storage Supabase, sans changer cette interface.
 */
export function FileUpload({
  multiple = true,
  onChange,
}: {
  multiple?: boolean;
  onChange?: (files: File[]) => void;
}) {
  const t = useTranslations('upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function isValid(file: File): boolean {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(ext as any)) return false;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return false;
    return true;
  }

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const valid = incoming.filter(isValid);
    const rejected = incoming.filter((f) => !valid.includes(f));

    if (rejected.length > 0) {
      setError(`${rejected.length} fichier(s) refusé(s) — format non autorisé ou taille supérieure à ${MAX_SIZE_MB} Mo.`);
    } else {
      setError(null);
    }

    const next = multiple ? [...files, ...valid] : valid.slice(0, 1);
    setFiles(next);
    onChange?.(next);
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange?.(next);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ease-premium',
          dragOver ? 'scale-[1.01] border-brand-cyan bg-brand-cyan/5' : 'border-ink-15 hover:border-brand-cyan/60'
        )}
      >
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-ink-8 transition-transform', dragOver && 'scale-110')}>
          <UploadCloud className="text-ink-40" size={22} />
        </span>
        <span className="text-sm font-semibold">{t('dropText')}</span>
        <span className="text-xs text-ink-40">{ACCEPTED_FILE_TYPES.join(', ')} — {MAX_SIZE_MB} Mo max</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={ACCEPTED_FILE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-danger">
          <AlertTriangle size={13} /> {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-sm bg-ink-8 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 truncate">
                <FileText size={15} className="shrink-0 text-ink-40" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-[10px] text-ink-40">({(f.size / 1024 / 1024).toFixed(1)} Mo)</span>
              </span>
              <button type="button" onClick={() => removeFile(i)} aria-label="Retirer">
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
