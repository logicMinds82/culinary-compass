"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubmitRecipeForm from "../components/SubmitRecipeForm";
import type { Recipe } from "../services/recipeService";
import LoadingSpinner from "../components/LoadingSpinner";

async function fetchRecipeForEdit(id: number): Promise<Recipe | null> {
  try {
    const response = await fetch(`/api/recipe-for-edit/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

export default function SubmitRecipeClientWrapper() {
  const searchParams = useSearchParams();
  const editRecipeId = searchParams.get("edit");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editRecipeId) {
      setLoading(true);
      fetchRecipeForEdit(parseInt(editRecipeId))
        .then(setRecipe)
        .finally(() => setLoading(false));
    }
  }, [editRecipeId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <SubmitRecipeForm initialRecipe={recipe} />;
}
