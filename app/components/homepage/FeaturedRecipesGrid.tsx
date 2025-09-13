"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Heart } from "lucide-react";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe
} from "@/app/api/favoritesAPI"; // Import from your utility

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
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-black text-center mb-8">
          Featured <span className="text-red-600">Recipes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.length > 0 ? (
            recipes.map((recipe) => {
              const isFavorite = favorites.includes(recipe.id);

              return (
                <div
                  key={recipe.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:scale-105"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-lg"
                    />
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                        isFavorite
                          ? "bg-red-600"
                          : "bg-white hover:bg-red-600"
                      }`}
                    >
                      <Heart
                        className={`size-5 transition ${
                          isFavorite
                            ? "text-white"
                            : "text-red-600 hover:text-white"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-black truncate">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-gray-600 text-sm mt-2">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {recipe.cookingTime}
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-1 text-yellow-500" />
                        {recipe.ratings} ({recipe.reviews})
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 text-sm line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="mt-4">
                      <Link href={`/recipe/${recipe.slug}`}>
                        <span className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
                          View Recipe
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">Loading recipes...</p>
          )}
        </div>
      </div>
    </section>
  );
}
