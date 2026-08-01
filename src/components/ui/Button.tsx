'use client';

import { useState, useRef, type MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

/**
 * Coins arrondis modernes, micro-interaction au survol (légère élévation +
 * ombre teintée), léger retrait au clic, et un effet ripple discret au point
 * de clic exact — jamais un effet brutal ou qui distrait de l'action.
 * `magenta` reste le variant qui doit naturellement attirer l'œil (ombre
 * colorée + élévation), les autres restent discrets par contraste.
 */
const buttonStyles = cva(
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg font-semibold transition-all duration-200 ease-premium active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
  {
    variants: {
      variant: {
        solid: 'bg-ink text-paper shadow-soft hover:shadow-raised hover:-translate-y-0.5',
        magenta: 'bg-brand-magenta text-white shadow-glow hover:shadow-[0_12px_32px_rgba(234,14,138,0.32)] hover:-translate-y-0.5',
        outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
        ghost: 'text-ink hover:bg-ink/5',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-7 py-4 text-base',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  href?: string;
  /** Ouvre dans un nouvel onglet — utile pour WhatsApp/liens externes. */
  external?: boolean;
  /** Affiche un spinner et désactive le bouton — pour les soumissions de formulaire. */
  loading?: boolean;
}

interface Ripple { id: number; x: number; y: number; size: number; }

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);

  function addRipple(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = counter.current++;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }

  const layer = (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </>
  );

  return { addRipple, layer };
}

/**
 * Bouton unique pour tout le site — variantes contrôlées, jamais de style ad hoc dupliqué.
 * `href` interne (ex: "/devis") → passe par le routing conscient de la langue.
 * `href` externe (wa.me, tel:) ou `external` → ancre classique, jamais préfixée par la locale.
 */
export function Button({ className, variant, size, href, external, loading, disabled, children, onClick, ...props }: ButtonProps) {
  const { addRipple, layer } = useRipple();
  const classes = cn(buttonStyles({ variant, size }), loading && 'cursor-wait', className);
  const isExternal = external || (href && (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')));

  const content = (
    <>
      {layer}
      {loading && <Loader2 size={16} className="animate-spin" />}
      <span className={loading ? 'opacity-80' : undefined}>{children}</span>
    </>
  );

  if (href && isExternal) {
    const anchorProps = props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={addRipple} {...anchorProps}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={addRipple}>
        {content}
      </Link>
    );
  }
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={(e) => { addRipple(e); onClick?.(e); }}
      {...props}
    >
      {content}
    </button>
  );
}
