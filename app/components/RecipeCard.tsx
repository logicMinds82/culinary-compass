"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  id: number;
  slug: string;
  title: string;
  image: string;
  description?: string;
  cookingTime: string;
  ratings: number;
  reviews: number;
  categories?: string[];
  isFavorite?: boolean;
  showRemoveFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onRemoveFavorite?: (id: number) => void;
}

export default function RecipeCard({
  id,
  slug,
  title,
  image,
  description,
  cookingTime,
  ratings,
  reviews,
  categories,
  isFavorite = false,
  showRemoveFavorite = false,
  onToggleFavorite,
  onRemoveFavorite,
}: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showRemoveFavorite && onRemoveFavorite) {
      onRemoveFavorite(id);
    } else if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:brightness-95"
        />
        
        {/* Favorite Button */}
        {(onToggleFavorite || onRemoveFavorite) && (
          <Button
            onClick={handleFavoriteClick}
            size="icon"
            variant={showRemoveFavorite ? "destructive" : "ghost"}
            className={`absolute top-3 right-3 transition-all duration-300 ${
              showRemoveFavorite
                ? "bg-primary hover:bg-primary-hover"
                : isFavorite
                ? "bg-primary hover:bg-primary-hover"
                : "bg-background-alt/80 hover:bg-background-alt"
            }`}
            aria-label={
              showRemoveFavorite
                ? "Remove from favorites"
                : isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              className={`size-5 transition-all ${
                isFavorite || showRemoveFavorite
                  ? "fill-white text-white"
                  : "text-primary"
              }`}
            />
          </Button>
        )}

        {/* Healthy Badge */}
        {categories?.includes("Vegetarian") && (
          <Badge className="absolute bottom-3 left-3 bg-success text-white">
            Healthy
          </Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Recipe Meta */}
        <div className="flex items-center gap-3 text-muted-foreground text-sm mb-3">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span>
              {ratings} ({reviews})
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
            {description}
          </p>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.slice(0, 3).map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="text-xs bg-accent text-accent-foreground"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* View Recipe Button */}
        <Link href={`/recipe/${slug}`}>
          <Button className="w-full rounded-full transition-all duration-300 cursor-pointer">
            View Recipe
          </Button>
        </Link>
      </div>
    </Card>
  );
}
