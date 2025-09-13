"use client";
import { useAuth } from "../components/AuthProvider";
import { useState, ChangeEvent, FormEvent } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [formData, setFormData] = useState<{ fullName: string; email: string; password: string }>({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-gray-800 text-red-600 rounded-lg shadow-lg">
      <div className="flex border-b border-gray-700 mb-4">
        <div className="flex w-full">
          <div
            className={`w-1/2 text-center py-2 cursor-pointer transition-all ${
              activeTab === "login" ? "border-b-2 border-text-red-600 text-red-600" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </div>
          <div
            className={`w-1/2 text-center py-2 cursor-pointer transition-all ${
              activeTab === "signup" ? "border-b-2 border-text-red-600 text-red-600" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </div>
        </div>
      </div>

      {activeTab === "login" ? (
        <form className="space-y-4">
          <div>
            <label className="block text-gray-300">Email</label>
            <input type="text" value="mail@example.com" readOnly className="w-full p-2 rounded bg-gray-700 text-gray-100" />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input type="password" value="test" readOnly className="w-full p-2 rounded bg-gray-700 text-gray-100" />
          </div>
          <button type="button" onClick={login} className="w-full bg-text-red-600 hover:bg-orange-600 p-2 rounded text-red-600 font-bold">
            Login
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>
          <button type="submit" className="w-full bg-text-red-600 hover:bg-orange-600 p-2 rounded text-red-600 font-bold">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
}
