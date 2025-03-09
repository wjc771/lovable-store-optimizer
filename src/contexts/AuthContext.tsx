import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define the types for the authentication context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  checkUserStatus: (email: string) => Promise<{exists: boolean, confirmed: boolean}>;
  loading: boolean;
}

// Create the authentication context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component for the authentication context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to check the current session and subscribe to authentication changes
  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Execute the session check
    getSession();

    // Subscribe to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up the subscription when the component is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Function for password reset
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Function for sign up
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Function to check user status
  const checkUserStatus = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      const exists = !!data;
      const confirmed = exists; // simplified, in a real system would need more checks
      
      return { exists, confirmed };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { exists: false, confirmed: false };
    }
  };

  // Create a non-recursive value object to avoid the infinite type instantiation
  const contextValue = {
    session,
    user,
    signIn,
    signOut,
    resetPassword,
    signUp,
    checkUserStatus,
    loading,
  } as const;

  // Render the provider with the value
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
