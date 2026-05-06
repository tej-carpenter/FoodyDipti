import type { Recipe } from '@/types';

export const predefinedTags = ['Dessert', 'Vegan', 'Fast Food', 'Healthy', 'Indian', 'Italian'];

export const mockRecipes: Recipe[] = [
  {
    id: 'gulab-jamun',
    title: 'Gulab Jamun Bites',
    image_url: '/recipes/gulab-jamun.svg',
    instagram_url: 'https://www.instagram.com/',
    description: 'Soft, syrup-soaked bites with a warm cardamom finish and a festive comfort-food feel.',
    cooking_time_minutes: 35,
    difficulty: 'Medium',
    saves_count: 842,
    serving_count: 4,
    ingredients: ['Milk powder', 'Flour', 'Ghee', 'Sugar syrup', 'Cardamom'],
    steps: ['Mix dry ingredients.', 'Shape small balls and fry.', 'Soak in warm syrup.'],
    predefined_tags: ['Dessert', 'Indian'],
    custom_tags: ['festival'],
    created_at: new Date().toISOString(),
    created_by: 'tejprakashcarpenter@gmail.com',
  },
  {
    id: 'veggie-bowl',
    title: 'Roasted Veggie Bowl',
    image_url: '/recipes/veggie-bowl.svg',
    instagram_url: '',
    description: 'A bright, balanced bowl with roasted vegetables, creamy dressing, and quick weekday prep.',
    cooking_time_minutes: 22,
    difficulty: 'Easy',
    saves_count: 615,
    serving_count: 2,
    ingredients: ['Quinoa', 'Chickpeas', 'Bell peppers', 'Tahini', 'Lemon'],
    steps: ['Roast vegetables.', 'Assemble the bowl.', 'Finish with dressing.'],
    predefined_tags: ['Healthy', 'Vegan'],
    custom_tags: ['meal-prep'],
    created_at: new Date().toISOString(),
    created_by: 'tejprakashcarpenter@gmail.com',
  },
];