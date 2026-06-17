export type Recipe = {
  id: string;
  title: string;
  image_url: string;
  instagram_url?: string;
  description?: string;
  cooking_time_minutes?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  saves_count?: number;
  serving_count?: number;
  ingredients: string[];
  /**
   * Purpose:
   * Used for future ingredient matching, search, and recommendation features.
   */
  normalizedIngredients?: string[];
  steps: string[];
  predefined_tags: string[];
  custom_tags: string[];
  created_at: string;
  created_by: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
};

export type AppUser = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  contact: string;
  message: string;
  created_at: string;
  status?: 'unread' | 'read';
  email_status?: 'sent' | 'skipped' | 'failed';
  email_error?: string;
  admin_emails?: string[];
};