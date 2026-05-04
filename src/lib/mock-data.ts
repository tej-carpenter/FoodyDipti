import type { Recipe } from '@/types';

export const predefinedTags = ['Dessert', 'Vegan', 'Fast Food', 'Healthy', 'Indian', 'Italian'];

export const mockRecipes: Recipe[] = [
  {
    id: 'gulab-jamun',
    title: 'Gulab Jamun Bites',
    image_url: '/recipes/gulab-jamun.svg',
    instagram_url: 'https://www.instagram.com/',
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
    ingredients: ['Quinoa', 'Chickpeas', 'Bell peppers', 'Tahini', 'Lemon'],
    steps: ['Roast vegetables.', 'Assemble the bowl.', 'Finish with dressing.'],
    predefined_tags: ['Healthy', 'Vegan'],
    custom_tags: ['meal-prep'],
    created_at: new Date().toISOString(),
    created_by: 'tejprakashcarpenter@gmail.com',
  },
];