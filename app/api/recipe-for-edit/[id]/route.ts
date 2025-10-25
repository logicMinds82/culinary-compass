import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

// GET - Fetch a single recipe by ID for editing (with auth check)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const recipeId = (await params).id;
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", recipeId)
      .single();

    if (error || !recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    // Verify the user is the author
    if (recipe.author_id !== user.id) {
      return NextResponse.json(
        { message: "Forbidden: You can only edit your own recipes" },
        { status: 403 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error in GET /api/recipe-for-edit:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
