
import { supabase } from "@/lib/supabase";

/**
 * Verifies if a user is a superadmin by checking multiple criteria
 */
export const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Verificando status de superadmin para", userId);
    
    // Special verification for jotafieldsfirst@gmail.com (highest priority)
    const { data: userData } = await supabase.auth.getUser(userId);
    if (userData?.user?.email === 'jotafieldsfirst@gmail.com') {
      console.log("AuthVerification: jotafieldsfirst@gmail.com é superadmin por verificação direta de email");
      return true;
    }
    
    // Use the is_system_admin security definer function to check status
    const { data, error } = await supabase.rpc('is_system_admin', { user_id: userId });
    
    if (error) {
      console.error("AuthVerification: Erro ao verificar status de superadmin com RPC:", error);
      
      // Fallback: check if user is in system_admins with active status
      // We check both by user ID and by email to be thorough
      const { data: userEmail } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      if (userEmail?.email) {
        const { data: systemAdmin } = await supabase
          .from('system_admins')
          .select('status')
          .eq('email', userEmail.email)
          .maybeSingle();
          
        if (systemAdmin?.status === 'active') {
          console.log("AuthVerification: Usuário é superadmin (correspondência por email)");
          return true;
        }
      }
      
      // Check by direct ID match
      const { data: directMatch } = await supabase
        .from('system_admins')
        .select('status')
        .eq('id', userId)
        .maybeSingle();

      if (directMatch?.status === 'active') {
        console.log("AuthVerification: Usuário é superadmin (correspondência direta de ID)");
        return true;
      }
      
      console.log("AuthVerification: Usuário não é superadmin (via fallback)");
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
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (staffError && staffError.code !== 'PGRST116') throw staffError;
    const isAdmin = !!staffData;
    console.log("AuthContext: Status de admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("AuthVerification: Erro ao verificar status de admin:", error);
    return false;
  }
};
