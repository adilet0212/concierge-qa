// Kitchen tickets highlight dishes that clash with a guest's allergies.
export function hasAllergen(dish, allergen) {
  // Fixed: indexOf returns 0 for the first item (falsy) and -1 when missing (truthy).
  // includes() returns a real boolean.
  return dish.allergens.includes(allergen);
}

export function flaggedDishes(dishes, guestAllergies) {
  return dishes
    .filter((dish) => guestAllergies.some((allergy) => hasAllergen(dish, allergy)))
    .map((dish) => dish.name);
}
