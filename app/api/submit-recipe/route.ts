import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const difficulty = formData.get("difficulty");
    const cuisine = formData.get("cuisine");
    const duration = formData.get("duration");
    const servings = formData.get("servings");
    const categories = formData.getAll("categories[]");
    const ingredients = formData.getAll("ingredients[]");
    const steps = formData.get("steps");
    const image = formData.get("image") as File;

    // Mock saving (image & recipe data) to DB or storage
    console.log({
      title, description, difficulty, cuisine, duration,
      servings, categories, ingredients, steps, image: image.name
    });

    // Return success response
    return NextResponse.json({ message: "Recipe successfully submitted!" });
  } catch {
    return NextResponse.json({ message: "Error submitting recipe" }, { status: 500 });
  }
}
