"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

export type FormState = {
  message: string;
};

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    return {
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    // fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    return {
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    message:
      "Signup successful! Please check your email to confirm your account.",
  };
}
