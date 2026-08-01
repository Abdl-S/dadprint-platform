import { cn } from '@/lib/utils';

/** Largeur de contenu cohérente sur tout le site — une seule source de vérité. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-container px-5 sm:px-8', className)}>
      {children}
    </div>
  );
}
