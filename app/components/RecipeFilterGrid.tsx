"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Heart } from "lucide-react";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "@/app/api/favoritesAPI";

interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  categories: string[];
  ingredients: string[];
  ratings: number;
  reviews: number;
}

export default function AdvancedRecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data: Recipe[]) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));

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

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDifficulty =
      filterDifficulty === "" || recipe.difficulty === filterDifficulty;

    const matchesCategory =
      filterCategory === "" || recipe.categories.includes(filterCategory);

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const displayedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-black text-center mb-8">
          Recipe <span className="text-red-600">Explorer</span>
        </h2>

        {/* Search Bar & Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search recipes..."
            className="col-span-2 border rounded px-3 py-2"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={filterDifficulty}
            onChange={(e) => {
              setFilterDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Italian">Italian</option>
            <option value="Thai">Thai</option>
            <option value="Dessert">Dessert</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedRecipes.length > 0 ? (
            displayedRecipes.map((recipe) => {
              const isFavorite = favorites.includes(recipe.id);

              return (
                <div
                  key={recipe.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="rounded-t-lg object-cover"
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
            <p className="text-center text-gray-600 col-span-3">
              No recipes found...
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
