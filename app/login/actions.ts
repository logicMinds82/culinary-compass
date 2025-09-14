"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

export type FormState = {
  message: string;
  type?: 'error' | 'success' | 'info';
};

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // Validate inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      message: "Please fill in all fields",
      type: 'error'
    };
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = { email, password };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    return {
      message: error.message,
      type: 'error'
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

  // Validate inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      message: "Please fill in all fields",
      type: 'error'
    };
  }

  if (password.length < 6) {
    return {
      message: "Password must be at least 6 characters long",
      type: 'error'
    };
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = { email, password };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    return {
      message: error.message,
      type: 'error'
    };
  }

  revalidatePath("/", "layout");
  return {
    message: "Signup successful! Please check your email to confirm your account.",
    type: 'success'
  };
}
