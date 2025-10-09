"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "../schemas/authSchema";
import { PasswordStrengthIndicator } from "../components/login/PasswordStrengthIndicator";
import type { AuthApiResponse } from "../api/auth/types";

type MessageType = 'error' | 'success' | 'info';

interface FormMessage {
  message: string;
  type?: MessageType;
}

const getMessageStyling = (type?: MessageType) => {
  switch (type) {
    case 'error':
      return "mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2";
    case 'success':
      return "mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2";
    case 'info':
      return "mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center gap-2";
    default:
      return "mb-4 p-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg flex items-center gap-2";
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
    }
    finally {
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
    }
    finally {
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
    <div className="max-w-md mx-auto mt-10 mb-10 p-8 bg-gray-800 text-red-600 rounded-xl shadow-2xl">
      <div className="flex border-b border-gray-700 mb-6">
        <div className="flex w-full">
          <div
            className={`w-1/2 text-center py-3 cursor-pointer transition-all font-medium ${
              activeTab === "login"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-300 hover:text-gray-200"
            }`}
            onClick={() => handleTabChange("login")}
          >
            Login
          </div>
          <div
            className={`w-1/2 text-center py-3 cursor-pointer transition-all font-medium ${
              activeTab === "signup"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-300 hover:text-gray-200"
            }`}
            onClick={() => handleTabChange("signup")}
          >
            Sign Up
          </div>
        </div>
      </div>

            {activeTab === "login" ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          {message.message && (
            <div className={getMessageStyling(message.type)}>
              {getMessageIcon(message.type)}
              <span>{message.message}</span>
            </div>
          )}
          
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Email Address
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...loginForm.register("email")}
                className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  loginForm.formState.errors.email
                    ? "border-red-400 focus:border-red-400" 
                    : "border-gray-600 focus:border-red-500"
                }`}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Password
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...loginForm.register("password")}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    loginForm.formState.errors.password
                      ? "border-red-400 focus:border-red-400" 
                      : "border-gray-600 focus:border-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => handleTabChange("signup")}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
          
          {message.message && (
            <div className={getMessageStyling(message.type)}>
              {getMessageIcon(message.type)}
              <span>{message.message}</span>
            </div>
          )}
          
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Full Name
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...signupForm.register("fullName")}
                className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  signupForm.formState.errors.fullName
                    ? "border-red-400 focus:border-red-400" 
                    : "border-gray-600 focus:border-red-500"
                }`}
              />
              {signupForm.formState.errors.fullName && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.fullName.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Email Address
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...signupForm.register("email")}
                className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  signupForm.formState.errors.email
                    ? "border-red-400 focus:border-red-400" 
                    : "border-gray-600 focus:border-red-500"
                }`}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Password
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...signupForm.register("password")}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    signupForm.formState.errors.password
                      ? "border-red-400 focus:border-red-400" 
                      : "border-gray-600 focus:border-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            {watchedPassword && <PasswordStrengthIndicator password={watchedPassword} />}
            
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Confirm Password
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...signupForm.register("confirmPassword")}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    signupForm.formState.errors.confirmPassword
                      ? "border-red-400 focus:border-red-400" 
                      : "border-gray-600 focus:border-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => handleTabChange("login")}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
