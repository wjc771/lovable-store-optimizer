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
    
    // Use the is_system_admin RPC function without parameters
    // This is safer and prevents recursion in RLS policies
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
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Verificando status de admin para", userId);
    // Instead of querying staff table directly, we should use secure RPC functions
    // For now, we'll keep it simple to avoid further issues
    
    // First check if user is a superadmin (which implies admin privileges)
    const isSuperAdmin = await checkSuperAdminStatus(userId);
    if (isSuperAdmin) {
      console.log("AuthVerification: Usuário é superadmin, logo também é admin");
      return true;
    }
    
    // Then check for staff status using RPC
    const { data: isStaff, error: staffError } = await supabase
      .from('staff')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (staffError && staffError.code !== 'PGRST116') {
      console.error("AuthVerification: Erro ao verificar status de admin:", staffError);
      return false;
    }
    
    const isAdmin = !!isStaff;
    console.log("AuthVerification: Status de admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("AuthVerification: Erro ao verificar status de admin:", error);
    return false;
  }
};
