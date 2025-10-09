import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
// GET method
//   - If no `slug`, return array of all recipes
//   - If `?slug=some-slug`, return single recipe or 404
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const slugParam = url.searchParams.get("slug");
    const idsParam = url.searchParams.get("ids");

    // 1) If ?ids=1,2,3 => Return only those IDs
    if (idsParam) {
      const requestedIds = idsParam.split(",").map((id) => parseInt(id, 10));
      const { data: filtered, error } = await supabase
        .from("recipes")
        .select("*")
        .in("id", requestedIds);

      if (error) {
        console.error("Error fetching recipes by IDs:", error);
        return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
      }

      return NextResponse.json(filtered);
    }

    // 2) If ?slug=some-slug => Return one matching recipe
    if (slugParam) {
      const { data: found, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("slug", slugParam)
        .single();

      if (error) {
        console.error("Error fetching recipe by slug:", error);
        return NextResponse.json(
          { message: `Recipe with slug '${slugParam}' not found.` },
          { status: 404 }
        );
      }

      return NextResponse.json(found);
    }

    // 3) Otherwise => Return ALL recipes
    const { data: allRecipes, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching all recipes:", error);
      return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
    }

    return NextResponse.json(allRecipes);
  } catch (error) {
    console.error("Unexpected error in GET /api/recipes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}