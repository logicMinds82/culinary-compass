import { Suspense } from "react";
import SubmitRecipeClientWrapper from "./SubmitRecipeClientWrapper";
import RecipesSkeleton from "../components/RecipesSkeleton";

export default function SubmitRecipePage() {
  return (
    <main>
      <Suspense fallback={<RecipesSkeleton />}>
        <SubmitRecipeClientWrapper />
      </Suspense>
    </main>
  );
}
