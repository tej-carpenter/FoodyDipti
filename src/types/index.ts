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