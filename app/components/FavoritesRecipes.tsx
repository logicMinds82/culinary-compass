"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Heart } from "lucide-react";
import { getFavoriteRecipesList, removeFavoriteRecipe } from "@/app/api/favoritesAPI";

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

  useEffect(() => {
    async function loadFavorites() {
      const favorites = await getFavoriteRecipesList();
      setRecipes(favorites);
    }

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (id: number) => {
    removeFavoriteRecipe(id);
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  if (recipes.length === 0) {
    return <div className="text-center py-8">No favorite recipes found.</div>;
  }

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Your <span className="text-red-600">Favorite Recipes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:scale-105"
            >
              <div className="relative w-full h-56">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  className="absolute top-3 right-3 p-2 rounded-full shadow-md transition bg-red-600"
                >
                  <Heart className="size-5 text-white" />
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
          ))}
        </div>
      </div>
    </section>
  );
}
