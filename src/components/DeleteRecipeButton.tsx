"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteRecipe } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;

  const handle = async () => {
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    setBusy(true);
    try {
      await deleteRecipe(recipeId);
      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete recipe');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={busy}
      className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {busy ? 'Deleting...' : 'Delete recipe'}
    </button>
  );
}
