
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

const ADMIN_STATUS_KEY = 'admin_status';
const ADMIN_STATUS_TIMESTAMP = 'admin_status_timestamp';
const ADMIN_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get cached admin status
  const getCachedAdminStatus = () => {
    const cachedStatus = localStorage.getItem(ADMIN_STATUS_KEY);
    const timestamp = localStorage.getItem(ADMIN_STATUS_TIMESTAMP);
    
    if (!cachedStatus || !timestamp) return null;
    
    // Check if cache is still valid (within 5 minutes)
    const isValid = Date.now() - parseInt(timestamp) < ADMIN_CACHE_DURATION;
    if (!isValid) {
      localStorage.removeItem(ADMIN_STATUS_KEY);
      localStorage.removeItem(ADMIN_STATUS_TIMESTAMP);
      return null;
    }
    
    return cachedStatus === 'true';
  };

  // Cache admin status
  const cacheAdminStatus = (status: boolean) => {
    localStorage.setItem(ADMIN_STATUS_KEY, status.toString());
    localStorage.setItem(ADMIN_STATUS_TIMESTAMP, Date.now().toString());
  };

  const checkAdminStatus = async (userId: string) => {
    if (!userId) return false;

    // Check cache first
    const cachedStatus = getCachedAdminStatus();
    if (cachedStatus !== null) {
      return cachedStatus;
    }

    try {
      const { data: adminData, error } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      const isAdmin = adminData?.status === 'active';
      cacheAdminStatus(isAdmin);
      return isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check admin status
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (!mounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Only check admin status on sign in
        if (event === 'SIGNED_IN') {
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
          }
        }
      } else {
        // Clear state and cache on sign out
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem(ADMIN_STATUS_KEY);
        localStorage.removeItem(ADMIN_STATUS_TIMESTAMP);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state and cache
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem(ADMIN_STATUS_KEY);
      localStorage.removeItem(ADMIN_STATUS_TIMESTAMP);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
