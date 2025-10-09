import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { signupSchema } from "@/app/schemas/authSchema";
import { ZodError } from "zod";
import type { AuthApiResponse } from "../types";

export async function POST(request: NextRequest): Promise<NextResponse<AuthApiResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input data with Zod
    const validatedData = signupSchema.parse(body);
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Attempt to sign up
    const { error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName
        }
      }
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes("User already registered")) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email already exists. Please try logging in instead.",
          },
          { status: 409 }
        );
      }
      
      if (error.message.includes("Password should be")) {
        return NextResponse.json(
          {
            success: false,
            message: "Password doesn't meet security requirements. Please choose a stronger password.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Signup successful! Please check your email to confirm your account.",
    });

  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors
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

      return NextResponse.json(
        {
          success: false,
          message: "Please fix the errors below",
          fieldErrors,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}