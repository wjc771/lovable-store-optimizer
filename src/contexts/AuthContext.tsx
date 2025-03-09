
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  checkUserStatus: (email: string) => Promise<{ exists: boolean, confirmed: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          console.log("Found existing session:", currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign in: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Check if it's an unconfirmed email error
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, verifique seu email para confirmar seu cadastro ou entre em contato com o suporte.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de login",
            description: "Email ou senha incorretos. Por favor, tente novamente.",
            variant: "destructive",
          });
        }
        throw error;
      }
      
      console.log("Sign in successful:", data.user?.email);
      toast({
        title: "Login realizado",
        description: "Você entrou com sucesso!",
      });
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log(`Attempting to sign up: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Disable email confirmation for testing
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign up successful:", data.user?.email);
      
      // Check if email confirmation is needed
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "Usuário já existe",
          description: "Este email já está cadastrado. Por favor, faça login ou recupere sua senha.",
          variant: "destructive",
        });
      } else if (data.user && !data.session) {
        toast({
          title: "Cadastro realizado",
          description: "Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso! Agora você pode fazer login.",
        });
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  const checkUserStatus = async (email: string) => {
    try {
      // This is an admin-only API, will only work with service role key
      // For demonstration only - in production, you'd use a server function
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error("Error checking user status:", error);
        return { exists: false, confirmed: false };
      }
      
      // Fix the error by properly accessing users array and checking for undefined
      if (data && data.users) {
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
          return { exists: false, confirmed: false };
        }
        
        return { 
          exists: true, 
          confirmed: user.email_confirmed_at !== null 
        };
      }
      
      return { exists: false, confirmed: false };
    } catch (error) {
      console.error("Error checking user status:", error);
      return { exists: false, confirmed: false };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      // Clear session and user state after sign out
      setSession(null);
      setUser(null);
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, isLoading, checkUserStatus }}>
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
