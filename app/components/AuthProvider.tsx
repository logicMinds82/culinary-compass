"use client";
import { createContext, useContext, ReactNode } from "react";
import { User } from "@supabase/supabase-js";

// Define the shape of AuthContext
interface AuthContextType {
  user: User | null;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialUser,
}) => {
  return (
    <AuthContext.Provider value={{ user: initialUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
