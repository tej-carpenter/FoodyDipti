"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

type NavItem = {
  href: string;
  label: string;
  requiresAuth?: boolean;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Browse' },
  { href: '/profile', label: 'Saved', requiresAuth: true },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();

  const visibleNavItems = navItems.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.href === '/admin' && !isAdmin) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="space-y-0.5">
          <div className="text-lg font-semibold tracking-tight text-ink">FoodyDipti</div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted">Recipe archive</div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${pathname === item.href ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">{user?.displayName ?? user?.email ?? 'Guest'}</span>
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink/20 hover:bg-accentSoft"
            >
              Log out
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm text-white transition hover:opacity-90">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}