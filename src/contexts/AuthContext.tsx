
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

  console.log("AuthContext: Inicializando provider");

  const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log("AuthContext: Verificando status de superadmin para", userId);
      const { data, error } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .single();

      if (error) throw error;
      const isSuperAdmin = data?.status === 'active';
      console.log("AuthContext: Status de superadmin:", isSuperAdmin);
      return isSuperAdmin;
    } catch (error) {
      console.error("AuthContext: Erro ao verificar status de superadmin:", error);
      return false;
    }
  };

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log("AuthContext: Verificando status de admin para", userId);
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (staffError && staffError.code !== 'PGRST116') throw staffError;
      const isAdmin = !!staffData;
      console.log("AuthContext: Status de admin:", isAdmin);
      return isAdmin;
    } catch (error) {
      console.error("AuthContext: Erro ao verificar status de admin:", error);
      return false;
    }
  };

  const handleUserSession = async (currentSession: Session | null) => {
    try {
      console.log("AuthContext: Processando sessão de usuário", currentSession?.user?.email);
      if (!currentSession?.user) {
        console.log("AuthContext: Nenhuma sessão ou usuário encontrado");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return false;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      console.log("AuthContext: Verificando papéis do usuário");
      const superAdminStatus = await checkSuperAdminStatus(currentSession.user.id);
      if (superAdminStatus) {
        console.log("AuthContext: Usuário é superadmin");
        setIsSuperAdmin(true);
        setIsAdmin(true);
        return true;
      }

      const adminStatus = await checkAdminStatus(currentSession.user.id);
      console.log("AuthContext: Usuário é admin?", adminStatus);
      setIsAdmin(adminStatus);
      return true;

    } catch (error) {
      console.error("AuthContext: Erro no processamento da sessão:", error);
      return false;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("AuthContext: Inicializando e verificando sessão");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("AuthContext: Sessão obtida:", currentSession ? "Presente" : "Ausente");
        
        const isAuthenticated = await handleUserSession(currentSession);

        if (!isAuthenticated) {
          console.log("AuthContext: Usuário não autenticado, redirecionando para /auth");
          navigate('/auth');
        } else if (isSuperAdmin) {
          console.log("AuthContext: Superadmin autenticado, redirecionando para /admin/stores");
          navigate('/admin/stores');
        } else if (isAdmin) {
          console.log("AuthContext: Admin autenticado, redirecionando para /");
          navigate('/');
        }
      } catch (error) {
        console.error("AuthContext: Erro na inicialização da autenticação:", error);
        navigate('/auth');
      } finally {
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
          setIsLoading(false);
          navigate('/auth');
          return;
        }

        if (event === 'SIGNED_IN' && currentSession) {
          console.log("AuthContext: Usuário conectado:", currentSession.user?.email);
          setIsLoading(true);
          const isAuthenticated = await handleUserSession(currentSession);
          setIsLoading(false);

          if (isAuthenticated) {
            if (isSuperAdmin) {
              console.log("AuthContext: Superadmin conectado, redirecionando para /admin/stores");
              navigate('/admin/stores');
            } else if (isAdmin) {
              console.log("AuthContext: Admin conectado, redirecionando para /");
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
