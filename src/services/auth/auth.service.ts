
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  }

  async signUp(email: string, password: string, userData?: {full_name?: string}): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth?tab=reset`,
    });
    
    if (error) throw error;
  }

  async updatePassword(newPassword: string, accessToken?: string): Promise<void> {
    if (accessToken) {
      // Quando temos um token de acesso (caso de redefinição de senha)
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: "",
      });
      
      if (sessionError) throw sessionError;
    }
    
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) throw error;
  }

  async getCurrentSession(): Promise<any> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async checkUserRole(userId: string): Promise<{isAdmin: boolean; isSuperAdmin: boolean}> {
    try {
      // Verificar se é superadmin
      const superAdmin = await systemAdminsRepo.findOne({ id: userId });
      const isSuperAdmin = !!(superAdmin && superAdmin.status === 'active');
      
      if (isSuperAdmin) {
        return { isAdmin: true, isSuperAdmin: true };
      }
      
      // Verificar se é admin de loja (staff)
      const staff = await staffRepo.findOne({ user_id: userId });
      const isAdmin = !!staff;
      
      return { isAdmin, isSuperAdmin: false };
    } catch (error) {
      console.error("Error checking user roles:", error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  }
}

// Exportamos uma instância única do serviço
export const authService = new SupabaseAuthService();
