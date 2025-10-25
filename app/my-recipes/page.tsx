import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { getUserRecipes } from "../services/recipeService";
import MyRecipesClient from "./MyRecipesClient";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyRecipesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const recipes = await getUserRecipes();

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
              You haven&apos;t submitted any recipes yet. Start sharing your
              culinary creations!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <Link href="/submit-recipe">Submit Your First Recipe</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <MyRecipesClient recipes={recipes} />
      )}
    </div>
  );
}
