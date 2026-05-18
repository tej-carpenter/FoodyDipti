"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export function LoginForm() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      router.push('/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const continueWithGoogle = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.07)]">
      {mode === 'signup' && (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[rgba(217,119,6,0.35)] focus:shadow-[0_0_0_4px_rgba(217,119,6,0.08)]" />
        </label>
      )}
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text)]">Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[rgba(217,119,6,0.35)] focus:shadow-[0_0_0_4px_rgba(217,119,6,0.08)]" />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text)]">Password</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[rgba(217,119,6,0.35)] focus:shadow-[0_0_0_4px_rgba(217,119,6,0.08)]" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-[var(--accent)]">{message}</p>}

      <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)] disabled:opacity-60">
        {loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={loading}
        className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,31,31,0.08)] disabled:opacity-60"
      >
        Continue with Google
      </button>

      {mode === 'login' && (
        <button type="button" onClick={forgotPassword} disabled={loading} className="w-full text-sm text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-60">
          Forgot password?
        </button>
      )}

      <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="w-full text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </form>
  );
}