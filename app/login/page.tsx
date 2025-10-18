"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "../schemas/authSchema";
import { PasswordStrengthIndicator } from "../components/login/PasswordStrengthIndicator";
import type { AuthApiResponse } from "../api/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MessageType = 'error' | 'success' | 'info';

interface FormMessage {
  message: string;
  type?: MessageType;
}

const getMessageStyling = (type?: MessageType) => {
  switch (type) {
    case 'error':
      return "mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2";
    case 'success':
      return "mb-4 p-3 bg-success/10 border border-success/20 text-success rounded-lg flex items-center gap-2";
    case 'info':
      return "mb-4 p-3 bg-accent border border-accent-foreground/20 text-accent-foreground rounded-lg flex items-center gap-2";
    default:
      return "mb-4 p-3 bg-muted border border-border text-muted-foreground rounded-lg flex items-center gap-2";
  }
};

const getMessageIcon = (type?: MessageType) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
    case 'success':
      return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
    case 'info':
      return <Info className="w-5 h-5 flex-shrink-0" />;
    default:
      return null;
  }
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<FormMessage>({ message: "" });
  const [loading, setLoading] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Watch password for strength indicator
  const watchedPassword = signupForm.watch("password", "");

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setMessage({ message: "" });
      setLoading(true);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: AuthApiResponse = await response.json();

      if (!result.success) {
        // Handle field errors
        if (result.fieldErrors) {
          // Set field errors in the form
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            loginForm.setError(field as keyof LoginFormData, {
              type: "manual",
              message: (errors as string[])[0],
            });
          });
          setMessage({
            message: result.message,
            type: 'error'
          });
        } else {
          setMessage({
            message: result.message,
            type: 'error'
          });
        }
        return;
      }

      // Success - redirect to home
      window.location.href = "/";
    } catch {
      setMessage({
        message: "An unexpected error occurred. Please try again.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      setMessage({ message: "" });
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: AuthApiResponse = await response.json();

      if (!result.success) {
        // Handle field errors
        if (result.fieldErrors) {
          // Set field errors in the form
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            signupForm.setError(field as keyof SignupFormData, {
              type: "manual",
              message: (errors as string[])[0],
            });
          });
          setMessage({
            message: result.message,
            type: 'error'
          });
        } else {
          setMessage({
            message: result.message,
            type: 'error'
          });
        }
        return;
      }

      // Success
      setMessage({
        message: result.message,
        type: 'success'
      });
      
      // Reset form after successful signup
      signupForm.reset();
    } catch {
      setMessage({
        message: "An unexpected error occurred. Please try again.",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMessage({ message: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Reset forms when switching tabs
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex border-b mb-6">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 hover:bg-transparent ${
                activeTab === "login"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 hover:bg-transparent ${
                activeTab === "signup"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => handleTabChange("signup")}
            >
              Sign Up
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === "login" ? (
            <div>
              <CardTitle className="text-2xl mb-2">Welcome Back</CardTitle>
              <CardDescription className="mb-6">Sign in to your account to continue</CardDescription>
              
              {message.message && (
                <div className={getMessageStyling(message.type)}>
                  {getMessageIcon(message.type)}
                  <span>{message.message}</span>
                </div>
              )}
              
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...loginForm.register("email")}
                    className={loginForm.formState.errors.email ? "border-destructive" : ""}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      className={loginForm.formState.errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => handleTabChange("signup")}
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <CardTitle className="text-2xl mb-2">Create Account</CardTitle>
              <CardDescription className="mb-6">Sign up to start sharing your recipes</CardDescription>
              
              {message.message && (
                <div className={getMessageStyling(message.type)}>
                  {getMessageIcon(message.type)}
                  <span>{message.message}</span>
                </div>
              )}
              
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullName">
                    Full Name
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="signup-fullName"
                    type="text"
                    placeholder="Enter your full name"
                    {...signupForm.register("fullName")}
                    className={signupForm.formState.errors.fullName ? "border-destructive" : ""}
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signupForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    Email Address
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    {...signupForm.register("email")}
                    className={signupForm.formState.errors.email ? "border-destructive" : ""}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    Password
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...signupForm.register("password")}
                      className={signupForm.formState.errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  <PasswordStrengthIndicator password={watchedPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirmPassword">
                    Confirm Password
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...signupForm.register("confirmPassword")}
                      className={signupForm.formState.errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => handleTabChange("login")}
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
