import { describe, expect, it } from 'vitest';
import { flaggedDishes, hasAllergen } from './allergens.js';

const dishes = [
  { name: 'Pad thai', allergens: ['peanuts', 'shellfish'] },
  { name: 'Caesar salad', allergens: ['dairy', 'fish', 'gluten'] },
  { name: 'Fruit plate', allergens: [] },
];

describe('hasAllergen', () => {
  it('is true when the dish lists the allergen', () => {
    expect(hasAllergen(dishes[0], 'peanuts')).toBe(true);
    expect(hasAllergen(dishes[0], 'shellfish')).toBe(true);
  });

  it('is false when the dish does not list the allergen', () => {
    expect(hasAllergen(dishes[0], 'gluten')).toBe(false);
  });
});

describe('flaggedDishes', () => {
  it('flags only the dishes containing the guest allergens', () => {
    expect(flaggedDishes(dishes, ['peanuts'])).toEqual(['Pad thai']);
    expect(flaggedDishes(dishes, ['gluten', 'sesame'])).toEqual(['Caesar salad']);
  });
});
