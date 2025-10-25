"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import RecipeCard from "../components/RecipeCard";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Loader2, ChefHat } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string | null;
  difficulty: string;
  cookingTime: string;
  servings: number;
  categories: string[];
  slug: string;
  created_at: string;
}

export default function MyRecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/my-recipes");
      
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching my recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (recipeId: number) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setRecipeToDelete(recipe);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/my-recipes?id=${recipeToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      // Remove the deleted recipe from the list
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (recipeId: number) => {
    // Navigate to submit recipe page with recipe ID as query parameter
    router.push(`/submit-recipe?edit=${recipeId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          My Recipes
        </h1>
        <p className="text-muted-foreground">
          Manage and edit your submitted recipes
        </p>
      </div>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No recipes yet</CardTitle>
            <CardDescription>
              You haven&apos;t submitted any recipes yet. Start sharing your culinary creations!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <Link href="/submit-recipe">Submit Your First Recipe</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your recipe
              &quot;{recipeToDelete?.title}&quot; and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="cursor-pointer"
            >
              {deleting ? (
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
    </div>
  );
}
