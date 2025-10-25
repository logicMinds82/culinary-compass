import { Suspense } from "react";
import SubmitRecipeClientWrapper from "./SubmitRecipeClientWrapper";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SubmitRecipePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SubmitRecipeClientWrapper />
    </Suspense>
  );
}
