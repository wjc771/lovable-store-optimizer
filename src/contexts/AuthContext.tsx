
import React, { createContext, useContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUserSession } from "@/hooks/useUserSession";

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
  const {
    user,
    session,
    isAdmin,
    isSuperAdmin,
    handleUserSession,
    setSession,
    setUser,
    setIsAdmin,
    setIsSuperAdmin
  } = useUserSession();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  console.log("AuthContext: Inicializando provider");

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("AuthContext: Inicializando e verificando sessão");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("AuthContext: Sessão obtida:", currentSession ? "Presente" : "Ausente");
        
        if (!currentSession) {
          console.log("AuthContext: Sem sessão ativa");
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Verificação simplificada para super admin
        if (currentSession.user?.email === 'jotafieldsfirst@gmail.com') {
          console.log("AuthContext: jotafieldsfirst@gmail.com identificado, definindo como superadmin");
          setSession(currentSession);
          setUser(currentSession.user);
          setIsSuperAdmin(true);
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }
        
        // Para outros usuários, verificação normal
        await handleUserSession(currentSession);
        setIsLoading(false);
      } catch (error) {
        console.error("AuthContext: Erro na inicialização da autenticação:", error);
        setIsLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("AuthContext: Estado de autenticação alterado:", event);

        if (event === 'SIGNED_OUT') {
          console.log("AuthContext: Usuário desconectado");
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          navigate('/auth');
          return;
        }

        if (event === 'SIGNED_IN' && currentSession) {
          console.log("AuthContext: Usuário conectado:", currentSession.user?.email);
          setIsLoading(true);
          
          // Verificação simplificada para super admin
          if (currentSession.user?.email === 'jotafieldsfirst@gmail.com') {
            console.log("AuthContext: jotafieldsfirst@gmail.com identificado, definindo como superadmin");
            setSession(currentSession);
            setUser(currentSession.user);
            setIsSuperAdmin(true);
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
          
          // Para outros usuários, verificação normal
          await handleUserSession(currentSession);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, handleUserSession, setSession, setUser, setIsAdmin, setIsSuperAdmin]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Tentando login para", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log("AuthContext: Login bem-sucedido");

    } catch (error) {
      console.error("AuthContext: Erro de login:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Iniciando logout");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      navigate('/auth');
      console.log("AuthContext: Logout bem-sucedido");
      
    } catch (error) {
      console.error("AuthContext: Erro de logout:", error);
      toast.error("Failed to sign out");
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
