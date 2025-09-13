"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Define the shape of the user
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of AuthContext
interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetch user data from API
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("User not authenticated");
      const data: User = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on component mount
  }, []);

  const login = async () => {
    Cookies.remove("isLoggedOut"); // Clear logout state
    await fetchUser(); // Refresh user state
    router.push("/");
  };

  const logout = async () => {
    Cookies.set("isLoggedOut", "true", { expires: 7 });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
