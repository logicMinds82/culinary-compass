"use client";

import { useState, useEffect } from "react";
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes
} from "@/app/api/favoritesAPI";
import RecipeCard from "../RecipeCard";
import type { Recipe } from "@/app/services/recipeService";

interface FeaturedRecipesClientProps {
  recipes: Recipe[];
}

export default function FeaturedRecipesClient({ recipes }: FeaturedRecipesClientProps) {
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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-foreground text-center mb-8">
          Featured <span className="text-primary">Recipes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <p className="text-center text-muted-foreground col-span-3">No recipes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
