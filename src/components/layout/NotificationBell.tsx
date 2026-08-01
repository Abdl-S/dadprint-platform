'use client';

import { Bell } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { clientNotifications } from '@/lib/mock/account';

/** Indicateur de notifications non lues — mène à l'onglet dédié de l'espace client. */
export function NotificationBell() {
  const unread = clientNotifications.filter((n) => !n.read).length;

  return (
    <Link href="/compte?tab=notifications" aria-label="Notifications" className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5">
      <Bell size={18} />
      {unread > 0 && (
        <span className="absolute top-1 end-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-magenta text-[10px] font-bold text-white">
          {unread}
        </span>
      )}
    </Link>
  );
}
