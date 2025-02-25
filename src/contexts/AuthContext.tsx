import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const [initializationTimeout, setInitializationTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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

  const setLoadingSafetyTimeout = () => {
    if (initializationTimeout) {
      clearTimeout(initializationTimeout);
    }
    const timeout = setTimeout(() => {
      console.warn("Auth initialization timeout reached");
      setIsLoading(false);
    }, 5000); // 5 second timeout
    setInitializationTimeout(timeout);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoadingSafetyTimeout();
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          navigate('/auth');
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
        
        const adminStatus = await checkAdminStatus(currentSession.user.id);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/auth');
      } finally {
        setIsLoading(false);
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setIsLoading(true);
        setLoadingSafetyTimeout();

        try {
          if (event === 'SIGNED_OUT' || !currentSession?.user) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            navigate('/auth');
            return;
          }

          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
            
            if (event === 'SIGNED_IN') {
              const adminStatus = await checkAdminStatus(currentSession.user.id);
              setIsAdmin(adminStatus);
              navigate('/');
            }
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          toast.error("Authentication error occurred");
          navigate('/auth');
        } finally {
          setIsLoading(false);
          if (initializationTimeout) {
            clearTimeout(initializationTimeout);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoadingSafetyTimeout();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      navigate('/');
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setLoadingSafetyTimeout();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all auth state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast.success("Successfully signed out");
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
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
