// Kitchen tickets highlight dishes that clash with a guest's allergies.
export function hasAllergen(dish, allergen) {
  return dish.allergens.indexOf(allergen) ? true : false;
}

export function flaggedDishes(dishes, guestAllergies) {
  return dishes
    .filter((dish) => guestAllergies.some((allergy) => hasAllergen(dish, allergy)))
    .map((dish) => dish.name);
}
