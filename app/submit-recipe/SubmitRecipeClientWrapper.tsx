"use client";
import { useSearchParams } from "next/navigation";
import SubmitRecipeForm from "../components/SubmitRecipeForm";

export default function SubmitRecipeClientWrapper() {
  const searchParams = useSearchParams();
  const editRecipeId = searchParams.get("edit");

  return <SubmitRecipeForm recipeId={editRecipeId ? parseInt(editRecipeId) : undefined} />;
}
