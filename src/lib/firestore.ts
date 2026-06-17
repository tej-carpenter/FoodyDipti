import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebase';
import { mockRecipes } from '@/lib/mock-data';
import type { ContactSubmission, Favorite, Recipe } from '@/types';

function requireDb() {
  if (!firebaseDb) {
    throw new Error('Firebase is not configured. Add env variables to enable live data.');
  }

  return firebaseDb;
}

export async function fetchRecipes() {
  if (!firebaseDb) {
    return mockRecipes.map(recipe => ({ ...recipe, normalizedIngredients: recipe.normalizedIngredients ?? [] }));
  }

  try {
    const snapshot = await getDocs(query(collection(requireDb(), 'recipes'), orderBy('created_at', 'desc'), limit(60)));
    return snapshot.docs.map((document) => {
      const data = document.data() as Omit<Recipe, 'id'>;
      return { 
        id: document.id, 
        ...data,
        normalizedIngredients: data.normalizedIngredients ?? []
      };
    });
  } catch (fetchError) {
    console.error('Failed to fetch recipes from Firestore. Falling back to mock recipes.', fetchError);
    return mockRecipes.map(recipe => ({ ...recipe, normalizedIngredients: recipe.normalizedIngredients ?? [] }));
  }
}

export async function fetchRecipe(id: string) {
  if (!firebaseDb) {
    const recipe = mockRecipes.find((recipe) => recipe.id === id) ?? null;
    return recipe ? { ...recipe, normalizedIngredients: recipe.normalizedIngredients ?? [] } : null;
  }

  try {
    const snapshot = await getDoc(doc(requireDb(), 'recipes', id));
    if (snapshot.exists()) {
      const data = snapshot.data() as Omit<Recipe, 'id'>;
      return { 
        id: snapshot.id, 
        ...data,
        normalizedIngredients: data.normalizedIngredients ?? []
      };
    }
    return null;
  } catch (fetchError) {
    console.error(`Failed to fetch recipe ${id} from Firestore.`, fetchError);
    const recipe = mockRecipes.find((recipe) => recipe.id === id) ?? null;
    return recipe ? { ...recipe, normalizedIngredients: recipe.normalizedIngredients ?? [] } : null;
  }
}

export async function fetchFavorites(userId: string) {
  if (!firebaseDb) {
    return mockRecipes.slice(0, 1).map((recipe) => ({
      id: `${userId}-${recipe.id}`,
      user_id: userId,
      recipe_id: recipe.id,
      created_at: new Date().toISOString(),
    })) as Favorite[];
  }

  try {
    const snapshot = await getDocs(query(collection(requireDb(), 'favorites'), where('user_id', '==', userId)));
    return snapshot.docs.map((document) => {
      const data = document.data() as Omit<Favorite, 'id'>;
      return { id: document.id, ...data };
    });
  } catch (fetchError) {
    console.error('Failed to fetch favorites from Firestore. Falling back to empty favorites.', fetchError);
    return [];
  }
}

export async function createContactSubmission(submission: Omit<ContactSubmission, 'id'>) {
  if (!firebaseDb) {
    // fallback to local API
    try {
      const res = await fetch('/api/contact/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('Local save failed', err);
      return null;
    }
  }

  // Firestore rejects fields with `undefined` values. strip them out before saving.
  const payload = { ...submission } as Record<string, unknown>;
  Object.keys(payload).forEach((k) => {
    if (typeof payload[k] === 'undefined') delete payload[k];
  });

  const documentReference = await addDoc(collection(requireDb(), 'contact_messages'), payload as DocumentData);
  return { id: documentReference.id, ...(payload as Omit<ContactSubmission, 'id'>) };
}

export async function markContactSubmissionRead(id: string, status: 'read' | 'unread') {
  if (!firebaseDb) {
    await fetch('/api/contact/local', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return;
  }

  await updateDoc(doc(requireDb(), 'contact_messages', id), {
    status,
  });
}

export async function deleteContactSubmission(id: string) {
  if (!firebaseDb) {
    await fetch(`/api/contact/local?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return;
  }

  await deleteDoc(doc(requireDb(), 'contact_messages', id));
}

export async function fetchContactSubmissions() {
  if (!firebaseDb) {
    try {
      const res = await fetch('/api/contact/local');
      if (!res.ok) return [] as ContactSubmission[];
      return (await res.json()) as ContactSubmission[];
    } catch (err) {
      console.error('Failed to fetch local contact submissions', err);
      return [] as ContactSubmission[];
    }
  }

  try {
    const snapshot = await getDocs(query(collection(requireDb(), 'contact_messages'), orderBy('created_at', 'desc'), limit(50)));
    return snapshot.docs.map((document) => ({ id: document.id, ...(document.data() as Omit<ContactSubmission, 'id'>) }));
  } catch (fetchError) {
    console.error('Failed to fetch contact submissions from Firestore.', fetchError);
    return [] as ContactSubmission[];
  }
}

export async function createFavorite(userId: string, recipeId: string) {
  if (!firebaseDb) {
    return;
  }

  await setDoc(doc(requireDb(), 'favorites', `${userId}_${recipeId}`), {
    user_id: userId,
    recipe_id: recipeId,
    created_at: new Date().toISOString(),
  });
}

export async function removeFavorite(userId: string, recipeId: string) {
  if (!firebaseDb) {
    return;
  }

  await deleteDoc(doc(requireDb(), 'favorites', `${userId}_${recipeId}`));
}

export async function uploadRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>) {
  if (!firebaseDb) {
    return { id: crypto.randomUUID() };
  }

  return addDoc(collection(requireDb(), 'recipes'), {
    ...recipe,
    created_at: serverTimestamp(),
  });
}

type EditableRecipeFields = Pick<
  Recipe,
  'title' | 'image_url' | 'instagram_url' | 'ingredients' | 'normalizedIngredients' | 'steps' | 'predefined_tags' | 'custom_tags' | 'description' | 'cooking_time_minutes' | 'difficulty'
>;

export async function updateRecipe(id: string, updates: EditableRecipeFields) {
  if (!firebaseDb) {
    // No persistent updates in mock mode
    return;
  }

  try {
    await updateDoc(doc(requireDb(), 'recipes', id), updates);
  } catch (err) {
    console.error(`Failed to update recipe ${id}`, err);
    throw err;
  }
}

export async function deleteRecipe(id: string) {
  if (!firebaseDb) {
    // In mock mode there's nothing to delete; just return
    return;
  }

  try {
    await deleteDoc(doc(requireDb(), 'recipes', id));
  } catch (err) {
    console.error(`Failed to delete recipe ${id}`, err);
    throw err;
  }
}
