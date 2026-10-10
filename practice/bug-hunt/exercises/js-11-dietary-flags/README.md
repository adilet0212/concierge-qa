# js-11 · Allergy flags on kitchen tickets

**Difficulty:** ●●○ (2/3)

## What it should do
When a guest with allergies orders in-room dining, the kitchen ticket highlights every dish
that contains one of their allergens.
- `hasAllergen(dish, allergen)` is `true` when the dish lists that allergen.
- `flaggedDishes(dishes, guestAllergies)` returns the names of the dishes to highlight.

## Examples
```js
const dishes = [
  { name: 'Pad thai', allergens: ['peanuts', 'shellfish'] },
  { name: 'Caesar salad', allergens: ['dairy', 'fish', 'gluten'] },
  { name: 'Fruit plate', allergens: [] },
];
```
| Call | Output |
|---|---|
| `hasAllergen(dishes[0], 'peanuts')` | `true` |
| `hasAllergen(dishes[0], 'gluten')` | `false` |
| `flaggedDishes(dishes, ['peanuts'])` | `['Pad thai']` |
| `flaggedDishes(dishes, ['gluten', 'sesame'])` | `['Caesar salad']` |

## Your task
Read `allergens.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-11
```
