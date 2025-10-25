"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecipesGrid from "./RecipesGrid";
import RecipesPagination from "./RecipesPagination";
import LoadingSpinner from "./LoadingSpinner";

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

interface RecipeFilterGridProps {
  recipesPromise: Promise<{
    recipes: Recipe[];
    total: number;
  }>;
  currentPage: number;
  recipesPerPage: number;
  currentFilters: {
    search: string;
    difficulty: string;
    category: string;
  };
}

export default function RecipeFilterGrid({
  recipesPromise,
  currentPage,
  recipesPerPage,
  currentFilters,
}: RecipeFilterGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(currentFilters.search);
  const [filterDifficulty, setFilterDifficulty] = useState(currentFilters.difficulty || "all");
  const [filterCategory, setFilterCategory] = useState(currentFilters.category || "all");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    const timer = debounceTimerRef.current;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const updateURL = (params: { search?: string; difficulty?: string; category?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.search !== undefined) {
      if (params.search) {
        newParams.set("search", params.search);
      } else {
        newParams.delete("search");
      }
    }
    
    if (params.difficulty !== undefined) {
      if (params.difficulty && params.difficulty !== "all") {
        newParams.set("difficulty", params.difficulty);
      } else {
        newParams.delete("difficulty");
      }
    }
    
    if (params.category !== undefined) {
      if (params.category && params.category !== "all") {
        newParams.set("category", params.category);
      } else {
        newParams.delete("category");
      }
    }
    
    if (params.page !== undefined) {
      if (params.page > 1) {
        newParams.set("page", params.page.toString());
      } else {
        newParams.delete("page");
      }
    }
    
    router.push(`/recipes?${newParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      updateURL({ search: value, page: 1 });
    }, 500);
  };

  const handleDifficultyChange = (value: string) => {
    setFilterDifficulty(value);
    updateURL({ difficulty: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    updateURL({ category: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  // Create a unique key based on current filters for Suspense boundary
  const suspenseKey = `${currentFilters.search}-${currentFilters.difficulty}-${currentFilters.category}-${currentPage}`;

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
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="flex items-center gap-4 [&>button]:w-full flex-1">
            <Select
              value={filterDifficulty}
              onValueChange={handleDifficultyChange}
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
              onValueChange={handleCategoryChange}
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

        {/* Recipes Grid with Suspense */}
        <Suspense key={`recipes-${suspenseKey}`} fallback={<LoadingSpinner />}>
          <RecipesGrid recipesPromise={recipesPromise} />
        </Suspense>

        {/* Pagination with Suspense */}
        <Suspense key={`pagination-${suspenseKey}`} fallback={null}>
          <RecipesPagination
            recipesPromise={recipesPromise}
            currentPage={currentPage}
            recipesPerPage={recipesPerPage}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </div>
    </section>
  );
}
