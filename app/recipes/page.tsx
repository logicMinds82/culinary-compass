import RecipeFilterGrid from "../components/RecipeFilterGrid";
import { getFilteredRecipes } from "../services/recipeService";

export const dynamic = "force-dynamic";

interface RecipesPageProps {
  searchParams: Promise<{
    search?: string;
    difficulty?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const difficulty = params.difficulty || "";
  const category = params.category || "";
  const page = parseInt(params.page || "1");
  const recipesPerPage = 9;

  // Create the promise and pass it directly without awaiting
  const recipesPromise = getFilteredRecipes({
    search,
    difficulty,
    category,
    page,
    limit: recipesPerPage,
  });

  return (
    <main>
      <RecipeFilterGrid
        recipesPromise={recipesPromise}
        currentPage={page}
        recipesPerPage={recipesPerPage}
        currentFilters={{
          search,
          difficulty,
          category,
        }}
      />
    </main>
  );
}