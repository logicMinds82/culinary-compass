"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createClient } from "@/app/utils/supabase/server";
import { loginSchema, signupSchema } from "@/app/schemas/authSchema";

export type FormState = {
  message: string;
  type?: 'error' | 'success' | 'info';
  fieldErrors?: Record<string, string[]>;
};

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  try {
    // Extract and validate form data
    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = loginSchema.parse(rawFormData);

    const { error } = await supabase.auth.signInWithPassword(validatedData);

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes("Invalid login credentials")) {
        return {
          message: "Invalid email or password. Please check your credentials and try again.",
          type: 'error'
        };
      }
      
      return {
        message: error.message,
        type: 'error'
      };
    }

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        }
      });

      return {
        message: "Please fix the errors below",
        type: 'error',
        fieldErrors
      };
    }

    return {
      message: "An unexpected error occurred. Please try again.",
      type: 'error'
    };
  }
}

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  try {
    // Extract and validate form data
    const rawFormData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validatedData = signupSchema.parse(rawFormData);

    // Include full_name in user metadata
    const signupData = { 
      email: validatedData.email, 
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName
        }
      }
    };

    const { error } = await supabase.auth.signUp(signupData);

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes("User already registered")) {
        return {
          message: "An account with this email already exists. Please try logging in instead.",
          type: 'error'
        };
      }
      
      if (error.message.includes("Password should be")) {
        return {
          message: "Password doesn't meet security requirements. Please choose a stronger password.",
          type: 'error'
        };
      }

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
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        }
      });

      return {
        message: "Please fix the errors below",
        type: 'error',
        fieldErrors
      };
    }

    return {
      message: "An unexpected error occurred. Please try again.",
      type: 'error'
    };
  }
}
