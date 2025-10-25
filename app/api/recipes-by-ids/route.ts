import { NextResponse } from "next/server";
import { getRecipesByIds } from "@/app/services/recipeService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ message: "IDs parameter is required" }, { status: 400 });
    }

    const requestedIds = idsParam.split(",").map((id) => parseInt(id, 10));
    const recipes = await getRecipesByIds(requestedIds);

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error in GET /api/recipes-by-ids:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
