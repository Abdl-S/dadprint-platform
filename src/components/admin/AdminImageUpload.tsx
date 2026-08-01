'use client';

import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Envoi direct d'images vers Supabase Storage (bucket `dp-products`, public
 * en lecture, réservé à l'équipe en écriture). Remplace la saisie manuelle
 * d'URL — chaque image envoyée ici obtient automatiquement son URL publique,
 * ajoutée à la liste `images` du produit.
 */
export function AdminImageUpload({
  images, onChange,
}: { images: string[]; onChange: (images: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`Format non supporté : ${file.name} (JPG, PNG, WebP ou GIF uniquement)`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} dépasse ${MAX_SIZE_MB} Mo`);
        continue;
      }

      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('dp-products').upload(path, file);
      if (uploadError) {
        setError(`Échec de l'envoi de ${file.name} : ${uploadError.message}`);
        continue;
      }

      const { data } = supabase.storage.from('dp-products').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) onChange([...uploaded, ...images]);
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-15 p-6 text-center transition-colors hover:border-brand-cyan disabled:opacity-60"
      >
        {uploading ? <Loader2 size={20} className="animate-spin text-ink-40" /> : <UploadCloud size={20} className="text-ink-40" />}
        <span className="text-sm font-semibold">{uploading ? 'Envoi en cours...' : 'Cliquez ou glissez des images ici'}</span>
        <span className="text-xs text-ink-40">JPG, PNG, WebP, GIF — {MAX_SIZE_MB} Mo max par image</span>
      </button>
      <input
        ref={inputRef} type="file" accept={ACCEPTED.join(',')} multiple hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-2 text-xs text-danger">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-ink-15">
              <img src={url} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 start-1 rounded-full bg-brand-magenta px-2 py-0.5 text-[10px] font-bold text-white">
                  Principale
                </span>
              )}
              <button
                type="button" onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Retirer cette image"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
