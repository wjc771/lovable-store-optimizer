
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
    
    // Check by user email in system_admins table
    const { data: userEmail } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userEmail?.email) {
      const { data: systemAdmin, error: emailError } = await supabase
        .from('system_admins')
        .select('status')
        .eq('email', userEmail.email)
        .maybeSingle();
        
      if (!emailError && systemAdmin?.status === 'active') {
        console.log("AuthVerification: Usuário é superadmin (correspondência por email)");
        return true;
      }
    }
    
    // Final method: check if user ID directly matches an ID in system_admins
    const { data: directMatch, error: directError } = await supabase
      .from('system_admins')
      .select('status')
      .eq('id', userId)
      .single();

    if (!directError && directMatch?.status === 'active') {
      console.log("AuthVerification: Usuário é superadmin (correspondência direta de ID)");
      return true;
    }
    
    console.log("AuthVerification: Usuário não é superadmin");
    return false;
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
      .single();

    if (staffError && staffError.code !== 'PGRST116') throw staffError;
    const isAdmin = !!staffData;
    console.log("AuthVerification: Status de admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("AuthVerification: Erro ao verificar status de admin:", error);
    return false;
  }
};
