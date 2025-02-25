
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

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

  const checkAdminStatus = async (userId: string) => {
    // Only check admin status if we have a user ID
    if (!userId) return false;

    try {
      const { data: adminData } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .single();
      
      return adminData?.status === 'active';
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Only check admin status on sign in
        if (event === 'SIGNED_IN') {
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          setIsAdmin(adminStatus);
        }
      } else {
        // Clear state on sign out
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, isLoading, isAdmin }}>
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
