import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { loginSchema } from "@/app/login/schemas";
import { ZodError } from "zod";
import type { AuthApiResponse } from "../types";

export async function POST(request: NextRequest): Promise<NextResponse<AuthApiResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input data with Zod
    const validatedData = loginSchema.parse(body);
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Attempt to sign in
    const { error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password. Please check your credentials and try again.",
          },
          { status: 401 }
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

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // The cookies should be automatically set by the Supabase client
    // But let's make sure we return the response properly
    return response;

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