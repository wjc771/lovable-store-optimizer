
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

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
  error: Error | null;
}

// Create the authentication context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component for the authentication context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(error instanceof Error ? error : new Error('Unknown authentication error'));
      } finally {
        setLoading(false);
      }
    };

    // Execute the session check
    getSession();

    // Subscribe to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        
        // Provide feedback for auth events
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.info('Password recovery initiated');
        }
      }
    );

    // Clean up the subscription when the component is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to sign in
  const signIn = async (email: string, password: string) => {
    setError(null);
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
      setError(error instanceof Error ? error : new Error('Login failed'));
      throw error;
    }
  };

  // Function to sign out
  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error : new Error('Logout failed'));
      throw error;
    }
  };

  // Function for password reset
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error : new Error('Password reset failed'));
      throw error;
    }
  };

  // Function for sign up
  const signUp = async (email: string, password: string, fullName: string) => {
    setError(null);
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
      
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error : new Error('Signup failed'));
      throw error;
    }
  };

  // Function to check user status
  const checkUserStatus = async (email: string) => {
    setError(null);
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
      setError(error instanceof Error ? error : new Error('Failed to check user status'));
      return { exists: false, confirmed: false };
    }
  };

  // Explicitly define the value with a fixed type to avoid recursive type issues
  const contextValue: AuthContextType = {
    session,
    user,
    signIn,
    signOut,
    resetPassword,
    signUp,
    checkUserStatus,
    loading,
    error
  };

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
