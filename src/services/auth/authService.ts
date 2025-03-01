
import { supabase } from "@/lib/supabase";

/**
 * Handles authentication operations with Supabase
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    console.log("AuthService: Tentando login para", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("AuthService: Erro no login:", error);
      throw error;
    }
    
    console.log("AuthService: Login bem-sucedido");
    return data;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    console.log("AuthService: Iniciando logout");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("AuthService: Erro no logout:", error);
      throw error;
    }
    
    console.log("AuthService: Logout bem-sucedido");
  },

  /**
   * Get the current session
   */
  getCurrentSession: async () => {
    console.log("AuthService: Obtendo sessão atual");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("AuthService: Erro ao obter sessão:", error);
      throw error;
    }
    
    console.log("AuthService: Sessão obtida:", data.session ? "Ativa" : "Inativa");
    return data.session;
  }
};
