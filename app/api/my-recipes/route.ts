import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

// GET - Fetch recipes for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch recipes where author_id matches the user's id
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user recipes:", error);
      return NextResponse.json(
        { message: "Error fetching recipes" },
        { status: 500 }
      );
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Unexpected error in GET /api/my-recipes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a recipe by ID (only if user is the author)
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const recipeId = url.searchParams.get("id");

    if (!recipeId) {
      return NextResponse.json(
        { message: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // First, verify the recipe belongs to the user
    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select("author_id, image")
      .eq("id", recipeId)
      .single();

    if (fetchError || !recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    if (recipe.author_id !== user.id) {
      return NextResponse.json(
        { message: "Forbidden: You can only delete your own recipes" },
        { status: 403 }
      );
    }

    // Delete the recipe image from storage if it exists
    if (recipe.image) {
      try {
        // Extract the file path from the public URL
        const urlParts = recipe.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('recipes')
          .remove([fileName]);
      } catch (storageError) {
        console.error("Error deleting recipe image:", storageError);
        // Continue with recipe deletion even if image deletion fails
      }
    }

    // Delete the recipe
    const { error: deleteError } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);

    if (deleteError) {
      console.error("Error deleting recipe:", deleteError);
      return NextResponse.json(
        { message: "Error deleting recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/my-recipes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
