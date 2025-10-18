"use client";

import { useState, useEffect } from "react";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe
} from "@/app/api/favoritesAPI";
import RecipeCard from "../RecipeCard";

interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  ratings: number;
  reviews: number;
}

export default function FeaturedRecipesGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Fetch your recipes
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.slice(0, 6)); // Show 6
      })
      .catch((err) => console.error("Error fetching recipes:", err));

    // Load favorites from localStorage
    const initialFavs = getFavoriteRecipes();
    setFavorites(initialFavs);
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
                  ratings={recipe.ratings}
                  reviews={recipe.reviews}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })
          ) : (
            <p className="text-center text-muted-foreground col-span-3">Loading recipes...</p>
          )}
        </div>
      </div>
    </section>
  );
}
