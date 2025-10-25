"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface Recipe {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  servings: number;
  categories: string[];
  ingredients: string[];
  steps: string[];
  ratings: number;
  reviews: number;
  author_name: string;
  date_added: string;
}

export default function SingleRecipePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipe() {
      const res = await fetch(`/api/recipes?slug=${slug}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);

        const relatedRes = await fetch(`/api/recipes?category=${encodeURIComponent(data.categories[0])}`);
        const relatedData = await relatedRes.json();
        setRelatedRecipes(relatedData.filter((r: Recipe) => r.slug !== slug).slice(0, 3));
      } else {
        setRecipe(null);
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!recipe) {
    return <div className="text-center py-16 text-xl">Recipe not found.</div>;
  }

  console.log(recipe)

  return (
    <section className="container mx-auto px-4 py-12">
      <Card className="max-w-5xl mx-auto overflow-hidden">
        <div className="relative h-[400px]">
          <Image src={recipe.image} alt={recipe.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">{recipe.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Clock size={16} />{recipe.cookingTime}</span>
            <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" />{recipe.ratings} ({recipe.reviews})</span>
            <span>🍽️ {recipe.servings} servings</span>
            <span className="flex items-center gap-1 capitalize"><Gauge size={16} />{recipe.difficulty}</span>
          </div>
          <p className="text-muted-foreground mb-5">{recipe.description}</p>

          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside mb-5">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mb-2">Preparation Steps</h2>
          <ol className="list-decimal list-inside mb-6 space-y-2">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.categories.map((category) => (
              <Badge
                key={category}
                className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold"
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="border-t border-border pt-3 text-sm text-muted-foreground">
            <span>By {recipe["author_name"]} • Published on {recipe["date_added"]}</span>
          </div>
        </div>
      </Card>

      <section className="max-w-5xl mx-auto my-12">
        <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedRecipes.map((rec) => (
            <Link href={`/recipe/${rec.slug}`} key={rec.id}>
              <Card className="overflow-hidden hover:shadow-2xl transition duration-300">
                <div className="relative h-48">
                  <Image src={rec.image} alt={rec.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{rec.title}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}