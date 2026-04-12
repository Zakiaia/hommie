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
    <aside className="glass-panel flex h-screen w-64 shrink-0 flex-col border-l border-white/10 bg-zinc-950/40">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="font-heading text-lg font-semibold tracking-tight">Hommie</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-white/10 font-medium text-foreground shadow-inner'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:shadow-sm'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
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
