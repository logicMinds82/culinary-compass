"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/client";

// Define the shape of AuthContext
interface AuthContextType {
  user: User | null;
  profile?: { id: string; full_name: string } | null;
  loading: boolean;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ id: string; full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        
        setUser(currentUser);
        
        // Fetch user profile if user exists
        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', currentUser.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
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
