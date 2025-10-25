import { getAllRecipes } from "@/app/services/recipeService";
import FeaturedRecipesClient from "./FeaturedRecipesClient";

export default async function FeaturedRecipesGrid() {
  const allRecipes = await getAllRecipes();
  const featuredRecipes = allRecipes.slice(0, 6); // Show 6 featured recipes

  return <FeaturedRecipesClient recipes={featuredRecipes} />;
}
