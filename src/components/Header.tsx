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
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/profile', label: 'Saved', requiresAuth: true },
  { href: '/admin', label: 'Admin' },
];

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function IconInfo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v6" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function IconBookmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4.5h12v16l-6-3-6 3z" />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5.5 7.5 6.5 5 6.5-5" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

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
    <header className="sticky top-0 z-30 bg-[rgba(248,245,240,0.88)] shadow-[0_10px_30px_rgba(31,31,31,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="space-y-0.5 transition hover:opacity-90">
          <div className="text-lg font-semibold tracking-[-0.03em] text-[var(--text)]">FoodyDipti</div>
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Recipe archive</div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {visibleNavItems.map((item) => {
            let icon;
            if (item.href === '/') icon = <IconHome className="h-4 w-4" />;
            else if (item.href === '/about') icon = <IconInfo className="h-4 w-4" />;
            else if (item.href === '/contact') icon = <IconMail className="h-4 w-4" />;
            else icon = <IconBookmark className="h-4 w-4" />;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ease-out ${isActivePath(pathname, item.href) ? 'bg-white text-[var(--text)] shadow-[0_10px_24px_rgba(31,31,31,0.06)]' : 'text-[var(--muted)] hover:bg-white/70 hover:text-[var(--text)]'}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(31,31,31,0.04)] text-[var(--text)]">{icon}</span>
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full bg-white p-2 text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.06)] md:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_10px_24px_rgba(31,31,31,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,31,31,0.08)]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">{(user.displayName ?? user.email ?? 'P')[0].toUpperCase()}</span>
                <span className="text-sm font-medium text-[var(--text)]">Profile</span>
              </Link>
              <Link href="/profile" className="rounded-full bg-[rgba(217,119,6,0.12)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[rgba(217,119,6,0.18)]">
                Saved
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_10px_24px_rgba(31,31,31,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,31,31,0.08)]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">P</span>
              <span className="text-sm font-medium text-[var(--text)]">Profile</span>
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: '#fff' }}
            >
              Log out
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90" style={{ color: '#fff' }}>
              Log in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="space-y-2 border-t border-[rgba(31,31,31,0.06)] bg-[var(--surface)] px-4 py-3 md:hidden">
          {visibleNavItems.map((item) => {
            let icon;
            if (item.href === '/') icon = <IconHome className="h-4 w-4" />;
            else if (item.href === '/about') icon = <IconInfo className="h-4 w-4" />;
            else if (item.href === '/contact') icon = <IconMail className="h-4 w-4" />;
            else icon = <IconBookmark className="h-4 w-4" />;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-2xl px-3 py-2 text-sm transition ${isActivePath(pathname, item.href) ? 'bg-white text-[var(--text)] shadow-[0_8px_20px_rgba(31,31,31,0.05)]' : 'text-[var(--muted)] hover:bg-white/70 hover:text-[var(--text)]'}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(31,31,31,0.04)] text-[var(--text)]">{icon}</span>
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
          <div className="space-y-2 pt-3">
            {user ? (
              <>
                <div className="rounded-2xl bg-white px-3 py-3 text-sm text-[var(--muted)] shadow-[0_8px_20px_rgba(31,31,31,0.05)]">{user?.displayName ?? user?.email}</div>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-2xl bg-[var(--text)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ color: '#fff' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-2xl bg-[var(--text)] px-3 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: '#fff' }}
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