"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop Nav */}
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg border border-border p-2 text-ink"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-muted">{user?.displayName ?? user?.email ?? 'Guest'}</span>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm transition ${pathname === item.href ? 'bg-ink/10 text-ink font-medium' : 'text-muted hover:bg-ink/5 hover:text-ink'}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted">{user?.displayName ?? user?.email}</div>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink transition hover:bg-accentSoft"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-ink px-3 py-2 text-center text-sm text-white transition hover:opacity-90"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}