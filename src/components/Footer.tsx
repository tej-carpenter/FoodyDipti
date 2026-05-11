"use client";

import Link from 'next/link';

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

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
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

function IconYoutube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" />
      <path d="m10 10 4 2-4 2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10v5" />
      <path d="M8 8.2v.1" />
      <path d="M11 15v-2.7c0-1.4.8-2.3 2-2.3 1.3 0 2 .9 2 2.3V15" />
      <path d="M15 12v3" />
    </svg>
  );
}

type FooterLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  icon: React.ReactNode;
};

function FooterLink({ href, label, external, icon }: FooterLinkProps) {
  const sharedClassName =
    'flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-[var(--muted)] transition hover:bg-[rgba(31,31,31,0.04)] hover:text-[var(--text)]';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClassName}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(31,31,31,0.05)] text-[var(--text)]">
          {icon}
        </span>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={sharedClassName}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(31,31,31,0.05)] text-[var(--text)]">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function Footer() {
  const navigationLinks = [
    { href: '/', label: 'Browse', icon: <IconHome className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <IconInfo className="h-4 w-4" /> },
    { href: '/profile', label: 'Saved', icon: <IconBookmark className="h-4 w-4" /> },
  ];

  const socialLinks = [
    { href: 'https://instagram.com/foodydipti', label: 'Instagram', icon: <IconInstagram className="h-4 w-4" />, external: true },
    { href: 'mailto:hello@foodydipti.com', label: 'Email', icon: <IconMail className="h-4 w-4" />, external: true },
    { href: 'https://www.youtube.com/@foodydiptii', label: 'YouTube', icon: <IconYoutube className="h-4 w-4" />, external: true },
  ];

  return (
    <footer className="border-t border-[rgba(31,31,31,0.08)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text)]">FoodyDipti</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Curated recipes for comfort, balance, and everyday cravings.
            </p>
          </div>

          {/* Middle Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text)]">Navigation</h4>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} icon={link.icon} />
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text)]">Connect</h4>
            <div className="space-y-1">
              {socialLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  external={link.external}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 border-t border-[rgba(31,31,31,0.08)] pt-8">
          <p className="text-center text-xs text-[var(--muted)]">
            © 2026 FoodyDipti. Recipe content by Dipti. Platform designed & developed by{' '}
            <a href="https://www.linkedin.com/in/tej-prakash-carpenter/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--text)]">
              Tej
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
