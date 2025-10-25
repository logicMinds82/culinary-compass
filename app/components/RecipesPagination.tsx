"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";

interface RecipesPaginationProps {
  recipesPromise: Promise<{
    recipes: unknown[];
    total: number;
  }>;
  currentPage: number;
  recipesPerPage: number;
  onPageChange: (page: number) => void;
}

export default function RecipesPagination({
  recipesPromise,
  currentPage,
  recipesPerPage,
  onPageChange,
}: RecipesPaginationProps) {
  const { total } = use(recipesPromise);
  const totalPages = Math.ceil(total / recipesPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          onClick={() => onPageChange(i + 1)}
          className={currentPage === i + 1 ? "bg-primary hover:bg-primary-hover" : ""}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
