import { RecipeForm } from '@/components/forms/RecipeForm';

export default function AdminPage() {
  return (
    <div className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Admin</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Upload recipes for the feed.</h1>
        <p className="max-w-xl text-base leading-7 text-muted">This screen is restricted to the configured admin email and writes directly to Firestore and Storage when Firebase is enabled.</p>
      </section>
      <RecipeForm />
    </div>
  );
}