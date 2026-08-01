'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export function AdminModal({
  open, onClose, title, children, wide = false,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 p-4">
      <div className={`max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-md'} overflow-y-auto rounded-lg bg-white p-6 shadow-raised`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Fermer"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
