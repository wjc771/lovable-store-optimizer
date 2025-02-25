
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simplified admin check
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.status === 'active';
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast.error("Authentication error. Please try logging in again.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (event === 'SIGNED_IN') {
            const adminStatus = await checkAdminStatus(currentSession.user.id);
            setIsAdmin(adminStatus);
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all auth state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signIn, 
      signOut, 
      isLoading, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
