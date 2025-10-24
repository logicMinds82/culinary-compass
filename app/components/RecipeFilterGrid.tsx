"use client";

import { useState, useEffect } from "react";
import {
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "@/app/api/favoritesAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecipeCard from "./RecipeCard";

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

interface RecipeFilterGridProps {
  recipes?: Recipe[];
}

export default function AdvancedRecipeGrid({ recipes }: RecipeFilterGridProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  useEffect(() => {
    const initialFavs = getFavoriteRecipes();
    setFavorites(initialFavs);
  }, [recipes?.length]);

  const toggleFavorite = (recipeId: number) => {
    if (favorites.includes(recipeId)) {
      const updated = removeFavoriteRecipe(recipeId);
      setFavorites(updated);
    } else {
      const updated = addFavoriteRecipe(recipeId);
      setFavorites(updated);
    }
  };

  const filteredRecipes = recipes?.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDifficulty =
      filterDifficulty === "" || filterDifficulty === "all" || recipe.difficulty === filterDifficulty;

    const matchesCategory =
      filterCategory === "" || filterCategory === "all" || recipe.categories.includes(filterCategory);

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const totalPages = Math.ceil((filteredRecipes?.length || 0) / recipesPerPage);
  const displayedRecipes = filteredRecipes?.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-foreground text-center mb-8">
          Recipe <span className="text-primary">Explorer</span>
        </h2>

        {/* Search Bar & Filters */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Input
            type="text"
            placeholder="Search recipes..."
            className="col-span-2 flex-1 min-w-[180px]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center gap-4 [&>button]:w-full flex-1">
            <Select
              value={filterDifficulty}
              onValueChange={(value) => {
                setFilterDifficulty(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterCategory}
              onValueChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(displayedRecipes?.length || 0) > 0 ? (
            displayedRecipes?.map((recipe) => {
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
                  categories={recipe.categories}
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

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "bg-primary hover:bg-primary-hover" : ""}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
