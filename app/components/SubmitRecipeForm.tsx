"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { postRecipeAction } from "../actions/postRecipeAction";
import { updateRecipeAction } from "../actions/updateRecipeAction";
import { useAuth } from "./AuthProvider";
import { DifficultyEnum } from "../types/DifficultyEnum";
import { CategoryEnum } from "../types/CategoryEnum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, X, CheckCircle, AlertCircle } from "lucide-react";

interface SubmitRecipeFormProps {
  recipeId?: number;
}

export default function SubmitRecipeForm({ recipeId }: SubmitRecipeFormProps) {
  const { user } = useAuth();
  const isEditMode = !!recipeId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState<number | "">(4);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.Easy
  );
  const [categories, setCategories] = useState<CategoryEnum[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentStep, setCurrentStep] = useState("");

  // Load recipe data if in edit mode
  useEffect(() => {
    if (recipeId && user) {
      loadRecipeData(recipeId);
    }
  }, [recipeId, user]);

  const loadRecipeData = async (id: number) => {
    try {
      setLoadingRecipe(true);
      const response = await fetch(`/api/recipe/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to load recipe");
      }

      const recipe = await response.json();
      
      // Populate form with recipe data
      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
      setDifficulty(recipe.difficulty || DifficultyEnum.Easy);
      setCategories(recipe.categories || []);
      setIngredients(recipe.ingredients || []);
      setSteps(recipe.steps || []);
      setCookingTime(recipe.cookingTime || "");
      setServings(recipe.servings || 4);
      setExistingImageUrl(recipe.image || null);
      setImagePreview(recipe.image || null);
    } catch (error) {
      console.error("Error loading recipe:", error);
      setStatus("Failed to load recipe data");
      setStatusType("error");
    } finally {
      setLoadingRecipe(false);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);
    } else if (!existingImageUrl) {
      setImagePreview(null);
    }
  }, [image, existingImageUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setStatus("Please sign in first.");
      setStatusType("error");
      return;
    }

    if (categories.length === 0) {
      setStatus("Please select at least one category.");
      setStatusType("error");
      return;
    }

    if (ingredients.length === 0) {
      setStatus("Please add at least one ingredient.");
      setStatusType("error");
      return;
    }

    if (steps.length === 0) {
      setStatus("Please add at least one instruction step.");
      setStatusType("error");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isEditMode && recipeId) {
        // Update existing recipe
        result = await updateRecipeAction({
          id: recipeId,
          title,
          description,
          difficulty,
          categories,
          ingredients,
          steps,
          cookingTime,
          servings: Number(servings),
          imageFile: image,
          existingImageUrl,
        });
      } else {
        // Create new recipe
        result = await postRecipeAction({
          title,
          description,
          difficulty,
          categories,
          ingredients,
          steps,
          cookingTime,
          servings: Number(servings),
          authorId: user.id,
          authorName: user.user_metadata?.full_name || user.email || "Anonymous",
          imageFile: image,
        });
      }

      if (result.success) {
        setStatus(
          isEditMode
            ? "Recipe updated successfully! 🎉"
            : "Recipe posted successfully! 🎉"
        );
        setStatusType("success");
        
        if (!isEditMode) {
          // Reset form only for new recipes
          setTitle("");
          setDescription("");
          setCookingTime("");
          setServings(4);
          setImage(null);
          setImagePreview(null);
          setExistingImageUrl(null);
          setCategories([]);
          setIngredients([]);
          setSteps([]);
          setCurrentIngredient("");
          setCurrentStep("");
          setDifficulty(DifficultyEnum.Easy);
        }
        
        setTimeout(() => {
          setStatus(null);
          setStatusType(null);
        }, 5000);
      } else {
        setStatus(
          String(result.error) ||
            `Failed to ${isEditMode ? "update" : "submit"} recipe. Please try again later.`
        );
        setStatusType("error");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setStatus("An unexpected error occurred. Please try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (currentStep.trim()) {
      setSteps([...steps, currentStep.trim()]);
      setCurrentStep("");
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: CategoryEnum) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  return (
    <section className="w-full min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl">
              {isEditMode ? "Edit" : "Submit"}{" "}
              <span className="text-primary">Your Recipe</span>
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update your recipe details below."
                : "Share your culinary creation with the community. Fill out the form below to submit your recipe."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loadingRecipe ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {status && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                      statusType === "success"
                        ? "bg-success/10 border border-success/20 text-success"
                        : "bg-destructive/10 border border-destructive/20 text-destructive"
                    }`}
                  >
                    {statusType === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{status}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      Basic Information
                    </h3>
                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Recipe Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="e.g., Classic Spaghetti Carbonara"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe your recipe, what makes it special..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2 w-full [&>button]:w-full">
                      <Label htmlFor="difficulty">
                        Difficulty <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={difficulty}
                        onValueChange={(value) =>
                          setDifficulty(value as DifficultyEnum)
                        }
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DifficultyEnum.Easy}>Easy</SelectItem>
                          <SelectItem value={DifficultyEnum.Medium}>
                            Medium
                          </SelectItem>
                          <SelectItem value={DifficultyEnum.Hard}>Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookingTime">
                        Cooking Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cookingTime"
                        name="cookingTime"
                        type="text"
                        placeholder="e.g., 30 minutes"
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servings">
                        Servings <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="servings"
                        name="servings"
                        type="number"
                        min="1"
                        placeholder="e.g., 4"
                        value={servings}
                        onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : "")}
                        required
                      />
                    </div>
                  </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Recipe Image
                </h3>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image (Max 8MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 8 * 1024 * 1024) {
                          setStatus("Image size must be less than 8MB.");
                          setStatusType("error");
                          setImage(null);
                          setImagePreview(null);
                          e.target.value = "";
                          return;
                        }
                        setImage(file || null);
                        setStatus(null);
                      }}
                      className="flex-1"
                    />
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview:
                      </p>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                        <Image
                          src={imagePreview}
                          alt="Recipe preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Categories <span className="text-destructive">*</span>
                </h3>
                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.values(CategoryEnum).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="bg-accent"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Ingredients <span className="text-destructive">*</span>
                </h3>
                <Separator />

                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    placeholder="e.g., 2 cups flour"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIngredient();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addIngredient}
                    className="bg-success hover:bg-success/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {ingredients.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{ingredient}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-muted-foreground">
                  {ingredients.length} ingredient
                  {ingredients.length !== 1 ? "s" : ""} added
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Instructions <span className="text-destructive">*</span>
                </h3>
                <Separator />

                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={currentStep}
                    onChange={(e) => setCurrentStep(e.target.value)}
                    placeholder="e.g., Preheat oven to 350°F"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStep();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addStep}
                    className="bg-success hover:bg-success/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {steps.length > 0 && (
                  <ol className="space-y-2 mt-4">
                    {steps.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                      >
                        <span className="font-semibold text-primary min-w-6">
                          {index + 1}.
                        </span>
                        <span className="text-sm flex-1">{step}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
                <p className="text-sm text-muted-foreground">
                  {steps.length} step{steps.length !== 1 ? "s" : ""} added
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                  size="lg"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading
                    ? isEditMode
                      ? "Updating Recipe..."
                      : "Submitting Recipe..."
                    : isEditMode
                    ? "Update Recipe"
                    : "Submit Recipe"}
                </Button>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  </div>
</section>
);
}
