'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createContactSubmission } from '@/lib/firestore';

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

function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 14v3h2v-3h2v-2h-2V10c0-.6.4-1 1-1h1V7c-.5 0-1.5-.2-2.3-.2-2.3 0-4 1.5-4 4.2V12h-2v2h2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

type SocialLink = {
  href: string;
  label: string;
  external?: boolean;
  icon: React.ReactNode;
};

function SocialLink({ href, label, external, icon }: SocialLink) {
  const sharedClassName =
    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[rgba(31,31,31,0.04)] hover:text-[var(--text)]';

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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socialLinks: SocialLink[] = [
    { href: 'https://instagram.com/foodydipti', label: 'Instagram', icon: <IconInstagram className="h-4 w-4" />, external: true },
    { href: 'mailto:foodydipti@gmail.com', label: 'Email', icon: <IconMail className="h-4 w-4" />, external: true },
    { href: 'https://www.youtube.com/@foodydiptii', label: 'YouTube', icon: <IconYoutube className="h-4 w-4" />, external: true },
    { href: 'https://facebook.com/foodydipti', label: 'Facebook', icon: <IconFacebook className="h-4 w-4" />, external: true },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errText = 'Failed to send message';
        try {
          const body = await response.json();
          if (body?.error) errText = String(body.error);
          else if (body?.message) errText = String(body.message);
        } catch {
          // ignore parse errors
        }
        throw new Error(errText);
      }

      const result = (await response.json()) as {
        adminEmails?: string[];
        emailStatus?: 'sent' | 'skipped' | 'failed';
        emailError?: string;
      };

      await createContactSubmission({
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        message: formData.message.trim(),
        created_at: new Date().toISOString(),
        status: 'unread',
        admin_emails: result.adminEmails,
        email_status: result.emailStatus,
        email_error: result.emailError,
      });
      setErrorMessage(null);
      setStatus('success');
      setFormData({ name: '', contact: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message || 'Failed to send message. Please try again or email us directly.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-12 bg-[var(--background)] pb-12">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Get in Touch</p>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text)] sm:text-6xl">
            Contact FoodyDipti
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            Have a question, suggestion, or just want to say hi? We&apos;d love to hear from you. Reach out through any of our channels.
          </p>
        </div>
      </section>

      {/* CONTACT FORM & SOCIAL GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Send us a Message</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
                Let&apos;s chat
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text)]">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[rgba(31,31,31,0.1)] bg-white px-4 py-2.5 text-[var(--text)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-[var(--text)]">
                  Email or Mobile
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[rgba(31,31,31,0.1)] bg-white px-4 py-2.5 text-[var(--text)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  placeholder="email@example.com or +1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text)]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-[rgba(31,31,31,0.1)] bg-white px-4 py-2.5 text-[var(--text)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  Message sent successfully! We&apos;ll get back to you soon.
                </p>
              )}

              {status === 'error' && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage ?? 'Failed to send message. Please try again or email us directly.'}
                </p>
              )}
            </form>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Other Ways to Connect</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
                Find us online
              </h2>
            </div>

            <div className="space-y-3 rounded-[1.75rem] bg-[var(--surface)] p-6">
              {socialLinks.map((link) => (
                <SocialLink key={link.label} href={link.href} label={link.label} icon={link.icon} external={link.external} />
              ))}
            </div>

            <div className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Direct Email</p>
                <p className="mt-2 text-sm font-medium text-[var(--text)]">
                  <a href="mailto:foodydipti@gmail.com" className="hover:text-[var(--accent)] transition">
                    foodydipti@gmail.com
                  </a>
                </p>
              </div>
              <div className="border-t border-[rgba(31,31,31,0.08)] pt-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Hours</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
