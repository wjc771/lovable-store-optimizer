
import { supabase } from "@/lib/supabase";

/**
 * Verifies if a user is a superadmin by checking multiple criteria
 */
export const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Verificando status de superadmin para", userId);
    
    // Special verification for jotafieldsfirst@gmail.com (highest priority)
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email === 'jotafieldsfirst@gmail.com') {
      console.log("AuthVerification: jotafieldsfirst@gmail.com é superadmin por verificação direta de email");
      return true;
    }
    
    // Use the is_system_admin RPC function which uses SECURITY DEFINER
    // This completely avoids the RLS recursion issue
    const { data, error } = await supabase.rpc('is_system_admin');
    
    if (error) {
      console.error("AuthVerification: Erro ao verificar status de superadmin com RPC:", error);
      return false;
    }
    
    console.log("AuthVerification: Status de superadmin via RPC:", data);
    return !!data;
  } catch (error) {
    console.error("AuthVerification: Erro ao verificar status de superadmin:", error);
    return false;
  }
};

/**
 * Verifies if a user is an admin by checking staff table
 * Uses the is_staff_member RPC function to completely avoid RLS recursion
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Verificando status de admin para", userId);
    
    // First check if user is a superadmin (which implies admin privileges)
    const isSuperAdmin = await checkSuperAdminStatus(userId);
    if (isSuperAdmin) {
      console.log("AuthVerification: Usuário é superadmin, logo também é admin");
      return true;
    }
    
    // Use our RPC function to check staff status
    // This completely avoids the RLS recursion issue by using SECURITY DEFINER
    const { data: isStaffMember, error: staffError } = await supabase.rpc('is_staff_member');
    
    if (staffError) {
      console.error("AuthVerification: Erro ao verificar status de staff:", staffError);
      return false;
    }
    
    console.log("AuthVerification: Usuário é staff member?", isStaffMember);
    return !!isStaffMember;
  } catch (error) {
    console.error("AuthVerification: Erro ao verificar status de admin:", error);
    return false;
  }
};
