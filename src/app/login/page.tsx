import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-6rem)] items-center py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
      <section className="space-y-5 pb-8 lg:pb-0">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Login</p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Access favorites and the admin upload workspace.</h1>
        <p className="max-w-lg text-base leading-7 text-muted">Sign in with email and password, or create a user account for saving recipes.</p>
      </section>
      <LoginForm />
    </div>
  );
}