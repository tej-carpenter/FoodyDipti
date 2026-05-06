import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebase';
import { mockRecipes } from '@/lib/mock-data';
import type { Favorite, Recipe } from '@/types';

function requireDb() {
  if (!firebaseDb) {
    throw new Error('Firebase is not configured. Add env variables to enable live data.');
  }

  return firebaseDb;
}

export async function fetchRecipes() {
  if (!firebaseDb) {
    return mockRecipes;
  }

  try {
    const snapshot = await getDocs(query(collection(requireDb(), 'recipes'), orderBy('created_at', 'desc'), limit(60)));
    return snapshot.docs.map((document) => ({ id: document.id, ...(document.data() as Omit<Recipe, 'id'>) }));
  } catch (fetchError) {
    console.error('Failed to fetch recipes from Firestore. Falling back to mock recipes.', fetchError);
    return mockRecipes;
  }
}

export async function fetchRecipe(id: string) {
  if (!firebaseDb) {
    return mockRecipes.find((recipe) => recipe.id === id) ?? null;
  }

  try {
    const snapshot = await getDoc(doc(requireDb(), 'recipes', id));
    return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as Omit<Recipe, 'id'>) }) : null;
  } catch (fetchError) {
    console.error(`Failed to fetch recipe ${id} from Firestore.`, fetchError);
    return mockRecipes.find((recipe) => recipe.id === id) ?? null;
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
  'title' | 'image_url' | 'instagram_url' | 'ingredients' | 'steps' | 'predefined_tags' | 'custom_tags' | 'description' | 'cooking_time_minutes' | 'difficulty'
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
