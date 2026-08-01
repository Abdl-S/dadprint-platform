import { cn } from '@/lib/utils';

/** Rythme vertical cohérent entre les sections de page — ajuster ici, pas section par section. */
export function Section({
  children,
  className,
  as: Tag = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div';
}) {
  return <Tag className={cn('py-16 sm:py-24', className)}>{children}</Tag>;
}
