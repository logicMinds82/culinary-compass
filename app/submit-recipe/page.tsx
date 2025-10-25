import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import SubmitRecipeClientWrapper from "./SubmitRecipeClientWrapper";

export default async function SubmitRecipePage() {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  return <SubmitRecipeClientWrapper />;
}
