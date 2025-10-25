import { createClient } from "@/app/utils/supabase/server";
import { cache } from "react";

export interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  servings: number;
  categories: string[];
  ingredients: string[];
  steps: string[];
  ratings: number;
  reviews: number;
  author_name: string;
  author_id: string;
  date_added: string;
  created_at: string;
}

/**
 * Get all recipes
 */
export const getAllRecipes = cache(async (): Promise<Recipe[]> => {
  const supabase = await createClient();
  
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return recipes || [];
});

/**
 * Get a single recipe by slug
 */
export const getRecipeBySlug = cache(async (slug: string): Promise<Recipe | null> => {
  const supabase = await createClient();
  
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching recipe by slug:", error);
    return null;
  }

  return recipe;
});

/**
 * Get a single recipe by ID (for editing)
 */
export const getRecipeById = cache(async (id: number): Promise<Recipe | null> => {
  const supabase = await createClient();
  
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe by ID:", error);
    return null;
  }

  return recipe;
});

/**
 * Get recipes by IDs (for favorites)
 */
export const getRecipesByIds = cache(async (ids: number[]): Promise<Recipe[]> => {
  if (ids.length === 0) return [];
  
  const supabase = await createClient();
  
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching recipes by IDs:", error);
    return [];
  }

  return recipes || [];
});

/**
 * Get recipes by category
 */
export const getRecipesByCategory = cache(async (category: string): Promise<Recipe[]> => {
  const supabase = await createClient();
  
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .contains("categories", [category])
    .order("id");

  if (error) {
    console.error("Error fetching recipes by category:", error);
    return [];
  }

  return recipes || [];
});

/**
 * Get recipes for the authenticated user
 */
export const getUserRecipes = cache(async (): Promise<Recipe[]> => {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return [];
  }

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user recipes:", error);
    return [];
  }

  return recipes || [];
});

/**
 * Get related recipes based on category
 */
export const getRelatedRecipes = cache(async (category: string, excludeSlug: string, limit: number = 3): Promise<Recipe[]> => {
  const supabase = await createClient();
  
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .contains("categories", [category])
    .neq("slug", excludeSlug)
    .limit(limit);

  if (error) {
    console.error("Error fetching related recipes:", error);
    return [];
  }

  return recipes || [];
});

/**
 * Get filtered recipes with pagination
 */
export async function getFilteredRecipes({
  search = "",
  difficulty = "",
  category = "",
  page = 1,
  limit = 9,
}: {
  search?: string;
  difficulty?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ recipes: Recipe[]; total: number }> {
  const supabase = await createClient();
  
  let query = supabase.from("recipes").select("*", { count: "exact" });

  // Apply search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply difficulty filter
  if (difficulty && difficulty !== "all") {
    query = query.eq("difficulty", difficulty);
  }

  // Apply category filter
  if (category && category !== "all") {
    query = query.contains("categories", [category]);
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to).order("id");

  const { data: recipes, error, count } = await query;

  if (error) {
    console.error("Error fetching filtered recipes:", error);
    return { recipes: [], total: 0 };
  }

  return { recipes: recipes || [], total: count || 0 };
}
