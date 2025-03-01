
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth/auth.service";
import { supabase } from "@/lib/db/supabase";
import { toast } from "sonner";

export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
    isSuperAdmin: false,
  });
  const navigate = useNavigate();

  const handleUserSession = useCallback(async (currentSession: any | null) => {
    try {
      if (!currentSession?.user) {
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          isAdmin: false,
          isSuperAdmin: false,
          isLoading: false
        }));
        return false;
      }

      const { isAdmin, isSuperAdmin } = await authService.checkUserRole(currentSession.user.id);

      setState(prev => ({
        ...prev,
        user: currentSession.user,
        session: currentSession,
        isAdmin,
        isSuperAdmin,
        isLoading: false
      }));

      return true;
    } catch (error) {
      console.error("Session handling error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  // Inicialização e configuração dos listeners de autenticação
  useEffect(() => {
    const initialize = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Obter a sessão atual
        const currentSession = await authService.getCurrentSession();
        const isAuthenticated = await handleUserSession(currentSession);

        // Redirecionamento inicial baseado no estado de autenticação
        if (!isAuthenticated) {
          navigate('/auth');
        } else if (state.isSuperAdmin) {
          navigate('/admin/stores');
        } else if (state.isAdmin) {
          navigate('/');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        navigate('/auth');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initialize();

    // Configurar listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);

        if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            session: null,
            isAdmin: false,
            isSuperAdmin: false,
            isLoading: false
          }));
          navigate('/auth');
          return;
        }

        if (event === 'SIGNED_IN' && currentSession) {
          setState(prev => ({ ...prev, isLoading: true }));
          const isAuthenticated = await handleUserSession(currentSession);

          if (isAuthenticated) {
            if (state.isSuperAdmin) {
              navigate('/admin/stores');
            } else if (state.isAdmin) {
              navigate('/');
            }
          }
        }
      }
    );

    // Limpar subscription quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, [handleUserSession, navigate, state.isAdmin, state.isSuperAdmin]);

  // Função de login
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.signIn(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao fazer login");
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Função de logout
  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.signOut();
      
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        isAdmin: false,
        isSuperAdmin: false
      }));
      
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Falha ao fazer logout");
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    signIn,
    signOut
  };
}
