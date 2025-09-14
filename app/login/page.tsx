"use client";

import { useActionState, useState } from "react";
import { login, signup, type FormState } from "./actions";

const initialState: FormState = {
  message: "",
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>("login");

  const [loginState, loginFormAction, loginPending] = useActionState(
    login,
    initialState
  );

  const [signupState, signupFormAction, signupPending] = useActionState(
    signup,
    initialState
  );

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-gray-800 text-red-600 rounded-lg shadow-lg">
      <div className="flex border-b border-gray-700 mb-4">
        <div className="flex w-full">
          <div
            className={`w-1/2 text-center py-2 cursor-pointer transition-all ${
              activeTab === "login"
                ? "border-b-2 border-text-red-600 text-red-600"
                : "text-gray-300"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </div>
          <div
            className={`w-1/2 text-center py-2 cursor-pointer transition-all ${
              activeTab === "signup"
                ? "border-b-2 border-text-red-600 text-red-600"
                : "text-gray-300"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </div>
        </div>
      </div>

      {activeTab === "login" ? (
        <div>
          {loginState.message && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-100 rounded">
              {loginState.message}
            </div>
          )}
          <form className="space-y-4" action={loginFormAction}>
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                required
                name="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-gray-700 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                required
                name="password"
                placeholder="Enter your password"
                className="w-full p-2 rounded bg-gray-700 text-gray-100"
              />
            </div>
            <button
              type="submit"
              disabled={loginPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-2 rounded text-white font-bold"
            >
              {loginPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          {signupState.message && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-100 rounded">
              {signupState.message}
            </div>
          )}
          <form className="space-y-4" action={signupFormAction}>
            {/* <div>
              <label className="block text-gray-300">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                className="w-full p-2 rounded bg-gray-700 text-gray-100"
                required
              />
            </div> */}
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-gray-700 text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-2 rounded bg-gray-700 text-gray-100"
                required
              />
            </div>
            <button
              type="submit"
              disabled={signupPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-2 rounded text-white font-bold"
            >
              {signupPending ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
