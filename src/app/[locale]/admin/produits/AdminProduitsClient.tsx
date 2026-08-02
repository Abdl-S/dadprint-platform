'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminModal } from '@/components/admin/AdminModal';
import { Toggle } from '@/components/admin/Toggle';
import { FormFieldBuilder } from '@/components/admin/FormFieldBuilder';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import type { Category } from '@/types';
import type { Product, PricingMode } from '@/types';

const emptyProduct = (defaultCategorySlug: string): Product => ({
  id: `new-${Date.now()}`, slug: '', categorySlug: defaultCategorySlug,
  name: { fr: '', en: '', ar: '' }, shortDescription: { fr: '', en: '', ar: '' }, description: { fr: '', en: '', ar: '' },
  images: [], specs: [], faq: [], pricingMode: 'quote', orderForm: [], available: true,
});

export function AdminProduitsClient({ initialProducts, categories: initialCategories }: { initialProducts: Product[]; categories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'infos' | 'prix' | 'formulaire' | 'seo' | 'social'>('infos');
  const [generating, setGenerating] = useState(false);
  const [socialContent, setSocialContent] = useState<{ socialPost: string; hashtags: string[] } | null>(null);

  async function generateWithAI() {
    if (!editing || !editing.name.fr) { alert('Renseignez au moins le nom du produit avant de générer.'); return; }
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: editing.name.fr, category: categories.find((c) => c.slug === editing.categorySlug)?.name.fr }),
      });
      const data = await res.json();
      setEditing((prev) => prev && {
        ...prev,
        shortDescription: { ...prev.shortDescription, fr: data.shortDescription },
        description: { ...prev.description, fr: data.description },
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      });
      setSocialContent({ socialPost: data.socialPost, hashtags: data.hashtags });
    } finally {
      setGenerating(false);
    }
  }

  function openEdit(p: Product) { setEditing({ ...p }); setTab('infos'); setModalOpen(true); }
  function openNew() { setEditing(emptyProduct(categories[0]?.slug ?? '')); setTab('infos'); setModalOpen(true); }

  async function createCategoryQuick() {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: { fr: newCategoryName, en: newCategoryName, ar: newCategoryName } }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
      const { id } = await res.json();
      const newCat: Category = { id, slug, name: { fr: newCategoryName, en: newCategoryName, ar: newCategoryName }, description: { fr: '', en: '', ar: '' }, coverImageUrl: '', productCount: 0 };
      setCategories((prev) => [...prev, newCat]);
      if (editing) setEditing({ ...editing, categorySlug: slug });
      setNewCategoryName('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setCreatingCategory(false);
    }
  }

  async function save() {
    if (!editing) return;
    const slug = editing.slug || editing.name.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const toSave = { ...editing, slug };
    const isNew = editing.id.startsWith('new-');

    setSaving(true);
    setSaveError(null);

    const payload = {
      slug: toSave.slug, categorySlug: toSave.categorySlug, name: toSave.name,
      shortDescription: toSave.shortDescription, description: toSave.description,
      images: toSave.images, pricingMode: toSave.pricingMode, priceLabel: toSave.priceLabel,
      priceNote: toSave.priceNote, minQuantity: toSave.minQuantity, delay: toSave.delay,
      available: toSave.available, orderForm: toSave.orderForm,
    };

    try {
      if (isNew) {
        const res = await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la création');
        const { id } = await res.json();
        setProducts((prev) => [...prev, { ...toSave, id }]);
      } else {
        const res = await fetch(`/api/admin/products/${toSave.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Échec de la mise à jour');
        setProducts((prev) => prev.map((p) => (p.id === toSave.id ? toSave : p)));
      }
      setModalOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce produit ?')) return;
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setProducts(previous); // annule l'optimisme si la suppression échoue réellement en base
      alert('La suppression a échoué. Réessayez.');
    }
  }

  async function toggleAvailable(id: string) {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextAvailable = target.available === false ? true : false;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: nextAvailable } : p)));
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available: nextAvailable }),
    });
    if (!res.ok) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: target.available } : p))); // annule si échec réel
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{products.length} produits — catégories, variantes et formulaires illimités.</p>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      <AdminTable headers={['Produit', 'Catégorie', 'Tarification', 'Champs formulaire', 'Disponible', '']}>
        {products.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {p.images[0] && <img src={p.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />}
                <span className="font-semibold">{p.name.fr}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-ink-70">{categories.find((c) => c.slug === p.categorySlug)?.name.fr ?? '—'}</td>
            <td className="px-4 py-3"><StatusBadge label={p.pricingMode} className="bg-ink-8 text-ink capitalize" /></td>
            <td className="px-4 py-3">{p.orderForm.length}</td>
            <td className="px-4 py-3"><Toggle checked={p.available !== false} onChange={() => toggleAvailable(p.id)} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => openEdit(p)}><Pencil size={14} className="text-ink-40" /></button>
                <button onClick={() => remove(p.id)}><Trash2 size={14} className="text-danger" /></button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.slug ? `Modifier — ${editing.name.fr}` : 'Nouveau produit'} wide>
        {editing && (
          <div>
            <div className="mb-5 flex gap-1 rounded-lg bg-ink-8 p-1">
              {(['infos', 'prix', 'formulaire', 'seo', 'social'] as const).map((t) => (
                <button
                  key={t} onClick={() => setTab(t)}
                  className={`flex-1 rounded-md py-2 text-xs font-bold capitalize ${tab === t ? 'bg-white shadow-soft' : 'text-ink-40'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'infos' && (
              <div className="space-y-3">
                <input placeholder="Nom du produit" aria-label="Nom du produit" value={editing.name.fr} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, fr: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <select aria-label="Catégorie" value={editing.categorySlug} onChange={(e) => setEditing({ ...editing, categorySlug: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm">
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.parentSlug ? '↳ ' : ''}{c.name.fr}</option>)}
                </select>
                <div className="flex gap-2">
                  <input
                    placeholder="Nouvelle catégorie (ex : Porte-clés)" aria-label="Nom de la nouvelle catégorie"
                    value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createCategoryQuick(); } }}
                    className="flex-1 rounded-md border border-ink-15 p-2.5 text-xs"
                  />
                  <button
                    type="button" onClick={createCategoryQuick} disabled={creatingCategory || !newCategoryName.trim()}
                    className="shrink-0 rounded-md bg-ink px-3 text-xs font-bold text-paper disabled:opacity-40"
                  >
                    {creatingCategory ? '...' : '+ Créer'}
                  </button>
                </div>
                <button
                  type="button" onClick={generateWithAI} disabled={generating}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-magenta to-brand-cyan px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
                >
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {generating ? 'Génération en cours…' : 'Générer avec l\'IA (description + SEO)'}
                </button>
                <textarea placeholder="Description courte" aria-label="Description courte" rows={2} value={editing.shortDescription.fr} onChange={(e) => setEditing({ ...editing, shortDescription: { ...editing.shortDescription, fr: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <textarea placeholder="Description détaillée" aria-label="Description détaillée" rows={4} value={editing.description.fr} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, fr: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-40">Images du produit</p>
                  <AdminImageUpload images={editing.images} onChange={(images) => setEditing({ ...editing, images })} />
                </div>
                <input placeholder="URL vidéo (optionnel)" aria-label="URL vidéo (optionnel)" value={editing.videoUrl ?? ''} onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <input placeholder="Délai (ex : 48h)" aria-label="Délai (ex : 48h)" value={editing.delay?.fr ?? ''} onChange={(e) => setEditing({ ...editing, delay: { fr: e.target.value, en: e.target.value, ar: e.target.value } })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              </div>
            )}

            {tab === 'prix' && (
              <div className="space-y-3">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-semibold">Mode de tarification</span>
                  <select value={editing.pricingMode} onChange={(e) => setEditing({ ...editing, pricingMode: e.target.value as PricingMode })} className="w-full rounded-md border border-ink-15 p-3 text-sm">
                    <option value="fixed">Prix fixe</option>
                    <option value="from">À partir de...</option>
                    <option value="quote">Demander un devis</option>
                    <option value="hidden">Prix masqué</option>
                  </select>
                </label>
                <input placeholder="Prix affiché (ex : 5 000 MRU)" aria-label="Prix affiché (ex : 5 000 MRU)" value={editing.priceLabel ?? ''} onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <input placeholder="Prix promotionnel (optionnel)" aria-label="Prix promotionnel (optionnel)" value={editing.promoPriceLabel ?? ''} onChange={(e) => setEditing({ ...editing, promoPriceLabel: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <input type="number" placeholder="Quantité minimale" aria-label="Quantité minimale" value={editing.minQuantity ?? ''} onChange={(e) => setEditing({ ...editing, minQuantity: Number(e.target.value) })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              </div>
            )}

            {tab === 'formulaire' && (
              <FormFieldBuilder fields={editing.orderForm} onChange={(orderForm) => setEditing({ ...editing, orderForm })} />
            )}

            {tab === 'seo' && (
              <div className="space-y-3">
                <input placeholder="Titre SEO" aria-label="Titre SEO" value={editing.seoTitle ?? ''} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
                <textarea placeholder="Meta description" aria-label="Meta description" rows={3} value={editing.seoDescription ?? ''} onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              </div>
            )}

            {tab === 'social' && (
              <div className="space-y-4">
                {!socialContent ? (
                  <p className="text-sm text-ink-40">Cliquez sur "Générer avec l'IA" dans l'onglet Infos pour obtenir un brouillon de publication Facebook / Instagram / WhatsApp.</p>
                ) : (
                  <>
                    <div className="rounded-lg border border-ink-15 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-ink-40">Publication (Facebook / Instagram / WhatsApp)</p>
                      <textarea
                        rows={5} value={socialContent.socialPost}
                        onChange={(e) => setSocialContent({ ...socialContent, socialPost: e.target.value })}
                        className="w-full rounded-md border border-ink-15 p-3 text-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase text-ink-40">Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {socialContent.hashtags.map((h) => <span key={h} className="rounded-full bg-ink-8 px-2.5 py-1 text-xs font-semibold">{h}</span>)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(`${socialContent.socialPost}\n\n${socialContent.hashtags.join(' ')}`)}
                      className="text-xs font-bold text-brand-cyan"
                    >
                      Copier le texte complet
                    </button>
                  </>
                )}
              </div>
            )}

            {saveError && (
              <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{saveError}</p>
            )}
            <button onClick={save} disabled={saving} className="mt-5 w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer le produit'}
            </button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
