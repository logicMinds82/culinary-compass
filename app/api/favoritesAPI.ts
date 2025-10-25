// app/api/favoritesAPI.ts
const FAVORITES_KEY = "favoriteRecipes";

function isLocalStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getFavoriteRecipes(): number[] {
  if (!isLocalStorageAvailable()) return [];
  const stored = window.localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addFavoriteRecipe(recipeId: number): number[] {
  if (!isLocalStorageAvailable()) return [];
  const favorites = getFavoriteRecipes();
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export function removeFavoriteRecipe(recipeId: number): number[] {
  if (!isLocalStorageAvailable()) return [];
  let favorites = getFavoriteRecipes();
  favorites = favorites.filter((id) => id !== recipeId);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}
