
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
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.status === 'active';
    } catch (error) {
      console.error("Error checking superadmin status:", error);
      return false;
    }
  };

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (staffError && staffError.code !== 'PGRST116') throw staffError;
      return !!staffData;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const handleUserSession = async (currentSession: Session | null) => {
    try {
      if (!currentSession?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return false;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      const superAdminStatus = await checkSuperAdminStatus(currentSession.user.id);
      if (superAdminStatus) {
        setIsSuperAdmin(true);
        setIsAdmin(true);
        return true;
      }

      const adminStatus = await checkAdminStatus(currentSession.user.id);
      setIsAdmin(adminStatus);
      return true;

    } catch (error) {
      console.error("Session handling error:", error);
      return false;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        const isAuthenticated = await handleUserSession(currentSession);

        if (!isAuthenticated) {
          navigate('/auth');
        } else if (isSuperAdmin) {
          navigate('/admin/stores');
        } else if (isAdmin) {
          navigate('/');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setIsLoading(false);
          navigate('/auth');
          return;
        }

        if (event === 'SIGNED_IN' && currentSession) {
          setIsLoading(true);
          const isAuthenticated = await handleUserSession(currentSession);
          setIsLoading(false);

          if (isAuthenticated) {
            if (isSuperAdmin) {
              navigate('/admin/stores');
            } else if (isAdmin) {
              navigate('/');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAdmin, isSuperAdmin]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      navigate('/auth');
      
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    isLoading,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
