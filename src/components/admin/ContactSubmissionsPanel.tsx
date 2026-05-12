"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { deleteContactSubmission, fetchContactSubmissions, markContactSubmissionRead } from '@/lib/firestore';
import type { ContactSubmission } from '@/types';

function formatSubmissionDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function ContactSubmissionsPanel() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'recent'>('all');

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const data = await fetchContactSubmissions();
        if (!mounted) return;

        setSubmissions(data);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load contact submissions');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authLoading, isAdmin]);

  const handleToggleRead = async (submission: ContactSubmission) => {
    setBusyId(submission.id);
    setError('');

    try {
      const nextStatus = submission.status === 'read' ? 'unread' : 'read';
      await markContactSubmissionRead(submission.id, nextStatus);
      setSubmissions((current) => current.map((item) => (item.id === submission.id ? { ...item, status: nextStatus } : item)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update message status');
    } finally {
      setBusyId('');
    }
  };

  const handleDelete = async (submissionId: string) => {
    setBusyId(submissionId);
    setError('');

    try {
      await deleteContactSubmission(submissionId);
      setSubmissions((current) => current.filter((item) => item.id !== submissionId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete message');
    } finally {
      setBusyId('');
    }
  };

  if (authLoading || loading) {
    return (
      <section className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.06)]">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Contact Inbox</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Loading submissions...</h2>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="rounded-[1.75rem] bg-[var(--surface)] p-6 text-sm text-[var(--muted)] shadow-[0_18px_45px_rgba(31,31,31,0.06)]">
        Admin access only.
      </section>
    );
  }

  // compute filtered list
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  let filtered = submissions.slice();

  if (filter === 'unread') filtered = filtered.filter((s) => s.status !== 'read');
  if (filter === 'read') filtered = filtered.filter((s) => s.status === 'read');
  if (filter === 'recent') filtered = filtered.filter((s) => {
    const t = Date.parse(s.created_at);
    return !Number.isNaN(t) && now - t <= sevenDaysMs;
  });

  filtered.sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0));

  return (
    <section className="space-y-5 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.06)]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Contact Inbox</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Messages from the contact form</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">
          These are stored in Firestore and, when the email service is configured, also forwarded to the admin inbox.
        </p>
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[rgba(31,31,31,0.04)] text-[var(--text)]'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === 'unread' ? 'bg-[var(--accent)] text-white' : 'bg-[rgba(31,31,31,0.04)] text-[var(--text)]'}`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setFilter('read')}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === 'read' ? 'bg-[var(--accent)] text-white' : 'bg-[rgba(31,31,31,0.04)] text-[var(--text)]'}`}
            >
              Read
            </button>
            <button
              type="button"
              onClick={() => setFilter('recent')}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === 'recent' ? 'bg-[var(--accent)] text-white' : 'bg-[rgba(31,31,31,0.04)] text-[var(--text)]'}`}
            >
              Recent
            </button>
          </div>
          <div className="text-sm text-[var(--muted)]">Showing {filtered.length} of {submissions.length}</div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[rgba(31,31,31,0.12)] px-4 py-8 text-sm text-[var(--muted)]">
            No contact submissions match this filter.
          </p>
        ) : (
          filtered.map((submission) => (
            <article key={submission.id} className="space-y-3 rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)]">{submission.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{submission.contact}</p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  <p>{formatSubmissionDate(submission.created_at)}</p>
                  {submission.email_status ? <p className="mt-1">Email: {submission.email_status}</p> : null}
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">{submission.message}</p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] ${submission.status === 'read' ? 'bg-[rgba(31,31,31,0.08)] text-[var(--text)]' : 'bg-[rgba(217,119,6,0.12)] text-[var(--accent)]'}`}
                  >
                    {submission.status ?? 'unread'}
                  </span>
                  {submission.email_status ? (
                    <span className="rounded-full bg-[rgba(31,31,31,0.05)] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
                      Email: {submission.email_status}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(submission)}
                    disabled={busyId === submission.id}
                    className="rounded-full border border-[rgba(31,31,31,0.12)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition hover:bg-[rgba(31,31,31,0.04)] disabled:opacity-50"
                  >
                    Mark {submission.status === 'read' ? 'unread' : 'read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(submission.id)}
                    disabled={busyId === submission.id}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {submission.admin_emails && submission.admin_emails.length > 0 ? (
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Sent to: {submission.admin_emails.join(', ')}
                </p>
              ) : null}

              {submission.email_error ? <p className="text-sm text-red-700">Email error: {submission.email_error}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
