"use client";

import { useActionState, useState } from "react";
import { login, signup, type FormState } from "./actions";
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from "lucide-react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

const initialState: FormState = {
  message: "",
  type: undefined,
  fieldErrors: undefined
};

const getMessageStyling = (type?: FormState['type']) => {
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

const getMessageIcon = (type?: FormState['type']) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="w-5 h-5" />;
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'info':
      return <Info className="w-5 h-5" />;
    default:
      return null;
  }
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  errors?: string[];
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange?: (value: string) => void;
  value?: string;
}

const FormField = ({ 
  label, 
  name, 
  type, 
  placeholder, 
  required = false, 
  errors,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  onChange,
  value
}: FormFieldProps) => {
  const hasErrors = errors && errors.length > 0;
  
  return (
    <div>
      <label className="block text-gray-300 mb-1 font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
            hasErrors 
              ? "border-red-400 focus:border-red-400" 
              : "border-gray-600 focus:border-red-500"
          }`}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {hasErrors && (
        <div className="mt-1">
          {errors.map((error, index) => (
            <p key={index} className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [loginState, loginFormAction, loginPending] = useActionState(
    login,
    initialState
  );

  const [signupState, signupFormAction, signupPending] = useActionState(
    signup,
    initialState
  );

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
            onClick={() => setActiveTab("login")}
          >
            Login
          </div>
          <div
            className={`w-1/2 text-center py-3 cursor-pointer transition-all font-medium ${
              activeTab === "signup"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-300 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </div>
        </div>
      </div>

      {activeTab === "login" ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          {loginState.message && (
            <div className={getMessageStyling(loginState.type)}>
              {getMessageIcon(loginState.type)}
              <span>{loginState.message}</span>
            </div>
          )}
          
          <form className="space-y-5" action={loginFormAction}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              errors={loginState.fieldErrors?.email}
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              errors={loginState.fieldErrors?.password}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            
            <button
              type="submit"
              disabled={loginPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {loginPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setActiveTab("signup")}
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
          
          {signupState.message && (
            <div className={getMessageStyling(signupState.type)}>
              {getMessageIcon(signupState.type)}
              <span>{signupState.message}</span>
            </div>
          )}
          
          <form className="space-y-5" action={signupFormAction}>
            <FormField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              required
              errors={signupState.fieldErrors?.fullName}
            />
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              errors={signupState.fieldErrors?.email}
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              required
              errors={signupState.fieldErrors?.password}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              value={password}
              onChange={setPassword}
            />
            
            {password && <PasswordStrengthIndicator password={password} />}
            
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              errors={signupState.fieldErrors?.confirmPassword}
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            
            <button
              type="submit"
              disabled={signupPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {signupPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
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
