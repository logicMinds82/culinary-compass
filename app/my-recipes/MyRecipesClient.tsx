"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../services/recipeService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { deleteRecipeAction } from "../actions/deleteRecipeAction";

interface MyRecipesClientProps {
  recipes: Recipe[];
}

export default function MyRecipesClient({ recipes: initialRecipes }: MyRecipesClientProps) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (recipeId: number) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setRecipeToDelete(recipe);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    startTransition(async () => {
      const result = await deleteRecipeAction(recipeToDelete.id);

      if (result.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
        setDeleteDialogOpen(false);
        setRecipeToDelete(null);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete recipe. Please try again.");
      }
    });
  };

  const handleEditClick = (recipeId: number) => {
    router.push(`/submit-recipe?edit=${recipeId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            slug={recipe.slug}
            title={recipe.title}
            image={recipe.image || "/images/placeholder-recipe.jpg"}
            description={recipe.description}
            cookingTime={recipe.cookingTime}
            categories={recipe.categories}
            difficulty={recipe.difficulty}
            servings={recipe.servings}
            showEditDelete={true}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              recipe &quot;{recipeToDelete?.title}&quot; and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
