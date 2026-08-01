'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { OrderFormField } from '@/types';
import { FIELD_TYPE_LABELS } from '@/types';

const TYPES_WITH_OPTIONS: OrderFormField['type'][] = ['select', 'radio', 'checkbox', 'color'];

function blankField(type: OrderFormField['type']): OrderFormField {
  const base = { key: `champ_${Date.now()}`, label: { fr: '', en: '', ar: '' }, required: false };
  if (TYPES_WITH_OPTIONS.includes(type)) return { ...base, type, options: [] } as OrderFormField;
  return { ...base, type } as OrderFormField;
}

/**
 * Constructeur visuel du formulaire de commande — l'admin choisit un type de
 * champ, le configure (obligatoire, valeur par défaut, choix multiples), et
 * ce tableau devient directement `product.orderForm`, lu tel quel par
 * `DynamicOrderForm` sur le site public. Aucune ligne de code à écrire.
 */
export function FormFieldBuilder({
  fields, onChange,
}: { fields: OrderFormField[]; onChange: (fields: OrderFormField[]) => void }) {
  function addField(type: OrderFormField['type']) {
    onChange([...fields, blankField(type)]);
  }

  function updateField(index: number, patch: Partial<OrderFormField>) {
    const next = [...fields];
    next[index] = { ...next[index], ...patch } as OrderFormField;
    onChange(next);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="space-y-3">
        {fields.map((field, i) => (
          <div key={field.key} className="rounded-lg border border-ink-15 p-4">
            <div className="flex items-center gap-2">
              <GripVertical size={15} className="shrink-0 text-ink-15" />
              <input
                placeholder="Nom du champ (ex : Couleur)" aria-label="Nom du champ (ex : Couleur)"
                value={field.label.fr}
                onChange={(e) => updateField(i, { label: { ...field.label, fr: e.target.value } })}
                className="flex-1 rounded-md border border-ink-15 p-2 text-sm font-semibold"
              />
              <span className="shrink-0 rounded-full bg-ink-8 px-2.5 py-1 text-[11px] font-bold text-ink-70">
                {FIELD_TYPE_LABELS[field.type]}
              </span>
              <button onClick={() => removeField(i)} aria-label="Supprimer le champ">
                <Trash2 size={15} className="text-danger" />
              </button>
            </div>

            {'options' in field && (
              <input
                placeholder="Options séparées par une virgule (ex : Rouge, Bleu, Vert)" aria-label="Options séparées par une virgule (ex : Rouge, Bleu, Vert)"
                value={(field.options as string[]).join(', ')}
                onChange={(e) => updateField(i, { options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean) } as Partial<OrderFormField>)}
                className="mt-2.5 w-full rounded-md border border-ink-15 p-2 text-sm"
              />
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input type="checkbox" checked={!!field.required} onChange={(e) => updateField(i, { required: e.target.checked })} />
                Obligatoire
              </label>
              {'defaultValue' in field && (
                <input
                  placeholder="Valeur par défaut" aria-label="Valeur par défaut"
                  value={(field as any).defaultValue ?? ''}
                  onChange={(e) => updateField(i, { defaultValue: e.target.value } as Partial<OrderFormField>)}
                  className="rounded-md border border-ink-15 p-1.5 text-xs"
                />
              )}
            </div>
          </div>
        ))}
        {fields.length === 0 && <p className="text-sm text-ink-40">Aucun champ pour l'instant — ajoutez-en un ci-dessous.</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(FIELD_TYPE_LABELS) as OrderFormField['type'][]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addField(type)}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-ink-15 px-3 py-1.5 text-xs font-bold hover:border-brand-cyan hover:text-brand-cyan"
          >
            <Plus size={12} /> {FIELD_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
