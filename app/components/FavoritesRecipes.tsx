"use client";

import { useEffect, useState } from "react";
import { getFavoriteRecipesList, removeFavoriteRecipe } from "@/app/api/favoritesAPI";
import RecipeCard from "./RecipeCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  cookingTime: string;
  ratings: number;
  reviews: number;
}

export default function FavoriteRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFavorites() {
      const favorites = await getFavoriteRecipesList();
      setRecipes(favorites);
      setLoading(false);
    }

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (id: number) => {
    removeFavoriteRecipe(id);
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (recipes.length === 0) {
    return <div className="text-center py-8">No favorite recipes found.</div>;
  }

  return (
  <section className="py-12 bg-background">
  <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-8">
          Your <span className="text-primary">Favorite Recipes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              slug={recipe.slug}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              cookingTime={recipe.cookingTime}
              ratings={recipe.ratings}
              reviews={recipe.reviews}
              showRemoveFavorite={true}
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
