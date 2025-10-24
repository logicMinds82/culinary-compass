import RecipeFilterGrid from "../components/RecipeFilterGrid";
import { createClient } from "../utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {

  const supabase = await createClient();
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching recipes:", error);
  }

  return (
    <main>
      <RecipeFilterGrid recipes={recipes || []} />
    </main>
  );
}