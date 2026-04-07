'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { he } from '@/lib/i18n/he';
import {
  Building2,
  LayoutDashboard,
  UserCircle,
  PlusCircle,
  Settings,
  LogOut,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: he.nav.dashboard, icon: LayoutDashboard },
  { href: '/onboarding', label: he.nav.onboarding, icon: ClipboardList },
  { href: '/profile', label: he.nav.profile, icon: UserCircle },
  { href: '/analysis/new', label: he.nav.newAnalysis, icon: PlusCircle },
  { href: '/settings', label: he.nav.settings, icon: Settings },
];

export function AppNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-l bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">Hommie</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        {session?.user && (
          <div className="mb-2 px-3 text-sm text-muted-foreground">
            {session.user.name || session.user.email}
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          {he.nav.logout}
        </Button>
      </div>
    </aside>
  );
}
