
import { supabase, SITE_URL } from "@/lib/db/supabase";
import { createRepository } from "../repository/factory";
import { Repository } from "../repository/base.repository";

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

type UserRole = 'admin' | 'staff' | 'user';

// Repositórios
const profilesRepo = createRepository<UserProfile>('profiles');
const systemAdminsRepo = createRepository<{id: string; status: string}>('system_admins');
const staffRepo = createRepository<{id: string; user_id: string; store_id: string; status: string}>('staff');

export interface AuthService {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, userData?: {full_name?: string}): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string, accessToken?: string): Promise<void>;
  getCurrentSession(): Promise<any>;
  checkUserRole(userId: string): Promise<{isAdmin: boolean; isSuperAdmin: boolean}>;
}

class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<void> {
    console.log('AuthService: Iniciando login para', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthService: Erro no login:', error);
      throw error;
    }
    console.log('AuthService: Login bem-sucedido');
  }

  async signUp(email: string, password: string, userData?: {full_name?: string}): Promise<void> {
    console.log('AuthService: Iniciando cadastro para', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      console.error('AuthService: Erro no cadastro:', error);
      throw error;
    }
    console.log('AuthService: Cadastro bem-sucedido');
  }

  async signOut(): Promise<void> {
    console.log('AuthService: Iniciando logout');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthService: Erro no logout:', error);
      throw error;
    }
    console.log('AuthService: Logout bem-sucedido');
  }

  async resetPassword(email: string): Promise<void> {
    console.log('AuthService: Iniciando redefinição de senha para', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth?tab=reset`,
    });
    
    if (error) {
      console.error('AuthService: Erro na redefinição:', error);
      throw error;
    }
    console.log('AuthService: Email de redefinição enviado');
  }

  async updatePassword(newPassword: string, accessToken?: string): Promise<void> {
    console.log('AuthService: Atualizando senha', accessToken ? 'com token' : 'sem token');
    if (accessToken) {
      // Quando temos um token de acesso (caso de redefinição de senha)
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: "",
      });
      
      if (sessionError) {
        console.error('AuthService: Erro ao definir sessão:', sessionError);
        throw sessionError;
      }
    }
    
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      console.error('AuthService: Erro ao atualizar senha:', error);
      throw error;
    }
    console.log('AuthService: Senha atualizada com sucesso');
  }

  async getCurrentSession(): Promise<any> {
    console.log('AuthService: Obtendo sessão atual');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('AuthService: Erro ao obter sessão:', error);
      throw error;
    }
    console.log('AuthService: Sessão obtida:', data.session ? 'Ativa' : 'Inativa');
    return data.session;
  }

  async checkUserRole(userId: string): Promise<{isAdmin: boolean; isSuperAdmin: boolean}> {
    console.log('AuthService: Verificando papel do usuário', userId);
    try {
      // Verificar se é superadmin
      const superAdmin = await systemAdminsRepo.findOne({ id: userId });
      const isSuperAdmin = !!(superAdmin && superAdmin.status === 'active');
      
      if (isSuperAdmin) {
        console.log('AuthService: Usuário é superadmin');
        return { isAdmin: true, isSuperAdmin: true };
      }
      
      // Verificar se é admin de loja (staff)
      const staff = await staffRepo.findOne({ user_id: userId });
      const isAdmin = !!staff;
      
      console.log('AuthService: Usuário é admin?', isAdmin);
      return { isAdmin, isSuperAdmin: false };
    } catch (error) {
      console.error('AuthService: Erro verificando papel:', error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  }
}

// Exportamos uma instância única do serviço
export const authService = new SupabaseAuthService();
