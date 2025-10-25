import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat } from "lucide-react";

export default function RecipeNotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-2xl mx-auto text-center p-12">
        <ChefHat className="w-24 h-24 mx-auto mb-6 text-primary opacity-50" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">Recipe Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the recipe you&apos;re looking for. It may have been removed or the link might be incorrect.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/recipes">Browse All Recipes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
