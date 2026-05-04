import { SavedRecipesPanel } from '@/components/profile/SavedRecipesPanel';

export default function ProfilePage() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Saved recipes</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Your favorites live here.</h1>
        <p className="max-w-2xl text-muted">When connected to Firebase, this page reads the signed-in user’s favorites collection.</p>
      </section>

      <SavedRecipesPanel />
    </div>
  );
}