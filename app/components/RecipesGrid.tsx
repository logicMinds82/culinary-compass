"use client";

import { use, useState, useEffect } from "react";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "@/app/api/favoritesAPI";
import RecipeCard from "./RecipeCard";

interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  servings: number;
  categories: string[];
  ratings: number;
  reviews: number;
}

interface RecipesGridProps {
  recipesPromise: Promise<{
    recipes: Recipe[];
    total: number;
  }>;
}

export default function RecipesGrid({ recipesPromise }: RecipesGridProps) {
  const { recipes } = use(recipesPromise);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites after mount to avoid hydration mismatch
  useEffect(() => {
    setFavorites(getFavoriteRecipes());
  }, []);

  const toggleFavorite = (recipeId: number) => {
    if (favorites.includes(recipeId)) {
      const updated = removeFavoriteRecipe(recipeId);
      setFavorites(updated);
    } else {
      const updated = addFavoriteRecipe(recipeId);
      setFavorites(updated);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.length > 0 ? (
        recipes.map((recipe) => {
          const isFavorite = favorites.includes(recipe.id);

          return (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              slug={recipe.slug}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              cookingTime={recipe.cookingTime}
              categories={recipe.categories}
              difficulty={recipe.difficulty}
              servings={recipe.servings}
              ratings={recipe.ratings}
              reviews={recipe.reviews}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          );
        })
      ) : (
        <p className="text-center text-muted-foreground col-span-3">
          No recipes found...
        </p>
      )}
    </div>
  );
}
